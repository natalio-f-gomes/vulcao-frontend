import React, { useEffect, useState } from "react";
import { StaffModel } from "../../../../api/interfaces";
import "../../../../css/staff-profile.css";
import {
  updateStaffProfile,
  updateStaffContact,
  updateStaffAddress,
  updateStaffSecurity,
} from "../../../../api/requests";

interface Parameters {
  staff: StaffModel | null;
  /**
   * Optional callback so the parent (StaffDashboard) can sync its own
   * `staff` state after a successful save. Safe to omit.
   */
  onStaffUpdated?: (partial: Partial<StaffModel>) => void;
}

const PERMISSION_LABELS: Record<string, string> = {
  ADD_PRODUCT:     "Adicionar Produto",
  UPDATE_PRODUCT:  "Atualizar Produto",
  DELETE_PRODUCT:  "Eliminar Produto",
  ADD_EMPLOYEE:    "Adicionar Funcionário",
  UPDATE_EMPLOYEE: "Atualizar Funcionário",
  FIRE_EMPLOYEE:   "Despedir Funcionário",
  ADD_COMPANY:     "Adicionar Empresa",
  UPDATE_COMPANY:  "Atualizar Empresa",
  DELETE_COMPANY:  "Eliminar Empresa",
  ADD_SERVICE:     "Adicionar Serviço",
  UPDATE_SERVICE:  "Atualizar Serviço",
  DELETE_SERVICE:  "Eliminar Serviço",
};

interface FormData {
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
  island:      string;
  city:        string;
  zone:        string;
  postalCode:  string;
  street:      string;
  username:    string;
  password:    string;
}

const EMPTY_FORM: FormData = {
  firstName: "", lastName: "", email: "", phoneNumber: "",
  island: "", city: "", zone: "", postalCode: "", street: "",
  username: "", password: "",
};

function StaffProfileView({ staff, onStaffUpdated }: Parameters) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData]             = useState<FormData>(EMPTY_FORM);

  // Hydrate the form whenever the staff prop arrives/changes
  // (like BeanUtils.copyProperties from the loaded entity into the form)
  useEffect(() => {
    if (!staff) return;
    setFormData({
      firstName:   staff.firstName            || "",
      lastName:    staff.lastName             || "",
      email:       staff.email                || "",
      phoneNumber: staff.phoneNumber          || "",
      island:      staff.address?.island      || "",
      city:        staff.address?.city        || "",
      zone:        staff.address?.zone        || "",
      postalCode:  staff.address?.postalCode  || "",
      street:      staff.address?.street      || "",
      username:    staff.username             || "",
      password:    "",
    });
  }, [staff]);

  // ── Generic input handler — id format is "inp-fieldName" ───────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const startEditing        = (section: string) => setEditingSection(section);
  const cancelEditing       = ()                 => setEditingSection(null);
  const isEditing           = (section: string)  => editingSection === section;
  const closeEditingSection = (msg: string)      => { setEditingSection(null); alert(msg); };

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "—";

  // ── Save a specific section (like a @PatchMapping — only the touched fields) ─
  const saveSection = async (section: string) => {
    if (!staff?.id) return;

    try {
      if (section === "personal") {
        const payload = { firstName: formData.firstName, lastName: formData.lastName };
        const res = await updateStaffProfile(staff.id, payload);
        if (res.status === 200) {
          onStaffUpdated?.(payload);
          closeEditingSection("Profile updated successfully!");
        } else {
          alert("Failed to update profile info.");
        }

      } else if (section === "contact") {
        const payload = { email: formData.email, phoneNumber: formData.phoneNumber };
        const res = await updateStaffContact(staff.id, payload);
        if (res.status === 200) {
          onStaffUpdated?.(payload);
          closeEditingSection("Contact updated successfully!");
        } else {
          alert("Failed to update contact info.");
        }

      } else if (section === "address") {
        const payload = {
          island:     formData.island,
          city:       formData.city,
          zone:       formData.zone,
          postalCode: formData.postalCode,
          street:     formData.street,
        };
        const res = await updateStaffAddress(staff.id, payload);
        if (res.status === 200) {
          onStaffUpdated?.({ address: { ...payload } });
          closeEditingSection("Address updated successfully!");
        } else {
          alert("Failed to update address info.");
        }

      } else if (section === "security") {
        /*
        const payload: { username: string; password?: string } = { username: formData.username };
        if (formData.password) payload.password = formData.password;
        const res = await updateStaffSecurity(staff.id, payload);
        if (res.status === 200) {
          onStaffUpdated?.({ username: formData.username });
          setFormData((prev) => ({ ...prev, password: "" }));
          closeEditingSection("Credentials updated successfully!");
        } else {
          alert("Failed to update credentials.");
        }
          */
      }
    } catch (err) {
      console.error("Error updating staff section:", err);
      alert("An unexpected error occurred while saving.");
    }
  };

  if (!staff) {
    return (
      <main className="profile-main">
        <div className="dash-card" style={{ marginTop: 40 }}>
          <div style={{ padding: 40, textAlign: "center", color: "#9b9b95" }}>
            Loading profile…
          </div>
        </div>
      </main>
    );
  }

  return (
   <main className="profile-main" style={{marginLeft:15}}>
      <div className="page-header" >
        <p className="page-eyebrow">Conta</p>
        <h1 className="page-title">O Meu Perfil</h1>
      </div>

      {/* ── Informação Pessoal (editável) ─────────────────────────────────────── */}
      <div className="profile-section" id="section-personal">
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-person-fill"></i>
            <span className="section-head-title">Informação Pessoal</span>
          </div>
          <button
            className={`btn-edit ${isEditing("personal") ? "editing" : ""}`}
            onClick={() => isEditing("personal") ? cancelEditing() : startEditing("personal")}
          >
            <i className="bi bi-pencil"></i> {isEditing("personal") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="fields-grid">
          <div className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}>
            <span className="field-label">Primeiro Nome</span>
            <span className="field-value">{formData.firstName || "Não definido"}</span>
            <input className="field-input" id="inp-firstName" type="text"
              value={formData.firstName} onChange={handleInputChange} />
          </div>
          <div className={`field-group ${isEditing("personal") ? "is-editing" : ""}`}>
            <span className="field-label">Último Nome</span>
            <span className="field-value">{formData.lastName || "Não definido"}</span>
            <input className="field-input" id="inp-lastName" type="text"
              value={formData.lastName} onChange={handleInputChange} />
          </div>
        </div>

        {isEditing("personal") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
            <button className="btn-save" onClick={() => saveSection("personal")}>
              <i className="bi bi-check2"></i> Salvar Alterações
            </button>
          </div>
        )}
      </div>

      {/* ── Contacto (editável) ───────────────────────────────────────────── */}
      <div className="profile-section" id="section-contact">
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-envelope-fill"></i>
            <span className="section-head-title">Detalhes de Contacto</span>
          </div>
          <button
            className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
            onClick={() => isEditing("contact") ? cancelEditing() : startEditing("contact")}
          >
            <i className="bi bi-pencil"></i> {isEditing("contact") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="fields-grid">
          <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
            <span className="field-label">Endereço de Email</span>
            <span className="field-value">{formData.email || "Não definido"}</span>
            <input className="field-input" id="inp-email" type="email"
              value={formData.email} onChange={handleInputChange} />
          </div>
          <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
            <span className="field-label">Número de Telefone</span>
            <span className="field-value">{formData.phoneNumber || "Não definido"}</span>
            <input className="field-input" id="inp-phoneNumber" type="tel"
              value={formData.phoneNumber} onChange={handleInputChange} />
          </div>
        </div>

        {isEditing("contact") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
            <button className="btn-save" onClick={() => saveSection("contact")}>
              <i className="bi bi-check2"></i> Salvar Alterações
            </button>
          </div>
        )}
      </div>

      {/* ── Morada (editável) ───────────────────────────────────────────── */}
      <div className="profile-section" id="section-address">
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-geo-alt-fill"></i>
            <span className="section-head-title">Morada</span>
          </div>
          <button
            className={`btn-edit ${isEditing("address") ? "editing" : ""}`}
            onClick={() => isEditing("address") ? cancelEditing() : startEditing("address")}
          >
            <i className="bi bi-pencil"></i> {isEditing("address") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="fields-grid triple">
          <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
            <span className="field-label">Ilha</span>
            <span className="field-value">{formData.island || "Não definido"}</span>
            <input className="field-input" id="inp-island" type="text"
              value={formData.island} onChange={handleInputChange} />
          </div>
          <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
            <span className="field-label">Cidade</span>
            <span className="field-value">{formData.city || "Não definido"}</span>
            <input className="field-input" id="inp-city" type="text"
              value={formData.city} onChange={handleInputChange} />
          </div>
          <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
            <span className="field-label">Zona</span>
            <span className="field-value">{formData.zone || "Não definido"}</span>
            <input className="field-input" id="inp-zone" type="text"
              value={formData.zone} onChange={handleInputChange} />
          </div>
          <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
            <span className="field-label">Código Postal</span>
            <span className="field-value">{formData.postalCode || "Não definido"}</span>
            <input className="field-input" id="inp-postalCode" type="text"
              value={formData.postalCode} onChange={handleInputChange} />
          </div>
          <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
            <span className="field-label">Rua</span>
            <span className="field-value">{formData.street || "Não definido"}</span>
            <input className="field-input" id="inp-street" type="text"
              value={formData.street} onChange={handleInputChange} />
          </div>
        </div>

        {isEditing("address") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
            <button className="btn-save" onClick={() => saveSection("address")}>
              <i className="bi bi-check2"></i> Salvar Alterações
            </button>
          </div>
        )}
      </div>

      {/* ── Segurança (editável: nome de utilizador + palavra-passe) ───────────────────────
      <div className="profile-section" id="section-security">
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-shield-lock-fill"></i>
            <span className="section-head-title">Segurança</span>
          </div>
          <button
            className={`btn-edit ${isEditing("security") ? "editing" : ""}`}
            onClick={() => isEditing("security") ? cancelEditing() : startEditing("security")}
          >
            <i className="bi bi-pencil"></i> {isEditing("security") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="fields-grid">
          <div className={`field-group ${isEditing("security") ? "is-editing" : ""}`}>
            <span className="field-label">Nome de Utilizador</span>
            <span className="field-value">{formData.username || "Não definido"}</span>
            <input className="field-input" id="inp-username" type="text"
              value={formData.username} onChange={handleInputChange} />
          </div>
          <div className={`field-group ${isEditing("security") ? "is-editing" : ""}`}>
            <span className="field-label">Palavra-passe</span>
            <span className="field-value"><span className="pwd-dots">●●●●●●●●●●●●</span></span>
            <input className="field-input" id="inp-password" type="password"
              placeholder="Nova palavra-passe" value={formData.password} onChange={handleInputChange} />
          </div>
        </div>

        {isEditing("security") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
            <button className="btn-save" onClick={() => saveSection("security")}>
              <i className="bi bi-check2"></i> Atualizar Credenciais
            </button>
          </div>
        )}
      </div> */}

      {/* ── Emprego (APENAS LEITURA: gerido pelo empregador) ──────────────────── */}
      <div className="profile-section" id="section-employment">
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-briefcase-fill"></i>
            <span className="section-head-title">Emprego</span>
          </div>
          <span
            className="biz-status-badge inactive"
            style={{ fontSize: "0.6rem", padding: "3px 10px", borderRadius: "12px" }}
          >
            <i className="bi bi-lock-fill" style={{ marginRight: 5 }}></i> Gerido pelo empregador
          </span>
        </div>

        <div className="fields-grid triple">
          <div className="field-group">
            <span className="field-label">Cargo</span>
            <span className="field-value">{staff.jobTitle || "—"}</span>
          </div>
          <div className="field-group">
            <span className="field-label">Departamento</span>
            <span className="field-value">{staff.department || "—"}</span>
          </div>
          <div className="field-group">
            <span className="field-label">Salário</span>
            <span className="field-value">{staff.salary != null ? staff.salary : "—"}</span>
          </div>
          <div className="field-group">
            <span className="field-label">Contratado a</span>
            <span className="field-value">{formatDate(staff.hiredAt)}</span>
          </div>
        </div>
      </div>

      {/* ── Permissões Atribuídas (APENAS LEITURA) ─────────────────────────────── */}
      <div className="profile-section" id="section-permissions">
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-lock-fill"></i>
            <span className="section-head-title">Permissões Atribuídas</span>
          </div>
          <span
            className="biz-status-badge inactive"
            style={{ fontSize: "0.6rem", padding: "3px 10px", borderRadius: "12px" }}
          >
            <i className="bi bi-lock-fill" style={{ marginRight: 5 }}></i> Gerido pelo empregador
          </span>
        </div>

        <div style={{ padding: "16px 0", display: "flex", flexWrap: "wrap", gap: "8px", marginLeft: 10 }}>
          {staff.assignedPermissions && staff.assignedPermissions.length > 0 ? (
            staff.assignedPermissions.map((perm) => (
              <span
                key={perm}
                className="biz-status-badge active"
                style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "12px", textTransform: "none" }}
              >
                {PERMISSION_LABELS[perm] || perm}
              </span>
            ))
          ) : (
            <span className="field-value" style={{ color: "#9b9b95" }}>
              Nenhuma permissão atribuída.
            </span>
          )}
        </div>
      </div>
    </main>
  );
}

export default StaffProfileView;