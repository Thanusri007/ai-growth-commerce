---
name: API codegen quirks
description: OpenAPI-to-Zod compatibility constraints in this workspace
---

OpenAPI integer schemas currently generate `zod.int()`, which is incompatible with the workspace's installed Zod runtime. Use numeric schemas for API quantities and counts unless the Zod dependency is upgraded in lockstep.

**Why:** Codegen succeeds but the chained library typecheck fails when generated schemas call APIs unavailable in the installed Zod version.

**How to apply:** When adding integer-like API fields, confirm the generated Zod output and rerun the library typecheck immediately after codegen.