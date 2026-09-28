# Service-area map

The website currently embeds Google's Seattle city map. This temporary map
does not use a personal Google account. It does not highlight the full intended
Everett–Federal Way service area.

`dr-service-area.kml` is ready for a future business-owned Google My Maps map.
It contains one continuous shaded corridor. It is not published on the site.

Source: [WSDOT City Limits](https://data.wsdot.wa.gov/arcgis/rest/services/Shared/PoliAdminBndryData/FeatureServer/1). The saved `wsdot-cities.geojson` is the source snapshot. `build_kml.py` joins nearby city limits into the continuous display shape; this shape is a visual guide, not a legal service boundary. Rebuild with Shapely installed:

```sh
python3 build_kml.py wsdot-cities.geojson dr-service-area.kml
```

The 27 included cities are Bellevue, Bothell, Brier, Burien, Des Moines,
Edmonds, Everett, Federal Way, Issaquah, Kenmore, Kent, Kirkland, Lake Forest
Park, Lynnwood, Mercer Island, Mill Creek, Mountlake Terrace, Mukilteo,
Newcastle, Redmond, Renton, Sammamish, SeaTac, Seattle, Shoreline, Tukwila,
and Woodinville. They form the Everett–Federal Way corridor and Eastside.

WSDOT tracks incorporated cities. The visual corridor does not mark the site's
listed Cottage Lake, East Hill-Meridian, Machias, Maltby, or Skyway. It omits
Auburn, Lake Stevens, and Snohomish because they extend beyond the requested
Everett–Federal Way corridor. The approved city list remains unchanged.
