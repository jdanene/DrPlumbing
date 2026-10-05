/**
 * Selected job photographs for the local website review.
 * Classification lives in design/photo-classification/catalog.json.
 * Ranked alternatives live in best-selection.json; website choices also include user-selected work photos.
 * Use confirmed subjects only; an empty category has no substitute photograph.
 */
export interface ProjectPhotoData {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  frameRatio?: string;
}

const ROOT = "/service-photos/selected/by-service";
export const PHOTOS = {
  bathroom: {
    src: `${ROOT}/general-plumbing/showers-and-tubs/best/184_IMG_9192.jpg`,
    alt: "Bathroom with tub, shower, toilet and basin", width: 1200, height: 1600, position: "50% 65%",
  },
  shower: {
    src: `${ROOT}/general-plumbing/showers-and-tubs/best/188_IMG_9196.jpg`,
    alt: "Finished bathtub and shower fittings", width: 1200, height: 1600,
  },
  basin: {
    src: `${ROOT}/general-plumbing/faucets-fixtures-and-sinks/best/014_IMG_0653.jpg`,
    alt: "Undermount basin and chrome faucet in a black stone vanity", width: 1200, height: 1600, position: "65% 65%",
  },
  toilet: {
    src: `${ROOT}/general-plumbing/toilet-repair-and-installation/best/189_IMG_9197.jpg`,
    alt: "Toilet with a bidet attachment beside a finished bathtub", width: 1600, height: 1200, position: "65% 60%",
  },
  gasMeter: {
    src: `${ROOT}/general-plumbing/gas-line-repair-and-installation/best/088_IMG_3550.jpg`,
    alt: "Outdoor gas meter, shutoff valves and connected gas pipes", width: 1200, height: 1600,
  },
  manifold: {
    src: `${ROOT}/general-plumbing/piping-and-repiping/best/061_IMG_2918.jpg`,
    alt: "Copper water-supply distribution manifold", width: 1200, height: 1600,
  },
  waterLine: {
    src: `${ROOT}/general-plumbing/piping-and-repiping/best/044_IMG_1446.jpg`,
    alt: "Blue water-supply pipe in an outdoor trench", width: 1200, height: 1600,
  },
  drillingRig: {
    src: `${ROOT}/general-plumbing/system-overview/096_IMG_3652 3.jpg`,
    alt: "Directional drilling rig beside a driveway excavation", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  roughIn: {
    src: `${ROOT}/general-plumbing/piping-and-repiping/best/127_IMG_4388.jpg`,
    alt: "Red and blue supply pipes with black drain pipes in wall framing", width: 1600, height: 1200,
  },
  tank: {
    src: `${ROOT}/water-heaters/electric-water-heaters/best/095_IMG_3652.jpg`,
    alt: "Rheem electric tank water heater with an expansion tank", width: 1200, height: 1600,
  },
  tankless: {
    src: `${ROOT}/water-heaters/tankless-water-heaters/best/132_IMG_5541.jpg`,
    alt: "Rinnai gas tankless water heater with venting and connected pipework", width: 1379, height: 1600,
  },
  twinNavien: {
    src: `${ROOT}/water-heaters/system-overview/081_IMG_3366.jpg`,
    alt: "Two Navien tankless water heaters with copper pipework on a blue mounting panel", width: 1600, height: 1433, frameRatio: "1600 / 1433",
  },
  sewer: {
    src: `${ROOT}/drain-and-sewer/sewer-line-repair-and-replacement/best/056_IMG_1881.jpg`,
    alt: "Green sewer pipe and coupling exposed in an outdoor trench", width: 1200, height: 1600,
  },
  filters: {
    src: `${ROOT}/water-filtration/uv-treatment/best/013_IMG_0552.jpg`,
    alt: "Whole-house filter cartridges and UV treatment connected with copper pipes", width: 1600, height: 1200,
  },
  softener: {
    src: `${ROOT}/water-filtration/water-softeners/best/028_IMG_0890.jpg`,
    alt: "Water softener, filter cartridges and UV treatment on a wall-mounted installation", width: 1600, height: 1200,
  },
  unitHeater: {
    src: `${ROOT}/heating-and-cooling/heating/best/149_IMG_7290.jpg`,
    alt: "Piped unit heater inside a protective cage", width: 1600, height: 1200,
  },
  radiator: {
    src: `${ROOT}/boilers/hydronic-heating/best/086_IMG_3535.jpg`,
    alt: "Sectional hydronic radiator with valves and pipe connections", width: 1600, height: 1200,
  },
  boiler: {
    src: `${ROOT}/boilers/hydronic-heating/best/063_IMG_2970.jpg`,
    alt: "Hydronic heating plant with connected appliances, circulation pumps and pipework", width: 1600, height: 1546,
  },
  floorStandingBoiler: {
    src: `${ROOT}/boilers/hydronic-heating/084_IMG_3526.jpg`,
    alt: "Hydronic heating system with a Weil-McLain boiler, copper pipework and an expansion vessel", width: 1200, height: 1600,
  },
  circulators: {
    src: `${ROOT}/boilers/hydronic-heating/best/009_IMG_0428.jpg`,
    alt: "Three hydronic circulation pumps with insulated headers and blue pipe branches", width: 1200, height: 1600,
  },
  technician: {
    src: `${ROOT}/about/on-the-job/best/105_IMG_3750.jpg`,
    alt: "Mehran using a RIDGID press tool on copper heating pipework", width: 1600, height: 1200, position: "22% 45%",
  },
  technicianFiltration: {
    src: `${ROOT}/about/on-the-job/best/033_IMG_1113.jpg`,
    alt: "Technician standing beside a water-treatment installation", width: 1600, height: 1200, position: "20% 50%",
  },
  welding: {
    src: `${ROOT}/about/on-the-job/023_IMG_0789.jpg`,
    alt: "Technician welding beside a pump assembly", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  boilerWork: {
    src: `${ROOT}/boilers/hydronic-heating/080_IMG_3354.jpg`,
    alt: "Technician working on pipework beneath a wall-mounted HTP heating appliance", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  pipeAlignment: {
    src: `${ROOT}/boilers/hydronic-heating/099_IMG_3738.jpg`,
    alt: "Technician checking copper heating-pipe alignment with a level", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  solderingHeatingPipe: {
    src: `${ROOT}/boilers/hydronic-heating/098_IMG_3724.jpg`,
    alt: "Technician soldering a copper joint on hydronic heating pipework", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
} satisfies Record<string, ProjectPhotoData>;

export const SERVICE_PHOTOS: Record<string, ProjectPhotoData> = {
  plumbing: PHOTOS.bathroom,
  "water-heaters": PHOTOS.twinNavien,
  "drain-sewer": PHOTOS.sewer,
  "water-filtration": PHOTOS.filters,
  "heating-cooling": PHOTOS.unitHeater,
  boilers: PHOTOS.floorStandingBoiler,
};

export const DETAIL_PHOTOS: Partial<Record<string, ProjectPhotoData>> = {
  "plumbing/piping-and-repiping": PHOTOS.manifold,
  "plumbing/trenchless-water-line-repair": PHOTOS.drillingRig,
  "plumbing/faucets-fixtures-and-sinks": PHOTOS.basin,
  "plumbing/gas-line-repair-and-installation": PHOTOS.gasMeter,
  "plumbing/showers-and-tubs": PHOTOS.shower,
  "plumbing/toilet-repair-and-installation": PHOTOS.toilet,
  "plumbing/water-filtration-systems": PHOTOS.softener,
  "water-heaters/electric-water-heaters": PHOTOS.tank,
  "water-heaters/gas-water-heaters": PHOTOS.tankless,
  "water-heaters/tankless-water-heaters": PHOTOS.tankless,
  "drain-sewer/sewer-line-repair-and-replacement": PHOTOS.sewer,
  "water-filtration/water-softeners": PHOTOS.softener,
  "water-filtration/uv-treatment": PHOTOS.filters,
  "heating-cooling/heating": PHOTOS.unitHeater,
  "boilers/radiators-baseboards-or-radiant-flooring": PHOTOS.radiator,
  "boilers/circulation": PHOTOS.circulators,
};

interface WorkProject {
  service: string;
  category: string;
  title: string;
  description: string;
  photo: ProjectPhotoData;
}

/** Lead with people working, then show finished installations across residential services. */
export const HOME_PROJECTS: WorkProject[] = [
  { service: "boilers", category: "Boilers", title: "Heating pipework in progress", description: "Soldering a copper joint on hydronic heating pipework.", photo: PHOTOS.solderingHeatingPipe },
  { service: "boilers", category: "Boilers", title: "Working on a hydronic heating system", description: "Working on pipework beneath a wall-mounted HTP heating appliance.", photo: PHOTOS.boilerWork },
  { service: "water-heaters", category: "Water heaters", title: "Tankless water heating", description: "Two Navien tankless heaters with copper pipework on a blue mounting panel.", photo: PHOTOS.twinNavien },
  { service: "plumbing", category: "Plumbing", title: "Bathroom plumbing", description: "A finished bathroom with a tub, shower, basin and toilet.", photo: PHOTOS.bathroom },
  { service: "water-filtration", category: "Water filtration", title: "Whole-house water filtration", description: "Filter cartridges and UV treatment connected to the home's water supply.", photo: PHOTOS.filters },
  { service: "drain-sewer", category: "Drain & sewer", title: "Sewer pipe repair", description: "A new pipe section and coupling in an exposed sewer line.", photo: PHOTOS.sewer },
];

export const WORK_PROJECTS: WorkProject[] = [
  ...HOME_PROJECTS,
  { service: "water-heaters", category: "Water heaters", title: "Tank water heating", description: "A Rheem water heater with an expansion tank and connected supply lines.", photo: PHOTOS.tank },
  { service: "water-heaters", category: "Water heaters", title: "Rinnai tankless installation", description: "A Rinnai gas tankless heater with venting and connected pipework.", photo: PHOTOS.tankless },
  { service: "plumbing", category: "Plumbing", title: "Vanity and faucet installation", description: "An undermount basin and chrome faucet set into a black stone vanity.", photo: PHOTOS.basin },
  { service: "plumbing", category: "Plumbing", title: "Underground drilling equipment", description: "A directional drilling rig positioned beside a driveway excavation.", photo: PHOTOS.drillingRig },
  { service: "boilers", category: "Boilers", title: "Boiler and heating pipework", description: "A hydronic heating plant with circulation pumps and connected pipework.", photo: PHOTOS.boiler },
  { service: "boilers", category: "Boilers", title: "Radiator heating", description: "A sectional radiator with valves and pipe connections.", photo: PHOTOS.radiator },
  { service: "heating-cooling", category: "Heating & cooling", title: "Unit heating", description: "A piped unit heater with shutoff valves and a protective cage.", photo: PHOTOS.unitHeater },
  { service: "water-filtration", category: "Water filtration", title: "Water softening and treatment", description: "A softener, filter cartridges and UV treatment in one installation.", photo: PHOTOS.softener },
  { service: "plumbing", category: "Plumbing", title: "Water-supply line", description: "A new water-supply pipe laid in an outdoor trench.", photo: PHOTOS.waterLine },
  { service: "plumbing", category: "Plumbing", title: "Supply and drain rough-in", description: "Water and drain lines installed before the walls are closed.", photo: PHOTOS.roughIn },
];
