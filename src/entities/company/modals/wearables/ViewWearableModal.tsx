import { useEffect, useState } from "react";
import { WearableModel } from "../../../../api/interfaces";
import ProductImageCarousel from "../../../../components/ImageCarousel";

interface Parameters {
  isOpen: boolean;
  onClose: () => void;
  wearableToView: WearableModel;
  companyName: string;
}

function ViewWearableModal({
  isOpen,
  onClose,
  wearableToView,
  companyName,
}: Parameters) {
  const [wearable, setWearable] = useState<WearableModel>({
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
    companyId: "",
    creatorId: "",
    imagesMetadata: [],
  });

  useEffect(() => {
    if (wearableToView) {
      setWearable(wearableToView);
    }
  }, [wearableToView]);

  if (!isOpen) return null;

  // Helper function to format category label
  const formatCategoryLabel = (category: string) => {
    if (!category) return "N/A";
    return category
      .replaceAll("_", " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
          <div
            style={{
              marginTop: "12px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ProductImageCarousel
              imageKeys={wearable.imgS3UrlKeys}
              width={300}
              height={300}
              altText={wearable.name}
            />
          </div>

          {/* Informação Básica do Produto */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Nome do Produto *</label>
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
              <label className="m-label">Categoria *</label>
              <input
                className="m-input"
                type="text"
                value={formatCategoryLabel(wearable.category)}
                readOnly
              />
            </div>
          </div>

          {/* Preço e Stock */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Preço *</label>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  className="m-input"
                  type="text"
                  value={`${wearable.price} ${wearable.currency}`}
                  readOnly
                />
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Stock *</label>
              <input
                className="m-input"
                type="text"
                value={wearable.stock}
                readOnly
              />
            </div>
          </div>

          {/* Wearable Specific Fields */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Marca *</label>
              <input
                className="m-input"
                type="text"
                value={wearable.brand || "N/A"}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Tamanho *</label>
              <input
                className="m-input"
                type="text"
                value={wearable.size || "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Cor *</label>
              <input
                className="m-input"
                type="text"
                value={wearable.color || "N/A"}
                readOnly
              />
            </div>
            <div className="m-field">
              <label className="m-label">Material *</label>
              <input
                className="m-input"
                type="text"
                value={wearable.material || "N/A"}
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
              value={wearable.description || "Nenhuma descrição fornecida."}
              style={{ resize: "none" }}
              readOnly
            />
          </div>

          {/* Metadados (Indicadores visuais apenas leitura) */}
          <div
            className="m-row"
            style={{ opacity: 0.7, fontSize: "0.8rem", display: "flex" }}
          >
            <div className="m-field">
              <label className="m-label">Atualizado por</label>
              <input
                className="m-input"
                type="text"
                value={`@${wearable.updatedBy ?? "Não atualizado"}`}
                readOnly
                disabled
              />
            </div>
            <div className="m-field">
              <label className="m-label">Empresa</label>
              <input
                className="m-input"
                type="text"
                value={companyName || "N/A"}
                readOnly
                disabled
              />
            </div>
          </div>
          <div
            className="m-row"
            style={{ opacity: 0.7, fontSize: "0.8rem", display: "flex" }}
          >
            <div className="m-field">
              <label className="m-label">Criado a</label>
              <input
                className="m-input"
                type="text"
                value={
                  wearable.createdAt
                    ? new Date(wearable.createdAt).toLocaleDateString()
                    : "N/A"
                }
                readOnly
                disabled
              />
            </div>
            <div className="m-field">
              <label className="m-label">Atualizado a</label>
              <input
                className="m-input"
                type="text"
                value={
                  wearable.updatedAt
                    ? new Date(wearable.updatedAt).toLocaleDateString()
                    : "N/A"
                }
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
    </div>
  );
}

export default ViewWearableModal;
