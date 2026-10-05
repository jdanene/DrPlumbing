/**
 * Description: Keeps the approved services, values and cities together.
 * Inputs: None; business content follows the owner's approved mockup and subsequent corrections.
 * Output: Typed content shared by pages, navigation, and booking.
 * Examples: App.test.tsx checks all six service routes and project categories.
 */
export interface ServiceSection {
  heading?: string;
  intro?: string;
  paras?: string[];
  after?: string[];
  check?: boolean;
  numbered?: boolean;
  cols?: number;
  items?: [string, string?][];
}

export interface Service {
  id: string;
  tab: string;
  title: string;
  cta: string;
  short: string;
  photo: string;
  lead: string;
  summary?: string;
  menu?: string[];
  optionTargets?: Record<string, string>;
  sections: ServiceSection[];
}
export interface ServiceGroup {
  id: "plumbing" | "mechanical";
  label: string;
  blurb: string;
  serviceIds: string[];
}

/**
 * Description: Identifies the active residential plumbing contractor record published by Washington L&I.
 * Inputs: None; L&I is the source for the number, specialty, and registered business name.
 * Output: The public record used wherever the site states a plumbing license.
 * Examples: The footer links DRPLUPH740ND to the matching L&I record.
 */
export const PLUMBING_LICENSE = {
  number: "DRPLUPH740ND",
  registeredName: "Dr Plumbing & Heating Grp LLC",
  url: "https://secure.lni.wa.gov/verify/Detail.aspx?UBI=604661707&LIC=DRPLUPH740ND&SAW=",
} as const;

export const BUSINESS_NAME = "Dr Plumbing & Heating Group LLC";

export const SERVICE_AREA_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d172153.33373691145!2d-122.33979794999999!3d47.608715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5490102c93e83355%3A0x102565466944d59a!2sSeattle%2C%20WA!5e0!3m2!1sen!2sus!4v1790569958307!5m2!1sen!2sus";

