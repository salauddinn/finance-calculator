import os
import re
import yaml
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

def parse_markdown_file(filepath):
    """Extract YAML frontmatter and title from a markdown file."""
    data = {}
    try:
        content = Path(filepath).read_text(encoding="utf-8")
        # Extract YAML frontmatter
        match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
        if match:
            yaml_content = match.group(1)
            data = yaml.safe_load(yaml_content) or {}
        
        # Extract title (H1)
        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        if title_match:
            data["_title"] = title_match.group(1)
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
    return data

def estimate_cost(model, tokens_input, tokens_output):
    """Estimate USD cost for given token counts."""
    pricing = MODEL_PRICING.get("default")
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
            d = parse_markdown_file(f)
            d["_file"] = str(f.name)
            stories.append(d)

    if workspaces_dir.exists():
        for f in sorted(workspaces_dir.glob("workspace-*.md")):
            d = parse_markdown_file(f)
            d["_file"] = str(f.name)
            workspaces.append(d)

    return stories, workspaces

def collect_eval_data(project_root):
    """
    Run the static validator and (if fixtures exist) the scenario harness.
    Returns a dict ready to pass to render_evals_html().

    Both the validator and harness use the same Python modules as the CLI —
    no duplication of logic.
    """
    from .eval import validator as skill_validator
    from .eval import harness as skill_harness

    root = Path(project_root)

    # ── Static validation ────────────────────────────────────────────────────
    val_report = skill_validator.validate(root)

    # Group validation issues by skill for per-skill cards
    skills_dir = root / "skills"
    if not skills_dir.exists():
        skills_dir = root / "src" / "agentic_sdlc" / "skills"
    all_skills = sorted([d.name for d in skills_dir.iterdir() if d.is_dir()]) if skills_dir.exists() else []

    skill_issues: dict[str, list] = {s: [] for s in all_skills}
    for issue in val_report.errors + val_report.warnings:
        # Extract skill name from path like src/agentic_sdlc/skills/<name>/SKILL.md
        parts = Path(issue.path).parts
        if "skills" in parts:
            idx = list(parts).index("skills")
            if idx + 1 < len(parts):
                skill_name = parts[idx + 1]
                skill_issues.setdefault(skill_name, []).append(issue)

    # ── Scenario evals ───────────────────────────────────────────────────────
    fixtures_root = root / "fixtures"
    if not fixtures_root.exists():
        fixtures_root = Path(__file__).parent / "fixtures"
    eval_report = None
    if fixtures_root.exists():
        eval_report = skill_harness.run(root, fixtures_root)

    # Group scenario results by skill
    scenario_by_skill: dict[str, list] = {}
    if eval_report:
        for result in eval_report.results:
            scenario_by_skill.setdefault(result.skill, []).append(result)

    return {
        "val_report": val_report,
        "all_skills": all_skills,
        "skill_issues": skill_issues,
        "eval_report": eval_report,
        "scenario_by_skill": scenario_by_skill,
        "fixtures_exist": fixtures_root.exists(),
    }

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
        "done_list": done_list[-5:],
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

# ── Shared CSS + nav ─────────────────────────────────────────────────────────

