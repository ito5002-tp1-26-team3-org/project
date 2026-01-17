export default function RoleModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div style={backdrop} onClick={onClose} role="presentation">
      <div style={modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Log in</div>
            <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Choose your role to continue</div>
          </div>
          <button onClick={onClose} style={closeBtn} aria-label="Close">✕</button>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <button style={primaryBtn} onClick={onClose}>Council Staff</button>
          <button style={secondaryBtn} onClick={onClose}>Resident</button>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: "#777" }}>
          (Authentication will be connected later.)
        </div>
      </div>
    </div>
  );
}

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 9999,
};

const modal = {
  width: "min(520px, 100%)",
  background: "#fff",
  borderRadius: 18,
  padding: 18,
  border: "1px solid #eee",
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};

const closeBtn = {
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: 999,
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 700
};

const primaryBtn = {
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  borderRadius: 999,
  padding: "12px 14px",
  cursor: "pointer",
  fontWeight: 800
};

const secondaryBtn = {
  ...primaryBtn,
  background: "#fff",
  color: "#111",
  border: "1px solid #ddd"
};
