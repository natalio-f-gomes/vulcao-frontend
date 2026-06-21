import { useState } from "react";
import {
  CompanyModel,
  ProductModel,
  UserProfileModel,
  WearableModel,
} from "../../api/interfaces";
import { useNavigate } from "react-router-dom";
import { addProductToCart, addWearableToCart } from "../../api/requests";
import { imageUrlFromKey } from "../../components/ImageCarousel";
import ViewProductModal from "../../entities/company/modals/products/ViewProductModal";
import ViewWearableModal from "../../entities/company/modals/wearables/ViewWearableModal";

interface Props {
  wearables: WearableModel[];
  user: UserProfileModel | null;
  company: CompanyModel | null;
  onLoadCart: () => void;
}

type WearableQuantities = Record<string, number>;

export default function WearableView({
  wearables,
  user,
  company,
  onLoadCart,
}: Props) {
  // Initialize state as an empty object targeting product IDs
  const [quantities, setQuantities] = useState<WearableQuantities>({});
  const [wearableToView, setWearableToView] = useState<WearableModel | null>(
    null,
  );
  const navigate = useNavigate();

  const minOfferingQuantity = 1;
  const maxOfferingQuantity = 10;
  const numberRange: number[] = [];
  for (let i = minOfferingQuantity; i <= maxOfferingQuantity; i++) {
    numberRange.push(i);
  }

  const handleAddItemToCart = async (item: WearableModel) => {
    if (!user) {
      alert("Por favor, inicie sessão para adicionar itens ao seu carrinho.");
      navigate("/user-login");
      return;
    }
    if (!company || !company.id) {
      alert("Não existe nenhuma empresa com este ID.");
      navigate("/");
      return;
    }
    if (!item.id) return;

    const selectedQuantity = quantities[item.id] || 1;

    try {
      if (!user.username) {
        alert(
          "Falha ao adicionar item ao carrinho. Por favor, inicie sessão como utilizador.",
        );
        return;
      }
      const response = await addWearableToCart(
        item.id,
        selectedQuantity,
        company.id,
      );
      console.log("RESPOSTA AO ADICIONAR ITEM AO CARRINHO: ", response);
      if (response.ok) {
        alert("Produto adicionado ao carrinho!");
        onLoadCart();
      } else if (response.status === 403) {
        alert(
          "Por favor, inicie sessão como utilizador para poder adicionar ao carrinho.",
        );
      } else {
        alert("Falha ao adicionar item ao carrinho.");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  return (
    <>
      <section className="products-section" style={{ padding: "2.5rem" }}>
        <div className="section-header">
          <h2 className="section-title">Os Nossos Vestíveis</h2>
        </div>

        {wearables.length === 0 ? (
          <p style={{ color: "var(--mid)" }}>
            Esta empresa ainda não tem Vestíveis listados.
          </p>
        ) : (
          <div className="product-grid">
            {wearables.map((item) => {
              const s3ImgKey = item.imgS3UrlKeys?.[0];
              const inStock = item.stock > 0;
              // Obter a quantidade atual para este produto específico ou definir como 1
              const currentQuantity = item.id ? quantities[item.id] || 1 : 1;

              return (
                <div className="product-card" key={item.id}>
                  <div className="product-thumb">
                    {s3ImgKey ? (
                      <img
                        src={imageUrlFromKey(s3ImgKey)}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <i className="bi bi-box-seam"></i>
                    )}
                    {!inStock && (
                      <span
                        className="product-badge"
                        style={{ background: "#888" }}
                      >
                        Esgotado
                      </span>
                    )}
                  </div>

                  <div className="product-info">
                    <div className="product-name">{item.name}</div>

                    <div
                      className="product-footer"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <span className="product-price">
                        ${item.price} {item.currency}
                      </span>

                      <div
                        className="product-actions"
                        style={{
                          display: "flex",
                          alignItems: "stretch",
                          gap: "3px",
                          width: "100%",
                          flexWrap: "nowrap",
                        }}
                      >
                        <select
                          value={currentQuantity}
                          onChange={(e) => {
                            if (item.id) {
                              handleQuantityChange(
                                item.id,
                                Number(e.target.value),
                              );
                            }
                          }}
                          disabled={!inStock}
                          aria-label="Quantidade"
                          style={{
                            padding: "0.3rem 0.4rem",
                            borderRadius: 6,
                            border: "1px solid #d8d2c8",
                            background: "#fff",
                            flexShrink: 0,
                            marginLeft: "-5px",
                          }}
                        >
                          {numberRange.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>

                        <button
                          className="btn-primary-custom"
                          disabled={!inStock}
                          style={{
                            whiteSpace: "nowrap",
                            flexGrow: 2,
                            padding: "0.4rem 0.6rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            fontSize: "0.9rem",
                            cursor: !inStock ? "not-allowed" : "pointer",
                            background: !inStock ? "#ccc" : undefined,
                          }}
                          onClick={() => handleAddItemToCart(item)}
                        >
                          <i className="bi bi-bag-plus" /> Adicionar
                        </button>

                        <button
                          className="btn-primary-custom"
                          style={{
                            whiteSpace: "nowrap",
                            flexGrow: 1,
                            padding: "0.4rem 0.6rem",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                          }}
                          onClick={() => setWearableToView(item)}
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {wearableToView && (
        <ViewWearableModal
          isOpen={wearableToView !== null}
          wearableToView={wearableToView}
          onClose={() => setWearableToView(null)}
          companyName={company?.name!}
        />
      )}
    </>
  );
}
