/**
 * Description: Keeps the mockup's review-only services, values, cities, and project placeholders together.
 * Inputs: None; business claims require owner approval before publication.
 * Output: Typed content shared by pages, navigation, and the booking preview.
 * Examples: App.test.tsx checks all six service routes and project categories.
 */
export interface Service {
  id: string;
  tab: string;
  title: string;
  cta: string;
  short: string;
  photo: string;
  lead: string;
  sections: {
    heading: string;
    intro?: string;
    check?: boolean;
    numbered?: boolean;
    cols?: number;
    items: [string, string?][];
  }[];
}
export interface Project {
  cat: string;
  title: string;
  ba?: boolean;
  shot?: string;
}

export interface ServiceGroup {
  id: "plumbing" | "mechanical";
  label: string;
  blurb: string;
  serviceIds: string[];
}
export const SERVICES: Service[] = [
  {
    id: "plumbing",
    tab: "Plumbing",
    title: "Plumbing",
    cta: "plumbing",
    short: "Leaks, fixtures, gas lines and repiping.",
    photo: "Finished bathroom or kitchen plumbing",
    lead: "We repair, replace and install the plumbing in your home, from a single faucet to a whole-house repipe.",
    sections: [
      {
        heading: "Our plumbing services",
        items: [
          [
            "Leak detection",
            "We find hidden leaks in walls, floors and slabs before they do more damage.",
          ],
          [
            "Burst pipe repair",
            "We shut off the water, repair the pipe and get your home back in service.",
          ],
          [
            "Piping and repiping",
            "We replace corroded or failing pipe, from a single run to the whole house.",
          ],
          [
            "Trenchless water line replacement",
            "We replace your main water line with minimal digging.",
          ],
          [
            "Gas line repair and installation",
            "We install and repair gas lines for ranges, dryers, fireplaces and water heaters.",
          ],
          [
            "Toilet repair and installation",
            "We fix running, leaking and clogged toilets and install new ones.",
          ],
          [
            "Faucets, fixtures and sinks",
            "We install and repair kitchen and bathroom fixtures.",
          ],
          [
            "Showers and tubs",
            "We repair and replace valves, drains and trim.",
          ],
          [
            "Garbage disposals",
            "We repair jammed or leaking disposals and install new ones.",
          ],
          [
            "Sump pumps",
            "We install and service sump pumps that keep water out of basements and crawlspaces.",
          ],
          [
            "Water filtration systems",
            "We install softeners and filters that treat the water for the whole house.",
          ],
        ],
      },
    ],
  },
  {
    id: "water-heaters",
    tab: "Water heaters",
    title: "Water heaters",
    cta: "water heater",
    short: "Tank, tankless and heat pump, gas or electric.",
    photo: "Water heater you installed",
    lead: "We repair and replace water heaters of every type: gas or electric, tank or tankless.",
    sections: [
      {
        heading: "Our water heater services",
        items: [
          [
            "Electric water heaters",
            "We replace heating elements and thermostats, and install a new tank when the old one wears out.",
          ],
          [
            "Gas water heaters",
            "We service burners, pilots and venting, and install new gas units to code.",
          ],
          [
            "Tankless water heaters",
            "A tankless unit heats water only when you need it and takes little space. We install and maintain them.",
          ],
          [
            "Heat pump water heaters",
            "A heat pump unit moves heat from the air into the water. It uses much less electricity than a standard electric tank.",
          ],
        ],
      },
    ],
  },
  {
    id: "drain-sewer",
    tab: "Drain & sewer",
    title: "Drain and sewer",
    cta: "drain or sewer line",
    short: "Drain cleaning, hydrojetting and trenchless repair.",
    photo: "Sewer line or drain job",
    lead: "We clear clogged drains and repair or replace damaged sewer lines.",
    sections: [
      {
        heading: "Our drain and sewer services",
        items: [
          [
            "Drain cleaning",
            "We clear slow and clogged drains in kitchens, bathrooms and laundry rooms.",
          ],
          [
            "Hydrojetting",
            "A high-pressure stream of water scours grease, scale and roots from the inside of your pipes.",
          ],
          [
            "Sewer line repair and replacement",
            "We repair cracked, sagging or root-damaged sewer lines, or replace them.",
          ],
          [
            "Trenchless sewer repair",
            "We repair the line from the inside with minimal digging, so your lawn and driveway stay intact.",
          ],
        ],
      },
    ],
  },
  {
    id: "water-filtration",
    tab: "Water filtration",
    title: "Water filtration and softening",
    cta: "water",
    short: "Softeners, reverse osmosis and carbon filters.",
    photo: "Softener or filtration setup",
    lead: "We install filtration and softening systems that make your water cleaner, safer and easier on your plumbing.",
    sections: [
      {
        heading: "Why filter your water",
        check: true,
        items: [
          ["Stop buying bottled water"],
          ["Know your water is clean"],
          ["Protect pipes and fixtures from scale"],
          ["Prevent stains on clothes, fixtures and hair"],
          ["Use less soap and detergent"],
        ],
      },
      {
        heading: "Which system fits your home",
        intro:
          "Each system solves a specific problem. We recommend one based on your water and your needs.",
        items: [
          [
            "Water softeners",
            "Remove calcium and magnesium, the hard minerals that leave scale in pipes and fixtures.",
          ],
          [
            "Carbon filters",
            "Layers of activated carbon trap impurities and keep your water fresh and safe to drink.",
          ],
          [
            "Reverse osmosis",
            "Water passes through a two-stage pre-filter, a membrane and a carbon post-filter. It works on city water and private wells.",
          ],
          [
            "Iron and sulfur filters",
            "Remove the excess iron and sulfur that make water smell.",
          ],
        ],
      },
    ],
  },
  {
    id: "heating-cooling",
    tab: "Heating & cooling",
    title: "Heating and cooling",
    cta: "heating or cooling",
    short: "Furnaces, heat pumps and air conditioning.",
    photo: "Furnace or heat pump install",
    lead: "Heating, cooling and ventilation scope awaits owner and license review before launch.",
    sections: [
      {
        heading: "What HVAC covers",
        intro:
          "HVAC stands for heating, ventilation and air conditioning. Together, these systems control the temperature, humidity and air quality in your home.",
        cols: 1,
        items: [
          [
            "Heating",
            "Furnaces, boilers, heat pumps and electric heaters keep your home warm in cold weather.",
          ],
          [
            "Ventilation",
            "Fans and ductwork bring in fresh outdoor air and remove stale indoor air, so pollutants do not build up.",
          ],
          [
            "Air conditioning",
            "Air conditioners and heat pumps move heat out of your home in warm weather.",
          ],
        ],
      },
      {
        heading: "Our HVAC services",
        items: [
          [
            "Installation",
            "We install new furnaces, heat pumps and air conditioners.",
          ],
          [
            "Maintenance",
            "Regular service keeps your system efficient and catches problems early.",
          ],
          ["Repair", "We find the cause of the failure and fix it."],
          [
            "Emergency service",
            "When the heat or air conditioning fails, call us.",
          ],
        ],
      },
    ],
  },
  {
    id: "boilers",
    tab: "Boilers",
    title: "Boilers and radiant heat",
    cta: "boiler",
    short: "Hydronic boiler repair, service and replacement.",
    photo: "Boiler or radiant heat job",
    lead: "Boiler maintenance, repair and replacement scope awaits owner and license review before launch.",
    sections: [
      {
        heading: "How a hydronic system works",
        intro:
          "A hydronic system heats your home with hot water instead of forced air. It can feed radiant floors, baseboard heaters or radiators.",
        numbered: true,
        cols: 1,
        items: [
          [
            "The boiler heats water",
            "It can run on natural gas, oil, electricity or solar.",
          ],
          [
            "Pipes carry the water",
            "Copper or PEX lines run through floors, walls and ceilings.",
          ],
          [
            "Each room receives heat",
            "Radiators, baseboards or tubing in the floor release the heat.",
          ],
          [
            "The heat spreads evenly",
            "Warmth radiates into the room without the drafts and temperature swings of forced air.",
          ],
          [
            "A pump returns the water",
            "The cooled water flows back to the boiler to be heated again.",
          ],
        ],
      },
      {
        heading: "Why hydronic heat",
        intro:
          "Hydronic heat is efficient, even and quiet. Zone valves and thermostats let you heat each part of the house on its own schedule. The system can also pair with solar thermal collectors.",
        items: [],
      },
      {
        heading: "Service your boiler every year",
        intro:
          "A neglected boiler puts your family at risk. An annual service finds problems early and keeps the system running like new.",
        items: [],
      },
      {
        heading: "Signs your boiler needs service",
        intro: "Call us if you notice any of these.",
        cols: 3,
        items: [
          ["Uneven heat", "Some rooms stay cold."],
          ["Unusual noises", "Banging, clanking or hissing."],
          ["Rising energy bills", "Heating costs jump for no clear reason."],
          ["Frequent cycling", "The boiler turns on and off often."],
          ["Low pressure", "The pressure gauge reads low."],
          ["Visible leaks", "Water collects around the boiler or its pipes."],
          [
            "Pilot light problems",
            "The flame flickers, changes color or goes out.",
          ],
          ["Lockouts", "The boiler shuts down and needs a manual reset."],
          ["No heat or hot water", "Call us right away."],
          ["Strange odors", "Unusual smells near the boiler."],
          [
            "Age",
            "Older boilers lose efficiency. We will tell you whether to repair or replace.",
          ],
        ],
      },
    ],
  },
];

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "plumbing",
    label: "Plumbing",
    blurb: "Pipes, fixtures, water heaters, drains, sewers and water treatment.",
    serviceIds: [
      "plumbing",
      "water-heaters",
      "drain-sewer",
      "water-filtration",
    ],
  },
  {
    id: "mechanical",
    label: "Heating & cooling",
    blurb: "Heating, cooling, ventilation and boiler services. [Confirm scope before launch.]",
    serviceIds: ["heating-cooling", "boilers"],
  },
];

