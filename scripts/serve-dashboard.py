#!/usr/bin/env python3
"""
serve-dashboard.py — Local HTML dashboard for Agentic SDLC projects.

Reads YAML frontmatter from docs/sdlc/stories/ and docs/sdlc/workspaces/
and serves a live web dashboard on http://localhost:8080

Usage: python3 scripts/serve-dashboard.py [project-root] [--port 8080]
"""

import os
import sys
import re
import json
import math
import argparse
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

# ── Model pricing (USD per 1M tokens) ────────────────────────────────────────
MODEL_PRICING = {
    "claude-sonnet":    {"input": 3.00,  "output": 15.00},
    "claude-haiku":     {"input": 0.25,  "output": 1.25},
    "claude-opus":      {"input": 15.00, "output": 75.00},
    "gpt-4o":           {"input": 5.00,  "output": 15.00},
    "gpt-4o-mini":      {"input": 0.15,  "output": 0.60},
    "gemini-1.5-pro":   {"input": 3.50,  "output": 10.50},
    "gemini-flash":     {"input": 0.075, "output": 0.30},
    "default":          {"input": 3.00,  "output": 15.00},
}

STATUS_COLORS = {
    "TO_DO":       "#6b7280",
    "IN_PROGRESS": "#3b82f6",
    "BLOCKED":     "#ef4444",
    "DONE":        "#10b981",
    "ARCHIVED":    "#9ca3af",
}

STATUS_EMOJI = {
    "TO_DO":       "📋",
    "IN_PROGRESS": "🔄",
    "BLOCKED":     "🚫",
    "DONE":        "✅",
}

def parse_yaml_frontmatter(filepath):
    """Extract YAML frontmatter fields from a markdown file."""
    data = {}
    try:
        content = Path(filepath).read_text(encoding="utf-8")
        match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
        if not match:
            return data
        for line in match.group(1).splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line:
                key, _, value = line.partition(":")
                value = value.strip().strip('"\'')
                # Parse simple lists like [STORY-001, STORY-002]
                if value.startswith("[") and value.endswith("]"):
                    inner = value[1:-1].strip()
                    value = [v.strip() for v in inner.split(",")] if inner else []
                # Parse integers
                try:
                    value = int(value)
                except (ValueError, TypeError):
                    pass
                data[key.strip()] = value
        # Also grab the title
        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        if title_match:
            data["_title"] = title_match.group(1)
    except Exception:
        pass
    return data


def estimate_cost(model, tokens_input, tokens_output):
    """Estimate USD cost for given token counts."""
    pricing = MODEL_PRICING.get("default", {"input": 3.0, "output": 15.0})
    for key, price in MODEL_PRICING.items():
        if key in (model or "").lower():
            pricing = price
            break
    cost = (tokens_input / 1_000_000) * pricing["input"] + \
           (tokens_output / 1_000_000) * pricing["output"]
    return round(cost, 4)


def collect_data(project_root):
    """Parse all story and workspace files, return structured data."""
    root = Path(project_root)
    stories = []
    workspaces = []

    stories_dir = root / "docs" / "sdlc" / "stories"
    workspaces_dir = root / "docs" / "sdlc" / "workspaces"

    if stories_dir.exists():
        for f in sorted(stories_dir.glob("STORY-*.md")):
            d = parse_yaml_frontmatter(f)
            d["_file"] = str(f.name)
            stories.append(d)

    if workspaces_dir.exists():
        for f in sorted(workspaces_dir.glob("workspace-*.md")):
            d = parse_yaml_frontmatter(f)
            d["_file"] = str(f.name)
            workspaces.append(d)

    return stories, workspaces


