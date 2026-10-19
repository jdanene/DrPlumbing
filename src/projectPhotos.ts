/**
 * Selected job photographs for the local website review.
 * Classification lives in design/photo-classification/catalog.json.
 * Later owner submissions retain their provenance in owner-additions.json.
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
  /** Empty left-edge pixels in the source; the renderer hides them without editing the file. */
  trimLeft?: number;
}

const ROOT = "/service-photos/selected/by-service";
export const PHOTOS = {
  plumbingTechnician: {
    src: `${ROOT}/about/on-the-job/176_IMG_8591 2.jpg`,
    alt: "Residential water heater installation by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  heatingCirculation: {
    src: `${ROOT}/boilers/hydronic-heating/008_IMG_0427.jpg`,
    alt: "Hydronic heating system with circulation pumps by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  completedBoiler: {
    src: "/service-photos/selected/owner-submitted/boilers/hydronic-heating/completedBoiler.webp",
    alt: "Boiler installation and heating pipework by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  sewerConnection: {
    src: "/service-photos/selected/owner-submitted/drain-and-sewer/sewer-line-repair-and-replacement/sewerConnection.webp",
    alt: "Sewer line replacement with cleanout access by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  concreteTrenching: {
    src: `${ROOT}/about/on-the-job/035_IMG_1194.jpg`,
    alt: "Below-floor plumbing installation and concrete trenching by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  equipmentConnections: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/system-overview/equipmentConnections.webp",
    alt: "Commercial plumbing and equipment pipe connections by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  heatingPlant: {
    src: `${ROOT}/boilers/hydronic-heating/140_IMG_7279 2.jpg`,
    alt: "Commercial boiler and hydronic heating system by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  treatmentVessels: {
    src: `${ROOT}/water-filtration/system-overview/082_IMG_3517.jpg`,
    alt: "Water treatment system installation by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  sinkInProgress: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/bathroom-remodeling/sinkInProgress.webp",
    alt: "Bathroom sink and faucet installation during a complete remodel by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  windowTub: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/showers-and-tubs/windowTub.webp",
    alt: "Freestanding bathtub and floor-mounted faucet installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  electronicToilet: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/toilet-repair-and-installation/electronicToilet.webp",
    alt: "Modern toilet installation as part of a bathroom remodel by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  drainRoughIn: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/bathroom-remodeling/drainRoughIn.webp",
    alt: "Drain and water line installation for a complete bathroom remodel by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  finishedTub: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/showers-and-tubs/finishedTub.webp",
    alt: "Bathtub installation with tub filler and handheld spray by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  kitchenSink: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/kitchen-remodeling/kitchenSink.webp",
    alt: "Commercial kitchen sink and faucet installation by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  remodeledBathroom: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/bathroom-remodeling/remodeledBathroom.webp",
    alt: "Complete bathroom remodeling with walk-in shower, freestanding tub and toilet by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  doubleVanity: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/faucets-fixtures-and-sinks/doubleVanity.webp",
    alt: "Double vanity and faucet installation for a bathroom remodel by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  rainShower: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/showers-and-tubs/rainShower.webp",
    alt: "Rain shower installation with glass enclosure and handheld spray by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  customShower: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/showers-and-tubs/customShower.webp",
    alt: "Steam shower installation for a complete bathroom remodel by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  wallHungToilet: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/toilet-repair-and-installation/wallHungToilet.webp",
    alt: "Wall-hung toilet and concealed cistern installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  bathroomRoughIn: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/piping-and-repiping/bathroomRoughIn.webp",
    alt: "Bathroom plumbing installation before finishing a complete remodel by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  compactTankless: {
    src: "/service-photos/selected/owner-submitted/water-heaters/tankless-water-heaters/compactTankless.webp",
    alt: "Tankless water heater installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  crawlspaceHeating: {
    src: "/service-photos/selected/owner-submitted/boilers/hydronic-heating/crawlspaceHeating.webp",
    alt: "Residential hydronic heating installation beneath a home by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  homeFiltration: {
    src: "/service-photos/selected/owner-submitted/water-filtration/uv-treatment/homeFiltration.webp",
    alt: "Whole-house water filtration and UV treatment installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  homeSewerWork: {
    src: "/service-photos/selected/owner-submitted/drain-and-sewer/sewer-line-repair-and-replacement/homeSewerWork.webp",
    alt: "Residential sewer line replacement by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  boilerCloset: {
    src: "/service-photos/selected/owner-submitted/boilers/hydronic-heating/boilerCloset.webp",
    alt: "Boiler installation with heating distribution pipework by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  bathroom: {
    src: `${ROOT}/general-plumbing/showers-and-tubs/best/184_IMG_9192.jpg`,
    alt: "Complete bathroom remodel with bathtub, shower, sink and toilet by Dr Plumbing & Heating", width: 1200, height: 1600, position: "50% 65%",
  },
  shower: {
    src: `${ROOT}/general-plumbing/showers-and-tubs/best/188_IMG_9196.jpg`,
    alt: "Tub and shower fixture installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  freestandingBathroom: {
    src: "/service-photos/selected/owner-submitted/general-plumbing/showers-and-tubs/freestanding-bathroom.png",
    alt: "Complete bathroom remodeling with freestanding tub and walk-in shower by Dr Plumbing & Heating", width: 638, height: 458, frameRatio: "629 / 458", trimLeft: 9,
  },
  bathtubRoughIn: {
    src: `${ROOT}/general-plumbing/showers-and-tubs/best/121_IMG_4275.jpg`,
    alt: "Bathtub and shower plumbing installation before wall finishing by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  basin: {
    src: `${ROOT}/general-plumbing/faucets-fixtures-and-sinks/best/014_IMG_0653.jpg`,
    alt: "Bathroom sink and faucet installation by Dr Plumbing & Heating", width: 1200, height: 1600, position: "65% 65%",
  },
  toilet: {
    src: `${ROOT}/general-plumbing/toilet-repair-and-installation/best/189_IMG_9197.jpg`,
    alt: "Toilet and bidet attachment installation by Dr Plumbing & Heating", width: 1600, height: 1200, position: "65% 60%",
  },
  gasMeter: {
    src: `${ROOT}/general-plumbing/gas-line-repair-and-installation/best/088_IMG_3550.jpg`,
    alt: "Gas line plumbing with meter and shutoff connections by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  manifold: {
    src: `${ROOT}/general-plumbing/piping-and-repiping/best/061_IMG_2918.jpg`,
    alt: "Home repiping with individual fixture shutoff valves by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  waterLine: {
    src: `${ROOT}/general-plumbing/piping-and-repiping/best/044_IMG_1446.jpg`,
    alt: "Underground water-supply line installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  drillingRig: {
    src: `${ROOT}/general-plumbing/system-overview/096_IMG_3652 3.jpg`,
    alt: "Trenchless water line work with directional drilling equipment by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  roughIn: {
    src: `${ROOT}/general-plumbing/piping-and-repiping/best/127_IMG_4388.jpg`,
    alt: "Water-supply and drain plumbing installation before wall finishing by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  tank: {
    src: `${ROOT}/water-heaters/electric-water-heaters/best/095_IMG_3652.jpg`,
    alt: "Electric tank water heater installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  tankless: {
    src: `${ROOT}/water-heaters/tankless-water-heaters/best/132_IMG_5541.jpg`,
    alt: "Gas tankless water heater installation by Dr Plumbing & Heating", width: 1379, height: 1600,
  },
  twinNavien: {
    src: `${ROOT}/water-heaters/system-overview/081_IMG_3366.jpg`,
    alt: "Dual tankless water heater installation by Dr Plumbing & Heating", width: 1600, height: 1433, frameRatio: "1600 / 1433",
  },
  sewer: {
    src: `${ROOT}/drain-and-sewer/sewer-line-repair-and-replacement/best/056_IMG_1881.jpg`,
    alt: "Sewer pipe repair and replacement connection by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  filters: {
    src: `${ROOT}/water-filtration/uv-treatment/best/013_IMG_0552.jpg`,
    alt: "Whole-house water filtration and UV treatment by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  softener: {
    src: `${ROOT}/water-filtration/water-softeners/best/028_IMG_0890.jpg`,
    alt: "Water softener installation with filtration and UV treatment by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  unitHeater: {
    src: `${ROOT}/heating-and-cooling/heating/best/149_IMG_7290.jpg`,
    alt: "Unit heater installation and connected heating pipework by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  towelRadiator: {
    src: `${ROOT}/boilers/hydronic-heating/014_IMG_0653.jpg`,
    alt: "Bathroom towel radiator installation by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  boiler: {
    src: `${ROOT}/boilers/hydronic-heating/best/063_IMG_2970.jpg`,
    alt: "Boiler and hydronic heating installation by Dr Plumbing & Heating", width: 1600, height: 1546,
  },
  floorStandingBoiler: {
    src: `${ROOT}/boilers/hydronic-heating/084_IMG_3526.jpg`,
    alt: "Boiler installation with heating pipework and expansion tank by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  circulators: {
    src: `${ROOT}/boilers/hydronic-heating/best/009_IMG_0428.jpg`,
    alt: "Hydronic heating circulation pump installation by Dr Plumbing & Heating", width: 1200, height: 1600,
  },
  technician: {
    src: `${ROOT}/about/on-the-job/best/105_IMG_3750.jpg`,
    alt: "Hydronic heating pipe installation using copper press fittings by Dr Plumbing & Heating", width: 1600, height: 1200, position: "22% 45%",
  },
  ownerWithPressTool: {
    src: `${ROOT}/about/on-the-job/best/107_IMG_3753.jpg`,
    alt: "Mehran of Dr Plumbing & Heating with a copper plumbing press tool", width: 1600, height: 1200, position: "22% 45%",
  },
  copperPressDetail: {
    src: `${ROOT}/about/on-the-job/103_IMG_3745.jpg`,
    alt: "Copper press connections for hydronic heating installation by Dr Plumbing & Heating", width: 1200, height: 1600, position: "50% 85%",
  },
  technicianFiltration: {
    src: `${ROOT}/about/on-the-job/best/033_IMG_1113.jpg`,
    alt: "Water filtration system installation by Dr Plumbing & Heating", width: 1600, height: 1200, position: "20% 50%",
  },
  ownerOnSite: {
    src: `${ROOT}/about/on-the-job/116_IMG_4240.jpg`,
    alt: "Heating appliance service and connected copper plumbing by Dr Plumbing & Heating", width: 1600, height: 1200,
  },
  welding: {
    src: `${ROOT}/about/on-the-job/023_IMG_0789.jpg`,
    alt: "Pump pipework welding by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  boilerWork: {
    src: `${ROOT}/boilers/hydronic-heating/080_IMG_3354.jpg`,
    alt: "Boiler pipework installation by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  pipeAlignment: {
    src: `${ROOT}/boilers/hydronic-heating/099_IMG_3738.jpg`,
    alt: "Hydronic heating pipe installation and alignment by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
  solderingHeatingPipe: {
    src: `${ROOT}/boilers/hydronic-heating/098_IMG_3724.jpg`,
    alt: "Copper pipe soldering for hydronic heating by Dr Plumbing & Heating", width: 1200, height: 1600, frameRatio: "3 / 4",
  },
} satisfies Record<string, ProjectPhotoData>;

export const SERVICE_PHOTOS: Record<string, ProjectPhotoData> = {
  plumbing: PHOTOS.plumbingTechnician,
  "water-heaters": PHOTOS.twinNavien,
  "drain-sewer": PHOTOS.sewer,
  "water-filtration": PHOTOS.filters,
  "heating-cooling": PHOTOS.unitHeater,
  boilers: PHOTOS.floorStandingBoiler,
};

export const DETAIL_PHOTOS: Partial<Record<string, ProjectPhotoData>> = {
  "plumbing/complete-bathroom-remodeling": PHOTOS.remodeledBathroom,
  "plumbing/piping-and-repiping": PHOTOS.manifold,
  "plumbing/trenchless-water-line-repair": PHOTOS.drillingRig,
  "plumbing/faucets-fixtures-and-sinks": PHOTOS.basin,
  "plumbing/gas-line-repair-and-installation": PHOTOS.gasMeter,
  "plumbing/showers-and-tubs": PHOTOS.freestandingBathroom,
  "plumbing/toilet-repair-and-installation": PHOTOS.toilet,
  "plumbing/water-filtration-systems": PHOTOS.softener,
  "water-heaters/electric-water-heaters": PHOTOS.tank,
  "water-heaters/gas-water-heaters": PHOTOS.tankless,
  "water-heaters/tankless-water-heaters": PHOTOS.tankless,
  "drain-sewer/sewer-line-repair-and-replacement": PHOTOS.sewer,
  "water-filtration/water-softeners": PHOTOS.softener,
  "water-filtration/uv-treatment": PHOTOS.filters,
  "heating-cooling/heating": PHOTOS.unitHeater,
  "boilers/boiler": PHOTOS.completedBoiler,
  "boilers/radiators-baseboards-or-radiant-flooring": PHOTOS.towelRadiator,
  "boilers/circulation": PHOTOS.circulators,
};

export interface WorkProject {
  service: string;
  category: string;
  title: string;
  description: string;
  photo: ProjectPhotoData;
}

/** Owner's October 18 selection; captions report visible work, not unverified locations or outcomes. */
export const RESIDENTIAL_PROJECTS = {
  sinkInProgress: { service: "plumbing/complete-bathroom-remodeling", category: "Complete bathroom remodeling", title: "Sink installation in progress", description: "Fixture installation is included in the complete remodel, so you don’t have to coordinate it as a separate project.", photo: PHOTOS.sinkInProgress },
  windowTub: { service: "plumbing/complete-bathroom-remodeling", category: "Complete bathroom remodeling", title: "Freestanding bathtub", description: "A freestanding tub with a floor-mounted faucet offers an alternative to a built-in bath.", photo: PHOTOS.windowTub },
  electronicToilet: { service: "plumbing/toilet-repair-and-installation", category: "Complete bathroom remodeling", title: "Modern toilet installation", description: "A streamlined design with integrated controls.", photo: PHOTOS.electronicToilet },
  drainRoughIn: { service: "plumbing/complete-bathroom-remodeling", category: "Complete bathroom remodeling", title: "Plumbing before the finishing work", description: "We install the water and drain pipes before the walls and floors are finished.", photo: PHOTOS.drainRoughIn },
  tub: { service: "plumbing/complete-bathroom-remodeling", category: "Complete bathroom remodeling", title: "Freestanding bathtub", description: "Freestanding bathtub.", photo: PHOTOS.finishedTub },
  bathroom: { service: "plumbing/complete-bathroom-remodeling", category: "Complete bathroom remodeling", title: "Finished bathroom remodel", description: "A separate bath and walk-in shower in one complete bathroom remodel.", photo: PHOTOS.remodeledBathroom },
  vanity: { service: "plumbing/faucets-fixtures-and-sinks", category: "Complete bathroom remodeling", title: "Double vanity and bathroom fixtures", description: "Two sinks give each person their own space in a shared bathroom.", photo: PHOTOS.doubleVanity },
  rain: { service: "plumbing/showers-and-tubs", category: "Complete bathroom remodeling", title: "Rain shower and glass enclosure", description: "Overhead rain and handheld shower options in a walk-in enclosure.", photo: PHOTOS.rainShower },
  shower: { service: "plumbing/complete-bathroom-remodeling", category: "Complete bathroom remodeling", title: "Steam shower", description: "A steam shower with overhead and handheld shower options.", photo: PHOTOS.customShower },
  toilet: { service: "plumbing/toilet-repair-and-installation", category: "Complete bathroom remodeling", title: "Wall-hung toilet", description: "A concealed cistern and wall-hung bowl leave the floor beneath accessible for cleaning.", photo: PHOTOS.wallHungToilet },
  roughIn: { service: "plumbing/piping-and-repiping", category: "Complete bathroom remodeling", title: "Bathroom supply lines before finishing", description: "Water-supply lines installed while the walls are open, before finishing the bathroom.", photo: PHOTOS.bathroomRoughIn },
  tankless: { service: "water-heaters/tankless-water-heaters", category: "Water heaters", title: "Compact tankless water heater", description: "Wall-mounted water heating without a storage tank.", photo: PHOTOS.compactTankless },
  heating: { service: "boilers", category: "Boilers", title: "Heating pipework beneath the home", description: "Heating equipment and distribution pipework fitted beneath the home.", photo: PHOTOS.crawlspaceHeating },
  filtration: { service: "water-filtration/uv-treatment", category: "Water filtration", title: "Wall-mounted water treatment", description: "Filtration and UV treatment connected to the household water supply.", photo: PHOTOS.homeFiltration },
  sewer: { service: "drain-sewer/sewer-line-repair-and-replacement", category: "Drain & sewer", title: "Sewer work beside a home", description: "Sewer replacement in progress, with the damaged line exposed for access.", photo: PHOTOS.homeSewerWork },
  boiler: { service: "boilers", category: "Boilers", title: "Boiler and distribution pipework", description: "Boiler and heating connections arranged within an equipment closet.", photo: PHOTOS.boilerCloset },
} satisfies Record<string, WorkProject>;

const BATHROOM_PROJECTS: WorkProject[] = [
  { service: "plumbing/showers-and-tubs", category: "Complete bathroom remodeling", title: "Freestanding tub and walk-in shower", description: "A finished bathroom with a freestanding tub, glass shower enclosure and wall-hung toilet.", photo: PHOTOS.freestandingBathroom },
  { service: "plumbing/showers-and-tubs", category: "Complete bathroom remodeling", title: "Bathtub plumbing before the walls close", description: "A bathtub with shower valves and pipework visible in the open wall framing.", photo: PHOTOS.bathtubRoughIn },
];

/** Screenshot-selected originals; shared records keep service galleries and category filters aligned. */
export const EQUIPMENT_PROJECTS = {
  heatingCirculation: { service: "boilers/circulation", category: "Boilers", title: "Pumps that circulate heat", description: "Three pumps move heated water through separate heating circuits.", photo: PHOTOS.heatingCirculation },
  completedBoiler: { service: "boilers", category: "Boilers", title: "Boiler and heating connections", description: "The boiler heats water for the home's heating circuits, with pipework and controls connected in one equipment space.", photo: PHOTOS.completedBoiler },
  sewerConnection: { service: "drain-sewer/sewer-line-repair-and-replacement", category: "Drain & sewer", title: "Sewer connection and cleanout", description: "A replacement pipe connection with a cleanout for future drain access.", photo: PHOTOS.sewerConnection },
  concreteTrenching: { service: "plumbing/piping-and-repiping", category: "Plumbing", title: "Opening the floor for plumbing", description: "Our crew cuts and removes concrete to reach the pipework beneath the floor.", photo: PHOTOS.concreteTrenching },
  equipmentConnections: { service: "plumbing/piping-and-repiping", category: "Plumbing", title: "Mechanical-room pipe connections", description: "Insulated water lines and shutoff valves connect the building’s equipment.", photo: PHOTOS.equipmentConnections },
  heatingPlant: { service: "boilers", category: "Boilers", title: "Boiler plant and heating distribution", description: "Pumps and distribution pipes carry heat from the boiler plant through the building.", photo: PHOTOS.heatingPlant },
  treatmentVessels: { service: "water-filtration", category: "Water filtration", title: "Multi-tank water treatment", description: "Three treatment tanks with automatic controls serve the building’s water system.", photo: PHOTOS.treatmentVessels },
} satisfies Record<string, WorkProject>;

const SINK_PROJECT: WorkProject = { service: "plumbing/faucets-fixtures-and-sinks", category: "Complete bathroom remodeling", title: "Vanity and faucet installation", description: "An undermount sink and faucet installed as part of the finished bathroom.", photo: PHOTOS.basin };

/** Lead with people working, then show finished installations across residential services. */
export const HOME_PROJECTS: WorkProject[] = [
  { service: "boilers", category: "Boilers", title: "Heating pipework in progress", description: "Soldering a copper joint on hydronic heating pipework.", photo: PHOTOS.solderingHeatingPipe },
  { service: "boilers", category: "Boilers", title: "Working on a hydronic heating system", description: "Working on pipework beneath a wall-mounted HTP heating appliance.", photo: PHOTOS.boilerWork },
  { service: "water-heaters", category: "Water heaters", title: "Tankless water heating", description: "Two Navien tankless heaters with copper pipework on a blue mounting panel.", photo: PHOTOS.twinNavien },
  { service: "water-filtration", category: "Water filtration", title: "Whole-house water filtration", description: "Filter cartridges and UV treatment connected to the home's water supply.", photo: PHOTOS.filters },
  { service: "drain-sewer", category: "Drain & sewer", title: "Sewer pipe repair", description: "A new pipe section and coupling in an exposed sewer line.", photo: PHOTOS.sewer },
];

/** Additional examples keep the existing service photographs and explanations in place. */
export const SERVICE_GALLERIES: Partial<Record<string, { title: string; projects: WorkProject[] }>> = {
  "plumbing/complete-bathroom-remodeling": { title: "Behind the finished room", projects: [RESIDENTIAL_PROJECTS.roughIn, RESIDENTIAL_PROJECTS.sinkInProgress, RESIDENTIAL_PROJECTS.drainRoughIn] },
  "plumbing/complete-bathroom-remodeling#faucets-fixtures-and-sinks": { title: "Bathroom fixture projects", projects: [RESIDENTIAL_PROJECTS.vanity, SINK_PROJECT, RESIDENTIAL_PROJECTS.sinkInProgress, RESIDENTIAL_PROJECTS.electronicToilet] },
  "plumbing/complete-bathroom-remodeling#showers-and-tubs": { title: "Shower and tub project photos", projects: [RESIDENTIAL_PROJECTS.shower, RESIDENTIAL_PROJECTS.rain, RESIDENTIAL_PROJECTS.tub, RESIDENTIAL_PROJECTS.windowTub] },
  "plumbing/complete-bathroom-remodeling#kitchen-remodeling": { title: "Kitchen plumbing project", projects: [
    { service: "plumbing/complete-bathroom-remodeling", category: "Plumbing", title: "Kitchen sink installation", description: "Kitchen sink and spray-faucet installation.", photo: PHOTOS.kitchenSink },
  ] },
  "plumbing/faucets-fixtures-and-sinks": { title: "Sink and faucet projects", projects: [RESIDENTIAL_PROJECTS.vanity, RESIDENTIAL_PROJECTS.sinkInProgress] },
  "plumbing/toilet-repair-and-installation": { title: "Toilet installation project", projects: [RESIDENTIAL_PROJECTS.toilet, RESIDENTIAL_PROJECTS.electronicToilet] },
  plumbing: { title: "Plumbing project photos", projects: [EQUIPMENT_PROJECTS.concreteTrenching, EQUIPMENT_PROJECTS.equipmentConnections] },
  "plumbing/piping-and-repiping": { title: "Piping project photos", projects: [RESIDENTIAL_PROJECTS.roughIn, EQUIPMENT_PROJECTS.concreteTrenching, EQUIPMENT_PROJECTS.equipmentConnections] },
  "water-heaters": { title: "Another water heater installation", projects: [RESIDENTIAL_PROJECTS.tankless] },
  "water-heaters/tankless-water-heaters": { title: "Tankless water heater project", projects: [RESIDENTIAL_PROJECTS.tankless] },
  boilers: { title: "Boiler and heating projects", projects: [EQUIPMENT_PROJECTS.completedBoiler, EQUIPMENT_PROJECTS.heatingCirculation, RESIDENTIAL_PROJECTS.heating, RESIDENTIAL_PROJECTS.boiler, EQUIPMENT_PROJECTS.heatingPlant] },
  "boilers/circulation": { title: "Heating distribution projects", projects: [EQUIPMENT_PROJECTS.heatingCirculation, EQUIPMENT_PROJECTS.heatingPlant] },
  "water-filtration": { title: "Water treatment projects", projects: [RESIDENTIAL_PROJECTS.filtration, EQUIPMENT_PROJECTS.treatmentVessels] },
  "plumbing/water-filtration-systems": { title: "Water treatment projects", projects: [RESIDENTIAL_PROJECTS.filtration, EQUIPMENT_PROJECTS.treatmentVessels] },
  "water-filtration/uv-treatment": { title: "UV treatment installation", projects: [RESIDENTIAL_PROJECTS.filtration] },
  "drain-sewer": { title: "Sewer repair projects", projects: [RESIDENTIAL_PROJECTS.sewer, EQUIPMENT_PROJECTS.sewerConnection] },
  "drain-sewer/sewer-line-repair-and-replacement": { title: "Sewer repair projects", projects: [RESIDENTIAL_PROJECTS.sewer, EQUIPMENT_PROJECTS.sewerConnection] },
  "plumbing/showers-and-tubs": { title: "Bathroom project photos", projects: [
    { service: "plumbing/showers-and-tubs", category: "Plumbing", title: "Bath and shower fittings", description: "An overhead shower, handheld shower and tub fittings in a tiled bath-and-shower installation.", photo: PHOTOS.shower },
    BATHROOM_PROJECTS[1]!,
    RESIDENTIAL_PROJECTS.rain,
    RESIDENTIAL_PROJECTS.shower,
  ] },
};

/** Featured bathroom work also belongs to the full project catalog. */
const REMODELING_FEATURES: WorkProject[] = [RESIDENTIAL_PROJECTS.bathroom, RESIDENTIAL_PROJECTS.shower, RESIDENTIAL_PROJECTS.vanity, RESIDENTIAL_PROJECTS.rain, RESIDENTIAL_PROJECTS.tub];

export const WORK_PROJECTS: WorkProject[] = [
  ...Object.values(RESIDENTIAL_PROJECTS),
  ...HOME_PROJECTS,
  ...Object.values(EQUIPMENT_PROJECTS),
  { service: "water-heaters", category: "Water heaters", title: "Tank water heating", description: "A Rheem water heater with an expansion tank and connected supply lines.", photo: PHOTOS.tank },
  { service: "water-heaters", category: "Water heaters", title: "Rinnai tankless installation", description: "A Rinnai gas tankless heater with venting and connected pipework.", photo: PHOTOS.tankless },
  SINK_PROJECT,
  { service: "plumbing", category: "Plumbing", title: "Underground drilling equipment", description: "A directional drilling rig positioned beside a driveway excavation.", photo: PHOTOS.drillingRig },
  { service: "boilers", category: "Boilers", title: "Boiler and heating pipework", description: "A hydronic heating plant with circulation pumps and connected pipework.", photo: PHOTOS.boiler },
  { service: "heating-cooling", category: "Heating & cooling", title: "Unit heating", description: "A piped unit heater with shutoff valves and a protective cage.", photo: PHOTOS.unitHeater },
  { service: "water-filtration", category: "Water filtration", title: "Water softening and treatment", description: "A softener, filter cartridges and UV treatment in one installation.", photo: PHOTOS.softener },
  { service: "plumbing", category: "Plumbing", title: "Water-supply line", description: "A new water-supply pipe laid in an outdoor trench.", photo: PHOTOS.waterLine },
  { service: "plumbing", category: "Plumbing", title: "Supply and drain rough-in", description: "Water and drain lines installed before the walls are closed.", photo: PHOTOS.roughIn },
  { service: "plumbing", category: "Complete bathroom remodeling", title: "Bathroom plumbing", description: "A finished bathroom with a tub, shower, basin and toilet.", photo: PHOTOS.bathroom },
  BATHROOM_PROJECTS[1]!,
  { service: "plumbing/piping-and-repiping", category: "Plumbing", title: "Fixture-by-fixture water supply", description: "A hot and cold water manifold with individual shutoffs for household fixtures.", photo: PHOTOS.manifold },
];

/** Finished rooms lead the remodeling category; construction and older projects remain available. */
export const REMODELING_PROJECTS: WorkProject[] = [
  ...REMODELING_FEATURES,
  ...WORK_PROJECTS.filter(project => project.category === "Complete bathroom remodeling" && !REMODELING_FEATURES.includes(project)),
];
