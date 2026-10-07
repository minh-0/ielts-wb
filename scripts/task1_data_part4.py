"""
IELTS Academic Task 1 Data - Part 4 (Questions 76-100)
Themes:
8. Maps & Urban Redevelopment (Q76-Q80)
9. Technical Blueprints & Mechanical Diagrams (Q81-Q90)
10. Multi-Period Demographic Matrices & Global Trends (Q91-Q100)
"""

QUESTIONS_PART4 = [
    # -------------------------------------------------------------
    # Q76: Map - Former Airfield to Eco-Business Park
    # -------------------------------------------------------------
    {
        "id": "t1-acad-076",
        "category": "Map / Plan",
        "title": "Decommissioned Airfield Converted into Eco-Commercial Park",
        "prompt": "The maps illustrate the conversion of a decommissioned military airfield into a commercial business and eco-technology park. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "Airfield Redevelopment (2005 vs Present)",
            "before_year": "2005 (Military Airfield)",
            "after_year": "Present (Eco-Business Park)",
            "before_items": [
                (20, 45, 120, 60, "Aircraft Hangars", "building"),
                (160, 45, 120, 60, "Barracks & Mess", "building"),
                (20, 125, 260, 40, "Concrete Runway", "road"),
                (20, 185, 260, 110, "Open Airfield Grass", "green"),
            ],
            "after_items": [
                (20, 45, 120, 60, "Solar Tech Hub", "building"),
                (160, 45, 120, 60, "Offices & Cafeteria", "building"),
                (20, 125, 260, 40, "Boulevard & Transit", "road"),
                (20, 185, 125, 110, "Solar PV Field", "water"),
                (155, 185, 125, 110, "Wetland Reserve", "green"),
            ]
        },
        "modelEssay": (
            "The two maps compare the spatial layout of an air base in 2005 with its current redevelopment as an ecological commerce and renewable technology park.\n\n"
            "Overall, the military installation was repurposed into a commercial business hub, replacing military runways and military hangars with sustainable corporate offices, clean energy installations, and protected ecological parklands.\n\n"
            "In 2005, the northern sector featured corrugated aircraft hangars to the west and troop barracks alongside a mess hall to the east. A wide concrete runway crossed the middle of the airfield, bordered to the south by a vast, unimproved grassy buffer zone.\n\n"
            "Currently, the former aircraft hangars have been retrofitted into a state-of-the-art solar tech innovation center, while the old barracks were rebuilt into corporate commercial offices with an on-site cafeteria. The concrete runway was repurposed into a multi-lane landscaped boulevard with rapid bus transit. In the south, the former open grass was divided equally into an extensive solar photovoltaic array on the west and a protected wildlife wetland nature reserve on the east."
        )
    },
    # -------------------------------------------------------------
    # Q77: Map - General Hospital Expansion
    # -------------------------------------------------------------
    {
        "id": "t1-acad-077",
        "category": "Map / Plan",
        "title": "City General Hospital Campus Expansion and New Wing",
        "prompt": "The two plans show changes made to the layout of City General Hospital between 2010 and the present day following campus expansion. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "City Hospital Layout (2010 vs Present)",
            "before_year": "Hospital Campus (2010)",
            "after_year": "Hospital Campus (Present)",
            "before_items": [
                (20, 45, 120, 70, "Main Ward (100 Beds)", "building"),
                (160, 45, 120, 70, "Surface Staff Parking", "road"),
                (20, 135, 260, 30, "Access Ring Road", "road"),
                (20, 185, 120, 100, "Outpatient Clinic", "building"),
                (160, 185, 120, 100, "Lawns & Trees", "green"),
            ],
            "after_items": [
                (20, 45, 120, 70, "Main Ward (Expanded)", "building"),
                (160, 45, 120, 70, "Multi-Storey Car Park", "building"),
                (20, 135, 260, 30, "Access Ring Road", "road"),
                (20, 185, 120, 100, "Outpatient Clinic", "building"),
                (160, 185, 120, 100, "Emergency Wing & Heli", "water"),
            ]
        },
        "modelEssay": (
            "The two maps compare the architectural grounds of City General Hospital in 2010 with its modern layout following an infrastructural expansion programme.\n\n"
            "Overall, the hospital campus substantially expanded its clinical capacities, adding an acute emergency trauma wing and multi-story parking structure at the expense of landscaped lawns and surface tarmac.\n\n"
            "In 2010, the northern section comprised the main 100-bed hospital ward to the west, separated by an access corridor from open-air staff parking to the east. A central ring road circled the complex, connecting to an outpatient consultation clinic in the southwest and an ornamental lawn with mature trees occupying the southeastern sector.\n\n"
            "Today, the main ward building has been enlarged with additional stories to accommodate higher inpatient admissions. To the northeast, the surface parking lot was replaced by a modern multi-story car park catering to both staff and visitors. While the outpatient wing and ring road remained unchanged, the southeastern green space was cleared to build an emergency trauma wing with a rooftop helipad, providing immediate critical care access."
        )
    },
    # -------------------------------------------------------------
    # Q78: Map - School Grounds Sports Complex
    # -------------------------------------------------------------
    {
        "id": "t1-acad-078",
        "category": "Map / Plan",
        "title": "Secondary School Grounds Reconfiguration and Sports Hall",
        "prompt": "The two maps show the site layout of a secondary school campus in 2008 and today after adding sports facilities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "School Campus (2008 vs Present)",
            "before_year": "School in 2008",
            "after_year": "School Present Day",
            "before_items": [
                (20, 45, 120, 70, "Academic Block A", "building"),
                (160, 45, 120, 70, "Academic Block B", "building"),
                (20, 135, 260, 25, "Pedestrian Walkway", "road"),
                (20, 180, 120, 100, "Tarmac Playground", "road"),
                (160, 180, 120, 100, "Grass Playing Field", "green"),
            ],
            "after_items": [
                (20, 45, 120, 70, "Academic Block A", "building"),
                (160, 45, 120, 70, "Block B & Science Lab", "building"),
                (20, 135, 260, 25, "Covered Walkway", "road"),
                (20, 180, 120, 100, "Indoor Sports Hall", "water"),
                (160, 180, 120, 100, "All-Weather Astroturf", "green"),
            ]
        },
        "modelEssay": (
            "The two diagrams illustrate the modifications made to the physical campus of a secondary school between 2008 and the present day.\n\n"
            "Overall, the school substantially upgraded its sporting and scientific facilities, replacing open-air outdoor surfaces with indoor recreation facilities and specialized laboratories.\n\n"
            "In 2008, the northern part of the campus consisted of two separate two-story instructional buildings: Academic Block A on the west and Academic Block B on the east. A central pedestrian walkway connected them to southern recreational areas, which were divided into a hard tarmac playground in the southwest and an open grass sports field in the southeast.\n\n"
            "By the present day, Academic Block A remained unchanged, but Block B was expanded with an integrated modern science laboratory wing. The connecting path was upgraded with a weather-protective canopy. In the south, the former tarmac playground was replaced by an indoor multi-purpose sports hall, while the natural grass playing pitch was converted into an all-weather floodlit synthetic Astroturf field for year-round sports."
        )
    },
    # -------------------------------------------------------------
    # Q79: Map - Rural Farmland to Solar Park
    # -------------------------------------------------------------
    {
        "id": "t1-acad-079",
        "category": "Map / Plan",
        "title": "Agricultural Farmland Converted into Solar Farm and Nature Reserve",
        "prompt": "The maps illustrate the transformation of rural agricultural farmland into a utility-scale solar energy park and nature reserve. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "Farmland to Solar Park (2012 vs Present)",
            "before_year": "2012 (Arable Farmland)",
            "after_year": "Present (Solar & Eco Park)",
            "before_items": [
                (20, 45, 120, 60, "Wheat Field North", "green"),
                (160, 45, 120, 60, "Wheat Field East", "green"),
                (20, 120, 260, 25, "Tractor Farm Track", "road"),
                (20, 160, 120, 110, "Cattle Pasture", "green"),
                (160, 160, 120, 110, "Farmhouse & Barns", "building"),
            ],
            "after_items": [
                (20, 45, 120, 60, "Solar PV Arrays (1)", "water"),
                (160, 45, 120, 60, "Solar PV Arrays (2)", "water"),
                (20, 120, 260, 25, "Maintenance Road", "road"),
                (20, 160, 120, 110, "Wildflower Sanctuary", "green"),
                (160, 160, 120, 110, "Battery Storage & Grid", "building"),
            ]
        },
        "modelEssay": (
            "The two maps trace the environmental and infrastructural transformation of a rural agricultural estate between 2012 and the present day.\n\n"
            "Overall, traditional arable cropping and livestock grazing were completely phased out, converting the rural estate into a utility-scale solar photovoltaic generation facility, battery storage center, and ecological wildflower sanctuary.\n\n"
            "In 2012, the property was dedicated entirely to agriculture. The northern acreage was split into two extensive wheat fields separated by a fence line. A dirt tractor access path crossed the center, leading to an enclosed cattle pasture in the southwest and a residential farmhouse with attached barns in the southeast.\n\n"
            "Currently, the former wheat cultivation fields in the north have been replaced by thousands of ground-mounted solar panels organized into two large arrays. The central dirt path was paved with gravel into an all-weather utility maintenance road. The old livestock pasture was reseeded into a biodiverse native wildflower sanctuary for pollinators, while the historic farmhouse and barns were replaced by high-capacity commercial battery storage units and an electrical substation."
        )
    },
    # -------------------------------------------------------------
    # Q80: Map - High Street Pedestrianization
    # -------------------------------------------------------------
    {
        "id": "t1-acad-080",
        "category": "Map / Plan",
        "title": "Market Town High Street Pedestrianization and Urban Calming",
        "prompt": "The maps show the High Street of a market town before and after pedestrianization and urban regeneration works. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "map",
        "chart_params": {
            "title": "Town High Street (2015 vs Present)",
            "before_year": "2015 (Through Traffic)",
            "after_year": "Present (Pedestrian Zone)",
            "before_items": [
                (20, 45, 260, 50, "North Shopfronts", "building"),
                (20, 115, 260, 50, "2-Lane Road & Cars", "road"),
                (20, 185, 260, 30, "On-Street Parking", "road"),
                (20, 235, 260, 50, "South Shopfronts", "building"),
            ],
            "after_items": [
                (20, 45, 260, 50, "Shops with Awnings", "building"),
                (20, 115, 260, 50, "Paved Pedestrian Mall", "green"),
                (20, 185, 260, 30, "Outdoor Dining & Trees", "water"),
                (20, 235, 260, 50, "Boutiques & Cafes", "building"),
            ]
        },
        "modelEssay": (
            "The two maps illustrate the urban streetscape transformation of a market town High Street between 2015 and the present day following a municipal pedestrianization scheme.\n\n"
            "Overall, vehicular traffic and kerbside vehicle parking were entirely removed from the street, transforming a congested roadway into an expansive pedestrian retail plaza featuring outdoor cafe terraces and green landscaping.\n\n"
            "In 2015, the High Street was configured for heavy vehicular flow. Continuous rows of retail shopfronts lined the northern and southern edges of the street. Between them ran an active two-lane vehicular carriageway subject to heavy traffic noise, accompanied by a row of curbside parking bays along the southern curb.\n\n"
            "At present, motor vehicles have been prohibited. The former asphalt roadway and parking spaces were replaced with decorative granite paving to create a continuous pedestrian promenade. The southern edge now features outdoor dining terraces, parasols, and planted trees. Furthermore, the retail facades on both sides were revitalized, with northern shops adding protective all-weather awnings and southern units transitioning into artisan cafes."
        )
    },
    # -------------------------------------------------------------
    # Q81: Blueprint - Wind Turbine Mechanics
    # -------------------------------------------------------------
    {
        "id": "t1-acad-081",
        "category": "Process Diagram",
        "title": "Structural Mechanics of a Modern Horizontal-Axis Wind Turbine",
        "prompt": "The diagram illustrates the internal components and operational mechanism of an industrial wind turbine generator. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Industrial Wind Turbine Electrical Mechanism",
            "steps": [
                ("Component 1", "Rotor & Blades", "Aerodynamic fiberglass blades catch wind to spin hub"),
                ("Component 2", "Low-Speed Shaft", "Transfers rotational force from rotor (8-20 RPM)"),
                ("Component 3", "Gearbox Acceleration", "Steps up rotational speed to 1,500-1,800 RPM"),
                ("Component 4", "Generator & Cable", "Induction generator produces electricity down tower"),
            ]
        },
        "modelEssay": (
            "The technical diagram illustrates the internal electromechanical assemblies and working principles of a utility-scale horizontal-axis wind turbine generator.\n\n"
            "Overall, the wind turbine harnesses atmospheric kinetic energy, using rotating aerodynamic blades to drive a mechanical shaft, an accelerating gearbox, and an induction generator that sends current down the support tower to the grid.\n\n"
            "The process begins when wind blows across three aerodynamic fiberglass composite blades attached to a central rotor hub. The lift forces cause the rotor to turn at approximately 8 to 20 revolutions per minute (RPM). This rotation turns the connected low-speed main shaft, supported by heavy roller bearings inside the protective nacelle housing at the summit of the steel tower.\n\n"
            "Because an electrical generator requires high rotational speeds, the low-speed shaft connects to a high-ratio planetary gearbox. The gearbox accelerates shaft velocity nearly a hundredfold, driving an output high-speed shaft at 1,500 to 1,800 RPM. This accelerated motion spins the rotor inside the generator, producing AC electricity, which travels through heavy copper cables down the hollow tower to an on-ground transformer."
        )
    },
    # -------------------------------------------------------------
    # Q82: Blueprint - Domestic Solar Thermal Collector
    # -------------------------------------------------------------
    {
        "id": "t1-acad-082",
        "category": "Process Diagram",
        "title": "Domestic Solar Thermal Water Heating System",
        "prompt": "The diagram illustrates the working components of a domestic solar thermal collector system used for household water heating. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Domestic Solar Thermal Water Heating Cycle",
            "steps": [
                ("Component 1", "Roof Solar Panel", "Dark absorber plate traps solar radiation on roof"),
                ("Component 2", "Heat Transfer Fluid", "Antifreeze fluid circulates through copper tubing"),
                ("Component 3", "Heat Exchanger Coil", "Hot coil transfers heat into insulated water tank"),
                ("Component 4", "Auxiliary Backup", "Gas boiler/immersion heater boosts temp on cloudy days"),
            ]
        },
        "modelEssay": (
            "The technical diagram illustrates the operation of a closed-loop domestic solar thermal water heating system mounted on a residential roof.\n\n"
            "Overall, the system captures solar thermal radiation through a roof-mounted collector, circulating a heated fluid through a heat-exchange coil inside a water storage tank, supported by an auxiliary heating booster.\n\n"
            "The heating cycle begins on the building's roof, where a glazed flat-plate solar collector is positioned facing the sun. Solar rays penetrate transparent tempered glass, striking a dark matte absorber plate that heats up. Glycol-water antifreeze fluid circulating through copper tubing beneath the absorber plate absorbs this thermal energy, reaching temperatures well above 70°C.\n\n"
            "An electric circulation pump pushes the heated fluid downward through insulated pipes into the household hot water cylinder located inside the home. Inside the tank, the fluid travels through a copper heat-exchanger coil, transferring heat directly into the cold domestic water supply without mixing. The cooled fluid returns to the roof to be reheated, while an auxiliary electric immersion heater or gas boiler boosts water temperature during overcast weather."
        )
    },
    # -------------------------------------------------------------
    # Q83: Blueprint - Rainwater Harvesting System
    # -------------------------------------------------------------
    {
        "id": "t1-acad-083",
        "category": "Process Diagram",
        "title": "Residential Rainwater Harvesting and Filtration System",
        "prompt": "The diagram shows the setup and operational stages of a residential rainwater harvesting system. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Residential Rainwater Harvesting System",
            "steps": [
                ("Stage 1", "Roof Catchment & Gutter", "Rainwater collected from sloped roof gutters"),
                ("Stage 2", "First-Flush Diverter", "Initial dirty water diverted away from clean tank"),
                ("Stage 3", "Underground Storage", "Pre-filtered water stored in sealed concrete cistern"),
                ("Stage 4", "Pump & Dual-Filters", "Pump pushes water through cartridge filters for use"),
            ]
        },
        "modelEssay": (
            "The schematic diagram outlines the structural components and functional stages of a domestic rainwater collection and purification installation for residential properties.\n\n"
            "Overall, the system channels precipitation from roof catchments through initial debris diversion, subterranean storage, and multi-stage filtration to supply non-potable household fixtures.\n\n"
            "The harvesting workflow commences on the rooftop, where pitched roof tiles channel rainwater into perimeter gutters. Downpipes direct the water toward an automated first-flush diverter pipe, which isolates and discards the initial rainfall volume carrying atmospheric dust, bird droppings, and leaves, ensuring only clean runoff proceeds forward.\n\n"
            "The purified runoff passes through a fine wire mesh filter before entering a large underground concrete cistern. An overflow pipe discharges excess water during torrential storms. When water is demanded inside the house, an automatic submersible pressure pump draws water through a floating intake and pushes it through fine sediment cartridge and carbon filters, supplying water to toilets, washing machines, and garden irrigation taps."
        )
    },
    # -------------------------------------------------------------
    # Q84: Blueprint - Ground-Source Heat Pump
    # -------------------------------------------------------------
    {
        "id": "t1-acad-084",
        "category": "Process Diagram",
        "title": "Geothermal Ground-Source Heat Pump for Space Heating",
        "prompt": "The diagram illustrates the operation of a closed-loop geothermal ground-source heat pump used for home underfloor heating. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Geothermal Heat Pump Space Heating Cycle",
            "steps": [
                ("Loop 1", "Ground Loop Pipes", "Fluid absorbs stable subterranean soil heat (10-12°C)"),
                ("Loop 2", "Evaporator Chamber", "Refrigerant boils into gas upon absorbing ground heat"),
                ("Loop 3", "Compressor Pump", "Compressor compresses gas to high pressure (60°C)"),
                ("Loop 4", "Condenser & Heating", "Heat transferred into home underfloor radiant pipes"),
            ]
        },
        "modelEssay": (
            "The schematic diagram explains the thermodynamic principles and cyclic loops involved in a residential ground-source geothermal heat pump system.\n\n"
            "Overall, the system extracts low-temperature geothermal heat from underground bedrock, uses a compressor to concentrate the thermal energy, and distributes warmth through home underfloor hydronic circuits.\n\n"
            "The primary loop consists of closed polyethylene pipes buried horizontally or vertically deep in the garden, where subterranean soil maintains a constant temperature of 10°C to 12°C year-round. Water mixed with antifreeze circulates through these ground pipes, absorbing geothermal energy before flowing indoors into the heat pump unit.\n\n"
            "Inside the heat pump, this warmth enters an evaporator chamber containing liquid refrigerant, which vaporizes at low temperatures. An electric compressor then compresses the vaporized refrigerant, elevating its pressure and concentrating the heat to approximately 60°C. In the condenser, the hot gas transfers its heat into the home's water circuit, which circulates through underfloor radiant tubes and hot water cylinders. Finally, the refrigerant expands and cools through an expansion valve, ready to restart the cycle."
        )
    },
    # -------------------------------------------------------------
    # Q85: Blueprint - Smoke Alarm Ionization Chamber
    # -------------------------------------------------------------
    {
        "id": "t1-acad-085",
        "category": "Process Diagram",
        "title": "Smoke Detector Ionization Chamber Mechanism",
        "prompt": "The diagram shows the internal working mechanism of an ionization smoke detector in normal conditions and when smoke is present. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Ionization Smoke Detector Working Mechanism",
            "steps": [
                ("State 1", "Alpha Radiation", "Americium source emits alpha particles into chamber"),
                ("State 2", "Air Ionization", "Particles ionize air molecules into positive/negative"),
                ("State 3", "Current Flow", "Ions migrate to electrodes, maintaining stable current"),
                ("State 4", "Smoke Entry & Alarm", "Smoke binds ions, breaking current and triggering siren"),
            ]
        },
        "modelEssay": (
            "The technical diagram illustrates the electrical and nuclear detection mechanisms inside an ionization smoke alarm, comparing its quiescent monitoring state with an active alarm triggered by smoke.\n\n"
            "Overall, the device utilizes a low-level radioactive alpha source to maintain a continuous electrical current across an internal air chamber, which triggers an audible alarm when smoke disrupts ion migration.\n\n"
            "Under normal conditions, a minute source of Americium-241 situated inside the open detection chamber continuously emits harmless alpha radiation into the air gap. These alpha particles collide with ambient oxygen and nitrogen molecules, ionizing them into positive ions and free electrons. Attracted by opposing charges on two metallic sensor plates, positive ions drift to the negative electrode while electrons migrate to the positive plate, establishing a steady electrical current monitored by a microprocessor.\n\n"
            "When a fire occurs, smoke particles infiltrate the chamber through outer vents. The larger smoke particles bind with the airborne ions, neutralizing their electrical charges and impeding their migration to the electrodes. This reduction in current breaks the circuit, prompting the internal microchip to activate a loud piezo siren."
        )
    },
    # -------------------------------------------------------------
    # Q86: Blueprint - Passive Solar Architecture
    # -------------------------------------------------------------
    {
        "id": "t1-acad-086",
        "category": "Process Diagram",
        "title": "Passive Solar Building Design for Climate Control",
        "prompt": "The diagram illustrates how passive solar architectural features regulate indoor temperature during winter and summer without artificial heating or air conditioning. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Passive Solar Climate Regulation Design",
            "steps": [
                ("Winter 1", "Low Sun Penetration", "Low winter sun penetrates deep through south glazing"),
                ("Winter 2", "Thermal Mass Storage", "Concrete floors absorb heat and re-radiate at night"),
                ("Summer 1", "Roof Overhang Shade", "High summer sun blocked by calculated roof eave"),
                ("Summer 2", "Cross Ventilation", "Clerestory windows release hot air via stack effect"),
            ]
        },
        "modelEssay": (
            "The architectural diagram illustrates the design principles of a passive solar building, detailing how structural elements regulate thermal comfort across winter and summer seasons without mechanical climate control.\n\n"
            "Overall, the structure exploits the sun's seasonal solar altitude, using calculated roof eaves, expansive south-facing double glazing, dense thermal mass, and natural stack ventilation to heat and cool naturally.\n\n"
            "During winter months, the sun tracks low across the horizon. Solar rays easily pass beneath the roof overhang, penetrating deep into the interior through expansive double-glazed south-facing windows. This direct sunlight strikes heavy concrete floors and brick interior walls acting as thermal mass, storing heat throughout the day and releasing it into living spaces at night.\n\n"
            "In contrast, during summer, the sun ascends to a high angle. Protruding roof eaves cast shade over the windows, preventing solar heat from entering. Meanwhile, operable high-level clerestory vents allow rising warm air to escape, drawing cooler air through shaded ground-level windows via natural cross-ventilation."
        )
    },
    # -------------------------------------------------------------
    # Q87: Blueprint - Wave Energy Converter
    # -------------------------------------------------------------
    {
        "id": "t1-acad-087",
        "category": "Process Diagram",
        "title": "Oscillating Water Column Wave Energy Converter",
        "prompt": "The diagram illustrates the operation of an oscillating water column wave energy device. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Oscillating Water Column Wave Power Plant",
            "steps": [
                ("Step 1", "Wave Surge", "Ocean wave enters submerged chamber, pushing water up"),
                ("Step 2", "Air Compression", "Rising water level compresses air inside air column"),
                ("Step 3", "Wells Turbine", "High-velocity air spins bidirectional Wells turbine"),
                ("Step 4", "Wave Recedes", "Receding wave pulls air back, spinning turbine continuously"),
            ]
        },
        "modelEssay": (
            "The engineering diagram illustrates the operational sequence of an oscillating water column (OWC) wave power generator positioned along a coastal shoreline.\n\n"
            "Overall, the marine converter transforms wave energy into pneumatic pressure, using rising and falling water levels to drive a bidirectional Wells air turbine connected to an electrical generator.\n\n"
            "The mechanism consists of a hollow reinforced concrete chamber anchored to coastal bedrock, with an open submerged bottom facing incoming ocean swells. When a wave surges into the chamber, water enters the opening, raising the water level. This piston-like movement compresses air in the upper column, forcing it through a narrow top vent at high velocity.\n\n"
            "This pressurized air stream spins the blades of a Wells turbine, which rotates in a single direction regardless of airflow direction. As the wave recedes, water drops inside the chamber, drawing outside air back through the turbine and spinning it continuously. An attached electrical generator converts this rotation into electricity, delivered ashore via undersea cables."
        )
    },
    # -------------------------------------------------------------
    # Q88: Blueprint - Hot Air Balloon Structure
    # -------------------------------------------------------------
    {
        "id": "t1-acad-088",
        "category": "Process Diagram",
        "title": "Hot Air Balloon Flight and Altitude Control Mechanism",
        "prompt": "The diagram shows the structural anatomy and flight control mechanisms of a passenger hot air balloon. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Hot Air Balloon Structural and Flight Controls",
            "steps": [
                ("Part 1", "Nylon Envelope", "Tear-resistant ripstop nylon holds hot air volume"),
                ("Part 2", "Propane Burner", "Propane burner heats air to generate buoyant lift"),
                ("Part 3", "Parachute Valve", "Cord-operated top vent releases air to descend"),
                ("Part 4", "Wicker Basket", "Carries passengers, fuel cylinders, and instruments"),
            ]
        },
        "modelEssay": (
            "The technical diagram illustrates the structural anatomy and flight control components of a conventional passenger hot air balloon.\n\n"
            "Overall, flight relies on Archimedes' principle of buoyancy, utilizing liquid propane burners to heat trapped air inside an envelope for ascent, and a cord-controlled parachute valve at the apex to descend.\n\n"
            "The main structure is the envelope, constructed from fire-resistant ripstop nylon sewn with load-bearing structural tapes. The open bottom, reinforced with fireproof Nomex fabric, sits above a propane burner assembly mounted on an overhead gimbal frame. The burner vaporizes liquid propane, projecting flame bursts that heat internal air to around 100°C. Because this heated air is less dense than the surrounding atmosphere, it creates positive buoyant lift.\n\n"
            "Below the burner hangs a traditional wicker basket carrying passengers, flight instruments, and pressurized propane fuel tanks. To descend or vent air during landing, the pilot pulls a control line opening a fabric parachute valve at the envelope's apex, releasing hot air."
        )
    },
    # -------------------------------------------------------------
    # Q89: Blueprint - Pottery Kiln Air Circulation
    # -------------------------------------------------------------
    {
        "id": "t1-acad-089",
        "category": "Process Diagram",
        "title": "Updraft vs Downdraft Ceramic Pottery Kilns",
        "prompt": "The diagram compares air circulation and heat flow between a traditional updraft pottery kiln and a modern downdraft kiln. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Pottery Kiln Airflow Comparison",
            "steps": [
                ("Updraft 1", "Bottom Firebox", "Heat enters bottom firebox beneath ware chamber"),
                ("Updraft 2", "Direct Chimney Exit", "Hot air rises straight through roof damper (uneven)"),
                ("Downdraft 1", "Bag Wall Deflection", "Flame forced upward by internal barrier wall"),
                ("Downdraft 2", "Downward Circulation", "Heat sucked down through floor flues to chimney (even)"),
            ]
        },
        "modelEssay": (
            "The technical cross-section diagrams compare thermal circulation patterns between a traditional updraft pottery kiln and a modern downdraft ceramic kiln.\n\n"
            "Overall, while the updraft design vents combustion gases directly through a roof chimney, the downdraft system forces heat down through the floor before venting, creating superior thermal uniformity.\n\n"
            "In the updraft kiln, fuel combustion occurs in fireboxes beneath the central firing chamber. As hot air naturally rises, it passes through the pottery before exiting through a damper flue in the domed roof. While mechanically simple, this linear airflow produces thermal stratification, with temperatures at the top substantially hotter than at the base.\n\n"
            "In contrast, the downdraft kiln features interior refractory bag walls directly in front of the fireboxes. These walls divert combustion flames toward the vaulted ceiling. Because the chimney flue is located at floor level, the draft pulls hot gases down through the stacked ceramics and into underground flues before exiting. This downward path eliminates hot spots and ensures uniform glaze vitrification."
        )
    },
    # -------------------------------------------------------------
    # Q90: Blueprint - Water Softener Ion Exchange
    # -------------------------------------------------------------
    {
        "id": "t1-acad-090",
        "category": "Process Diagram",
        "title": "Domestic Water Softener Resin and Brine Regeneration Cycle",
        "prompt": "The diagram illustrates how hard water is softened using an ion-exchange resin tank and brine regeneration cycle. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "process",
        "chart_params": {
            "title": "Ion-Exchange Water Softening & Regeneration",
            "steps": [
                ("Stage 1", "Hard Water Inflow", "Water containing calcium & magnesium enters tank"),
                ("Stage 2", "Ion-Exchange Resin", "Beads exchange sodium ions (Na+) for calcium (Ca2+)"),
                ("Stage 3", "Soft Water Output", "Softened water flows out to household plumbing"),
                ("Stage 4", "Brine Regeneration", "Salt brine flushes resin beads, restoring sodium ions"),
            ]
        },
        "modelEssay": (
            "The schematic diagram outlines the operational cycles of a domestic water softener, detailing the ion-exchange softening phase alongside automated brine tank regeneration.\n\n"
            "Overall, the appliance replaces hard mineral ions with sodium ions using polystyrene resin beads, utilizing periodic sodium chloride brine flushes to clean and regenerate the bed.\n\n"
            "During the softening cycle, hard municipal water containing dissolved calcium (Ca2+) and magnesium (Mg2+) ions enters the mineral tank through a top distributor valve. The water percolates through a bed of microscopic polystyrene resin beads pre-charged with sodium ions (Na+). Because calcium and magnesium ions carry stronger electrostatic charges, they bind to the resin, displacing harmless sodium ions into the water, which flows into the home as softened water.\n\n"
            "Over several days, the resin beads become saturated with minerals. An automated timer initiates regeneration: concentrated brine is drawn from an adjacent salt tank and pumped through the resin bed. The high sodium concentration forces calcium ions off the beads, flushing them down the drain and restoring the resin for service."
        )
    },
    # -------------------------------------------------------------
    # Q91: Matrix - Sectoral Employment (1850–2020)
    # -------------------------------------------------------------
    {
        "id": "t1-acad-091",
        "category": "Table",
        "title": "National Employment Transition by Sector (1850–2020)",
        "prompt": "The table illustrates the distribution of the workforce across agriculture, manufacturing, and services in a Western nation from 1850 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Sectoral Employment Share (1850–2020)",
            "headers": ["Year", "Agriculture (%)", "Manufacturing (%)", "Services (%)"],
            "rows": [
                ["1850", "62%", "22%", "16%"],
                ["1900", "38%", "36%", "26%"],
                ["1950", "15%", "48%", "37%"],
                ["1980", "6%", "34%", "60%"],
                ["2020", "2%", "17%", "81%"],
            ]
        },
        "modelEssay": (
            "The table traces the macroeconomic transition of employment shares across agriculture, manufacturing, and service industries in a Western nation from 1850 to 2020.\n\n"
            "Overall, the economy transitioned from an agrarian base to an industrial peak in the mid-twentieth century, before evolving into a service-dominated post-industrial economy by 2020.\n\n"
            "In 1850, agriculture employed an overwhelming 62% majority of the workforce, while manufacturing engaged 22% and services accounted for 16%. Over the following century, mechanization reduced agricultural employment to 38% in 1900 and 15% in 1950, declining to just 2% by 2020.\n\n"
            "In contrast, industrial manufacturing expanded from 22% in 1850 to reach an apex of 48% in 1950. However, subsequent automation and deindustrialization caused manufacturing to decline to 34% in 1980 and 17% in 2020. Conversely, the service sector grew continuously: expanding from 16% in 1850 to 37% in 1950, reaching 60% in 1980, and culminating at 81% of all national employment by 2020."
        )
    },
    # -------------------------------------------------------------
    # Q92: Matrix - Life Expectancy (1960–2020)
    # -------------------------------------------------------------
    {
        "id": "t1-acad-092",
        "category": "Table",
        "title": "Global Life Expectancy at Birth Across Four Continents",
        "prompt": "The table compares average life expectancy at birth in years across Europe, the Americas, Asia, and Africa between 1960 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Life Expectancy at Birth (1960–2020)",
            "headers": ["Region", "1960", "1980", "2000", "2020", "Gain (Years)"],
            "rows": [
                ["Europe", "69.2 yrs", "73.1 yrs", "76.8 yrs", "81.4 yrs", "+12.2 yrs"],
                ["Americas", "64.5 yrs", "70.2 yrs", "74.5 yrs", "77.8 yrs", "+13.3 yrs"],
                ["Asia", "45.1 yrs", "60.4 yrs", "67.2 yrs", "74.2 yrs", "+29.1 yrs"],
                ["Africa", "40.2 yrs", "48.6 yrs", "53.1 yrs", "63.5 yrs", "+23.3 yrs"],
            ]
        },
        "modelEssay": (
            "The table details longevity trends by presenting average life expectancy at birth in years across Europe, the Americas, Asia, and Africa at twenty-year intervals from 1960 to 2020.\n\n"
            "Overall, life expectancy lengthened considerably across all four continents over the sixty-year period. While Europe consistently maintained the highest life expectancy, Asia recorded the most dramatic gains.\n\n"
            "In 1960, a stark gap separated Western continents from Asia and Africa. Europe led with 69.2 years, followed by the Americas at 64.5 years. In contrast, life expectancy in Asia was only 45.1 years, while Africa recorded the lowest figure at 40.2 years.\n\n"
            "Over subsequent decades, public health and economic development drove rapid gains across developing regions. By 2020, Asian life expectancy had surged by 29.1 years to reach 74.2 years, closing the gap on the Americas (77.8 years) and Europe (81.4 years). Africa also achieved substantial progress, gaining 23.3 years to reach 63.5 years by 2020."
        )
    },
    # -------------------------------------------------------------
    # Q93: Matrix - Urban Population Share (1970–2030)
    # -------------------------------------------------------------
    {
        "id": "t1-acad-093",
        "category": "Table",
        "title": "Urban Population Proportions Across Six World Regions",
        "prompt": "The table below shows the percentage of the population residing in urban areas across six regions from 1970 to 2030 (with 2030 projected). Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Urban Population Percentage (1970–2030)",
            "headers": ["Region", "1970", "1990", "2010", "2030 (Proj)", "Total Gain"],
            "rows": [
                ["North America", "73.8%", "75.4%", "80.8%", "84.2%", "+10.4%"],
                ["Latin America", "57.1%", "70.6%", "78.8%", "83.0%", "+25.9%"],
                ["Europe", "62.8%", "69.8%", "72.7%", "77.5%", "+14.7%"],
                ["Asia", "23.7%", "32.3%", "44.8%", "54.8%", "+31.1%"],
                ["Africa", "23.5%", "31.5%", "39.2%", "47.1%", "+23.6%"],
            ]
        },
        "modelEssay": (
            "The table provides historical and projected demographic data on the proportion of the population living in cities across five continental regions between 1970 and 2030.\n\n"
            "Overall, urbanization increased across all surveyed territories. North America and Latin America maintained the highest urbanization rates, while Asia experienced the fastest rural-to-urban migration.\n\n"
            "In 1970, North America was the most urbanized region with 73.8% of its population in cities, followed by Europe at 62.8% and Latin America at 57.1%. Over subsequent decades, Latin America urbanized rapidly, reaching 78.8% by 2010 and projected to reach 83.0% by 2030, approaching North America's projected 84.2%. Europe is forecast to reach 77.5%.\n\n"
            "In 1970, Asia and Africa were predominantly rural, with only 23.7% and 23.5% residing in urban settlements. Asia subsequently experienced rapid growth, reaching 44.8% in 2010 and projected to reach 54.8% by 2030 (+31.1%). Africa followed a similar upward trend, projected to expand to 47.1% by 2030."
        )
    },
    # -------------------------------------------------------------
    # Q94: Matrix - GHG Emissions by Sector
    # -------------------------------------------------------------
    {
        "id": "t1-acad-094",
        "category": "Table",
        "title": "Global Greenhouse Gas Emissions by Sector (1980–2020)",
        "prompt": "The table compares global greenhouse gas emissions in gigatonnes of CO2 equivalent (Gt CO2e) across five economic sectors between 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Global GHG Emissions by Sector (Gt CO2e)",
            "headers": ["Sector", "1980", "1990", "2000", "2010", "2020"],
            "rows": [
                ["Electricity & Heat", "6.8", "8.9", "11.2", "14.4", "15.8"],
                ["Industry & Manu.", "5.2", "6.4", "7.8", "9.6", "10.4"],
                ["Transportation", "3.4", "4.6", "5.8", "7.2", "8.1"],
                ["Agriculture", "4.2", "4.8", "5.1", "5.5", "5.8"],
                ["Buildings (Direct)", "2.1", "2.4", "2.6", "2.9", "3.0"],
            ]
        },
        "modelEssay": (
            "The table tracks global greenhouse gas emissions measured in gigatonnes of CO2 equivalent (Gt CO2e) across five economic sectors from 1980 to 2020.\n\n"
            "Overall, emissions rose across every economic sector over the forty-year timeline. Power generation remained the single largest contributor throughout and registered the largest absolute expansion, while building emissions remained the smallest.\n\n"
            "Electricity and heat production was consistently the dominant source of emissions, generating 6.8 Gt CO2e in 1980 and climbing steadily to 11.2 Gt in 2000 before reaching 15.8 Gt in 2020, representing an increase of 9.0 Gt. Industrial manufacturing followed as the second largest polluter, rising from 5.2 Gt in 1980 to 10.4 Gt in 2020, effectively doubling its emissions.\n\n"
            "Transportation exhibited the fastest relative growth rate, escalating from 3.4 Gt in 1980 to 8.1 Gt by 2020, an increase of roughly 138%. In contrast, agricultural emissions grew more moderately, inching up from 4.2 Gt in 1980 to 5.8 Gt in 2020. Direct building emissions remained the lowest throughout, rising from 2.1 to 3.0 Gt."
        )
    },
    # -------------------------------------------------------------
    # Q95: Matrix - Commercial Aviation Growth
    # -------------------------------------------------------------
    {
        "id": "t1-acad-095",
        "category": "Table",
        "title": "Commercial Aviation Traffic and Fleet Metrics (1985–2025)",
        "prompt": "The table compares global commercial aviation traffic in trillion passenger-kilometers, active jet fleets, and passenger totals between 1985 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Commercial Aviation Traffic (1985–2025)",
            "headers": ["Year", "Passengers (B)", "Pass-Km (Trillion)", "Active Airliners", "Fuel per Pax (L/100km)"],
            "rows": [
                ["1985", "0.9 B", "1.4 T", "7,200", "7.8 L"],
                ["1995", "1.3 B", "2.3 T", "10,800", "6.2 L"],
                ["2005", "2.1 B", "3.7 T", "16,200", "4.9 L"],
                ["2015", "3.5 B", "6.6 T", "24,500", "3.6 L"],
                ["2025", "4.8 B", "9.2 T", "31,800", "2.8 L"],
            ]
        },
        "modelEssay": (
            "The table provides data on global commercial civil aviation between 1985 and 2025, detailing annual passenger numbers, passenger-kilometers, commercial aircraft fleets, and fuel efficiency metrics.\n\n"
            "Overall, global passenger numbers, air travel distances, and airline fleets expanded substantially across the forty-year period, while fuel burn per passenger dropped significantly due to modern aircraft design.\n\n"
            "In 1985, global airlines transported 0.9 billion passengers, logging 1.4 trillion passenger-kilometers with an active fleet of 7,200 airliners. By 2005, passenger numbers had more than doubled to 2.1 billion travelers across 3.7 trillion passenger-kilometers, serviced by 16,200 commercial jets.\n\n"
            "Growth accelerated in the subsequent two decades. By 2025, passenger volumes reached 4.8 billion across 9.2 trillion passenger-kilometers, while the global active fleet expanded to 31,800 aircraft. Concurrently, fuel consumption per passenger declined continuously from 7.8 liters per 100 km in 1985 to 2.8 liters in 2025, representing a 64% efficiency improvement."
        )
    },
    # -------------------------------------------------------------
    # Q96: Matrix - Telecom Subscriptions
    # -------------------------------------------------------------
    {
        "id": "t1-acad-096",
        "category": "Table",
        "title": "Global Telecommunication Subscriptions (1985–2020)",
        "prompt": "The table compares global telecommunications subscriptions per 100 inhabitants for fixed landlines, mobile cellular, and fixed broadband between 1985 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Telecom Subscriptions per 100 People",
            "headers": ["Year", "Fixed Landline", "Mobile Cellular", "Fixed Broadband"],
            "rows": [
                ["1985", "8.5", "0.1", "0.0"],
                ["1995", "12.2", "1.6", "0.0"],
                ["2005", "19.4", "33.8", "4.8"],
                ["2015", "14.1", "98.5", "11.2"],
                ["2020", "11.5", "106.2", "15.8"],
            ]
        },
        "modelEssay": (
            "The table traces the evolution of telecommunication penetration rates, measured in subscriptions per 100 people globally, across fixed landlines, mobile cellular devices, and fixed broadband between 1985 and 2020.\n\n"
            "Overall, mobile phone subscriptions expanded dramatically to exceed total global population parity by 2020. In contrast, fixed landline telephony peaked in the mid-2000s before declining, while fixed broadband grew steadily.\n\n"
            "In 1985, fixed landlines were the sole significant communication medium at 8.5 subscriptions per 100 people, while mobile phones stood at a negligible 0.1 and broadband was nonexistent. Landline penetration peaked at 19.4 subscriptions per 100 inhabitants in 2005, before descending to 14.1 in 2015 and 11.5 by 2020 as wireless communication replaced wired telephone connections.\n\n"
            "In stark contrast, mobile cellular adoption surged rapidly after 1995 (1.6 per 100), reaching 33.8 in 2005 and jumping to 98.5 in 2015. By 2020, mobile subscriptions reached 106.2 per 100 people. Fixed broadband expanded steadily from its inception, growing from 4.8 subscriptions per 100 in 2005 to 15.8 by 2020."
        )
    },
    # -------------------------------------------------------------
    # Q97: Matrix - Forest Cover Net Change
    # -------------------------------------------------------------
    {
        "id": "t1-acad-097",
        "category": "Table",
        "title": "Global Forest Cover Net Annual Change (1990–2020)",
        "prompt": "The table illustrates the net annual change in forest area in millions of hectares per year across four continental regions from 1990 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Net Annual Forest Change (M Hectares/yr)",
            "headers": ["Region", "1990-2000", "2000-2010", "2010-2020"],
            "rows": [
                ["South America", "-5.2 M ha", "-4.8 M ha", "-2.6 M ha"],
                ["Africa", "-3.8 M ha", "-3.4 M ha", "-3.9 M ha"],
                ["Europe (inc. Russia)", "+0.9 M ha", "+0.8 M ha", "+0.4 M ha"],
                ["Asia", "-0.8 M ha", "+2.2 M ha", "+1.2 M ha"],
            ]
        },
        "modelEssay": (
            "The table provides data on average annual net changes in forested land area in millions of hectares per year across South America, Africa, Europe, and Asia across three consecutive decades between 1990 and 2020.\n\n"
            "Overall, South America and Africa experienced persistent net forest losses throughout the thirty-year timeframe, whereas Europe maintained consistent net afforestation, and Asia shifted from deforestation to net forest expansion.\n\n"
            "South America suffered the most severe deforestation during the 1990s, losing an average of 5.2 million hectares of forest annually between 1990 and 2000. Although annual net losses moderated to 4.8 million hectares from 2000 to 2010 and halved to 2.6 million hectares during the 2010–2020 decade, total forest cover continued to decline. Africa recorded heavy forest loss across all three intervals (-3.8 M, -3.4 M, and -3.9 M hectares annually).\n\n"
            "In contrast, Europe recorded net forest expansion throughout, adding 0.9 million hectares annually in the 1990s, 0.8 million during the 2000s, and 0.4 million from 2010 to 2020. Asia experienced a notable turnaround: after losing 0.8 million hectares per year in the 1990s, state afforestation programs yielded net gains of 2.2 million hectares annually in the 2000s and 1.2 million annually between 2010 and 2020."
        )
    },
    # -------------------------------------------------------------
    # Q98: Matrix - Global Shipping Ports
    # -------------------------------------------------------------
    {
        "id": "t1-acad-098",
        "category": "Table",
        "title": "Container Cargo Throughput at Leading Global Ports",
        "prompt": "The table compares container throughput in millions of TEU across five major maritime ports in 1995, 2010, and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Container Port Throughput (Million TEU)",
            "headers": ["Port", "1995", "2010", "2025 (Proj)", "Total Growth"],
            "rows": [
                ["Shanghai", "1.5 M", "29.1 M", "50.2 M", "+3,246%"],
                ["Singapore", "11.8 M", "28.4 M", "40.5 M", "+243%"],
                ["Rotterdam", "4.8 M", "11.1 M", "15.2 M", "+216%"],
                ["Busan", "4.5 M", "14.2 M", "23.5 M", "+422%"],
                ["Los Angeles", "2.6 M", "7.8 M", "10.8 M", "+315%"],
            ]
        },
        "modelEssay": (
            "The table compares annual container cargo volumes handled in millions of twenty-foot equivalent units (TEU) across five global shipping ports in 1995, 2010, and projected figures for 2025.\n\n"
            "Overall, container handling expanded substantially across all five ports over the thirty-year timeframe. Shanghai exhibited unprecedented exponential growth, rising from a modest regional facility into the world's preeminent container port.\n\n"
            "In 1995, Singapore was by far the leading port, processing 11.8 million TEU, followed by Rotterdam at 4.8 million and Busan at 4.5 million. Los Angeles handled 2.6 million TEU, while Shanghai recorded only 1.5 million TEU.\n\n"
            "By 2010, container traffic in Shanghai had increased nearly twentyfold to 29.1 million TEU, overtaking Singapore (28.4 million TEU). By 2025, Shanghai's projected throughput is expected to reach 50.2 million TEU, representing an extraordinary 3,246% expansion over the period. Singapore is projected to handle 40.5 million TEU, while Busan expanded solidly to 23.5 million TEU. Western ports grew more moderately, with Rotterdam reaching 15.2 million TEU and Los Angeles handling 10.8 million TEU."
        )
    },
    # -------------------------------------------------------------
    # Q99: Matrix - Renewable Electricity Share
    # -------------------------------------------------------------
    {
        "id": "t1-acad-099",
        "category": "Table",
        "title": "Renewable Electricity Share in Five Major Economies",
        "prompt": "The table shows the percentage of electricity generated from renewable sources across five countries from 2000 to 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Renewable Electricity Share (% of Grid)",
            "headers": ["Country", "2000", "2008", "2016", "2024", "Net Change"],
            "rows": [
                ["Norway", "99.1%", "98.5%", "97.8%", "98.4%", "-0.7%"],
                ["Germany", "6.3%", "14.8%", "31.6%", "52.8%", "+46.5%"],
                ["United Kingdom", "2.8%", "5.6%", "24.5%", "46.2%", "+43.4%"],
                ["China", "16.2%", "17.4%", "25.1%", "34.5%", "+18.3%"],
                ["United States", "8.8%", "9.2%", "15.3%", "23.4%", "+14.6%"],
            ]
        },
        "modelEssay": (
            "The table tracks the percentage share of national electricity generated from renewable sources in Norway, Germany, the United Kingdom, China, and the United States between 2000 and 2024.\n\n"
            "Overall, four of the five nations experienced substantial expansion in clean electricity generation, with Germany and the United Kingdom registering the most rapid gains. Norway maintained an overwhelmingly clean power grid throughout the entire period.\n\n"
            "Norway generated virtually all of its electricity from renewable hydropower, remaining steady between 97.8% and 99.1% across the twenty-four years. In contrast, Germany and the UK began with minimal green power in 2000 (6.3% and 2.8% respectively). However, concerted national energy transition programs pushed Germany's renewable share to 31.6% in 2016 and 52.8% by 2024, an increase of 46.5 percentage points. The UK achieved a comparable increase, reaching 46.2% by 2024.\n\n"
            "China and the United States advanced at a steadier pace. China's renewable contribution grew from 16.2% in 2000 to 34.5% in 2024. The United States lagged behind, expanding from 8.8% in 2000 to 23.4% in 2024, recording the lowest clean energy share among the surveyed nations."
        )
    },
    # -------------------------------------------------------------
    # Q100: Matrix - Education Completion Rates
    # -------------------------------------------------------------
    {
        "id": "t1-acad-0100",
        "category": "Table",
        "title": "Primary and Secondary School Completion Rates in Developing Nations",
        "prompt": "The table compares primary and secondary education completion rates across low-income, lower-middle, and upper-middle-income nations in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "School Completion Rates by Income Group (%)",
            "headers": ["Income Bracket", "1990 Primary", "2020 Primary", "1990 Secondary", "2020 Secondary"],
            "rows": [
                ["Low-Income", "46%", "68%", "18%", "34%"],
                ["Lower-Middle", "64%", "86%", "32%", "61%"],
                ["Upper-Middle", "82%", "96%", "54%", "82%"],
                ["Global Average", "68%", "87%", "41%", "66%"],
            ]
        },
        "modelEssay": (
            "The table evaluates educational progress by comparing primary and secondary school completion rates across low-income, lower-middle, and upper-middle-income country groups between 1990 and 2020.\n\n"
            "Overall, both primary and secondary completion rates advanced across all economic classifications, though graduation rates were consistently and substantially higher in wealthier nations and at the primary education level.\n\n"
            "In 1990, primary school completion stood at 82% in upper-middle-income countries, 64% in lower-middle-income nations, and just 46% in low-income economies, against a global average of 68%. By 2020, primary completion rates improved substantially, reaching 96% in upper-middle nations, 86% in lower-middle countries, and 68% in low-income territories, bringing the global average to 87%.\n\n"
            "Secondary education witnessed notable gains, albeit from lower baselines. In 1990, secondary graduation stood at 54% for upper-middle economies, 32% for lower-middle, and merely 18% for low-income nations. By 2020, upper-middle countries achieved an 82% secondary completion rate, lower-middle nations nearly doubled to 61%, and low-income economies advanced to 34%, raising the world average from 41% to 66%."
        )
    },
]
