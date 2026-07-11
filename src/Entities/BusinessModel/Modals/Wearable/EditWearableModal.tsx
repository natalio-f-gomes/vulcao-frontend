import { useEffect, useState } from "react";
import {
  CURRENCIES,
  UNIT_OF_MEASUREMENT_LIST,
  WEARABLE_TYPE_LIST,
  WearableModel,
} from "../../../../Interfaces/offerings";
import { isWearableValid } from "../../../../Validators/Offerings";

interface Parameters {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: WearableModel) => void;
  wearableToEdit: WearableModel;
  companyName: string;
}

function EditWearableModal({
  isOpen,
  onClose,
  onSave,
  wearableToEdit,
  companyName,
}: Parameters) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [wearable, setWearable] = useState<WearableModel>({
    name: "",
    wearableType: "ROUPAS",
    description: "",
    stock: 0,
    unit: "PAR",
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

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setWearable((prev: WearableModel) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (wearableToEdit) {
      setWearable(wearableToEdit);
    }
  }, [wearableToEdit]);

  const handleUpdate = () => {
    if (!isWearableValid(wearable)) {
      setLoading(false);
      return;
    }
    console.log("Wearable data to update: ", JSON.stringify(wearable));
    onSave(wearable);
  };

  if (!isOpen || !wearableToEdit) return null;
  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Editar {wearableToEdit.name}</span>
          <button className="m-close" onClick={() => onClose()}>
            &times;
          </button>
        </div>

        <form id="productRegistrationForm">
          <div className="m-body">
            {/* Informação Básica do Produto */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Nome do Vestível</label>
                <input
                  className="m-input"
                  type="text"
                  placeholder="ex: Salmão Fresco"
                  name="name"

                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="m-field">
                <label className="m-label">Tipo</label>
                <select
                  className="m-input"
                  name="wearableType"
                  value={wearable.wearableType}
                  onChange={handleInputChange}
                  required
                >
                  <option value={wearableToEdit.wearableType}>
                    {wearableToEdit.wearableType.replaceAll("_", " ")}
                  </option>
                  {WEARABLE_TYPE_LIST.map((category: string) => {
                    return (
                      <option key={category} value={category}>
                        {category.replaceAll("_", " ")}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Preço e Stock */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Preço</label>
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
                <label className="m-label">Unidade</label>
                <select
                  className="m-input"
                  name="unit"
                  style={{ width: "100%" }}
                  onChange={handleInputChange}
                  required
                >
                  {UNIT_OF_MEASUREMENT_LIST.map((unit: string) => {
                    return (
                      <option key={unit} value={unit}>
                        {unit.replaceAll("_", " ")}
                      </option>
                    );
                  })}
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
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="m-field">
                <label className="m-label">Marca</label>
                <input
                  className="m-input"
                  type="text"
                  placeholder="ex: Salmão Fresco"
                  name="brand"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Cores</label>
                <input
                  className="m-input"
                  type="text"
                  placeholder="ex: Salmão Fresco"
                  name="colors"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="m-field">
                <label className="m-label">Materiais</label>
                <input
                  className="m-input"
                  type="text"
                  placeholder="ex: Salmão Fresco"
                  name="material"
                  onChange={handleInputChange}
                  required
                />
              </div>{" "}
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
              ></textarea>
            </div>

            {/* Metadados (Indicadores visuais apenas leitura) */}
            <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem" }}>
              {/* <div className="m-field">
              <label className="m-label">Adicionado por</label>
              <input className="m-input" type="text" value={`@${product.creatorId}`} readOnly disabled />
            </div> */}
              <div className="m-field">
                <label className="m-label">Negócio</label>
                <input
                  className="m-input"
                  type="text"
                  value={companyName || "N/A"}
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
              <button
                className="m-btn-save"
                type="button"
                onClick={handleUpdate}
              >
                <i className="bi bi-check2"></i> Atualizar Vestível
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditWearableModal;
