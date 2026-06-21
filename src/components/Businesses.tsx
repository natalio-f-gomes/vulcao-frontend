import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCompanies } from "../api/requests";
import { CompanyModel } from "../api/interfaces";
import ImageCarousel from "./ImageCarousel";

function GetBusinessesSection() {
  const [companies, setCompanies] = useState<CompanyModel[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const response = await getAllCompanies();
      if (!response.ok) {
        setLoadError(`Não foi possível carregar as empresas (${response.status})`);
        return;
      }
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
      setLoadError("Não foi possível carregar as empresas.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // "Desde 2023" a partir do createdAt
  const sinceYear = (dateStr?: string) =>
    dateStr ? new Date(dateStr).getFullYear() : null;

  return (
    <section className="products-section" id="businesses">
      <div className="section-header">
        <h2 className="section-title">Empresas</h2>
        {/* <a href="#" className="section-link">Ver todas →</a> */}
      </div>

      {loadError && (
        <p style={{ color: "#c0392b", marginBottom: "2rem" }}>{loadError}</p>
      )}

      <div className="product-grid">
        {companies.map((company) => (
          <div
            className="product-card"
            key={company.id}
            onClick={() => navigate(`/business/public/${company.id}`)}
          >

            {/* ---- banner: carrossel de imagens (ou inicial), distintivo de estado no topo ---- */}
            <div className="product-thumb" style={{ height: 150, background: "var(--ink)", position: "relative" }}>

              {(company.imgS3UrlKeys?.length ?? 0) > 0 ? (
                /* preencher toda a miniatura com o carrossel */
                <div style={{ position: "absolute", inset: 0 }}>
                  <ImageCarousel
                    imageKeys={company.imgS3UrlKeys}
                    width={"100%"}
                    height={150}
                    altText={company.name}
                  />
                </div>
              ) : (
                /* fallback: a inicial Playfair, como antes */
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
              )}

              {/* distintivo ÚLTIMO no DOM + zIndex para ficar sempre acima da imagem */}
              {company.status === "OPERATING" ? (
                <span className="product-badge" style={{ background: "#2d6a4f", zIndex: 2 }}>
                  Aberto
                </span>
              ) : (
                <span className="product-badge" style={{ background: "#888", zIndex: 2 }}>
                  {company.status?.toLowerCase()}
                </span>
              )}
            </div>

            <div className="product-info">
              {/* categoria + desde */}
              <div className="product-category">
                {company.category?.replaceAll("_", " ")}
                {sinceYear(company.createdAt) && (
                  <span style={{ color: "#bbb" }}> · desde {sinceYear(company.createdAt)}</span>
                )}
              </div>

              <div className="product-name">{company.name}</div>

              {/* descrição curta */}
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
                {company.description || "Nenhuma descrição fornecida."}
              </p>

              {/* localização + contacto */}
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
                  {`+238 ${company.phoneNumber}` || "—"}
                </span>
              </div>

              {/* rodapé: botão visitar */}
              <div className="product-footer">
                {/* <span style={{ fontSize: "0.72rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  @{company.creatorId}
                </span> */}
                <button
                  className="add-btn"
                  style={{ width: "auto", padding: "0 12px", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                  onClick={(e) => {
                    e.stopPropagation(); // evitar acionar duplo clique no cartão
                    navigate(`/business/public/${company.id}`);
                  }}
                >
                  Visitar <i className="bi bi-arrow-right" style={{ marginLeft: 4 }}></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {companies.length === 0 && !loadError && (
          <p style={{ color: "var(--mid)", gridColumn: "1 / -1" }}>
            Nenhuma empresa registada ainda.
          </p>
        )}
      </div>
    </section>
  );
}

export default GetBusinessesSection;