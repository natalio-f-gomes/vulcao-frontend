// src/pages/Company-Dashboard/CompanyTopBar.tsx

interface Props {
  companyName: string;
  onBack:      () => void;
  onEdit:      () => void;
}

function CompanyTopBar({ companyName, onBack, onEdit }: Props) {
  return (
    <div className="topbar">
      <button className="topbar-back" onClick={onBack}>
        <i className="bi bi-arrow-left" style={{ fontSize: "13px" }}></i> Back
      </button>
      <div className="topbar-divider"></div>
      <div>
        <div className="topbar-title">Company Dashboard</div>
        <div className="topbar-sub">
          {companyName ? companyName : "Loading..."}
        </div>
      </div>
      <div className="topbar-right">
        <button className="btn-secondary-custom" onClick={onEdit}>
          <i className="bi bi-pencil"></i> Edit Company
        </button>
      </div>
    </div>
  );
}

export default CompanyTopBar;
