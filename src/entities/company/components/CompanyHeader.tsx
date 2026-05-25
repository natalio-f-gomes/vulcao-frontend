import { CompanyModel } from "../../../api/interfaces";

interface Props {
  company:           CompanyModel;
  onViewEmployees:   () => void;
}

function CompanyHeader({ company, onViewEmployees }: Props) {
  const statusClass = company.status === "OPERATING" ? "status-badge active" : "status-badge inactive";

  return (
    <div className="company-header mt-5" style={{margin:10, padding:10}}>
      <div className="company-icon">
        <i className="bi bi-building" style={{ fontSize: "22px" }}></i>
      </div>

      <div className="company-header-info">
        <div className="company-header-name">{company.name || "—"}</div>
        <div className="company-header-meta">
          <span>{company.category || "—"}</span>
          &nbsp;·&nbsp;
          <span>{company.address?.city || "—"}</span>,&nbsp;
          <span>{company.address?.island || "—"}</span>
          &nbsp;·&nbsp;
          <span className={statusClass}>{company.status || "—"}</span>
        </div>
      </div>

      <div className="company-header-actions">
        <button className="btn-secondary-custom" onClick={onViewEmployees}>
          <i className="bi bi-people"></i> View Staff
        </button>
      </div>
    </div>
  );
}

export default CompanyHeader;
