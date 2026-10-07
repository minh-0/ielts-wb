"""
IELTS Academic Task 1 Data - Part 3 (Questions 51-75)
Themes:
6. Industrial & Manufacturing Processes (Q51-Q60)
7. Natural Life Cycles & Biological Cycles (Q61-Q70)
8. Maps & Urban Redevelopment (Q71-Q75)
"""

QUESTIONS_PART3 = [
    # -------------------------------------------------------------
    # Q51: Process - Plastic Bottle Recycling to Fleece
    # -------------------------------------------------------------
    {
        "id": "t1-acad-051",
        "category": "Process Diagram",
        "title": "Recycling Plastic Bottles into Synthetic Fleece Fibres",
        "prompt": "The diagram illustrates the industrial process of transforming post-consumer plastic bottles into synthetic fleece fabric. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Plastic Bottle to Fleece Recycling Cycle",
            "steps": [
                ("Step 1", "Collection & Sorting", "Plastic PET bottles collected and sorted by colour"),
                ("Step 2", "Washing & Shredding", "Bottles sanitized and shredded into tiny flakes"),
                ("Step 3", "Melting & Extrusion", "Clean flakes melted into liquid and extruded as thread"),
                ("Step 4", "Spinning & Weaving", "Threads spun into yarn and woven into fleece fabric"),
            ]
        },
        "modelEssay": (
            "The flowchart illustrates the sequential mechanical and thermal stages involved in recycling post-consumer plastic PET bottles into synthetic polyester fleece fabric.\n\n"
            "Overall, the manufacturing process comprises four principal phases: initial collection and sorting, sanitization and mechanical shredding, thermal melting and filament extrusion, and final textile spinning and weaving into wearable fleece cloth.\n\n"
            "The cycle initiates with the gathering of discarded plastic bottles from municipal collection centers, where they are sorted by plastic composition and color. Following sorting, the bottles are thoroughly sanitized to strip labels and contaminants, after which high-speed industrial shredders pulverize the plastic bodies into uniform, miniature flakes.\n\n"
            "In the subsequent thermal phase, the clean plastic flakes enter industrial furnaces where they are melted down into a viscous liquid polymer. This molten substance is pressurized and forced through microscopic extrusion nozzles to form continuous filament threads. Finally, these fine synthetic threads are gathered, spun into durable yarn, and knitted on automated looms into thick, insulating polyester fleece garments."
        )
    },
    # -------------------------------------------------------------
    # Q52: Process - Commercial Chocolate Production
    # -------------------------------------------------------------
    {
        "id": "t1-acad-052",
        "category": "Process Diagram",
        "title": "Industrial Chocolate Manufacturing from Cocoa Pods",
        "prompt": "The diagram illustrates the process of commercial chocolate production from cocoa beans to finished confectionery. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Commercial Chocolate Manufacturing Process",
            "steps": [
                ("Stage 1", "Harvest & Fermentation", "Ripe cocoa pods gathered; seeds fermented and dried"),
                ("Stage 2", "Roasting & Cracking", "Beans roasted at high heat; husks cracked and winnowed"),
                ("Stage 3", "Grinding & Conch-Refining", "Cocoa nibs ground into liquor; sugar and milk added"),
                ("Stage 4", "Tempering & Moulding", "Liquid chocolate cooled, moulded into bars, and wrapped"),
            ]
        },
        "modelEssay": (
            "The process flow diagram outlines the four major agricultural and manufacturing stages involved in producing commercial chocolate bars from raw cocoa pods.\n\n"
            "Overall, chocolate fabrication represents a multi-phase transformation beginning with agricultural harvesting and drying, advancing through thermal roasting and refining, and concluding with tempering and final packaging.\n\n"
            "In the initial harvesting phase, ripe cocoa pods are gathered from cacao trees and cleaved open to extract the wet seeds, which undergo fermentation in wooden boxes for several days before being sun-dried. Once transported to confectionery factories, the dried beans are roasted in rotary ovens to develop characteristic aromas and flavors, after which mechanical winnowers crack open the brittle outer shells to isolate the inner nibs.\n\n"
            "The cocoa nibs then undergo heavy stone grinding, transforming into a thick liquid known as cocoa liquor. During the conching stage, essential ingredients including cocoa butter, sugar, and milk powder are blended under continuous agitation. Lastly, the refined mixture undergoes precise thermal tempering before being poured into bar moulds, cooled into solid bars, and wrapped for retail sale."
        )
    },
    # -------------------------------------------------------------
    # Q53: Process - Hydroelectric Power Generation
    # -------------------------------------------------------------
    {
        "id": "t1-acad-053",
        "category": "Process Diagram",
        "title": "Hydroelectric Power Generation in a Mountain Dam",
        "prompt": "The diagram illustrates how electricity is generated and distributed using a hydroelectric dam system. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Hydroelectric Dam Electricity Generation",
            "steps": [
                ("Stage 1", "Reservoir Storage", "River water collected behind massive concrete dam"),
                ("Stage 2", "Intake & Penstock", "Control gates open; water rushes down steep penstock"),
                ("Stage 3", "Turbine Rotation", "High-pressure water spins turbine blades rapidly"),
                ("Stage 4", "Generator & Grid", "Generator converts kinetic motion into electricity"),
            ]
        },
        "modelEssay": (
            "The technical diagram illustrates the mechanical mechanisms through which water stored behind a dam is converted into electrical energy for residential and industrial consumption.\n\n"
            "Overall, the hydroelectric generation cycle relies on gravitational potential energy converting into kinetic energy to spin turbines, which power electromagnetic generators that feed high-voltage transmission lines.\n\n"
            "The process commences with natural river flow being impounded behind a tall concrete barrier, creating an elevated reservoir that accumulates significant potential energy. When electricity generation is initiated, intake control gates at the dam base are opened, allowing water to rush down an enclosed, inclined tunnel known as the penstock under increasing hydraulic pressure.\n\n"
            "At the terminus of the penstock, the pressurized water impacts the blades of an underground water turbine, forcing it to rotate at high velocity. This rotational energy drives an connected generator shaft, converting mechanical torque into electrical current. Transformers step up the voltage before electricity is fed into the national transmission grid, while spent water flows harmlessly into the lower river."
        )
    },
    # -------------------------------------------------------------
    # Q54: Process - Municipal Water Purification
    # -------------------------------------------------------------
    {
        "id": "t1-acad-054",
        "category": "Process Diagram",
        "title": "Municipal Drinking Water Purification and Treatment",
        "prompt": "The diagram illustrates the sequential stages involved in purifying raw water from a river into potable drinking water for households. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Municipal Water Treatment and Purification Cycle",
            "steps": [
                ("Stage 1", "Screening & Coagulation", "Coarse debris filtered; chemical coagulants added"),
                ("Stage 2", "Sedimentation", "Heavy suspended particles settle to tank bottom"),
                ("Stage 3", "Sand & Carbon Filtration", "Water passes through multi-layer sand and charcoal"),
                ("Stage 4", "Chlorination & Storage", "Disinfection chemicals added before clean distribution"),
            ]
        },
        "modelEssay": (
            "The diagram delineates the multi-stage chemical and physical treatment cycle utilized by municipal treatment facilities to convert raw river water into clean drinking water.\n\n"
            "Overall, water purification comprises four critical stages: physical screening and chemical coagulation, sedimentation settling, multi-tier filtration, and final sanitization before urban pipeline distribution.\n\n"
            "The procedure begins when raw water is pumped from the river through coarse mesh screens that capture large floating debris such as branches and leaves. Chemical coagulants like aluminum sulfate are then blended into the water, causing microscopic impurities to clump together into larger flocs. In the sedimentation basin, water velocity slows, enabling these heavy flocculated particulates to gravitate to the tank floor for mechanical removal.\n\n"
            "Subsequently, the clarified water percolates through deep filtration beds composed of graded sand, gravel, and activated carbon, which filter out residual microorganisms and unpleasant odors. In the final stage, trace chlorine or ozone is injected to eliminate all remaining pathogens, after which clean drinking water is pumped to covered municipal storage towers for domestic distribution."
        )
    },
    # -------------------------------------------------------------
    # Q55: Process - Cement and Concrete Production
    # -------------------------------------------------------------
    {
        "id": "t1-acad-055",
        "category": "Process Diagram",
        "title": "Portland Cement Manufacturing and Concrete Mixing",
        "prompt": "The diagram shows the stages in the production of cement and how cement is subsequently used to produce concrete for construction. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Cement Production and Concrete Preparation",
            "steps": [
                ("Stage 1", "Crushing & Mixing", "Limestone and clay crushed and blended into powder"),
                ("Stage 2", "Rotating Kiln Heat", "Powder roasted in rotating kiln at 1450°C"),
                ("Stage 3", "Grinding to Cement", "Cooled clinker ground with gypsum into fine cement"),
                ("Stage 4", "Concrete Formulation", "15% cement mixed with 10% water, 25% sand, 50% gravel"),
            ]
        },
        "modelEssay": (
            "The diagram illustrates the industrial manufacturing process of Portland cement and its subsequent formulation into concrete for the construction sector.\n\n"
            "Overall, the production involves two distinct procedures: the thermal and mechanical processing of raw minerals into cement powder, followed by the proportional batching of cement with aggregates and water to produce concrete.\n\n"
            "In the first phase of cement manufacturing, mined limestone and clay are fed into heavy crushers to produce a uniform mineral powder. This raw meal passes into a cylindrical rotating kiln where it is subjected to intense thermal roasting at approximately 1,450°C. Upon exiting the kiln, the cooled mineral clinker is combined with a small measure of gypsum and finely pulverized in a ball mill to produce bagged cement.\n\n"
            "To manufacture concrete, the finished cement constitutes merely 15% of the total mixture. It is combined with 10% water, 25% fine sand, and a dominant 50% gravel aggregate within a rotating mixer drum, producing viscous liquid concrete ready for building foundations."
        )
    },
    # -------------------------------------------------------------
    # Q56: Process - Paper Recycling Cycle
    # -------------------------------------------------------------
    {
        "id": "t1-acad-056",
        "category": "Process Diagram",
        "title": "Commercial Waste Paper De-inking and Re-pulping",
        "prompt": "The diagram illustrates the industrial process of recycling collected waste paper into fresh paper sheets. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Industrial Paper Recycling Process",
            "steps": [
                ("Step 1", "Collection & Sorting", "Waste paper collected, shredded, and sorted by grade"),
                ("Step 2", "Pulping & De-inking", "Paper soaked in hot water; air bubbles remove ink"),
                ("Step 3", "Bleaching & Refining", "Clean pulp bleached with hydrogen peroxide"),
                ("Step 4", "Pressing & Rolling", "Slurry pressed through rollers and dried into paper"),
            ]
        },
        "modelEssay": (
            "The flowchart outlines the sequential industrial stages through which discarded waste paper is recycled into new paper products.\n\n"
            "Overall, the recycling cycle transitions through mechanical sorting, chemical pulping and flotation de-inking, chemical bleaching, and mechanical roller pressing to yield finished paper rolls.\n\n"
            "The process begins with the municipal collection of discarded newspapers, cardboard, and office documents, which are sorted into grades and passed through shredding blades. The shredded material is transferred into large industrial hydrapulpers containing hot water and mild solvents, dissolving the paper into a fibrous slurry. In the flotation de-inking chamber, surfactant chemicals and injected air bubbles adhere to ink particles, carrying them to the surface as froth for skimming.\n\n"
            "The purified cellulose fibers are subsequently treated with eco-friendly hydrogen peroxide bleach to restore whiteness. Finally, the wet pulp is pumped onto vibrating conveyor screens, where high-pressure heated rollers squeeze out moisture and compress the interwoven fibers into continuous paper reels ready for commercial cutting."
        )
    },
    # -------------------------------------------------------------
    # Q57: Process - Seawater Desalination
    # -------------------------------------------------------------
    {
        "id": "t1-acad-057",
        "category": "Process Diagram",
        "title": "Seawater Desalination via Reverse Osmosis",
        "prompt": "The diagram shows the industrial process of desalinating ocean water to produce potable drinking water. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Seawater Reverse Osmosis Desalination Plant",
            "steps": [
                ("Stage 1", "Ocean Intake", "Raw seawater pumped from ocean through intake screens"),
                ("Stage 2", "Pre-treatment Filters", "Sand and cartridge filters remove sediment and algae"),
                ("Stage 3", "High-Pressure RO", "Water forced through semi-permeable membranes (70 bar)"),
                ("Stage 4", "Mineralizing & Supply", "Clean water remineralized; concentrated brine discharged"),
            ]
        },
        "modelEssay": (
            "The schematic diagram depicts the four operational stages employed in a seawater reverse osmosis desalination facility to generate potable freshwater from the ocean.\n\n"
            "Overall, the facility relies on physical intake screening, chemical and particulate pre-treatment, high-pressure membrane separation, and post-treatment remineralization, alongside the safe disposal of concentrated brine.\n\n"
            "The operation commences at the ocean seabed, where large submerged pumps extract raw seawater through coarse protective grates that prevent marine life ingestion. The intake water is conveyed into pre-treatment filtration units, where dual-media sand filters and fine micro-cartridges strip out suspended silt, organic debris, and microscopic algae that could foul sensitive equipment.\n\n"
            "In the core desalination stage, high-pressure industrial pumps elevate water pressure to roughly 70 bar, forcing it against spiral-wound semi-permeable membranes. These membranes allow water molecules to permeate while blocking salt ions and minerals. The resulting purified permeate is balanced with calcium and magnesium for human consumption and piped into the city network, while the rejected hypersaline brine is pumped back into deep offshore currents."
        )
    },
    # -------------------------------------------------------------
    # Q58: Process - Olive Oil Production
    # -------------------------------------------------------------
    {
        "id": "t1-acad-058",
        "category": "Process Diagram",
        "title": "Cold-Pressed Extra Virgin Olive Oil Extraction",
        "prompt": "The diagram illustrates how olives are processed into cold-pressed olive oil in a commercial mill. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Extra Virgin Olive Oil Extraction Process",
            "steps": [
                ("Step 1", "Harvest & Washing", "Olives harvested, defoliated, and rinsed in cold water"),
                ("Step 2", "Crushing & Malaxation", "Fruit crushed into paste; stirred slowly for 45 mins"),
                ("Step 3", "Centrifuge Separation", "Decanter centrifuge separates oil, water, and pomace"),
                ("Step 4", "Filtration & Bottling", "Oil filtered through cellulose and bottled in dark glass"),
            ]
        },
        "modelEssay": (
            "The flowchart illustrates the sequential mechanical stages involved in the commercial extraction of cold-pressed extra virgin olive oil from freshly harvested olives.\n\n"
            "Overall, the extraction relies purely on physical and mechanical techniques without chemical additives, transitioning from cleaning and crushing to malaxation, centrifugal separation, and final bottling.\n\n"
            "The production cycle begins in the olive grove where ripe fruit is gathered from trees and conveyed to the processing mill. Air blowers defoliate twigs and leaves before the olives undergo washing under cold water jets. Next, heavy stainless steel hammer crushers pulverize the whole olives—including the pits—into a coarse paste. This paste is transferred into temperature-controlled malaxation vats, where it is gently stirred for 45 minutes at under 27°C to encourage microscopic oil droplets to coalesce.\n\n"
            "The malaxated paste is subsequently pumped into a high-speed horizontal decanter centrifuge, which separates solid husk pomace, vegetation wastewater, and golden oil by density. Finally, the raw oil is clarified through natural cellulose filters and bottled in dark UV-protective glass bottles to preserve freshness."
        )
    },
    # -------------------------------------------------------------
    # Q59: Process - Glass Bottle Recycling
    # -------------------------------------------------------------
    {
        "id": "t1-acad-059",
        "category": "Process Diagram",
        "title": "Closed-Loop Glass Bottle Recycling and Remanufacturing",
        "prompt": "The diagram shows the closed-loop recycling process of used glass bottles into newly moulded containers. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Closed-Loop Glass Bottle Recycling Cycle",
            "steps": [
                ("Phase 1", "Collection & Sorting", "Consumers deposit bottles; sorted by clear, green, brown"),
                ("Phase 2", "Crushing & Cullet", "Bottles crushed into cullet; labels and caps removed"),
                ("Phase 3", "Furnace Smelting", "Cullet melted with sand, soda ash, limestone at 1500°C"),
                ("Phase 4", "Blow Moulding", "Molten gobs blown into moulds to form new bottles"),
            ]
        },
        "modelEssay": (
            "The diagram delineates the continuous circular lifecycle through which discarded glass containers are collected, recycled, and remanufactured into fresh bottles.\n\n"
            "Overall, glass recycling forms a 100% closed-loop system comprising consumer deposition, optical color segregation, mechanical crushing into cullet, high-temperature furnace smelting, and pneumatic blow moulding.\n\n"
            "The cycle begins when citizens return used bottles to municipal recycling banks. Specialized trucks transport the glass to processing facilities, where optical scanners sort the containers into clear, amber, and green batches. The sorted bottles are fed through impact crushers, transforming them into small fragments known as cullet, while magnetic separators and air classifiers remove metallic bottle caps and paper labels.\n\n"
            "In the manufacturing phase, the clean cullet is blended with virgin sand, soda ash, and limestone, reducing furnace melting temperatures. The mixture is heated to 1,500°C in gas-fired furnaces to form molten glass. Shear blades cut glowing gobs of liquid glass, which drop into automated moulds where pressurized air inflates them into brand-new bottles ready for commercial refilling."
        )
    },
    # -------------------------------------------------------------
    # Q60: Process - Instant Noodle Manufacturing
    # -------------------------------------------------------------
    {
        "id": "t1-acad-060",
        "category": "Process Diagram",
        "title": "Industrial Production and Packaging of Cup Instant Noodles",
        "prompt": "The diagram illustrates the factory assembly line process for producing cup instant noodles. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Instant Cup Noodle Manufacturing Line",
            "steps": [
                ("Stage 1", "Dough Kneading & Rolling", "Flour, water, and salt mixed into dough and sheeted"),
                ("Stage 2", "Wavy Slitting & Steaming", "Sheets cut into wavy strands and steam-cooked at 100°C"),
                ("Stage 3", "Flash-Frying & Cooling", "Noodles dried in hot palm oil at 140°C to dehydrate"),
                ("Stage 4", "Cup Assembly & Sealing", "Noodle blocks inserted into cups with soup sachets"),
            ]
        },
        "modelEssay": (
            "The assembly line diagram depicts the continuous industrial workflow employed to manufacture and package dehydrated instant cup noodles in a commercial food factory.\n\n"
            "Overall, production involves four core stages: dough mixing and sheeting, continuous slitting and steam cooking, high-temperature flash-frying for preservation, and final automated cup assembly with flavor seasoning.\n\n"
            "The manufacturing starts with silos dispensing wheat flour, salt, and alkaline water into high-capacity industrial mixers. Once kneaded, the dough passes through consecutive compression rollers that flatten it into thin continuous sheets. Rotary slitter blades cut the dough into long strands, while conveyor speed differentials gather them into characteristic wavy ribbons before they enter an enclosed steam tunnel to cook at 100°C.\n\n"
            "The cooked noodles are then shaped into uniform round pucks and submerged in a conveyor deep-fryer filled with palm oil at 140°C. This flash-frying process rapidly evaporates internal moisture within two minutes, imparting long shelf-life. Finally, the cooled noodle cakes drop into paper cups, receive vacuum-sealed vegetable and seasoning packets, and are hermetically capped with foil lids."
        )
    },
    # -------------------------------------------------------------
    # Q61: Life Cycle - Atlantic Salmon
    # -------------------------------------------------------------
    {
        "id": "t1-acad-061",
        "category": "Life Cycle",
        "title": "The Biological Life Cycle of the Atlantic Salmon",
        "prompt": "The diagram illustrates the life cycle of the Atlantic salmon from freshwater spawning to ocean maturity and return migration. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "Life Cycle of the Atlantic Salmon",
            "stages": [
                ("Eggs (Redd)", "Riverbed gravel nest"),
                ("Alevin", "Yolk-sac feeding larvae"),
                ("Fry & Parr", "Vertical-striped river fish"),
                ("Smolt", "Silver physiological shift"),
                ("Adult Salmon", "Ocean feeding & growth"),
                ("Spawning Adult", "Upstream river migration"),
            ]
        },
        "modelEssay": (
            "The biological lifecycle diagram illustrates the developmental progression of the Atlantic salmon, detailing its transition through six distinct life stages spanning freshwater riverbeds and open ocean habitats.\n\n"
            "Overall, the salmon exhibits an anadromous life cycle spanning approximately five to eight years, originating in high-elevation freshwater streams, migrating to saltwater oceans for maturity, and returning upstream to spawn.\n\n"
            "The cycle initiates when female salmon deposit fertilized eggs in gravel nests called redds situated in shallow, fast-flowing riverbeds. After several months, the eggs hatch into alevins, which remain concealed within the gravel while subsisting on attached yolk sacs. Once the yolk is depleted, the young emerge as free-swimming fry, developing camouflage markings to become parr and residing in the river for two to three years.\n\n"
            "Upon reaching adolescence, the fish undergo physiological smoltification: their bodies turn silver to tolerate marine salinity, and they migrate downstream into the ocean. Over the subsequent one to four years, adult salmon feed voraciously on marine prey, attaining full physical maturity. Finally, instinct compels the adults to embark on an arduous upstream migration to their natal streams, where they reproduce and complete the lifecycle."
        )
    },
    # -------------------------------------------------------------
    # Q62: Life Cycle - Honeybee Metamorphosis
    # -------------------------------------------------------------
    {
        "id": "t1-acad-062",
        "category": "Life Cycle",
        "title": "The Metamorphosis and Development of the Honeybee",
        "prompt": "The diagram illustrates the developmental life cycle of the female worker honeybee from egg to adult worker. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "Worker Honeybee Complete Metamorphosis",
            "stages": [
                ("Egg Laid", "Queen deposits egg in cell"),
                ("Larva Hatch", "Fed royal jelly & bee bread"),
                ("Capped Cell", "Worker bees wax-seal cell"),
                ("Pupa Stage", "Tissue metamorphosis"),
                ("Adult Emergence", "Chews wax lid & takes role"),
            ]
        },
        "modelEssay": (
            "The developmental diagram illustrates the complete four-stage metamorphosis of the female worker honeybee (Apis mellifera) inside a hive honeycomb over a 21-day timeline.\n\n"
            "Overall, honeybee development represents holometabolous insect metamorphosis comprising four successive biological stages: microscopic egg, feeding larva, enclosed pupa, and winged adult worker.\n\n"
            "The cycle commences when the mated queen bee deposits a single microscopic egg into an open hexagonal beeswax cell on day one. On day three, the egg hatches into a legless, white grub-like larva, which is fed intensively with royal jelly and bee bread by nurse worker bees, expanding dramatically in body mass over the next six days.\n\n"
            "On day nine, worker bees seal the cell opening with a protective porous beeswax cap. Within this enclosed chamber, the larva spins a silk cocoon and enters the pupal stage, undergoing profound anatomical restructuring to develop eyes, antennae, wings, and legs. Finally, on approximately the twenty-first day, the fully formed adult worker bee chews through the wax capping, emerging into the colony to begin hive maintenance and foraging duties."
        )
    },
    # -------------------------------------------------------------
    # Q63: Life Cycle - The Global Carbon Cycle
    # -------------------------------------------------------------
    {
        "id": "t1-acad-063",
        "category": "Life Cycle",
        "title": "Global Terrestrial, Oceanic, and Atmospheric Carbon Cycle",
        "prompt": "The diagram shows the global movement and exchange of carbon between the atmosphere, terrestrial biosphere, oceans, and fossil fuel reserves. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "Global Carbon Biogeochemical Cycle",
            "stages": [
                ("Atmospheric CO2", "Atmospheric gas reservoir"),
                ("Photosynthesis", "Plant carbon absorption"),
                ("Decomposition", "Soil and fossil formation"),
                ("Ocean Exchange", "Marine dissolution & algae"),
                ("Fossil Emissions", "Combustion releases CO2"),
            ]
        },
        "modelEssay": (
            "The scientific diagram outlines the biogeochemical exchange of carbon among four global reservoirs: the atmosphere, terrestrial biosphere, oceanic waters, and subterranean geological strata.\n\n"
            "Overall, the cycle illustrates a continuous equilibrium between biological carbon sinks—such as vegetation and oceans—and carbon emissions driven by natural respiration, decomposition, and anthropogenic combustion.\n\n"
            "In the terrestrial biosphere, green plants absorb vast quantities of atmospheric carbon dioxide through photosynthetic synthesis, incorporating carbon into biomass. When flora and fauna expire, microbial decomposition in topsoils releases carbon back into the air through respiration, while a minute fraction undergoes millions of years of pressure to transform into subterranean fossil fuel deposits.\n\n"
            "Concurrently, the oceans participate in extensive gas-liquid equilibrium, directly dissolving atmospheric CO2 at the surface where marine phytoplankton utilize it for biological calcification. However, modern industrial activity disrupts this balance: the extraction and combustion of coal, oil, and gas by power plants and vehicles inject substantial supplementary carbon dioxide directly into the atmosphere, intensifying the greenhouse effect."
        )
    },
    # -------------------------------------------------------------
    # Q64: Life Cycle - The Geological Rock Cycle
    # -------------------------------------------------------------
    {
        "id": "t1-acad-064",
        "category": "Life Cycle",
        "title": "The Geological Rock Cycle: Igneous, Sedimentary, and Metamorphic",
        "prompt": "The diagram illustrates the geological rock cycle, showing how rock types transform through melting, cooling, weathering, and heat/pressure over geological time. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "The Geological Rock Cycle",
            "stages": [
                ("Magma / Lava", "Molten subterranean rock"),
                ("Igneous Rock", "Cooling & crystallization"),
                ("Sediments", "Weathering & erosion"),
                ("Sedimentary Rock", "Compaction & cementation"),
                ("Metamorphic Rock", "Tectonic heat & pressure"),
            ]
        },
        "modelEssay": (
            "The geological diagram illustrates the continuous subterranean and surface transformations that circulate rock material through igneous, sedimentary, and metamorphic forms over millions of years.\n\n"
            "Overall, the rock cycle represents a closed geological system driven by internal tectonic heat and external atmospheric weathering that continuously recycles Earth's crustal lithosphere.\n\n"
            "The cycle begins with molten magma located within Earth's mantle. When magma rises to the surface via volcanism or cools beneath the crust, it solidifies into igneous rock like basalt or granite. Once exposed to atmospheric elements, surface igneous formations undergo physical weathering and chemical erosion, disintegrating into fine mineral sediments transported by rivers to ocean basins.\n\n"
            "Over extensive epochs, accumulated sediment strata undergo lithification through burial pressure and mineral cementation, forming sedimentary rocks like sandstone and limestone. As tectonic subduction forces these rocks deep into Earth's crust, intense geothermal heat and pressure alter their crystalline structures without melting, producing dense metamorphic rocks like marble. Eventually, excessive heat remelts metamorphic strata back into liquid magma, restarting the cycle."
        )
    },
    # -------------------------------------------------------------
    # Q65: Life Cycle - Silkworm & Silk Harvesting
    # -------------------------------------------------------------
    {
        "id": "t1-acad-065",
        "category": "Life Cycle",
        "title": "The Silkworm Life Cycle and Traditional Silk Cloth Harvesting",
        "prompt": "The diagram shows the biological lifecycle of the silkworm moth and the manufacturing stages required to produce woven silk fabric. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "Silkworm Cycle & Silk Production",
            "stages": [
                ("Moth Eggs", "Deposited on mulberry leaves"),
                ("Silkworm Larva", "Feeds for 4-6 weeks"),
                ("Silk Cocoon", "Spins continuous filament"),
                ("Hot Water Soak", "Cocoon boiled to unglue silk"),
                ("Reeling & Weaving", "Threads spun and woven"),
            ]
        },
        "modelEssay": (
            "The diagram delineates the dual stages of sericulture, showing the biological life cycle of the silkworm moth alongside the artisanal process of harvesting raw silk thread for textile production.\n\n"
            "Overall, the procedure transitions from biological insect propagation on mulberry foliage to commercial cocoon harvesting, thermal boiling, thread unwinding, and loom weaving.\n\n"
            "The biological cycle begins when adult silkmoths mate and lay hundreds of tiny eggs on mulberry leaves. After approximately ten days, the eggs hatch into voracious silkworm larvae, which consume mulberry leaves continuously for four to six weeks, molting several times. Once fully grown, each larva secretes liquid protein filaments from its salivary glands, spinning a dense, protective oval cocoon around itself within an eight-day period.\n\n"
            "For commercial fabric production, the intact cocoons are harvested before the pupae emerge. They are immersed in boiling water to soften the natural sericin gum binding the fibers. Workers then identify the loose filament ends and reel them onto mechanical spindles, combining multiple fine fibers into strong threads, which are subsequently dyed and woven on looms into luxury silk fabric."
        )
    },
    # -------------------------------------------------------------
    # Q66: Life Cycle - The Hydrological Water Cycle
    # -------------------------------------------------------------
    {
        "id": "t1-acad-066",
        "category": "Life Cycle",
        "title": "The Natural Hydrological Water Cycle",
        "prompt": "The diagram illustrates the natural water cycle, showing how water moves through evaporation, condensation, precipitation, and groundwater runoff. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "The Natural Hydrological Cycle",
            "stages": [
                ("Ocean Evaporation", "Solar heat vaporizes water"),
                ("Transpiration", "Plants release moisture"),
                ("Condensation", "Vapour cools into clouds"),
                ("Precipitation", "Rain and snow fall"),
                ("Runoff & Infiltration", "Rivers return water to sea"),
            ]
        },
        "modelEssay": (
            "The natural cycle diagram illustrates the continuous global circulation of water among ocean basins, the atmosphere, terrestrial ecosystems, and subterranean aquifers.\n\n"
            "Overall, the hydrological cycle is a closed, solar-powered thermodynamic process encompassing four main phases: solar evaporation and plant transpiration, atmospheric cloud condensation, precipitation, and surface runoff returning to the sea.\n\n"
            "The cycle initiates over the world's oceans, where intense solar thermal energy heats surface waters, causing massive volumes of moisture to evaporate into invisible airborne water vapor. Simultaneously, terrestrial forests and vegetation contribute significant moisture through biological transpiration. As warm, moist air ascends into cooler high-altitude atmospheric layers, it cools, causing water droplets to condense around microscopic dust particles to form clouds.\n\n"
            "When cloud moisture density becomes excessive, gravitational forces induce precipitation in the form of rainfall, sleet, or alpine snow. On land, rainwater feeds mountain streams, lakes, and river networks through surface runoff, while a portion percolates into porous bedrock to replenish subterranean groundwater tables. Ultimately, river drainage discharges the water back into the oceans, completing the endless cycle."
        )
    },
    # -------------------------------------------------------------
    # Q67: Life Cycle - Common Frog Metamorphosis
    # -------------------------------------------------------------
    {
        "id": "t1-acad-067",
        "category": "Life Cycle",
        "title": "The Life Cycle and Metamorphosis of the Common Frog",
        "prompt": "The diagram illustrates the life cycle of the common frog from egg mass to adult amphibian. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "Common Frog Amphibian Metamorphosis",
            "stages": [
                ("Frogspawn Eggs", "Jelly-coated clusters in pond"),
                ("Early Tadpole", "Gills and swimming tail"),
                ("Hind Legs Form", "Tadpole grows rear limbs"),
                ("Froglet", "Front legs appear; tail shrinks"),
                ("Adult Frog", "Air-breathing terrestrial frog"),
            ]
        },
        "modelEssay": (
            "The biological lifecycle diagram depicts the progressive metamorphosis of the common frog (Rana temporaria), tracing its physical evolution across five developmental phases from aquatic spawn to terrestrial adult.\n\n"
            "Overall, the frog's development represents an amphibian metamorphosis spanning approximately sixteen weeks, transitioning from jelly-encapsulated aquatic eggs to gilled swimming larvae, developing limbs, and emerging as an air-breathing carnivorous terrestrial adult.\n\n"
            "The life cycle begins in spring when adult frogs mate in shallow freshwater ponds, releasing thousands of fertilized eggs encased in gelatinous clusters known as frogspawn. After two to three weeks, the eggs hatch into limbless, aquatic tadpoles equipped with external gills and a flattened swimming tail, feeding on pond algae.\n\n"
            "Around the seventh week, the tadpole develops rear hind legs and internal lungs. By week ten, front legs emerge, and the tail begins to shorten through tissue reabsorption as the organism enters the froglet stage. By approximately the sixteenth week, the tail disappears completely, and the mature adult frog leaves the water to inhabit terrestrial environments, returning to water solely to reproduce."
        )
    },
    # -------------------------------------------------------------
    # Q68: Life Cycle - The Biological Nitrogen Cycle
    # -------------------------------------------------------------
    {
        "id": "t1-acad-068",
        "category": "Life Cycle",
        "title": "The Biological Nitrogen Cycle in Soil and Atmosphere",
        "prompt": "The diagram shows how nitrogen is fixed, absorbed by living organisms, and returned to the atmosphere through the nitrogen cycle. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "The Biological Nitrogen Cycle",
            "stages": [
                ("Atmospheric N2", "Inert atmospheric nitrogen"),
                ("Nitrogen Fixation", "Root bacteria convert to NH4"),
                ("Nitrification", "Soil bacteria yield nitrates"),
                ("Plant Assimilation", "Crops build proteins"),
                ("Denitrification", "Anaerobic bacteria release N2"),
            ]
        },
        "modelEssay": (
            "The biochemical diagram illustrates the cycling and metabolic transformation of nitrogen among atmospheric gases, soil bacteria, plant root systems, and animal consumers.\n\n"
            "Overall, because atmospheric nitrogen gas is chemically unreactive for most organisms, the cycle depends critically on specialized bacterial communities to fix, nitrify, and subsequently denitrify nitrogen back into the air.\n\n"
            "The cycle begins with abundant atmospheric nitrogen gas (N2). Specialized nitrogen-fixing bacteria residing in the soil and within symbiotic root nodules of legume crops bind this inert gas, synthesizing ammonia and ammonium compounds. Next, nitrifying bacteria in the soil oxidize these ammonium compounds through two stages, first into nitrites and subsequently into bioavailable nitrates.\n\n"
            "Plants absorb these water-soluble nitrates through root hairs, assimilating them into essential plant proteins and nucleic acids, which animals subsequently consume along the food chain. When organisms die and decompose, decomposers release organic nitrogen back into the soil. Finally, anaerobic denitrifying bacteria in waterlogged soils convert excess nitrates back into gaseous nitrogen, venting it into the atmosphere to preserve global chemical balance."
        )
    },
    # -------------------------------------------------------------
    # Q69: Life Cycle - Subterranean Geothermal Heat Cycle
    # -------------------------------------------------------------
    {
        "id": "t1-acad-069",
        "category": "Life Cycle",
        "title": "The Geothermal Heat Convection and Magma Circulation Cycle",
        "prompt": "The diagram illustrates how heat circulates within the Earth's mantle and crust, driving geothermal hot springs, geysers, and tectonic convection currents. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "Earth's Geothermal Convection Cycle",
            "stages": [
                ("Core Heat", "Radioactive decay in mantle"),
                ("Mantle Convection", "Slow magma plume ascent"),
                ("Crustal Heating", "Heating of bedrock & aquifer"),
                ("Hydrothermal Vents", "Geysers & steam fissures"),
                ("Subduction & Sink", "Cold oceanic crust descends"),
            ]
        },
        "modelEssay": (
            "The geophysical diagram illustrates the closed convective thermal cycle operating within the Earth's interior, showing how subterranean heat transfers from the planetary core to surface hydrothermal features.\n\n"
            "Overall, the geothermal cycle represents a massive heat engine driven by internal radioactivity, generating slow-moving magma convection currents that heat crustal groundwater aquifers and fuel surface geysers and volcanic vents.\n\n"
            "The cycle initiates deep within the Earth's core and lower mantle, where ongoing primordial thermal energy and radioactive isotope decay generate immense temperatures exceeding 4,000°C. This extreme heat reduces the density of surrounding ductile rock, creating buoyant vertical magma plumes that slowly ascend toward the outer lithosphere over millions of years. As these superheated plumes approach the upper crust, they transfer immense thermal energy into subterranean bedrock formations and trapped aquifers.\n\n"
            "Pressurized groundwater heats beyond boiling point, discharging violently to the surface through natural geothermal fissures, steam fumaroles, and geysers. Simultaneously, cooler, denser oceanic tectonic plates subduct back into the deep mantle at continental boundaries, completing the global geothermal convective circulation loop."
        )
    },
    # -------------------------------------------------------------
    # Q70: Life Cycle - Soil Horizon Stratification
    # -------------------------------------------------------------
    {
        "id": "t1-acad-070",
        "category": "Life Cycle",
        "title": "Soil Formation and Horizon Development Over Geological Time",
        "prompt": "The diagram illustrates the chronological stages of soil profile formation from bare bedrock weathering to mature stratified horizons. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "cycle",
        "chart_params": {
            "title": "Soil Formation & Stratification Stages",
            "stages": [
                ("Bedrock Cracking", "Physical frost & water fissures"),
                ("Pioneer Lichens", "Organic acid decomposition"),
                ("Subsoil Formation", "Weathered mineral C-horizon"),
                ("Humus Accumulation", "Decaying organic A-horizon"),
                ("Mature Strata", "Complete O, A, B, C profile"),
            ]
        },
        "modelEssay": (
            "The pedological diagram depicts the progressive chronological stages through which solid bedrock weathers and stratifies into a fully mature, multi-layered soil profile over thousands of years.\n\n"
            "Overall, soil genesis involves an evolutionary progression from mechanical bedrock fracturing, through biological colonization and organic humus enrichment, culminating in distinct O, A, B, and C horizon layers.\n\n"
            "The process begins with impermeable parental bedrock exposed to temperature fluctuations. Physical frost wedging, rain erosion, and seismic stress fracture the surface stone into loose rock fragments. Next, pioneer organisms including lichens and mosses colonize the fissures, secreting weak organic acids that chemically break down rock minerals into fine sand and silt particles, creating a rudimentary C-horizon.\n\n"
            "As generations of vegetation die, decomposers enrich the mineral silt with dark organic matter, forming a fertile topsoil layer known as the A-horizon. Over millennia, rainwater percolates through the soil, leaching soluble clay minerals downward into an intermediate subsoil B-horizon. In mature soil profiles, a top organic leaf-litter O-horizon caps the fertile topsoil, creating an ideal terrestrial biome for extensive root systems."
        )
    },
    # -------------------------------------------------------------
    # Q71: Map - Coastal Village Seaville (1995 vs Present)
    # -------------------------------------------------------------
    {
        "id": "t1-acad-071",
        "category": "Map / Plan",
        "title": "Seaville Coastal Village Before and After Tourism Redevelopment",
        "prompt": "The two maps compare the coastal settlement of Seaville in 1995 with the present day following tourist infrastructure redevelopment. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "Seaville Village Redevelopment (1995 vs Present)",
            "before_year": "1995 (Fishing Hamlet)",
            "after_year": "Present (Tourist Resort)",
            "before_items": [
                (20, 40, 260, 45, "North Ocean Beach", "water"),
                (20, 100, 100, 60, "Farmland & Marsh", "green"),
                (140, 100, 70, 50, "Cottages", "building"),
                (230, 100, 50, 50, "Woodland", "green"),
                (20, 175, 260, 25, "Dirt Main Street", "road"),
                (20, 215, 80, 80, "Fishing Harbour", "water"),
                (120, 220, 70, 70, "Fish Market", "building"),
                (210, 220, 70, 70, "Open Grazing", "green"),
            ],
            "after_items": [
                (20, 40, 260, 45, "Beach Promenade", "water"),
                (20, 100, 100, 60, "Luxury Hotel Resort", "building"),
                (140, 100, 70, 50, "Holiday Villas", "building"),
                (230, 100, 50, 50, "Protected Trees", "green"),
                (20, 175, 260, 25, "Paved High Street", "road"),
                (20, 215, 80, 80, "Yacht Marina", "water"),
                (120, 220, 70, 70, "Seafood Restaurant", "building"),
                (210, 220, 70, 70, "Car Park & Mall", "building"),
            ]
        },
        "modelEssay": (
            "The two maps illustrate the extensive urban and commercial transformation of the coastal settlement of Seaville between 1995 and the present day.\n\n"
            "Overall, Seaville underwent dramatic modernization, transitioning from a quiet, agrarian fishing hamlet into a commercialised tourist resort, characterized by hotel infrastructure and leisure facilities replacing farmlands.\n\n"
            "In 1995, the village was predominantly rural. The northern beachfront bordered farmland and marsh in the northwest, a cluster of traditional cottages in the center, and a patch of woodland to the northeast. To the south of the central dirt road lay an active fishing harbor and fish market, flanked by open livestock grazing pastures in the southeast.\n\n"
            "At present, nearly all rural and maritime production facilities have been repurposed. In the northwest, the farmland was replaced by a luxury hotel resort, while the cottages were converted into holiday villas. The central road was paved into an urban high street, and the northern shoreline now features a boardwalk promenade. In the south, the fishing harbor was modernized into a private yacht marina, the fish market became a seafood restaurant, and the grazing land was paved into a shopping center and car park."
        )
    },
    # -------------------------------------------------------------
    # Q72: Map - Grange Park (1930 vs Present)
    # -------------------------------------------------------------
    {
        "id": "t1-acad-072",
        "category": "Map / Plan",
        "title": "Grange Public Park Historical Layout Comparison",
        "prompt": "The two maps show the layout of Grange Public Park when it originally opened in 1930 compared with its modern facilities today. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "Grange Park (1930 vs Present)",
            "before_year": "1930 (Original Opening)",
            "after_year": "Present Day",
            "before_items": [
                (20, 45, 120, 60, "Fountain Basin", "water"),
                (160, 45, 120, 60, "Rose Garden", "green"),
                (95, 125, 110, 50, "Central Bandstand", "building"),
                (20, 195, 120, 60, "Glass Greenhouse", "building"),
                (160, 195, 120, 60, "Pond with Seats", "water"),
                (20, 275, 260, 25, "South Gravel Walkway", "road"),
            ],
            "after_items": [
                (20, 45, 120, 60, "Water Play Park", "water"),
                (160, 45, 120, 60, "Rose Garden & Cafe", "green"),
                (95, 125, 110, 50, "Open Amphitheatre", "building"),
                (20, 195, 120, 60, "Children Playground", "green"),
                (160, 195, 120, 60, "Boating Lake", "water"),
                (20, 275, 260, 25, "Paved Cycleway", "road"),
            ]
        },
        "modelEssay": (
            "The two maps compare the structural arrangement of Grange Public Park upon its initial public opening in 1930 with its current modern configuration.\n\n"
            "Overall, the park evolved from a quiet, ornamental Victorian recreation ground into an active, multi-purpose family and sports community venue, incorporating dining and children's play areas.\n\n"
            "In 1930, the northwest corner accommodated a formal fountain basin, while a rose garden was located in the northeast. At the center of the park stood a circular musical bandstand. In the southern half, visitors utilized a glass greenhouse in the southwest, an ornamental pond with seating benches in the southeast, and a southern gravel perimeter walkway.\n\n"
            "Today, the central bandstand has been reconstructed into an open-air amphitheater for musical concerts. In the north, the fountain basin was converted into an interactive children's splash park, while an outdoor cafe was integrated into the rose garden. The former glass greenhouse was removed to make way for an equipped playground, the pond expanded into a commercial boating lake, and the gravel path was paved into a dual-lane pedestrian and cycle path."
        )
    },
    # -------------------------------------------------------------
    # Q73: Map - Central Municipal Library
    # -------------------------------------------------------------
    {
        "id": "t1-acad-073",
        "category": "Map / Plan",
        "title": "Central Municipal Library Ground Floor Modernization",
        "prompt": "The diagrams compare the ground floor floorplan of a city central library twenty years ago with its current layout following modernization. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "Central Library Ground Floor (2004 vs Present)",
            "before_year": "2004 Layout",
            "after_year": "Present Layout",
            "before_items": [
                (20, 45, 120, 65, "Fiction Bookshelves", "building"),
                (160, 45, 120, 65, "Non-Fiction Stacks", "building"),
                (20, 130, 120, 65, "Newspapers & Periodicals", "green"),
                (160, 130, 120, 65, "Enquiry & Return Desk", "building"),
                (60, 220, 180, 55, "Quiet Study Tables", "road"),
            ],
            "after_items": [
                (20, 45, 120, 65, "Fiction & E-book Kiosks", "building"),
                (160, 45, 120, 65, "Computer Lab & Tech Hub", "water"),
                (20, 130, 120, 65, "Children's Creative Zone", "green"),
                (160, 130, 120, 65, "Self-Service Checkouts", "building"),
                (60, 220, 180, 55, "Coffee Shop & Lounge", "building"),
            ]
        },
        "modelEssay": (
            "The two floorplans illustrate architectural modifications made to the ground floor of a central municipal library over a twenty-year period between 2004 and the present day.\n\n"
            "Overall, the interior layout underwent substantial modernization, shifting from physical book stacks and quiet reading corridors toward digital computer labs, self-service automated terminals, and casual community lounge spaces.\n\n"
            "In 2004, the ground floor was dedicated to physical literature storage and formal administration. The northern half comprised fiction bookshelves on the west and non-fiction book stacks on the east. Centrally, a designated room contained print newspapers and journals opposite a staffed enquiry and book-borrowing counter, while large shared study desks occupied the southern sector.\n\n"
            "Currently, the layout reflects modern digital library demands. The former non-fiction area was transformed into an interactive computer laboratory and digital hub, while e-book downloading kiosks were integrated into the fiction section. The newspaper room was replaced by a children's creative play space, and the staffed desk was reduced to compact self-service RFID checkout machines. Furthermore, the silent study tables were converted into an informal cafe and communal seating lounge."
        )
    },
    # -------------------------------------------------------------
    # Q74: Map - University Campus Expansion
    # -------------------------------------------------------------
    {
        "id": "t1-acad-074",
        "category": "Map / Plan",
        "title": "University Campus Infrastructure and Pedestrianization",
        "prompt": "The two maps show a university campus in 2000 compared to its present-day layout following campus pedestrianization and expansion. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "University Campus (2000 vs Present)",
            "before_year": "Campus in 2000",
            "after_year": "Campus Present Day",
            "before_items": [
                (20, 45, 100, 55, "Science Faculty", "building"),
                (140, 45, 140, 55, "Surface Car Park", "road"),
                (20, 120, 260, 30, "East-West Roadway", "road"),
                (20, 170, 110, 65, "Main Library", "building"),
                (150, 170, 130, 65, "Sports Field", "green"),
            ],
            "after_items": [
                (20, 45, 100, 55, "STEM Complex", "building"),
                (140, 45, 140, 55, "Student Union & Dorms", "building"),
                (20, 120, 260, 30, "Pedestrian Plaza", "green"),
                (20, 170, 110, 65, "Digital Commons", "building"),
                (150, 170, 130, 65, "Indoor Sports Centre", "water"),
            ]
        },
        "modelEssay": (
            "The two maps delineate structural developments and zoning adjustments undertaken on a university campus between the year 2000 and the present day.\n\n"
            "Overall, the campus eliminated through-traffic to achieve comprehensive pedestrianization, replacing surface vehicular parking and open fields with consolidated student residential towers and modernized sports facilities.\n\n"
            "In 2000, a major two-lane vehicular road bifurcated the campus from east to west. North of this road stood the Science Faculty alongside an expansive open-air tarmac parking lot for faculty and students. South of the road, the campus featured the central university library and an open outdoor sports field.\n\n"
            "At present, the central vehicular thoroughfare has been closed to cars and converted into a green pedestrian boulevard with trees and outdoor seating. The surface parking lot was demolished to accommodate a multi-story Student Union and student residential dormitory block. To the north, the Science building was expanded into an integrated STEM research complex, the library was renovated into a Digital Commons, and the grass sports pitch was upgraded into an indoor sports and aquatic centre."
        )
    },
    # -------------------------------------------------------------
    # Q75: Map - Portsville Waterfront Marina
    # -------------------------------------------------------------
    {
        "id": "t1-acad-075",
        "category": "Map / Plan",
        "title": "Industrial Docklands Regeneration into Waterfront Marina",
        "prompt": "The maps show the Portsville dockland area before and after an urban waterfront regeneration project. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "Portsville Docks (1998 vs Present)",
            "before_year": "1998 (Commercial Port)",
            "after_year": "Present (Waterfront Marina)",
            "before_items": [
                (20, 45, 120, 60, "Cargo Warehouses", "building"),
                (160, 45, 120, 60, "Coal Depots", "building"),
                (20, 125, 260, 50, "Heavy Rail Freight", "road"),
                (20, 195, 260, 100, "Commercial Ship Berths", "water"),
            ],
            "after_items": [
                (20, 45, 120, 60, "Luxury Apartments", "building"),
                (160, 45, 120, 60, "Maritime Museum", "building"),
                (20, 125, 260, 50, "Promenade & Light Rail", "green"),
                (20, 195, 260, 100, "Pleasure Boat Marina", "water"),
            ]
        },
        "modelEssay": (
            "The two maps illustrate the urban regeneration of the industrial docklands in Portsville between 1998 and the present day.\n\n"
            "Overall, heavy industrial cargo infrastructure was completely eliminated, transforming the derelict waterfront into a high-density residential, cultural, and recreational marina district.\n\n"
            "In 1998, the northern shore was occupied by large commercial cargo transit warehouses on the west and industrial coal storage depots on the east. Heavy industrial freight railway tracks spanned the entire central corridor, servicing deep-water shipping berths along the southern water basin where commercial cargo vessels docked.\n\n"
            "At present, the docklands have been completely gentrified. The former cargo warehouses were replaced by waterfront luxury apartment complexes, while the coal depots were reconstructed into an interactive maritime heritage museum. The freight rail lines were dismantled to make room for a tree-lined pedestrian promenade and an electric light-rail transit line. Furthermore, the deep-water industrial quays now function as a modern marina accommodating leisure yachts and pleasure craft."
        )
    },
]
