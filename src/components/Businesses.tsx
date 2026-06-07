import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCompanies } from "../api/requests";
import { CompanyModel } from "../api/interfaces";

function GetBusinessesSection() {
  const [companies, setCompanies] = useState<CompanyModel[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const response = await getAllCompanies();
      if (!response.ok) {
        setLoadError(`Could not load businesses (${response.status})`);
        return;
      }
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to load businesses:", err);
      setLoadError("Could not load businesses.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // "Since 2023" from createdAt
  const sinceYear = (dateStr?: string) =>
    dateStr ? new Date(dateStr).getFullYear() : null;

  return (
    <section className="products-section" id="businesses">
      <div className="section-header">
        <h2 className="section-title">Businesses</h2>
        <a href="#" className="section-link">View all →</a>
      </div>

      {loadError && (
        <p style={{ color: "#c0392b", marginBottom: "2rem" }}>{loadError}</p>
      )}

      <div className="product-grid">
        {companies.map((company) => (
          <div
            className="product-card"
            key={company.id}
            onClick={() => navigate(`/business/${company.id}`)}
          >
            {/* ---- banner: initial + status ---- */}
            <div className="product-thumb" style={{ height: 150, background: "var(--ink)" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.6rem",
                  fontWeight: 900,
                  color: "var(--cream)",
                }}
              >
                {company.name?.charAt(0).toUpperCase()}
              </span>
              {company.status === "OPERATING" ? (
                <span className="product-badge" style={{ background: "#2d6a4f" }}>
                  Open
                </span>
              ) : (
                <span className="product-badge" style={{ background: "#888" }}>
                  {company.status?.toLowerCase()}
                </span>
              )}
            </div>

            <div className="product-info">
              {/* category + since */}
              <div className="product-category">
                {company.category?.replaceAll("_", " ")}
                {sinceYear(company.createdAt) && (
                  <span style={{ color: "#bbb" }}> · since {sinceYear(company.createdAt)}</span>
                )}
              </div>

              <div className="product-name">{company.name}</div>

              {/* short description */}
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--mid)",
                  lineHeight: 1.55,
                  margin: "0 0 0.9rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {company.description || "No description provided."}
              </p>

              {/* location + contact strip */}
              <div
                style={{
                  fontSize: "0.76rem",
                  color: "var(--mid)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginBottom: "0.9rem",
                }}
              >
                <span>
                  <i className="bi bi-geo-alt" style={{ color: "var(--accent)", marginRight: 6 }}></i>
                  {company.address?.city || "—"}, {company.address?.island || "—"}
                </span>
                <span>
                  <i className="bi bi-telephone" style={{ color: "var(--accent)", marginRight: 6 }}></i>
                  {  `+1 ${company.phoneNumber}` || "—"}
                </span>
              </div>

              {/* footer: visit button */}
              <div className="product-footer">
                <span style={{ fontSize: "0.72rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  @{company.creatorUsername}
                </span>
                <button
                  className="add-btn"
                  style={{ width: "auto", padding: "0 12px", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                  onClick={(e) => {
                    e.stopPropagation(); // don't double-trigger the card click
                    navigate(`/business/public/${company.id}`);
                  }}
                >
                  Visit <i className="bi bi-arrow-right" style={{ marginLeft: 4 }}></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {companies.length === 0 && !loadError && (
          <p style={{ color: "var(--mid)", gridColumn: "1 / -1" }}>
            No businesses registered yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default GetBusinessesSection;