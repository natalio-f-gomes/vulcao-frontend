import { StaffModel, Permissions } from "../../../../api/interfaces";

interface Props {
  staff: StaffModel | null;
}

// Friendly labels for permission codes — copy of the labels used in StaffModal
const PERMISSION_LABELS: Record<string, string> = {
  ADD_PRODUCT:     "Add Product",
  UPDATE_PRODUCT:  "Update Product",
  DELETE_PRODUCT:  "Delete Product",
  ADD_EMPLOYEE:    "Add Employee",
  UPDATE_EMPLOYEE: "Update Employee",
  FIRE_EMPLOYEE:   "Terminate Employee",
  ADD_COMPANY:     "Add Company",
  UPDATE_COMPANY:  "Update Company",
  DELETE_COMPANY:  "Delete Company",
  ADD_SERVICE:     "Add Service",
  UPDATE_SERVICE:  "Update Service",
  DELETE_SERVICE:  "Delete Service",
};

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="info-row" style={{paddingTop:5, paddingLeft:5, paddingRight:5}}>
      <span className="info-key">{label}</span>
      <span className="info-val">{value || "—"}</span>
    </div>
  );
}

function StaffProfileView({ staff }: Props) {
  if (!staff) {
    return (
      <div className="dash-card" style={{ marginTop: 40 }}>
        <div style={{ padding: 40, textAlign: "center", color: "#9b9b95" }}>
          Loading profile…
        </div>
      </div>
    );
  }

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "—";

  return (
    <>
      <div className="view-heading" style={{ marginTop: 40 }}>
        My Profile
      </div>
      <div className="view-sub">Your personal information and permissions.</div>

      {/* Header card */}
      <div className="company-header" style={{ marginTop: 24 }}>
        <div className="company-icon">
          <i className="bi bi-person" style={{ fontSize: 22 }}></i>
        </div>
        <div className="company-header-info" style={{margin:10}}>
          <div className="company-header-name">
            {staff.firstName} {staff.lastName}
          </div>
          <div className="company-header-meta">
            <span>{staff.jobTitle || "—"}</span>
            &nbsp;·&nbsp;
            <span>@{staff.username}</span>
          </div>
        </div>
      </div>

      <div className="info-grid"  style={{marginTop:10}}>
        <div className="info-card">
          <div className="info-card-title">
            <i className="bi bi-person-vcard" style={{marginLeft:5}}></i> Personal
          </div>
          <InfoRow label="First name" value={staff.firstName}   />
          <InfoRow label="Last name"  value={staff.lastName}    />
          <InfoRow label="Username"   value={staff.username}    />
          <InfoRow label="Email"      value={staff.email}       />
          <InfoRow label="Phone"      value={staff.phoneNumber} />
        </div>

        <div className="info-card">
          <div className="info-card-title">
            <i className="bi bi-briefcase"  style={{marginLeft:5}}></i> Employment
          </div>
          <InfoRow label="Job title"   value={staff.jobTitle}           />
          <InfoRow label="Salary"      value={staff.salary ? `$${staff.salary}` : "—"} />
          <InfoRow label="Hired"       value={formatDate(staff.hiredAt)} />
        </div>

        <div className="info-card">
          <div className="info-card-title">
            <i className="bi bi-geo-alt"></i> Address
          </div>
          <InfoRow label="Street"      value={staff.address?.street}     />
          <InfoRow label="City"        value={staff.address?.city}       />
          <InfoRow label="Zone"        value={staff.address?.zone}       />
          <InfoRow label="Island"      value={staff.address?.island}     />
          <InfoRow label="Postal code" value={staff.address?.postalCode} />
        </div>

        <div className="info-card">
          <div className="info-card-title">
            <i className="bi bi-shield-check"  style={{marginLeft:5}}></i> Permissions
          </div>
          {staff.assignedPermissions && staff.assignedPermissions.length > 0 ? (
            <div className="perm-tags" style={{ paddingLeft: 4 }}>
            {staff.assignedPermissions
              .filter((p): p is Exclude<Permissions, null> => p != null)
              .map((p) => (
                <span className="perm-tag" key={p}>
                  {PERMISSION_LABELS[p] || p}
                </span>
              ))}
            </div>
          ) : (
            <span className="perm-tag none">No permissions assigned.</span>
          )}
        </div>
      </div>
    </>
  );
}

export default StaffProfileView;
