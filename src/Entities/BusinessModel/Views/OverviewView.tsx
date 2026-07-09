import { useEffect, useState } from "react";
import { useUserAuthManager } from "../../../Auth/Auth-Handler";
import {
  BUSINESS_TYPE,
  BusinessAboutInfo,
  BusinessContact,
  BusinessModel,
  TimeRange,
  WeekDays,
  WeeklySchedule,
} from "../../../Interfaces/businesses";
import { AddressModel, COUNTRIES } from "../../../Interfaces/global";
import { useNavigate } from "react-router-dom";
import {
  updateBusinessAboutInfo,
  updateBusinessAddress,
  updateBusinessContact,
  updateBusinessSchedule,
} from "../../../Requests/business";
import ImageCarousel from "../../../Components/imageCarousel";
import {
  isAddressValid,
  isPhoneNumberValid,
} from "../../../Validators/Gloabal";
import { isEmailValid } from "../../../Validators/Authentication";
import UploadImageModal from "../../../Components/Modals/UpdateImageModal";
import { formatDateTime } from "../../Shopping/types";

interface Parameters {
  business: BusinessModel;
}

const SCHEDULE_DAYS: { key: WeekDays; label: string }[] = [
  { key: "SEGUNDA_FEIRA", label: "Segunda" },
  { key: "TERÇA_FEIRA", label: "Terça" },
  { key: "QUARTA_FEIRA", label: "Quarta" },
  { key: "QUINTA_FEIRA", label: "Quinta" },
  { key: "SEXTA_FEIRA", label: "Sexta" },
  { key: "SABADO", label: "Sábado" },
  { key: "DOMINGO", label: "Domingo" },
];

const emptySchedule = (): WeeklySchedule => {
  const daySchedule = {} as Record<WeekDays, TimeRange>;
  SCHEDULE_DAYS.forEach(({ key }) => {
    daySchedule[key] = { start: "09:00", end: "18:00", isClosed: false };
  });
  return { daySchedule, open247: false };
};

