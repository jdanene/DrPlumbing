import { SERVICES, type ServiceSection } from "./content";
import { routeHref } from "./sitePaths";

/**
 * Description: Keeps service explanations from the approved mockup and the owner's original site together.
 * Inputs: None; concise copy retains the mockup's explanations; added records cite mbphg.com below.
 * Output: Detail records grouped by their parent service; absent groups have no detail pages.
 * Examples: ServiceDetails.test.tsx covers the six original mockup details and their source copy.
 */
export interface ServiceDetail {
  item: string;
  cta: string;
  photo: string;
  lead?: string;
  summary?: string;
  sections: ServiceSection[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail[]> = {
  "plumbing": [
    // Source: https://www.mbphg.com/burst-pipe-repair
    {
      item: "Burst pipe repair",
      summary: "A burst pipe can send water through walls, ceilings and living spaces. Turn off the water at the main valve and call for a repair to limit the damage.",
      cta: "burst pipe",
      photo: "Burst pipe repair",
      sections: [
        {
          heading: "Why do pipes burst?",
          items: [
            ["Freezing water", "Water expands as it freezes inside a pipe. Outdoor faucets and exposed pipes are especially vulnerable."],
            ["Aging pipe", "Corrosion and wear can weaken pipe until it fails under water pressure."],
            ["Roots underground", "Tree roots can damage buried pipe and cause leaks or breaks."]
          ]
        },
        {
          heading: "Repair the damage and reduce the risk",
          paras: [
            "We repair burst pipes and replace damaged outdoor faucets. We also inspect for wear that could lead to another failure.",
            "Insulating exposed pipes and preparing outdoor plumbing for freezing weather can reduce the risk of a burst. These precautions help, but they do not guarantee a pipe will not freeze."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/repiping
    {
      item: "Piping and repiping",
      summary: "Repiping replaces damaged water-supply pipes, from one section to an entire home. We assess the damage and explain how much pipe needs replacement.",
      cta: "pipes",
      photo: "Water-supply pipe replacement",
      sections: [
        {
          heading: "When should you consider repiping?",
          paras: [
            "Persistent moisture, mold, rotting wood, rising water bills or heavy corrosion call for an inspection. Leaks throughout the house may point to a wider problem. These signs do not automatically mean you need a whole-house repipe.",
            "If damage is limited, replacing one section may be enough. An aging system, widespread corrosion or poorly installed pipe may justify a larger replacement."
          ]
        },
        {
          heading: "Choosing replacement pipe",
          items: [
            ["PEX", "Flexible pipe that generally costs less than copper."],
            ["Copper", "Rigid, durable pipe used for water-supply systems."]
          ],
          after: ["Replacing failing galvanized pipe can improve pressure and reduce repeated leaks. We explain the material and installation options for your home."]
        }
      ]
    },
    // Source: https://www.mbphg.com/faucets-fixtures-sinks
    {
      item: "Faucets, fixtures and sinks",
      summary: "We repair and replace kitchen, bathroom, bathtub and outdoor faucets, along with sinks and related fixtures.",
      cta: "faucets or fixtures",
      photo: "Finished kitchen or bathroom fixtures",
      sections: [
        {
          heading: "Visible drips and hidden leaks",
          paras: [
            "A dripping faucet may have a worn washer or gasket. Other leaks sit beneath the fixture, where they can cause mold or rotting wood. Have a suspected leak checked even if the faucet still works."
          ]
        },
        {
          heading: "Repair or replace the fixture?",
          paras: [
            "If you want to keep an existing fixture, a repair may restore it to working order. A damaged or worn-out faucet or sink may be worth replacing, especially if you also want a different style.",
            "We assess the problem, explain your options and handle the repair or installation."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/gas-line-repair-installation
    {
      item: "Gas line repair and installation",
      summary: "Natural-gas and propane lines need professional installation and repair. If you suspect a gas leak, leave the building and call the gas utility or 911 from a safe location outside.",
      cta: "gas line",
      photo: "Gas line installation",
      sections: [
        {
          heading: "Know the warning signs",
          items: [
            ["Sulfur or rotten-egg smell", "The odor added to gas helps make a leak noticeable."],
            ["Hissing near a line", "Escaping gas may make a hissing sound."],
            ["Changes around the piping", "Dying vegetation near a buried line can indicate a problem."],
            ["Appliance or bill changes", "Poor performance, unusual appliance noises or unexplained increases in gas use need investigation."]
          ]
        },
        {
          heading: "Professional inspection and repair",
          paras: [
            "For a suspected leak, contact the utility from outside before arranging plumbing repairs. Do not stay inside to find the source.",
            "We inspect damaged lines and determine whether repair or replacement is needed. We also install replacement piping and gas lines for appliances."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/sump-pumps
    {
      item: "Sump pumps",
      summary: "A sump pump removes collected water to help protect your basement or crawlspace from flooding. We install, service and replace pumps sized for your home.",
      cta: "sump pump",
      photo: "Sump pump installation",
      sections: [
        {
          heading: "Which pump fits your home?",
          items: [
            ["Pedestal pumps", "The motor sits above the basin and needs airflow to stay cool."],
            ["Submersible pumps", "The pump sits inside the sump pit, with a water-resistant motor designed for quieter operation."],
            ["Battery backup", "A backup pump can keep removing water during a power outage."]
          ]
        },
        {
          heading: "When a pump cannot keep up",
          paras: [
            "An obstructed float, a blocked discharge pipe or too little pumping capacity can stop a system from doing its job. We inspect the pump and help you decide whether to service it or replace it.",
            "Capacity, power requirements, switch type and automatic or manual operation all affect the choice. We help you select and install a system for your home's needs."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/leak-detection
    {
      item: "Leak detection",
      summary: "We locate and repair plumbing leaks, including leaks hidden behind walls, in basements and along the water line outside your home.",
      cta: "water leak",
      photo: "Leak detection and pipe repair",
      sections: [
        {
          heading: "Signs of a hidden leak",
          paras: [
            "A higher water bill without a clear reason can indicate a leak. Some leaks are visible at fixtures; others stay out of sight while water damages the building. A small leak can waste water long before you see a puddle."
          ]
        },
        {
          heading: "Find the source before repairing it",
          paras: [
            "We determine where the water is coming from, how far the problem extends and what needs repair. Locating the source matters before opening walls or starting larger repairs.",
            "Have suspected leaks checked promptly. Ongoing water loss can increase bills and damage the structure of your home."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/copy-of-trenchless-sewer-line-2
    {
      item: "Trenchless water line repair",
      summary: "Repair or replace an underground water-supply line with less excavation than a traditional open trench. We inspect the pipe and explain which approach fits your property.",
      cta: "water line",
      photo: "Trenchless water line repair",
      sections: [
        {
          heading: "Signs your water line needs attention",
          items: [
            ["Leaks or unexplained water use", "Recurring leaks, rising bills, damp ground or puddles in the yard."],
            ["Changes at the tap", "Low pressure throughout the home, rusty water or changes in taste or smell."],
            ["Aging or damaged pipe", "Corroded galvanized pipe, root intrusion or visible damage."]
          ]
        },
        {
          heading: "Repair or replacement with less digging",
          paras: [
            "Trenchless methods reduce excavation around landscaping and hard surfaces. Corrosion-resistant HDPE pipe is one replacement option. A higher initial cost may be offset by less digging and restoration work.",
            "The right method depends on the pipe's condition, the property and local requirements. We inspect the line before recommending trenchless repair or replacement."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/showers-tubs
    {
      item: "Showers and tubs",
      summary: "We repair and install plumbing for standalone showers and bath-and-shower combinations, from leaking valves to clogged drains.",
      cta: "shower or tub",
      photo: "Finished shower or tub plumbing",
      sections: [
        {
          heading: "When does a shower or tub need repair?",
          items: [
            ["Running water or drips", "A shower that will not shut off or a leaking showerhead wastes water."],
            ["Drain problems", "Blocked, rusted or lifting drains need attention."],
            ["Leaks and surface damage", "Cracks, holes or water escaping beneath the shower can damage the surrounding structure."]
          ]
        },
        {
          heading: "Repair, replace or update",
          paras: [
            "We find leaks, clear clogged drains and repair or replace damaged parts. We also install replacement showers and tubs and help you choose water-saving fixtures.",
            "Prompt attention to a leak can prevent a small plumbing repair from becoming a larger bathroom repair."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/toilet-repairs-installation
    {
      item: "Toilet repair and installation",
      summary: "A toilet that clogs, runs continuously or flushes weakly needs attention. We find the cause, explain the repair and install a replacement when needed.",
      cta: "toilet",
      photo: "Toilet installation in a finished bathroom",
      sections: [
        {
          heading: "Common toilet problems",
          items: [
            ["Clogged toilets", "We clear the obstruction and check what caused it."],
            ["Running toilets", "We diagnose continuous water flow and repair the fault."],
            ["Weak flushing or damage", "We assess the toilet and explain whether repair or replacement makes sense."]
          ]
        },
        {
          heading: "Installing a replacement toilet",
          paras: [
            "Correct placement and connections matter. A poorly installed toilet can leak or allow sewer gases to escape. We handle the installation and check the connections so the new toilet works as it should."
          ]
        }
      ]
    },
    {
      "item": "Garbage disposals",
      "summary": "A jammed, clogged or leaking disposal can disrupt your kitchen. We clean and repair disposals, or help you choose and install a replacement.",
      "cta": "garbage disposal",
      "photo": "Garbage disposal under a kitchen sink",
      "sections": [
        {
          "heading": "Prevent jams and drain backups",
          "paras": [
            "Keep the disposal and its drain piping in good condition to prevent blockages and backups. Cutlery, sponges, straws and other non-food objects can damage the unit. Fats, oils, bones and fibrous vegetables such as celery can clog it."
          ]
        },
        {
          "heading": "Choose and install a replacement",
          "paras": [
            "We recommend an efficient disposal for your household and budget. We install the unit and piping, then connect it to your plumbing and power supply."
          ]
        },
        {
          "heading": "Restaurant and commercial disposals",
          "paras": [
            "Commercial disposals grind food waste before it enters the drain. Choose the design and horsepower for the kitchen's waste volume."
          ],
          "items": [
            ["Light duty", "For fast-food restaurants, convenience stores, delis and office kitchens."],
            ["Medium duty", "For schools, hospitals and medium-sized restaurants."],
            ["Heavy duty", "For large restaurants, hotels, industrial kitchens and other high-volume operations."]
          ],
          "after": [
            "Even a heavy-duty unit can jam when overloaded or damaged by cutlery, straws or dishcloths. We install, repair and replace commercial disposals to minimize kitchen downtime.",
            "We provide a free written estimate, complete the work promptly and back it with a no-hassle guarantee."
          ]
        }
      ]
    }
  ],
  "water-heaters": [
    {
      "item": "Electric water heaters",
      "summary": "An electric water heater heats water without gas. We help you choose a tank or tankless model for your home and hot-water needs.",
      "cta": "water heater",
      "photo": "Electric water heater you installed",
      "sections": [
        {
          "heading": "Tank or tankless?",
          "items": [
            ["Tank models", "Store heated water for use throughout the home. Available tank sizes range from 1.5 to 110 gallons."],
            ["Tankless models", "Heat water as you use it, without a storage tank."]
          ],
          "after": [
            "Tank capacity and heating-element wattage affect how much hot water the unit can supply. We compare sizes, features and upgrades against your household's demand."
          ]
        },
        {
          "heading": "Why choose electric?",
          "paras": [
            "Electric models offer adjustable water temperatures and heat water without burning gas in your home. If you want to move away from gas, we can explain the electric options and help you select a unit."
          ]
        }
      ]
    },
    {
      "item": "Gas water heaters",
      "summary": "Running out of hot water or noticing unusual temperatures? We inspect your gas water heater, explain the problem and recommend repair or replacement.",
      "cta": "gas water heater",
      "photo": "Gas water heater you installed",
      "sections": [
        {
          "heading": "How a gas water heater works",
          "paras": [
            "A gas tank water heater burns natural gas or propane to heat water, then stores it until you need it. Electric and tankless water heaters offer other ways to meet your household's demand."
          ]
        },
        {
          "heading": "When does it need repair?",
          "paras": [
            "Showers that turn cold after a few minutes, scalding water or unusual noises can signal a problem. We inspect the heater and any connected plumbing that may be involved, then explain the repair needed to restore normal hot water."
          ]
        },
        {
          "heading": "When replacement makes sense",
          "paras": [
            "An outdated heater or one beyond repair may need replacement. We compare suitable units, recommend a model for your home and handle the installation."
          ]
        }
      ]
    },
    {
      "item": "Tankless water heaters",
      "summary": "A tankless heater heats water on demand rather than storing it in a tank. We size the system for your household and install, maintain and repair it.",
      "cta": "tankless water heater",
      "photo": "Tankless water heater you installed",
      "sections": [
        {
          "heading": "Hot water on demand",
          "paras": [
            "The heater connects directly to your plumbing and heats water when you open a hot tap. You do not need space for a storage tank or wait for a tank to refill and reheat. A correctly sized system can serve showers, laundry and dishwashing at the same time."
          ]
        },
        {
          "heading": "Choose the right configuration",
          "cols": 1,
          "items": [
            [
              "Single point of use",
              "Serves one fixture."
            ],
            [
              "Dual point of use",
              "Serves two fixtures at the same time."
            ],
            [
              "Thermostatically controlled",
              "For long pipe runs or applications requiring precise temperature control."
            ],
            [
              "High-flow systems",
              "For higher demand in condos, apartments or large bathrooms."
            ],
            [
              "Whole-house indoor or outdoor system",
              "Serves multiple fixtures throughout the home."
            ]
          ],
          "after": [
            "We calculate peak demand from your fixtures, plumbing layout and the way your household uses water. Tankless capacity depends on flow rate, measured in gallons per minute, and the temperature rise needed. We size the unit for both."
          ]
        },
        {
          "heading": "Repair, maintenance and replacement",
          "paras": [
            "We maintain and repair existing tankless heaters. If hot water runs out or becomes scalding, we diagnose the heater and connected plumbing.",
            "If you want to save energy or replace a worn-out tank heater, we can help you decide whether tankless suits your home."
          ]
        }
      ]
    },
    {
      "item": "Heat pump water heaters",
      "summary": "A heat pump water heater moves heat from the surrounding air into the tank, using less electricity than a standard electric heater. Compare its space requirements, upfront cost and running costs before choosing one.",
      "cta": "heat pump water heater",
      "photo": "Heat pump water heater you installed",
      "sections": [
        {
          "heading": "How a heat pump water heater works",
          "paras": [
            "Refrigerant circulates through a closed loop. An evaporator coil absorbs heat from the surrounding air, even in cooler conditions. A compressor raises the refrigerant's temperature, and a heat exchanger transfers that heat into the water.",
            "An insulated tank stores the hot water until you need it. The system uses electricity to move heat rather than generate it, reducing energy use and running costs compared with electric resistance heating. It works especially efficiently in moderate to warm climates."
          ]
        },
        {
          "heading": "Benefits and features to compare",
          "items": [
            [
              "Energy efficiency",
              "Moving heat takes less electricity than heating water with resistance elements. This can reduce your household's energy use."
            ],
            [
              "Cost savings",
              "A higher purchase price can be offset by lower energy bills over the heater's life. Compare upfront and running costs together."
            ],
            [
              "Environmental benefits",
              "Using less electricity can reduce the greenhouse gas emissions associated with heating your water."
            ],
            [
              "Versatility",
              "Models serve a range of climates, including cold regions. Hybrid units can switch to electric resistance heating in very cold conditions to maintain hot-water supply."
            ],
            [
              "Incentives and rebates",
              "Available government and utility incentives, rebates or tax credits can reduce the purchase cost."
            ],
            [
              "Longevity",
              "With proper maintenance, a heat pump unit can provide years of service and may outlast a traditional water heater."
            ],
            [
              "Quiet operation",
              "Quiet-running models suit homes where equipment noise is a concern."
            ],
            [
              "Improved air quality",
              "The heater removes moisture from the surrounding air as it runs, helping indoor comfort and air quality."
            ],
            [
              "Smart features",
              "Some models offer programmable settings and mobile apps for remote monitoring, control and energy savings."
            ]
          ],
          "after": [
            "We compare your household's hot-water needs, installation space, climate and budget to determine whether a heat pump water heater fits your home and which model to choose."
          ]
        }
      ]
    }
  ],
  "drain-sewer": [
    // Source: https://www.mbphg.com/copy-of-trenchless-sewer-line-1
    {
      item: "Drain cleaning",
      summary: "Slow sinks, blocked toilets and recurring backups need more than a temporary fix. We clear drains, remove buildup and inspect the line to find what caused the blockage.",
      cta: "drains",
      photo: "Drain cleaning at a customer's home",
      sections: [
        {
          heading: "Clear the blockage and find the cause",
          paras: [
            "Grease, scale, debris and roots can restrict a drain or sewer line. We choose a cleaning method for the obstruction and the condition of the pipe, then restore the flow with as little disruption as possible."
          ]
        },
        {
          heading: "Our drain cleaning services",
          items: [
            ["Drain and sewer cleaning", "Clear blockages and remove scale inside the pipe."],
            ["Root removal", "Cut roots that obstruct the line and assess the damaged pipe."],
            ["Camera inspection", "Look inside the drain to locate and explain the problem."],
            ["Preventive cleaning", "Plan maintenance for drains that repeatedly block, instead of waiting for another backup."]
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/sewer-line-repair-replacement
    {
      item: "Sewer line repair and replacement",
      summary: "Sewage odors, recurring backups or unexplained wet patches in the yard can point to a damaged sewer line. We find the cause and explain your repair or replacement options before work begins.",
      cta: "sewer line",
      photo: "Sewer line repair at a customer's home",
      sections: [
        {
          heading: "Warning signs of a damaged sewer line",
          items: [
            ["Sewage odors", "Persistent sewer smells inside or outside the house need investigation."],
            ["Dips in the lawn", "Leaking wastewater can wash away soil above a damaged line."],
            ["Unusually green patches", "A concentrated patch of lush grass may be growing over a leak."],
            ["New cracks or settlement", "Changes in the ground or foundation can accompany an underground leak."],
            ["Wastewater in the yard", "Pooling sewage can indicate a blocked or broken sewer line."]
          ]
        },
        {
          heading: "Repair or replace?",
          paras: [
            "We assess the line before recommending work. We explain where the problem is, what needs repair and whether replacement is the better option, so you can make an informed decision."
          ]
        }
      ]
    },
    // Source: https://www.mbphg.com/copy-of-trenchless-sewer-line
    {
      item: "Trenchless sewer repair",
      summary: "Trenchless repair restores an underground sewer line with less digging. It can reduce disruption to your lawn, landscaping and patio while addressing damaged pipe.",
      cta: "sewer line",
      photo: "Trenchless sewer line repair",
      sections: [
        {
          heading: "What is trenchless sewer repair?",
          paras: [
            "Traditional sewer repairs can require digging along the pipe. Trenchless methods reach the damaged line through smaller access points, limiting excavation and the landscaping work that follows.",
            "We assess the pipe and explain the repair or replacement options before work begins. The right method depends on its condition and location."
          ]
        },
        {
          heading: "When can it help?",
          items: [
            ["Hard-to-reach pipes", "Lines beneath landscaping, patios or buildings where excavation would cause more disruption."],
            ["Roots and recurring backups", "Damaged or poorly installed pipes that keep blocking or leaking."],
            ["Cracked underground pipes", "Damage caused by ground movement, corrosion or repeated freezing and thawing."]
          ]
        }
      ]
    },
    {
      "item": "Hydrojetting",
      "summary": "Hydrojetting uses high-pressure water to clear buildup inside a drain or sewer line. If clogs keep returning or sewage backs up, we inspect the line and tell you whether it is the right fix.",
      "cta": "drains",
      "photo": "Hydrojetting a main line",
      "sections": [
        {
          "heading": "How hydrojetting clears a pipe",
          "paras": [
            "A specialized nozzle sends water through the pipe at pressures up to 4,000 psi. The water breaks up stubborn clogs, loosens accumulated sludge and cleans the pipe walls. It can clear buildup that other methods leave behind."
          ]
        },
        {
          "heading": "When should you have the drains checked?",
          "check": true,
          "cols": 1,
          "items": [
            [
              "More than one drain is clogged."
            ],
            [
              "Sewage backs up into a toilet, sink, tub or shower."
            ],
            [
              "Main-line drains run slower than usual."
            ],
            [
              "Bad smells come from the drains."
            ]
          ],
          "after": [
            "We inspect the line before work begins, identify which sections need cleaning and explain whether hydrojetting is the right solution."
          ]
        }
      ]
    }
  ]
};

/**
 * Description: Keeps subservice hash addresses compatible with the approved mockup.
 * Inputs: label is a service heading or existing slug.
 * Output: A lowercase, hyphen-separated slug with ampersands written as "and".
 * Examples: ServiceDetails.test.tsx checks "Gas water heaters", punctuation, and an empty label.
 */
export function serviceDetailSlug(label: string) {
  return label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Description: Resolves a detail title or slug within its parent service.
 * Inputs: serviceId names the parent; key may be a visible option or its URL slug.
 * Output: The matching detail, or undefined so callers can retain the parent page.
 * Examples: ServiceDetails.test.tsx checks known titles, known slugs, and an unknown detail.
 */
export function serviceDetailFor(serviceId: string, key: string) {
  return (SERVICE_DETAILS[serviceId] ?? []).find(
    (detail) => serviceDetailSlug(detail.item) === serviceDetailSlug(key),
  );
}

/**
 * Description: Takes each service option to its detail page or matching explanation.
 * Inputs: serviceId names a catalog service; label is the visible option heading. Catalog targets may name a category ID or section heading.
 * Output: A detail path, category path, or section anchor; unknown options retain the parent page.
 * Examples: Tankless opens its detail page; Heating opens /heating-and-cooling/#heating.
 */
export function serviceOptionHref(serviceId: string, label: string) {
  const detail = serviceDetailFor(serviceId, label);
  if (detail) return routeHref(`${serviceId}/${serviceDetailSlug(detail.item)}`);
  const service = SERVICES.find((item) => item.id === serviceId);
  const destination = service?.optionTargets?.[label] ?? label;
  if (SERVICES.some((item) => item.id === destination)) return routeHref(destination);
  const target = serviceDetailSlug(destination);
  const hasTarget = service?.sections.some((section) =>
    (section.heading && serviceDetailSlug(section.heading) === target) ||
    section.items?.some(([title]) => serviceDetailSlug(title) === target),
  );
  return `${routeHref(serviceId)}${hasTarget ? `#${target}` : ""}`;
}
