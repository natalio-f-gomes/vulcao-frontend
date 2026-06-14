import { useState } from "react";
import { CompanyRegistrationModel, CompanyImageUploadRequest } from "../../../../api/interfaces";
import { postCompanyImageKeys, registerCompany } from "../../../../api/requests";
import { BUSINESS_CATEGORIES } from "../../../../api/categories";
import { buildImageMetadata, uploadFileToS3 } from "../../../../api/ImageValidatorService";

const MAX_IMAGES = 2; // keep in sync with the backend

interface Properties {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function RegisterBusinessModal({ isOpen, onClose, onSuccess }: Properties) {
  const username = localStorage.getItem("username");

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [companyRegistrationForm, setCompanyRegistrationForm] = useState<CompanyRegistrationModel>({
    name: "",
    category: null,
    taxIdNumber: "",
    description: "",
    phoneNumber: "",
    faxNumber: "",
    email: "",
    address: { island: "", city: "", zone: "", street: "", postalCode: "" },
    status: null,
    imagesMetadata: [],
    creatorUsername: username!,
    revenue: 0,
  });

  const addressFields = ["island", "city", "zone", "street", "postalCode"];

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    setImagePreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    setError(null);
  };

  /* ---------- register -> presign -> S3 PUT -> confirm ---------- */
  const handleApiCall = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const metadata = await buildImageMetadata(selectedImages);
      // IMPORTANT: send the request object that carries the metadata
      const companyRegistrationRequest: CompanyRegistrationModel = {
        ...companyRegistrationForm,
        imagesMetadata: metadata,
      };

