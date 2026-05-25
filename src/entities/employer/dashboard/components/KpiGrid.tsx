function KpiGrid() {
  const kpis = [
    { label: "Total Revenue",    icon: "bi-cash",        value: "$48,290", delta: "↑ 12.4% vs last month", up: true },
    { label: "Orders This Month",icon: "bi-bag",         value: "1,084",   delta: "↑ 8.1% vs last month",  up: true },
    { label: "Active Customers", icon: "bi-people",      value: "3,412",   delta: "↓ 2.3% vs last month",  up: false },
    { label: "Avg. Order Value", icon: "bi-receipt",     value: "$44.55",  delta: "↑ 5.7% vs last month",  up: true },
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, i) => (
        <div className="kpi-card" key={i}>
          <div className="kpi-label">
            {kpi.label} <i className={`bi ${kpi.icon}`}></i>
          </div>
          <div className="kpi-value">{kpi.value}</div>
          <div className={`kpi-delta ${kpi.up ? "up" : "down"}`}>
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KpiGrid;