/**
 * Description: Answers the homeowner's first question before the existing service explanation.
 * Inputs: Keys are "hub", a service ID, or a service ID followed by its existing option slug.
 * Output: Final guidance under 100 words, with primary sources where cited. The city renderer fills {city}; this
 * record makes no promises about a contractor's availability, prices, or a particular home's condition.
 * Examples: "water-heaters" covers repair versus replacement; "boilers/boiler-repair" covers diagnosis.
 */
export interface ServiceAnswer {
  question: string;
  answer: string;
  status: "final";
  sources: readonly { title: string; url: string }[];
}

const SOURCES = {
  hiring: {
    title: "Washington L&I: Hire Smart Step-by-Step",
    url: "https://www.lni.wa.gov/licensing-permits/contractors/hiring-a-contractor/hire-smart-step-by-step",
  },
  leaks: {
    title: "EPA WaterSense: Fix a Leak Week",
    url: "https://www.epa.gov/watersense/fix-leak-week",
  },
  frozenPipes: {
    title: "Seattle Public Utilities: Frozen Pipes in Winter Weather",
    url: "https://www.seattle.gov/utilities/your-services/water/frozen-pipes",
  },
  waterLines: {
    title: "Seattle Public Utilities: Private Water Line Inspections",
    url: "https://seattle.gov/utilities/construction-resources/water/water-line-inspections",
  },
  trenchlessWater: {
    title: "EPA: Quality Assurance and Quality Control Practices for Rehabilitation of Sewer and Water Mains",
    url: "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P100AFGW.TXT",
  },
  gasSafety: {
    title: "Puget Sound Energy: What to Do About Natural Gas Leaks",
    url: "https://www.pse.com/safety/natural-gas-safety/detect-a-leak",
  },
  bathroom: {
    title: "EPA WaterSense: Dreaming of a better bathroom?",
    url: "https://www.epa.gov/sites/default/files/2017-02/documents/ws-ourwater-wholebath-brochure.pdf",
  },
  showers: {
    title: "EPA WaterSense: Showerheads",
    url: "https://www.epa.gov/watersense/showerheads",
  },
  disposal: {
    title: "InSinkErator: Garbage Disposal Leaking at the Discharge",
    url: "https://support.insinkerator.com/app/answers/detail/a_id/524/~/garbage-disposal-leaking-at-the-discharge",
  },
  sump: {
    title: "Zoeller Pump Company: Lineup of Battery Backups",
    url: "https://zoellerpumps.com/lineup-of-battery-backups/",
  },
  sumpDiagnosis: {
    title: "Zoeller Pump Company: Service Checklist and Troubleshooting",
    url: "https://zoellerpumps.com/wp-content/uploads/sites/3/2025/01/fm1799.pdf",
  },
  waterHeaterRepair: {
    title: "Rheem: Water Heater Lifespan, When to Repair vs. Replace",
    url: "https://www.rheem.com/water-heating/articles/water-heater-lifespan-when-to-repair-vs-replace/",
  },
  waterHeaterSizing: {
    title: "ENERGY STAR: Water Heater Key Product Criteria",
    url: "https://www.energystar.gov/products/water_heaters/residential_water_heaters_key_product_criteria",
  },
  tankless: {
    title: "Rinnai: Residential Water Heater FAQ",
    url: "https://www.rinnai.us/residential/faq",
  },
  heatPumpWater: {
    title: "ENERGY STAR: Heat Pump Water Heaters",
    url: "https://www.energystar.gov/products/heat_pump_water_heaters",
  },
  heatPumpDesign: {
    title: "ENERGY STAR: Heat Pump Water Heater Design Considerations",
    url: "https://www.energystar.gov/partner-resources/residential_new/educational_resources/sup_program_guidance/heat_pump_water_heater_guide/design_considerations",
  },
  sewerRepair: {
    title: "Seattle Public Utilities: Side Sewer Repair Methods",
    url: "https://seattle.gov/utilities/your-services/sewer-and-drainage/side-sewers/repair-methods",
  },
  drainCleaning: {
    title: "RIDGID: Drain Cleaning",
    url: "https://www.ridgid.com/ca/en/full-drain-cleaning-lineup",
  },
  jetting: {
    title: "RIDGID: KJ-1350 Water Jetter",
    url: "https://www.ridgid.com/sg/en/kj1350-water-jetter",
  },
  waterTreatment: {
    title: "EPA WaterSense: Guide to Selecting Water Treatment Systems",
    url: "https://www.epa.gov/system/files/documents/2024-11/ws-products-home-water-treatment-guide_508.pdf",
  },
  homeTreatment: {
    title: "CDC: About Home Water Treatment Systems",
    url: "https://www.cdc.gov/drinking-water/about/about-home-water-treatment-systems.html",
  },
  filterSelection: {
    title: "CDC: About Choosing Home Water Filters",
    url: "https://www.cdc.gov/drinking-water/prevention/about-choosing-home-water-filters.html",
  },
  iron: {
    title: "Penn State Extension: Iron and Manganese in Private Water Systems",
    url: "https://extension.psu.edu/iron-and-manganese-in-private-water-systems",
  },
  sulfur: {
    title: "Penn State Extension: Hydrogen Sulfide in Water Wells",
    url: "https://extension.psu.edu/hydrogen-sulfide-rotten-egg-odor-in-water-wells",
  },
  heatingReplacement: {
    title: "ENERGY STAR: When is it time to replace?",
    url: "https://www.energystar.gov/saveathome/heating-cooling/replace",
  },
  heatingRepair: {
    title: "Rheem: When to Repair vs. Replace Your HVAC System",
    url: "https://www.rheem.com/air-conditioning/articles/repair-vs-replace/",
  },
  heatingInstallation: {
    title: "ENERGY STAR: HVAC Quality Installation",
    url: "https://www.energystar.gov/saveathome/heating-cooling/hvac-quality-installation",
  },
  heatingMaintenance: {
    title: "ENERGY STAR: Maintenance Checklist",
    url: "https://www.energystar.gov/saveathome/heating-cooling/maintenance-checklist",
  },
  heatPump: {
    title: "ENERGY STAR: Air-Source Heat Pumps",
    url: "https://www.energystar.gov/products/air_source_heat_pumps",
  },
  ventilation: {
    title: "CDC: Mold",
    url: "https://www.cdc.gov/mold-health/about/index.html",
  },
  hydronicDiagnosis: {
    title: "Caleffi: The Hydronic Troubleshooting Process",
    url: "https://www.caleffi.com/en-us/blog/3-troubleshooting-process",
  },
  radiantDiagnosis: {
    title: "Caleffi: Causes of Compromised Hydronic Performance",
    url: "https://www.caleffi.com/en-us/blog/4-classic-causes-compromised-performance",
  },
  radiantDesign: {
    title: "Watts: Radiant Heating Frequently Asked Questions",
    url: "https://www.watts.com/support/faq-radiant",
  },
  boilerMaintenance: {
    title: "Navien: NFC-H User's Information Manual, Maintenance Schedules",
    url: "https://www.navieninc.com/downloads/nfc-h-user-s-information-manual-en/download",
  },
  boilerReplacement: {
    title: "Weil-McLain: Signs Your Boiler Needs to Be Replaced",
    url: "https://www.weil-mclain.com/news/seven-telltale-signs-your-boiler-needs-to-be-replaced/",
  },
} as const;