      const response = await registerCompany(companyRegistrationRequest);

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
          alert("Empresa registada com sucesso. Poderá adicionar imagens mais tarde.");
          onSuccess();
          onClose();
          return;
      }
      if (response.status === 409) {
          alert("Já existe uma empresa com este nome. Por favor, escolha um nome diferente.");
          return;
      }

      if (response.status === 200) {
          // registada + URLs pré-assinadas devolvidas para as imagens
          const payload = await response.json();
          const companyId: string = payload.companyId;
          const preSignResult: Array<{ url: string; key: string }> = payload.uploadResult;

          try {
              // enviar cada ficheiro para o seu URL correspondente (a ordem é preservada)
              await Promise.all(
                  selectedImages.map((file, i) => uploadFileToS3(preSignResult[i].url, file))
              );

              // confirmar para que o backend verifique, promova e persista as chaves
              const uploadData: CompanyImageUploadRequest = {
                  s3PresignKeys: preSignResult.map((p) => p.key),
                  companyId: companyId,
              };
              const confirmResponse = await postCompanyImageKeys(uploadData);
              if (confirmResponse.ok) {
                  alert("Empresa e todas as imagens registadas com sucesso.");
              } else {
                  alert("Empresa registada, mas a confirmação das imagens falhou.");
              }
          } catch (uploadError) {
              console.error("Erro durante a transferência de imagens para o S3:", uploadError);
              setError("Empresa registada, mas algumas imagens falharam o upload.");
          }

          onSuccess();
          onClose();
          return;
      }

      if (response.status === 409) {
          alert("Já existe uma empresa com o mesmo NIF ou email.");
      } else if (response.status === 403) {
          alert("ACESSO NEGADO");
      } else if (response.status === 400) {
          alert("Por favor, preencha todos os campos obrigatórios e selecione o estado da empresa.");
      } else {
          setError(`Registo falhou (${response.status})`);
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
          <span className="m-head-title">Registar Nova Empresa</span>
          <button className="m-close" onClick={onClose}>&times;</button>
        </div>
        <form id="companyRegistrationForm" onSubmit={handleApiCall}>
          <div className="m-body">

            {error && (
              <div style={{ color: "#dc3545", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            {/* ---------- Imagens da Empresa ---------- */}
            <div className="m-field">
              <label className="m-label">Imagens da Empresa (máx. {MAX_IMAGES})</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {imagePreviews.map((url, index) => (
                  <div
                    key={index}
                    style={{ position: "relative", width: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid #ccc" }}
                  >
                    <img src={url} alt={`Pré-visualização ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute", top: "2px", right: "2px",
                        background: "rgba(0,0,0,0.6)", color: "#fff", border: "none",
                        borderRadius: "50%", width: "18px", height: "18px",
                        cursor: "pointer", fontSize: "12px",
                        display: "flex", alignItems: "center", justifyContent: "center", lineHeight: "1",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}

                {!atLimit && (
                  <label
                    style={{
                      width: "80px", height: "80px",
                      border: "2px dashed #ccc", borderRadius: "6px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      cursor: "pointer", backgroundColor: "#f9f9f9",
                      color: "#666", fontSize: "0.8rem",
                    }}
                  >
                    <i className="bi bi-camera" style={{ fontSize: "1.2rem", marginBottom: "2px" }}></i>
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
                <input className="m-input" type="text" placeholder="ex: ShopLane Boutique" name="name" value={companyRegistrationForm.name} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Categoria *</label>
                <select className="form-select" id="type" name="category" value={companyRegistrationForm.category ?? ""} onChange={handleInputChange}>
                  <option value="">Selecionar Categoria</option>
                  {BUSINESS_CATEGORIES.map((cat: string) => {
                    const formattedLabel = cat
                      .toLowerCase()
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase());
                    return (
                      <option key={cat} value={cat}>{formattedLabel}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="m-field">
              <label className="m-label">Descrição</label>
              <textarea className="m-textarea" name="description" placeholder="Breve descrição..." required value={companyRegistrationForm.description} onChange={handleInputChange}></textarea>
            </div>

            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Número de Identificação Fiscal</label>
                <input className="m-input" type="tel" name="taxIdNumber" placeholder="123-232434233"  value={companyRegistrationForm.taxIdNumber} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Número de Fax</label>
                <input className="m-input" type="tel" name="faxNumber" placeholder="123-232434233"  value={companyRegistrationForm.faxNumber} onChange={handleInputChange} />
              </div>
            </div>

            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Telefone</label>
                <input className="m-input" type="tel" name="phoneNumber" placeholder="+1 (555) 000-0000" required value={companyRegistrationForm.phoneNumber} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Email</label>
                <input className="m-input" type="email" name="email" placeholder="empresa@exemplo.com" value={companyRegistrationForm.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="m-field row">
              <div className="m-field col-6">
                <label className="m-label">Receita</label>
                <input className="m-input" type="number" name="revenue" placeholder="ex: 100000" required value={companyRegistrationForm.revenue} onChange={handleInputChange} />
              </div>
              <div className="col-6">
                <label className="m-label">Estado *</label>
                <select className="m-select form-select" name="status" id="status" value={companyRegistrationForm.status ?? ""} onChange={handleInputChange}>
                  <option value="">ESTADO</option>
                  <option value={"OPERATING"}>EM FUNCIONAMENTO</option>
                  <option value={"INACTIVE"}>INATIVO</option>
                  <option value={"CLOSED"}>FECHADO</option>
                </select>
              </div>
            </div>

            <div className="m-field">
              <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Morada</label>
            </div>
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Ilha</label>
                <input className="m-input" type="text" name="island" placeholder="ex: Santiago" required value={companyRegistrationForm.address.island} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Cidade</label>
                <input className="m-input" type="text" name="city" placeholder="ex: Praia" required value={companyRegistrationForm.address.city} onChange={handleInputChange} />
              </div>
            </div>
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Zona</label>
                <input className="m-input" type="text" name="zone" placeholder="ex: Plateau" required value={companyRegistrationForm.address.zone} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Código Postal</label>
                <input className="m-input" type="text" name="postalCode" placeholder="ex: 7600" value={companyRegistrationForm.address.postalCode} onChange={handleInputChange} />
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Rua</label>
              <input className="m-input" type="text" name="street" placeholder="ex: Rua do Município" value={companyRegistrationForm.address.street} onChange={handleInputChange} />
            </div>

            <div className="m-footer">
              <button className="m-btn-cancel" type="button" onClick={onClose} disabled={loading}>Cancelar</button>
              <button className="m-btn-save" type="submit" disabled={loading}>
                <i className="bi bi-check2"></i> {loading ? "A guardar..." : "Guardar Empresa"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterBusinessModal;