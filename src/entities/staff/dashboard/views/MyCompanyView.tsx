import { CompanyModel } from "../../../../api/interfaces";

interface Props {
  company: CompanyModel | null;
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="info-row" style={{padding:5}}>
      <span className="info-key">{label}</span>
      <span className="info-val">{value || "—"}</span>
    </div>
  );
}

function MyCompanyView({ company }: Props) {
  if (!company) {
    return (
      <div className="dash-card" style={{ marginTop: 40 }}>
        <div style={{ padding: 40, textAlign: "center", color: "#9b9b95" }}>
          <i
            className="bi bi-building"
            style={{ fontSize: 32, display: "block", marginBottom: 8 }}
          ></i>
          No company assigned to your account.
        </div>
      </div>
    );
  }

  const statusClass =
    company.status === "OPERATING"
      ? "status-badge active"
      : "status-badge inactive";

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "—";

  return (
    <>
      <div className="view-heading" style={{ marginTop: 40 }}>
        My Company
      </div>
      <div className="view-sub">Details about your workplace.</div>

      {/* Header card */}
      <div className="company-header" style={{ marginTop: 24 , padding:10, marginBottom:10}}>
        <div className="company-icon">
          <i className="bi bi-building" style={{ fontSize: 22 }}></i>
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
      </div>

      {/* Info grid — reuses the same .info-grid styles from your company dashboard CSS */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-title">
            <i className="bi bi-envelope" style={{padding:10}}></i> Contact information
          </div>
          <InfoRow label="Email"  value={company.email}       />
          <InfoRow label="Phone"  value={company.phoneNumber} />
          <InfoRow label="Fax"    value={company.faxNumber}   />
          <InfoRow label="Tax ID" value={company.taxIdNumber} />
        </div>

        <div className="info-card">
          <div className="info-card-title">
            <i className="bi bi-geo-alt" style={{padding:10}}></i> Address
          </div>
          <InfoRow label="Street"      value={company.address?.street}     />
          <InfoRow label="City"        value={company.address?.city}       />
          <InfoRow label="Zone"        value={company.address?.zone}       />
          <InfoRow label="Island"      value={company.address?.island}     />
          <InfoRow label="Postal code" value={company.address?.postalCode} />
        </div>

        <div className="info-card" style={{padding:10}} >
          <div className="info-card-title">
            <i className="bi bi-info-circle" ></i> About
          </div>
          <InfoRow label="Description" value={company.description} />
          <div className="info-row">
            <span className="info-key" style={{marginLeft:5}} >Status</span>
            <span className={statusClass} style={{marginTop:5}}>{company.status || "—"}</span>
          </div>
        </div>

        <div className="info-card" style={{padding:10}} >
          <div className="info-card-title">
            <i className="bi bi-clock-history"></i> Timeline
          </div>
          <InfoRow label="Registered"   value={formatDate(company.createdAt)} />
          <InfoRow label="Last updated" value={formatDate(company.updatedAt)} />
        </div>
      </div>
    </>
  );
}

export default MyCompanyView;