def compute_metrics(stories, workspaces):
    status_counts = {"TO_DO": 0, "IN_PROGRESS": 0, "BLOCKED": 0, "DONE": 0}
    blockers = []
    in_progress = []
    done_list = []

    for s in stories:
        status = s.get("status", "TO_DO")
        status_counts[status] = status_counts.get(status, 0) + 1
        if status == "BLOCKED":
            blockers.append(s)
        elif status == "IN_PROGRESS":
            in_progress.append(s)
        elif status == "DONE":
            done_list.append(s)

    total_stories = sum(status_counts.values())
    done_pct = round((status_counts["DONE"] / total_stories * 100) if total_stories > 0 else 0)

    # Token aggregation across workspaces
    total_input = sum(int(w.get("tokens_input", 0)) for w in workspaces)
    total_output = sum(int(w.get("tokens_output", 0)) for w in workspaces)
    total_hitl = sum(int(w.get("hitl_count", 0)) for w in workspaces)
    total_elapsed = sum(int(w.get("elapsed_minutes", 0)) for w in workspaces)

    model_breakdown = {}
    for w in workspaces:
        model = w.get("model", "unknown")
        if model not in model_breakdown:
            model_breakdown[model] = {"input": 0, "output": 0}
        model_breakdown[model]["input"] += int(w.get("tokens_input", 0))
        model_breakdown[model]["output"] += int(w.get("tokens_output", 0))

    model_costs = {
        m: estimate_cost(m, v["input"], v["output"])
        for m, v in model_breakdown.items()
    }
    total_cost = sum(model_costs.values())

    return {
        "status_counts": status_counts,
        "total_stories": total_stories,
        "done_pct": done_pct,
        "blockers": blockers,
        "in_progress": in_progress,
        "done_list": done_list[-5:],  # last 5
        "total_input": total_input,
        "total_output": total_output,
        "total_tokens": total_input + total_output,
        "total_hitl": total_hitl,
        "total_elapsed": total_elapsed,
        "model_breakdown": model_breakdown,
        "model_costs": model_costs,
        "total_cost": total_cost,
        "workspace_count": len(workspaces),
    }