export const SERVICES: Service[] = [
  {
    "id": "plumbing",
    "optionTargets": {
      "Water filtration systems": "water-filtration"
    },
    "tab": "General plumbing",
    "title": "General plumbing",
    "cta": "plumbing",
    "short": "Leaks, fixtures, gas lines and repiping.",
    "photo": "Finished bathroom or kitchen plumbing",
    "lead": "We repair, replace and install the plumbing in your home, from a single faucet to a whole-house repipe.",
    "sections": [
      {
        "heading": "Our plumbing services",
        "items": [
          [
            "Leak detection",
            "We find hidden leaks in walls, floors and slabs before they do more damage."
          ],
          [
            "Burst pipe repair",
            "We shut off the water, repair the pipe and get your home back in service."
          ],
          [
            "Piping and repiping",
            "We replace corroded or failing pipe, from a single run to the whole house."
          ],
          [
            "Trenchless water line repair",
            "We repair your main water line with minimal digging."
          ],
          [
            "Gas line repair and installation",
            "We install and repair gas lines for ranges, dryers, fireplaces and water heaters."
          ],
          [
            "Toilet repair and installation",
            "We fix running, leaking and clogged toilets and install new ones."
          ],
          [
            "Faucets, fixtures and sinks",
            "We install and repair kitchen and bathroom fixtures."
          ],
          [
            "Showers and tubs",
            "We repair and replace valves, drains and trim."
          ],
          [
            "Garbage disposals",
            "We repair jammed or leaking disposals and install new ones."
          ],
          [
            "Sump pumps",
            "We install and service sump pumps that keep water out of basements and crawlspaces."
          ],
          [
            "Water filtration systems",
            "We install softeners and filters that treat the water for the whole house."
          ]
        ]
      }
    ]
  },
  {
    "id": "water-heaters",
    "tab": "Water heaters",
    "title": "Water heaters",
    "cta": "water heater",
    "short": "Tank, tankless and heat pump, gas or electric.",
    "photo": "Water heater you installed",
    "lead": "We repair and replace water heaters of every type: gas or electric, tank or tankless.",
    "sections": [
      {
        "heading": "Our water heater services",
        "items": [
          [
            "Electric water heaters",
            "We replace heating elements and thermostats, and install a new tank when the old one wears out."
          ],
          [
            "Gas water heaters",
            "We service burners, pilots and venting, and install new gas units to code."
          ],
          [
            "Tankless water heaters",
            "A tankless unit heats water only when you need it and takes little space. We install and maintain them."
          ],
          [
            "Heat pump water heaters",
            "A heat pump unit moves heat from the air into the water. It uses much less electricity than a standard electric tank."
          ]
        ]
      }
    ]
  },
  {
    "id": "drain-sewer",
    "tab": "Drain & sewer",
    "title": "Drain and sewer",
    "cta": "drain or sewer line",
    "short": "Drain cleaning, hydrojetting and sewer line repair.",
    "photo": "Sewer line or drain job",
    "lead": "We clear clogged drains and repair or replace damaged sewer lines.",
    "sections": [
      {
        "heading": "Our drain and sewer services",
        "items": [
          [
            "Drain cleaning",
            "We clear slow and clogged drains in kitchens, bathrooms and laundry rooms."
          ],
          [
            "Hydrojetting",
            "A high-pressure stream of water scours grease, scale and roots from the inside of your pipes."
          ],
          [
            "Sewer line repair and replacement",
            "We repair cracked, sagging or root-damaged sewer lines, or replace them."
          ],
          [
            "Trenchless sewer repair",
            "We repair or replace underground sewer lines with less digging, reducing disruption to your yard and landscaping."
          ]
        ]
      }
    ]
  },
  {
    "id": "water-filtration",
    "summary": "Different filters solve different water problems. We help you choose a softener or filtration system for the water in your home.",
    "tab": "Water filtration",
    "title": "Water filtration and softener",
    "cta": "water",
    "short": "Softeners, reverse osmosis and carbon filters.",
    "photo": "Softener or filtration setup",
    "lead": "Are you concerned about water quality at home? Dr Plumbing & Heating is your plumber for all your water filtration system questions. Our experienced technicians are specialized in water filtration systems that allow you to rest assured that your water is protected through a world-class filtration system.",
    "sections": [
      // Source: https://www.mbphg.com/copy-of-water-filteration-1
      {
        "heading": "Start with your water",
        "paras": [
          "Test the water and identify the problem before choosing equipment. Taste, odor, mineral buildup and bacteria call for different treatment methods. We help match a system to your water and household needs."
        ]
      },
      {
        "heading": "What are the advantages of water filtration?",
        "intro": "Several of the most significant advantages of using a water filtration system include the following:",
        "check": true,
        "items": [
          [
            "Saving money by eliminating the need to purchase bottled water."
          ],
          [
            "Confidence in the purity of your water."
          ],
          [
            "Proper maintenance of your plumbing systems by avoiding scale-related issues."
          ],
          [
            "No stains on clothing, fixtures, or hair"
          ],
          [
            "Less soap is used, which saves you money."
          ],
          [
            "And much more!"
          ]
        ]
      },
      {
        "heading": "Popular water filtration system types",
        "intro": "Different water filtration systems perform a variety of functions. Each homeowner is unique, and each filtration system is designed to address a specific issue. We may recommend one of the following water filtration systems based on your specific needs:",
        "items": [
          [
            "Water softeners",
            "This system targets harmful minerals such as calcium and magnesium that contribute to home problems."
          ],
          [
            "Carbon filters",
            "Impurities in the water are trapped using multiple layers of activated carbon. This ensures that your water is always fresh, clean, and safe to drink."
          ],
          [
            "Reverse osmosis",
            "Utilizes a two-stage pre-filter comprised of micron fiber and carbon block, a membrane, and a post-carbon filter. They are compatible with chlorinated municipal water as well as well water from private wells."
          ],
          [
            "Iron and sulfur filters",
            "These filters eliminate odors caused by excessive iron and sulfur in the water."
          ],
          [
            "UV treatment",
            "Ultraviolet light treats bacteria without adding chemicals. Water testing helps determine whether this treatment belongs in your system."
          ]
        ],
        "after": [
          "Take comfort in the fact that your water is clean and safe to drink and use in your home. Contact us today to learn more about our professional water filtration system services and how you can protect your family."
        ]
      },
      {
        "heading": "Complete water solutions for your home",
        "paras": [
          "At Dr Plumbing & Heating, we understand the importance of clean and safe water for your family's well-being. Our professional water filtration system services ensure that your water is free from harmful contaminants, providing you with peace of mind. Take the step towards cleaner and healthier water by contacting us today to learn more about our water filtration and water softener services. Trust Dr Plumbing & Heating for comprehensive water solutions tailored to your unique needs."
        ]
      }
    ],
    "menu": [
      "Water softeners",
      "Carbon filters",
      "Reverse osmosis",
      "Iron and sulfur filters",
      "UV treatment"
    ]
  },
  {
    "id": "heating-cooling",
    "summary": "No heat, poor airflow or an air conditioner that will not cool? We repair, maintain and install heating, ventilation and air conditioning systems.",
    "optionTargets": {
      "Air conditioning": "Air conditioning (cooling)"
    },
    "tab": "Heating & cooling",
    "title": "Heating and cooling (HVAC)",
    "cta": "heating or cooling",
    "short": "Furnaces, heat pumps and air conditioning.",
    "photo": "Furnace or heat pump install",
    "lead": "A properly functioning HVAC system supports your comfort and well-being. Our licensed, insured technicians bring years of experience to its service and repair. From routine maintenance to emergency service, we keep your heating and cooling systems working at their best.",
    "sections": [
      {
        "heading": "What is HVAC?",
        "intro": "HVAC stands for heating, ventilation and air conditioning. These systems control temperature, humidity and air quality in your home or workspace. Here is how each part works:",
        "cols": 1,
        "items": [
          [
            "Heating",
            "When cold weather arrives, furnaces, boilers, heat pumps and electric heaters provide warmth. These systems supply heat and circulate it through your space to maintain comfortable indoor temperatures."
          ],
          [
            "Ventilation",
            "Ventilation controls the air you breathe. Fans and ductwork bring fresh outdoor air in and remove stale indoor air. This maintains air quality, limits pollutant buildup and supports a healthier indoor environment."
          ],
          [
            "Air conditioning (cooling)",
            "In hot weather, air conditioners and heat pumps remove heat from indoor air and release it outside. This keeps the indoor temperature comfortable."
          ]
        ],
        "after": [
          "At Dr Plumbing & Heating, we specialize in providing top-notch HVAC services to ensure your space remains comfortable, healthy, and energy-efficient. Our team of experienced HVAC technicians is dedicated to installing, maintaining, and repairing heating and cooling systems to ensure they operate at their best."
        ]
      },
      {
        "heading": "Our HVAC services",
        "items": [
          [
            "Installation",
            "We install new furnaces, heat pumps and air conditioners."
          ],
          [
            "Maintenance",
            "Regular service keeps your system efficient and catches problems early."
          ],
          [
            "Repair",
            "We find the cause of the failure and fix it."
          ],
          [
            "Emergency service",
            "When the heat or air conditioning fails, call us."
          ]
        ]
      }
    ],
    "menu": [
      "Heating",
      "Ventilation",
      "Air conditioning",
      "Installation",
      "Maintenance",
      "Repair",
      "Emergency service"
    ]
  },
  {
    "id": "boilers",
    "summary": "Hydronic heating carries hot water from a boiler to radiators, baseboards or heated floors. We service, repair and replace boilers to keep your home warm.",
    "optionTargets": {
      "Hydronic heating": "What is a hydronic boiler system?",
      "Radiant floor heating": "Radiators, baseboards, or radiant flooring",
      "Annual boiler service": "Importance of annual boiler services",
      "Boiler repair": "Boiler repair and replacement",
      "Boiler replacement": "Boiler repair and replacement"
    },
    "tab": "Boilers",
    "title": "Boilers and radiant heat",
    "cta": "boiler",
    "short": "Hydronic boiler repair, service and replacement.",
    "photo": "Boiler or radiant heat job",
    "lead": "We provide top-quality boiler services to keep your home's heating system running smoothly. Whether you need a routine maintenance check or repairs or replacement, we have the expertise to get the job done right. Our team of licensed professionals is available to handle all of your boiler service needs.",
    "sections": [
      {
        "heading": "What is a hydronic boiler system?",
        "intro": "Hydronic heating uses water to carry heat through a building. This efficient, versatile system can warm radiant floors, baseboards or radiators. Here is how its parts work together:",
        "numbered": true,
        "cols": 1,
        "items": [
          [
            "Boiler",
            "The boiler heats water to a set temperature using natural gas, oil, electricity or solar energy. The heated water then circulates through a network of pipes."
          ],
          [
            "Piping",
            "Pipes carry hot water through floors, walls or ceilings. They are usually copper, PEX or another material designed for hot water."
          ],
          [
            "Radiators, baseboards, or radiant flooring",
            "Hot water flows through radiators, baseboard heaters or pipes embedded in floors and ceilings. Radiators are common in older systems. Each releases heat into the surrounding space as water passes through it."
          ],
          [
            "Heat distribution",
            "Heat from these surfaces warms the room's objects and air. Radiant heat provides consistent warmth without forced-air blowing, which can sometimes cause uneven temperatures."
          ],
          [
            "Circulation",
            "A pump circulates water between the boiler and the heating elements. This continuous flow maintains the desired temperature throughout the building."
          ]
        ],
        "after": [
          "Hydronic heating systems are known for their efficiency, even heating, and quiet operation. They can be controlled through zone valves or thermostats to provide individual temperature control for different areas or zones within a building. Additionally, they can be integrated with other technologies, such as solar thermal collectors, to further enhance energy efficiency.",
          "Hydronic systems are popular for both residential and commercial applications, and they are often chosen for their ability to provide comfortable and customizable heating solutions."
        ]
      },
      {
        "heading": "Boiler repair and replacement",
        "paras": [
          "A boiler that leaks, heats unevenly or keeps shutting down needs attention. We assess its condition and explain the next step, whether it needs a repair or replacement."
        ]
      },
      {
        "heading": "Importance of annual boiler services",
        "paras": [
          "Don't put your family at risk by neglecting your boiler. Our Plumbing team provides top-notch boiler services to ensure your heating system runs like new. We know the importance of catching problems early, so we use the latest equipment to inspect your boiler and fix any issues before they become bigger problems. Keep your loved ones safe with our reliable and affordable boiler services."
        ]
      },
      {
        "heading": "Signs you need a boiler service",
        "intro": "At Dr Plumbing & Heating, we understand the importance of a well-functioning boiler in your home or business. Regular maintenance is the key to ensuring your boiler operates safely and efficiently. Here are some telltale signs that it's time to schedule a service with our expert technicians:",
        "items": [
          [
            "Uneven heating",
            "If you're experiencing uneven heating in different areas of your property, it may be a sign that your boiler needs attention."
          ],
          [
            "Unusual noises",
            "Strange sounds like banging, clanking, or hissing coming from your boiler should not be ignored. Our team can identify and resolve the issue swiftly."
          ],
          [
            "Increased energy bills",
            "Unexpected spikes in your heating bills could indicate that your boiler is not performing optimally. We'll help you regain efficiency."
          ],
          [
            "Frequent cycling",
            "A boiler that frequently turns on and off can be a sign of underlying problems. We'll diagnose the issue and ensure your system runs smoothly."
          ],
          [
            "Low boiler pressure",
            "Our technicians will check and adjust boiler pressure to ensure it's operating within the correct range."
          ],
          [
            "Visible leaks",
            "Leaking water around your boiler or from connected pipes is a clear indication of a problem. Our professionals will locate and fix the issue promptly."
          ],
          [
            "Pilot light issues",
            "If you have a pilot light, any irregularities in its appearance or performance will be addressed by our experts."
          ],
          [
            "Boiler lockouts",
            "Frequent boiler shutdowns requiring manual resets are a sign that something is amiss. We'll troubleshoot and provide solutions."
          ],
          [
            "No hot water or heat",
            "The absence of hot water or heating is a clear indicator that your boiler needs our immediate attention."
          ],
          [
            "Strange odors",
            "If you detect unusual odors from your boiler, let us investigate and resolve any potential concerns."
          ],
          [
            "Boiler age",
            "Boilers have a limited lifespan, and as they age, they become less efficient. If your boiler is nearing its end, we can evaluate its condition and recommend necessary actions."
          ]
        ],
        "after": [
          "Trust Dr Plumbing & Heating for comprehensive boiler service and maintenance. Our dedicated team of professionals ensures your heating system operates efficiently, keeping your property warm and comfortable. Don't hesitate to contact us if you notice any of these signs; we're here to keep your boiler in top shape."
        ]
      }
    ],
    "menu": [
      "Hydronic heating",
      "Radiant floor heating",
      "Annual boiler service",
      "Boiler repair",
      "Boiler replacement"
    ]
  }
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
    label: "Heating & Cooling",
    blurb: "Mechanical services: heating, cooling, ventilation and boilers.",
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
 * Output: The explicit source menu, or first-section item headings in source order.
 * Examples: ServiceDetails.test.tsx checks water-heater defaults and explicit boiler and filtration options.
 */
export function serviceMenu(service: Service) {
  return service.menu ?? service.sections[0]?.items?.map(([title]) => title) ?? [];
}
export const VALUES = [
  ["Flat-rate prices", "You approve the price before we start. No surprise fees."],
  ["Plain answers", "We explain what we found and how to fix it."],
  ["Safety first", "We install gas lines, boilers and water heaters to code, every time."],
  ["Care for your home", "We treat your house the way we treat our own."],
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
  "Federal Way",
  "Issaquah",
  "Kent",
  "Lake Stevens",
  "Lynnwood",
  "Machias",
  "Maltby",
  "Mill Creek",
  "Mountlake Terrace",
  "Mukilteo",
  "Redmond",
  "Renton",
  "Sammamish",
  "SeaTac",
  "Seattle",
  "Shoreline",
  "Skyway",
  "Snohomish",
];