/**
 * Description: Finds the services assigned to one navigation group.
 * Inputs: group is a catalog group whose identifiers may outlive a removed service.
 * Output: Existing services in the group's declared order; unknown identifiers are omitted.
 * Examples: App.test.tsx checks the Plumbing and Heating & cooling groups in the services index.
 */
export function servicesForGroup(group: ServiceGroup) {
  return group.serviceIds
    .map((id) => SERVICES.find((service) => service.id === id))
    .filter((service): service is Service => Boolean(service));
}

/**
 * Description: Lists the concrete jobs shown beneath a service in navigation and service cards.
 * Inputs: service is one catalog entry; empty prose-only sections contribute no labels.
 * Output: Unique item headings from the service's first section, in source order.
 * Examples: App.test.tsx checks that Water heaters exposes its four job links once.
 */
export function serviceMenu(service: Service) {
  return [...new Set(service.sections[0]?.items.map(([title]) => title) ?? [])];
}
export const VALUES = [
  [
    "Credentials [Confirm]",
    "Add the approved license, insurance and team credentials here.",
  ],
  [
    "Pricing [Confirm]",
    "Add the owner's approved pricing policy here.",
  ],
  [
    "We go the extra mile",
    "We explain what we found and what it takes to fix it, in plain terms.",
  ],
  [
    "Safety comes first",
    "Gas lines, boilers and water heaters are done to code, every time.",
  ],
];
export const CITIES = [
  "Auburn",
  "Bellevue",
  "Bothell",
  "Burien",
  "Cottage Lake",
  "Des Moines",
  "East Hill-Meridian",
  "Edmonds",
  "Everett",
  "Issaquah",
  "Kent",
  "Lake Stevens",
  "Lynnwood",
  "Machias",
  "Maltby",
  "Mill Creek",
  "Mountlake Terrace",
  "Mukilteo",
  "Newcastle",
  "Redmond",
  "Renton",
  "Sammamish",
  "SeaTac",
  "Seattle",
  "Shoreline",
  "Skyway",
  "Snohomish",
];
export const PROJECTS: Project[] = [
  { cat: "Water heaters", title: "Water heater replacement", ba: true },
  {
    cat: "Water heaters",
    title: "Tankless water heater install",
    shot: "Tankless unit mounted on wall",
  },
  {
    cat: "Heating & cooling",
    title: "Heat pump install",
    shot: "Outdoor unit on its pad",
  },
  { cat: "Heating & cooling", title: "Furnace replacement", ba: true },
  { cat: "Plumbing", title: "Shower valve and trim", shot: "Finished shower" },
  {
    cat: "Plumbing",
    title: "Kitchen sink and faucet",
    shot: "Finished sink and faucet",
  },
  {
    cat: "Drain & sewer",
    title: "Trenchless sewer line",
    shot: "Crew and equipment in the yard",
  },
  {
    cat: "Water filtration",
    title: "Whole-house water softener",
    shot: "Softener setup in garage",
  },
  { cat: "Boilers", title: "Boiler replacement", ba: true },
];
