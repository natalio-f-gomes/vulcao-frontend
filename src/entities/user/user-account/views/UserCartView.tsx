import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartProductModel } from "../user-account";
import { addProductToCart, decrementCartItemQuantity } from "../../../../api/requests";

interface Props {
  products: CartProductModel[];
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '1100px',
    margin: '2rem auto',
    padding: '0 1rem',
    boxSizing: 'border-box',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  cartContainer: {
    flex: 1,
    minWidth: 0, // lets the column shrink so children can wrap instead of overflow
    width: '100%',
  },
  cartTitle: {
    fontSize: 'clamp(1.35rem, 4vw, 1.75rem)',
    color: '#1a1a1a',
    marginBottom: '0.5rem',
  },
  cartDivider: {
    border: '0',
    height: '1px',
    backgroundColor: '#e5e7eb',
    marginBottom: '1.5rem',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  productCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.75rem, 3vw, 1.5rem)',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease, boxShadow 0.2s ease',
    boxSizing: 'border-box',
  },
  productImageWrapper: {
    width: 'clamp(72px, 20vw, 100px)',
    height: 'clamp(72px, 20vw, 100px)',
    flexShrink: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100px',
    flexGrow: 1,
    minWidth: 0, // critical: allows text to wrap inside the card instead of pushing it wider
    gap: '0.5rem',
  },
  productHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minWidth: 0,
  },
  productBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 'clamp(0.6rem, 1.6vw, 0.7rem)',
    fontWeight: 700,
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  productName: {
    fontSize: 'clamp(1rem, 2.6vw, 1.15rem)',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  productFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap', // qty/subtotal drops below the buttons on tight widths
    gap: '0.5rem',
  },
  productPrice: {
    fontSize: 'clamp(0.95rem, 2.6vw, 1.1rem)',
    fontWeight: 700,
    color: '#059669',
  },
  unitText: {
    fontSize: 'clamp(0.72rem, 1.9vw, 0.85rem)',
    fontWeight: 400,
    color: '#6b7280',
  },
  /* Action buttons */
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0, // keeps + / - locked together and aligned, never squashed
  },
  plusButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    flexShrink: 0,
    border: '1px solid #d1d5db',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '1.25rem',
    lineHeight: 1,
    padding: 0,
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  summaryText: {
    fontSize: 'clamp(0.78rem, 2vw, 0.9rem)',
    color: '#4b5563',
    fontWeight: 500,
    textAlign: 'right',
    minWidth: 0,
  },
  subtotalHighlight: {
    color: '#111827',
    fontWeight: 700,
  },
  /* ----- Order summary panel ----- */
  summaryCard: {
    flexShrink: 0,
    top: '1rem',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    boxSizing: 'border-box',
  },
  summaryTitle: {
    fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 1rem 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
    color: '#4b5563',
    margin: '0.5rem 0',
  },
  summaryTotalRow: {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    fontWeight: 700,
    color: '#111827',
  },
  checkoutButton: {
    width: '100%',
    marginTop: '1.25rem',
    padding: '0.85rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#059669',
    color: '#ffffff',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  productDescription: {
  width: '100%',
  margin: 0,
  fontSize: 'clamp(0.78rem, 2vw, 0.875rem)',
  color: '#6b7280',
  // truncate to one line; switch to the wrap version below if you'd rather wrap
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
},
};


