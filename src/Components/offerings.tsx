import { useEffect, useMemo, useState } from "react";
import { ProductModel, WearableModel } from "../Interfaces/offerings";
import { ProfileModel } from "../Interfaces/Authentication";
import { getUserProfileData } from "../Requests/client";
import { getAllProducts, getAllWearables } from "../Requests/offerings";
import ImageCarousel from "./imageCarousel";
import { AddToCart } from "../Requests/shopping";

/* ── 1. Unified display model ─────────────────────────────── */
interface DisplayOffering {
  id: string;
  typeKey: string; // "PRODUCT" | "WEARABLE" | future types
  name: string;
  category: string; // productType / wearableType, humanized
  price: number;
  currency: string;
  unit: string;
  stock: number;
  imgS3UrlKeys?: string[];
  details: { label: string; value: string }[]; // type-specific chips
}

const humanize = (s?: string) => (s ?? "").replaceAll("_", " ").toLowerCase();

/* ── 2. Type registry — ADD NEW OFFERING TYPES HERE ───────── */
interface OfferingTypeConfig {
  key: string;
  label: string; // tab label
  fetch: () => Promise<Response>;
  normalize: (raw: any) => DisplayOffering;
}

const OFFERING_TYPES: OfferingTypeConfig[] = [
  {
    key: "PRODUCT",
    label: "Produtos",
    fetch: getAllProducts,
    normalize: (p: ProductModel) => ({
      id: p.id!,
      typeKey: "PRODUCT",
      name: p.name,
      category: humanize(p.productType),
      price: p.price,
      currency: p.currency,
      unit: p.unit,
      stock: p.stock,
      imgS3UrlKeys: p.imgS3UrlKeys,
      details: [],
    }),
  },
  {
    key: "WEARABLE",
    label: "Vestíveis",
    fetch: getAllWearables,
    normalize: (w: WearableModel) => ({
      id: w.id!,
      typeKey: "WEARABLE",
      name: w.name,
      category: humanize(w.wearableType),
      price: w.price,
      currency: w.currency,
      unit: w.unit,
      stock: w.stock,
      imgS3UrlKeys: w.imgS3UrlKeys,
      details: [
        { label: "Marca", value: w.brand },
        { label: "Tamanho", value: w.size },
        { label: "Cor", value: w.colors },
        { label: "Material", value: w.material },
      ].filter((d) => !!d.value),
    }),
  },
  // Future: { key: "ELECTRONIC", label: "Eletrónicos", fetch: getAllElectronics, normalize: ... }
];

/* ── 3. Component ─────────────────────────────────────────── */
function GetOfferingSection() {
  const [offerings, setOfferings] = useState<DisplayOffering[]>([]);
  const [currentUser, setCurrentUser] = useState<ProfileModel | null>(null);
  const [activeType, setActiveType] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  const handleAddItemToCart = async (
    offeringId: string,
    offeringName: string,
  ) => {
    if (!currentUser) {
      alert(
        "Por favor, faça login como cliente para adicionar itens ao carrinho",
      );
      return;
    }
    try {
      const response = await AddToCart(offeringId, 1);
      if (response.ok) {
        alert(`${offeringName} adicionado ao carrinho!`);
      } else if (response.status === 403) {
        alert(
          "Por favor, faça login como cliente para adicionar itens ao carrinho",
        );
      } else if (response.status === 400 || response.status === 404) {
        alert(await response.text());
      } else {
        alert("Falha ao adicionar o item ao carrinho.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    // Each fetch is independent — one failing type must not blank the whole grid
    const results = await Promise.allSettled([
      ...OFFERING_TYPES.map((t) => t.fetch()),
      getUserProfileData(),
    ]);

    const all: DisplayOffering[] = [];
    for (let i = 0; i < OFFERING_TYPES.length; i++) {
      const r = results[i];
      if (r.status === "fulfilled" && r.value.status === 200) {
        const data = await r.value.json();
        all.push(...data.map(OFFERING_TYPES[i].normalize));
      }
    }
    setOfferings(all);

    const userResult = results[OFFERING_TYPES.length];
    if (userResult.status === "fulfilled" && userResult.value) {
      setCurrentUser(userResult.value as ProfileModel);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const visible = useMemo(
    () =>
      activeType === "ALL"
        ? offerings
        : offerings.filter((o) => o.typeKey === activeType),
    [offerings, activeType],
  );

  return (
    <section className="products-section" id="products">
      <div className="section-header">
        <h4 className="section-title">Ofertas</h4>
        {/* Filter tabs — driven by the registry */}
        <div className="offering-tabs">
          <button
            className={`offering-tab ${activeType === "ALL" ? "active" : ""}`}
            onClick={() => setActiveType("ALL")}
          >
            Todos
          </button>
          {OFFERING_TYPES.map((t) => (
            <button
              key={t.key}
              className={`offering-tab ${activeType === t.key ? "active" : ""}`}
              onClick={() => setActiveType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--mid)" }}>A carregar ofertas...</p>
      ) : visible.length === 0 ? (
        <p style={{ color: "var(--mid)" }}>Nenhuma oferta neste momento.</p>
      ) : (
        <div className="product-grid">
          {visible.map((item) => (
            <div className="product-card" key={`${item.typeKey}-${item.id}`}>
              <div className="product-thumb">
                {(item.imgS3UrlKeys?.length ?? 0) > 0 ? (
                  <div style={{ position: "absolute", inset: 0 }}>
                    <ImageCarousel
                      imageKeys={item.imgS3UrlKeys}
                      width={"100%"}
                      height={150}
                      altText={item.name}
                    />
                  </div>
                ) : (
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "2.6rem",
                      fontWeight: 900,
                      color: "var(--cream)",
                    }}
                  >
                    {item.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                {item.stock <= 0 && (
                  <span className="product-badge out">Esgotado</span>
                )}
              </div>

              <div className="product-info">
                <div className="product-category">{item.category}</div>
                <div className="product-name">{item.name}</div>

                {/* Type-specific detail chips (brand · size · color · …) */}
                {item.details.length > 0 && (
                  <div className="product-chips">
                    {item.details.map((d) => (
                      <span
                        className="product-chip"
                        key={d.label}
                        title={d.label}
                      >
                        {d.value}
                      </span>
                    ))}
                  </div>
                )}

                <div className="product-footer">
                  <span className="product-price">
                    {item.price} {item.currency}
                    <small className="product-unit">
                      {" "}
                      / {humanize(item.unit)}
                    </small>
                  </span>
                  <button
                    className="add-btn"
                    disabled={item.stock <= 0}
                    onClick={() => handleAddItemToCart(item.id, item.name)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
export default GetOfferingSection;
