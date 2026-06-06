import { useEffect, useState } from "react";
import { AddProductModel, CompanyModel, ProductModel, RegisterStaffModel } from "../../../../api/interfaces";
import { addressFields, ALL_PERMISSIONS, CURRENCIES, ProductCategories, UNIT_TYPES } from "../../../../api/categories";

import { companyName } from "../../../../api/global";
import ProductImageCarousel from "../../../../components/ProductImageCarousel";

interface Parameters{
    isOpen: boolean;
    onClose: ()  => void;
    onSave: (updated: ProductModel) => void;
    productToEdit: ProductModel
}

function EditProductModal({isOpen, onClose, onSave, productToEdit}:Parameters){
    const [error, setError] = useState<string | null>(null);
    const [loading,setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductModel>({
      id:"",
      name: "",
      productType: "UNKNOWN",
      expirationDate:"",
      description:"",
      stock:0,
      unitType: "",
      pricePerUnit:0,
      companyId : "",
      currency: "CVE",
      creatorUsername: "",
      imgS3UrlKeys:[]
    });

    const handleInputChange  = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setProduct( (prev:AddProductModel) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() =>{
      if(productToEdit){
        setProduct(productToEdit)
      }
    },[productToEdit]);

    const handleProductUpdate = () => {
      
    console.log("Product data to update: ",JSON.stringify(product));
    onSave(product);
};

    if(!isOpen || !productToEdit) return null;
return (
  <div className="m-overlay open">
    <div className="m-box">
      <div className="m-head">
        <span className="m-head-title">Edit {productToEdit.name}</span>
        <button className="m-close" onClick={() => onClose()}>&times;</button>
      </div>
      
      <form id="productRegistrationForm" >    
        <div className="m-body">
          
          {/* Basic Product Info */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Product Name *</label>
              <input className="m-input" type="text" placeholder="e.g. Fresh Salmon" name="name" value={product.name}  onChange={handleInputChange} required/>
            </div>
            <div className="m-field">
              <label className="m-label">Product Type *</label>
              <select className="m-input" name="productType" onChange={handleInputChange} required>
                <option value={product.productType}>{product.productType}</option>
                {ProductCategories.map( (category: string) =>{
                  const label = category.replaceAll("_", " ").toUpperCase();
                  return (
                    <option key={category} value={category}>
                    {label}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Price Per Unit *</label>
              <div style={{ display: "flex", gap: "5px" }}>
                <input className="m-input" type="number" step="0.01" value={product.pricePerUnit} placeholder="0.00" name="pricePerUnit" onChange={handleInputChange}  required/>
                <select className="m-input" name="currency" value={product.currency} style={{ width: "80px" }} onChange={handleInputChange} required>
                   {CURRENCIES.map( (currency:string) => {
                    return (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    )
                   })}
                </select>
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Unit Type *</label>
              <select className="m-input" name="unitType" onChange={handleInputChange} required>
                <option value={product.unitType}>{product.unitType}</option>
                {UNIT_TYPES.map( (unit:string) => {
                  return (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* Inventory Details */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Initial Stock *</label>
              <input className="m-input" type="number" placeholder="e.g. 100" value={product.stock} name="stock" onChange={handleInputChange} required />
            </div>
            <div className="m-field">
              <label className="m-label">Expiration Date</label>
              <input className="m-input" type="date" name="expirationDate"value={product.expirationDate}  onChange={handleInputChange} required />
            </div>
          </div>

          {/* Description */}
          <div className="m-field">
            <label className="m-label">Description</label>
            <textarea 
                className="m-input" 
                rows={4}
                placeholder="Describe the product features, quality, or notes..." 
                name="description"
                onChange={handleInputChange}
                value={product.description}
              
                style={{ resize: "none" }}
            ></textarea>
          </div>

          {/* Meta Data (Hidden or Read-only visual indicators) */}
          <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem" }}>
             <div className="m-field">
                <label className="m-label">Added By</label>
                <input className="m-input" type="text" value={`@${product.creatorUsername}`} readOnly disabled />
             </div>
             <div className="m-field">
                <label className="m-label">Company</label>
                <input className="m-input" type="text" value={companyName || "N/A"} readOnly disabled />
             </div>
          </div>

          <div className="m-footer" style={{ marginTop: "20px" }}>
            <button className="m-btn-cancel" type="button" onClick={() => onClose()}>Cancel</button>
            <button className="m-btn-save" type="button" onClick={handleProductUpdate}>
              <i className="bi bi-check2"></i> Update Product
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
}
export default EditProductModal;