export const SERVICE_ANSWERS: Record<string, ServiceAnswer> = {
  hub: {
    question: "Who is a good plumber in {city}?",
    answer: "Choose a plumber whose license and experience match your job, whether it is a leaking fixture, a sewer line or a boiler. Compare the written scope, who will do the work and the price before approving it. For an urgent problem, confirm actual availability rather than assuming every company has a crew ready. Check Washington L&I's contractor record and recent customer reviews before hiring.",
    status: "final",
    sources: [SOURCES.hiring],
  },
  plumbing: {
    question: "Should I repair my plumbing or replace it in {city}?",
    answer: "A single worn fixture or damaged pipe section often calls for a focused repair. Repeated leaks in different places or widespread pipe corrosion justify discussing replacement. Ask for the cause and extent of the damage before agreeing to a whole-house repipe. For a remodel, compare the complete project scope rather than the price of individual fixtures alone.",
    status: "final",
    sources: [],
  },
  "plumbing/complete-bathroom-remodeling": {
    question: "Do I need a complete bathroom remodel or a fixture replacement in {city}?",
    answer: "Replace individual fixtures when the room's layout works and the surrounding surfaces are sound. A complete remodel fits a project that changes the layout, shower, tub or accessibility and needs coordinated construction, electrical and plumbing work. Set the full scope before choosing finishes. Include ventilation, hot-water needs and water-efficient fixtures in the plan, not just what the finished room looks like.",
    status: "final",
    sources: [SOURCES.hiring, SOURCES.bathroom, SOURCES.ventilation],
  },
  "plumbing/leak-detection": {
    question: "How do I find out whether I have a hidden water leak in {city}?",
    answer: "An unexplained rise in water use, damp surfaces or water sounds when fixtures are off warrant an inspection. A visible drip may need a fixture repair; hidden moisture needs its source located before walls or floors are opened. Leak-monitoring equipment can flag unusual use, but it does not replace finding and repairing the cause.",
    status: "final",
    sources: [SOURCES.leaks],
  },
  "plumbing/burst-pipe-repair": {
    question: "What should I do about a burst water pipe in {city}?",
    answer: "Stop the water at the main shutoff if you can reach it safely, then call a plumber. Stay away from water near electrical equipment. A damaged section may be replaceable without repiping the house. Once the leak is controlled, check why it failed, including freezing exposure or deterioration, and address water damage as well as the pipe.",
    status: "final",
    sources: [SOURCES.frozenPipes],
  },
  "plumbing/piping-and-repiping": {
    question: "Does my home in {city} need a whole-house repipe?",
    answer: "One isolated leak does not establish that every pipe needs replacement. A section repair fits limited damage; repeated leaks throughout the house, extensive corrosion or failing supply piping justify a repiping assessment. Ask which pipes are affected, what material will replace them and how walls and finishes will be restored. Base the scope on inspected condition, not the home's age alone.",
    status: "final",
    sources: [],
  },
  "plumbing/trenchless-water-line-repair": {
    question: "Can my water line in {city} be replaced without digging up the whole yard?",
    answer: "Trenchless replacement can reduce digging along a buried water line, but access points are still needed. The route, nearby utilities, pipe condition and approved replacement material determine whether it fits. A localized leak may need a smaller repair instead. Compare excavation and surface restoration in both quotes, and confirm permits and inspections with the local authority.",
    status: "final",
    sources: [SOURCES.trenchlessWater, SOURCES.waterLines],
  },
  "plumbing/gas-line-repair-and-installation": {
    question: "Who should I call about a gas line problem in {city}?",
    answer: "If you smell gas or suspect a leak, leave the area immediately and call the gas utility or 911 from a safe location. Do not stay inside to find the leak or operate switches. For planned appliance work, have a qualified contractor check the gas supply, appliance demand and permit requirements before deciding whether an existing line can be reused or needs replacement.",
    status: "final",
    sources: [SOURCES.gasSafety, SOURCES.tankless],
  },
  "plumbing/toilet-repair-and-installation": {
    question: "Should I repair or replace my toilet in {city}?",
    answer: "A running toilet may need a flapper or another replaceable part, not a new toilet. Have recurring clogs or leaks diagnosed before buying a replacement because the drain or connection may be responsible. If repairs will not restore reliable operation, compare replacement options. WaterSense-labeled toilets meet independent water-efficiency and flushing-performance criteria.",
    status: "final",
    sources: [SOURCES.leaks, SOURCES.bathroom],
  },
  "plumbing/garbage-disposals": {
    question: "Should I repair or replace my garbage disposal in {city}?",
    answer: "Locate the leak or blockage before replacing the disposal. A leaking discharge connection can require a connection or damaged-part repair rather than a new unit. If the disposal itself has failed, compare the repair, warranty coverage and replacement cost. Leave electrical work and internal repairs to a qualified professional; never put your hand inside the disposal.",
    status: "final",
    sources: [SOURCES.disposal],
  },
  "plumbing/sump-pumps": {
    question: "Does my sump pump in {city} need repair, replacement or a backup?",
    answer: "Have the pump, switch and discharge checked before deciding the pump is too small or worn out. Repair a correctable fault; replace equipment that cannot reliably handle the water entering the pit. A battery backup addresses a different risk: loss of power or failure of the primary pump. It adds protection but still needs maintenance and does not guarantee a dry basement.",
    status: "final",
    sources: [SOURCES.sump, SOURCES.sumpDiagnosis],
  },
  "plumbing/faucets-fixtures-and-sinks": {
    question: "Should I repair or replace my faucets and sinks in {city}?",
    answer: "A worn seal or replaceable faucet part can be worth repairing when the fixture is otherwise sound. Replacement fits a damaged fixture, unavailable repair parts or a planned change in how you use the room. Check leaks beneath the sink as well as visible drips. For bathroom faucets, WaterSense labeling identifies products tested for water efficiency and performance.",
    status: "final",
    sources: [SOURCES.leaks, SOURCES.bathroom],
  },
  "plumbing/showers-and-tubs": {
    question: "Can my shower or tub in {city} be repaired instead of replaced?",
    answer: "A leaking valve, showerhead or drain can need a targeted repair rather than a new shower or tub. Water escaping into walls or floors needs its source checked before cosmetic work. If you want a different layout, tub or shower system, plan the construction and plumbing together. Compare showerheads for tested spray performance as well as water use.",
    status: "final",
    sources: [SOURCES.showers],
  },
  "water-heaters": {
    question: "Should I repair or replace my water heater in {city}?",
    answer: "Repair can make sense for a replaceable part in an otherwise sound heater. A leaking tank, repeated failures or an aging unit makes replacement more compelling. Rheem advises comparing replacement when repair exceeds half the price of a new unit, especially as a tank approaches its typical 8-to-12-year lifespan. That is a decision guide, not an automatic cutoff. Size the replacement for peak household use, then compare tank, tankless and heat-pump installation requirements.",
    status: "final",
    sources: [SOURCES.waterHeaterRepair, SOURCES.waterHeaterSizing],
  },
  "water-heaters/electric-water-heaters": {
    question: "Should I choose a standard electric or heat pump water heater in {city}?",
    answer: "A standard electric tank can fit an existing installation with limited space, but compare a heat pump model's lower energy use before replacing like for like. Heat pump equipment needs suitable air space, temperature conditions, drainage and electrical service. Match the tank's first-hour rating to the household's busiest hot-water period, not the number of bedrooms alone.",
    status: "final",
    sources: [SOURCES.heatPumpWater, SOURCES.heatPumpDesign, SOURCES.waterHeaterSizing],
  },
  "water-heaters/gas-water-heaters": {
    question: "Should I replace my gas water heater with another gas model in {city}?",
    answer: "Compare another gas tank when the existing gas supply and venting are suitable, but have both checked rather than assuming they can be reused. A heat pump water heater is an electric alternative when the space and electrical supply fit. For any tank, compare first-hour capacity against the showers and appliances used during your busiest hour. Household size alone does not settle the choice.",
    status: "final",
    sources: [SOURCES.tankless, SOURCES.heatPumpDesign, SOURCES.waterHeaterSizing],
  },
  "water-heaters/tankless-water-heaters": {
    question: "Is a tankless water heater a good fit for my home in {city}?",
    answer: "Tankless fits homes that want hot water without storing a large tank, provided the unit can supply the fixtures running at the same time. Size it for simultaneous flow and incoming water temperature, not a fixed household-size rule. A gas model also needs adequate gas supply and approved venting. Compare the full installation and maintenance requirements with a tank or heat pump model before choosing.",
    status: "final",
    sources: [SOURCES.tankless, SOURCES.heatPumpWater],
  },
  "water-heaters/heat-pump-water-heaters": {
    question: "Will a heat pump water heater work in my home in {city}?",
    answer: "A heat pump water heater is worth comparing when you want to reduce electric water-heating use and have a suitable installation space. Check airflow, operating temperature, noise, condensate drainage and the model's electrical requirements. Choose capacity for peak demand; frequent simultaneous showers can require more stored hot water. If the location cannot meet the manufacturer's requirements, compare ducting, another location or a different heater type.",
    status: "final",
    sources: [SOURCES.heatPumpWater, SOURCES.heatPumpDesign],
  },
  "drain-sewer": {
    question: "Do my blocked drains in {city} need cleaning or sewer repair?",
    answer: "A removable obstruction in sound pipe calls for cleaning. Repeated backups can also indicate damaged pipe, roots or a displaced joint, so ask for evidence of the cause before agreeing to repeat cleaning or replacement. A camera inspection helps distinguish those problems. If sewage is backing up, stop using affected fixtures and arrange urgent professional service rather than continuing to send water down the line.",
    status: "final",
    sources: [SOURCES.drainCleaning],
  },
  "drain-sewer/drain-cleaning": {
    question: "Is drain cleaning enough to fix recurring clogs in {city}?",
    answer: "Cleaning is appropriate when buildup or a removable obstruction blocks otherwise serviceable pipe. When the clog returns, have the line inspected rather than assuming another clearing will solve it. The best method depends on the blockage, pipe size and condition. Broken or displaced pipe needs a repair plan; a larger cleaning machine does not correct the damage.",
    status: "final",
    sources: [SOURCES.drainCleaning],
  },
  "drain-sewer/hydrojetting": {
    question: "Is hydrojetting the right fix for my drains in {city}?",
    answer: "Hydrojetting uses pressurized water to remove grease, soap and sludge from a line. It fits buildup that needs more than opening a path through a clog, but the contractor must assess whether the pipe can tolerate the method. A damaged or collapsed sewer needs repair, not a promise that jetting will restore it. Ask what the inspection shows and why jetting suits that pipe.",
    status: "final",
    sources: [SOURCES.jetting, SOURCES.trenchlessWater],
  },
  "drain-sewer/sewer-line-repair-and-replacement": {
    question: "Should I repair one sewer section or replace the line in {city}?",
    answer: "A localized defect can justify a spot repair. Damage along much of the line can make rehabilitation or replacement the better comparison. Ask to see the inspection findings, including breaks, offsets and roots. Pipe condition, alignment and access determine whether lining, pipe bursting or excavation fits; repeated backups alone do not prove that the entire sewer must be replaced.",
    status: "final",
    sources: [SOURCES.sewerRepair],
  },
  "drain-sewer/trenchless-sewer-repair": {
    question: "Can trenchless sewer repair work for my property in {city}?",
    answer: "Trenchless work can reduce excavation where the pipe and access allow it. Lining repairs suitable existing pipe; pipe bursting replaces it along the existing route. A collapsed section or an alignment problem may need excavation. Compare the inspected condition, access holes and surface restoration in each proposal. Trenchless does not mean no digging, and it is not the right method for every sewer.",
    status: "final",
    sources: [SOURCES.sewerRepair, SOURCES.trenchlessWater],
  },
  "water-filtration": {
    question: "Which water filtration system should I install in {city}?",
    answer: "Start with your utility's water-quality report or a water test, then identify the problem you want treated. A drinking-water filter can suit one kitchen tap; a whole-home system treats all incoming water and needs a reason to do so. Choose a product certified for the specific contaminant. A softener, carbon filter, reverse-osmosis system and UV unit solve different problems; no single treatment removes everything.",
    status: "final",
    sources: [SOURCES.filterSelection],
  },
  "water-filtration/water-softeners": {
    question: "Does my home in {city} need a water softener?",
    answer: "A softener fits water with measured hardness that causes scale or soap problems. Test first rather than assuming every local home needs one. Size it for hardness and water use, and compare salt use, regeneration water and maintenance. Softening targets minerals such as calcium and magnesium; it does not replace treatment for germs or every other contaminant.",
    status: "final",
    sources: [SOURCES.waterTreatment, SOURCES.homeTreatment],
  },
  "water-filtration/carbon-filters": {
    question: "Is a carbon filter enough for my water in {city}?",
    answer: "A carbon filter can suit chlorine taste and odor, or a specific contaminant listed in its certification. It is not a universal purifier or a substitute for disinfection. For drinking and cooking alone, compare an under-sink system before treating the whole house. Follow the replacement schedule: a filter needs maintenance even when the water still tastes fine.",
    status: "final",
    sources: [SOURCES.filterSelection, SOURCES.waterTreatment],
  },
  "water-filtration/reverse-osmosis": {
    question: "Should I install reverse osmosis for drinking water in {city}?",
    answer: "Reverse osmosis fits a drinking-water treatment goal that a simpler filter cannot meet, when the selected unit is certified for the substances of concern. An under-sink installation treats water for drinking and cooking without treating every tap. Compare filter and membrane replacement, available space and wastewater use. A WaterSense-labeled system uses less reject water than less-efficient models; RO does not remove every contaminant.",
    status: "final",
    sources: [SOURCES.waterTreatment, SOURCES.homeTreatment],
  },
  "water-filtration/iron-and-sulfur-filters": {
    question: "What treats iron stains or sulfur odors in my water in {city}?",
    answer: "Test the water and identify the source before selecting equipment. Iron and manganese staining can need different treatment from a hydrogen-sulfide odor, and the right method depends on concentration and water chemistry. An odor limited to hot water can point to the water heater rather than the whole supply. Do not assume one general-purpose filter will solve every stain or smell.",
    status: "final",
    sources: [SOURCES.iron, SOURCES.sulfur],
  },
  "water-filtration/uv-treatment": {
    question: "When does UV water treatment make sense in {city}?",
    answer: "UV treatment suits a confirmed need to disinfect water when the equipment and pre-filtration match the water conditions. It treats germs; it does not remove dissolved chemicals or hardness. Test first and check the system's certification. Follow the manufacturer's lamp and cleaning schedule, and use any required treatment alongside UV rather than expecting the lamp to solve every water-quality problem.",
    status: "final",
    sources: [SOURCES.homeTreatment],
  },
  "heating-cooling": {
    question: "Should I repair or replace my heating and cooling system in {city}?",
    answer: "A repair can make sense when a defined fault affects otherwise sound equipment. Compare replacement when breakdowns recur, comfort remains poor or energy use rises. ENERGY STAR flags furnaces and boilers over 15 years old and heat pumps or air conditioners over 10 as reasons to consider replacement, not automatic deadlines. Have airflow, ducts and the home's heating needs checked before assuming new equipment alone will solve the problem.",
    status: "final",
    sources: [SOURCES.heatingReplacement, SOURCES.heatingInstallation],
  },
  "heating-cooling/heating": {
    question: "Should I choose a furnace or heat pump for my home in {city}?",
    answer: "A heat pump is worth comparing when you want both heating and cooling from one system. The choice depends on the home's heating load, existing ducts, electrical supply and fuel costs, not one rule for every house. If you already have a sound furnace, compare repair or a compatible heat-pump addition before replacing the whole system. Ask how the proposed equipment will perform during cold weather.",
    status: "final",
    sources: [SOURCES.heatPump],
  },
  "heating-cooling/ventilation": {
    question: "Why does my bathroom or kitchen in {city} need better ventilation?",
    answer: "An exhaust fan that vents outdoors removes moisture where it is produced. Persistent condensation or musty smells call for checking airflow, the vent route and possible leaks, not simply installing a bigger fan. A room exhaust problem and a whole-home fresh-air problem need different assessments. Fix the source of excess moisture as well as how the room is ventilated.",
    status: "final",
    sources: [SOURCES.ventilation],
  },
  "heating-cooling/air-conditioning": {
    question: "Should I repair my air conditioner or install a heat pump in {city}?",
    answer: "Have poor cooling diagnosed before replacing the unit: airflow, coils and refrigerant problems can affect performance. Compare replacement when failures recur or the system is aging. If you also need heating, compare a heat pump instead of a cooling-only replacement. Size either choice to the home; oversized equipment can cycle too often and leave comfort problems unresolved.",
    status: "final",
    sources: [SOURCES.heatingMaintenance, SOURCES.heatPump, SOURCES.heatingInstallation],
  },
  "heating-cooling/installation": {
    question: "What matters when installing a furnace, heat pump or air conditioner in {city}?",
    answer: "Start with the home's actual heating and cooling needs rather than copying the old unit's size. Compare a furnace for heating with a heat pump for heating and cooling, then check the required fuel or electrical supply. The installation scope should include ducts, airflow, controls and commissioning. A high efficiency rating cannot compensate for the wrong size or a poor installation.",
    status: "final",
    sources: [SOURCES.heatingInstallation, SOURCES.heatPump],
  },
  "heating-cooling/maintenance": {
    question: "When should I service my furnace, heat pump or air conditioner in {city}?",
    answer: "Arrange professional checks before the season when you need the equipment most. ENERGY STAR recommends annual pre-season maintenance, with cooling checked in spring and heating in fall. Service should address controls, connections, airflow and the equipment-specific components, not only replace a filter. Report unusual noises, leaks or repeated shutdowns when booking; a developing fault may need repair rather than routine maintenance alone.",
    status: "final",
    sources: [SOURCES.heatingMaintenance],
  },
  "heating-cooling/repair": {
    question: "Is my furnace, heat pump or air conditioner in {city} worth repairing?",
    answer: "Ask for the failed part, repair price and overall condition before deciding. A contained fault in maintained equipment can justify repair; recurring breakdowns and rising bills justify a replacement comparison. Check warranty coverage and whether airflow or duct problems caused the failure. There is no useful universal repair-price cutoff without the installed replacement cost and the condition of the rest of the system.",
    status: "final",
    sources: [SOURCES.heatingRepair],
  },
  "heating-cooling/emergency-service": {
    question: "What should I do when my heating system fails in {city}?",
    answer: "A gas smell is a safety emergency: leave the area and call the utility or 911 from outside. For a heating failure without immediate danger, request service and confirm when someone can attend. Tell the contractor the equipment type, symptoms and any displayed error code. Do not bypass safety controls or attempt gas or electrical repairs to get the system running.",
    status: "final",
    sources: [SOURCES.gasSafety, SOURCES.hydronicDiagnosis],
  },
  boilers: {
    question: "Should I repair or replace my boiler in {city}?",
    answer: "A failed pump, valve or control can need repair without replacing a sound boiler. First establish whether the problem is heat production or circulation around the home. Consider replacement when failures recur, efficiency is poor or the boiler's condition makes repair uneconomic. ENERGY STAR flags boilers over 15 years old for a replacement assessment, not mandatory retirement. Compare the full installed scope and compatibility with your radiators, baseboards or heated floors.",
    status: "final",
    sources: [SOURCES.radiantDiagnosis, SOURCES.heatingReplacement],
  },
  "boilers/hydronic-heating": {
    question: "Why is one heating zone cold in my home in {city}?",
    answer: "When some rooms heat and others do not, the fault can be a thermostat, zone valve, pump, trapped air or restricted water flow rather than the boiler itself. A hydronic technician should trace the affected zone before recommending replacement. Describe which rooms stay cold and whether the problem is constant or intermittent. Repair the identified circulation or control fault when the rest of the system is sound.",
    status: "final",
    sources: [SOURCES.hydronicDiagnosis],
  },
  "boilers/radiant-floor-heating": {
    question: "Will radiant floor heating work in my home in {city}?",
    answer: "Radiant floors suit projects where the floor assembly, insulation and heat source can meet the room's heating needs. Flooring materials affect heat output, so assess the complete construction before choosing a system. If an existing floor is cold, check water flow, controls and insulation before assuming its tubing or boiler must be replaced. Electric floor warming and water-based whole-room heating need different designs.",
    status: "final",
    sources: [SOURCES.radiantDesign, SOURCES.radiantDiagnosis],
  },
  "boilers/annual-boiler-service": {
    question: "Does my boiler in {city} need annual service if it still heats?",
    answer: "Yes. Follow the manufacturer's maintenance schedule, including an annual qualified inspection where specified. Heat alone does not show that combustion, venting, safety controls and water-side components are working correctly. The exact service depends on the model and condition. Report leaks, repeated lockouts or unusual noises rather than waiting for the next annual visit; those symptoms need diagnosis.",
    status: "final",
    sources: [SOURCES.boilerMaintenance],
  },
  "boilers/boiler-repair": {
    question: "Can a boiler repair restore heat to my home in {city}?",
    answer: "A repair can restore heat when the problem is an identifiable component and the boiler remains serviceable. No heat can come from controls, pumps, air or inadequate flow as well as the burner. Have the complete system diagnosed before approving a boiler replacement. Repeated failures or serious deterioration call for a repair-versus-replacement comparison. Gas odors require leaving the area and calling the utility or 911, not troubleshooting indoors.",
    status: "final",
    sources: [SOURCES.hydronicDiagnosis, SOURCES.gasSafety],
  },
  "boilers/boiler-replacement": {
    question: "When is boiler replacement the better choice in {city}?",
    answer: "Compare replacement when an aging boiler needs frequent repairs or no longer heats efficiently. Condition, repair history and comfort matter more than age alone. A repairable valve fault is different from a deteriorating boiler. Ask how the replacement will work with your existing heating system, and compare the complete installation rather than only the boiler's purchase price.",
    status: "final",
    sources: [SOURCES.boilerReplacement],
  },
};
