"""
IELTS Academic Task 1 Data - Part 2 (Questions 26-50)
Themes:
3. Pie Charts (Q26-Q30)
4. Tables (Q31-Q40)
5. Mixed / Combined Charts (Q41-Q50)
"""

QUESTIONS_PART2 = [
    # -------------------------------------------------------------
    # Q26: Pie Chart - Smartphone Shipments by Manufacturer
    # -------------------------------------------------------------
    {
        "id": "t1-acad-026",
        "category": "Pie Chart",
        "title": "Global Smartphone Shipments by Brand (2024)",
        "prompt": "The pie chart illustrates the global market share of smartphone shipments across leading electronics manufacturers in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Global Smartphone Shipments (%)",
            "set1_title": "2024 Market Share",
            "set1_data": [("Samsung", 21), ("Apple", 20), ("Xiaomi", 14), ("Transsion", 9), ("Oppo", 9), ("Others", 27)],
        },
        "modelEssay": (
            "The pie chart illustrates the worldwide market share distribution of smartphone unit shipments among major manufacturers during 2024.\n\n"
            "Overall, Samsung and Apple maintained a closely matched duopoly at the apex of the global mobile industry, while Chinese manufacturers captured substantial combined shares alongside a diverse long tail of secondary brands.\n\n"
            "Samsung captured the highest individual share of global shipments at 21%, narrowly leading Apple, which accounted for 20%. Together, these two industry leaders represented more than two-fifths (41%) of all smartphones sold globally.\n\n"
            "Among other competitors, Xiaomi established itself as the third largest producer, securing 14% of shipments. Transsion and Oppo followed, each capturing an identical 9% market share. The remaining 27% of global sales was distributed among various smaller manufacturers in the 'Others' category."
        )
    },
    # -------------------------------------------------------------
    # Q27: Pie Chart - Retail Sales Channels
    # -------------------------------------------------------------
    {
        "id": "t1-acad-027",
        "category": "Pie Chart",
        "title": "Retail Sales Revenue by Channel (2015 vs 2025)",
        "prompt": "The two pie charts compare consumer retail spending across brick-and-mortar stores, e-commerce websites, and mobile apps in 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Retail Channel Distribution",
            "set1_title": "2015",
            "set1_data": [("Physical Stores", 78), ("Web Desktop", 16), ("Mobile App", 6)],
            "set2_title": "2025",
            "set2_data": [("Physical Stores", 44), ("Web Desktop", 22), ("Mobile App", 34)],
        },
        "modelEssay": (
            "The two pie charts examine the changing distribution of total retail sales revenue generated across physical stores, desktop e-commerce websites, and mobile applications between 2015 and 2025.\n\n"
            "Overall, commercial retail transactions migrated rapidly away from traditional high-street shops toward digital platforms, with mobile application purchases undergoing the most explosive expansion.\n\n"
            "In 2015, physical brick-and-mortar storefronts overwhelmingly commanded the market, accounting for 78% of all consumer transactions. Desktop web portals generated 16%, while smartphone apps represented a modest 6% of sales.\n\n"
            "A decade later in 2025, in-store shopping saw its market share nearly halved to 44%, losing its absolute dominance. In contrast, mobile application commerce grew nearly sixfold to 34%, emerging as the second largest revenue source. Desktop web purchasing also experienced healthy gains, edging up from 16% to 22%."
        )
    },
    # -------------------------------------------------------------
    # Q28: Pie Chart - Passenger Travel Purpose
    # -------------------------------------------------------------
    {
        "id": "t1-acad-028",
        "category": "Pie Chart",
        "title": "Primary Purpose of International Airline Travel",
        "prompt": "The pie chart shows the breakdown of reasons for international flights undertaken by passengers through a major hub airport in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Reasons for International Flights (%)",
            "set1_title": "Travel Purpose",
            "set1_data": [("Holiday / Tourism", 52), ("Visiting Family", 24), ("Business Travel", 18), ("Education / Other", 6)],
        },
        "modelEssay": (
            "The pie chart illustrates the distribution of primary travel motivations reported by international airline passengers departing from a major hub airport in 2024.\n\n"
            "Overall, leisure holidays and visiting relatives collectively constituted more than three-quarters of all overseas journeys, with commercial corporate travel occupying a secondary position.\n\n"
            "Holiday and tourism represented by far the most prevalent purpose of international air transit, accounting for slightly more than half (52%) of all departing flyers. Visiting family and relatives formed the second largest motivation, responsible for roughly one-quarter (24%) of total passengers.\n\n"
            "Business and commercial engagements comprised 18% of overseas trips, reflecting substantial professional travel. The remaining 6% was attributed to education, medical consultations, and miscellaneous individual reasons."
        )
    },
    # -------------------------------------------------------------
    # Q29: Pie Chart - Municipal Budget Allocation
    # -------------------------------------------------------------
    {
        "id": "t1-acad-029",
        "category": "Pie Chart",
        "title": "Municipal City Budget Expenditure Allocation",
        "prompt": "The pie chart below displays how a metropolitan city council allocated its annual tax revenue across five municipal services in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Municipal Budget Allocation (%)",
            "set1_title": "City Expenditure",
            "set1_data": [("Public Education", 35), ("Health & Social", 28), ("Public Transit", 18), ("Sanitation & Waste", 12), ("Parks & Culture", 7)],
        },
        "modelEssay": (
            "The pie chart delineates the proportion of annual public expenditure allocated across five public sectors by a metropolitan city council in 2024.\n\n"
            "Overall, human services—namely education, healthcare, and social welfare—absorbed nearly two-thirds of the city's total operating capital, whereas recreational and environmental amenities received the smallest budget share.\n\n"
            "Public education was the primary beneficiary of municipal revenue, commanding 35% of the annual budget. Healthcare and social assistance programs constituted the second largest expenditure, claiming 28% of municipal resources.\n\n"
            "Infrastructure and logistical maintenance absorbed the remaining funds. Public transport operations received 18%, while sanitation and waste disposal required 12%. Parks, libraries, and cultural recreation received the lowest funding priority at 7%."
        )
    },
    # -------------------------------------------------------------
    # Q30: Pie Chart - Agricultural Crop Production
    # -------------------------------------------------------------
    {
        "id": "t1-acad-030",
        "category": "Pie Chart",
        "title": "Agricultural Crop Output Share in Southeast Asia",
        "prompt": "The pie chart below shows the percentage distribution of total crop tonnage harvested in a Southeast Asian nation in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Harvested Crop Production (%)",
            "set1_title": "Agricultural Output",
            "set1_data": [("Rice", 48), ("Cassava & Tubers", 22), ("Sugarcane", 16), ("Maize & Corn", 9), ("Legumes & Pulses", 5)],
        },
        "modelEssay": (
            "The pie chart displays the percentage share of agricultural crop tonnage harvested across five key staple foods in a Southeast Asian country in 2024.\n\n"
            "Overall, rice overwhelmingly constituted the dominant harvest, comprising nearly half of all agricultural yield, while root crops and sugar accounted for the majority of the remaining volume.\n\n"
            "Rice held an uncontested lead at 48% of total agricultural production, underscoring its foundational role as a dietary staple. Cassava and other edible tubers represented the second largest crop category at 22%, followed by commercial sugarcane harvests at 16%.\n\n"
            "Cereal grains and legumes represented minor shares. Maize accounted for 9% of total production, while pulses and legumes formed the smallest agricultural component at 5%."
        )
    },
    # -------------------------------------------------------------
    # Q31: Table - Consumer Expenditure
    # -------------------------------------------------------------
    {
        "id": "t1-acad-031",
        "category": "Table",
        "title": "Household Expenditure on Basic Categories Across Five Nations",
        "prompt": "The table below compares household spending percentages on food/tobacco, clothing/footwear, and leisure/education in Ireland, Italy, Spain, Sweden, and Turkey in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Consumer Spending by Category (%)",
            "headers": ["Country", "Food / Tobacco", "Clothing / Footwear", "Leisure / Education"],
            "rows": [
                ["Ireland", "28.9%", "6.4%", "2.2%"],
                ["Italy", "16.4%", "9.0%", "3.2%"],
                ["Spain", "18.8%", "6.5%", "1.9%"],
                ["Sweden", "15.8%", "5.4%", "3.2%"],
                ["Turkey", "32.1%", "6.6%", "4.3%"],
            ]
        },
        "modelEssay": (
            "The table provides a comparative breakdown of household spending percentages across three broad consumption categories in five European nations during 2024.\n\n"
            "Overall, food, drinks, and tobacco constituted the largest expenditure commitment across all five countries. In contrast, leisure and education consistently represented the smallest fraction of domestic budgets, with clothing occupying an intermediate position.\n\n"
            "Turkey recorded the highest proportion of household spending devoted to food and tobacco at 32.1%, closely followed by Ireland at 28.9%. Spain allocated 18.8%, while Italy and Sweden registered lower allocations at 16.4% and 15.8% respectively.\n\n"
            "Regarding clothing and footwear, Italy topped the table with 9.0% of household outlays, whereas the remaining nations clustered closely between 5.4% in Sweden and 6.6% in Turkey. Finally, spending on recreation and education remained modest across all countries, ranging from 1.9% in Spain to a high of 4.3% in Turkey."
        )
    },
    # -------------------------------------------------------------
    # Q32: Table - Rail Network Performance
    # -------------------------------------------------------------
    {
        "id": "t1-acad-032",
        "category": "Table",
        "title": "National Rail Network Operational Performance",
        "prompt": "The table below provides comparative metrics on passenger volume, on-time punctuality, and passenger satisfaction across four European rail networks in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Rail Network Performance Metrics (2024)",
            "headers": ["Network", "Annual Pass. (M)", "Punctuality (<5m)", "Satisfaction Rating"],
            "rows": [
                ["SBB (Switzerland)", "480 M", "94.2%", "91%"],
                ["NS (Netherlands)", "390 M", "91.8%", "86%"],
                ["SNCF (France)", "1,220 M", "86.4%", "78%"],
                ["DB (Germany)", "1,850 M", "68.5%", "64%"],
            ]
        },
        "modelEssay": (
            "The table presents performance indicators for four national passenger railway systems in 2024, assessing annual passenger volumes, on-time arrival punctuality, and overall customer satisfaction ratings.\n\n"
            "Overall, smaller railway systems in Switzerland and the Netherlands achieved vastly superior reliability and passenger approval compared to their larger counterparts in France and Germany, with Germany recording the lowest operational metrics.\n\n"
            "Deutsche Bahn (Germany) carried the highest annual volume of travelers at 1,850 million, yet logged the lowest punctuality score with only 68.5% of trains arriving on time, resulting in a customer satisfaction rating of 64%. France's SNCF accommodated the second largest ridership at 1,220 million travelers, attaining 86.4% punctuality and 78% satisfaction.\n\n"
            "Conversely, Switzerland's SBB operated with unmatched efficiency, registering a punctuality rate of 94.2% and a satisfaction level of 91% across 480 million passengers. The Dutch NS system delivered comparable performance, achieving 91.8% reliability and 86% passenger satisfaction."
        )
    },
    # -------------------------------------------------------------
    # Q33: Table - Hospital Resource Allocation
    # -------------------------------------------------------------
    {
        "id": "t1-acad-033",
        "category": "Table",
        "title": "Regional Hospital Capacities and Average ER Waiting Times",
        "prompt": "The table below details hospital bed capacities, staff-to-patient ratios, and average Emergency Room (ER) waiting durations across four administrative health regions in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Healthcare Resources & Emergency Performance",
            "headers": ["Health Region", "Beds per 1k", "Doctors per 1k", "Nurses per 1k", "Avg ER Wait"],
            "rows": [
                ["Northern", "4.8", "3.6", "9.2", "2.1 hrs"],
                ["Central", "3.2", "2.8", "7.1", "3.8 hrs"],
                ["Eastern", "2.5", "2.1", "5.8", "4.6 hrs"],
                ["Western", "3.9", "3.1", "8.0", "2.9 hrs"],
            ]
        },
        "modelEssay": (
            "The table compares healthcare infrastructure and emergency room performance across four administrative zones in 2024, detailing bed density, medical staffing ratios, and average ER waiting times.\n\n"
            "Overall, health regions with higher medical staffing and bed ratios demonstrated significantly shorter emergency department waiting times, with the Northern region leading in all medical indicators.\n\n"
            "The Northern zone was the most comprehensively equipped, providing 4.8 hospital beds, 3.6 physicians, and 9.2 registered nurses per 1,000 citizens. Consequently, it achieved the shortest emergency department waiting time at 2.1 hours. The Western region ranked second, offering 3.9 beds, 3.1 doctors, and 8.0 nurses per 1,000 people, with an average wait of 2.9 hours.\n\n"
            "In contrast, the Eastern zone reported the most acute healthcare resource constraints, providing only 2.5 beds, 2.1 doctors, and 5.8 nurses per 1,000 residents, which resulted in the longest average emergency wait at 4.6 hours. The Central area registered intermediate metrics with 3.2 beds and a 3.8-hour wait."
        )
    },
    # -------------------------------------------------------------
    # Q34: Table - Salaries and Living Costs
    # -------------------------------------------------------------
    {
        "id": "t1-acad-034",
        "category": "Table",
        "title": "Average Monthly Earnings and Living Costs in Six Global Cities",
        "prompt": "The table below outlines average monthly net salaries and basic living expenses (including rent) in US dollars across six major global cities in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Monthly Earnings vs Living Expenses (USD, 2024)",
            "headers": ["City", "Avg Net Salary", "Monthly Rent", "Food & Transit", "Savings Margin"],
            "rows": [
                ["Zurich", "$7,200", "$2,400", "$1,600", "$3,200"],
                ["New York", "$6,100", "$3,100", "$1,450", "$1,550"],
                ["London", "$4,200", "$2,100", "$1,200", "$900"],
                ["Tokyo", "$3,400", "$1,250", "$950", "$1,200"],
                ["Berlin", "$3,600", "$1,350", "$900", "$1,350"],
                ["Singapore", "$5,400", "$2,800", "$1,100", "$1,500"],
            ]
        },
        "modelEssay": (
            "The table provides a comparative breakdown of average monthly net incomes, accommodation costs, basic living expenditures, and residual savings margins across six international metropolitan centres in 2024.\n\n"
            "Overall, Zurich offered the highest net salary and the largest monthly savings margin, while New York recorded the highest accommodation expenses. In contrast, London residents retained the lowest net savings despite earning moderate incomes.\n\n"
            "Zurich led in compensation with an average net monthly salary of $7,200, coupled with $2,400 in rent and $1,600 in food and transport expenses, leaving workers with an unmatched savings margin of $3,200. New York offered the second highest salary ($6,100), but exorbitant rents averaging $3,100 compressed savings to $1,550, comparable to Singapore ($1,500 surplus on a $5,400 salary).\n\n"
            "Tokyo and Berlin featured modest incomes ($3,400 and $3,600 respectively) balanced by affordable housing ($1,250 and $1,350), yielding healthy surpluses of $1,200 and $1,350. London recorded the narrowest financial margin: despite earning $4,200, high living costs reduced residual savings to just $900."
        )
    },
    # -------------------------------------------------------------
    # Q35: Table - Agricultural Yields
    # -------------------------------------------------------------
    {
        "id": "t1-acad-035",
        "category": "Table",
        "title": "Grain Crop Yields (Tonnes per Hectare) from 1990 to 2020",
        "prompt": "The table below shows crop yields measured in tonnes per hectare for wheat, maize, rice, and barley across three decades from 1990 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Global Grain Yields (Tonnes per Hectare)",
            "headers": ["Crop", "1990", "2000", "2010", "2020", "Growth (%)"],
            "rows": [
                ["Maize (Corn)", "3.7", "4.3", "5.1", "5.9", "+59%"],
                ["Rice (Paddy)", "3.5", "3.9", "4.4", "4.7", "+34%"],
                ["Wheat", "2.6", "2.8", "3.1", "3.5", "+35%"],
                ["Barley", "2.2", "2.4", "2.7", "3.0", "+36%"],
            ]
        },
        "modelEssay": (
            "The table delineates global agricultural productivity, quantified in tonnes per hectare, for four essential grain staples between 1990 and 2020, alongside overall thirty-year percentage growth rates.\n\n"
            "Overall, yields across all four crops increased consistently over the three decades. Maize consistently produced the highest harvest per hectare and achieved the greatest percentage improvement, while barley remained the lowest-yielding crop throughout.\n\n"
            "In 1990, maize generated 3.7 tonnes per hectare, expanding to 4.3 in 2000 and 5.1 in 2010, before culminating at 5.9 tonnes per hectare in 2020, representing an exceptional 59% cumulative increase. Rice recorded the second highest productivity, climbing steadily from 3.5 tonnes in 1990 to 4.7 tonnes per hectare in 2020, an expansion of 34%.\n\n"
            "Wheat and barley yielded smaller harvests throughout the timeline. Wheat production advanced from 2.6 tonnes per hectare in 1990 to 3.5 in 2020 (+35%). Similarly, barley yields progressed from 2.2 tonnes in 1990 to 3.0 tonnes per hectare in 2020, representing a 36% gain."
        )
    },
    # -------------------------------------------------------------
    # Q36: Table - Vehicle Fuel Efficiency
    # -------------------------------------------------------------
    {
        "id": "t1-acad-036",
        "category": "Table",
        "title": "Vehicle Efficiency and Emissions by Powertrain Class",
        "prompt": "The table compares average fuel efficiency, carbon emissions, and annual fueling expenses for four vehicle powertrain categories in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Automotive Powertrain Comparison (2024)",
            "headers": ["Vehicle Class", "Efficiency (MPG)", "CO2 (g/km)", "Annual Fuel Cost", "Maintenance Index"],
            "rows": [
                ["Gasoline (Petrol)", "31 MPG", "168 g/km", "$2,100", "100"],
                ["Diesel", "42 MPG", "142 g/km", "$1,750", "115"],
                ["Hybrid Electric", "54 MPG", "95 g/km", "$1,200", "85"],
                ["Full Electric (EV)", "118 MPGe", "0 g/km", "$650", "45"],
            ]
        },
        "modelEssay": (
            "The table provides a comparative assessment of fuel efficiency, tailpipe carbon emissions, annual fueling expenditures, and maintenance cost indices across four vehicle engine types in 2024.\n\n"
            "Overall, full electric vehicles (EVs) proved vastly superior in energy economy, emissions elimination, and operating costs, while traditional gasoline vehicles recorded the poorest environmental and financial metrics.\n\n"
            "Conventional gasoline automobiles delivered the lowest fuel efficiency at 31 miles per gallon (MPG), generating the highest greenhouse emissions at 168 grams of CO2 per kilometer, and incurring an annual fuel bill of $2,100. Diesel vehicles offered improved fuel economy (42 MPG) and lower operating fuel costs ($1,750), though their mechanical maintenance index was the highest at 115.\n\n"
            "Hybrid electric vehicles demonstrated notable efficiency gains, delivering 54 MPG, reducing emissions to 95 g/km, and cutting fuel outlays to $1,200. Full electric models achieved dramatic advantages: registering 118 MPGe with zero tailpipe emissions, slashing annual charging costs to $650, and halving the maintenance index to 45."
        )
    },
    # -------------------------------------------------------------
    # Q37: Table - International Student Fees
    # -------------------------------------------------------------
    {
        "id": "t1-acad-037",
        "category": "Table",
        "title": "International University Tuition and Living Costs",
        "prompt": "The table below compares average annual international tuition fees, accommodation expenses, and international student proportions across four leading study destinations in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "International Student Study Costs (USD, 2024)",
            "headers": ["Country", "Avg Tuition (USD)", "Annual Living Cost", "Total Annual Cost", "Intl Student %"],
            "rows": [
                ["United States", "$32,500", "$15,200", "$47,700", "15%"],
                ["United Kingdom", "$24,800", "$14,500", "$39,300", "22%"],
                ["Australia", "$28,400", "$16,800", "$45,200", "28%"],
                ["Canada", "$21,500", "$13,200", "$34,700", "19%"],
            ]
        },
        "modelEssay": (
            "The table outlines the financial commitments and campus demographics associated with international university enrollment across the United States, the United Kingdom, Australia, and Canada in 2024.\n\n"
            "Overall, the United States was the most expensive destination for overseas undergraduates, while Canada offered the most economical option. Conversely, Australia hosted the highest proportion of foreign students relative to its total student body.\n\n"
            "In the United States, international tuition averaged $32,500 annually, which, combined with $15,200 in living costs, resulted in the highest total annual expenditure of $47,700, while international students comprised 15% of the collegiate population. Australia ranked second in total expense at $45,200 ($28,400 tuition plus $16,800 living costs) and boasted the highest international representation at 28%.\n\n"
            "The United Kingdom required an average total outlay of $39,300 ($24,800 in tuition and $14,500 in living expenses) with international enrollment at 22%. Canada was the most cost-effective study destination, with lower tuition ($21,500) and living costs ($13,200) yielding a total annual expense of $34,700."
        )
    },
    # -------------------------------------------------------------
    # Q38: Table - Air Quality Index in Capital Cities
    # -------------------------------------------------------------
    {
        "id": "t1-acad-038",
        "category": "Table",
        "title": "Air Quality Index (AQI) and PM2.5 in Eight Capitals",
        "prompt": "The table compares average Air Quality Index (AQI) values and fine particulate matter (PM2.5) concentrations in micrograms per cubic meter across eight capital cities in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Urban Air Quality Comparison (2024)",
            "headers": ["Capital City", "Average AQI", "PM2.5 (ug/m3)", "WHO Target Ratio", "Status"],
            "rows": [
                ["Helsinki", "22", "5.2 ug/m3", "1.0x", "Good"],
                ["Stockholm", "26", "6.1 ug/m3", "1.2x", "Good"],
                ["Tokyo", "45", "11.4 ug/m3", "2.3x", "Moderate"],
                ["London", "48", "12.2 ug/m3", "2.4x", "Moderate"],
                ["Beijing", "98", "34.5 ug/m3", "6.9x", "Unhealthy (Mod)"],
                ["New Delhi", "182", "98.4 ug/m3", "19.7x", "Hazardous"],
            ]
        },
        "modelEssay": (
            "The table assesses urban atmospheric pollution across six world capitals in 2024, reporting the average Air Quality Index (AQI), PM2.5 particulate concentrations, ratios relative to WHO health guidelines, and qualitative air status.\n\n"
            "Overall, Nordic European capitals maintained pristine air quality closely aligning with World Health Organization guidelines, whereas Asian megacities exhibited severe particulate concentrations, with New Delhi recording hazardous pollution levels.\n\n"
            "Helsinki recorded the cleanest atmosphere with an AQI of 22 and a PM2.5 concentration of just 5.2 ug/m3, directly meeting the WHO baseline. Stockholm followed closely with an AQI of 26 and 6.1 ug/m3 of PM2.5. Tokyo and London recorded moderate pollution levels, registering AQIs of 45 and 48, and particulate levels of 11.4 and 12.2 ug/m3 respectively.\n\n"
            "In stark contrast, Beijing recorded an average AQI of 98 and PM2.5 levels of 34.5 ug/m3, exceeding safety guidelines nearly sevenfold. New Delhi suffered the most critical pollution, logging a hazardous AQI of 182 and an alarming 98.4 ug/m3 of particulate matter, roughly twenty times the international health threshold."
        )
    },
    # -------------------------------------------------------------
    # Q39: Table - Public Transit Systems
    # -------------------------------------------------------------
    {
        "id": "t1-acad-039",
        "category": "Table",
        "title": "Metropolitan Public Transit Ridership and Revenue",
        "prompt": "The table compares network route length, annual passenger trips, and farebox cost recovery ratios across five metropolitan transit networks in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Metropolitan Transit System Performance",
            "headers": ["City System", "Track Length", "Annual Trips (B)", "Single Fare (USD)", "Fare Recovery"],
            "rows": [
                ["Tokyo Metro", "310 km", "3.8 B", "$1.60", "124%"],
                ["Seoul Metro", "340 km", "2.9 B", "$1.10", "82%"],
                ["London Tube", "402 km", "1.2 B", "$3.50", "94%"],
                ["NYC Subway", "399 km", "1.7 B", "$2.90", "51%"],
                ["Paris Metro", "226 km", "1.5 B", "$2.30", "68%"],
            ]
        },
        "modelEssay": (
            "The table provides operational metrics for subway systems in Tokyo, Seoul, London, New York City, and Paris in 2024, evaluating network length, annual ridership, ticket prices, and financial farebox recovery ratios.\n\n"
            "Overall, Tokyo Metro dominated in passenger volume and was the only self-funding network running a financial surplus, whereas New York City required the heaviest public operational subsidy.\n\n"
            "Tokyo Metro served 3.8 billion annual passenger trips across 310 kilometers of track, achieving a farebox recovery ratio of 124% with an affordable $1.60 average fare. Seoul Metro also carried high volumes (2.9 billion trips on 340 km) with the lowest single ticket price of $1.10, yielding an 82% cost recovery rate.\n\n"
            "Among Western networks, the London Underground operated the longest system (402 km) with 1.2 billion riders; its premium $3.50 fare recovered 94% of operational costs. New York's 399 km system accommodated 1.7 billion trips at $2.90 per journey, recovering just 51% of expenditure, while Paris handled 1.5 billion riders across 226 km, attaining a 68% recovery ratio."
        )
    },
    # -------------------------------------------------------------
    # Q40: Table - Broadband Internet Speeds and Prices
    # -------------------------------------------------------------
    {
        "id": "t1-acad-040",
        "category": "Table",
        "title": "Household Broadband Speeds and Monthly Subscription Costs",
        "prompt": "The table below compares average broadband download speeds in megabits per second (Mbps) and monthly subscription costs across five nations in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "table",
        "chart_params": {
            "title": "Broadband Internet Metrics (2024)",
            "headers": ["Country", "Avg Download", "Avg Upload", "Monthly Cost (USD)", "Cost per 100Mbps"],
            "rows": [
                ["Singapore", "285 Mbps", "240 Mbps", "$38", "$13.30"],
                ["South Korea", "255 Mbps", "210 Mbps", "$32", "$12.50"],
                ["France", "190 Mbps", "150 Mbps", "$34", "$17.90"],
                ["United States", "220 Mbps", "85 Mbps", "$72", "$32.70"],
                ["Australia", "95 Mbps", "32 Mbps", "$64", "$67.40"],
            ]
        },
        "modelEssay": (
            "The table evaluates residential broadband telecommunications in Singapore, South Korea, France, the United States, and Australia during 2024, examining download and upload speeds alongside subscription pricing.\n\n"
            "Overall, Asian nations provided the fastest connection speeds at the most competitive costs per unit of bandwidth, whereas Australia registered the slowest speeds and the highest relative pricing.\n\n"
            "Singapore delivered the fastest connection with average download speeds of 285 Mbps and uploads of 240 Mbps for $38 monthly ($13.30 per 100 Mbps). South Korea followed closely, providing 255 Mbps download and 210 Mbps upload for the lowest fee of $32, yielding the most cost-effective metric of $12.50 per 100 Mbps. France offered balanced value with 190 Mbps download for $34.\n\n"
            "In contrast, the United States provided robust downloads of 220 Mbps but asymmetrical uploads (85 Mbps) alongside a steep $72 monthly bill ($32.70 per 100 Mbps). Australia ranked poorest in all technical categories, averaging only 95 Mbps download and 32 Mbps upload while charging $64, translating to an exorbitant cost of $67.40 per 100 Mbps."
        )
    },
    # -------------------------------------------------------------
    # Q41: Mixed Chart - Population & Age Demographics
    # -------------------------------------------------------------
    {
        "id": "t1-acad-041",
        "category": "Mixed Chart",
        "title": "National Population Growth (Line) and Age Distribution (Bar)",
        "prompt": "The charts below illustrate total national population growth between 1980 and 2020 (line graph) and demographic age distribution percentages across the same four decades (bar chart) for a European country. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Age Demographic Distribution (1980 vs 2020)",
            "categories": ["0-14 Years", "15-64 (Working)", "65+ (Senior)"],
            "series_dict": {
                "1980": [24, 66, 10],
                "2020": [14, 62, 24],
            },
            "y_unit": "Population Share (%)",
            "y_min": 0,
            "y_max": 80,
            "y_step": 20
        },
        "modelEssay": (
            "The bar chart and accompanying demographic data illustrate population age structures in an industrialized nation between 1980 and 2020 across three categories: children (0–14), working-age adults (15–64), and seniors (65+).\n\n"
            "Overall, while total population expanded from 48 million to 58 million over the forty-year period, the nation underwent significant population ageing, characterized by a sharp decline in youth and a substantial increase in the senior demographic.\n\n"
            "In 1980, children aged 0–14 accounted for 24% of the population, whereas senior citizens aged 65 and above comprised only 10%. Working-age adults formed the core demographic majority, representing roughly two-thirds (66%) of all residents.\n\n"
            "By 2020, demographic patterns experienced a profound shift. The senior cohort aged 65 and above more than doubled to reach 24% of the populace, precisely matching the proportion of children four decades prior. In contrast, the youth segment declined by ten percentage points to 14%. The working-age bracket contracted slightly from 66% to 62%, indicating an increasing elderly dependency ratio."
        )
    },
    # -------------------------------------------------------------
    # Q42: Mixed Chart - Energy Production & Renewables
    # -------------------------------------------------------------
    {
        "id": "t1-acad-042",
        "category": "Mixed Chart",
        "title": "Total Electricity Generation and Renewable Proportions",
        "prompt": "The chart below shows total annual electricity generation (in Terawatt-hours) and the percentage contributed by renewable sources in a nation between 2000 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Power Generation vs Renewable Share",
            "categories": ["2000", "2006", "2012", "2018", "2024"],
            "series_dict": {
                "Total Output (TWh)": [320, 360, 390, 410, 430],
                "Renewable Share (%)": [8, 14, 22, 34, 48],
            },
            "y_unit": "TWh / Percentage",
            "y_min": 0,
            "y_max": 450,
            "y_step": 75
        },
        "modelEssay": (
            "The chart compares total electricity production in Terawatt-hours (TWh) with the percentage share derived from renewable resources in a developed country from 2000 to 2024.\n\n"
            "Overall, both total energy generation and the green energy proportion experienced continuous growth, with renewable energy expanding at a substantially faster relative rate to generate nearly half of national electricity by 2024.\n\n"
            "Total electricity generation expanded steadily throughout the period. In 2000, national power stations produced 320 TWh, rising to 360 TWh in 2006 and 390 TWh in 2012. Output continued upward to reach 410 TWh in 2018 and culminated at 430 TWh in 2024, representing an overall expansion of roughly 34%.\n\n"
            "In parallel, clean energy made dramatic inroads into the national power grid. In 2000, renewables contributed merely 8% of total generation. This figure advanced to 14% in 2006, 22% in 2012, and 34% in 2018. By 2024, renewables supplied 48% of the nation's 430 TWh output, a sixfold percentage increase over the twenty-four-year timeline."
        )
    },
    # -------------------------------------------------------------
    # Q43: Mixed Chart - Publishing Revenue by Genre
    # -------------------------------------------------------------
    {
        "id": "t1-acad-043",
        "category": "Mixed Chart",
        "title": "Publishing Industry Revenue and Genre Market Share",
        "prompt": "The charts below illustrate total book publishing industry turnover from 2014 to 2024 and market share breakdown by genre in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Publishing Revenue by Literary Genre (2024)",
            "categories": ["Fiction", "Non-Fiction", "Academic", "Children's", "Comics"],
            "series_dict": {
                "Revenue ($B)": [4.8, 3.9, 2.8, 2.2, 1.3],
                "Market Share (%)": [32, 26, 19, 15, 8],
            },
            "y_unit": "Billions / Percentage",
            "y_min": 0,
            "y_max": 35,
            "y_step": 5
        },
        "modelEssay": (
            "The bar chart examines sales revenue in billions of dollars and percentage market shares across five publishing genres in an English-speaking market during 2024.\n\n"
            "Overall, fiction and non-fiction generated the substantial majority of publishing turnover, while children's books and graphic novels represented smaller specialized sectors.\n\n"
            "Fiction was the foremost genre, generating $4.8 billion in turnover and capturing nearly one-third (32%) of total industry market share. General non-fiction ranked second, contributing $3.9 billion in sales and accounting for 26% of publishing transactions.\n\n"
            "Educational and academic textbooks generated $2.8 billion, representing 19% of industry turnover. Children's literature achieved $2.2 billion in revenue, capturing 15% of the market. Comic books and graphic novels recorded the smallest market contribution, generating $1.3 billion and claiming 8% of total publishing turnover."
        )
    },
    # -------------------------------------------------------------
    # Q44: Mixed Chart - Coffee Output and Prices
    # -------------------------------------------------------------
    {
        "id": "t1-acad-044",
        "category": "Mixed Chart",
        "title": "Coffee Production Volume and Global Export Prices",
        "prompt": "The chart illustrates coffee production in millions of bags alongside average international export prices per pound between 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Coffee Production (M Bags) vs Price ($/lb)",
            "categories": ["2005", "2010", "2015", "2020", "2025"],
            "series_dict": {
                "Output (M Bags)": [115, 132, 148, 165, 178],
                "Price ($/lb)": [1.10, 1.85, 1.40, 1.30, 2.25],
            },
            "y_unit": "Volume / USD",
            "y_min": 0,
            "y_max": 180,
            "y_step": 30
        },
        "modelEssay": (
            "The chart compares total global coffee production in millions of 60kg bags with average world market export prices per pound in US dollars between 2005 and 2025.\n\n"
            "Overall, worldwide coffee production expanded steadily throughout the two-decade timeframe. In contrast, global commodity prices exhibited pronounced volatility, peaking in 2010 and 2025.\n\n"
            "Global harvest volumes climbed continuously over the period. Beginning at 115 million bags in 2005, production expanded to 132 million in 2010, 148 million in 2015, and 165 million in 2020, concluding at a record 178 million bags in 2025, representing a cumulative increase of approximately 55%.\n\n"
            "Export pricing, however, fluctuated considerably. After trading at $1.10 per pound in 2005, prices surged to $1.85 in 2010 due to crop frosts, before subsiding to $1.40 in 2015 and $1.30 in 2020 amid global bumper harvests. By 2025, increased demand pushed prices to a twenty-year peak of $2.25 per pound."
        )
    },
    # -------------------------------------------------------------
    # Q45: Mixed Chart - Box Office vs Streaming
    # -------------------------------------------------------------
    {
        "id": "t1-acad-045",
        "category": "Mixed Chart",
        "title": "Cinema Box Office Revenue and Streaming Subscriptions",
        "prompt": "The chart below tracks cinema box office revenue (in billions of dollars) and paid video streaming subscriptions (in millions) from 2014 to 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Cinema Revenue ($B) vs Streaming Subs (M)",
            "categories": ["2014", "2016", "2018", "2020", "2022", "2024"],
            "series_dict": {
                "Box Office ($B)": [36, 38, 41, 12, 26, 33],
                "Streaming (10M)": [12, 24, 45, 95, 125, 145],
            },
            "y_unit": "Revenue ($B) / Subs (10M)",
            "y_min": 0,
            "y_max": 150,
            "y_step": 30
        },
        "modelEssay": (
            "The chart compares worldwide cinema box office revenues in billions of dollars with active subscription video-on-demand memberships (scaled in tens of millions) between 2014 and 2024.\n\n"
            "Overall, theatrical box office receipts were characterized by moderate initial gains followed by a catastrophic collapse and partial recovery around 2020. Conversely, digital streaming subscriptions experienced exponential, uninterrupted growth.\n\n"
            "Between 2014 and 2018, theatrical exhibition thrived, with global box office climbing from $36 billion to a high of $41 billion. However, widespread theater closures in 2020 caused revenues to plummet by more than two-thirds to $12 billion. Although cinema attendance subsequently rebounded to $26 billion in 2022 and $33 billion in 2024, revenues remained below their pre-crisis peak.\n\n"
            "In stark contrast, video streaming expanded uninterruptedly. From 120 million accounts in 2014, subscriber numbers doubled to 240 million in 2016 and reached 450 million in 2018. During the 2020 lockdowns, subscriptions surged dramatically to 950 million, continuing upward to reach 1.45 billion active memberships by 2024."
        )
    },
    # -------------------------------------------------------------
    # Q46: Mixed Chart - Temperature and Rainfall Climograph
    # -------------------------------------------------------------
    {
        "id": "t1-acad-046",
        "category": "Mixed Chart",
        "title": "Monthly Average Temperature and Rainfall in Sydney",
        "prompt": "The climograph below shows the average monthly temperature (in degrees Celsius) and monthly precipitation (in millimetres) recorded in Sydney over a typical year. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Sydney Monthly Climate Profile",
            "categories": ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
            "series_dict": {
                "Precipitation (mm)": [105, 130, 100, 60, 70, 85],
                "Temperature (°C)": [26, 25, 20, 16, 20, 24],
            },
            "y_unit": "mm / °C",
            "y_min": 0,
            "y_max": 140,
            "y_step": 20
        },
        "modelEssay": (
            "The climate chart illustrates monthly mean temperatures in degrees Celsius and total precipitation in millimetres for Sydney, Australia, sampled every two months across a calendar year.\n\n"
            "Overall, Sydney experiences warm summers and mild winters, with rainfall distributed throughout the year but peaking noticeably during the late summer and autumn months.\n\n"
            "Temperatures follow a classic Southern Hemisphere seasonal cycle. Peak warmth occurs in January with an average high of 26°C, dipping slightly to 25°C in March. As autumn transitions into winter, temperatures decline to 20°C in May, bottoming out in July at 16°C. Thereafter, spring brings a steady warming trend to 20°C in September and 24°C in November.\n\n"
            "Precipitation patterns show substantial seasonal variance. Rainfall is heaviest during late summer and autumn, peaking at 130 mm in March after recording 105 mm in January and 100 mm in May. The mid-year months are markedly drier, with July logging the lowest rainfall at 60 mm, before precipitation recovers to 70 mm in September and 85 mm in November."
        )
    },
    # -------------------------------------------------------------
    # Q47: Mixed Chart - EV Sales & Charging Infrastructure
    # -------------------------------------------------------------
    {
        "id": "t1-acad-047",
        "category": "Mixed Chart",
        "title": "Electric Vehicle Sales Volume and Charging Stations",
        "prompt": "The chart illustrates annual electric vehicle (EV) sales in hundreds of thousands and public fast-charging points in tens of thousands between 2016 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "EV Sales vs Public Chargers (2016–2024)",
            "categories": ["2016", "2018", "2020", "2022", "2024"],
            "series_dict": {
                "EV Sales (100k)": [8, 20, 32, 75, 140],
                "Chargers (10k)": [4, 10, 18, 36, 68],
            },
            "y_unit": "Sales (100k) / Stations (10k)",
            "y_min": 0,
            "y_max": 150,
            "y_step": 30
        },
        "modelEssay": (
            "The chart tracks annual electric passenger vehicle registrations (in units of 100,000) and public fast-charging station installations (in units of 10,000) from 2016 to 2024.\n\n"
            "Overall, both electric automobile sales and public charging infrastructure expanded dramatically, with growth accelerating into an exponential surge after 2020.\n\n"
            "In 2016, consumer adoption of electric vehicles was nascent, with 800,000 vehicles sold globally and 40,000 public fast-charging points deployed. By 2018, sales grew to 2.0 million units, accompanied by 100,000 charging stations. Growth continued steadily through 2020, reaching 3.2 million vehicle deliveries and 180,000 public chargers.\n\n"
            "Following 2020, adoption expanded rapidly. Annual EV registrations more than doubled to 7.5 million in 2022 and surged to 14.0 million units by 2024, representing an over seventeen-fold increase relative to 2016. Concurrently, public charging infrastructure grew to 360,000 units in 2022 and reached 680,000 charging stations by 2024."
        )
    },
    # -------------------------------------------------------------
    # Q48: Mixed Chart - University Graduates & Employment
    # -------------------------------------------------------------
    {
        "id": "t1-acad-048",
        "category": "Mixed Chart",
        "title": "University Graduation Totals and Immediate Employment Rate",
        "prompt": "The chart illustrates annual university graduate numbers in thousands alongside the percentage securing graduate-level employment within six months from 2010 to 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Graduates (k) vs Employment Rate (%)",
            "categories": ["2010", "2013", "2016", "2019", "2022"],
            "series_dict": {
                "Graduates (k)": [350, 385, 420, 460, 495],
                "Employed (%)": [68, 71, 75, 78, 82],
            },
            "y_unit": "Graduates (k) / Rate (%)",
            "y_min": 50,
            "y_max": 500,
            "y_step": 50
        },
        "modelEssay": (
            "The chart examines university completion figures in thousands and the proportion of degree holders securing professional employment within six months across a nation between 2010 and 2022.\n\n"
            "Overall, both the aggregate number of university degree holders and their immediate employment rate exhibited consistent, parallel upward trajectories across the twelve-year span.\n\n"
            "The total number of university graduates expanded steadily. In 2010, higher education institutions conferred 350,000 degrees. This total increased to 385,000 in 2013, 420,000 in 2016, and 460,000 in 2019, culminating at 495,000 graduates by 2022, reflecting an overall expansion of roughly 41%.\n\n"
            "Concurrently, the graduate employment rate demonstrated strong resilience, improving by 14 percentage points over the timeframe. In 2010, roughly two-thirds (68%) of graduates secured professional employment within six months. This figure rose incrementally to 71% in 2013, 75% in 2016, and 78% in 2019, peaking at 82% in 2022 despite the growing pool of job candidates."
        )
    },
    # -------------------------------------------------------------
    # Q49: Mixed Chart - Water Extraction & Industrial Share
    # -------------------------------------------------------------
    {
        "id": "t1-acad-049",
        "category": "Mixed Chart",
        "title": "National Water Extraction Volume and Industrial Proportion",
        "prompt": "The chart illustrates total annual freshwater extraction (in cubic kilometers) and the industrial percentage share across four economic regions. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Freshwater Extraction vs Industrial Share",
            "categories": ["Region A", "Region B", "Region C", "Region D"],
            "series_dict": {
                "Total Water (km3)": [120, 85, 210, 45],
                "Industry Share (%)": [45, 18, 55, 12],
            },
            "y_unit": "km3 / Percentage",
            "y_min": 0,
            "y_max": 220,
            "y_step": 30
        },
        "modelEssay": (
            "The chart compares total annual freshwater withdrawals in cubic kilometers (km3) and the proportion allocated to industrial processing across four geographic zones designated Regions A, B, C, and D.\n\n"
            "Overall, Region C was by far the largest consumer of freshwater and allocated the highest fraction to industrial production, whereas Region D utilized the least water and dedicated minimal reserves to industry.\n\n"
            "Region C extracted 210 km3 of freshwater annually, vastly exceeding all other territories. Furthermore, 55% of this volume was directed into industrial facilities, reflecting a heavy manufacturing base. Region A recorded the second highest extraction volume at 120 km3, with industrial processing consuming 45%.\n\n"
            "In contrast, Region B extracted 85 km3 of water, but only 18% was consumed by industrial facilities, indicating that agriculture accounted for the vast remainder. Region D reported the lowest overall extraction at just 45 km3, with industry accounting for merely 12% of total water use."
        )
    },
    # -------------------------------------------------------------
    # Q50: Mixed Chart - Port Container Traffic & Dwell Time
    # -------------------------------------------------------------
    {
        "id": "t1-acad-050",
        "category": "Mixed Chart",
        "title": "Maritime Port Container Traffic and Average Vessel Turnaround",
        "prompt": "The chart compares container throughput (in millions of TEU) and average vessel turnaround time (in hours) across four major maritime ports in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Port Volume vs Turnaround Hours (2024)",
            "categories": ["Shanghai", "Singapore", "Rotterdam", "Los Angeles"],
            "series_dict": {
                "Throughput (M TEU)": [49, 39, 14, 10],
                "Turnaround (Hours)": [18, 16, 24, 38],
            },
            "y_unit": "TEU / Hours",
            "y_min": 0,
            "y_max": 60,
            "y_step": 10
        },
        "modelEssay": (
            "The chart evaluates operational performance across four major container hubs in 2024, detailing annual container throughput in millions of TEU and average vessel turnaround time in hours.\n\n"
            "Overall, Asian transshipment hubs processed vastly greater cargo volumes while maintaining superior vessel processing speeds compared to Western deep-water ports.\n\n"
            "The Port of Shanghai handled the largest volume of global commerce at 49 million TEU, while achieving an efficient average turnaround time of 18 hours per container ship. The Port of Singapore ranked second with 39 million TEU processed, logging the fastest turnaround speed of all surveyed ports at just 16 hours.\n\n"
            "In contrast, European and North American ports recorded lower throughput and extended vessel delays. Rotterdam handled 14 million TEU with an average turnaround duration of 24 hours. The Port of Los Angeles accommodated the smallest container volume at 10 million TEU, yet recorded the longest vessel dwell time at 38 hours, more than double the turnaround time in Singapore."
        )
    },
]
