import { useEffect, useState } from "react";
import { AddProductModel, ProductModel } from "../../../../api/interfaces";
import { CURRENCIES, ProductCategories } from "../../../../api/categories";

interface Parameters {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProductModel) => void;
  productToEdit: ProductModel;
  companyName: string;
}

function EditProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  companyName,
}: Parameters) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductModel>({
    id: "",
    name: "",
    productType: "OUTROS",
    expirationDate: "",
    description: "",
    stock: 0,
    unitType: "",
    pricePerUnit: 0,
    companyId: "",
    currency: "CVE",
    imgS3UrlKeys: [],
  });

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setProduct((prev: AddProductModel) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [productToEdit]);

  const handleProductUpdate = () => {
    console.log("Product data to update: ", JSON.stringify(product));
    onSave(product);
  };

  if (!isOpen || !productToEdit) return null;
  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Editar {productToEdit.name}</span>
          <button className="m-close" onClick={() => onClose()}>
            &times;
          </button>
        </div>

        <form id="productRegistrationForm">
          <div className="m-body">
            {/* Informação Básica do Produto */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Nome do Produto *</label>
                <input
                  className="m-input"
                  type="text"
                  placeholder="ex: Salmão Fresco"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="m-field">
                <label className="m-label">Tipo de Produto *</label>
                <select
                  className="m-input"
                  name="productType"
                  onChange={handleInputChange}
                  required
                >
                  <option value={product.productType}>
                    {product.productType}
                  </option>
                  {ProductCategories.map((category: string) => {
                    const label = category.replaceAll("_", " ").toUpperCase();
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
                  <input
                    className="m-input"
                    type="number"
                    step="0.01"
                    value={product.pricePerUnit}
                    placeholder="0.00"
                    name="pricePerUnit"
                    onChange={handleInputChange}
                    required
                  />
                  <select
                    className="m-input"
                    name="currency"
                    value={product.currency}
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
            </div>

            {/* Detalhes de Inventário */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Stock Inicial *</label>
                <input
                  className="m-input"
                  type="number"
                  placeholder="ex: 100"
                  value={product.stock}
                  name="stock"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="m-field">
                <label className="m-label">Data de Validade</label>
                <input
                  className="m-input"
                  type="date"
                  name="expirationDate"
                  value={product.expirationDate}
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
                value={product.description}
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
                onClick={handleProductUpdate}
              >
                <i className="bi bi-check2"></i> Atualizar Produto
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditProductModal;