def render_html(metrics, project_root, generated_at):
    sc = metrics["status_counts"]

    def story_rows(story_list):
        rows = []
        for s in story_list:
            sid = s.get("story_id", s.get("_file", "?"))
            title = s.get("_title", s.get("story_id", "Untitled"))
            status = s.get("status", "TO_DO")
            owner = s.get("owner", "—")
            branch = s.get("branch", "—")
            priority = s.get("priority", "medium")
            color = STATUS_COLORS.get(status, "#6b7280")
            emoji = STATUS_EMOJI.get(status, "")
            blocked_reason = s.get("blocked_reason", "")
            rows.append(f"""
            <tr>
              <td><code>{sid}</code></td>
              <td>{title}</td>
              <td><span class="badge" style="background:{color}">{emoji} {status}</span></td>
              <td>{priority}</td>
              <td>{owner}</td>
              <td><code>{branch}</code></td>
              {'<td class="blocker-reason">⚠️ ' + blocked_reason + '</td>' if blocked_reason else '<td>—</td>'}
            </tr>""")
        return "\n".join(rows) if rows else '<tr><td colspan="7" class="empty">None</td></tr>'

    def model_rows():
        rows = []
        for model, counts in metrics["model_breakdown"].items():
            cost = metrics["model_costs"].get(model, 0)
            rows.append(f"""
            <tr>
              <td>{model}</td>
              <td>{counts['input']:,}</td>
              <td>{counts['output']:,}</td>
              <td>${cost:.4f}</td>
            </tr>""")
        return "\n".join(rows) if rows else '<tr><td colspan="4" class="empty">No workspace data yet. Agents will populate this as they work.</td></tr>'

    done_pct = metrics["done_pct"]
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="30">
  <title>Agentic SDLC Dashboard — {project_root}</title>
  <style>
    :root {{
      --bg: #0f1117; --surface: #1a1d27; --border: #2a2d3a;
      --text: #e2e8f0; --muted: #94a3b8; --accent: #6366f1;
      --green: #10b981; --red: #ef4444; --blue: #3b82f6; --yellow: #f59e0b;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }}
    a {{ color: var(--accent); text-decoration: none; }}

    .header {{ background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; }}
    .header h1 {{ font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }}
    .header .meta {{ color: var(--muted); font-size: 0.8rem; }}
    .header .live {{ display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--green); }}
    .header .live::before {{ content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s ease infinite; }}
    @keyframes pulse {{ 0%, 100% {{ opacity: 1; }} 50% {{ opacity: 0.4; }} }}

    .main {{ max-width: 1400px; margin: 0 auto; padding: 2rem; display: grid; gap: 1.5rem; }}

    .grid-4 {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }}
    .grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }}
    @media (max-width: 900px) {{ .grid-4 {{ grid-template-columns: repeat(2, 1fr); }} .grid-2 {{ grid-template-columns: 1fr; }} }}

    .card {{ background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }}
    .card h2 {{ font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 1rem; }}
    .card h3 {{ font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; }}

    .stat-card {{ background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }}
    .stat-card .value {{ font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; margin-bottom: 0.25rem; }}
    .stat-card .label {{ font-size: 0.8rem; color: var(--muted); }}
    .stat-done {{ border-top: 3px solid var(--green); }}
    .stat-prog {{ border-top: 3px solid var(--blue); }}
    .stat-blocked {{ border-top: 3px solid var(--red); }}
    .stat-cost {{ border-top: 3px solid var(--yellow); }}

    .progress-wrap {{ margin-top: 0.75rem; }}
    .progress-bar {{ height: 8px; background: var(--border); border-radius: 99px; overflow: hidden; }}
    .progress-fill {{ height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--accent), var(--green)); transition: width 0.6s ease; }}
    .progress-label {{ font-size: 0.8rem; color: var(--muted); margin-top: 0.4rem; text-align: right; }}

    table {{ width: 100%; border-collapse: collapse; font-size: 0.875rem; }}
    thead th {{ text-align: left; padding: 0.6rem 0.75rem; color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }}
    tbody td {{ padding: 0.75rem; border-bottom: 1px solid var(--border); }}
    tbody tr:last-child td {{ border-bottom: none; }}
    tbody tr:hover {{ background: rgba(255,255,255,0.02); }}
    .empty {{ color: var(--muted); font-style: italic; padding: 1.5rem 0.75rem; }}
    code {{ background: rgba(255,255,255,0.06); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; }}
    .badge {{ padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.7rem; font-weight: 600; color: #fff; display: inline-flex; align-items: center; gap: 0.3rem; }}
    .blocker-reason {{ color: var(--red); font-size: 0.8rem; max-width: 250px; }}

    .token-highlight {{ background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08)); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 1.5rem; }}
    .token-highlight .tk-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem; }}
    .tk-item .tk-val {{ font-size: 1.5rem; font-weight: 700; color: var(--accent); }}
    .tk-item .tk-label {{ font-size: 0.75rem; color: var(--muted); margin-top: 0.2rem; }}

    .footer {{ text-align: center; color: var(--muted); font-size: 0.75rem; padding: 2rem; border-top: 1px solid var(--border); margin-top: 1rem; }}
  </style>
</head>
<body>

<header class="header">
  <div>
    <h1>🤖 Agentic SDLC Dashboard</h1>
    <div class="meta">Project: {project_root} &nbsp;·&nbsp; Generated: {generated_at}</div>
  </div>
  <div class="live">Auto-refreshes every 30s</div>
</header>

