function EmployeesView() {
  return (
    <>
      <div className="view-heading">Employees</div>
      <div className="view-sub">Manage your team members.</div>

      <div className="quick-actions">
        <button className="qa-btn primary"><i className="bi bi-plus-lg"></i> Add Employee</button>
      </div>

      <div className="dash-card">
        <div className="card-head">
          <span className="card-title">Team</span>
        </div>
        <table className="orders-table">
          <thead>
            <tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Ana Pereira</td><td>Manager</td><td>Operations</td><td><span className="status-chip delivered">Active</span></td></tr>
            <tr><td>Carlos Mendes</td><td>Sales Rep</td><td>Sales</td><td><span className="status-chip delivered">Active</span></td></tr>
            <tr><td>Sofia Rodrigues</td><td>Support</td><td>Customer Service</td><td><span className="status-chip pending">On Leave</span></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EmployeesView;