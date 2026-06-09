import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompanyModel, ProductModel, UserProfileModel } from "../../api/interfaces";
import { getProductById, removeItemFromCart } from "../../api/requests";
import { imageUrlFromKey } from "../../components/ImageCarousel";
import { CartItem } from "./publicView.types";

interface CartViewProps {
  company: CompanyModel;
  currentUser: UserProfileModel | null;
  cartItems: CartItem[];
  // Tip: If your parent component updates cartItems prop after delete, this will sync perfectly.
}

export default function CartView({ company, currentUser, cartItems }: CartViewProps) {
  const navigate = useNavigate();
  const [productList, setProductList] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // We use this to track exactly WHICH item is currently being deleted
  const [productIdToBeDeleted, setProductIdToBeDeleted] = useState<string | null>(null);

  useEffect(() => {
    const loadCartProducts = async () => {
      if (cartItems.length === 0) {
        setProductList([]);
        return;
      }
      setLoading(true);
      try {
        const responses = await Promise.all(
          cartItems.map((item) => getProductById(item.id!))
        );

        const products: ProductModel[] = [];
        for (const res of responses) {
          if (!res || !res.ok) {
            console.log("There was an issue loading one of the cart products");
            continue; 
          }
          products.push(await res.json());
        }
        setProductList(products);
      } catch (err) {
        console.error("There was an issue loading cart products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCartProducts();
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return productList.reduce((sum, product) => {
      const quantity = cartItems.find((item) => item.id === product.id)?.quantity ?? 0;
      return sum + product.pricePerUnit * quantity;
    }, 0);
  }, [productList, cartItems]);

  const quantityFor = (productId?: string) =>
    cartItems.find((ci) => ci.id === productId)?.quantity ?? 0;

  const currencySymbol = productList[0]?.currency || "";

  const removeProductFromCart = async (itemId?: string) => {
    if (itemId && company.id) {
        // Set the specific ID being deleted instead of global loading flag
        setProductIdToBeDeleted(itemId);
        try {
          const response = await removeItemFromCart(itemId, company.id);
          console.log("delete item from cart response ", response);
          
          if (!response.ok) {
            alert("There was an issue with your request");
            return;
          }
          
          if (response.status === 200) {
            alert("Product was successfully removed from the user cart");
            // Optimistically update local state so it vanishes immediately 
            setProductList(prev => prev.filter(product => product.id !== itemId));
          }
        } catch (error) {
          console.error("Failed to delete item:", error);
        } finally {
          // Clear the target delete state
          setProductIdToBeDeleted(null);
        }
    }
  };

  if (!currentUser) {
    return (
      <div style={{ padding: "3rem 2.5rem", textAlign: "center", color: "var(--mid)" }}>
        <p style={{ marginBottom: "1.25rem" }}>Sign in to see your cart for {company.name}.</p>
        <button className="btn-primary-custom" onClick={() => navigate("/user-login")}>Sign in</button>
      </div>
    );
  }

  return (
    <section style={{ padding: "2.5rem" }}>
      <style>{`
        .cart-checkout-bar {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          padding: 16px 20px;
        }
        .cart-checkout-bar .cart-total {
          font-weight: bold;
          font-size: 1.1rem;
        }
        .cart-checkout-bar .cart-checkout-btn {
          margin: 0;
          width: 100%;
        }
        @media (min-width: 992px) {
          .cart-checkout-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .cart-checkout-bar .cart-total { white-space: nowrap; }
          .cart-checkout-bar .cart-checkout-btn { width: auto; white-space: nowrap; }
        }
        .spinner-mini {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #dc3545;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="section-header"><h2 className="section-title">My Cart</h2></div>

      {loading ? (
        <p style={{ color: "var(--mid)" }}>Loading your cart…</p>
      ) : productList.length === 0 ? (
        <p style={{ color: "var(--mid)" }}>Your cart for this business is empty. Browse the products tab to add items.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e8e4de" }}>
          {productList.map((product) => {
            const isDeletingThisItem = productIdToBeDeleted === product.id;

            return (
              <div
                key={product.id}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 16, 
                  padding: "18px 20px", 
                  borderBottom: "1px solid #f0ece6",
                  opacity: isDeletingThisItem ? 0.5 : 1, // Visual cue that item is on its way out
                  transition: "opacity 0.2s"
                }}
              >
                {/* Product Image */}
                <div style={{ width: 56, height: 56, background: "#f0ece6", flexShrink: 0, overflow: "hidden" }}>
                  {product.imgS3UrlKeys?.[0] ? (
                    <img src={imageUrlFromKey(product.imgS3UrlKeys[0])} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="bi bi-box-seam" style={{ fontSize: "1.4rem", color: "#aaa", margin: 16 }} />
                  )}
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{product.name}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--mid)" }}>
                    {product.pricePerUnit} {product.currency} × {quantityFor(product.id)}
                  </div>
                </div>

                {/* Inline Delete Button / Loading Loader */}
                <div>
                  <button
                    type="button"
                    disabled={isDeletingThisItem} // Prevent double clicking
                    onClick={() => removeProductFromCart(product.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: isDeletingThisItem ? "not-allowed" : "pointer",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      transition: "background-color 0.2s",
                      minWidth: "34px",
                      minHeight: "34px"
                    }}
                    onMouseEnter={(e) => !isDeletingThisItem && (e.currentTarget.style.backgroundColor = "#fff5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    title="Remove item"
                  >
                    {isDeletingThisItem ? (
                      <div className="spinner-mini" />
                    ) : (
                      <i className="bi bi-trash" style={{ fontSize: "1.2rem" }} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Stacks on small/medium (button at the bottom), row on large */}
          <div className="cart-checkout-bar">
            <div className="cart-total">
              Total: {totalPrice.toFixed(2)} {currencySymbol}
            </div>
            <button
              className="btn-primary-custom cart-checkout-btn"
              onClick={() => navigate("/user-cart")}
            >
              Go to checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}