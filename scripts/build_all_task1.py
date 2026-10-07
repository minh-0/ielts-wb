"""
Build script to generate 100 SVG chart files in public/task1/ and assemble src/lib/task1AcademicData.ts
"""

import os
import json
import re
from svg_generators import (
    generate_line_graph,
    generate_bar_chart,
    generate_pie_chart,
    generate_table_chart,
    generate_process_flow,
    generate_cycle_diagram,
    generate_map_comparison,
)
from task1_data_part1 import QUESTIONS_PART1
from task1_data_part2 import QUESTIONS_PART2
from task1_data_part3 import QUESTIONS_PART3
from task1_data_part4 import QUESTIONS_PART4

ALL_QUESTIONS = QUESTIONS_PART1 + QUESTIONS_PART2 + QUESTIONS_PART3 + QUESTIONS_PART4

def generate_svg_for_question(q, svg_path):
    c_type = q.get("chart_type")
    params = q.get("chart_params", {})
    
    if c_type == "line":
        svg_code = generate_line_graph(
            title=params["title"],
            x_labels=params["x_labels"],
            series_dict=params["series_dict"],
            y_unit=params.get("y_unit", "Value"),
            y_min=params.get("y_min", 0),
            y_max=params.get("y_max", 100),
            y_step=params.get("y_step", 20),
        )
    elif c_type == "bar":
        svg_code = generate_bar_chart(
            title=params["title"],
            categories=params["categories"],
            series_dict=params["series_dict"],
            y_unit=params.get("y_unit", "Value"),
            y_min=params.get("y_min", 0),
            y_max=params.get("y_max", 100),
            y_step=params.get("y_step", 20),
        )
    elif c_type == "pie":
        svg_code = generate_pie_chart(
            title=params["title"],
            set1_title=params["set1_title"],
            set1_data=params["set1_data"],
            set2_title=params.get("set2_title"),
            set2_data=params.get("set2_data"),
        )
    elif c_type == "table":
        svg_code = generate_table_chart(
            title=params["title"],
            headers=params["headers"],
            rows=params["rows"],
        )
    elif c_type == "process":
        svg_code = generate_process_flow(
            title=params["title"],
            steps=params["steps"],
        )
    elif c_type == "cycle":
        svg_code = generate_cycle_diagram(
            title=params["title"],
            stages=params["stages"],
        )
    elif c_type == "map":
        svg_code = generate_map_comparison(
            title=params["title"],
            before_year=params["before_year"],
            after_year=params["after_year"],
            before_items=params["before_items"],
            after_items=params["after_items"],
        )
    else:
        raise ValueError(f"Unknown chart type: {c_type}")
        
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_code)

def main():
    public_dir = os.path.join(os.path.dirname(__file__), "..", "public", "task1")
    os.makedirs(public_dir, exist_ok=True)
    
    ts_bank = []
    
    print(f"Generating 100 Task 1 Academic charts and model essays...")
    
    for idx, q in enumerate(ALL_QUESTIONS, 1):
        num_str = f"{idx:03d}"
        svg_filename = f"task1_{num_str}.svg"
        svg_path = os.path.join(public_dir, svg_filename)
        
        generate_svg_for_question(q, svg_path)
        
        image_url = f"/task1/{svg_filename}"
        
        # Build prompt object
        prompt_obj = {
            "id": f"t1-acad-{num_str}",
            "type": "task1_academic",
            "category": q["category"],
            "title": q["title"],
            "prompt": q["prompt"],
            "imageUrl": image_url,
            "suggestedTimeMinutes": 20,
            "minWordCount": 150,
            "modelEssay": q["modelEssay"]
        }
        ts_bank.append(prompt_obj)
        
    print(f"Successfully generated {len(ts_bank)} SVG files in {public_dir}!")
    
    # Write src/lib/task1AcademicData.ts
    target_ts = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "task1AcademicData.ts")
    with open(target_ts, "w", encoding="utf-8") as f:
        f.write('import { WritingPrompt } from "./ieltsPromptBank";\n\n')
        f.write('export const TASK1_ACADEMIC_BANK: WritingPrompt[] = [\n')
        for item in ts_bank:
            f.write('  {\n')
            f.write(f'    id: {json.dumps(item["id"])},\n')
            f.write(f'    type: "task1_academic",\n')
            f.write(f'    category: {json.dumps(item["category"])},\n')
            f.write(f'    title: {json.dumps(item["title"])},\n')
            f.write(f'    prompt: {json.dumps(item["prompt"])},\n')
            f.write(f'    imageUrl: {json.dumps(item["imageUrl"])},\n')
            f.write(f'    suggestedTimeMinutes: 20,\n')
            f.write(f'    minWordCount: 150,\n')
            f.write(f'    modelEssay: {json.dumps(item["modelEssay"])},\n')
            f.write('  },\n')
        f.write('];\n')
        
    print(f"Successfully written {len(ts_bank)} Task 1 prompts to {target_ts}!")

if __name__ == "__main__":
    main()
