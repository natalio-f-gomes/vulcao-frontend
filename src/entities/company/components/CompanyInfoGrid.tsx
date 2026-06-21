import { CompanyModel } from "../../../api/interfaces";

interface Props {
  company: CompanyModel;
}

// Reusable single info row — label + value
function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div
      className="info-row"
      style={{ marginTop: 5, marginLeft: 10, marginRight: 10 }}
    >
      <span className="info-key">{label}</span>
      <span className="info-val">{value || "—"}</span>
    </div>
  );
}

// Reusable card wrapper
function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="info-card">
      <div className="info-card-title" style={{ marginLeft: 10 }}>
        <i className={`bi ${icon}`}></i> {title}
      </div>
      {children}
    </div>
  );
}

function CompanyInfoGrid({ company }: Props) {
  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "—";

  return (
    <div className="info-grid" style={{ margin: 2, padding: 2 }}>
      <InfoCard title="Contact information" icon="bi-envelope">
        <InfoRow label="Email" value={company.email} />
        <InfoRow label="Phone" value={company.phoneNumber} />
        <InfoRow label="Fax" value={company.faxNumber} />
        <InfoRow label="Tax ID" value={company.taxIdNumber} />
      </InfoCard>

      <InfoCard title="Address" icon="bi-geo-alt">
        <InfoRow label="Street" value={company.address?.street} />
        <InfoRow label="City" value={company.address?.city} />
        <InfoRow label="Zone" value={company.address?.zone} />
        <InfoRow label="Island" value={company.address?.island} />
        <InfoRow label="Postal code" value={company.address?.postalCode} />
      </InfoCard>

      <InfoCard title="About" icon="bi-info-circle">
        <InfoRow label="Description" value={company.description} />
        <div className="info-row" style={{ marginLeft: 10 }}>
          <span className="info-key">Status</span>
          <span
            className={`status-badge ${company.status === "OPERATING" ? "active" : "inactive"}`}
          >
            {company.status || "—"}
          </span>
        </div>
      </InfoCard>

      <InfoCard title="Timeline" icon="bi-clock-history">
        <InfoRow label="Registered" value={formatDate(company.createdAt)} />
        <InfoRow label="Last updated" value={formatDate(company.updatedAt)} />
      </InfoCard>
    </div>
  );
}

export default CompanyInfoGrid;