_SHARED_CSS = """
  :root {
    --bg: #0f1117; --surface: #1a1d27; --border: #2a2d3a;
    --text: #e2e8f0; --muted: #94a3b8; --accent: #6366f1;
    --green: #10b981; --red: #ef4444; --blue: #3b82f6; --yellow: #f59e0b;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  .header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .header h1 { font-size: 1.25rem; font-weight: 700; }
  .meta { color: var(--muted); font-size: 0.8rem; }
  .nav { display: flex; gap: 0.5rem; }
  .nav a { padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.85rem; text-decoration: none; color: var(--muted); border: 1px solid var(--border); transition: all 0.2s; }
  .nav a:hover { color: var(--text); border-color: var(--accent); }
  .nav a.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .main { max-width: 1400px; margin: 0 auto; padding: 2rem; display: grid; gap: 1.5rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
  .card h2 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--muted); margin-bottom: 1rem; }
  .stat-card .value { font-size: 2.5rem; font-weight: 800; line-height: 1; }
  .stat-card .label { font-size: 0.8rem; color: var(--muted); }
  .progress-bar { height: 8px; background: var(--border); border-radius: 99px; overflow: hidden; margin-top: 10px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--green)); }
  table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  th { text-align: left; padding: 0.6rem; color: var(--muted); border-bottom: 1px solid var(--border); }
  td { padding: 0.75rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  code { background: rgba(255,255,255,0.06); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.8rem; }
  .badge { padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.7rem; color: #fff; display: inline-block; }
  .badge-pass { background: var(--green); }
  .badge-fail { background: var(--red); }
  .badge-warn { background: var(--yellow); }
  .token-highlight { background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.05)); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
  .tk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .tk-val { font-size: 1.5rem; font-weight: 700; color: var(--accent); }
  .tk-label { font-size: 0.75rem; color: var(--muted); }
  .skill-card { border-radius: 10px; padding: 1rem; border: 1px solid var(--border); background: var(--surface); }
  .skill-card.pass { border-left: 4px solid var(--green); }
  .skill-card.fail { border-left: 4px solid var(--red); }
  .skill-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; }
  .skill-meta { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.75rem; }
  .issue-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
  .issue-item { font-size: 0.78rem; padding: 0.5rem 0.75rem; border-radius: 6px; line-height: 1.4; }
  .issue-item.error { background: rgba(239,68,68,0.1); border-left: 3px solid var(--red); }
  .issue-item.warning { background: rgba(245,158,11,0.1); border-left: 3px solid var(--yellow); }
  .issue-item.pass { background: rgba(16,185,129,0.1); color: var(--green); }
  .scenario-row { font-size: 0.8rem; }
  .failure-detail { font-size: 0.75rem; color: var(--muted); padding: 0.4rem 0.75rem; background: rgba(239,68,68,0.06); border-radius: 4px; margin-top: 0.25rem; line-height: 1.5; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .section-header h2 { font-size: 1rem; font-weight: 700; }
  .empty { color: var(--muted); font-style: italic; text-align: center; padding: 2rem; }
"""

def _nav(active: str, project_root: str, generated_at: str) -> str:
    return f"""
<header class="header">
  <div>
    <h1>🤖 Agentic SDLC Dashboard</h1>
    <div class="meta">Project: {project_root} · {generated_at}</div>
  </div>
  <nav class="nav">
    <a href="/" class="{'active' if active == 'project' else ''}">📊 Project</a>
    <a href="/evals" class="{'active' if active == 'evals' else ''}">🧪 Skill Evals</a>
  </nav>
</header>"""


# ── Project dashboard (original page) ────────────────────────────────────────

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
        return "\n".join(rows) if rows else '<tr><td colspan="4" class="empty">No workspace data yet.</td></tr>'

    done_pct = metrics["done_pct"]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="30">
  <title>Agentic SDLC Dashboard — {project_root}</title>
  <style>{_SHARED_CSS}</style>
