"""Build one continuous Google My Maps placemark from municipal boundaries.

Inputs: A GeoJSON FeatureCollection from the WSDOT City Limits layer, queried
        for the municipalities named in README.md; output path for the KML.
Output: One shaded mainland polygon with nearby city gaps filled. Raises on
        missing cities or invalid geometry.
Examples: python3 build_kml.py cities.geojson service-area.kml
"""

import json
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

from shapely.geometry import Polygon, shape
from shapely.ops import unary_union


CITY_NAMES = frozenset({
    "Bellevue", "Bothell", "Brier", "Burien", "Des Moines", "Edmonds",
    "Everett", "Federal Way", "Issaquah", "Kenmore", "Kent", "Kirkland",
    "Lake Forest Park", "Lynnwood", "Mercer Island", "Mill Creek",
    "Mountlake Terrace", "Mukilteo", "Newcastle", "Redmond", "Renton",
    "Sammamish", "SeaTac", "Seattle", "Shoreline", "Tukwila",
    "Woodinville",
})


def add_ring(parent: ET.Element, kind: str, points: list[tuple[float, float]]) -> None:
    """Write a closed KML ring without changing its official coordinates.

    Inputs: Parent polygon, KML boundary kind, and WGS84 longitude/latitude pairs.
    Output: Appends a LinearRing; returns None. Empty rings are invalid input.
    Examples: add_ring(polygon, "outerBoundaryIs", [(0, 0), (1, 0), (0, 0)])
    """
    boundary = ET.SubElement(parent, kind)
    ring = ET.SubElement(boundary, "LinearRing")
    ET.SubElement(ring, "coordinates").text = " ".join(
        f"{longitude:.7f},{latitude:.7f},0" for longitude, latitude in points
    )


def add_polygon(parent: ET.Element, polygon: Polygon) -> None:
    """Write one municipal polygon, including any holes, as KML.

    Inputs: A KML parent and a valid WGS84 polygon from the WSDOT union.
    Output: Appends a Polygon; returns None. Invalid polygons are rejected upstream.
    Examples: add_polygon(multi_geometry, Polygon([(0, 0), (1, 0), (0, 1)]))
    """
    element = ET.SubElement(parent, "Polygon")
    add_ring(element, "outerBoundaryIs", list(polygon.exterior.coords))
    for interior in polygon.interiors:
        add_ring(element, "innerBoundaryIs", list(interior.coords))


def main(source_path: Path, output_path: Path) -> None:
    """Join selected city limits into one map feature.

    Inputs: A WSDOT GeoJSON file in WGS84 and the destination KML path.
    Output: Writes a Google My Maps-ready KML. Raises for incomplete source data.
    Examples: main(Path("cities.geojson"), Path("service-area.kml"))
    """
    source = json.loads(source_path.read_text())
    features = source["features"]
    found = {feature["properties"]["CityName"] for feature in features}
    if found != CITY_NAMES:
        raise ValueError(f"City set differs: missing={CITY_NAMES - found}, extra={found - CITY_NAMES}")

    coverage = unary_union([shape(feature["geometry"]) for feature in features])
    # Close gaps between nearby municipalities. Keep the mainland corridor as
    # one blob; detached islands would create separate highlighted pieces.
    closed = coverage.buffer(0.04).buffer(-0.04)
    mainland = max(closed.geoms, key=lambda polygon: polygon.area)
    if not mainland.is_valid:
        raise ValueError("WSDOT polygons did not produce a valid union")

    kml = ET.Element("kml", xmlns="http://www.opengis.net/kml/2.2")
    document = ET.SubElement(kml, "Document")
    ET.SubElement(document, "name").text = "Dr Plumbing service area"
    style = ET.SubElement(document, "Style", id="service-area")
    line = ET.SubElement(style, "LineStyle")
    ET.SubElement(line, "color").text = "ff2b5ab5"
    ET.SubElement(line, "width").text = "2"
    fill = ET.SubElement(style, "PolyStyle")
    ET.SubElement(fill, "color").text = "552b5ab5"
    placemark = ET.SubElement(document, "Placemark")
    ET.SubElement(placemark, "name").text = "Everett to Federal Way service area"
    ET.SubElement(placemark, "styleUrl").text = "#service-area"
    add_polygon(placemark, mainland)

    ET.indent(kml, space="  ")
    output_path.write_bytes(ET.tostring(kml, encoding="utf-8", xml_declaration=True))
    print(f"Wrote {output_path}: {len(features)} cities, one polygon")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
