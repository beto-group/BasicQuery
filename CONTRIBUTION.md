# 🤝 Contributing to Basic Query: Engineering & Architectural Standards

Welcome to the **Basic Query** contributor guide. This component serves as a path-based note query table that filters and displays vault files by directory path.

To maintain the architectural integrity, performance, and clean aesthetics of this ecosystem, all contributions must strictly adhere to the following standards.

---

## 1. Core Architectural Pillars

### ⚡ Performance: Zero-Lag Path Aggregation
Never block the main rendering thread when aggregating or searching paths.
*   Keep the React render loop lightweight and free of heavy synchronous folder scanning.
*   Rely on Datacore's reactive cache engine for fast lookup matching.

### 🧩 Sterile Zero-Dependency Architecture
*   Do **not** import or depend on heavy third-party npm packages.
*   Rely strictly on native React/Preact hooks and Obsidian Core API adapters (e.g. `<dc.VanillaTable />`).

### 🛡️ Sandboxed Styling (Anti-Bleed Protocol)
*   Ensure all CSS layout changes are strictly scoped within component style declarations.
*   Never bleed general HTML element selectors or global styles into the native Obsidian workspace.

---

## 2. Development Workflow

### A. Local Compiling & Rebuilding
To make updates and verify correctness:
1. Make your modifications in the `src/` directory.
2. The custom compilation bundler inside the Obsidian workspace will pick up code changes instantly.

---

*Thank you for helping us build a clean, functional database workspace!*
*Beto Group LLC | Institutional Engineering Division*
