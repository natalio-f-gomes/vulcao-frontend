import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCompanyDashboard,
  getProductsByCompanyId,
  getUserProfileData,
  addProductToCart,
} from "../api/requests";
import { CompanyModel, ProductModel, UserProfileModel } from "../api/interfaces";
import { imageUrlFromKey } from "../components/ImageCarousel";

function BusinessPublicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<CompanyModel | null>(null);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfileModel | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setLoadError("No business specified.");
        setLoading(false);
        return;
      }
      try {
        const [companyRes, productsRes] = await Promise.all([
          getCompanyDashboard(id),
          getProductsByCompanyId(id),
        ]);

        if (!companyRes.ok) {
          setLoadError(`Could not load this business (${companyRes.status}).`);
          return;
        }
        setCompany(await companyRes.json());

        if (productsRes.ok) {
          setProducts(await productsRes.json());
        }
      } catch (err) {
        console.error("Failed to load business page:", err);
        setLoadError("Could not load this business.");
      } finally {
        setLoading(false);
      }
    };

    // The user profile is optional (anonymous visitors are fine) —
    // never let a 401 here break the page.
    const loadUser = async () => {
      try {
        const data = await getUserProfileData();
        if (data) setCurrentUser(data);
      } catch {
        /* not logged in — that's fine */
      }
    };

    loadData();
    loadUser();
  }, [id]);

  const handleAddItemToCart = async (product: ProductModel) => {
    if (!currentUser) {
      alert("Please log in to add items to your cart.");
      navigate("/user-login");
      return;
    }
    try {
      const response = await addProductToCart(product.id!, 1);
      if (response.ok) {
        alert("Product added to cart!");
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const sinceYear = company?.createdAt ? new Date(company.createdAt).getFullYear() : null;

  if (loading) {
    return (
      <div style={{ padding: "6rem", textAlign: "center", color: "var(--mid)" }}>
        Loading business…
      </div>
    );
  }

  if (loadError || !company) {
    return (
      <div style={{ padding: "6rem", textAlign: "center" }}>
        <p style={{ color: "#c0392b", marginBottom: "1.5rem" }}>
          {loadError ?? "Business not found."}
        </p>
        <button className="btn-primary-custom" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* ================= BUSINESS HEADER (dark banner) ================= */}
      <header
        style={{
          background: "var(--ink)",
          color: "var(--cream)",
          padding: "4rem 6rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* accent glow, same treatment as the hero panels */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,69,42,0.35), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "1.8rem", flexWrap: "wrap", position: "relative" }}>
          {/* initial avatar — visual identity without any logo asset */}
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              border: "2px solid var(--accent)",
              background: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.4rem",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {company.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 6,
              }}
            >
              {company.category?.replaceAll("_", " ")}
              {sinceYear && <span style={{ color: "#666" }}> · est. {sinceYear}</span>}
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 900,
                letterSpacing: "-1px",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {company.name}
            </h1>
            <div style={{ fontSize: "0.85rem", color: "#999", marginTop: 8 }}>
              <i className="bi bi-geo-alt" style={{ color: "var(--accent)", marginRight: 6 }}></i>
              {company.address?.street ? `${company.address.street}, ` : ""}
              {company.address?.city || "—"}, {company.address?.island || "—"}
            </div>
          </div>

          {/* status */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: company.status === "OPERATING" ? "rgba(45,106,79,0.2)" : "rgba(255,255,255,0.08)",
              color: company.status === "OPERATING" ? "#7fd4a8" : "#aaa",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor" }} />
            {company.status === "OPERATING" ? "Open for business" : company.status?.toLowerCase()}
          </span>
        </div>

        {/* quick stats strip */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #1e1e1e",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {[
            { label: "Products listed", value: String(products.length) },
            { label: "Based in", value: company.address?.island || "—" },
            { label: "Member since", value: sinceYear ? String(sinceYear) : "—" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#666",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ================= ABOUT + CONTACT ================= */}
      <section style={{ padding: "3.5rem 6rem", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem" }} className="business-about-grid">
        <div style={{ background: "#fff", border: "1px solid #e8e4de", padding: "2rem" }}>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 10,
            }}
          >
            About
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, marginBottom: 12 }}>
            Who we are
          </h2>
          <p style={{ fontSize: "0.92rem", color: "var(--mid)", lineHeight: 1.7, margin: 0 }}>
            {company.description || "This business hasn't written a description yet."}
          </p>
        </div>

        <div style={{ background: "var(--ink)", color: "var(--cream)", padding: "2rem", borderTop: "4px solid var(--accent)" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: 16 }}>
            Get in touch
          </h3>
          {[
            { icon: "bi-envelope-fill", label: "Email", value: company.email },
            { icon: "bi-telephone-fill", label: "Phone", value: company.phoneNumber },
            { icon: "bi-printer-fill", label: "Fax", value: company.faxNumber },
          ]
            .filter((row) => row.value)
            .map((row) => (
              <div key={row.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid #1f1c1a" }}>
                <i className={`bi ${row.icon}`} style={{ color: "var(--accent)", fontSize: "0.9rem", marginTop: 2 }}></i>
                <div>
                  <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>{row.label}</div>
                  <div style={{ fontSize: "0.88rem", wordBreak: "break-word" }}>{row.value}</div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="products-section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <h2 className="section-title">Our<br />Products</h2>
        </div>

        {products.length === 0 ? (
          <p style={{ color: "var(--mid)" }}>This business has no products listed yet.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const firstKey = product.imgS3UrlKeys?.[0];
              const inStock = product.stock > 0;
              return (
                <div className="product-card" key={product.id}>
                  <div className="product-thumb">
                    {firstKey ? (
                      <img
                        src={imageUrlFromKey(firstKey)}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <i className="bi bi-box-seam"></i>
                    )}
                    {!inStock && (
                      <span className="product-badge" style={{ background: "#888" }}>
                        Out of stock
                      </span>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.productType?.replaceAll("_", " ")}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-footer">
                      <span className="product-price">
                        {product.pricePerUnit} {product.currency} / {product.unitType}
                      </span>
                      <button
                        className="add-btn"
                        disabled={!inStock}
                        style={!inStock ? { background: "#ccc", cursor: "not-allowed" } : undefined}
                        onClick={() => handleAddItemToCart(product)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* responsive: collapse the about grid on small screens */}
      <style>{`
        @media (max-width: 991px) {
          .business-about-grid { grid-template-columns: 1fr !important; padding: 2.5rem 2rem !important; }
          header { padding: 3rem 2rem 2rem !important; }
        }
      `}</style>
    </div>
  );
}

export default BusinessPublicPage;