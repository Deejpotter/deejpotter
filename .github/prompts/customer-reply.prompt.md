---
name: customer-reply
description: Draft a customer reply in Maker Store style with Logic then Answer sections.
argument-hint: 'name=Customer issue=Short summary context="paste key details"'
agent: support-agent
tools:
  [
    "my-mcp-server/duckduckgo_search",
    "my-mcp-server/google_search",
    "my-mcp-server/read_file",
  ]
---

# Goal

Write a concise, helpful reply to the customer in Maker Store style.

Before modifying templates or tone, read the repository README to confirm the correct workflow and conventions.

# Inputs

- Customer name: ${input:name}
- Issue summary: ${input:issue}
- Additional context: ${input:context}
- Optional: link KB articles, request $$ and $i where relevant (ioSender/GRBL cases), ask for photos/videos if hardware.

# Style

- Warm greeting + thanks.
- Include a short "Logic (why I’m asking these checks)" section to explain rationale.
- Follow with "Answer / Clear steps" (numbered, minimal friction).
- Add relevant links (Maker Hardware KB, wiring refs, post processors).
- Offer remote session if appropriate.
- Keep it short and impersonal; avoid over-explaining.

# Structure to produce

Hi ${input:name},

Thanks for getting in touch${input:context:optional}.

Logic (why I’m asking these checks)

- Summarize the likely root cause and the minimal checks to confirm.

Answer / Clear steps

1. First action.
2. Collect evidence (e.g., send `$$` + `$i` output; photos of wiring/switch positions).
3. Likely fix and safe test.

- If you prefer, I can jump on a quick remote session.

References

- Link 1 (KB)
- Link 2 (resources or downloads)

Regards,
[Your name]
Maker Store Technical Assistance

# Helpful references in this repo

- examples: docs/customer-replies/kristy_homing.md
- examples: docs/customer-replies/mark_vfd_dustshoe.md