</head>
<body>
{_nav('project', project_root, generated_at)}
<main class="main">
  <div class="grid-4">
    <div class="card stat-card" style="border-top: 3px solid var(--green)">
      <div class="value" style="color:var(--green)">{sc.get('DONE', 0)}</div>
      <div class="label">Stories Done</div>
      <div class="progress-bar"><div class="progress-fill" style="width:{done_pct}%"></div></div>
    </div>
    <div class="card stat-card" style="border-top: 3px solid var(--blue)">
      <div class="value" style="color:var(--blue)">{sc.get('IN_PROGRESS', 0)}</div>
      <div class="label">In Progress</div>
    </div>
    <div class="card stat-card" style="border-top: 3px solid var(--red)">
      <div class="value" style="color:var(--red)">{sc.get('BLOCKED', 0)}</div>
      <div class="label">Blocked</div>
    </div>
    <div class="card stat-card" style="border-top: 3px solid var(--yellow)">
      <div class="value" style="color:var(--yellow)">${metrics['total_cost']:.3f}</div>
      <div class="label">Est. Cost (USD)</div>
    </div>
  </div>
  <div class="token-highlight">
    <h2>🤖 AI Token Usage</h2>
    <div class="tk-grid">
      <div><div class="tk-val">{metrics['total_tokens']:,}</div><div class="tk-label">Total Tokens</div></div>
      <div><div class="tk-val">{metrics['total_input']:,}</div><div class="tk-label">Input</div></div>
      <div><div class="tk-val">{metrics['total_output']:,}</div><div class="tk-label">Output</div></div>
      <div><div class="tk-val">{metrics['total_hitl']}</div><div class="tk-label">HITL</div></div>
      <div><div class="tk-val">{metrics['total_elapsed']}m</div><div class="tk-label">Time</div></div>
      <div><div class="tk-val">{metrics['workspace_count']}</div><div class="tk-label">Workspaces</div></div>
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <h2>🔄 In Progress</h2>
      <table>
        <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Owner</th></tr></thead>
        <tbody>{story_rows(metrics['in_progress'])}</tbody>
      </table>
    </div>
    <div class="card">
      <h2>🚫 Blocked</h2>
      <table>
        <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Reason</th></tr></thead>
        <tbody>{story_rows(metrics['blockers'])}</tbody>
      </table>
    </div>
  </div>
