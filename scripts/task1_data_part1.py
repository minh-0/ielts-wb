"""
IELTS Academic Task 1 Data - Part 1 (Questions 1-25)
Themes:
1. Line Graphs (Q1-Q10)
2. Bar Charts (Q11-Q20)
3. Pie Charts (Q21-Q25)
"""

QUESTIONS_PART1 = [
    # -------------------------------------------------------------
    # Q1: Line Graph - Renewable vs Fossil Fuels
    # -------------------------------------------------------------
    {
        "id": "t1-acad-001",
        "category": "Line Graph",
        "title": "Energy Consumption by Fuel Source (1980–2030)",
        "prompt": "The line graph below illustrates energy consumption by fuel source in a European nation from 1980 to 2030, with projections from 2025 onwards. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Energy Consumption by Fuel Source (Quadrillion BTUs)",
            "x_labels": ["1980", "1990", "2000", "2010", "2020", "2030"],
            "series_dict": {
                "Fossil Fuels": [85, 88, 92, 86, 74, 58],
                "Nuclear Energy": [15, 24, 28, 27, 25, 22],
                "Renewables": [6, 8, 12, 19, 36, 62],
            },
            "y_unit": "Quadrillion BTUs",
            "y_min": 0,
            "y_max": 100,
            "y_step": 20
        },
        "modelEssay": (
            "The line graph illustrates energy consumption trends across fossil fuels, nuclear power, and renewable energy in an unspecified European nation between 1980 and 2020, alongside projected figures extending to 2030.\n\n"
            "Overall, fossil fuels historically dominated energy consumption but demonstrate a steep downward trajectory that is forecast to continue. In sharp contrast, renewable energy sources display dramatic upward momentum, poised to surpass fossil fuels by 2030, while nuclear power maintains a relatively stable, modest profile.\n\n"
            "In 1980, fossil fuels accounted for 85 quadrillion BTUs, ascending gradually to a peak of 92 quadrillion BTUs in 2000. Thereafter, consumption contracted steadily to 74 quadrillion BTUs by 2020 and is projected to decline precipitously to 58 quadrillion BTUs in 2030. Conversely, renewable energy began at a negligible 6 quadrillion BTUs in 1980, expanding incrementally over the first two decades to reach 12 quadrillion BTUs in 2000.\n\n"
            "From 2000 onwards, renewable consumption accelerated exponentially, surging to 36 quadrillion BTUs in 2020. Projections indicate renewables will reach 62 quadrillion BTUs by 2030, becoming the primary energy source. Nuclear power rose from 15 quadrillion BTUs in 1980 to 28 quadrillion BTUs in 2000 before plateauing and gently retreating towards an anticipated 22 quadrillion BTUs."
        )
    },
    # -------------------------------------------------------------
    # Q2: Line Graph - Car Ownership Rates
    # -------------------------------------------------------------
    {
        "id": "t1-acad-002",
        "category": "Line Graph",
        "title": "Household Car Ownership Across Three Nations (1970–2020)",
        "prompt": "The graph below shows the percentage of households owning at least one motor vehicle in Britain, France, and Germany between 1970 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Household Vehicle Ownership (%)",
            "x_labels": ["1970", "1980", "1990", "2000", "2010", "2020"],
            "series_dict": {
                "Germany": [42, 54, 65, 72, 78, 82],
                "France": [38, 48, 59, 68, 74, 79],
                "Britain": [32, 41, 52, 61, 70, 76],
            },
            "y_unit": "Percentage (%)",
            "y_min": 20,
            "y_max": 100,
            "y_step": 20
        },
        "modelEssay": (
            "The line graph compares the proportion of households possessing at least one automobile across Germany, France, and Britain over a fifty-year interval from 1970 to 2020.\n\n"
            "Overall, vehicle ownership increased substantially in all three European countries over the half-century period. Germany consistently maintained the highest ownership rate throughout the timeline, whereas Britain continually recorded the lowest figures, despite experiencing notable growth.\n\n"
            "In 1970, German households led with 42% car ownership, compared to 38% in France and 32% in Britain. Over the subsequent two decades, all nations underwent consistent expansion; by 1990, ownership had climbed to 65% in Germany, 59% in France, and 52% in Britain, preserving the initial hierarchical order.\n\n"
            "During the latter half of the timeframe, the trajectory persisted at a slightly tempered pace. By 2010, the proportions stood at 78%, 74%, and 70% for Germany, France, and Britain respectively. By the conclusion of the survey in 2020, German household car ownership had peaked at 82%, while France and Britain reached 79% and 76%, effectively narrowing the initial disparity between the leaders."
        )
    },
    # -------------------------------------------------------------
    # Q3: Line Graph - Unemployment Rates
    # -------------------------------------------------------------
    {
        "id": "t1-acad-003",
        "category": "Line Graph",
        "title": "National Unemployment Rates in the UK, USA, and Japan (1990–2020)",
        "prompt": "The line graph below compares unemployment rates in the United Kingdom, the United States, and Japan between 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Unemployment Rates (% of Labour Force)",
            "x_labels": ["1990", "1995", "2000", "2005", "2010", "2015", "2020"],
            "series_dict": {
                "United States": [5.6, 5.6, 4.0, 5.1, 9.6, 5.3, 8.1],
                "United Kingdom": [7.0, 8.7, 5.5, 4.8, 7.9, 5.4, 4.5],
                "Japan": [2.1, 3.2, 4.7, 4.4, 5.1, 3.4, 2.8],
            },
            "y_unit": "Percentage (%)",
            "y_min": 0,
            "y_max": 12,
            "y_step": 3
        },
        "modelEssay": (
            "The line graph delineates fluctuations in the unemployment rate as a percentage of the total workforce in the United States, the United Kingdom, and Japan from 1990 to 2020.\n\n"
            "Overall, Japan consistently registered the lowest jobless rates across the majority of the timeframe, whereas both Western economies exhibited pronounced cyclical volatility, marked by noticeable spikes around 2010 and 2020.\n\n"
            "In 1990, the United Kingdom had the highest unemployment rate at 7.0%, escalating to a period peak of 8.7% in 1995 before dropping sharply to 5.5% in 2000. In contrast, the US rate held steady at 5.6% during the early 1990s before dropping to 4.0% in 2000. Japan began with an exceptionally low 2.1% in 1990, rising gradually to 4.7% by the turn of the millennium.\n\n"
            "Between 2005 and 2010, the US experienced a dramatic surge, with unemployment peaking at 9.6% following the global recession, while the UK climbed to 7.9% and Japan peaked at 5.1%. By 2015, all three nations recovered significantly. However, by 2020, while the UK improved to 4.5% and Japan settled at 2.8%, US unemployment rebounded sharply to 8.1%."
        )
    },
    # -------------------------------------------------------------
    # Q4: Line Graph - Global Internet Usage
    # -------------------------------------------------------------
    {
        "id": "t1-acad-004",
        "category": "Line Graph",
        "title": "Internet Penetration per 100 Inhabitants (2000–2025)",
        "prompt": "The line graph provides data on the number of internet users per 100 inhabitants across four global regions between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Internet Users per 100 Inhabitants",
            "x_labels": ["2000", "2005", "2010", "2015", "2020", "2025"],
            "series_dict": {
                "North America": [44, 68, 77, 85, 91, 95],
                "Europe": [28, 51, 68, 78, 86, 91],
                "Asia-Pacific": [8, 16, 29, 44, 62, 74],
                "Sub-Saharan Africa": [1, 3, 8, 18, 30, 43],
            },
            "y_unit": "Users per 100 People",
            "y_min": 0,
            "y_max": 100,
            "y_step": 20
        },
        "modelEssay": (
            "The line graph traces the expansion of internet accessibility, measured as users per 100 inhabitants, across North America, Europe, Asia-Pacific, and Sub-Saharan Africa from 2000 to 2025.\n\n"
            "Overall, internet penetration expanded substantially across all four territories over the twenty-five-year period. North America and Europe consistently maintained the highest connectivity levels, whereas Asia-Pacific and Sub-Saharan Africa exhibited rapid catch-up growth from minimal initial baselines.\n\n"
            "In 2000, North America led with 44 users per 100 people, followed by Europe at 28. In stark contrast, figures for Asia-Pacific and Sub-Saharan Africa were negligible at 8 and 1 user per 100 respectively. By 2010, penetration in North America had accelerated to 77 and in Europe to 68, while Asia-Pacific more than tripled to 29 and Sub-Saharan Africa reached 8.\n\n"
            "In the subsequent decade and a half, growth in the developed regions began to plateau near saturation, with North America reaching 95 users per 100 and Europe attaining 91 by 2025. Concurrently, developing regions expanded remarkably: Asia-Pacific rose steeply to 74 users per 100, while Sub-Saharan Africa attained 43, closing the international digital divide."
        )
    },
    # -------------------------------------------------------------
    # Q5: Line Graph - London Commute Times
    # -------------------------------------------------------------
    {
        "id": "t1-acad-005",
        "category": "Line Graph",
        "title": "Average Commute Times by Mode of Transport (2000–2020)",
        "prompt": "The line graph below illustrates changes in average daily commute durations (in minutes) for three transportation modes in a metropolitan city between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Average Daily Commute Time (Minutes)",
            "x_labels": ["2000", "2005", "2010", "2015", "2020"],
            "series_dict": {
                "Private Car": [42, 46, 53, 58, 62],
                "Underground Rail": [36, 35, 34, 35, 36],
                "Cycling": [48, 44, 39, 35, 32],
            },
            "y_unit": "Minutes per Journey",
            "y_min": 20,
            "y_max": 70,
            "y_step": 10
        },
        "modelEssay": (
            "The line graph delineates the average journey time in minutes for commuters utilizing private cars, underground rail, and bicycles in an urban centre between 2000 and 2020.\n\n"
            "Overall, traveling by private car experienced a steady and substantial increase in duration, becoming by far the slowest option by the end of the period. Conversely, cycling commute times dropped consistently, making it the fastest transport mode by 2020, while underground rail travel times remained virtually unchanged.\n\n"
            "In 2000, cycling required the greatest time commitment at an average of 48 minutes, followed closely by private cars at 42 minutes and the underground system at 36 minutes. By 2010, the situation shifted considerably; car journeys lengthened to 53 minutes due to traffic congestion, whereas cycling durations contracted to 39 minutes, closely matching the subway's steady 34 minutes.\n\n"
            "Between 2010 and 2020, commute times for motor vehicles climbed further, peaking at 62 minutes. In stark contrast, bicycle travel times continued their downward trajectory, declining to 32 minutes by 2020. Underground journeys hovered constantly around 35 to 36 minutes throughout the entire two-decade timeline."
        )
    },
    # -------------------------------------------------------------
    # Q6: Line Graph - Carbon Emissions per Capita
    # -------------------------------------------------------------
    {
        "id": "t1-acad-006",
        "category": "Line Graph",
        "title": "CO2 Emissions per Capita Across Four Nations (1975–2020)",
        "prompt": "The graph below shows carbon dioxide (CO2) emissions per person in metric tonnes across four countries between 1975 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "CO2 Emissions per Person (Metric Tonnes)",
            "x_labels": ["1975", "1985", "1995", "2005", "2015", "2020"],
            "series_dict": {
                "United States": [20.5, 19.8, 19.2, 19.5, 16.2, 14.5],
                "United Kingdom": [11.2, 10.4, 9.6, 8.8, 6.5, 5.2],
                "China": [1.4, 2.1, 3.2, 5.4, 7.2, 7.8],
                "India": [0.4, 0.6, 0.9, 1.2, 1.8, 1.9],
            },
            "y_unit": "Metric Tonnes per Person",
            "y_min": 0,
            "y_max": 24,
            "y_step": 4
        },
        "modelEssay": (
            "The line graph presents the average per capita carbon dioxide emissions, quantified in metric tonnes, for the United States, the United Kingdom, China, and India from 1975 to 2020.\n\n"
            "Overall, emissions per capita in the United States and the United Kingdom followed a persistent downward trajectory. Conversely, per capita output in China and India rose steadily, with China surpassing the United Kingdom after 2010.\n\n"
            "Throughout the entire duration, the United States registered the highest emissions per capita. Starting at 20.5 metric tonnes in 1975, US emissions remained relatively flat around 19 to 20 tonnes through 2005 before diminishing to 14.5 tonnes by 2020. The United Kingdom also experienced steady reductions, declining from 11.2 tonnes in 1975 to 9.6 in 1995 and halving to 5.2 tonnes by 2020.\n\n"
            "In stark contrast, emissions in developing Asian nations escalated. China began at a modest 1.4 tonnes per capita in 1975, rising moderately until 1995, after which rapid industrialization drove emissions to 5.4 in 2005 and 7.8 tonnes by 2020. India registered continuous growth from 0.4 tonnes in 1975 to 1.9 tonnes in 2020, remaining the lowest overall emitter."
        )
    },
    # -------------------------------------------------------------
    # Q7: Line Graph - Book Sales by Format
    # -------------------------------------------------------------
    {
        "id": "t1-acad-007",
        "category": "Line Graph",
        "title": "Annual Book Sales Volume by Format (2006–2024)",
        "prompt": "The line graph below shows book sales volumes (in millions of units) across three formats—print, e-book, and audiobook—between 2006 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Book Sales Volume (Millions of Copies)",
            "x_labels": ["2006", "2009", "2012", "2015", "2018", "2021", "2024"],
            "series_dict": {
                "Print Books": [240, 225, 185, 160, 155, 170, 165],
                "E-books": [15, 45, 120, 140, 130, 125, 115],
                "Audiobooks": [5, 8, 14, 28, 55, 85, 110],
            },
            "y_unit": "Millions of Units",
            "y_min": 0,
            "y_max": 260,
            "y_step": 50
        },
        "modelEssay": (
            "The line graph depicts sales figures for print books, e-books, and audiobooks in millions of copies sold between 2006 and 2024.\n\n"
            "Overall, print books remained the dominant medium throughout the eighteen-year period despite a noticeable decline in the first decade. Concurrently, audiobooks exhibited the fastest relative growth, whereas e-book sales peaked in the mid-2010s before tapering off.\n\n"
            "In 2006, print book sales stood at 240 million units, heavily overshadowing e-books (15 million) and audiobooks (5 million). Over the subsequent decade, print sales contracted sharply to reach a low of 155 million in 2018, before staging a minor recovery to stabilize around 165 million by 2024.\n\n"
            "E-books witnessed explosive growth between 2006 and 2015, climbing from 15 million to a zenith of 140 million copies. However, popularity slightly waned thereafter, descending to 115 million by 2024. In contrast, audiobook adoption surged relentlessly, especially after 2015 when sales rose from 28 million to 110 million in 2024, nearly matching e-book figures by the end of the survey."
        )
    },
    # -------------------------------------------------------------
    # Q8: Line Graph - University Enrollment by Discipline
    # -------------------------------------------------------------
    {
        "id": "t1-acad-008",
        "category": "Line Graph",
        "title": "Undergraduate University Enrollment by Faculty (1995–2025)",
        "prompt": "The line graph below shows undergraduate university enrollment figures across Science & Engineering, Arts & Humanities, and Business Studies from 1995 to 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Undergraduate Enrollment (Thousands)",
            "x_labels": ["1995", "2000", "2005", "2010", "2015", "2020", "2025"],
            "series_dict": {
                "Science & Eng.": [45, 52, 64, 82, 105, 130, 155],
                "Business Studies": [35, 48, 62, 78, 92, 108, 120],
                "Arts & Humanities": [55, 58, 54, 48, 42, 38, 34],
            },
            "y_unit": "Thousands of Students",
            "y_min": 20,
            "y_max": 160,
            "y_step": 20
        },
        "modelEssay": (
            "The line graph illustrates undergraduate student enrollments in thousands across three academic faculties—Science & Engineering, Business Studies, and Arts & Humanities—between 1995 and 2025.\n\n"
            "Overall, Science & Engineering and Business Studies experienced continuous and significant expansion, becoming the most populous disciplines. In stark contrast, Arts & Humanities exhibited a persistent long-term contraction after an initial minor peak.\n\n"
            "In 1995, Arts & Humanities boasted the highest enrollment with 55,000 undergraduates, compared to 45,000 in Science & Engineering and 35,000 in Business. Although Arts rose slightly to 58,000 in 2000, it subsequently embarked on a steady decline, dropping to 48,000 in 2010 and falling to 34,000 by 2025.\n\n"
            "Conversely, Science & Engineering surged rapidly, overtaking Arts in 2002 and reaching 82,000 by 2010 before climbing to 155,000 in 2025, more than tripling its original figure. Business Studies displayed a parallel upward trajectory, expanding from 35,000 in 1995 to 78,000 in 2010 and culminating at 120,000 students by 2025."
        )
    },
    # -------------------------------------------------------------
    # Q9: Line Graph - Fast Food Consumption
    # -------------------------------------------------------------
    {
        "id": "t1-acad-009",
        "category": "Line Graph",
        "title": "Fast Food Consumption Frequency Among Youths (1985–2025)",
        "prompt": "The line graph below shows the average number of times young people consumed three varieties of fast food per year in an Australian city between 1985 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Annual Consumption Frequency per Person",
            "x_labels": ["1985", "1995", "2005", "2015", "2025"],
            "series_dict": {
                "Hamburgers": [25, 42, 65, 82, 94],
                "Pizza": [12, 28, 52, 74, 88],
                "Fish & Chips": [95, 78, 54, 38, 26],
            },
            "y_unit": "Times Eaten per Year",
            "y_min": 0,
            "y_max": 100,
            "y_step": 20
        },
        "modelEssay": (
            "The line graph traces the annual frequency of fast food consumption among adolescents and young adults across hamburgers, pizza, and fish & chips in an Australian urban centre between 1985 and 2025.\n\n"
            "Overall, dietary patterns reversed dramatically over the forty-year period. While traditional fish & chips experienced a steep and continuous downturn, contemporary options including hamburgers and pizza saw explosive increases, emerging as the dominant dietary choices.\n\n"
            "In 1985, fish & chips was overwhelmingly the most popular convenience food, consumed on average 95 times per year, compared to just 25 times for hamburgers and 12 times for pizza. Over the subsequent two decades, fish & chips consumption halved, plummeting to 54 times in 2005 and falling further to 26 times by 2025.\n\n"
            "In direct contrast, hamburger consumption accelerated steadily, rising to 42 times per year in 1995, eclipsing fish & chips around 2002, and reaching 94 times in 2025. Pizza mirrored this growth, escalating from 12 times in 1985 to 52 in 2005 and finishing at 88 annual servings by 2025."
        )
    },
    # -------------------------------------------------------------
    # Q10: Line Graph - Gold vs Crude Oil Prices
    # -------------------------------------------------------------
    {
        "id": "t1-acad-010",
        "category": "Line Graph",
        "title": "Gold vs Crude Oil Global Price Indices (2000–2024)",
        "prompt": "The line graph illustrates the commodity price index trends for gold and crude oil between 2000 and 2024, benchmarked at 100 in the year 2000. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "line",
        "chart_params": {
            "title": "Commodity Price Index (Base Year 2000 = 100)",
            "x_labels": ["2000", "2004", "2008", "2012", "2016", "2020", "2024"],
            "series_dict": {
                "Gold Price Index": [100, 145, 290, 480, 410, 520, 680],
                "Crude Oil Index": [100, 135, 340, 310, 160, 195, 275],
            },
            "y_unit": "Index Points",
            "y_min": 50,
            "y_max": 750,
            "y_step": 100
        },
        "modelEssay": (
            "The line graph compares price index trajectories for gold and crude oil on global markets from 2000 to 2024, using the year 2000 as the baseline index of 100.\n\n"
            "Overall, both commodities appreciated substantially over the twenty-four-year timeline. However, gold exhibited a much stronger, more resilient upward momentum, whereas crude oil prices were characterized by severe cyclical turbulence.\n\n"
            "Starting at identical index baselines of 100 in 2000, both commodities climbed steadily over the early years. By 2008, crude oil outpaced gold, peaking at 340 index points before dropping sharply during the global financial crisis. Gold, meanwhile, nearly tripled to 290 in 2008 and surged uninterruptedly to 480 by 2012, vastly eclipsing oil.\n\n"
            "Between 2012 and 2016, crude oil suffered a severe collapse from 310 to 160 points due to global oversupply, before partially recovering to 275 by 2024. Conversely, after a brief dip to 410 points in 2016, gold resumed an aggressive rally, scaling to 520 in 2020 and reaching an all-time high of 680 points by 2024."
        )
    },
    # -------------------------------------------------------------
    # Q11: Bar Chart - Household Expenditure
    # -------------------------------------------------------------
    {
        "id": "t1-acad-011",
        "category": "Bar Chart",
        "title": "Household Expenditure Proportions in Four Countries",
        "prompt": "The bar chart below compares the proportion of household expenditure on housing, food, transport, and healthcare across four nations in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Household Expenditure Proportions by Category (%)",
            "categories": ["USA", "Germany", "Japan", "Brazil"],
            "series_dict": {
                "Housing": [33, 29, 26, 21],
                "Food & Bev": [14, 15, 24, 32],
                "Transport": [18, 16, 12, 14],
                "Healthcare": [17, 8, 9, 6],
            },
            "y_unit": "Percentage (%)",
            "y_min": 0,
            "y_max": 40,
            "y_step": 10
        },
        "modelEssay": (
            "The bar chart compares the percentage breakdown of household spending allocated to housing, food and beverages, transport, and healthcare in the United States, Germany, Japan, and Brazil during 2024.\n\n"
            "Overall, housing and food constituted the largest financial commitments across all four countries. Developed nations prioritized housing over sustenance, whereas developing households in Brazil dedicated the largest fraction of income to food. Healthcare costs were notably highest in the United States.\n\n"
            "In the United States, housing represented the single largest expense at 33%, followed by transport at 18% and healthcare at 17%, with food accounting for only 14%. Germany presented a similar structural pattern, spending 29% on housing, 16% on transport, 15% on food, and a modest 8% on healthcare.\n\n"
            "Conversely, in Brazil, food comprised the dominant expenditure at 32%, contrasted with 21% for housing and merely 6% for medical care. Japan exhibited a balanced intermediate allocation, devoting equal emphasis to housing (26%) and food (24%), while allocating 12% to transport and 9% to healthcare services."
        )
    },
    # -------------------------------------------------------------
    # Q12: Bar Chart - Employment Share by Sector
    # -------------------------------------------------------------
    {
        "id": "t1-acad-012",
        "category": "Bar Chart",
        "title": "Workforce Distribution by Economic Sector in 2024",
        "prompt": "The bar chart below compares the distribution of the workforce across agriculture, manufacturing, and services in five nations in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Employment Share by Economic Sector (%)",
            "categories": ["UK", "South Korea", "Poland", "India", "Kenya"],
            "series_dict": {
                "Services": [82, 71, 58, 34, 31],
                "Manufacturing": [16, 24, 31, 23, 14],
                "Agriculture": [2, 5, 11, 43, 55],
            },
            "y_unit": "Share of Workforce (%)",
            "y_min": 0,
            "y_max": 90,
            "y_step": 15
        },
        "modelEssay": (
            "The bar chart examines the proportion of workers employed in the services, manufacturing, and agricultural sectors across five countries—the United Kingdom, South Korea, Poland, India, and Kenya—in 2024.\n\n"
            "Overall, advanced industrial economies relied heavily on service sector employment with negligible agricultural involvement, whereas developing economies exhibited substantial dependence on farming for employment generation.\n\n"
            "In the United Kingdom, services overwhelmingly dominated the employment landscape, absorbing 82% of the workforce, while manufacturing provided 16% and agriculture engaged merely 2%. South Korea demonstrated a comparable profile with 71% in services and 24% in manufacturing, leaving just 5% in agriculture.\n\n"
            "Poland featured a stronger industrial weighting, employing 31% in manufacturing, 58% in services, and 11% in agriculture. In stark contrast, primary agriculture remained the foremost employer in developing nations, absorbing 55% of Kenya's labour force and 43% of India's. Services accounted for approximately one-third of jobs in both nations (31% in Kenya and 34% in India), with manufacturing engaging 14% and 23% respectively."
        )
    },
    # -------------------------------------------------------------
    # Q13: Bar Chart - Municipal Recycling Rates
    # -------------------------------------------------------------
    {
        "id": "t1-acad-013",
        "category": "Bar Chart",
        "title": "Household Waste Recycling Rates in Six Cities",
        "prompt": "The bar chart illustrates the percentage of municipal waste recycled across six European cities in 2014 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Municipal Recycling Rates (2014 vs 2024)",
            "categories": ["Vienna", "Berlin", "Oslo", "Dublin", "Madrid", "Athens"],
            "series_dict": {
                "2014": [52, 58, 44, 36, 28, 16],
                "2024": [68, 72, 62, 51, 42, 29],
            },
            "y_unit": "Recycling Rate (%)",
            "y_min": 0,
            "y_max": 80,
            "y_step": 20
        },
        "modelEssay": (
            "The bar chart compares municipal recycling rates as a percentage of total collected household waste across six European capitals in 2014 and 2024.\n\n"
            "Overall, recycling performance enhanced across all six municipalities over the ten-year period. Central and Northern European capitals consistently outperformed Southern European cities, with Berlin maintaining the highest overall recycling proportion.\n\n"
            "In 2014, Berlin registered the highest recycling rate at 58%, followed closely by Vienna at 52% and Oslo at 44%. By 2024, these three leading cities achieved substantial advancements: Berlin expanded to 72%, Vienna progressed to 68%, and Oslo surged by 18 percentage points to attain 62%.\n\n"
            "Dublin also showed commendable growth, improving from 36% in 2014 to exceed the half-way threshold at 51% in 2024. Although Madrid and Athens recorded the lowest figures throughout, both registered solid percentage gains: Madrid climbed from 28% to 42%, while Athens nearly doubled its recycling output from 16% in 2014 to 29% by 2024."
        )
    },
    # -------------------------------------------------------------
    # Q14: Bar Chart - Leisure Hours by Gender
    # -------------------------------------------------------------
    {
        "id": "t1-acad-014",
        "category": "Bar Chart",
        "title": "Weekly Leisure Time Spent by Gender Across Age Groups",
        "prompt": "The bar chart below compares the average hours of leisure time enjoyed weekly by males and females across five age brackets in a developed nation. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Weekly Leisure Hours by Gender and Age",
            "categories": ["15-24", "25-34", "35-44", "45-54", "65+"],
            "series_dict": {
                "Males": [55, 38, 34, 40, 72],
                "Females": [52, 32, 28, 34, 66],
            },
            "y_unit": "Hours per Week",
            "y_min": 0,
            "y_max": 80,
            "y_step": 20
        },
        "modelEssay": (
            "The bar chart displays the average number of weekly leisure hours reported by men and women across five discrete age categories in an industrialized country.\n\n"
            "Overall, males consistently enjoyed more hours of recreational time than females in every surveyed demographic. Furthermore, both genders exhibited a U-shaped distribution, with the youngest and oldest cohorts possessing the greatest volume of free time, while middle-aged groups had the least.\n\n"
            "Among youth aged 15 to 24, weekly leisure was abundant, averaging 55 hours for young men and 52 hours for young women. However, during peak career and family formation years (25 to 44), leisure time plummeted significantly. Men aged 25–34 averaged 38 hours, dipping to 34 hours for those aged 35–44. Females experienced an even greater reduction, recording 32 hours and a period low of 28 hours respectively.\n\n"
            "Leisure availability began recovering among the 45–54 age group (40 hours for men and 34 for women), before escalating dramatically among seniors aged 65 and above. Retirees recorded the greatest leisure allowance, with senior men averaging 72 hours and women logging 66 hours per week."
        )
    },
    # -------------------------------------------------------------
    # Q15: Bar Chart - International Tourist Arrivals
    # -------------------------------------------------------------
    {
        "id": "t1-acad-015",
        "category": "Bar Chart",
        "title": "International Tourist Arrivals in Top Destinations (2019 vs 2023)",
        "prompt": "The bar chart compares international tourist arrival numbers (in millions) for five major destination countries in 2019 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "International Visitors (Millions)",
            "categories": ["France", "Spain", "USA", "Italy", "Turkey"],
            "series_dict": {
                "2019": [90, 84, 79, 65, 51],
                "2023": [100, 85, 67, 57, 55],
            },
            "y_unit": "Millions of Visitors",
            "y_min": 0,
            "y_max": 120,
            "y_step": 20
        },
        "modelEssay": (
            "The bar chart compares annual international tourist arrivals in millions across France, Spain, the United States, Italy, and Turkey for 2019 and 2023.\n\n"
            "Overall, France remained the most heavily visited global destination in both years and was one of only two countries, alongside Turkey, to register growth beyond pre-pandemic 2019 levels. In contrast, the United States and Italy experienced noticeable declines.\n\n"
            "In 2019, France led all nations with 90 million international visitors, followed closely by Spain at 84 million and the United States at 79 million. By 2023, France widened its lead significantly by welcoming a record 100 million tourists, representing an increase of 10 million. Spain's visitor volume remained virtually unchanged, inching up to 85 million.\n\n"
            "Conversely, the United States witnessed a substantial contraction from 79 million arrivals in 2019 to 67 million in 2023. Italy followed a similar downward trajectory, dropping from 65 million to 57 million. In contrast, Turkey expanded its international visitor intake from 51 million to 55 million, surpassing Italy's performance by the end of 2023."
        )
    },
    # -------------------------------------------------------------
    # Q16: Bar Chart - Water Consumption by Sector
    # -------------------------------------------------------------
    {
        "id": "t1-acad-016",
        "category": "Bar Chart",
        "title": "Water Consumption Across Sectors in Four Regions",
        "prompt": "The bar chart compares freshwater withdrawals across agriculture, industrial processing, and domestic households in four continental regions. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Water Withdrawal by Sector (%)",
            "categories": ["North America", "Europe", "East Asia", "Central Africa"],
            "series_dict": {
                "Agriculture": [39, 32, 68, 86],
                "Industry": [48, 54, 22, 5],
                "Domestic": [13, 14, 10, 9],
            },
            "y_unit": "Percentage of Total (%)",
            "y_min": 0,
            "y_max": 100,
            "y_step": 20
        },
        "modelEssay": (
            "The bar chart delineates the proportion of annual freshwater withdrawals consumed by agriculture, industry, and domestic households across four world regions.\n\n"
            "Overall, industrial activity constituted the primary consumer of water in Europe and North America, whereas agriculture overwhelmingly accounted for the majority of water consumption in East Asia and Central Africa. Domestic water use remained modest across all regions.\n\n"
            "In Europe, the industrial sector accounted for the largest share at 54%, followed by agriculture at 32% and domestic households at 14%. North America displayed a closely comparable consumption structure, where industrial use commanded 48%, agriculture consumed 39%, and residential requirements took up 13%.\n\n"
            "In sharp contrast, Central Africa dedicated an overwhelming 86% of its freshwater resources to agriculture, while industrial extraction took up merely 5% and domestic use absorbed 9%. East Asia also directed the bulk of its water reserves to farming (68%), with industrial applications claiming 22% and domestic consumption accounting for the remaining 10%."
        )
    },
    # -------------------------------------------------------------
    # Q17: Bar Chart - Graduate Employment Outcomes
    # -------------------------------------------------------------
    {
        "id": "t1-acad-017",
        "category": "Bar Chart",
        "title": "Graduate Full-Time Employment Rates by Academic Discipline",
        "prompt": "The bar chart below compares the proportion of university graduates securing full-time employment within six months of graduation across five degree subjects in 2020 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Graduate Full-Time Employment Rate (%)",
            "categories": ["Medicine", "Comp. Science", "Engineering", "Business", "Humanities"],
            "series_dict": {
                "2020": [94, 82, 80, 72, 56],
                "2024": [96, 88, 85, 78, 58],
            },
            "y_unit": "Employment Rate (%)",
            "y_min": 40,
            "y_max": 100,
            "y_step": 15
        },
        "modelEssay": (
            "The bar chart illustrates the percentage of university degree holders who gained full-time employment within six months of graduating across five fields of study in 2020 and 2024.\n\n"
            "Overall, employment outcomes improved across all five disciplines between 2020 and 2024. Vocational and STEM subjects—most notably Medicine and Computer Science—consistently produced higher employment rates than general humanities degrees.\n\n"
            "Medical graduates enjoyed by far the greatest job security in both years, with 94% securing employment in 2020, rising slightly to 96% in 2024. Computer Science and Engineering graduates also experienced robust demand; Computer Science employment rates expanded from 82% to 88%, while Engineering rose from 80% to 85%.\n\n"
            "Business studies majors achieved solid gains as well, with employability advancing from 72% in 2020 to 78% in 2024. In contrast, Humanities graduates consistently faced the most challenging job market, recording only 56% full-time placement in 2020 and creeping up marginally to 58% in 2024, lagging nearly 40 percentage points behind medical professionals."
        )
    },
    # -------------------------------------------------------------
    # Q18: Bar Chart - Commute Mode to School
    # -------------------------------------------------------------
    {
        "id": "t1-acad-018",
        "category": "Bar Chart",
        "title": "Primary Travel Method to School Among Secondary Students",
        "prompt": "The bar chart compares the modes of transport used by secondary school students to travel to school in an English county in 2000 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Travel Method to School (%)",
            "categories": ["Walking", "School Bus", "Private Car", "Bicycle", "Public Transit"],
            "series_dict": {
                "2000": [38, 25, 18, 12, 7],
                "2024": [22, 28, 34, 6, 10],
            },
            "y_unit": "Percentage of Pupils (%)",
            "y_min": 0,
            "y_max": 45,
            "y_step": 15
        },
        "modelEssay": (
            "The bar chart examines changes in the primary transportation methods utilized by secondary pupils commuting to school in an English county between 2000 and 2024.\n\n"
            "Overall, active commuting methods like walking and cycling experienced substantial reductions over the twenty-four-year span. In contrast, private vehicular drop-offs surged to become the dominant mode of travel, accompanied by modest increases in bus and transit usage.\n\n"
            "In 2000, walking was the single most popular option, accounting for 38% of all student commutes, followed by the dedicated school bus at 25% and private cars at 18%. Cycling was chosen by 12% of pupils, while public transit accounted for the remaining 7%.\n\n"
            "By 2024, commuting patterns transformed markedly. Private car transportation nearly doubled to 34%, overtaking walking to become the primary mode of transit. Meanwhile, the proportion of students walking dropped sharply to 22%, and bicycle commuting halved to merely 6%. Dedicated school bus utilization rose moderately to 28%, and public transit commuters increased slightly to 10%."
        )
    },
    # -------------------------------------------------------------
    # Q19: Bar Chart - Public Library Visits
    # -------------------------------------------------------------
    {
        "id": "t1-acad-019",
        "category": "Bar Chart",
        "title": "Monthly Public Library Visits by Age Cohort",
        "prompt": "The bar chart compares monthly public library visitor frequencies (in percentages) across five age groups in a Canadian city for 2012 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Monthly Library Visitor Rate by Age (%)",
            "categories": ["10-17", "18-29", "30-49", "50-64", "65+"],
            "series_dict": {
                "2012": [48, 35, 26, 32, 54],
                "2022": [28, 22, 31, 38, 59],
            },
            "y_unit": "Percentage Visiting Monthly (%)",
            "y_min": 0,
            "y_max": 70,
            "y_step": 15
        },
        "modelEssay": (
            "The bar chart compares the proportion of citizens in five age brackets who visited a public library at least once per month in a Canadian city between 2012 and 2022.\n\n"
            "Overall, library patronage declined sharply among youths and young adults, whereas older citizens aged 30 and above demonstrated steady or rising visitation rates, with senior citizens remaining the most frequent library users.\n\n"
            "In 2012, teenagers aged 10–17 recorded strong engagement, with 48% visiting monthly, while young adults aged 18–29 logged 35%. However, by 2022, monthly visits among 10–17 year-olds plummeted by 20 percentage points to 28%, and young adults fell to 22%, reflecting the migration toward digital resources.\n\n"
            "In contrast, older age groups increased their library presence. Patrons aged 30–49 increased their visitation rate modestly from 26% to 31%, while the 50–64 bracket expanded from 32% to 38%. Seniors aged 65 and over remained the most reliable cohort throughout, rising from 54% in 2012 to 59% in 2022."
        )
    },
    # -------------------------------------------------------------
    # Q20: Bar Chart - Mobile OS Market Share
    # -------------------------------------------------------------
    {
        "id": "t1-acad-020",
        "category": "Bar Chart",
        "title": "Smartphone Operating System Market Share by Region",
        "prompt": "The bar chart below compares the market share of mobile operating systems (Android, iOS, and Others) across four major geographical regions in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "bar",
        "chart_params": {
            "title": "Mobile OS Market Share (%)",
            "categories": ["North America", "Europe", "Asia", "South America"],
            "series_dict": {
                "Android": [42, 66, 78, 84],
                "iOS": [56, 32, 20, 15],
                "Others": [2, 2, 2, 1],
            },
            "y_unit": "Market Share (%)",
            "y_min": 0,
            "y_max": 90,
            "y_step": 20
        },
        "modelEssay": (
            "The bar chart illustrates the market share distribution of smartphone operating systems—namely Android, iOS, and alternative platforms—across North America, Europe, Asia, and South America in 2024.\n\n"
            "Overall, Android commanded a decisive majority in three of the four regions, achieving its greatest dominance in South America and Asia. In contrast, iOS led only in North America, while third-party operating systems occupied a negligible share worldwide.\n\n"
            "In North America, Apple's iOS established market leadership at 56%, whereas Android captured 42%. In Europe, this balance was inverted; Android claimed roughly two-thirds of all active devices (66%), while iOS captured less than one-third at 32%.\n\n"
            "In Asian and South American markets, Android's lead widened substantially. Android accounted for 78% of the mobile ecosystem in Asia and peaked at 84% in South America. Correspondingly, iOS held only 20% in Asia and 15% in South America. Alternative platforms accounted for an insignificant 1% to 2% of total share across all surveyed territories."
        )
    },
    # -------------------------------------------------------------
    # Q21: Pie Chart - Electricity Generation by Fuel Source
    # -------------------------------------------------------------
    {
        "id": "t1-acad-021",
        "category": "Pie Chart",
        "title": "Electricity Generation by Energy Source (1995 vs 2025)",
        "prompt": "The two pie charts compare the sources of electricity generation in a European nation in 1995 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Electricity Generation Sources",
            "set1_title": "1995",
            "set1_data": [("Coal", 45), ("Gas", 25), ("Nuclear", 18), ("Hydro", 8), ("Renewables", 4)],
            "set2_title": "2025",
            "set2_data": [("Coal", 12), ("Gas", 20), ("Nuclear", 16), ("Hydro", 10), ("Renewables", 42)],
        },
        "modelEssay": (
            "The two pie charts illustrate the distribution of electricity production by energy source in a European nation between 1995 and 2025.\n\n"
            "Overall, the power generation matrix shifted dramatically from fossil-fuel reliance toward clean energy. Coal experienced a massive decline, while modern renewable energy sources expanded rapidly to become the single largest contributor by 2025.\n\n"
            "In 1995, coal was by far the primary power source, accounting for 45% of total electricity generation, followed by natural gas at 25% and nuclear energy at 18%. Hydroelectric power provided 8%, while other renewable sources contributed a negligible 4% of total supply.\n\n"
            "By 2025, the picture changed substantially. Renewable energy expanded more than tenfold to command 42% of the nation's electricity, emerging as the dominant source. In contrast, coal collapsed to just 12%, while natural gas fell slightly to 20%. Nuclear energy remained relatively stable, dipping marginally to 16%, while hydroelectric output edged upward slightly to 10%."
        )
    },
    # -------------------------------------------------------------
    # Q22: Pie Chart - Household Expenditure (UK vs Japan)
    # -------------------------------------------------------------
    {
        "id": "t1-acad-022",
        "category": "Pie Chart",
        "title": "Household Spending in the UK and Japan",
        "prompt": "The pie charts compare household expenditure patterns across five categories in the United Kingdom and Japan in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Household Spending Categories (2024)",
            "set1_title": "United Kingdom",
            "set1_data": [("Housing", 36), ("Food", 18), ("Transport", 16), ("Leisure", 22), ("Other", 8)],
            "set2_title": "Japan",
            "set2_data": [("Housing", 24), ("Food", 32), ("Transport", 12), ("Leisure", 17), ("Other", 15)],
        },
        "modelEssay": (
            "The pie charts compare how typical households in the United Kingdom and Japan allocated their monthly spending across five categories during 2024.\n\n"
            "Overall, housing constituted the largest expenditure item for British families, whereas Japanese households allocated the greatest proportion of income to food. Both nations committed lower, comparable shares to transport and recreation.\n\n"
            "In the United Kingdom, housing represented over a third of total expenditure at 36%, compared to 22% for leisure and entertainment. Food was the third largest category at 18%, followed by transport at 16% and miscellaneous goods at 8%.\n\n"
            "In Japan, however, food consumed the largest share at 32%, nearly double the British proportion. Housing followed at 24%, while recreation accounted for 17%. Japanese families spent slightly less on transport (12%) than their UK counterparts, while allocating a larger share of 15% toward other domestic needs."
        )
    },
    # -------------------------------------------------------------
    # Q23: Pie Chart - Global Land Surface Use
    # -------------------------------------------------------------
    {
        "id": "t1-acad-023",
        "category": "Pie Chart",
        "title": "Global Habitable Land Surface Utilization",
        "prompt": "The pie chart below illustrates how habitable land surface area is utilized globally across agriculture, forests, shrubland, and built urban infrastructure. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Global Habitable Land Allocation (%)",
            "set1_title": "Land Use Distribution",
            "set1_data": [("Agriculture", 46), ("Forests", 38), ("Shrub & Grass", 13), ("Urban Built", 3)],
        },
        "modelEssay": (
            "The pie chart illustrates the allocation of the world's habitable land surface across four main categories: agriculture, natural forests, shrub and grassland, and urban development.\n\n"
            "Overall, agricultural production and forested ecosystems overwhelmingly comprise the vast majority of all habitable terrain on Earth, whereas human urban infrastructure occupies an extremely minor fraction of the global land surface.\n\n"
            "Agriculture represents the single largest land-use category globally, commanding nearly half of all habitable ground at 46%. Natural forests constitute the second most extensive biome, preserving 38% of habitable territory. Together, farming and woodlands encompass an overwhelming 84% of total usable terrestrial space.\n\n"
            "The remaining portion is partitioned into shrubland and wild grasslands, which account for 13% of the land area. In stark contrast, built-up urban infrastructure—encompassing all cities, residential settlements, commercial zones, and transport networks—occupies only 3% of habitable Earth."
        )
    },
    # -------------------------------------------------------------
    # Q24: Pie Chart - University Revenue Sources
    # -------------------------------------------------------------
    {
        "id": "t1-acad-024",
        "category": "Pie Chart",
        "title": "University Operating Budget Income Sources",
        "prompt": "The two pie charts compare funding sources for a major public research university in 2004 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "University Income Sources",
            "set1_title": "2004",
            "set1_data": [("Govt Grants", 52), ("Tuition Fees", 28), ("Research Contracts", 12), ("Philanthropy", 8)],
            "set2_title": "2024",
            "set2_data": [("Govt Grants", 26), ("Tuition Fees", 48), ("Research Contracts", 18), ("Philanthropy", 8)],
        },
        "modelEssay": (
            "The two pie charts examine structural changes in the funding sources of a major public research university between 2004 and 2024.\n\n"
            "Overall, the institution transitioned from relying primarily on direct state subsidies to depending predominantly on student tuition fees, while corporate research contracts also experienced noticeable growth.\n\n"
            "In 2004, government funding grants constituted more than half of the institution's operating revenue at 52%. Student tuition fees represented the second largest source at 28%, with commercial research contracts and philanthropic donations accounting for 12% and 8% respectively.\n\n"
            "By 2024, this fiscal model underwent an inversion. Government grants halved to 26%, while revenue from student tuition fees surged to 48%, becoming the dominant source of revenue. Research contracts expanded from 12% to 18%, reflecting closer collaboration with industry, while philanthropic endowment gifts remained stable at 8%."
        )
    },
    # -------------------------------------------------------------
    # Q25: Pie Chart - Domestic Household Water Use
    # -------------------------------------------------------------
    {
        "id": "t1-acad-025",
        "category": "Pie Chart",
        "title": "Domestic Household Water Consumption by Appliance",
        "prompt": "The pie chart below details the average domestic water consumption breakdown across household activities and appliances in an urban municipality. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "chart_type": "pie",
        "chart_params": {
            "title": "Household Water Consumption by Activity",
            "set1_title": "Domestic Water Use",
            "set1_data": [("Showers & Baths", 34), ("Toilet Flushing", 26), ("Washing Machine", 22), ("Kitchen & Taps", 12), ("Garden & Other", 6)],
        },
        "modelEssay": (
            "The pie chart provides a percentage breakdown of daily domestic water usage across five household fixtures and appliances in an urban municipality.\n\n"
            "Overall, personal hygiene and sanitation account for the overwhelming majority of residential water consumption, with showers, baths, and toilets representing over half of total water use.\n\n"
            "Showers and baths comprise the single largest component of household water demand at 34%, followed closely by toilet flushing at 26%. Together, these bathroom facilities account for 60% of all treated water consumed inside the home.\n\n"
            "Clothes washing machines represent the third most water-intensive appliance, consuming 22% of the municipal supply. Kitchen taps and culinary cleaning require 12%, while garden irrigation, vehicle washing, and miscellaneous outdoor tasks account for the smallest fraction at just 6%."
        )
    },
]
