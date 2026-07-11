// src/pages/Executive-Dashboard/components/EditBusinessModal.tsx

import { useState, useEffect } from "react";
import {
  WeekDays,
  WeeklySchedule,
  TimeRange,
  BusinessModel,
  BUSINESS_TYPE,
} from "../../../Interfaces/businesses";
import { COUNTRIES, ISLANDS } from "../../../Interfaces/global";

const DAYS: { key: WeekDays; label: string }[] = [
  { key: "SEGUNDA_FEIRA", label: "Segunda" },
  { key: "TERÇA_FEIRA", label: "Terça" },
  { key: "QUARTA_FEIRA", label: "Quarta" },
  { key: "QUINTA_FEIRA", label: "Quinta" },
  { key: "SEXTA_FEIRA", label: "Sexta" },
  { key: "SABADO", label: "Sábado" },
  { key: "DOMINGO", label: "Domingo" },
];

// A full schedule with sensible defaults for every day.
const emptySchedule = (): WeeklySchedule => {
  const daySchedule = {} as Record<WeekDays, TimeRange>;
  DAYS.forEach(({ key }) => {
    daySchedule[key] = { start: "09:00", end: "18:00", isClosed: false };
  });
  return { daySchedule, open247: false };
};

// Fills any missing days so the form always has all 7, even for
// businesses saved before the schedule existed (weeklySchedule === null).
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

//Business is the brain and passes the edit business modal these properties
//this component call the onsave, it will call the onsave method on the businessview
interface Properties {
  isOpen: boolean;
  business: BusinessModel | null;
  onClose: () => void;
  onSave: (updated: BusinessModel) => void;
}

function EditBusinessModal({ isOpen, onClose, business, onSave }: Properties) {
  const [formData, setFormData] = useState<BusinessModel>({
    id: "",
    name: "",
    type: "OUTROS",
    description: "",
    phoneNumber: "",
    email: "",
    status: "OPERACIONAL",
    revenue: 0,
    createdAt: "",
    updatedAt: "",
    creatorId: "",
    address: {
      country: "CABO_VERDE",
      state: "",
      island: "FOGO",
      city: "",
      zone: "",
      street: "",
      postalCode: "",
    },
    weeklySchedule: null,
    imgS3UrlKeys: [],
    imagesMetadata: [],
  });

  // When a different business is clicked for editing,
  // re-populate the form — like @ModelAttribute filling a form bean.
  // Normalize the schedule so all 7 days exist even if the stored one is null/partial.
  useEffect(() => {
    if (business) {
      setFormData({
        ...business,
        weeklySchedule: normalizeSchedule(business.weeklySchedule),
      });
    }
  }, [business]);

  if (!isOpen || !business) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Address fields need to be nested — check if the field belongs to address
    const addressFields = ["island", "city", "zone", "street", "postalCode"];

    if (addressFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------- schedule handlers (write into formData.weeklySchedule) ---------- */
  const handleOpen247 = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: {
        ...(prev.weeklySchedule ?? emptySchedule()),
        open247: value,
      },
    }));
  };

  const updateDay = (day: WeekDays, patch: Partial<TimeRange>) => {
    setFormData((prev) => {
      const ws = prev.weeklySchedule ?? emptySchedule();
      return {
        ...prev,
        weeklySchedule: {
          ...ws,
          daySchedule: {
            ...ws.daySchedule,
            [day]: { ...ws.daySchedule[day], ...patch },
          },
        },
      };
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  // Safe view of the schedule for rendering (covers the brief gap before
  // the effect normalizes, and the initial null state).
  const schedule = formData.weeklySchedule ?? emptySchedule();

  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Atualizar Negócio</span>
          <button className="m-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="m-body">
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Business Name *</label>
              <input
                className="m-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="m-field">
              <label className="m-label">Category *</label>
              <select
                className="form-select"
                id="type"
                name="category"
                value={formData.type ?? ""}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {BUSINESS_TYPE.map((cat: string) => {
                  // Formats "FAST_FOOD" -> "Fast Food", "AI_ML_COMPANY" -> "Ai Ml Company"
                  const formattedLabel = cat
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase());

                  return (
                    <option key={cat} value={cat}>
                      {formattedLabel}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="m-field">
            <label className="m-label">Description</label>
            <textarea
              className="m-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Phone</label>
              <input
                className="m-input"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Email</label>
              <input
                className="m-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="m-field">
              <label className="m-label">Revenue</label>
              <input
                className="m-input"
                type="number"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="m-field">
            <label className="m-label">Status</label>
            <select
              className="m-select "
              name="status"
              value={formData.status ?? ""}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="OPERACIONAL">OPERACIONAL</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          {/* ---------- Horário de Funcionamento ---------- */}
          <div className="m-field">
            <label className="m-label">
              <i className="bi bi-clock me-1"></i> Horário de Funcionamento
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={schedule.open247}
                onChange={(e) => handleOpen247(e.target.checked)}
              />
              Aberto 24/7
            </label>

            {!schedule.open247 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {DAYS.map(({ key, label }) => {
                  const day = schedule.daySchedule[key];
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ width: "80px" }}>{label}</span>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.85rem",
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

                      <input
                        className="m-input"
                        type="time"
                        value={day.start}
                        disabled={day.isClosed}
                        onChange={(e) =>
                          updateDay(key, { start: e.target.value })
                        }
                        style={{ width: "120px" }}
                      />
                      <span>—</span>
                      <input
                        className="m-input"
                        type="time"
                        value={day.end}
                        disabled={day.isClosed}
                        onChange={(e) =>
                          updateDay(key, { end: e.target.value })
                        }
                        style={{ width: "120px" }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="m-field">
            <label className="m-label">
              <i className="bi bi-geo-alt-fill me-1"></i> Address
            </label>
          </div>

          <div className="m-row">
            <div className="m-field">
              <div className="m-field">
                <label className="m-label">País</label>
                <select
                  className="m-select form-select"
                  name="island"
                  value={formData.address.country ?? "CABO_VERDE"}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Selecionar ilha
                  </option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Estado</label>
              <input
                className="m-input"
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>
            <div className="m-field">
              <label className="m-label">City</label>
              <input
                className="m-input"
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Zone</label>
              <input
                className="m-input"
                type="text"
                name="zone"
                value={formData.address.zone}
                onChange={handleChange}
              />
            </div>
            <div className="m-field">
              <label className="m-label">Postal Code</label>
              <input
                className="m-input"
                type="text"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="m-field">
            <label className="m-label">Street</label>
            <input
              className="m-input"
              type="text"
              name="street"
              value={formData.address.street}
              onChange={handleChange}
            />
          </div>

          <div className="m-footer">
            <button className="m-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="m-btn-save" onClick={handleSave}>
              <i className="bi bi-check2"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBusinessModal;