</main>
</body></html>"""


# ── Evals dashboard (new page) ────────────────────────────────────────────────

def render_evals_html(eval_data, project_root, generated_at):
    val_report = eval_data["val_report"]
    all_skills = eval_data["all_skills"]
    skill_issues = eval_data["skill_issues"]
    eval_report = eval_data["eval_report"]
    scenario_by_skill = eval_data["scenario_by_skill"]

    total_skills = len(all_skills)
    passing_skills = sum(1 for s in all_skills if not skill_issues.get(s) and all(r.ok for r in scenario_by_skill.get(s, [])))
    failing_skills = total_skills - passing_skills

    scenarios_run = eval_report.scenarios_run if eval_report else 0
    scenarios_passed = eval_report.passed if eval_report else 0
    scenarios_failed = eval_report.failed if eval_report else 0

    # ── Summary stat cards ───────────────────────────────────────────────────
    val_status_color = "var(--green)" if val_report.ok else "var(--red)"
    val_badge = "PASS" if val_report.ok else "FAIL"
    eval_status_color = "var(--green)" if (eval_report and eval_report.ok) else "var(--red)"
    eval_badge = "PASS" if (eval_report and eval_report.ok) else ("FAIL" if eval_report else "—")

    summary_cards = f"""
  <div class="grid-4">
    <div class="card stat-card" style="border-top: 3px solid {val_status_color}">
      <div class="value" style="color:{val_status_color}">{val_badge}</div>
      <div class="label">validate-skills</div>
      <div style="margin-top:0.5rem;font-size:0.78rem;color:var(--muted)">{val_report.checks_run} checks · {len(val_report.errors)} errors · {len(val_report.warnings)} warnings</div>
    </div>
    <div class="card stat-card" style="border-top: 3px solid {eval_status_color}">
      <div class="value" style="color:{eval_status_color}">{eval_badge}</div>
      <div class="label">eval-skills</div>
      <div style="margin-top:0.5rem;font-size:0.78rem;color:var(--muted)">{scenarios_run} scenarios · {scenarios_passed} passed · {scenarios_failed} failed</div>
    </div>
    <div class="card stat-card" style="border-top: 3px solid var(--green)">
      <div class="value" style="color:var(--green)">{passing_skills}</div>
      <div class="label">Skills Healthy</div>
    </div>
    <div class="card stat-card" style="border-top: 3px solid {'var(--red)' if failing_skills else 'var(--green)'}">
      <div class="value" style="color:{'var(--red)' if failing_skills else 'var(--green)'}">{failing_skills}</div>
      <div class="label">Skills With Issues</div>
    </div>
  </div>"""

    # ── Per-skill health cards ────────────────────────────────────────────────
    skill_cards_html = []
    for skill_name in all_skills:
        issues = skill_issues.get(skill_name, [])
        scenarios = scenario_by_skill.get(skill_name, [])
        failed_scenarios = [r for r in scenarios if not r.ok]
        has_issues = bool(issues) or bool(failed_scenarios)
        card_class = "fail" if has_issues else "pass"
        status_badge = f'<span class="badge badge-fail">FAIL</span>' if has_issues else f'<span class="badge badge-pass">PASS</span>'

        scenario_count = len(scenarios)
        scenario_pass = sum(1 for r in scenarios if r.ok)
        scenario_info = f"{scenario_pass}/{scenario_count} scenarios" if scenario_count else "no fixtures"

        issues_html = ""
        if issues:
            items = "".join(
                f'<li class="issue-item error"><strong>[{i.rule_id}]</strong>'
                f'{f" line {i.line}" if i.line else ""} — {i.message}</li>'
                for i in issues[:5]
            )
            if len(issues) > 5:
                items += f'<li class="issue-item error">…and {len(issues) - 5} more</li>'
            issues_html = f'<ul class="issue-list">{items}</ul>'
        else:
            issues_html = '<p class="issue-item pass">✓ All validation checks pass</p>'

        # Scenario failures for this skill
        scenario_html = ""
        if failed_scenarios:
            rows = ""
            for r in failed_scenarios:
                failure_items = "".join(f"<div class='failure-detail'>• {f}</div>" for f in r.failures)
                rows += f"""
                <tr class="scenario-row">
                  <td><code>{r.scenario_id}</code></td>
                  <td><span class="badge badge-fail">FAIL</span></td>
                  <td>{failure_items}</td>
                </tr>"""
            scenario_html = f"""
            <table style="margin-top:0.75rem">
              <thead><tr><th>Scenario</th><th>Result</th><th>Failures</th></tr></thead>
              <tbody>{rows}</tbody>
            </table>"""

        skill_cards_html.append(f"""
    <div class="skill-card {card_class}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.25rem">
        <div class="skill-name">{skill_name}</div>
        {status_badge}
      </div>
      <div class="skill-meta">{scenario_info}</div>
      {issues_html}
      {scenario_html}
    </div>""")

    skills_grid = f'<div class="grid-3">{"".join(skill_cards_html)}</div>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="30">
  <title>Skill Evals — Agentic SDLC Dashboard</title>
  <style>{_SHARED_CSS}</style>
</head>
<body>
{_nav('evals', project_root, generated_at)}
<main class="main">
  {summary_cards}
  <div>
    <div class="section-header">
      <h2>🔬 Skill Health — {total_skills} skills</h2>
      <span style="font-size:0.8rem;color:var(--muted)">Static validation + scenario evals per skill</span>
    </div>
    {skills_grid}
  </div>
</main>
</body></html>"""


# ── HTTP handler ─────────────────────────────────────────────────────────────

class DashboardHandler(BaseHTTPRequestHandler):
    project_root = "."

    def log_message(self, format, *args):
        pass  # suppress noisy request logs

    def do_GET(self):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if self.path in ("/", "/index.html"):
            stories, workspaces = collect_data(self.project_root)
            metrics = compute_metrics(stories, workspaces)
            html = render_html(metrics, self.project_root, now)

        elif self.path in ("/evals", "/evals/"):
            eval_data = collect_eval_data(self.project_root)
            html = render_evals_html(eval_data, self.project_root, now)

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not found")
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(html.encode("utf-8"))


def serve(project_root, port):
    DashboardHandler.project_root = os.path.abspath(project_root)
    server = HTTPServer(("", port), DashboardHandler)
    print(f"🚀 Dashboard running at http://localhost:{port}")
    print(f"   Project:  http://localhost:{port}/")
    print(f"   Evals:    http://localhost:{port}/evals")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
