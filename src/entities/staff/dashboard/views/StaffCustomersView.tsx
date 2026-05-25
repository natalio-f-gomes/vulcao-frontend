function StaffCustomersView() {
  return (
    <>
      <div className="view-heading" style={{ marginTop: 40 }}>
        Customers
      </div>
      <div className="view-sub">
        View and follow up with customers of your company.
      </div>

      <div className="dash-card">
        <div className="card-head">
          <span className="card-title">All Customers</span>
          <a className="card-action">Export</a>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Maria Santos</td>
              <td>maria@example.com</td>
              <td>14</td>
              <td>$1,820.00</td>
            </tr>
            <tr>
              <td>James Oliveira</td>
              <td>james@example.com</td>
              <td>9</td>
              <td>$980.00</td>
            </tr>
            <tr>
              <td>Sofia Rodrigues</td>
              <td>sofia@example.com</td>
              <td>3</td>
              <td>$250.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default StaffCustomersView;
