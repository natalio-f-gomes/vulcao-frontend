import { useState } from "react";
import {
  BUSINESS_TYPE,
  BusinessRegistrationModel,
  TimeRange,
  WeekDays,
  WeeklySchedule,
} from "../../../Interfaces/businesses";
import { buildImageMetadata, uploadFileToS3 } from "../../../Validators/Image";
import { RegisterBusiness } from "../../../Requests/business";
import {
  COUNTRIES,
  ImageUploadRequest,
  ISLANDS,
} from "../../../Interfaces/global";
import { postImageKeys } from "../../../Requests/global";

const MAX_IMAGES = 3; // keep in sync with the backend

interface Properties {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employerId: string;
}

function RegisterBusinessModal({
  isOpen,
  onClose,
  onSuccess,
  employerId,
}: Properties) {
  const username = localStorage.getItem("username");

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [registrationForm, setCompanyRegistrationForm] =
    useState<BusinessRegistrationModel>({
      name: "",
      type: "OUTROS",
      description: "",
      phoneNumber: "",
      email: "",
      address: {
        country: "CABO_VERDE",
        island: "SANTIAGO",
        state: "",
        city: "",
        zone: "",
        street: "",
        postalCode: "",
      },
      status: "OPERACIONAL",
      imagesMetadata: [],
      creatorId: employerId!,
      revenue: 0,
      weeklySchedule: null,
    });

  const addressFields = [
    "country",
    "island",
    "city",
    "zone",
    "street",
    "postalCode",
  ];

  const DAYS: { key: WeekDays; label: string }[] = [
    { key: "SEGUNDA_FEIRA", label: "Segunda" },
    { key: "TERÇA_FEIRA", label: "Terça" },
    { key: "QUARTA_FEIRA", label: "Quarta" },
    { key: "QUINTA_FEIRA", label: "Quinta" },
    { key: "SEXTA_FEIRA", label: "Sexta" },
    { key: "SABADO", label: "Sábado" },
    { key: "DOMINGO", label: "Domingo" },
  ];

  const [open247, setOpen247] = useState<boolean>(false);
  const [daySchedule, setDaySchedule] = useState<Record<WeekDays, TimeRange>>(
    () => {
      const init = {} as Record<WeekDays, TimeRange>;
      DAYS.forEach(({ key }) => {
        init[key] = { start: "09:00", end: "18:00", isClosed: false };
      });
      return init;
    },
  );

  const updateDay = (day: WeekDays, patch: Partial<TimeRange>) => {
    setDaySchedule((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    if (addressFields.includes(name)) {
      setCompanyRegistrationForm((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setCompanyRegistrationForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------- image picking (capped) ---------- */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const filesArray = Array.from(event.target.files);
    event.target.value = ""; // allow re-selecting the same file

    const remaining = MAX_IMAGES - selectedImages.length;
    if (remaining <= 0) {
      setError(`You can attach at most ${MAX_IMAGES} images.`);
      return;
    }
    const accepted = filesArray.slice(0, remaining);
    if (accepted.length < filesArray.length) {
      setError(`Only ${remaining} more image(s) allowed; extras ignored.`);
    } else {
      setError(null);
    }

    setSelectedImages((prev) => [...prev, ...accepted]);
    setImagePreviews((prev) => [
      ...prev,
      ...accepted.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    setError(null);
  };

  /* ---------- register -> presign -> S3 PUT -> confirm ---------- */
  const handleApiCall = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const weeklySchedule: WeeklySchedule = {
      daySchedule,
      open247,
    };
    try {
      const metadata = await buildImageMetadata(selectedImages);
      // IMPORTANT: send the request object that carries the metadata
      const companyRegistrationRequest: BusinessRegistrationModel = {
        ...registrationForm,
        imagesMetadata: metadata,
        weeklySchedule,
      };

      const response = await RegisterBusiness(companyRegistrationRequest);

      // Validações:
      // - NIF pode estar vazio, mas se preenchido deve ter 9 dígitos
      // - Nome e descrição não podem estar vazios
      // - Descrição não pode exceder 5000 caracteres
      // - Nome não pode exceder 500 caracteres
      // - Email deve ter entre 5 e 50 caracteres
      // - Ilha, cidade e zona são obrigatórios

      if (response.status === 201) {
        alert("Empresa registada com sucesso");
        onSuccess();
        onClose();
        return;
      }
      if (response.status === 204) {
        alert(
          "Empresa registada com sucesso. Poderá adicionar imagens mais tarde.",
        );
        onSuccess();
        onClose();
        return;
      }
      if (response.status >= 400 && response.status < 500) {
        alert(await response.text());
        return;
      }

      if (response.status === 200) {
        // registada + URLs pré-assinadas devolvidas para as imagens
        const payload = await response.json();
        const companyId: string = payload.entityId;
        const preSignResult: Array<{ url: string; key: string }> =
          payload.uploadResult;

        try {
          // enviar cada ficheiro para o seu URL correspondente (a ordem é preservada)
          await Promise.all(
            selectedImages.map((file, i) =>
              uploadFileToS3(preSignResult[i].url, file),
            ),
          );

          // confirmar para que o backend verifique, promova e persista as chaves
          const uploadData: ImageUploadRequest = {
            s3PresignKeys: preSignResult.map((p) => p.key),
            entityId: companyId,
            entityType: "BUSINESS",
          };
          const confirmResponse = await postImageKeys(uploadData);
          if (confirmResponse.ok) {
            alert("Empresa e todas as imagens registadas com sucesso.");
          } else {
            alert("Empresa registada, mas a confirmação das imagens falhou.");
          }
        } catch (uploadError) {
          console.error(
            "Erro durante a transferência de imagens para o S3:",
            uploadError,
          );
          setError("Empresa registada, mas algumas imagens falharam o upload.");
        }

        onSuccess();
        onClose();
        return;
      } else {
        alert("There was an issue registering a new business");
      }
    } catch (err) {
      setError(`Registo falhou: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const atLimit = selectedImages.length >= MAX_IMAGES;
  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Registar Novo Negócio</span>
          <button className="m-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form id="registrationForm" onSubmit={handleApiCall}>
          <div className="m-body">
            {error && (
              <div
                style={{
                  color: "#dc3545",
                  backgroundColor: "#f8d7da",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </div>
            )}

            {/* ---------- Imagens da Empresa ---------- */}
            <div className="m-field">
              <label className="m-label">
                Imagens da Empresa (máx. {MAX_IMAGES})
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {imagePreviews.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "80px",
                      height: "80px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Pré-visualização ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}

                {!atLimit && (
                  <label
                    style={{
                      width: "80px",
                      height: "80px",
                      border: "2px dashed #ccc",
                      borderRadius: "6px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      backgroundColor: "#f9f9f9",
                      color: "#666",
                      fontSize: "0.8rem",
                    }}
                  >
                    <i
                      className="bi bi-camera"
                      style={{ fontSize: "1.2rem", marginBottom: "2px" }}
                    ></i>
                    <span>Adicionar</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* ---------- Informação da Empresa ---------- */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Nome da Empresa *</label>
                <input
                  className="m-input"
                  type="text"
                  placeholder="ex: Shop"
                  name="name"
                  value={registrationForm.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="m-field">
                <label className="m-label">Tipo *</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={registrationForm.type ?? ""}
                  onChange={handleInputChange}
                >
                  <option value="">Selecionar Categoria</option>
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
            </div>

            <div className="m-field">
              <label className="m-label">Descrição</label>
              <textarea
                className="m-textarea"
                name="description"
                placeholder="Breve descrição..."
                required
                value={registrationForm.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Telefone</label>
                <input
                  className="m-input"
                  type="tel"
                  name="phoneNumber"
                  placeholder="974 1234"
                  required
                  value={registrationForm.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="m-field">
                <label className="m-label">Email</label>
                <input
                  className="m-input"
                  type="email"
                  name="email"
                  placeholder="empresa@exemplo.com"
                  value={registrationForm.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="m-field row">
              <div className="m-field col-6">
                <label className="m-label">Receita</label>
                <input
                  className="m-input"
                  type="number"
                  name="revenue"
                  placeholder="ex: 100000"
                  required
                  value={registrationForm.revenue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-6">
                <label className="m-label">Estatuto</label>
                <select
                  className="m-select form-select"
                  name="status"
                  id="status"
                  value={registrationForm.status ?? ""}
                  onChange={handleInputChange}
                >
                  <option value="">ESTADO</option>
                  <option value={"OPERACIONAL"}>OPERACIONAL</option>
                  <option value={"INATIVO"}>INATIVO</option>
                  <option value={"FEACHADO"}>FEACHADO</option>
                </select>
              </div>
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
                  checked={open247}
                  onChange={(e) => setOpen247(e.target.checked)}
                />
                Aberto 24/7
              </label>

              {!open247 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {DAYS.map(({ key, label }) => {
                    const day = daySchedule[key];
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
                        {/* day name + "Fechado" toggle */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
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
                              gap: "4px",
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

                        {/* time range — grows, shrinks, and wraps to its own line when tight */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flex: "1 1 240px",
                            minWidth: 0,
                          }}
                        >
                          <input
                            className="m-input"
                            type="time"
                            value={day.start}
                            disabled={day.isClosed}
                            onChange={(e) =>
                              updateDay(key, { start: e.target.value })
                            }
                            style={{
                              flex: "1 1 0",
                              minWidth: 0,
                              width: "auto",
                            }}
                          />
                          <span aria-hidden="true">—</span>
                          <input
                            className="m-input"
                            type="time"
                            value={day.end}
                            disabled={day.isClosed}
                            onChange={(e) =>
                              updateDay(key, { end: e.target.value })
                            }
                            style={{
                              flex: "1 1 0",
                              minWidth: 0,
                              width: "auto",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="m-field">
              <label className="m-label">
                <i className="bi bi-geo-alt-fill me-1"></i> Morada
              </label>
            </div>
            <div className="m-row">
              <div className="m-field">
                <div className="m-field">
                  <label className="m-label">Pais</label>
                  <select
                    className="m-select form-select"
                    name="country"
                    value={registrationForm.address.country ?? "CABO_VERDE"}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Selecionar Pais
                    </option>
                    {COUNTRIES.map((island) => (
                      <option key={island} value={island}>
                        {island.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="m-field">
                <label className="m-label">Estado (Opcional)</label>
                <input
                  className="m-input"
                  type="text"
                  name="state"
                  placeholder="ex: "
                  value={registrationForm.address.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="m-field">
                <label className="m-label">Ilha (Opcional)</label>
                <input
                  className="m-input"
                  type="text"
                  name="island"
                  placeholder="ex: Santiago"
                  value={registrationForm.address.island}
                  onChange={handleInputChange}
                />
              </div>

              <div className="m-field">
                <label className="m-label">Cidade *</label>
                <input
                  className="m-input"
                  type="text"
                  name="city"
                  placeholder="ex: Praia"
                  required
                  value={registrationForm.address.city}
                  onChange={handleInputChange}
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
                  placeholder="ex: Plateau"
                  value={registrationForm.address.zone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="m-field">
                <label className="m-label">Código Postal(Opcional)</label>
                <input
                  className="m-input"
                  type="text"
                  name="postalCode"
                  placeholder="ex: 7600"
                  value={registrationForm.address.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Rua(Opcional)</label>
              <input
                className="m-input"
                type="text"
                name="street"
                placeholder="ex: Rua do Município"
                value={registrationForm.address.street}
                onChange={handleInputChange}
              />
            </div>

            <div className="m-footer">
              <button
                className="m-btn-cancel"
                type="button"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button className="m-btn-save" type="submit" disabled={loading}>
                <i className="bi bi-check2"></i>{" "}
                {loading ? "A guardar..." : "Guardar Empresa"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterBusinessModal;
