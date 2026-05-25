import React, { useEffect, useState } from "react";
import { UnitTypes } from "../../../api/interfaces";
import { CompanyModel, ProductModel } from "../../../api/interfaces";

interface Parameters{
    isOpen: boolean;
    product: ProductModel;
    onClose: () => void;

}

function ViewProductModal({isOpen, onClose, product, }:Parameters){


    const [loading, setLoading] = useState<boolean>(false);

    if (!isOpen) return null;
     
    return (

  <div className="modal-overlay open">
    <div className="modal-box" style={{ padding: "40px", minWidth: "500px", borderColor: "red", borderStyle: "solid" }}>
      
      <div className="modal-header">
        <span className="modal-title">
         <h3> Product Details</h3>
        </span>
        <button className="modal-close" onClick={onClose}>
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="modal-body">

        {/* Basic Product Information */}
        <div className="form-section">Basic Information</div>
        
        <div className="form-group">
          <label className="form-label">Product Name <span className="req">*</span></label>
          <input 
            className="form-control-custom" 
            type="text" 
            name="name"
            placeholder="Organic Coffee Beans" 
            value={product.name} 
            readOnly
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Product Type <span className="req">*</span></label>
            {product.productType} 
            
          </div>
          
          <div className="form-group">
            <label className="form-label">Unit Type <span className="req">*</span></label>
            
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Price per Unit <span className="req">*</span></label>
            <input 
              className="form-control-custom" 
              type="number" 
              name="pricePerUnit"
              placeholder="29.99" 
              min="0" 
              step="0.01"
              value={product.pricePerUnit} 
            
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Currency <span className="req">*</span></label>
            {product.currency} 
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Stock Quantity <span className="req">*</span></label>
            <input 
              className="form-control-custom" 
              type="number" 
              name="stock"
              placeholder="100" 
              min="0"
              value={product.stock} 
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Expiration Date</label>
            <input 
              className="form-control-custom" 
              type="date" 
              name="expirationDate"
               value={product.expirationDate} 
              readOnly
            />
         
          </div>
        </div>

        {/* Product Description */}
        <div className="form-section">Description</div>
        
        <div className="form-group">
          <label className="form-label">Product Description</label>
          <textarea 
            className="form-control-custom" 
            name="description"
            placeholder="Detailed description of the product..."
            rows={4}
             value={product.description} 
              readOnly
          />
        </div>


          <>
            <div className="form-section">Company Information</div>
            
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input 
                className="form-control-custom" 
                type="text" 
                name="companyName"
                placeholder="Company Name" 
                 value={product.companyName} 
              readOnly
              />
            </div>
          </>

          <>
            <div className="form-section">System Information</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Created At</label>
                <input 
                  className="form-control-custom" 
                  type="text" 
                  value={new Date(product.createdAt!).toLocaleString()} 
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Created By</label>
                <input 
                  className="form-control-custom" 
                  type="text" 
                  value={product.creatorUsername} 
                  disabled
                />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Last Updated</label>
                <input 
                  className="form-control-custom" 
                  type="text" 
                  value={new Date(product.updatedAt!).toLocaleString()} 
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Updated By</label>
                <input 
                  className="form-control-custom" 
                  type="text" 
                  value={product.updatedBy || 'Not updated yet'} 
                  disabled
                />
              </div>
            </div>
          </>

      </div>

      <div className="modal-footer">
        <button className="btn-primary-custom" type="submit" disabled={loading} onClick={onClose}>
          {loading ? "Saving..." : <><i className="bi bi-check2"></i> Close</>}
        </button>
      </div>

    </div>
  </div>

    )

}

export default ViewProductModal;