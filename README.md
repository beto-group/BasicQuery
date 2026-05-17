
<div align="center">
  <img src="https://raw.githubusercontent.com/beto-group/beto.assets/main/beto-logo.png" width="160" alt="BETOOS Logo">
  <h1> BASIC QUERY </h1>
  <h3> Premium Path Query Explorer & Paginated Data Table </h3>
  <p>
    <a href="https://beto.group"><img src="https://img.shields.io/badge/WEBSITE-BETO.GROUP-7A46F1?style=for-the-badge" alt="Website"></a>
    <a href="https://discord.gg/betogroup"><img src="https://img.shields.io/badge/DISCORD-JOIN%20US-7A46F1?style=for-the-badge" alt="Discord"></a>
    <a href="https://github.com/beto-group/BasicQuery"><img src="https://img.shields.io/badge/SUPPORT-GITHUB-7A46F1?style=for-the-badge" alt="Support"></a>
  </p>
  <img src="https://img.shields.io/badge/TARGET-OBSIDIAN-000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkUxNjUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48ZWxsaXBzZSBjeD0iMTIiIGN5PSI1IiByeD0iOSIgcnk9IjMiLz48cGF0aCBkPSJNIDMgNXYxNGE5IDMgMCAwIDAgMTggMHYtMTQiLz48cGF0aCBkPSJNIDMgMTJhOSAzIDAgMCAwIDE4IDAiLz48L3N2Zz4=" alt="TARGET">
  <img src="https://img.shields.io/badge/SECURITY-SANDBOXED-000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkUxNjUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMnMgOCA0LjUgOCAxMmMwIDUuNS00LjUgMTAtOCAxMEzNCAxNy41IDQgMTRDNCA2LjUgMTIgMTEyIDJ6Ii8+PC9zdmc+" alt="SECURITY">
  <img src="https://img.shields.io/badge/RUNTIME-PUREJS-000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkUxNjUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDAgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41TDE1LjUgMnoiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCIvPjxsaW5lIHgxPSIxNiIgeDI9IjgiIHkxPSIxMyIgeTI9IjEzIi8+PGxpbmUgeDE9IjE2IiB4Mj0iOCIgeTE9IjE3IiB5Mj0iMTciLz48bGluZSB4MT0iMTAiIHgyPSI4IiB5MT0iOSIgeTI9IjkiLz48L3N2Zz4=" alt="RUNTIME">
  <hr>
</div>

![Basic Query Walkthrough](https://raw.githubusercontent.com/beto-group/beto.assets/main/basicquery.clip.gif)

<div align="center">
  <p>
    <i> A foundational, high-performance folder-based note explorer and metadata manager designed natively for Obsidian. </i>
  </p>
  <hr style="width:30%;">
</div>
Welcome to **Basic Query**, a foundational, path-based vault query engine and paginated data explorer designed natively for Obsidian.

### ⚡ Blazing Fast Architecture
By utilizing Datacore's reactive cache mapping, Basic Query loads and aggregates notes across your entire vault with zero startup cost, delivering real-time filtering updates at 60fps.

---

## ✨ Features
*   📁 **Dynamic Folder-Path Discovery**: Features an active input field that updates in real-time as users type to isolate and index files in specific sub-folders.
*   ⏳ **Chronological Chronos Sorting**: Automatically sorts indexed files chronologically by Creation Time (`$ctime`) in descending order, displaying recently added notes first.
*   📊 **Integrated Grid Presentation**: Compiles Name (as dynamic links), Created Date, Modified Date, and tags into a beautiful virtualized table.
*   🔢 **Built-in Responsive Pagination**: Inherits the `<dc.VanillaTable />` virtualizer with integrated page controls to manage large-scale vaults with no rendering lag.

---

## 🚀 Quick Launch
*   **Viewer Entry Point**: [BASIC QUERY.md](BASIC%20QUERY.md)
*   **Logic Component**: [src/BasicQuery.component.jsx](src/BasicQuery.component.jsx)
*   **Engineering Standards**: [CONTRIBUTION.md](CONTRIBUTION.md)

BETO.GROUP - create factotums...
