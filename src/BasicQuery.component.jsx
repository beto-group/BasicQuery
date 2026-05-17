// Basic Query - Premium Responsive Component
// Version: 1.0.1

const COLUMNS = [
  { id: "Name", value: "$link" },
  { id: "Created", value: "$ctime" },
  { id: "Modified", value: "$mtime" },
  { id: "Tags", value: "tags" }
];

const POLISHED_COLUMNS = COLUMNS.map(col => ({
  ...col,
  value: page => page.value(col.value)
}));

function View() {
  const { useState } = dc;
  const [path, setPath] = useState("_OPERATION");
  const pages = dc.useQuery(`@page and path("${path}")`);

  const sortedPages = [...pages].sort((a, b) => {
    return new Date(b.value("$ctime")) - new Date(a.value("$ctime"));
  });

  return (
    <div style={{
      padding: "24px",
      background: "rgba(122, 70, 241, 0.02)",
      border: "1px solid rgba(122, 70, 241, 0.15)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(122, 70, 241, 0.04)",
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: "var(--text-normal)",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      {/* Header Panel */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #7A46F1, #9F75FF)",
          borderRadius: "10px",
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(122, 70, 241, 0.3)"
        }}>
          <dc.Icon icon="folder" style={{ width: "18px", height: "18px", color: "#FFF" }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-normal)", lineHeight: 1.2 }}>Path Query Explorer</h3>
          <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.5px" }}>BETO.GROUP STANDALONE MODULE</p>
        </div>
      </div>

      {/* Input Field Wrapper */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input 
          value={path} 
          onChange={e => setPath(e.target.value)} 
          placeholder="Enter folder path (e.g. _OPERATION)..." 
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "14px",
            background: "var(--background-primary)",
            border: "1px solid rgba(122, 70, 241, 0.3)",
            borderRadius: "10px",
            color: "var(--text-normal)",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#7A46F1";
            e.target.style.boxShadow = "0 0 0 3px rgba(122, 70, 241, 0.25)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(122, 70, 241, 0.3)";
            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
          }}
        />
      </div>

      {/* Results Header Stats */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid var(--background-modifier-border)",
        paddingBottom: "8px",
        marginBottom: "16px"
      }}>
        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--text-muted)" }}>
          Active Path: <span style={{ color: "#7A46F1" }}>"{path || "/"}"</span>
        </h4>
        <span style={{
          fontSize: "11px",
          background: "rgba(122, 70, 241, 0.1)",
          color: "#7A46F1",
          padding: "2px 8px",
          borderRadius: "12px",
          fontWeight: 600
        }}>
          {sortedPages.length} files
        </span>
      </div>

      {/* Renders dynamic paginated VanillaTable with clean container */}
      <div style={{
        background: "var(--background-primary)",
        border: "1px solid var(--background-modifier-border)",
        borderRadius: "12px",
        padding: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)"
      }}>
        <dc.VanillaTable
          columns={POLISHED_COLUMNS}
          rows={sortedPages}
          paging={true}
        />
      </div>
    </div>
  );
}

return { View };
