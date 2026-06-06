import { useEffect, useState } from "react";
import { AddProductModel, CompanyModel, ProductModel, RegisterStaffModel } from "../../../../api/interfaces";
import { addressFields, ALL_PERMISSIONS, CURRENCIES, ProductCategories, UNIT_TYPES } from "../../../../api/categories";
import { Permissions } from "../../../../api/interfaces";
import { addProduct, registerStaff } from "../../../../api/requests";
import { companyName } from "../../../../api/global";
import { hanldeResponseStatus } from "../../views/StaffView";
import ProductImageCarousel from "../../../../components/ProductImageCarousel";

interface Parameters{
    isOpen: boolean;
    onClose: ()  => void;
    productToView: ProductModel
}

function ViewProductModal({isOpen, onClose, productToView}:Parameters){
    const [product, setProduct] = useState<ProductModel>({
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
        <span className="m-head-title">Product Details</span>
        <button className="m-close" onClick={() => onClose()}>&times;</button>
      </div>
        <div className="m-body">
            {/* Product image header — first image shown, arrows when multiple */}
               <div style={{ marginTop: "12px", marginBottom: "15px" }}>
                  <ProductImageCarousel
                    imageKeys={product.imgS3UrlKeys}
                    width={300}
                    height={300}
                    altText={product.name}
                  />
                </div>
          
          {/* Basic Product Info */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Product Name *</label>
              <input className="m-input" type="text" placeholder="e.g. Fresh Salmon" name="name" value={product.name} readOnly/>
            </div>
            <div className="m-field">
              <label className="m-label">Product Type *</label>
              <select className="m-input" name="productType"  disabled>
                <option value="">{product.productType}</option>
               
              </select>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Price Per Unit *</label>
              <div style={{ display: "flex", gap: "5px" }}>
                <input className="m-input" type="number" step="0.01" placeholder="0.00" name="pricePerUnit"  value={product.pricePerUnit} readOnly/>
                 <select className="m-input" name="productType"  disabled>
                <option value="">{product.currency}</option>
               
              </select>
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Unit Type *</label>
              <select className="m-input" name="productType"  disabled>
                <option value="">{product.unitType}</option>
               
              </select>
            </div>
          </div>

          {/* Inventory Details */}
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Initial Stock *</label>
              <input className="m-input" type="number" placeholder="e.g. 100" name="stock" value={product.stock} required readOnly/>
            </div>
            <div className="m-field">
              <label className="m-label">Expiration Date</label>
              <input className="m-input" type="date" name="expirationDate" value={product.expirationDate} required readOnly/>
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
                value={product.description}
                style={{ resize: "none" }} readOnly
            ></textarea>
          </div>

          {/* Meta Data (Hidden or Read-only visual indicators) */}
          <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem", display:'flex'}}>
             <div className="m-field">
                <label className="m-label">Added By</label>
                <input className="m-input" type="text" value={`@${product.creatorUsername }`} readOnly disabled />
             </div>
              <div className="m-field">
                <label className="m-label">Updated By</label>
                <input className="m-input" type="text" value={`@${product.updatedBy?? "Not Updated" }`} readOnly disabled />
             </div>
             <div className="m-field">
                <label className="m-label">Company</label>
                <input className="m-input" type="text" value={companyName || "N/A"} readOnly disabled />
             </div>
          </div>
          <div className="m-row" style={{ opacity: 0.7, fontSize: "0.8rem", display:'flex'}}>
              <div className="m-field">
                <label className="m-label">Created At</label>
                <input className="m-input" type="text" value={product.createdAt || "N/A"} readOnly disabled />
              </div>
              <div className="m-field">
                <label className="m-label">Updated At</label>
                <input className="m-input" type="text" value={product.updatedAt || "N/A"} readOnly disabled />
              </div>
          </div>

          <div className="m-footer" style={{ marginTop: "20px" }}>
            <button className="m-btn-cancel" type="button" onClick={() => onClose()}>Close</button>
          </div>
        </div>
    </div>
  </div>
);
}
export default ViewProductModal;