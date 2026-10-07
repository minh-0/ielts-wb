"""
SVG Chart & Diagram Generators for IELTS Academic Task 1
Generates modern, crisp, vector-sharp SVGs in 16:10 aspect ratio (700x440).
"""

import html

def escape(txt):
    return html.escape(str(txt))

def svg_wrapper(content, width=700, height=440, title=""):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b0f19;">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#34d399"/>
    </marker>
  </defs>
  <!-- Card Background -->
  <rect width="{width}" height="{height}" rx="14" fill="url(#bgGrad)" stroke="#1e293b" stroke-width="1.5" />
  
  <!-- Title Header -->
  <text x="32" y="38" fill="#f8fafc" font-size="15" font-weight="700" letter-spacing="0.2">{escape(title)}</text>
  
  {content}
</svg>'''

PALETTE = ["#38bdf8", "#34d399", "#f472b6", "#fbbf24", "#a78bfa", "#fb7185", "#2dd4bf"]

def generate_line_graph(title, x_labels, series_dict, y_unit="Value", y_min=0, y_max=100, y_step=20):
    """
    series_dict: { "Series Name": [val1, val2, ...] }
    """
    gx, gy, gw, gh = 75, 75, 570, 300
    content = []
    
    # Grid lines & Y axis labels
    steps = int((y_max - y_min) / y_step)
    for i in range(steps + 1):
        val = y_min + i * y_step
        y_pos = gy + gh - (i / steps) * gh
        content.append(f'<line x1="{gx}" y1="{y_pos:.1f}" x2="{gx + gw}" y2="{y_pos:.1f}" stroke="#1e293b" stroke-width="1" stroke-dasharray="3 3"/>')
        content.append(f'<text x="{gx - 12}" y="{y_pos + 4:.1f}" fill="#64748b" font-size="11" text-anchor="end" font-family="monospace">{val}</text>')
    
    # Y-axis title
    content.append(f'<text x="{gx}" y="62" fill="#94a3b8" font-size="11" font-weight="500">{escape(y_unit)}</text>')
    
    # X axis labels & vertical ticks
    n_pts = len(x_labels)
    x_coords = []
    for i, label in enumerate(x_labels):
        x_pos = gx + (i / (n_pts - 1)) * gw if n_pts > 1 else gx + gw / 2
        x_coords.append(x_pos)
        content.append(f'<line x1="{x_pos:.1f}" y1="{gy + gh}" x2="{x_pos:.1f}" y2="{gy + gh + 6}" stroke="#475569" stroke-width="1"/>')
        content.append(f'<text x="{x_pos:.1f}" y="{gy + gh + 22}" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="monospace">{escape(label)}</text>')
        content.append(f'<line x1="{x_pos:.1f}" y1="{gy}" x2="{x_pos:.1f}" y2="{gy + gh}" stroke="#1e293b" stroke-width="0.75" opacity="0.5"/>')
    
    # Base axes
    content.append(f'<line x1="{gx}" y1="{gy}" x2="{gx}" y2="{gy + gh}" stroke="#475569" stroke-width="1.5"/>')
    content.append(f'<line x1="{gx}" y1="{gy + gh}" x2="{gx + gw}" y2="{gy + gh}" stroke="#475569" stroke-width="1.5"/>')
    
    # Render lines & data dots
    s_idx = 0
    legend_items = []
    for s_name, data in series_dict.items():
        color = PALETTE[s_idx % len(PALETTE)]
        pts = []
        for i, val in enumerate(data):
            xv = x_coords[i]
            clamped = max(y_min, min(y_max, val))
            yv = gy + gh - ((clamped - y_min) / (y_max - y_min)) * gh
            pts.append((xv, yv, val))
        
        path_str = " ".join([f"{'M' if i==0 else 'L'} {p[0]:.1f} {p[1]:.1f}" for i, p in enumerate(pts)])
        content.append(f'<path d="{path_str}" fill="none" stroke="{color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
        
        for p in pts:
            content.append(f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="4" fill="#0b0f19" stroke="{color}" stroke-width="2.5"/>')
            content.append(f'<text x="{p[0]:.1f}" y="{p[1] - 8:.1f}" fill="{color}" font-size="9.5" text-anchor="middle" font-weight="600">{p[2]}</text>')
        
        legend_items.append((s_name, color))
        s_idx += 1
    
    # Legend
    leg_x = gx + gw
    for s_name, color in reversed(legend_items):
        txt_len = len(s_name) * 6.5 + 24
        leg_x -= txt_len
        content.append(f'<circle cx="{leg_x + 6}" cy="42" r="4.5" fill="{color}"/>')
        content.append(f'<text x="{leg_x + 16}" y="45" fill="#cbd5e1" font-size="11" font-weight="500">{escape(s_name)}</text>')
    
    return svg_wrapper("\n  ".join(content), title=title)

def generate_bar_chart(title, categories, series_dict, y_unit="Value", y_min=0, y_max=100, y_step=20):
    """
    categories: list of category names (e.g. 5 countries)
    series_dict: { "Series Name": [val1, val2, ...] }
    """
    gx, gy, gw, gh = 75, 75, 570, 300
    content = []
    
    steps = int((y_max - y_min) / y_step)
    for i in range(steps + 1):
        val = y_min + i * y_step
        y_pos = gy + gh - (i / steps) * gh
        content.append(f'<line x1="{gx}" y1="{y_pos:.1f}" x2="{gx + gw}" y2="{y_pos:.1f}" stroke="#1e293b" stroke-width="1" stroke-dasharray="3 3"/>')
        content.append(f'<text x="{gx - 12}" y="{y_pos + 4:.1f}" fill="#64748b" font-size="11" text-anchor="end" font-family="monospace">{val}</text>')
    
    content.append(f'<text x="{gx}" y="62" fill="#94a3b8" font-size="11" font-weight="500">{escape(y_unit)}</text>')
    
    n_cats = len(categories)
    n_series = len(series_dict)
    cat_width = gw / n_cats
    bar_width = min(28, (cat_width * 0.75) / n_series)
    group_width = bar_width * n_series
    
    series_keys = list(series_dict.keys())
    
    for c_idx, cat_name in enumerate(categories):
        cx = gx + c_idx * cat_width + cat_width / 2
        group_start = cx - group_width / 2
        
        # Category label
        content.append(f'<text x="{cx:.1f}" y="{gy + gh + 22}" fill="#94a3b8" font-size="11" text-anchor="middle">{escape(cat_name)}</text>')
        content.append(f'<line x1="{cx:.1f}" y1="{gy + gh}" x2="{cx:.1f}" y2="{gy + gh + 6}" stroke="#475569" stroke-width="1"/>')
        
        for s_idx, s_name in enumerate(series_keys):
            val = series_dict[s_name][c_idx]
            bx = group_start + s_idx * bar_width
            clamped = max(y_min, min(y_max, val))
            bh = ((clamped - y_min) / (y_max - y_min)) * gh
            by = gy + gh - bh
            color = PALETTE[s_idx % len(PALETTE)]
            
            content.append(f'<rect x="{bx:.1f}" y="{by:.1f}" width="{bar_width - 2:.1f}" height="{bh:.1f}" rx="3" fill="{color}" opacity="0.9"/>')
            content.append(f'<text x="{bx + (bar_width - 2) / 2:.1f}" y="{by - 4:.1f}" fill="{color}" font-size="9" text-anchor="middle" font-weight="600">{val}</text>')
            
    # Base axes
    content.append(f'<line x1="{gx}" y1="{gy}" x2="{gx}" y2="{gy + gh}" stroke="#475569" stroke-width="1.5"/>')
    content.append(f'<line x1="{gx}" y1="{gy + gh}" x2="{gx + gw}" y2="{gy + gh}" stroke="#475569" stroke-width="1.5"/>')
    
    # Legend
    leg_x = gx + gw
    for s_idx, s_name in reversed(list(enumerate(series_keys))):
        color = PALETTE[s_idx % len(PALETTE)]
        txt_len = len(s_name) * 6.5 + 24
        leg_x -= txt_len
        content.append(f'<rect x="{leg_x}" y="36" width="10" height="10" rx="2" fill="{color}"/>')
        content.append(f'<text x="{leg_x + 16}" y="45" fill="#cbd5e1" font-size="11" font-weight="500">{escape(s_name)}</text>')
        
    return svg_wrapper("\n  ".join(content), title=title)

def generate_pie_chart(title, set1_title, set1_data, set2_title=None, set2_data=None):
    """
    set1_data: [ ("Label", value), ... ]
    """
    import math
    content = []
    
    def render_pie(center_x, center_y, radius, data, chart_title):
        p_content = []
        p_content.append(f'<text x="{center_x}" y="{center_y - radius - 20}" fill="#f1f5f9" font-size="13" font-weight="600" text-anchor="middle">{escape(chart_title)}</text>')
        
        total = sum(v for _, v in data)
        start_angle = -math.pi / 2
        
        for idx, (label, val) in enumerate(data):
            fraction = val / total if total > 0 else 0
            end_angle = start_angle + fraction * 2 * math.pi
            color = PALETTE[idx % len(PALETTE)]
            
            x1 = center_x + radius * math.cos(start_angle)
            y1 = center_y + radius * math.sin(start_angle)
            x2 = center_x + radius * math.cos(end_angle)
            y2 = center_y + radius * math.sin(end_angle)
            
            large_arc = 1 if fraction > 0.5 else 0
            
            # Slice path
            path = f'M {center_x} {center_y} L {x1:.2f} {y1:.2f} A {radius} {radius} 0 {large_arc} 1 {x2:.2f} {y2:.2f} Z'
            p_content.append(f'<path d="{path}" fill="{color}" stroke="#0b0f19" stroke-width="2" opacity="0.95"/>')
            
            # Percentage label on slice
            mid_angle = start_angle + fraction * math.pi
            pct_r = radius * 0.65
            tx = center_x + pct_r * math.cos(mid_angle)
            ty = center_y + pct_r * math.sin(mid_angle)
            p_content.append(f'<text x="{tx:.1f}" y="{ty + 4:.1f}" fill="#0b0f19" font-size="11" font-weight="700" text-anchor="middle">{val}%</text>')
            
            start_angle = end_angle
            
        return "\n  ".join(p_content)

    if set2_data:
        content.append(render_pie(180, 220, 95, set1_data, set1_title))
        content.append(render_pie(440, 220, 95, set2_data, set2_title))
        
        # Shared Legend at right
        leg_x = 580
        leg_y = 120
        all_labels = [label for label, _ in set1_data]
        for idx, label in enumerate(all_labels):
            color = PALETTE[idx % len(PALETTE)]
            content.append(f'<rect x="{leg_x}" y="{leg_y + idx * 26}" width="12" height="12" rx="3" fill="{color}"/>')
            content.append(f'<text x="{leg_x + 18}" y="{leg_y + idx * 26 + 10}" fill="#cbd5e1" font-size="11">{escape(label)}</text>')
    else:
        content.append(render_pie(270, 230, 120, set1_data, set1_title))
        # Legend at right
        leg_x = 440
        leg_y = 140
        for idx, (label, val) in enumerate(set1_data):
            color = PALETTE[idx % len(PALETTE)]
            content.append(f'<rect x="{leg_x}" y="{leg_y + idx * 28}" width="12" height="12" rx="3" fill="{color}"/>')
            content.append(f'<text x="{leg_x + 20}" y="{leg_y + idx * 28 + 10}" fill="#cbd5e1" font-size="12">{escape(label)} ({val}%)</text>')
            
    return svg_wrapper("\n  ".join(content), title=title)

def generate_table_chart(title, headers, rows):
    """
    headers: ["Country", "Food", "Clothing", "Leisure"]
    rows: [ ["UK", "22%", "15%", "18%"], ... ]
    """
    content = []
    tx, ty, tw = 40, 75, 620
    col_w = tw / len(headers)
    row_h = 36
    
    # Header row
    content.append(f'<rect x="{tx}" y="{ty}" width="{tw}" height="{row_h}" rx="6" fill="#1e293b"/>')
    for c_idx, h in enumerate(headers):
        align = "start" if c_idx == 0 else "middle"
        cx = tx + 16 if c_idx == 0 else tx + c_idx * col_w + col_w / 2
        content.append(f'<text x="{cx:.1f}" y="{ty + 22}" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="{align}">{escape(h)}</text>')
        
    # Data rows
    for r_idx, r in enumerate(rows):
        ry = ty + row_h + r_idx * row_h
        bg_col = "#0f172a" if r_idx % 2 == 0 else "#131c31"
        content.append(f'<rect x="{tx}" y="{ry}" width="{tw}" height="{row_h}" fill="{bg_col}" stroke="#1e293b" stroke-width="0.5"/>')
        for c_idx, cell in enumerate(r):
            align = "start" if c_idx == 0 else "middle"
            cx = tx + 16 if c_idx == 0 else tx + c_idx * col_w + col_w / 2
            txt_col = "#f8fafc" if c_idx == 0 else "#cbd5e1"
            font_wt = "600" if c_idx == 0 else "400"
            content.append(f'<text x="{cx:.1f}" y="{ry + 22}" fill="{txt_col}" font-size="11.5" font-weight="{font_wt}" text-anchor="{align}">{escape(cell)}</text>')
            
    return svg_wrapper("\n  ".join(content), title=title)

def generate_process_flow(title, steps):
    """
    steps: [ ("Step 1", "Collection", "Plastic bottles sorted and bundled"), ... ]
    """
    content = []
    n = len(steps)
    
    # 2 rows layout (e.g. 3 on top, 3 on bottom) or linear
    cols = min(4, n)
    box_w = 135
    box_h = 95
    h_gap = (620 - cols * box_w) / (cols - 1) if cols > 1 else 0
    
    for idx, (step_num, step_name, step_desc) in enumerate(steps):
        row = idx // cols
        col = idx % cols
        bx = 40 + col * (box_w + h_gap)
        by = 85 + row * 165
        color = PALETTE[idx % len(PALETTE)]
        
        content.append(f'<rect x="{bx}" y="{by}" width="{box_w}" height="{box_h}" rx="10" fill="#131c31" stroke="{color}" stroke-width="1.8" filter="url(#shadow)"/>')
        content.append(f'<rect x="{bx}" y="{by}" width="{box_w}" height="24" rx="10" fill="{color}" opacity="0.2"/>')
        content.append(f'<text x="{bx + 10}" y="{by + 16}" fill="{color}" font-size="10" font-weight="700" font-family="monospace">{escape(step_num)}</text>')
        content.append(f'<text x="{bx + 10}" y="{by + 42}" fill="#f8fafc" font-size="11.5" font-weight="700">{escape(step_name)}</text>')
        
        # Word wrap description
        words = step_desc.split(" ")
        line1 = " ".join(words[:4])
        line2 = " ".join(words[4:8])
        line3 = " ".join(words[8:])
        content.append(f'<text x="{bx + 10}" y="{by + 60}" fill="#94a3b8" font-size="9.5">{escape(line1)}</text>')
        if line2:
            content.append(f'<text x="{bx + 10}" y="{by + 73}" fill="#94a3b8" font-size="9.5">{escape(line2)}</text>')
        if line3:
            content.append(f'<text x="{bx + 10}" y="{by + 86}" fill="#94a3b8" font-size="9.5">{escape(line3)}</text>')
            
        # Arrow to next step
        if idx < n - 1:
            if row == 0 and col < cols - 1:
                # Right arrow
                ax1 = bx + box_w + 3
                ax2 = ax1 + h_gap - 6
                ay = by + box_h / 2
                content.append(f'<line x1="{ax1}" y1="{ay}" x2="{ax2}" y2="{ay}" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>')
            elif col == cols - 1 and row == 0:
                # Down arrow to next row
                ax = bx + box_w / 2
                ay1 = by + box_h + 4
                ay2 = ay1 + 45
                content.append(f'<line x1="{ax}" y1="{ay1}" x2="{ax}" y2="{ay2}" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>')
            elif row == 1 and col < cols - 1:
                # Right arrow on row 2
                ax1 = bx + box_w + 3
                ax2 = ax1 + h_gap - 6
                ay = by + box_h / 2
                content.append(f'<line x1="{ax1}" y1="{ay}" x2="{ax2}" y2="{ay}" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>')
                
    return svg_wrapper("\n  ".join(content), title=title)

def generate_cycle_diagram(title, stages):
    """
    Circular lifecycle diagram (e.g. Salmon Life Cycle)
    stages: [ ("Eggs", "Freshwater gravel riverbed"), ("Alevin", "Yolk-sac larvae"), ... ]
    """
    import math
    content = []
    cx, cy, r = 350, 240, 130
    n = len(stages)
    
    # Outer dashed orbit
    content.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6 6"/>')
    content.append(f'<circle cx="{cx}" cy="{cy}" r="35" fill="#131c31" stroke="#38bdf8" stroke-width="1.5"/>')
    content.append(f'<text x="{cx}" y="{cy + 4}" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">CYCLE</text>')
    
    for idx, (stg_name, stg_desc) in enumerate(stages):
        angle = -math.pi / 2 + (idx / n) * 2 * math.pi
        nx = cx + r * math.cos(angle)
        ny = cy + r * math.sin(angle)
        color = PALETTE[idx % len(PALETTE)]
        
        bw, bh = 110, 52
        bx = nx - bw / 2
        by = ny - bh / 2
        
        content.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="8" fill="#0f172a" stroke="{color}" stroke-width="2" filter="url(#shadow)"/>')
        content.append(f'<text x="{nx}" y="{by + 20}" fill="{color}" font-size="11" font-weight="700" text-anchor="middle">{escape(stg_name)}</text>')
        content.append(f'<text x="{nx}" y="{by + 36}" fill="#94a3b8" font-size="9" text-anchor="middle">{escape(stg_desc)}</text>')
        
    return svg_wrapper("\n  ".join(content), title=title)

def generate_map_comparison(title, before_year, after_year, before_items, after_items):
    """
    before_items: list of (x, y, w, h, label, type)
    after_items: list of (x, y, w, h, label, type)
    """
    content = []
    
    def render_submap(ox, oy, w, h, year_label, items):
        sm = []
        sm.append(f'<rect x="{ox}" y="{oy}" width="{w}" height="{h}" rx="10" fill="#0a101f" stroke="#334155" stroke-width="1.5"/>')
        sm.append(f'<text x="{ox + w/2}" y="{oy + 25}" fill="#f8fafc" font-size="13" font-weight="700" text-anchor="middle">{escape(year_label)}</text>')
        
        # Compass
        comp_x = ox + w - 30
        comp_y = oy + 30
        sm.append(f'<circle cx="{comp_x}" cy="{comp_y}" r="12" fill="#1e293b" stroke="#475569"/>')
        sm.append(f'<text x="{comp_x}" y="{comp_y + 4}" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">N</text>')
        
        for item in items:
            ix, iy, iw, ih, ilabel, itype = item
            fx = ox + ix
            fy = oy + iy
            if itype == "green":
                fill, stroke, txt = "#064e3b", "#34d399", "#a7f3d0"
            elif itype == "building":
                fill, stroke, txt = "#1e1b4b", "#818cf8", "#c7d2fe"
            elif itype == "road":
                fill, stroke, txt = "#334155", "#64748b", "#e2e8f0"
            elif itype == "water":
                fill, stroke, txt = "#0c4a6e", "#38bdf8", "#bae6fd"
            else:
                fill, stroke, txt = "#312e81", "#a78bfa", "#ddd6fe"
                
            sm.append(f'<rect x="{fx}" y="{fy}" width="{iw}" height="{ih}" rx="4" fill="{fill}" stroke="{stroke}" stroke-width="1.2"/>')
            sm.append(f'<text x="{fx + iw/2}" y="{fy + ih/2 + 4}" fill="{txt}" font-size="9.5" font-weight="600" text-anchor="middle">{escape(ilabel)}</text>')
            
        return "\n  ".join(sm)
        
    content.append(render_submap(35, 70, 300, 330, before_year, before_items))
    content.append(render_submap(365, 70, 300, 330, after_year, after_items))
    
    return svg_wrapper("\n  ".join(content), title=title)
