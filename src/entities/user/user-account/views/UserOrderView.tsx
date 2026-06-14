import { useEffect, useState } from "react";

import { OrderStatus } from "../../../../api/categories";
import { CompanyModel, OrderItemModel, OrderModel } from "../../../../api/interfaces";
import { getCompanyDashboard, getOrderItemById } from "../../../../api/requests";


interface OrderProps {
  orders: OrderModel[];
}

// Orders for a single company, bundled with its resolved details
interface CompanyOrderGroup {
  companyId: string;
  company: CompanyModel | null;
  orders: OrderModel[];
}

export default function UserOrderView({ orders }: OrderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  // companyId -> resolved company (for the section headers)
  const [companiesMap, setCompaniesMap] = useState<Record<string, CompanyModel | null>>({});
  // orderId -> resolved order items for that order
  const [orderItemsMap, setOrderItemsMap] = useState<Record<string, OrderItemModel[]>>({});

  useEffect(() => {
    if (!orders || orders.length === 0) {
      setCompaniesMap({});
      setOrderItemsMap({});
      return;
    }

    // Resolves one order's items. OrderItemModel is a purchase-time
    // snapshot (name, quantity, priceAtPurchase), so one fetch per
    // item is enough — no product lookups needed.
    const loadItemsForOrder = async (order: OrderModel): Promise<OrderItemModel[]> => {
      const responses = await Promise.all(
        (order.cartItems ?? [])
          .filter((item) => item?.id)
          .map((item) => getOrderItemById(item.id!))
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

    // Resolves each distinct company once, no matter how many
    // orders the user has placed with it.
    const loadCompanies = async (): Promise<Record<string, CompanyModel | null>> => {
      const uniqueIds = Array.from(
        new Set(orders.map((o) => o.companyId).filter(Boolean))
        ) as string[];
      const entries = await Promise.all(
        uniqueIds.map(async (companyId) => {
          try {
            const res = await getCompanyDashboard(companyId);
            if (!res || !res.ok) return [companyId, null] as const;
            const data = await res.json().catch(() => null);
            return [companyId, data] as const;
          } catch {
            return [companyId, null] as const;
          }
        })
      );
      return Object.fromEntries(entries);
    };

    const loadAll = async () => {
      setLoading(true);
      try {
        const [companies, itemResults] = await Promise.all([
          loadCompanies(),
          Promise.all(
            orders.map(async (order) => ({
              orderId: order.id!,
              items: await loadItemsForOrder(order)
            }))
          )
        ]);

        const itemsMap: Record<string, OrderItemModel[]> = {};
        for (const { orderId, items } of itemResults) {
          itemsMap[orderId] = items;
        }

        setCompaniesMap(companies);
        setOrderItemsMap(itemsMap);
      } catch (err) {
        console.error("There was an issue loading the order details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [orders]);

  // ── Group orders by company, newest order first within each group ──
  const groups: CompanyOrderGroup[] = (() => {
    const byCompany: Record<string, OrderModel[]> = {};
    for (const order of orders ?? []) {
      const key = order.companyId ?? "unknown";
      (byCompany[key] ??= []).push(order);
    }
    return Object.entries(byCompany).map(([companyId, companyOrders]) => ({
      companyId,
      company: companiesMap[companyId] ?? null,
      orders: [...companyOrders].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      )
    }));
  })();

  // Per-order aggregates derived from its order items
  const getItemCount = (items: OrderItemModel[]): number =>
    items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  const getOrderTotal = (order: OrderModel, items: OrderItemModel[]): number => {
    const computed = items.reduce(
      (sum, item) => sum + (item.quantity ?? 1) * (item.priceAtPurchase ?? 0),
      0
    );
    return computed > 0 ? computed : order.totalCost ?? 0;
  };

  const getOrderStatusMessage = (status: OrderStatus) => {
switch (status) {
    case "PENDING":
      return "A sua encomenda foi recebida e está à espera de ser processada.";

    case "PROCESSING":
      return "Estamos a preparar os seus itens.";

    case "SENT":
      return "A sua encomenda foi enviada.";

    case "RECEIVED":
      return "A sua encomenda foi entregue.";

    case "COMPLETED":
      return "Esta encomenda está concluída. Obrigado!";

    case "CANCELLED":
      return "Esta encomenda foi cancelada.";

    default:
      return "Estado desconhecido.";
}
};

  const formatDate = (iso?: string): string =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      : "—";

  const orderList = orders ?? [];

  return (
   <div style={styles.container}>
  <style dangerouslySetInnerHTML={{ __html: mobileResponsiveMediaQuery }} />

  {/* Cabeçalho da página — sobrancelha do perfil + título Playfair */}
  <div style={styles.pageHeader}>
    <div style={styles.pageEyebrow}>
      <span style={styles.eyebrowLine} />
      Histórico de Encomendas · Todas as Empresas
    </div>
    <h1 style={styles.pageTitle}>As Minhas Encomendas</h1>
    {orderList.length > 0 && (
      <p style={styles.pageSubtitle}>
        {orderList.length} encomenda{orderList.length === 1 ? "" : "s"} em{" "}
        {groups.length} empresa{groups.length === 1 ? "" : "s"}
      </p>
    )}
  </div>

  {orderList.length === 0 ? (
    <div style={styles.emptyState}>Ainda não fez nenhuma encomenda.</div>
  ) : (
    groups.map((group) => {
      const companyName = group.company?.name ?? "Empresa";

      return (
        // ── SECÇÃO DA EMPRESA — todas as encomendas desta empresa juntas ──
        <section key={group.companyId} style={styles.companySection}>
          {/* Cabeçalho divisor da empresa */}
          <div style={styles.companyHeader}>
            <div style={styles.companyHeaderLeft}>
              <div style={styles.companyEyebrow}>Empresa</div>
              <h2 style={styles.companyName}>{companyName}</h2>
            </div>
            <div style={styles.companyOrderCount}>
              {group.orders.length} encomenda{group.orders.length === 1 ? "" : "s"}
            </div>
          </div>

          {group.orders.map((order: OrderModel, orderIdx: number) => {
            const orderItems = orderItemsMap[order.id!] ?? [];

            return (
              // Cada encomenda é o seu próprio bloco independente,
              // separado por uma barra superior de destaque e espaçamento generoso
              <article key={order.id} style={styles.orderBlock}>
                {/* Faixa de cabeçalho da encomenda */}
                <div style={styles.orderHeaderStrip}>
                  <div>
                    <div style={styles.orderIndexLabel}>
                      Encomenda {String(orderIdx + 1).padStart(2, "0")} /{" "}
                      {group.orders.length} · {companyName}
                    </div>
                    <h3 style={styles.orderTitle}>Encomenda #{order.id}</h3>
                  </div>
                  <span style={getStatusBadgeStyle(order.status)}>
                    {order.status}
                  </span>
                  <div style={{ fontSize: "0.85rem", color: "var(--mid)", marginTop: 4 }}>
                    {getOrderStatusMessage(order.status)}
                  </div>
                </div>

                {/* Resumo da informação da encomenda */}
                <div style={styles.orderInfoGrid}>
                  <div style={styles.infoBox}>
                    <div style={styles.infoLabel}>ID de Encomenda</div>
                    <div style={styles.infoValue}>{order.trackId}</div>
                  </div>
                  <div style={styles.infoBox}>
                    <div style={styles.infoLabel}>Data do pedido</div>
                    <div style={styles.infoValue}>{formatDate(order.createdAt)}</div>
                  </div>
                  <div style={styles.infoBox}>
                    <div style={styles.infoLabel}>Última atualização</div>
                    <div style={styles.infoValue}>{formatDate(order.updatedAt)}</div>
                  </div>
                  <div style={styles.infoBox}>
                    <div style={styles.infoLabel}>Itens</div>
                    <div style={styles.infoValue}>
                      {(order.cartItems ?? []).length} linha(s)
                    </div>
                  </div>
                </div>

                {/* Tabela de itens encomendados */}
                <div style={styles.tableWrap}>
                  {loading ? (
                    <div style={styles.tableState}>A carregar itens da encomenda…</div>
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
                            Preço
                          </th>
                          <th style={{ ...styles.th, textAlign: "right" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={`${order.id}-${item.id}`}>
                            <td style={styles.td} data-label="Item">
                              <div style={styles.productName}>{item.itemName}</div>
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
                                  (item.quantity ?? 1) * (item.priceAtPurchase ?? 0)
                                ).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Rodapé de resumo por encomenda */}
                  <div style={styles.footerSummary}>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Itens</div>
                      <div style={styles.summaryValue}>{getItemCount(orderItems)}</div>
                    </div>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Custo Total</div>
                      <div style={{ ...styles.summaryValue, color: "var(--accent)" }}>
                        ${getOrderTotal(order, orderItems).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
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
    whiteSpace: "nowrap"
  };

  switch (status) {
    case "PENDING":
      return { ...baseStyle, backgroundColor: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" };
    case "PROCESSING":
      return { ...baseStyle, backgroundColor: "#fefce8", color: "#a16207", border: "1px solid #fde68a" };
    case "SENT":
      return { ...baseStyle, backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" };
    case "RECEIVED":
      return { ...baseStyle, backgroundColor: "#faf5ff", color: "#7e22ce", border: "1px solid #e9d5ff" };
    case "COMPLETED":
      return { ...baseStyle, backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" };
    case "CANCELLED":
      return { ...baseStyle, backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
    default:
      return { ...baseStyle, backgroundColor: "#f7f4ef", color: "var(--mid)", border: "1px solid #e8e4de" };
  }
};

// --- STYLE OBJECT DEFINITIONS (brand: ink / cream / accent) ---
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "auto",
    padding: "3rem 2rem 5rem",
    color: "var(--ink)",
    background: "var(--cream)"
  } as React.CSSProperties,

  // Page header
  pageHeader: {
    marginBottom: "2.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #e0dbd4"
  } as React.CSSProperties,
  pageEyebrow: {
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  } as React.CSSProperties,
  eyebrowLine: {
    display: "block",
    width: "24px",
    height: "2px",
    background: "var(--accent)"
  } as React.CSSProperties,
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.25rem",
    fontWeight: 900,
    color: "var(--ink)",
    lineHeight: 1.1,
    margin: 0
  } as React.CSSProperties,
  pageSubtitle: {
    margin: "0.6rem 0 0",
    fontSize: "0.85rem",
    color: "var(--mid)"
  } as React.CSSProperties,

  emptyState: {
    background: "#fff",
    border: "1px solid #e8e4de",
    padding: "3rem",
    textAlign: "center" as const,
    color: "var(--mid)"
  } as React.CSSProperties,

  // ── COMPANY SECTION — groups every order placed with one business ──
  companySection: {
    marginBottom: "4.5rem"
  } as React.CSSProperties,
  // Ink band header makes each business read as its own chapter
  companyHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "0.75rem",
    background: "var(--ink)",
    padding: "1.4rem 1.75rem",
    marginBottom: "1.75rem"
  } as React.CSSProperties,
  companyHeaderLeft: {} as React.CSSProperties,
  companyEyebrow: {
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "4px"
  } as React.CSSProperties,
  companyName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.6rem",
    fontWeight: 900,
    color: "var(--cream)",
    margin: 0,
    lineHeight: 1.1
  } as React.CSSProperties,
  companyOrderCount: {
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#888"
  } as React.CSSProperties,

  // ── ORDER BLOCK — one self-contained panel per order ──
  orderBlock: {
    background: "#fff",
    border: "1px solid #e8e4de",
    borderTop: "3px solid var(--accent)",
    marginBottom: "2.5rem"
  } as React.CSSProperties,

  orderHeaderStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "1rem",
    padding: "1.5rem 1.75rem",
    borderBottom: "1px solid #f0ece6"
  } as React.CSSProperties,
  orderIndexLabel: {
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "4px"
  } as React.CSSProperties,
  orderTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "var(--ink)",
    margin: 0,
    lineHeight: 1.1
  } as React.CSSProperties,

  // Order info summary
  orderInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.25rem",
    padding: "1.5rem 1.75rem",
    borderBottom: "1px solid #f0ece6"
  } as React.CSSProperties,
  infoBox: {
    borderLeft: "2px solid var(--accent)",
    paddingLeft: "1rem"
  } as React.CSSProperties,
  infoLabel: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "4px"
  } as React.CSSProperties,
  infoValue: {
    fontSize: "0.92rem",
    fontWeight: 600,
    color: "var(--ink)"
  } as React.CSSProperties,

  // Items table
  tableWrap: {
    overflow: "hidden" as const
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const
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
    borderBottom: "1px solid #f0ece6"
  } as React.CSSProperties,
  td: {
    padding: "0.9rem",
    borderTop: "1px solid #f0ece6",
    fontSize: "0.9rem",
    color: "var(--ink)",
    verticalAlign: "top" as const
  } as React.CSSProperties,
  // Money columns never wrap or clip — they shrink to fit their content
  moneyCell: {
    textAlign: "right" as const,
    whiteSpace: "nowrap" as const,
    width: "1%"
  } as React.CSSProperties,
  productName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "0.98rem",
    marginBottom: "2px"
  } as React.CSSProperties,
  typeTag: {
    fontSize: "0.68rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--mid)"
  } as React.CSSProperties,
  price: {
    fontWeight: 700,
    color: "var(--ink)"
  } as React.CSSProperties,
  tableState: {
    padding: "3rem 1.75rem",
    textAlign: "center" as const,
    color: "var(--mid)",
    fontSize: "0.9rem"
  } as React.CSSProperties,

  // Per-order ink footer
  footerSummary: {
    padding: "1.5rem 1.75rem",
    background: "var(--ink)",
    display: "flex",
    justifyContent: "flex-end",
    gap: "3rem",
    flexWrap: "wrap" as const
  } as React.CSSProperties,
  summaryItem: {
    textAlign: "right" as const
  } as React.CSSProperties,
  summaryLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#888",
    marginBottom: "2px"
  } as React.CSSProperties,
  summaryValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    fontWeight: 900,
    color: "var(--cream)"
  } as React.CSSProperties
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