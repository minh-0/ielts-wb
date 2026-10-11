# Cambridge English Collocations in Use (Intermediate & Advanced)
# Topic Batch: Work, Law, Finance & Risk
# Mapped to canonical topics: work_business, society_policy, everyday_verbs

ITEMS = [
    # --- Finance & Economics (Intermediate Unit 53 & Advanced Unit 22) ---
    ("tight budget", "adj_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 53: Money & Finance", "work_business",
     "A financial spending plan that allows very little leeway for discretionary or unnecessary expense.",
     "Students living on a tight budget must plan grocery expenditures with meticulous care.",
     "❌ narrow money-plan / strict wallet limit → ✔ a tight budget", "Band 7.0+", ["stringent budget", "austere budget"],
     "Personal finance and public spending essays."),
    
    ("hefty fine", "adj_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 53: Money & Finance", "society_policy",
     "A very large, substantial, and punitive financial penalty.",
     "Corporations caught dumping untreated wastewater face a hefty fine from environmental regulators.",
     "❌ heavy-weight fine / big money punishment → ✔ a hefty fine / a substantial penalty", "Band 7.5+", ["substantial penalty", "stiff financial sanction"],
     "Legal deterrence prompts."),
    
    ("accumulate wealth", "verb_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 53: Money & Finance", "work_business",
     "To gradually collect, amass, and build up financial assets over an extended period.",
     "Financial advisors emphasize that disciplined index investing allows households to accumulate wealth over decades.",
     "❌ gather riches / pile up cash-fortune → ✔ accumulate wealth / amass capital", "Band 7.5+", ["amass fortunes", "build up capital"],
     "Economics and wealth inequality essays."),
    
    ("live beyond one's means", "verb_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 53: Money & Finance", "work_business",
     "To spend more money than one earns, leading to debt and instability.",
     "Easy access to unsecured credit lines encourages impressionable consumers to live beyond their means.",
     "❌ spend over one's wallet / live outside earnings → ✔ live beyond one's means", "Band 7.5+", ["overextend financially", "incur reckless debt"],
     "Consumerism and household debt essays."),
    
    ("exorbitant interest", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 22: Business Finance", "work_business",
     "Interest rates charged on borrowed capital that are unreasonably and extortionately high.",
     "Predatory payday lenders trap low-income borrowers by charging exorbitant interest rates.",
     "❌ skyrocketing percentage / insane-high interest → ✔ exorbitant interest / usurious interest rates", "Band 8.5+", ["usurious rates", "extortionate interest"],
     "Banking regulation and consumer rights."),
    
    ("sound investment", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 22: Business Finance", "work_business",
     "A financially prudent, reliable, and secure allocation of capital that yields dependable returns.",
     "Investing public funds in municipal early childhood care centers is universally recognized as a sound investment.",
     "❌ safe-healthy investment / good-money bet → ✔ a sound investment / a prudent investment", "Band 8.0+", ["prudent investment", "judicious allocation"],
     "Policy recommendations and fiscal essays."),
    
    ("fiscal deficit", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 22: Business Finance", "work_business",
     "The amount by which a government's total expenditure exceeds its revenue over a period.",
     "Rising entitlement liabilities threaten to expand the national fiscal deficit beyond sustainable ratios.",
     "❌ money-balance hole / state treasury gap → ✔ a fiscal deficit / budgetary shortfall", "Band 8.5+", ["budgetary shortfall", "public borrowing requirement"],
     "Macroeconomics and public finance."),
    
    # --- Employment & Workplace (Intermediate Unit 25 & Advanced Unit 24) ---
    ("job insecurity", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 24: Employment and Career", "work_business",
     "The state of being constantly anxious about losing one's employment due to precarious contracts.",
     "The proliferation of zero-hour gig economy contracts has exacerbated chronic job insecurity.",
     "❌ work not-safety / job worry-state → ✔ job insecurity / precarious employment", "Band 8.5+", ["precarious employment", "employment vulnerability"],
     "Modern workforce and labour rights essays."),
    
    ("golden handshake", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 24: Employment and Career", "work_business",
     "A very generous sum of money given to a senior executive when they retire or leave a company.",
     "Shareholders voiced outrage when the ousted CEO departed with a multi-million-pound golden handshake.",
     "❌ gold-hand gift / diamond leaving cash → ✔ a golden handshake / a lucrative severance package", "Band 8.5+", ["lucrative severance package", "executive payout"],
     "Corporate governance and executive pay."),
    
    ("performance appraisal", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 24: Employment and Career", "work_business",
     "A formal, periodic evaluation of an employee's professional work and productivity.",
     "Quarterly performance appraisals allow management to identify talent and address skill deficiencies.",
     "❌ work-testing score / job-evaluation meeting → ✔ a performance appraisal / a performance review", "Band 8.0+", ["performance review", "evaluative appraisal"],
     "Human resources and management prompts."),
    
    ("minimum wage", "adj_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 25: Work", "work_business",
     "The lowest hourly remuneration that employers may legally pay their workers.",
     "Raising the national statutory minimum wage helps alleviate in-work poverty for low-skilled laborers.",
     "❌ bottom salary / smallest legal pay → ✔ the minimum wage", "Band 7.5+", ["statutory baseline wage"],
     "Labour policy and poverty alleviation."),
    
    ("high staff turnover", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 24: Employment and Career", "work_business",
     "The rapid rate at which employees leave an organization and must be replaced.",
     "Poor workplace culture and toxic management inevitably lead to a destructively high staff turnover.",
     "❌ fast worker-changing rate / heavy personnel switching → ✔ high staff turnover", "Band 8.5+", ["elevated attrition rate", "high churn rate"],
     "Organizational psychology and human resources."),
    
    # --- Meetings & Corporate Negotiations (Advanced Unit 25) ---
    ("chair a meeting", "verb_noun", "Advanced", "English Collocations in Use Advanced", "Unit 25: Meetings and Negotiations", "work_business",
     "To act as the official leader, moderator, and presiding officer of a meeting.",
     "The senior ombudsman was chosen to chair the multilateral meeting between dispute factions.",
     "❌ head-sit a meeting / table-master a talk → ✔ chair a meeting / preside over a session", "Band 8.0+", ["preside over a meeting", "lead a session"],
     "Professional and academic conference settings."),
    
    ("protracted dispute", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 25: Meetings and Negotiations", "work_business",
     "An argument or conflict that has been prolonged and drawn out over an excessively long time.",
     "After a protracted dispute spanning three years, the two software firms agreed to an out-of-court settlement.",
     "❌ long-pulled fight / forever-lasting argument → ✔ a protracted dispute / a drawn-out conflict", "Band 8.5+", ["drawn-out conflict", "interminable feud"],
     "Diplomacy and arbitration topics."),
    
    ("strike a compromise", "verb_noun", "Advanced", "English Collocations in Use Advanced", "Unit 25: Meetings and Negotiations", "everyday_verbs",
     "To reach an agreement where both opposing sides make concessions.",
     "Diplomatic envoys labored relentlessly to strike an acceptable compromise between both nations.",
     "❌ hit a middle-way / make compromise-touch → ✔ strike a compromise / reach a compromise", "Band 8.5+", ["forge a middle ground", "negotiate a concession"],
     "Conflict resolution and civic compromise."),
    
    # --- Law, Crime & Justice (Intermediate Units 29 & 54, Advanced Unit 27) ---
    ("commit a crime", "verb_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 38: Law & Crime", "society_policy",
     "To perform an unlawful, criminal deed in violation of the legal code.",
     "Youths who commit a minor crime should be directed towards restorative community service.",
     "❌ make a crime / do a crime → ✔ commit a crime / perpetrate an offence", "Band 7.0+", ["perpetrate an offence", "transgress the law"],
     "Never say 'do a crime' or 'make a crime'."),
    
    ("harsh punishment", "adj_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 54: Crime & Punishment", "society_policy",
     "Severe, strict, and rigorous disciplinary consequences imposed on offenders.",
     "Criminologists debate whether harsh punishment serves as an effective deterrent against recidivism.",
     "❌ heavy pain penalty / cruel-stiff sanction → ✔ harsh punishment / severe sanctions", "Band 7.5+", ["severe sanctions", "stringent penalties"],
     "Penology and justice system essays."),
    
    ("heinous crime", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 27: Law and Order", "society_policy",
     "An act of criminality that is shockingly brutal, evil, and wicked.",
     "Perpetrators of heinous crimes against humanity must be prosecuted by international tribunals.",
     "❌ monster evil crime / shocking-bad offence → ✔ a heinous crime / an atrocious deed", "Band 8.5+", ["atrocious crime", "abhorrent offense"],
     "International human rights and criminal law."),
    
    ("serve a sentence", "verb_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 54: Crime & Punishment", "society_policy",
     "To remain in a prison facility for the full period ordered by a judicial court.",
     "Inmates who serve a lengthy custodial sentence frequently struggle to reintegrate into civil society.",
     "❌ stay a prison time / sit a jail order → ✔ serve a sentence", "Band 7.5+", ["serve prison time", "complete one's sentence"],
     "Rehabilitation and incarceration prompts."),
    
    ("stand trial", "verb_noun", "Intermediate", "English Collocations in Use Intermediate", "Unit 38: Law & Crime", "society_policy",
     "To appear before a judicial court to be judged on criminal charges.",
     "The former corporate treasurer was formally ordered to stand trial for insider trading.",
     "❌ face court judge / be in test room → ✔ stand trial", "Band 7.5+", ["face prosecution", "appear before the court"],
     "Courtroom proceedings and legal terminology."),
    
    # --- Risk, Challenge & Dilemmas (Advanced Unit 52) ---
    ("pose a grave threat", "verb_noun", "Advanced", "English Collocations in Use Advanced", "Unit 52: Challenge and Danger", "environment_science",
     "To present an extremely serious, dangerous, and imminent peril.",
     "Rising sea levels pose a grave threat to the long-term survival of low-lying island states.",
     "❌ give death danger / show tomb risk → ✔ pose a grave threat / present a severe danger", "Band 8.5+", ["present a severe peril", "constitute an existential hazard"],
     "Environmental and geopolitical essays."),
    
    ("take calculated risks", "verb_noun", "Advanced", "English Collocations in Use Advanced", "Unit 52: Challenge and Danger", "everyday_verbs",
     "To undertake an action whose perils and rewards have been carefully estimated beforehand.",
     "Visionary entrepreneurs must be willing to take calculated risks to introduce disruptive technology.",
     "❌ make math risks / do figured danger → ✔ take calculated risks", "Band 8.5+", ["embrace prudent risks"],
     "Business leadership and innovation."),
    
    ("court disaster", "verb_noun", "Advanced", "English Collocations in Use Advanced", "Unit 52: Challenge and Danger", "work_business",
     "To act so recklessly that one invites catastrophic ruin or peril upon oneself.",
     "Neglecting regular preventative maintenance on industrial turbines is simply courting disaster.",
     "❌ invite accident / make love to ruin → ✔ court disaster / flirt with catastrophe", "Band 8.5+", ["flirt with catastrophe", "invite calamity"],
     "High-register idiom for reckless practices."),
    
    ("run the gauntlet", "verb_noun", "Advanced", "English Collocations in Use Advanced", "Unit 52: Challenge and Danger", "society_policy",
     "To pass through a barrage of hostile attacks, criticisms, or physical dangers.",
     "Ministers had to run the gauntlet of angry demonstrators protesting outside parliament.",
     "❌ run the danger line / cross the fire alley → ✔ run the gauntlet", "Band 8.5+", ["endure hostile scrutiny", "face a barrage"],
     "Vivid native idiom."),
    
    ("precarious position", "adj_noun", "Advanced", "English Collocations in Use Advanced", "Unit 52: Challenge and Danger", "work_business",
     "A state or circumstance that is dangerously insecure, unstable, and likely to collapse.",
     "High borrowing ratios leave the mid-sized manufacturing syndicate in a highly precarious position.",
     "❌ shaky stand / fall-easy place → ✔ a precarious position / a vulnerable stance", "Band 8.5+", ["perilous circumstance", "vulnerable footing"],
     "Economic and corporate risk analysis.")
]
