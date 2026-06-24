import { useEffect, useMemo, useState } from "react";
import {
  CompanyModel,
  OrderItemModel,
  OrderModel,
  StaffModel,
  UserProfileModel,
} from "../../../api/interfaces";
import {
  getOrderItemById,
  getUserById,
  updateOrderStatus,
} from "../../../api/requests";
import { OrderStatus } from "../../../api/categories";
import { orderStatusTranslations } from "../../../ public/PublicBusinessesPage/OrdersView";

interface OrderProps {
  orders: OrderModel[];
  employer?: UserProfileModel | null;
  staff?: StaffModel | null;
  company: CompanyModel | null;
}
const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SENT",
  "RECEIVED",
  "COMPLETED",
  "CANCELLED",
];
function CompanyOrderView({ orders, employer, company, staff }: OrderProps) {
  // orderId -> locally updated status (overrides what came from props)
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, OrderStatus>
  >({});
  // which order's status is currently being saved
  const [savingStatusOrderId, setSavingStatusOrderId] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState<boolean>(false);
  // orderId -> resolved order items for that order
  const [orderItemsMap, setOrderItemsMap] = useState<
    Record<string, OrderItemModel[]>
  >({});
  // userId -> resolved user profile (the customer who placed the order)
  const [usersMap, setUsersMap] = useState<
    Record<string, UserProfileModel | null>
  >({});
  // Single source of truth for this company's orders:
  // prefer the orders prop, fall back to the list embedded in the company model.
  const orderList: OrderModel[] = useMemo(() => {
    const source =
      orders && orders.length > 0 ? orders : (company?.orderList ?? []);
    // newest first
    return [...source].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    );
  }, [orders, company]);

  useEffect(() => {
    if (orderList.length === 0) {
      setOrderItemsMap({});
      setUsersMap({});
      return;
    }

    // Resolves one order's items. OrderItemModel is a purchase-time
    // snapshot (name, quantity, priceAtPurchase), so one fetch per
    // item is enough — no product lookups needed.
    const loadItemsForOrder = async (
      order: OrderModel,
    ): Promise<OrderItemModel[]> => {
      const responses = await Promise.all(
        (order.cartItems ?? [])
          .filter((item) => item?.id)
          .map((item) => getOrderItemById(item.id!)),
      );

      const orderItems: OrderItemModel[] = [];
      for (const res of responses) {
        if (!res || !res.ok) {
          console.log("There was an issue loading one of the order items");
          continue;
        }
        const data = await res.json().catch(() => null);
        if (!data) {
          console.log("Order item response was empty, skipping");
          continue;
        }
        orderItems.push(data);
      }
      return orderItems;
    };

    // Resolves each distinct customer once, even if they placed several orders.
    const loadUsers = async (): Promise<
      Record<string, UserProfileModel | null>
    > => {
      const uniqueIds = Array.from(
        new Set(orderList.map((o) => o.userId).filter(Boolean)),
      ) as string[];

      const entries = await Promise.all(
        uniqueIds.map(async (userId) => {
          try {
            const res = await getUserById(userId);
            if (!res || !res.ok) return [userId, null] as const;
            const data = await res.json().catch(() => null);
            return [userId, data] as const;
          } catch {
            return [userId, null] as const;
          }
        }),
      );
      return Object.fromEntries(entries);
    };
    const loadAll = async () => {
      setLoading(true);
      try {
        const [users, itemResults] = await Promise.all([
          loadUsers(),
          Promise.all(
            orderList.map(async (order) => ({
              orderId: order.id!,
              items: await loadItemsForOrder(order),
            })),
          ),
        ]);

        const itemsMap: Record<string, OrderItemModel[]> = {};
        for (const { orderId, items } of itemResults) {
          itemsMap[orderId] = items;
        }

        setUsersMap(users);
        setOrderItemsMap(itemsMap);
      } catch (err) {
        console.error("There was an issue loading the order details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [orderList]);

  // Per-order aggregates derived from its order items
  const getItemCount = (items: OrderItemModel[]): number =>
    items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  const getOrderTotal = (
    order: OrderModel,
    items: OrderItemModel[],
  ): number => {
    const computed = items.reduce(
      (sum, item) => sum + (item.quantity ?? 1) * (item.priceAtPurchase ?? 0),
      0,
    );
    return computed > 0 ? computed : (order.totalCost ?? 0);
  };

  const formatDate = (iso?: string): string =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";

  if (!employer && !staff) {
    return <div>Loading...</div>;
  }

  const companyName = company?.name ?? "Business";

  const handleStatusChange = async (
    order: OrderModel,
    newStatus: OrderStatus,
  ) => {
    if (!order.id || newStatus === currentStatus(order)) return;

    const previous = currentStatus(order);
    // Optimistic update — UI flips immediately
    setStatusOverrides((prev) => ({ ...prev, [order.id!]: newStatus }));
    setSavingStatusOrderId(order.id);

    try {
      const res = await updateOrderStatus(order.id, newStatus);
      if (!res || !res.ok) {
        // Roll back on failure
        setStatusOverrides((prev) => ({ ...prev, [order.id!]: previous }));
        alert("Could not update the order status. Please try again.");
      }
      if (res.status === 200) {
        alert(
          "STATUS DO PEDIDO ATUALIZADO COM SUCESSO. Enviamos uma notificação para o e-mail de ambas as partes.",
        );
      }
    } catch (err) {
      setStatusOverrides((prev) => ({ ...prev, [order.id!]: previous }));
      console.error("Failed to update order status:", err);
    } finally {
      setSavingStatusOrderId(null);
    }
  };

  // The status to display: local override wins over what the server sent
  const currentStatus = (order: OrderModel): OrderStatus =>
    statusOverrides[order.id!] ?? order.status;

  return (
    <div style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: mobileResponsiveMediaQuery }} />

      {/* Cabeçalho da página — sobrancelha do perfil + título Playfair */}
      <div style={styles.pageHeader}>
        <div style={styles.pageEyebrow}>
          <span style={styles.eyebrowLine} />
          Histórico de Encomendas
        </div>
        <h1 style={styles.pageTitle}>Encomendas {companyName}</h1>
        {orderList.length > 0 && (
          <p style={styles.pageSubtitle}>
            {orderList.length} encomenda{orderList.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {orderList.length === 0 ? (
        <div style={styles.emptyState}>
          {companyName} ainda não recebeu nenhuma encomenda.
        </div>
      ) : (
        orderList.map((order: OrderModel, orderIdx: number) => {
          const orderItems = orderItemsMap[order.id!] ?? [];
          const customer = order.userId
            ? (usersMap[order.userId] ?? null)
            : null;

          return (
            // Cada encomenda é o seu próprio bloco independente,
            // separado por uma barra superior de destaque e espaçamento generoso
            <article key={order.id} style={styles.orderBlock}>
              {/* Faixa de cabeçalho da encomenda */}
              <div style={styles.orderHeaderStrip}>
                <div>
                  <div style={styles.orderIndexLabel}>
                    Encomenda {String(orderIdx + 1).padStart(2, "0")} /{" "}
                    {orderList.length}
                  </div>
                  <h3 style={styles.orderTitle}>Encomenda #{order.id}</h3>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={getStatusBadgeStyle(currentStatus(order))}>
                    {currentStatus(order)}
                  </span>
                  <select
                    value={currentStatus(order)}
                    disabled={savingStatusOrderId === order.id}
                    onChange={(e) =>
                      handleStatusChange(order, e.target.value as OrderStatus)
                    }
                    style={{
                      padding: "6px 10px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      maxWidth: "150px",
                      textTransform: "uppercase",
                      border: "1px solid #d8d3cc",
                      borderRadius: 0,
                      background: "#fff",
                      color: "var(--ink)",
                      cursor:
                        savingStatusOrderId === order.id ? "wait" : "pointer",
                    }}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {orderStatusTranslations[status]}
                      </option>
                    ))}
                  </select>
                  {savingStatusOrderId === order.id && (
                    <span style={{ fontSize: "0.72rem", color: "var(--mid)" }}>
                      A guardar…
                    </span>
                  )}
                </div>
              </div>

              {/* Resumo da informação da encomenda */}
              <div style={styles.orderInfoGrid}>
                <div style={styles.infoBox}>
                  <div style={styles.infoLabel}>Cliente</div>
                  <div style={styles.infoValue}>
                    {customer
                      ? `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() ||
                        customer.username
                      : loading
                        ? "A carregar…"
                        : "Desconhecido"}
                  </div>
                  {customer?.email && (
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--mid)",
                        marginTop: "2px",
                      }}
                    >
                      Email: {customer.email}
                    </div>
                  )}
                  {customer?.phoneNumber && (
                    <div style={{ fontSize: "0.78rem", color: "var(--mid)" }}>
                      Telefone: {customer.phoneNumber}
                    </div>
                  )}
                </div>

                <div style={styles.infoBox}>
                  <div style={styles.infoLabel}>ID de Rastreio</div>
                  <div style={styles.infoValue}>{order.trackId}</div>
                </div>
                <div style={styles.infoBox}>
                  <div style={styles.infoLabel}>Data do pedido</div>
                  <div style={styles.infoValue}>
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div style={styles.infoBox}>
                  <div style={styles.infoLabel}>Última atualização</div>
                  <div style={styles.infoValue}>
                    {formatDate(order.updatedAt)}
                  </div>
                </div>
                <div style={styles.infoBox}>
                  <div style={styles.infoLabel}>Itens</div>
                  <div style={styles.infoValue}>
                    {(order.cartItems ?? []).length} item(ns)
                  </div>
                </div>
              </div>

              {/* Tabela de itens encomendados */}
              <div style={styles.tableWrap}>
                {loading ? (
                  <div style={styles.tableState}>
                    A carregar itens da encomenda…
                  </div>
                ) : orderItems.length === 0 ? (
                  <div style={styles.tableState}>
                    Não há detalhes de itens disponíveis para esta encomenda.
                  </div>
                ) : (
                  <table className="responsive-table" style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Item</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Quantidade</th>
                        <th style={{ ...styles.th, textAlign: "right" }}>
                          Preço na Compra
                        </th>
                        <th style={{ ...styles.th, textAlign: "right" }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={`${order.id}-${item.id}`}>
                          <td style={styles.td} data-label="Item">
                            <div style={styles.productName}>
                              {item.itemName}
                            </div>
                          </td>
                          <td style={styles.td} data-label="Tipo">
                            <span style={styles.typeTag}>{item.itemType}</span>
                          </td>
                          <td style={styles.td} data-label="Quantidade">
                            {item.quantity ?? 1}
                          </td>
                          <td
                            style={{ ...styles.td, ...styles.moneyCell }}
                            data-label="Preço na Compra"
                          >
                            ${(item.priceAtPurchase ?? 0).toFixed(2)}
                          </td>
                          <td
                            style={{ ...styles.td, ...styles.moneyCell }}
                            data-label="Total"
                          >
                            <span style={styles.price}>
                              $
                              {(
                                (item.quantity ?? 1) *
                                (item.priceAtPurchase ?? 0)
                              ).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

// Status badges — semantic colors, squared off and letter-spaced
// to match the brand's sharp, uppercase language
const getStatusBadgeStyle = (status: OrderStatus): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    fontSize: "0.68rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    padding: "6px 14px",
    borderRadius: 0,
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  switch (status) {
    case "PENDING":
      return {
        ...baseStyle,
        backgroundColor: "#fff7ed",
        color: "#c2410c",
        border: "1px solid #fed7aa",
      };
    case "PROCESSING":
      return {
        ...baseStyle,
        backgroundColor: "#fefce8",
        color: "#a16207",
        border: "1px solid #fde68a",
      };
    case "SENT":
      return {
        ...baseStyle,
        backgroundColor: "#eff6ff",
        color: "#1d4ed8",
        border: "1px solid #bfdbfe",
      };
    case "RECEIVED":
      return {
        ...baseStyle,
        backgroundColor: "#faf5ff",
        color: "#7e22ce",
        border: "1px solid #e9d5ff",
      };
    case "COMPLETED":
      return {
        ...baseStyle,
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        border: "1px solid #bbf7d0",
      };
    case "CANCELLED":
      return {
        ...baseStyle,
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: "#f7f4ef",
        color: "var(--mid)",
        border: "1px solid #e8e4de",
      };
  }
};

// --- STYLE OBJECT DEFINITIONS (brand: ink / cream / accent) ---
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "auto",
    padding: "3rem 2rem 5rem",
    color: "var(--ink)",
    background: "var(--cream)",
  } as React.CSSProperties,

  // Page header
  pageHeader: {
    marginBottom: "2.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #e0dbd4",
  } as React.CSSProperties,
  pageEyebrow: {
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as React.CSSProperties,
  eyebrowLine: {
    display: "block",
    width: "24px",
    height: "2px",
    background: "var(--accent)",
  } as React.CSSProperties,
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.25rem",
    fontWeight: 900,
    color: "var(--ink)",
    lineHeight: 1.1,
    margin: 0,
  } as React.CSSProperties,
  pageSubtitle: {
    margin: "0.6rem 0 0",
    fontSize: "0.85rem",
    color: "var(--mid)",
  } as React.CSSProperties,

  emptyState: {
    background: "#fff",
    border: "1px solid #e8e4de",
    padding: "3rem",
    textAlign: "center" as const,
    color: "var(--mid)",
  } as React.CSSProperties,

  // ── ORDER BLOCK — one self-contained panel per order ──
  orderBlock: {
    background: "#fff",
    border: "1px solid #e8e4de",
    borderTop: "3px solid var(--accent)",
    marginBottom: "2.5rem",
  } as React.CSSProperties,

  orderHeaderStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "1rem",
    padding: "1.5rem 1.75rem",
    borderBottom: "1px solid #f0ece6",
  } as React.CSSProperties,
  orderIndexLabel: {
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "4px",
  } as React.CSSProperties,
  orderTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "var(--ink)",
    margin: 0,
    lineHeight: 1.1,
  } as React.CSSProperties,

  // Order info summary
  orderInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.25rem",
    padding: "1.5rem 1.75rem",
    borderBottom: "1px solid #f0ece6",
  } as React.CSSProperties,
  infoBox: {
    borderLeft: "2px solid var(--accent)",
    paddingLeft: "1rem",
  } as React.CSSProperties,
  infoLabel: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "4px",
  } as React.CSSProperties,
  infoValue: {
    fontSize: "0.92rem",
    fontWeight: 600,
    color: "var(--ink)",
  } as React.CSSProperties,

  // Items table
  tableWrap: {
    overflow: "hidden" as const,
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  } as React.CSSProperties,
  th: {
    background: "#faf9f7",
    textAlign: "left" as const,
    padding: "0.85rem 0.9rem",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "var(--mid)",
    borderBottom: "1px solid #f0ece6",
  } as React.CSSProperties,
  td: {
    padding: "0.9rem",
    borderTop: "1px solid #f0ece6",
    fontSize: "0.9rem",
    color: "var(--ink)",
    verticalAlign: "top" as const,
  } as React.CSSProperties,
  // Money columns never wrap or clip — they shrink to fit their content
  moneyCell: {
    textAlign: "right" as const,
    whiteSpace: "nowrap" as const,
    width: "1%",
  } as React.CSSProperties,
  productName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "0.98rem",
    marginBottom: "2px",
  } as React.CSSProperties,
  typeTag: {
    fontSize: "0.68rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--mid)",
  } as React.CSSProperties,
  price: {
    fontWeight: 700,
    color: "var(--ink)",
  } as React.CSSProperties,
  tableState: {
    padding: "3rem 1.75rem",
    textAlign: "center" as const,
    color: "var(--mid)",
    fontSize: "0.9rem",
  } as React.CSSProperties,

  // Per-order ink footer
  footerSummary: {
    padding: "1.5rem 1.75rem",
    background: "var(--ink)",
    display: "flex",
    justifyContent: "flex-end",
    gap: "3rem",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  summaryItem: {
    textAlign: "right" as const,
  } as React.CSSProperties,
  summaryLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#888",
    marginBottom: "2px",
  } as React.CSSProperties,
  summaryValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    fontWeight: 900,
    color: "var(--cream)",
  } as React.CSSProperties,
};

// --- MOBILE RESPONSIVE MEDIA QUERY STRIP ---
// Converts table rows into stacked card blocks below 768px.
const mobileResponsiveMediaQuery = `
  @media (max-width: 768px) {
    .responsive-table,
    .responsive-table thead,
    .responsive-table tbody,
    .responsive-table th,
    .responsive-table td,
    .responsive-table tr {
      display: block !important;
    }
    .responsive-table thead {
      display: none !important;
    }
    .responsive-table tr {
      border-bottom: 1px solid #e8e4de !important;
      padding: 15px 1.25rem !important;
    }
    .responsive-table td {
      border: none !important;
      padding: 8px 0 !important;
      text-align: left !important;
    }
    .responsive-table td::before {
      content: attr(data-label);
      display: block;
      font-size: 0.62rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 4px;
    }
  }
`;

export default CompanyOrderView;
