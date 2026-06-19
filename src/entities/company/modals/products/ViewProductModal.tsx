import { useEffect, useState } from "react";
import { AddProductModel, CompanyModel, ProductModel, RegisterStaffModel } from "../../../../api/interfaces";
import { addressFields, ALL_PERMISSIONS, CURRENCIES, ProductCategories, UNIT_TYPES } from "../../../../api/categories";
import { Permissions } from "../../../../api/interfaces";
import { addProduct, registerStaff } from "../../../../api/requests";
import { companyName } from "../../../../api/global";
import ProductImageCarousel from "../../../../components/ImageCarousel";

interface Parameters{
    isOpen: boolean;
    onClose: ()  => void;
    productToView: ProductModel,
    companyName: string
}

function ViewProductModal({isOpen, onClose, productToView}:Parameters){
    const [product, setProduct] = useState<ProductModel>({
      name: "",
      productType: "OUTROS",
      expirationDate:"",
      description:"",
      stock:0,
      unitType: "",
      pricePerUnit:0,
      companyId : "",
      currency: "CVE",
      imgS3UrlKeys:[]
    });



    useEffect(()=>{
        if(productToView){
            setProduct(productToView)
        }
    },[productToView]);


    if(!isOpen) return null;

return (
  <div className="m-overlay open">
    <div className="m-box">
      <div className="m-head">
        <span className="m-head-title">Detalhes do Produto</span>
        <button className="m-close" onClick={() => onClose()}>&times;</button>
      </div>
      <div className="m-body">
        {/* Cabeçalho da imagem do produto — primeira imagem mostrada, setas quando há várias */}
        <div style={{ marginTop: "12px", marginBottom: "15px" }}>
          <ProductImageCarousel
            imageKeys={product.imgS3UrlKeys}
            width={300}
            height={300}
            altText={product.name}
          />
        </div>
        
        {/* Informação Básica do Produto */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Nome do Produto *</label>
            <input className="m-input" type="text" placeholder="ex: Salmão Fresco" name="name" value={product.name} readOnly/>
          </div>
          <div className="m-field">
            <label className="m-label">Tipo de Produto *</label>
            <select className="m-input" name="productType" disabled>
              <option value="">{product.productType}</option>
            </select>
          </div>
        </div>

        {/* Preço e Stock */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Preço por Unidade *</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <input className="m-input" type="number" step="0.01" placeholder="0.00" name="pricePerUnit" value={product.pricePerUnit} readOnly/>
              <select className="m-input" name="productType" disabled>
                <option value="">{product.currency}</option>
              </select>
            </div>
          </div>
          <div className="m-field">
            <label className="m-label">Tipo de Unidade *</label>
            <select className="m-input" name="productType" disabled>
              <option value="">{product.unitType}</option>
            </select>
          </div>
        </div>

        {/* Detalhes de Inventário */}
        <div className="m-row">
          <div className="m-field">
            <label className="m-label">Stock Inicial *</label>
            <input className="m-input" type="number" placeholder="ex: 100" name="stock" value={product.stock} required readOnly/>
          </div>
          <div className="m-field">
            <label className="m-label">Data de Validade</label>
            <input className="m-input" type="date" name="expirationDate" value={product.expirationDate} required readOnly/>
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
            value={product.description}
            style={{ resize: "none" }} readOnly
          ></textarea>
        </div>

        {/* Metadados (Indicadores visuais apenas leitura) */}
        <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem", display: 'flex' }}>
          {/* <div className="m-field">
            <label className="m-label">Adicionado por</label>
            <input className="m-input" type="text" value={`@${product.creatorUsername}`} readOnly disabled />
          </div> */}
          <div className="m-field">
            <label className="m-label">Atualizado por</label>
            <input className="m-input" type="text" value={`@${product.updatedBy ?? "Não atualizado"}`} readOnly disabled />
          </div>
          <div className="m-field">
            <label className="m-label">Empresa</label>
            <input className="m-input" type="text" value={companyName || "N/A"} readOnly disabled />
          </div>
        </div>
        <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem", display: 'flex' }}>
          <div className="m-field">
            <label className="m-label">Criado a</label>
            <input className="m-input" type="text" value={product.createdAt || "N/A"} readOnly disabled />
          </div>
          <div className="m-field">
            <label className="m-label">Atualizado a</label>
            <input className="m-input" type="text" value={product.updatedAt || "N/A"} readOnly disabled />
          </div>
        </div>

        <div className="m-footer" style={{ marginTop: "20px" }}>
          <button className="m-btn-cancel" type="button" onClick={() => onClose()}>Fechar</button>
        </div>
      </div>
    </div>
  </div>
);
}
export default ViewProductModal;