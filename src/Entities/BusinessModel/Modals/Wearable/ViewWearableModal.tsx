import { useEffect, useState } from "react";
import { WearableModel } from "../../../../Interfaces/offerings";
import ImageCarousel from "../../../../Components/imageCarousel";
import { formatDateTime } from "../../../Shopping/types";

interface Parameters {
  isOpen: boolean;
  onClose: () => void;
  wearableToView: WearableModel;
  businessName: string;
}

function ViewWearableModal({
  isOpen,
  onClose,
  wearableToView,
  businessName,
}: Parameters) {
  const [wearable, setWearable] = useState<WearableModel>({
    name: "",
    wearableType: "ROUPAS",
    description: "",
    stock: 0,
    unit: "SINGULAR",
    price: 0,
    businessId: "",
    currency: "CVE",
    type: "WEARABLE",
    imagesMetadata: [],
    creatorId: "",
    updatedBy: "",
    imgS3UrlKeys: [],
    brand: "",
    colors: "",
    material: "",
    size: "",
  });

  useEffect(() => {
    if (wearableToView) {
      setWearable(wearableToView);
    }
  }, [wearableToView]);

  if (!isOpen) return null;

  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Detalhes do Vestível</span>
          <button className="m-close" onClick={() => onClose()}>
            &times;
          </button>
        </div>
        <div className="m-body">
          {/* Cabeçalho da imagem do produto — primeira imagem mostrada, setas quando há várias */}
          <div style={{ marginTop: "12px", marginBottom: "15px" }}>
            <ImageCarousel
              imageKeys={wearable.imgS3UrlKeys}
              width={300}
              height={300}
              altText={wearable.name}
            />
          </div>

          {/* Informação Básica do Produto */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Nome do Vestível </label>
              <input
                className="m-input"
                type="text"
                placeholder="ex: Salmão Fresco"
                name="name"
                value={wearable.name}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Tipo de Vestível</label>
              <select className="m-input" name="productType" disabled>
                <option value="">
                  {wearable.wearableType.replaceAll("_", " ")}
                </option>
              </select>
            </div>
          </div>

          {/* Preço e Stock */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Preço por Unidade</label>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  className="m-input"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  name="pricePerUnit"
                  value={wearable.price}
                  readOnly
                />
                <select className="m-input" name="productType" disabled>
                  <option value="">{wearable.currency}</option>
                </select>
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Tipo de Unidade </label>
              <select className="m-input" name="productType" disabled>
                <option value="">{wearable.unit.replaceAll("_", " ")}</option>
              </select>
            </div>
          </div>

          {/* Detalhes de Inventário */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Stock</label>
              <input
                className="m-input"
                type="number"
                placeholder="ex: 100"
                name="stock"
                value={wearable.stock}
                required
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Marca</label>
              <input
                className="m-input"
                type="text"
                value={wearable.brand}
                required
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Cores</label>
              <input
                className="m-input"
                type="text"
                value={wearable.colors}
                required
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Materiais</label>
              <input
                className="m-input"
                type="text"
                value={wearable.material}
                required
                readOnly
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
              value={wearable.description}
              style={{ resize: "none" }}
              readOnly
            ></textarea>
          </div>

          <div className="m-field">
            <label className="m-label">Criado a</label>
            <input
              className="m-input"
              type="text"
              style={{ fontSize: "12px", fontWeight: "bold" }}
              value={formatDateTime(wearable.createdAt!) || "N/A"}
              readOnly
              disabled
            />
          </div>

          <div className="m-field">
            <label className="m-label">Atualizado a</label>
            <input
              className="m-input"
              type="text"
              style={{ fontSize: "12px", fontWeight: "bold" }}
              value={formatDateTime(wearable.updatedAt!) || "N/A"}
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
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
export default ViewWearableModal;
