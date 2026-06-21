import { useEffect, useState } from "react";
import { StaffModel } from "../../../../api/interfaces";
import { ALL_PERMISSIONS } from "../../../../api/categories";

interface Properties {
  isOpen: boolean;
  staff: StaffModel;
  onClose: () => void;
}

function ViewStaffModal({ isOpen, onClose, staff }: Properties) {
  const [staffForm, setStaffForm] = useState<StaffModel>({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hiredAt: "",
    salary: 0,
    jobTitle: "",
    companyId: "",
    department: "",
    assignedPermissions: [],
    address: {
      island: "",
      city: "",
      zone: "",
      street: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    if (staff) {
      setStaffForm(staff);
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Ver Conta de @{staff?.username}</span>
          <button className="m-close" onClick={() => onClose()}>
            &times;
          </button>
        </div>

        <div className="m-body">
          {/* Credenciais da Conta */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Nome de Utilizador *</label>
              <input
                className="m-input"
                type="text"
                value={staff.username}
                name="username"
                readOnly
              />
            </div>
          </div>

          {/* Informação Pessoal */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Primeiro Nome *</label>
              <input
                className="m-input"
                type="text"
                value={staff.firstName}
                name="firstName"
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Último Nome *</label>
              <input
                className="m-input"
                type="text"
                value={staff.lastName}
                name="lastName"
                readOnly
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Email *</label>
              <input
                className="m-input"
                type="email"
                name="email"
                value={staff.email}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Número de Telefone</label>
              <input
                className="m-input"
                type="tel"
                name="phoneNumber"
                value={staffForm.phoneNumber}
                readOnly
              />
            </div>
          </div>

          {/* Informação Laboral */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Cargo *</label>
              <input
                className="m-input"
                type="text"
                value={staffForm.jobTitle}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Departamento</label>
              <input
                className="m-input"
                type="text"
                value={staffForm.department}
                readOnly
              />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Data de Contratação</label>
              <input
                className="m-input"
                type="date"
                name="hiredAt"
                value={staff.hiredAt}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Salário</label>
              <input
                className="m-input"
                type="number"
                name="salary"
                value={staff.salary}
                readOnly
              />
            </div>
          </div>

          {/* Morada */}
          <div className="m-field">
            <label className="m-label">
              <i className="bi bi-geo-alt-fill me-1"></i> Morada
            </label>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Ilha</label>
              <input
                className="m-input"
                type="text"
                name="island"
                value={staff?.address?.island ?? ""}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Cidade</label>
              <input
                className="m-input"
                type="text"
                value={staff?.address?.city ?? ""}
                readOnly
              />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Zona</label>
              <input
                className="m-input"
                type="text"
                name="zone"
                value={staff?.address?.zone ?? ""}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Código Postal</label>
              <input
                className="m-input"
                type="text"
                name="postalCode"
                value={staff?.address?.postalCode ?? ""}
                readOnly
              />
            </div>
          </div>

          <div className="m-field">
            <label className="m-label">Rua</label>
            <input
              className="m-input"
              type="text"
              name="street"
              value={staff?.address?.street ?? ""}
              readOnly
            />
          </div>

          {/* Permissões */}
          <div className="form-section">Permissões *</div>
          <div className="perm-grid">
            {ALL_PERMISSIONS.map((perm) => (
              <div className="perm-item" key={perm.value}>
                <input
                  name="assignedPermissions"
                  type="checkbox"
                  className="perm-checkbox"
                  id={`perm-${perm.value}`}
                  value={perm.value}
                  checked={staffForm.assignedPermissions.includes(perm.value)}
                  readOnly
                />
                <label htmlFor={`perm-${perm.value}`}>
                  {perm.label}
                  <small>{perm.description}</small>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewStaffModal;