const normalizeSchedule = (
  ws: WeeklySchedule | null | undefined,
): WeeklySchedule => {
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
      <span className="field-label" style={{ alignSelf: "center" }}>
        {label}
      </span>
      <span
        style={{
          color: "var(--ink)",
          fontWeight: 500,
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function BusinessOverView({ business }: Parameters) {
  const companyStatus =
    business.status === "OPERACIONAL"
      ? "biz-status-badge active"
      : "biz-status-badge inactive";
  const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [companyImageUpload, setcompanyImageUpload] =
    useState<BusinessModel | null>(null);
  const [aboutInfo, setAboutInfo] = useState<BusinessAboutInfo>({
    description: "",
    status: business.status,
    name: "",
    type: business.type,
  });
  const [address, setAddress] = useState<AddressModel>({
    country: business.address.country,
    state: business.address.state,
    island: business.address.island,
    city: business.address.city,
    postalCode: business.address.postalCode,
    street: business.address.street,
    zone: business.address.zone,
  });
  const [contact, setContact] = useState<BusinessContact>({
    email: business.email,
    phoneNumber: business.phoneNumber,
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
  const addressInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setAddress((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const aboutInfoChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement
    >,
  ) => {
    const { name, value } = e.target;
    setAboutInfo((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- schedule handlers ---------- */
  const setOpen247 = (value: boolean) =>
    setSchedule((prev) => ({ ...prev, open247: value }));

  const updateDay = (day: WeekDays, patch: Partial<TimeRange>) =>
    setSchedule((prev) => ({
      ...prev,
      daySchedule: {
        ...prev.daySchedule,
        [day]: { ...prev.daySchedule[day], ...patch },
      },
    }));

  const startEditing = (section: string) => setEditingSection(section);
  const cancelEditing = () => {
    // revert schedule edits if the user cancels that section
    if (editingSection === "schedule")
      setSchedule(normalizeSchedule(business.weeklySchedule));
    setEditingSection(null);
  };
  const isEditing = (section: string) => editingSection === section;
  const closeEditingSection = (alertMessage: string) => {
    setEditingSection(null);
    alert(alertMessage);
  };

  const saveSection = async (section: string) => {
    if (!business) return;
    let dataToUpdate: any = {};
    try {
      if (section === "address") {
        if (!isAddressValid(address)) {
          return;
        }
        dataToUpdate = {
          country: address.country,
          state: address.state,
          island: address.island,
          city: address.city,
          street: address.street,
          zone: address.zone,
          postalCode: address.postalCode,
        };
        const response = await updateBusinessAddress(
          business.id!,
          dataToUpdate,
        );
        if (response.status === 200) {
          setAddress({
            country: address.country,
            state: address.state,
            island: address.island,
            city: address.city,
            street: address.street,
            zone: address.zone,
            postalCode: address.postalCode,
          });
          closeEditingSection("Morada da empresa atualizada com sucesso!");
        } else if (response.status >= 400 && response.status < 500) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar a morada da empresa");
        }
      } else if (section === "contact") {
        if (!isEmailValid(contact.email)) {
          alert(
            "Por favor, insira um e-mail válido neste formato: nome@dominio.com",
          );
        }
        if (!isPhoneNumberValid(contact.phoneNumber)) {
          alert(
            "Por favor, insira um numero de telefone válido (exemplo: +238 111 3333).",
          );
        }
        dataToUpdate = {
          email: contact.email,
          phoneNumber: contact.phoneNumber,
        };
        const response = await updateBusinessContact(
          business.id!,
          dataToUpdate,
        );
        if (response.status === 200) {
          setContact({
            email: contact.email,
            phoneNumber: contact.phoneNumber,
          });
          closeEditingSection("Contactos da empresa atualizados com sucesso!");
        } else if (response.status >= 400 && response.status < 500) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar os contactos da empresa");
        }
      } else if (section === "about") {
        dataToUpdate = {
          description: aboutInfo.description,
          status: aboutInfo.status,
          name: aboutInfo.name,
          type: aboutInfo.type,
        };
        const response = await updateBusinessAboutInfo(
          business.id!,
          dataToUpdate,
        );
        if (response.status === 200) {
          setAboutInfo({
            description: aboutInfo.description,
            status: aboutInfo.status,
            name: aboutInfo.name,
            type: aboutInfo.type,
          });
          closeEditingSection(
            "Informação sobre a empresa atualizada com sucesso!",
          );
        } else if (response.status >= 400 && response.status < 500) {
          alert(await response.text());
        } else {
          alert("Falha ao atualizar a informação da empresa");
        }
      } else if (section === "schedule") {
        const response = await updateBusinessSchedule(business.id!, schedule);
        if (response.status === 200) {
          closeEditingSection("Horário atualizado com sucesso!");
        } else if (response.status >= 400 && response.status < 500) {
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
    if (!business) return;
    setAddress({
      country: business.address.country || "CABO_VERDE",
      state: business.address.state || "",
      island: business.address.island || "",
      city: business.address.city || "",
      postalCode: business.address.postalCode || "",
      street: business.address.street || "",
      zone: business.address.zone || "",
    });
    setContact({
      email: business.email || "",
      phoneNumber: business.phoneNumber || "",
    });
    setAboutInfo({
      description: business.description || "",
      status: business.status,
      name: business.name || "",
      type: business.type,
    });
    setSchedule(normalizeSchedule(business.weeklySchedule));
  }, [business.id]);

  return (
    <>
      {/* ---- cabeçalho: nome + estado, estilo do painel ---- */}
      <div className="view-heading" style={{ marginTop: "1px" }}>
        {business.name}
      </div>
      <div
        className="view-sub"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <span className={companyStatus}>{business.status}</span>
        <span>{business.type?.replaceAll("_", " ")}</span>
      </div>
      <div>
        {business.imgS3UrlKeys && (
          <div style={{ marginTop: "12px", marginBottom: "15px" }}>
            <div
              className="biz-actions"
              style={{ width: "100%", marginBottom: "5px" }}
            >
              <button
                className="biz-btn edit"
                onClick={() => setcompanyImageUpload(business)}
              >
                <i className="bi bi-pencil"></i>
                {(business.imgS3UrlKeys?.length ?? 0) > 0
                  ? " Editar Imagens"
                  : " Carregar Imagens"}
              </button>
            </div>
          </div>
        )}

        <ImageCarousel
          imageKeys={business.imgS3UrlKeys}
          width={"100qv"}
          height={140}
          altText={business.name}
        />
      </div>

      {/* ---- contactos + morada, duas colunas ---- */}
      <div
        className="company-overview-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
        <div className="profile-section" style={{ marginBottom: 0 }}>
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-envelope-fill"></i>
              <span className="section-head-title">Contactos</span>
            </div>
            <button
              className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
              onClick={() =>
                isEditing("contact") ? cancelEditing() : startEditing("contact")
              }
            >
              <i className="bi bi-pencil"></i>{" "}
              {isEditing("contact") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid">
            <div
              className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}
            >
              <span className="field-label">Número de Telefone</span>
              <span className="field-value">
                {contact.phoneNumber || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-phoneNumber"
                type="text"
                value={contact.phoneNumber}
                onChange={contactInputChange}
              />
            </div>

            <div
              className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}
            >
              <span className="field-label">Email</span>
              <span className="field-value">
                {contact.email || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-email"
                type="email"
                value={contact.email}
                onChange={contactInputChange}
              />
            </div>
          </div>

          {isEditing("contact") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>
                Cancelar
              </button>
              <button
                className="btn-save"
                onClick={() => saveSection("contact")}
              >
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
              onClick={() =>
                isEditing("address") ? cancelEditing() : startEditing("address")
              }
            >
              <i className="bi bi-pencil"></i>{" "}
              {isEditing("address") ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="fields-grid">
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Country</span>
              <span className="field-value">
                {address.country || "Não definido"}
              </span>
              <select
                className="field-input"
                id="inp-country"
                name="country"
                value={address.country ?? "CABO_VERDE"}
                onChange={addressInputChange}
                style={{ width: "100%" }}
              >
                <option value="" disabled>
                  Selecionar Pais
                </option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Estado(Opcional)</span>
              <span className="field-value">
                {address.state || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-state"
                type="text"
                value={address.state}
                onChange={addressInputChange}
              />
            </div>

            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Ilha(Opcional)</span>
              <span className="field-value">
                {address.island || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-island"
                type="text"
                value={address.city}
                onChange={addressInputChange}
              />
            </div>

            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Cidade</span>
              <span className="field-value">
                {address.city || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-city"
                type="text"
                value={address.city}
                onChange={addressInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Zona</span>
              <span className="field-value">
                {address.zone || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-zone"
                type="text"
                value={address.zone}
                onChange={addressInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Código Postal</span>
              <span className="field-value">
                {address.postalCode || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-postalCode"
                type="text"
                value={address.postalCode}
                onChange={addressInputChange}
              />
            </div>
            <div
              className={`field-group ${isEditing("address") ? "is-editing" : ""}`}
            >
              <span className="field-label">Rua</span>
              <span className="field-value">
                {address.street || "Não definido"}
              </span>
              <input
                className="field-input"
                id="inp-street"
                type="text"
                value={address.street}
                onChange={addressInputChange}
              />
            </div>
          </div>

          {isEditing("address") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>
                Cancelar
              </button>
              <button
                className="btn-save"
                onClick={() => saveSection("address")}
              >
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
            onClick={() =>
              isEditing("about") ? cancelEditing() : startEditing("about")
            }
          >
            <i className="bi bi-pencil"></i>{" "}
            {isEditing("about") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="fields-grid single">
          <div
            className={`field-group ${isEditing("about") ? "is-editing" : ""}`}
          >
            <span className="field-label">Nome</span>
            <span className="field-value" style={{ whiteSpace: "pre-wrap" }}>
              {aboutInfo.name || "Nenhuma descrição fornecida."}
            </span>
            <input
              className="field-input"
              name="name"
              style={{ width: "100%" }}
              id="inp-name"
              value={aboutInfo.name}
              onChange={aboutInfoChange}
            />
          </div>
          <div className="row">
            <div
              className={`field-group ${isEditing("about") ? "is-editing" : ""} col-6`}
            >
              <span className="field-label">Tipo</span>
              <span className="field-value" style={{ whiteSpace: "pre-wrap" }}>
                {aboutInfo.type.replaceAll("_", " ") ||
                  "Nenhuma descrição fornecida."}
              </span>
              <select
                className="field-input"
                id="inp-type"
                name="type"
                value={aboutInfo.type ?? ""}
                onChange={aboutInfoChange}
              >
                <option value="">Selecionar Tipo</option>
                {BUSINESS_TYPE.map((cat: string) => {
                  const formattedLabel = cat.replace(/_/g, " ");
                  return (
                    <option key={cat} value={cat}>
                      {formattedLabel}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              className={`field-group ${isEditing("about") ? "is-editing" : ""} col-6`}
            >
              <span className="field-label">Estado</span>
              <span className="field-value" style={{ whiteSpace: "pre-wrap" }}>
                {aboutInfo.status || "Nenhuma descrição fornecida."}
              </span>
              <select
                name="status"
                id="inp-status"
                className="field-input"
                value={aboutInfo.status as string}
                onChange={aboutInfoChange}
              >
                <option value="" disabled>
                  Selecionar Estado...
                </option>
                <option value="OPERACIONAL">OPERACIONAL</option>
                <option value="INATIVO">INATIVO</option>
                <option value="FECHADO">FECHADO</option>
              </select>{" "}
            </div>
          </div>

          <div
            className={`field-group ${isEditing("about") ? "is-editing" : ""}`}
          >
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
        </div>

        {isEditing("about") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>
              Cancelar
            </button>
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
            onClick={() =>
              isEditing("schedule") ? cancelEditing() : startEditing("schedule")
            }
          >
            <i className="bi bi-pencil"></i>{" "}
            {isEditing("schedule") ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div style={{ padding: "16px 22px" }}>
          {isEditing("schedule") ? (
            <>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <input
                  type="checkbox"
                  checked={schedule.open247}
                  onChange={(e) => setOpen247(e.target.checked)}
                />
                Aberto 24/7
              </label>

              {!schedule.open247 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {SCHEDULE_DAYS.map(({ key, label }) => {
                    const day = schedule.daySchedule[key];
                    return (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            flex: "1 1 140px",
                            minWidth: 0,
                          }}
                        >
                          <span style={{ flex: "0 0 70px", fontWeight: 500 }}>
                            {label}
                          </span>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: "0.85rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={day.isClosed}
                              onChange={(e) =>
                                updateDay(key, { isClosed: e.target.checked })
                              }
                            />
                            Fechado
                          </label>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flex: "1 1 240px",
                            minWidth: 0,
                          }}
                        >
                          <input
                            type="time"
                            value={day.start}
                            disabled={day.isClosed}
                            onChange={(e) =>
                              updateDay(key, { start: e.target.value })
                            }
                            style={timeInputStyle}
                          />
                          <span aria-hidden="true">—</span>
                          <input
                            type="time"
                            value={day.end}
                            disabled={day.isClosed}
                            onChange={(e) =>
                              updateDay(key, { end: e.target.value })
                            }
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
              const value = day.isClosed
                ? "Fechado"
                : `${day.start} — ${day.end}`;
              return <InfoRow key={key} label={label} value={value} />;
            })
          )}
        </div>

        {isEditing("schedule") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>
              Cancelar
            </button>
            <button
              className="btn-save"
              onClick={() => saveSection("schedule")}
            >
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
          <InfoRow
            label="Criado em"
            value={formatDateTime(business.createdAt)}
          />
          <InfoRow
            label="Atualizado em"
            value={formatDateTime(business.updatedAt)}
          />
        </div>
      </div>

      {/* colapsar as duas colunas em ecrãs pequenos */}
      <style>{`
        @media (max-width: 991px) {
          .company-overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {companyImageUpload && (
        <UploadImageModal
          onClose={() => setcompanyImageUpload(null)}
          isOpen={companyImageUpload !== null}
          entityId={business.id!}
          entityType={"BUSINESS"}
          entityName={business.name}
          existingImages={business.imgS3UrlKeys!}
        />
      )}
    </>
  );
}

export default BusinessOverView;