function UserCartView({ products }: Props) {
  const navigate = useNavigate();

  // Local mirror of the cart so +/- updates instantly without waiting on the parent.
  // We seed from the prop and re-sync whenever the parent re-fetches.
  const [items, setItems] = useState<CartProductModel[]>(products);

  useEffect(() => {
    setItems(products);
  }, [products]);

  // Pure helper — applies a delta to one item's quantity in local state.
  const applyDelta = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === itemId ? { ...p, quantity: p.quantity + delta } : p
      )
    );
  };

  const incrementCartItem = async (itemId: string) => {
    applyDelta(itemId, +1); // optimistic update -> UI reflects change immediately
    try {
      const response = await addProductToCart(itemId, 1);
      if (!response.ok) {
        applyDelta(itemId, -1); // rollback
        if (response.status === 401 || response.status === 403) {
          alert("Access denied");
        } else {
          alert("There was an issue with your request");
        }
      }
    } catch (err) {
      applyDelta(itemId, -1); // rollback on network error
      console.error("Increment failed:", err);
    }
  };

  const decrementCartItem = async (itemId: string) => {
    // Guard so we never go below zero in the UI
    const current = items.find((p) => p.id === itemId);
    if (!current || current.quantity <= 0) return;

    applyDelta(itemId, -1); // optimistic
    try {
      const response = await decrementCartItemQuantity(itemId, 1);
      if (!response.ok) {
        applyDelta(itemId, +1); // rollback
        if (response.status === 401 || response.status === 403) {
          alert("Access denied");
        } else {
          alert("There was an issue with your request");
        }
      }
    } catch (err) {
      applyDelta(itemId, +1);
      console.error("Decrement failed:", err);
    }
  };

  // Track viewport width so we can stack the summary at the bottom on small screens
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isStacked = viewportWidth < 768;

  // Totals are now derived from local `items` so they update with the buttons.
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.pricePerUnit,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const visibleItems = items.filter((item) => item.quantity > 0);
  const isEmpty = visibleItems.length === 0;

  const wrapDirection: React.CSSProperties["flexDirection"] = isStacked ? "column" : "row";
  const summaryPosition: React.CSSProperties["position"] = isStacked ? "static" : "sticky";

  const pageWrapperStyle: React.CSSProperties = {
    ...styles.pageWrapper,
    flexDirection: wrapDirection,
  };

  const summaryCardStyle: React.CSSProperties = {
    ...styles.summaryCard,
    position: summaryPosition,
    width: isStacked ? "100%" : "320px",
  };

  return (
    <>
      <div style={pageWrapperStyle}>
        <div style={styles.cartContainer}>
          <h1 style={styles.cartTitle}>Cart Details</h1>
          <hr style={styles.cartDivider} />

          <div style={styles.productList}>
            {visibleItems.map((item) => (
              <div style={styles.productCard} key={item.id || item.name}>
                <div style={styles.productImageWrapper}>
                  <img alt={item.name} style={styles.productImg} />
                </div>

                <div style={styles.productDetails}>
                  <div style={styles.productHeader}>
               
                           <small style={{fontWeight:"bold"}}> Company: {item.companyName}</small>
              
                    <span style={styles.productBadge}>
                      Type: {item.productType.replaceAll("_", " ").toUpperCase()}
                    </span>
  
                    <h3 style={styles.productName}>{item.name}</h3>
                    <p style={styles.productDescription}>{item.description}</p>
                    <span style={styles.productPrice}>
                      ${item.pricePerUnit}{" "}
                      <span style={styles.unitText}>per {item.unitType}</span>
                    </span>
                  </div>

                  <div style={styles.productFooter}>
                    <div style={styles.actionGroup}>
                      <button
                        style={styles.plusButton}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#fee2e2";
                          e.currentTarget.style.borderColor = "#ef4444";
                          e.currentTarget.style.color = "#b91c1c";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.borderColor = "#d1d5db";
                          e.currentTarget.style.color = "#374151";
                        }}
                        onClick={() => decrementCartItem(item.id!)}
                      >
                        <i className="bi bi-dash"></i>
                      </button>

                      <button
                        style={styles.plusButton}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f0fdf4";
                          e.currentTarget.style.borderColor = "#22c55e";
                          e.currentTarget.style.color = "#15803d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.borderColor = "#d1d5db";
                          e.currentTarget.style.color = "#374151";
                        }}
                        onClick={() => incrementCartItem(item.id!)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <span style={styles.summaryText}>
                      Qty: {item.quantity} | Subtotal:{" "}
                      <span style={styles.subtotalHighlight}>
                        ${(item.quantity * item.pricePerUnit).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside style={summaryCardStyle}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.summaryRow}>
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <hr style={styles.cartDivider} />

          <div style={{ ...styles.summaryRow, ...styles.summaryTotalRow }}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <button
            style={{
              ...styles.checkoutButton,
              ...(isEmpty ? { backgroundColor: "#9ca3af", cursor: "not-allowed" } : {}),
            }}
            onClick={handleCheckout}
            disabled={isEmpty}
            onMouseEnter={(e) => {
              if (!isEmpty) e.currentTarget.style.backgroundColor = "#047857";
            }}
            onMouseLeave={(e) => {
              if (!isEmpty) e.currentTarget.style.backgroundColor = "#059669";
            }}
          >
            Checkout
          </button>
        </aside>
      </div>
    </>
  );
}

export default UserCartView;