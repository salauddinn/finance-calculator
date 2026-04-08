#!/usr/bin/env bash
# dashboard.sh — Generate docs/sdlc/STATUS.md from story/workspace YAML frontmatter
#
# Usage: bash scripts/dashboard.sh [project-root]
#   project-root: path to your project (default: current directory)
#
# Output: docs/sdlc/STATUS.md

set -euo pipefail

TARGET="${1:-.}"
STORIES_DIR="$TARGET/docs/sdlc/stories"
WORKSPACES_DIR="$TARGET/docs/sdlc/workspaces"
OUTPUT="$TARGET/docs/sdlc/STATUS.md"

if [ ! -d "$STORIES_DIR" ]; then
  echo "Error: stories directory not found at $STORIES_DIR"
  echo "Run: bash scripts/init-context.sh [project-root] first"
  exit 1
fi

# ── Helpers ─────────────────────────────────────────────────────────────────
get_yaml_field() {
  local file="$1" field="$2" default="${3:-}"
  # Extract value from YAML frontmatter (between first --- pair)
  awk "/^---$/{found++; next} found==2{exit} found==1 && /^${field}:/{print}" "$file" \
    | sed "s/^${field}: *//" | tr -d '"' || echo "$default"
}

count_stories_with_status() {
  local status="$1" count=0
  for f in "$STORIES_DIR"/STORY-*.md 2>/dev/null; do
    [ -f "$f" ] || continue
    s=$(get_yaml_field "$f" "status")
    [ "$s" = "$status" ] && ((count++)) || true
  done
  echo "$count"
}

# ── Collect token metrics from workspaces ──────────────────────────────────
total_tokens_input=0
total_tokens_output=0
total_elapsed=0
total_hitl=0
workspace_count=0

declare -A model_tokens_in
declare -A model_tokens_out

for wf in "$WORKSPACES_DIR"/workspace-*.md 2>/dev/null; do
  [ -f "$wf" ] || continue
  ti=$(get_yaml_field "$wf" "tokens_input" "0")
  to=$(get_yaml_field "$wf" "tokens_output" "0")
  el=$(get_yaml_field "$wf" "elapsed_minutes" "0")
  hi=$(get_yaml_field "$wf" "hitl_count" "0")
  model=$(get_yaml_field "$wf" "model" "unknown")

  total_tokens_input=$((total_tokens_input + ti))
  total_tokens_output=$((total_tokens_output + to))
  total_elapsed=$((total_elapsed + el))
  total_hitl=$((total_hitl + hi))
  ((workspace_count++)) || true

  model_tokens_in[$model]=$(( ${model_tokens_in[$model]:-0} + ti ))
  model_tokens_out[$model]=$(( ${model_tokens_out[$model]:-0} + to ))
done

total_tokens=$((total_tokens_input + total_tokens_output))

# Cost estimation (per 1M tokens, approximate 2025 pricing)
estimate_cost() {
  local model="$1" ti="$2" to="$3"
  local cost_in cost_out
  case "$model" in
    *claude-sonnet*) cost_in="3"; cost_out="15" ;;
    *claude-haiku*)  cost_in="0.25"; cost_out="1.25" ;;
    *claude-opus*)   cost_in="15"; cost_out="75" ;;
    *gpt-4o*)        cost_in="5"; cost_out="15" ;;
    *gpt-4o-mini*)   cost_in="0.15"; cost_out="0.60" ;;
    *gemini-1.5-pro*) cost_in="3.50"; cost_out="10.50" ;;
    *gemini-flash*)  cost_in="0.075"; cost_out="0.30" ;;
    *)               cost_in="3"; cost_out="15" ;;  # default estimate
  esac
  # awk does floating point (bash can't)
  awk -v ti="$ti" -v to="$to" -v ci="$cost_in" -v co="$cost_out" \
    'BEGIN { printf "%.4f", (ti/1000000)*ci + (to/1000000)*co }'
}

# ── Count stories by status ────────────────────────────────────────────────
todo=$(count_stories_with_status "TO_DO")
inprog=$(count_stories_with_status "IN_PROGRESS")
blocked=$(count_stories_with_status "BLOCKED")
done_count=$(count_stories_with_status "DONE")
total_stories=$(( todo + inprog + blocked + done_count ))

# Progress bar
if [ "$total_stories" -gt 0 ]; then
  pct=$(( done_count * 100 / total_stories ))
  bar_filled=$(( pct / 5 ))
  bar_empty=$(( 20 - bar_filled ))
  bar="$(printf '█%.0s' $(seq 1 $bar_filled 2>/dev/null || true))$(printf '░%.0s' $(seq 1 $bar_empty 2>/dev/null || true))"
else
  pct=0
  bar="░░░░░░░░░░░░░░░░░░░░"
fi

# ── Write STATUS.md ────────────────────────────────────────────────────────
cat > "$OUTPUT" << STATUSMD
# 📊 Project Status Dashboard

> **Generated:** $(date '+%Y-%m-%d %H:%M %Z')
> Run \`bash scripts/dashboard.sh\` to refresh.

---

## 🎯 Sprint Progress

| Status | Count |
|--------|-------|
| ✅ Done | $done_count |
| 🔄 In Progress | $inprog |
| 🚫 Blocked | $blocked |
| 📋 To Do | $todo |
| **Total** | **$total_stories** |

**Completion:** $pct% \`$bar\`

---

## 🚦 Story Board

### 🔄 In Progress
STATUSMD

for f in "$STORIES_DIR"/STORY-*.md 2>/dev/null; do
  [ -f "$f" ] || continue
  s=$(get_yaml_field "$f" "status")
  if [ "$s" = "IN_PROGRESS" ]; then
    id=$(get_yaml_field "$f" "story_id")
    branch=$(get_yaml_field "$f" "branch")
    owner=$(get_yaml_field "$f" "owner")
    name=$(grep "^# " "$f" | head -1 | sed 's/^# //')
    echo "- **[$id]** $name — branch: \`$branch\` — $owner" >> "$OUTPUT"
  fi
done
[ ! -s <(grep "IN_PROGRESS" "$STORIES_DIR"/*.md 2>/dev/null) ] && echo "_None currently in progress._" >> "$OUTPUT" || true

cat >> "$OUTPUT" << 'STATUSMD'

### 🚫 Blocked
STATUSMD

blocked_found=false
for f in "$STORIES_DIR"/STORY-*.md 2>/dev/null; do
  [ -f "$f" ] || continue
  s=$(get_yaml_field "$f" "status")
  if [ "$s" = "BLOCKED" ]; then
    id=$(get_yaml_field "$f" "story_id")
    reason=$(get_yaml_field "$f" "blocked_reason")
    name=$(grep "^# " "$f" | head -1 | sed 's/^# //')
    echo "- **[$id]** $name" >> "$OUTPUT"
    echo "  > ⚠️ $reason" >> "$OUTPUT"
    blocked_found=true
  fi
done
$blocked_found || echo "_No blockers! 🎉_" >> "$OUTPUT"

cat >> "$OUTPUT" << STATUSMD

---

## 🤖 AI Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens Used | $(printf "%'d" $total_tokens) |
| Input Tokens | $(printf "%'d" $total_tokens_input) |
| Output Tokens | $(printf "%'d" $total_tokens_output) |
| Total HITL Interventions | $total_hitl |
| Total Agent Time | ${total_elapsed} minutes |
| Stories with Token Data | $workspace_count |

### Cost Estimates by Model

| Model | Input Tokens | Output Tokens | Est. Cost (USD) |
|-------|-------------|---------------|-----------------|
STATUSMD

for model in "${!model_tokens_in[@]}"; do
  ti=${model_tokens_in[$model]}
  to=${model_tokens_out[$model]}
  cost=$(estimate_cost "$model" "$ti" "$to")
  printf "| %s | %'d | %'d | \$%s |\n" "$model" "$ti" "$to" "$cost" >> "$OUTPUT"
done

if [ ${#model_tokens_in[@]} -eq 0 ]; then
  echo "| _No workspace data yet_ | — | — | — |" >> "$OUTPUT"
fi

total_cost=$(estimate_cost "default" "$total_tokens_input" "$total_tokens_output")
cat >> "$OUTPUT" << STATUSMD

> **Total Estimated Cost: \$$total_cost USD**
> _Pricing is approximate. Update model rates in \`scripts/dashboard.sh\` for accuracy._

---

## ✅ Recently Completed

STATUSMD

count=0
for f in "$STORIES_DIR"/STORY-*.md 2>/dev/null; do
  [ -f "$f" ] || continue
  s=$(get_yaml_field "$f" "status")
  if [ "$s" = "DONE" ] && [ "$count" -lt 5 ]; then
    id=$(get_yaml_field "$f" "story_id")
    name=$(grep "^# " "$f" | head -1 | sed 's/^# //')
    echo "- ✅ **[$id]** $name" >> "$OUTPUT"
    ((count++)) || true
  fi
done
[ "$count" -eq 0 ] && echo "_No completed stories yet._" >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "---" >> "$OUTPUT"
echo "_Dashboard generated by [Agentic SDLC Framework](https://github.com/your-org/agentic-sdlc)_" >> "$OUTPUT"

echo "✅ Dashboard written to: $OUTPUT"
