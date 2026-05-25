interface Props {
  companyId?: string;
}

function StaffOrdersView({ companyId }: Props) {
  // TODO: replace with real fetch scoped to `companyId`
  // e.g. await getOrdersByCompany(companyId);
  return (
    <>
      <div className="view-heading" style={{ marginTop: 40 }}>
        Orders
      </div>
      <div className="view-sub">
        Track and process orders for your company.
      </div>

      <div className="dash-card">
        <div className="card-head">
          <span className="card-title">Recent Orders</span>
          <a className="card-action">Export</a>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="order-id">#SL-4821</span></td>
              <td>Maria Santos</td>
              <td>$129.00</td>
              <td><span className="status-chip delivered">Delivered</span></td>
            </tr>
            <tr>
              <td><span className="order-id">#SL-4820</span></td>
              <td>James Oliveira</td>
              <td>$249.00</td>
              <td><span className="status-chip processing">Processing</span></td>
            </tr>
            <tr>
              <td><span className="order-id">#SL-4819</span></td>
              <td>Ana Pereira</td>
              <td>$89.00</td>
              <td><span className="status-chip pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default StaffOrdersView;
