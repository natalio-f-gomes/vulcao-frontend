import { useNavigate } from "react-router-dom";

interface PublicTopBarProps {
  companyName: string;
  cartCount: number;
  onCartClick: () => void;
}

export default function PublicTopBar({ companyName, cartCount, onCartClick }: PublicTopBarProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0.85rem 1.5rem",
        borderBottom: "1px solid #e8e4de",
        background: "var(--cream)",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{ background: "transparent", border: "1px solid #d8d2c8", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: "0.85rem" }}
      >
        <i className="bi bi-arrow-left" /> Home
      </button>
      <span style={{ fontWeight: 600 }}>{companyName}</span>
      <button
        onClick={onCartClick}
        style={{ marginLeft: "auto", background: "transparent", border: "1px solid #d8d2c8", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: "0.85rem", position: "relative" }}
      >
        <i className="bi bi-bag" /> Cart{cartCount > 0 ? ` (${cartCount})` : ""}
      </button>
    </div>
  );
}
