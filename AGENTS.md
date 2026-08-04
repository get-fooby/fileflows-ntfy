# Development guidance

- This is a FileFlows JavaScript integration for ntfy.
- Maintain compatibility with the FileFlows Jint JavaScript parser.
- Prefer conservative JavaScript syntax; avoid optional chaining, arrow functions, and class syntax.
- Keep global settings in FileFlows `Ntfy.*` variables.
- Preserve local flow-node overrides and system-event prefixes.
- Run JavaScript syntax checks after changes.
- Do not publish live ntfy messages without explicit approval.