<main class="main">

  <!-- KPI Row -->
  <div class="grid-4">
    <div class="stat-card stat-done">
      <div class="value" style="color:var(--green)">{sc.get('DONE', 0)}</div>
      <div class="label">Stories Done</div>
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" style="width:{done_pct}%"></div></div>
        <div class="progress-label">{done_pct}% complete</div>
      </div>
    </div>
    <div class="stat-card stat-prog">
      <div class="value" style="color:var(--blue)">{sc.get('IN_PROGRESS', 0)}</div>
      <div class="label">In Progress</div>
    </div>
    <div class="stat-card stat-blocked">
      <div class="value" style="color:var(--red)">{sc.get('BLOCKED', 0)}</div>
      <div class="label">Blocked</div>
    </div>
    <div class="stat-card stat-cost">
      <div class="value" style="color:var(--yellow)">${metrics['total_cost']:.3f}</div>
      <div class="label">Est. AI Cost (USD)</div>
    </div>
  </div>

  <!-- Token Usage Highlight -->
  <div class="token-highlight">
    <h2>🤖 AI Token Usage</h2>
    <div class="tk-grid">
      <div class="tk-item"><div class="tk-val">{metrics['total_tokens']:,}</div><div class="tk-label">Total Tokens</div></div>
      <div class="tk-item"><div class="tk-val">{metrics['total_input']:,}</div><div class="tk-label">Input Tokens</div></div>
      <div class="tk-item"><div class="tk-val">{metrics['total_output']:,}</div><div class="tk-label">Output Tokens</div></div>
      <div class="tk-item"><div class="tk-val">{metrics['total_hitl']}</div><div class="tk-label">HITL Interventions</div></div>
      <div class="tk-item"><div class="tk-val">{metrics['total_elapsed']}m</div><div class="tk-label">Agent Time</div></div>
      <div class="tk-item"><div class="tk-val">{metrics['workspace_count']}</div><div class="tk-label">Workspaces</div></div>
    </div>
  </div>

  <!-- Story Tables -->
  <div class="grid-2">
    <div class="card">
      <h2>🔄 In Progress</h2>
      <table>
        <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Owner</th><th>Branch</th><th>Blocker</th></tr></thead>
        <tbody>{story_rows(metrics['in_progress'])}</tbody>
      </table>
    </div>
    <div class="card">
      <h2>🚫 Blocked</h2>
      <table>
        <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Owner</th><th>Branch</th><th>Reason</th></tr></thead>
        <tbody>{story_rows(metrics['blockers'])}</tbody>
      </table>
    </div>
  </div>

  <!-- Cost by Model -->
  <div class="card">
    <h2>💰 Cost Breakdown by Model</h2>
    <table>
      <thead><tr><th>Model</th><th>Input Tokens</th><th>Output Tokens</th><th>Est. Cost (USD)</th></tr></thead>
      <tbody>{model_rows()}</tbody>
    </table>
    <p style="margin-top:0.75rem;font-size:0.75rem;color:var(--muted)">
      Pricing based on approximate 2025 rates. Update <code>MODEL_PRICING</code> in <code>scripts/serve-dashboard.py</code> for accuracy.
    </p>
  </div>

  <!-- Recently Completed -->
  <div class="card">
    <h2>✅ Recently Completed</h2>
    <table>
      <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Owner</th><th>Branch</th><th></th></tr></thead>
      <tbody>{story_rows(list(reversed(metrics['done_list'])))}</tbody>
    </table>
  </div>

</main>

<footer class="footer">
  Agentic SDLC Framework &nbsp;·&nbsp;
  Reads from <code>docs/sdlc/stories/</code> and <code>docs/sdlc/workspaces/</code> &nbsp;·&nbsp;
  Run <code>python3 scripts/serve-dashboard.py</code> to refresh
</footer>

</body></html>"""


class DashboardHandler(BaseHTTPRequestHandler):
    project_root = "."

    def do_GET(self):
        if self.path not in ("/", "/index.html", "/favicon.ico"):
            self.send_response(404); self.end_headers(); return

        stories, workspaces = collect_data(self.project_root)
        metrics = compute_metrics(stories, workspaces)
        generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        html = render_html(metrics, self.project_root, generated_at)

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(html.encode("utf-8"))))
        self.end_headers()
        self.wfile.write(html.encode("utf-8"))

    def log_message(self, format, *args):
        pass  # Suppress default server logs


def main():
    parser = argparse.ArgumentParser(description="Agentic SDLC local dashboard")
    parser.add_argument("project_root", nargs="?", default=".", help="Path to your project root")
    parser.add_argument("--port", type=int, default=8080, help="Port to serve on (default: 8080)")
    args = parser.parse_args()

    DashboardHandler.project_root = os.path.abspath(args.project_root)
    print(f"🚀 Agentic SDLC Dashboard")
    print(f"   Project root : {DashboardHandler.project_root}")
    print(f"   Dashboard URL: http://localhost:{args.port}")
    print(f"   Auto-refresh : every 30s")
    print(f"   Press Ctrl+C to stop.\n")

    server = HTTPServer(("", args.port), DashboardHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
