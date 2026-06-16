import { useState } from "react";
import { AddProductModel, CompanyModel } from "../../../../api/interfaces";
import {  CURRENCIES, ProductCategories, UNIT_TYPES } from "../../../../api/categories";
import { addProduct, postOfferingImageKeys } from "../../../../api/requests";
import { companyName } from "../../../../api/global";
import { hanldeResponseStatus } from "../../views/StaffView";
import { buildImageMetadata, Dimensions, getImageDimensions, PresignBatchRequest, uploadFileToS3 } from "../../../../api/ImageValidatorService";
import { OfferingImageUploadRequest } from "../../../../api/interfaces";

interface Parameters {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: CompanyModel;
}

function AddProductModal({ isOpen, onClose, onSuccess, company }: Parameters) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Local state to manage selected file objects and preview URLs
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [product, setProduct] = useState<AddProductModel>({
    name: "",
    productType: "OUTROS",
    expirationDate: "",
    description: "",
    stock: 0,
    unitType: "",
    pricePerUnit: 0,
    companyId: company.id,
    currency: "CVE",
    creatorUsername: "",
    offeringType: "PRODUCT",
    imagesMetadata: []
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setProduct((prev: AddProductModel) => ({
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
    
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddProduct = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    for(const image of selectedImages){
       console.log("Dimesions: ",  getImageDimensions(image));
    }
    const metadata = buildImageMetadata(selectedImages);
    const productRequest: AddProductModel = {...product, imagesMetadata:metadata}

    const response = await addProduct(productRequest);
    console.log("Response Adding Prodcut: ", response);
    if (response.status === 204) {
      alert("Product Successfully Added. You can Add images later");
      onSuccess();
      onClose();
      return;
    } else if (response.status === 200) {

      const preSignUrlResponse = await response.json();
      const productId: string = preSignUrlResponse.offeringId;
  
      const preSignResult: Array<{ url: string; key: string }> = preSignUrlResponse.uploadResult;
     

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
        console.log("S3 Signed URL: ", s3PresignUrl)
        console.log("S3 Signed KEY: ", s3PresignKey)
        return uploadFileToS3(s3PresignUrl, image );
        setLoading(true)
      });

     try {
        await Promise.all(uploadPromises);
        const keys = preSignResult.map((p) => p.key);
        const uploadData: OfferingImageUploadRequest = { s3PresignKeys: keys, offeringId: productId, offeringType: "PRODUCT" };
        const postImgDataResponse =  await postOfferingImageKeys(uploadData);  
        console.log("postImgDataResponse: ",postImgDataResponse);
          alert("Product and all images successfully added.");
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

    else {
      hanldeResponseStatus(response.status);
    }
    setLoading(false);
  };

  if (!isOpen) return null;
  return (
  <>
  {loading && (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
      A carregar ...
    </div>
  )}
  <div className="m-overlay open">
    <div className="m-box">
      <div className="m-head">
        <span className="m-head-title">Adicionar Novo Produto</span>
        <button className="m-close" onClick={() => onClose()}>&times;</button>
      </div>
      <form id="productRegistrationForm" onSubmit={handleAddProduct}>
        <div className="m-body">

          {/* Campo de Imagens do Produto */}
          <div className="m-field">
            <label className="m-label">Imagens do Produto</label>
            
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              
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
                    border: "1px solid #ccc" 
                  }}
                >
                  <img 
                    src={url} 
                    alt={`Pré-visualização ${index}`} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
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
                      lineHeight: "1"
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
                  fontSize: "0.8rem"
                }}
              >
                <i className="bi bi-camera" style={{ fontSize: "1.2rem", marginBottom: "2px" }}></i>
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
    <label className="m-label">Nome do Produto *</label>
    <input className="m-input" type="text" placeholder="ex: Salmão Fresco" name="name" onChange={handleInputChange} required />
  </div>
  <div className="m-field">
    <label className="m-label">Tipo de Produto *</label>
    <select className="m-input" name="productType" onChange={handleInputChange} required>
      <option value="">Selecionar Tipo</option>
      {ProductCategories.map((category: string) => {
        const label = category
          .replaceAll("_", " ")
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
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
              <label className="m-label">Preço por Unidade *</label>
              <div style={{ display: "flex", gap: "5px" }}>
                <input className="m-input" type="number" step="0.01" placeholder="0.00" name="pricePerUnit" onChange={handleInputChange} required />
                <select className="m-input" name="currency" style={{ width: "80px" }} onChange={handleInputChange} required>
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
              <label className="m-label">Tipo de Unidade *</label>
              <select className="m-input" name="unitType" onChange={handleInputChange} required>
                <option value="">Selecionar Unidade</option>
                {UNIT_TYPES.map((unit: string) => {
                  return (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Detalhes de Inventário */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Stock Inicial *</label>
              <input className="m-input" type="number" placeholder="ex: 100" name="stock" onChange={handleInputChange} required />
            </div>
            <div className="m-field">
              <label className="m-label">Data de Validade</label>
              <input className="m-input" type="date" name="expirationDate" onChange={handleInputChange} required />
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
          <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem" }}>
            <div className="m-field">
              <label className="m-label">Adicionado por</label>
              <input className="m-input" type="text" value={`@${localStorage.getItem("username")}`} readOnly disabled />
            </div>
            <div className="m-field">
              <label className="m-label">Empresa</label>
              <input className="m-input" type="text" value={companyName || "N/A"} readOnly disabled />
            </div>
          </div>

          <div className="m-footer" style={{ marginTop: "20px" }}>
            <button className="m-btn-cancel" type="button" onClick={() => onClose()}>Cancelar</button>
            <button className="m-btn-save" type="submit" disabled={loading}>
              <i className="bi bi-check2"></i> {loading ? "A guardar..." : "Guardar Produto"}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</>
)
}
export default AddProductModal;