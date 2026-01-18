---
name: updateDocsWorkflow
description: Plan and update repo docs, agents, prompts consistently with official references.
argument-hint: 'scope=all|agents|prompts|readme notes="constraints or references"'
---

Goal

Generalize and execute a repeatable workflow to bring repository documentation into alignment across agents, prompts, and READMEs with minimal, safe edits and authoritative references.

Instructions

- Think and act in the following order. Produce a brief plan before edits, then apply focused patches, and summarize.

Codebase checklist (#codebase)

1. Read the README first to understand the correct workflow.
2. Use Context7 to find exact documentation before making changes.
3. Also, use my-mcp-server's google and duckduckgo search tools to find official documentation references or search online for information for things that don't have documentation.
4. Keep the current code and comments where possible or add your own detailed comments from the repo owner's point of view to explain the purpose of the code.
5. Prioritize updating and improving files over creating new ones. Update current files instead of making new ones and copying them over.
6. Maintain `.github/TODOs.md` with status buckets (Todo, In Progress, Completed). Keep the last 10 Completed tasks for reference; delete older ones.
7. First consider how to find the best actions. Then make a detailed plan. Refer back to it regularly and follow it to completion.

8. Read README first

- Skim the repository README to understand the correct workflow, tooling, and conventions.
- Note any required environment variables for tools that will be documented.

2. Inventory current documentation

- List relevant files and locations you will update:
  - Agents: .github/agents/\*.md
  - Prompts: .github/prompts/\*.prompt.md and any MCP-registered prompts in src/prompts
  - Instructions: .github/instructions/\*.md
  - Top-level README and other READMEs under docs/
- Identify gaps, redundancies, or inconsistencies (e.g., tools mentioned but not documented, env keys missing, outdated structure examples).

3. Research authoritative references

- Use Context7 first to fetch exact documentation for MCP concepts (prompts, tools, resources) and any libraries mentioned.
- Use web search (DuckDuckGo/Google) to find official documentation for APIs and services when missing.
- Prefer official sources; avoid blogs unless necessary.

4. Draft changes and plan

- Prefer updating existing files over creating new ones; only create new files when necessary for clarity.
- Keep existing code and comments; add concise, purpose-driven comments from the repo owner’s point of view.
- Maintain or create `.github/TODOs.md` with statuses to reflect planned documentation improvements and next steps (keep last 10 Completed).

5. Apply minimal, safe edits

- Keep changes scoped with a low blast radius. Avoid speculative rewrites.
- Update agents so they: (a) read README first, (b) use Context7-docs-first + web search, (c) prefer updating files, and (d) maintain a TODO list.
- Update prompts with README-first reminders when appropriate.
- Update README to include: new tools, environment variables, and where agent/prompt files live.

6. Validate

- Check links and references for correctness (official sources where possible).
- Ensure project structure in README matches the actual tree.
- Confirm environment variable documentation reflects current tools.

7. Summarize

- Output: the plan, applied patches (diff or bullet summary), and a short validation checklist with any TODO follow-ups.

Constraints and decision rules

- Minimal changes first; avoid breaking behavior.
- Do not introduce new dependencies without clear justification.
- Preserve user-provided wording where files indicate it must be kept verbatim.
- Prefer stderr-only logging notes in MCP server contexts; avoid console.log guidance.

Useful tools (if available)

- list_files, read_file, write_file, git_command
- duckduckgo_search, google_search
- resolve_library_id, get_documentation (Context7)

Expected outputs

- A short plan
- Focused patches to existing files (or justification for any new files)
- A brief summary of changes and validation notes
