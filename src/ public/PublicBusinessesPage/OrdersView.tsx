import { useNavigate } from "react-router-dom";
import { CompanyModel, UserProfileModel } from "../../api/interfaces";
import { OrderSummary } from "./publicView.types";

interface OrdersViewProps {
  company: CompanyModel;
  currentUser: UserProfileModel | null;
  orders: OrderSummary[];
}

export default function OrdersView({ company, currentUser, orders }: OrdersViewProps) {
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div style={{ padding: "3rem 2.5rem", textAlign: "center", color: "var(--mid)" }}>
        <p style={{ marginBottom: "1.25rem" }}>Sign in to see your orders from {company.name}.</p>
        <button className="btn-primary-custom" onClick={() => navigate("/user-login")}>Sign in</button>
      </div>
    );
  }

  return (
    <section style={{ padding: "2.5rem" }}>
      <div className="section-header"><h2 className="section-title">My Orders</h2></div>
      {orders.length === 0 ? (
        <p style={{ color: "var(--mid)" }}>You haven't ordered from this business yet.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e8e4de" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #f0ece6" }}>
              <div>
                <div style={{ fontWeight: 600 }}>Order #{order.id}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--mid)" }}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"} · {order.itemCount} item(s)
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{order.total}</div>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)" }}>{order.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
