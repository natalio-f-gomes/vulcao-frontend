import { useState } from "react";
import { AddWearableModel, CompanyModel } from "../../../../api/interfaces";
import {
  CURRENCIES,
  WEARABLES_CATEGORY_LIST,
} from "../../../../api/categories";
import { addWearable, postOfferingImageKeys } from "../../../../api/requests";
import {
  buildImageMetadata,
  getImageDimensions,
  uploadFileToS3,
} from "../../../../api/ImageValidatorService";
import { OfferingImageUploadRequest } from "../../../../api/interfaces";

interface Parameters {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: CompanyModel;
}

function AddWearableModal({ isOpen, onClose, onSuccess, company }: Parameters) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Local state to manage selected file objects and preview URLs
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [item, setItem] = useState<AddWearableModel>({
    name: "",
    brand: "",
    description: "",
    color: "",
    price: 0,
    material: "",
    size: "",
    offeringType: "WEARABLE",
    category: "OUTROS",
    stock: 0,
    currency: "CVE",
    companyId: company.id!,
    creatorId: "",
    imagesMetadata: [],
  });

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setItem((prev: AddWearableModel) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles adding new images to the stack
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  // Handles removing an image by index
  const removeImage = (indexToRemove: number) => {
    // Revoke the Object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleAddWearableItem = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    let errorMessage =
      "Ocorreu um erro inesperado. Por favor, tente novamente.";
    for (const image of selectedImages) {
      console.log("Dimesions: ", getImageDimensions(image));
    }
    const metadata = buildImageMetadata(selectedImages);
    const itemRequest: AddWearableModel = { ...item, imagesMetadata: metadata };

    const response = await addWearable(itemRequest);
    console.log("Response Adding Wearable: ", response);
    if (response.status === 204) {
      alert(
        "Vestível adicionado com sucesso. Você pode adicionar imagens mais tarde.",
      );
      onSuccess();
      onClose();
      return;
    } else if (response.status === 400) {
      try {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();

          // Handle different API response structures
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (data.details) {
            errorMessage = data.details;
          } else if (typeof data === "string") {
            errorMessage = data;
          } else {
            errorMessage = JSON.stringify(data);
          }
        } else {
          // Handle plain text responses
          const text = await response.text();
          errorMessage =
            text || response.statusText || `Erro ${response.status}`;
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        // Fallback to status text if parsing fails
        errorMessage = response.statusText || `Erro ${response.status}`;
      }
      alert(errorMessage);
      setError(errorMessage);
    } else if (response.status === 200) {
      const preSignUrlResponse = await response.json();
      const productId: string = preSignUrlResponse.offeringId;

      const preSignResult: Array<{ url: ""; key: string }> =
        preSignUrlResponse.uploadResult;

      try {
        console.log("selectedImages:", selectedImages);
        console.log("preSignResult:", preSignResult);
        console.log("selectedImages length:", selectedImages.length);
        console.log("preSignResult length:", preSignResult.length);
        // 3. Map through the files and trigger S3 uploads in parallel
        const uploadPromises = selectedImages.map((image, index) => {
          // Pull out the URL belonging to this exact index matching the image order
          const s3PresignUrl = preSignResult[index].url;
          const s3PresignKey = preSignResult[index].key;
          console.log("S3 Signed URL: ", s3PresignUrl);
          console.log("S3 Signed KEY: ", s3PresignKey);
          setLoading(true);
          return uploadFileToS3(s3PresignUrl, image);
        });

        try {
          await Promise.all(uploadPromises);
          const keys = preSignResult.map((p) => p.key);
          const uploadData: OfferingImageUploadRequest = {
            s3PresignKeys: keys,
            offeringId: productId,
            offeringType: "WEARABLE",
          };
          const postImgDataResponse = await postOfferingImageKeys(uploadData);
          console.log("postImgDataResponse: ", postImgDataResponse);
          alert("Vestível e todas as imagens adicionados com sucesso.");
          setLoading(false);
        } catch (uploadError) {
          console.error("Error during image transfer to S3:", uploadError);
          setError("Product saved, but some images failed to upload.");
        }
      } catch (uploadError) {
        console.error("Error during image transfer to S3:", uploadError);
        setError("Failed to upload images. Please check connection.");
      }

      onSuccess();
      onClose();
      setLoading(false);
    }

    setLoading(false);
  };

  if (!isOpen) return null;
  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          A carregar ...
        </div>
      )}
      <div className="m-overlay open">
        <div className="m-box">
          <div className="m-head">
            <span className="m-head-title">Adicionar Novo Vestível</span>
            <button className="m-close" onClick={() => onClose()}>
              &times;
            </button>
          </div>
          <form id="productRegistrationForm" onSubmit={handleAddWearableItem}>
            <div className="m-body">
              {/* Campo de Imagens do Produto */}
              <div className="m-field">
                <label className="m-label">Imagens do Vestiveis</label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {/* Contentor de Pré-visualizações */}
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

                  {/* Quadrado para Carregar Imagem */}
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
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              {/* Informação Básica do Produto */}
              <div className="m-row">
                <div className="m-field">
                  <label className="m-label">Nome do Vestivel *</label>
                  <input
                    className="m-input"
                    type="text"
                    placeholder="ex: Calção de verão"
                    name="name"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="m-field">
                  <label className="m-label">Tipo de Vestivel *</label>
                  <select
                    className="m-input"
                    name="category"
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecionar Tipo</option>
                    {WEARABLES_CATEGORY_LIST.map((category: string) => {
                      const label = category
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ");
                      return (
                        <option key={category} value={category}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Preço e Stock */}
              <div className="m-row">
                <div className="m-field">
                  <label className="m-label">Preço do Vestivel *</label>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      className="m-input"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      name="price"
                      onChange={handleInputChange}
                      required
                    />
                    <select
                      className="m-input"
                      name="currency"
                      style={{ width: "80px" }}
                      onChange={handleInputChange}
                      required
                    >
                      {CURRENCIES.map((currency: string) => {
                        return (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="m-field">
                  <label className="m-label">Tamanho</label>
                  <input
                    className="m-input"
                    type="size"
                    name="size"
                    placeholder="XL"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Detalhes de Inventário */}
              <div className="m-row">
                <div className="m-field">
                  <label className="m-label">Stock Inicial *</label>
                  <input
                    className="m-input"
                    type="number"
                    placeholder="ex: 100"
                    name="stock"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="m-field">
                  <label className="m-label">Cor</label>
                  <input
                    className="m-input"
                    type="text"
                    name="color"
                    placeholder="Vermelho"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="m-field">
                  <label className="m-label">Marca</label>
                  <input
                    className="m-input"
                    type="text"
                    name="brand"
                    placeholder="Adidas"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="m-field">
                  <label className="m-label">Material</label>
                  <input
                    className="m-input"
                    type="text"
                    name="material"
                    placeholder="Algodão"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="m-field">
                <label className="m-label">Descrição</label>
                <textarea
                  className="m-input"
                  rows={4}
                  placeholder="Descreva as características do produto, qualidade ou notas..."
                  name="description"
                  onChange={handleInputChange}
                  style={{ resize: "none" }}
                  required
                ></textarea>
              </div>

              {/* Metadados (Indicadores visuais apenas leitura) */}
              <div
                className="m-row"
                style={{ opacity: 0.7, fontSize: "0.8rem" }}
              >
                <div className="m-field">
                  <label className="m-label">Adicionado por</label>
                  <input
                    className="m-input"
                    type="text"
                    value={`@${localStorage.getItem("username")}`}
                    readOnly
                    disabled
                  />
                </div>
                <div className="m-field">
                  <label className="m-label">Empresa</label>
                  <input
                    className="m-input"
                    type="text"
                    value={company.name || "N/A"}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="m-footer" style={{ marginTop: "20px" }}>
                <button
                  className="m-btn-cancel"
                  type="button"
                  onClick={() => onClose()}
                >
                  Cancelar
                </button>
                <button className="m-btn-save" type="submit" disabled={loading}>
                  <i className="bi bi-check2"></i>{" "}
                  {loading ? "A guardar..." : "Guardar Produto"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default AddWearableModal;
