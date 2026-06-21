import React, { useEffect, useState } from "react";
import { AddressModel, CompanyAboutInfo, CompanyContact, CompanyModel, WeekDays, WeeklySchedule, TimeRange } from "../../../api/interfaces";
import { useUserAuthManager } from "../../../api/authentication-handler";
import { useNavigate } from "react-router-dom";
import { updateCompanyAboutInfo, updateCompanyAddress, updateCompanyContact, updateCompanySchedule } from "../../../api/requests";
import ImageCarousel from "../../../components/ImageCarousel";
import UpdateCompanyImageModal from "../../employer/dashboard/modals/CompanyUpdateImageModal";
import { ISLANDS } from "../../../api/categories";

interface Parameters {
  company: CompanyModel;
}

const SCHEDULE_DAYS: { key: WeekDays; label: string }[] = [
  { key: "SEGUNDA_FEIRA", label: "Segunda" },
  { key: "TERÇA_FEIRA",  label: "Terça" },
  { key: "QUARTA_FEIRA", label: "Quarta" },
  { key: "QUINTA_FEIRA", label: "Quinta" },
  { key: "SEXTA_FEIRA",  label: "Sexta" },
  { key: "SABADO",       label: "Sábado" },
  { key: "DOMINGO",      label: "Domingo" },
];

const emptySchedule = (): WeeklySchedule => {
  const daySchedule = {} as Record<WeekDays, TimeRange>;
  SCHEDULE_DAYS.forEach(({ key }) => {
    daySchedule[key] = { start: "09:00", end: "18:00", isClosed: false };
  });
  return { daySchedule, open247: false };
};

const normalizeSchedule = (ws: WeeklySchedule | null | undefined): WeeklySchedule => {
  const base = emptySchedule();
  if (!ws) return base;
  return {
    open247: ws.open247 ?? false,
    daySchedule: { ...base.daySchedule, ...(ws.daySchedule ?? {}) },
  };
};

// Self-contained input styling (cannot use .field-input — it's hidden outside .is-editing)
const timeInputStyle: React.CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  width: "auto",
  padding: "6px 8px",
  border: "1px solid #d8d2c8",
  borderRadius: 4,
  fontSize: "0.85rem",
  background: "#fff",
};

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        padding: "9px 0",
        borderBottom: "1px solid #f0ece6",
        fontSize: "0.88rem",
      }}
    >
      <span className="field-label" style={{ alignSelf: "center" }}>{label}</span>
      <span style={{ color: "var(--ink)", fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function CompanyOverView({ company }: Parameters) {
  const companyStatus = company.status === "OPERATING" ? "biz-status-badge active" : "biz-status-badge inactive";
  const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [companyImageUpload, setcompanyImageUpload] = useState<CompanyModel | null>(null);
  const [aboutInfo, setAboutInfo] = useState<CompanyAboutInfo>({
    description: "",
    status: company.status,
    taxIdNumber: "",
  });
  const [address, setAddress] = useState<AddressModel>({
    island: company.address.island,
    city: company.address.city,
    postalCode: company.address.postalCode,
    street: company.address.street,
    zone: company.address.zone,
  });
  const [contact, setContact] = useState<CompanyContact>({
    email: company.email,
    phoneNumber: company.phoneNumber,
    faxNumber: company.faxNumber,
  });
  const [schedule, setSchedule] = useState<WeeklySchedule>(emptySchedule());

  const navigate = useNavigate();
  useEffect(() => {
    if (!isEntityLoggedIn) navigate("/employer-login");
  }, [isEntityLoggedIn]);

  const contactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setContact((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };
  const addressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setAddress((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const aboutInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutInfo((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- schedule handlers ---------- */
  const setOpen247 = (value: boolean) =>
    setSchedule((prev) => ({ ...prev, open247: value }));

  const updateDay = (day: WeekDays, patch: Partial<TimeRange>) =>
    setSchedule((prev) => ({
      ...prev,
      daySchedule: { ...prev.daySchedule, [day]: { ...prev.daySchedule[day], ...patch } },
    }));

  const startEditing = (section: string) => setEditingSection(section);
  const cancelEditing = () => {
    // revert schedule edits if the user cancels that section
    if (editingSection === "schedule") setSchedule(normalizeSchedule(company.weeklySchedule));
    setEditingSection(null);
  };
  const isEditing = (section: string) => editingSection === section;
  const closeEditingSection = (alertMessage: string) => { setEditingSection(null); alert(alertMessage); };

  const saveSection = async (section: string) => {
    if (!company) return;
    let dataToUpdate: any = {};
    try {
      if (section === "address") {
        dataToUpdate = { island: address.island, city: address.city, street: address.street, zone: address.zone, postalCode: address.postalCode };
        const response = await updateCompanyAddress(dataToUpdate, company.id!);
        if (response.status === 200) {
          setAddress({ island: address.island, city: address.city, street: address.street, zone: address.zone, postalCode: address.postalCode });
          closeEditingSection("Morada da empresa atualizada com sucesso!");
        } else if (response.status === 400) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar a morada da empresa");
        }
      } else if (section === "contact") {
        dataToUpdate = { email: contact.email, phoneNumber: contact.phoneNumber, faxNumber: contact.faxNumber };
        const response = await updateCompanyContact(dataToUpdate, company.id!);
        if (response.status === 200) {
          setContact({ email: contact.email, phoneNumber: contact.phoneNumber, faxNumber: contact.faxNumber });
          closeEditingSection("Contactos da empresa atualizados com sucesso!");
        } else if (response.status === 400) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar os contactos da empresa");
        }
      } else if (section === "about") {
        dataToUpdate = { description: aboutInfo.description, status: aboutInfo.status, taxIdNumber: aboutInfo.taxIdNumber };
        const response = await updateCompanyAboutInfo(company.id!, dataToUpdate);
        if (response.status === 200) {
          setAboutInfo({ description: aboutInfo.description, status: aboutInfo.status, taxIdNumber: aboutInfo.taxIdNumber });
          closeEditingSection("Informação sobre a empresa atualizada com sucesso!");
        } else if (response.status === 400) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar a informação da empresa");
        }
      } else if (section === "schedule") {
        const response = await updateCompanySchedule(company.id!, schedule);
        if (response.status === 200) {
          closeEditingSection("Horário atualizado com sucesso!");
        } else if (response.status === 400) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar o horário da empresa");
        }
      }
    } catch (exception) {
      console.log(`Ocorreu um problema ao atualizar a empresa: ${exception}`);
    }
  };

  useEffect(() => {
    if (!company) return;
    setAddress({
      island: company.address.island || "",
      city: company.address.city || "",
      postalCode: company.address.postalCode || "",
      street: company.address.street || "",
      zone: company.address.zone || "",
    });
    setContact({
      email: company.email || "",
      phoneNumber: company.phoneNumber || "",
      faxNumber: company.faxNumber || "",
    });
    setAboutInfo({
      description: company.description || "",
      status: company.status,
      taxIdNumber: company.taxIdNumber || "",
    });
    setSchedule(normalizeSchedule(company.weeklySchedule));
  }, [company.id]);

  return (
    <>
      {/* ---- cabeçalho: nome + estado, estilo do painel ---- */}
      <div className="view-heading" style={{ marginTop: "1px" }}>{company.name}</div>
      <div className="view-sub" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className={companyStatus}>{company.status}</span>
        <span>{company.category?.replaceAll("_", " ")}</span>
      </div>
      <div>
        {company.imgS3UrlKeys && (
          <div style={{ marginTop: "12px", marginBottom: "15px" }}>
            <div className="biz-actions" style={{ width: "100%", marginBottom: "5px" }}>
              <button className="biz-btn edit" onClick={() => setcompanyImageUpload(company)}>
                <i className="bi bi-pencil"></i>
                {(company.imgS3UrlKeys?.length ?? 0) > 0 ? " Editar Imagens" : " Carregar Imagens"}
              </button>
            </div>
          </div>
        )}

        <ImageCarousel
          imageKeys={company.imgS3UrlKeys}
          width={'100qv'}
          height={140}
          altText={company.name}
        />
      </div>

      {/* ---- contactos + morada, duas colunas ---- */}
      <div className="company-overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="profile-section" style={{ marginBottom: 0 }}>
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-envelope-fill"></i>
              <span className="section-head-title">Contactos</span>
            </div>
            <button
              className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
              onClick={() => (isEditing("contact") ? cancelEditing() : startEditing("contact"))}
            >
              <i className="bi bi-pencil"></i> {isEditing("contact") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid">
            <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
              <span className="field-label">Número de Telefone</span>
              <span className="field-value">{contact.phoneNumber || "Não definido"}</span>
              <input className="field-input" id="inp-phoneNumber" type="text"
                value={contact.phoneNumber} onChange={contactInputChange} />
            </div>
            <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
              <span className="field-label">Número de Fax</span>
              <span className="field-value">{contact.faxNumber || "Não definido"}</span>
              <input className="field-input" id="inp-faxNumber" type="text"
                value={contact.faxNumber} onChange={contactInputChange} />
            </div>
            <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
              <span className="field-label">Email</span>
              <span className="field-value">{contact.email || "Não definido"}</span>
              <input className="field-input" id="inp-email" type="email"
                value={contact.email} onChange={contactInputChange} />
            </div>
          </div>

          {isEditing("contact") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
              <button className="btn-save" onClick={() => saveSection("contact")}>
                <i className="bi bi-check2"></i> Guardar Alterações
              </button>
            </div>
          )}
        </div>

        <div className="profile-section" style={{ marginBottom: 0 }}>
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-geo-alt-fill"></i>
              <span className="section-head-title">Morada</span>
            </div>
            <button
              className={`btn-edit ${isEditing("address") ? "editing" : ""}`}
              onClick={() => (isEditing("address") ? cancelEditing() : startEditing("address"))}
            >
              <i className="bi bi-pencil"></i> {isEditing("address") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid">
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Ilha</span>
              <span className="field-value">{address.island || "Não definido"}</span>
              <select
                className="field-input"
                id="inp-island"
                name="island"
                value={address.island ?? "SANTIAGO"}
                onChange={addressInputChange}
                style={{ width: "100%" }}
              >
                <option value="" disabled>Selecionar ilha</option>
                {ISLANDS.map((island) => (
                  <option key={island} value={island}>{island}</option>
                ))}
              </select>
            </div>

            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Cidade</span>
              <span className="field-value">{address.city || "Não definido"}</span>
              <input className="field-input" id="inp-city" type="text"
                value={address.city} onChange={addressInputChange} />
            </div>
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Zona</span>
              <span className="field-value">{address.zone || "Não definido"}</span>
              <input className="field-input" id="inp-zone" type="text"
                value={address.zone} onChange={addressInputChange} />
            </div>
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Código Postal</span>
              <span className="field-value">{address.postalCode || "Não definido"}</span>
              <input className="field-input" id="inp-postalCode" type="text"
                value={address.postalCode} onChange={addressInputChange} />
            </div>
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Rua</span>
              <span className="field-value">{address.street || "Não definido"}</span>
              <input className="field-input" id="inp-street" type="text"
                value={address.street} onChange={addressInputChange} />
            </div>
          </div>

          {isEditing("address") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
              <button className="btn-save" onClick={() => saveSection("address")}>
                <i className="bi bi-check2"></i> Guardar Alterações
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---- sobre, largura total ---- */}
      <div className="profile-section" style={{ marginTop: 16 }}>
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-card-text"></i>
            <span className="section-head-title">Sobre</span>
          </div>
          <button
            className={`btn-edit ${isEditing("about") ? "editing" : ""}`}
            onClick={() => (isEditing("about") ? cancelEditing() : startEditing("about"))}
          >
            <i className="bi bi-pencil"></i> {isEditing("about") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="fields-grid single">
          <div className={`field-group ${isEditing("about") ? "is-editing" : ""}`}>
            <span className="field-label">Descrição</span>
            <span className="field-value" style={{ whiteSpace: "pre-wrap" }}>
              {aboutInfo.description || "Nenhuma descrição fornecida."}
            </span>
            <textarea
              className="field-input"
              name="description"
              style={{ width: "100%" }}
              id="inp-description"
              rows={10}
              value={aboutInfo.description}
              onChange={aboutInfoChange}
            />
          </div>
          <div className={`field-group ${isEditing("about") ? "is-editing" : ""}`}>
            <span className="field-label">Estado</span>
            <span className="field-value" style={{ whiteSpace: "pre-wrap" }}>
              {aboutInfo.status || "Nenhuma descrição fornecida."}
            </span>
            <select name="status"
              id="inp-status"
              className="field-input"
              value={aboutInfo.status as string}
              onChange={aboutInfoChange}
            >
              <option value="" disabled>Selecionar Estado...</option>
              <option value="OPERATING">EM FUNCIONAMENTO</option>
              <option value="INACTIVE">INATIVA</option>
              <option value="CLOSED">FECHADA</option>
            </select>
          </div>
          <div className={`field-group ${isEditing("about") ? "is-editing" : ""}`}>
            <span className="field-label">NIF</span>
            <span className="field-value">{aboutInfo.taxIdNumber || "Não definido"}</span>
            <input className="field-input" id="inp-taxIdNumber" type="text" name="taxIdNumber"
              value={aboutInfo.taxIdNumber} onChange={aboutInfoChange} />
          </div>
        </div>

        {isEditing("about") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
            <button className="btn-save" onClick={() => saveSection("about")}>
              <i className="bi bi-check2"></i> Guardar Alterações
            </button>
          </div>
        )}
      </div>

      {/* ---- horário de funcionamento (editável) ---- */}
      <div className="profile-section" style={{ marginTop: 16 }}>
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-clock"></i>
            <span className="section-head-title">Horário de Funcionamento</span>
          </div>
          <button
            className={`btn-edit ${isEditing("schedule") ? "editing" : ""}`}
            onClick={() => (isEditing("schedule") ? cancelEditing() : startEditing("schedule"))}
          >
            <i className="bi bi-pencil"></i> {isEditing("schedule") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div style={{ padding: "16px 22px" }}>
          {isEditing("schedule") ? (
            <>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <input
                  type="checkbox"
                  checked={schedule.open247}
                  onChange={(e) => setOpen247(e.target.checked)}
                />
                Aberto 24/7
              </label>

              {!schedule.open247 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {SCHEDULE_DAYS.map(({ key, label }) => {
                    const day = schedule.daySchedule[key];
                    return (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 140px", minWidth: 0 }}>
                          <span style={{ flex: "0 0 70px", fontWeight: 500 }}>{label}</span>
                          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                            <input
                              type="checkbox"
                              checked={day.isClosed}
                              onChange={(e) => updateDay(key, { isClosed: e.target.checked })}
                            />
                            Fechado
                          </label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 240px", minWidth: 0 }}>
                          <input
                            type="time"
                            value={day.start}
                            disabled={day.isClosed}
                            onChange={(e) => updateDay(key, { start: e.target.value })}
                            style={timeInputStyle}
                          />
                          <span aria-hidden="true">—</span>
                          <input
                            type="time"
                            value={day.end}
                            disabled={day.isClosed}
                            onChange={(e) => updateDay(key, { end: e.target.value })}
                            style={timeInputStyle}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : schedule.open247 ? (
            <InfoRow label="Horário" value="Aberto 24/7" />
          ) : (
            SCHEDULE_DAYS.map(({ key, label }) => {
              const day = schedule.daySchedule[key];
              const value = day.isClosed ? "Fechado" : `${day.start} — ${day.end}`;
              return <InfoRow key={key} label={label} value={value} />;
            })
          )}
        </div>

        {isEditing("schedule") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>Cancelar</button>
            <button className="btn-save" onClick={() => saveSection("schedule")}>
              <i className="bi bi-check2"></i> Guardar Alterações
            </button>
          </div>
        )}
      </div>

      {/* ---- atualizações, apenas leitura ---- */}
      <div className="profile-section" style={{ marginTop: 16 }}>
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-clock-history"></i>
            <span className="section-head-title">Atualizações</span>
          </div>
        </div>
        <div style={{ padding: "16px 22px" }}>
          <InfoRow label="Criado em" value={company.createdAt} />
          <InfoRow label="Atualizado em" value={company.updatedAt} />
        </div>
      </div>

      {/* colapsar as duas colunas em ecrãs pequenos */}
      <style>{`
        @media (max-width: 991px) {
          .company-overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {companyImageUpload && (
        <UpdateCompanyImageModal
          onClose={() => setcompanyImageUpload(null)}
          isOpen={companyImageUpload !== null}
          company={companyImageUpload}
        />
      )}
    </>
  );
}

export default CompanyOverView;