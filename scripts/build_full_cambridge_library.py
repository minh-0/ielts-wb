import json
import os
import sys

# Ensure scripts directory is in path
sys.path.append(os.path.dirname(__file__))
sys.path.append(os.path.join(os.path.dirname(__file__), "collocations_data"))

import part1_academic
import part2_adverbs
import part3_business
import part4_society
import part5_science
import part6_emotions
import part7_verbs
import part8_change
import part9_lifestyle_education
import part10_nature_travel
import part11_communication_metaphors
import part12_work_law_economy
import part13_change_power_trends
import part14_arts_sports_leisure
import part15_everyday_idioms_advanced
import part16_abstract_concepts
import part17_high_band_mastery
import part18_final_cambridge_vault

TYPE_LABELS = {
    "adj_noun": "Adjective + Noun",
    "verb_noun": "Verb + Noun",
    "adv_adj": "Adverb + Adjective",
    "noun_verb": "Noun + Verb",
    "verb_adv": "Verb + Adverb"
}

TOPIC_LABELS = {
    "academic_writing": "Academic & Essay Writing",
    "intensifying_adverbs": "Intensifying Adverbs",
    "work_business": "Work, Business & Economy",
    "society_policy": "Society, Law & Policy",
    "environment_science": "Environment & Science",
    "emotions_mind": "Feelings & Psychology",
    "everyday_verbs": "Key Verbs (Make, Do, Have)",
    "change_time": "Time, Trend & Change"
}

def build_library():
    all_raw_parts = [
        part1_academic.ITEMS,
        part2_adverbs.ITEMS,
        part3_business.ITEMS,
        part4_society.ITEMS,
        part5_science.ITEMS,
        part6_emotions.ITEMS,
        part7_verbs.ITEMS,
        part8_change.ITEMS,
        part9_lifestyle_education.ITEMS,
        part10_nature_travel.ITEMS,
        part11_communication_metaphors.ITEMS,
        part12_work_law_economy.ITEMS,
        part13_change_power_trends.ITEMS,
        part14_arts_sports_leisure.ITEMS,
        part15_everyday_idioms_advanced.ITEMS,
        part16_abstract_concepts.ITEMS,
        part17_high_band_mastery.ITEMS,
        part18_final_cambridge_vault.ITEMS,
    ]

    all_tuples = []
    seen = set()
    for part in all_raw_parts:
        for tup in part:
            colloc_key = tup[0].lower().strip()
            if colloc_key not in seen:
                seen.add(colloc_key)
                all_tuples.append(tup)

    # Sort primarily by Level (Advanced first or Intermediate first), then Topic, then Collocation
    # To provide balanced representation, we sort by Level (Intermediate, Advanced) then Collocation
    all_tuples.sort(key=lambda x: (x[2], x[5], x[0]))

    formatted_items = []
    for idx, tup in enumerate(all_tuples, 1):
        colloc, c_type, lvl, book, unit, topic, definition, example, mistake, band, alternatives, tip = tup

        assert c_type in TYPE_LABELS, f"Invalid type: {c_type}"
        assert topic in TOPIC_LABELS, f"Invalid topic: {topic}"
        assert lvl in ("Intermediate", "Advanced"), f"Invalid level: {lvl}"
        assert book in ("English Collocations in Use Intermediate", "English Collocations in Use Advanced"), f"Invalid book: {book}"

        item_id = f"coll-{idx:03d}"
        formatted_items.append({
            "id": item_id,
            "collocation": colloc,
            "type": c_type,
            "typeLabel": TYPE_LABELS[c_type],
            "level": lvl,
            "sourceBook": book,
            "unit": unit,
            "topic": topic,
            "topicLabel": TOPIC_LABELS[topic],
            "definition": definition,
            "example": example,
            "commonMistake": mistake,
            "bandImpact": band,
            "alternativePartners": alternatives,
            "ieltsTip": tip
        })

    return formatted_items

def main():
    items = build_library()
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(root_dir, "src", "lib", "collocationsList.json")

    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"Successfully compiled {len(items)} authentic Cambridge collocations to:")
    print(f"-> {target_path}")

    # Statistics
    from collections import Counter
    levels = Counter(x["level"] for x in items)
    topics = Counter(x["topic"] for x in items)
    types = Counter(x["type"] for x in items)

    print("\n--- LEVEL BREAKDOWN ---")
    for lvl, count in levels.items():
        print(f"  {lvl}: {count}")

    print("\n--- TOPIC BREAKDOWN ---")
    for top, count in sorted(topics.items()):
        print(f"  {TOPIC_LABELS[top]} ({top}): {count}")

    print("\n--- GRAMMATICAL TYPE BREAKDOWN ---")
    for typ, count in sorted(types.items()):
        print(f"  {TYPE_LABELS[typ]} ({typ}): {count}")

    print(f"\nJSON File Size: {os.path.getsize(target_path) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
