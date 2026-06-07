// src/pages/Executive-Dashboard/components/EditBusinessModal.tsx

import { useState, useEffect } from "react";
import { CompanyModel, AddressModel } from "../../../../api/interfaces";
import { registerCompany } from "../../../../api/requests";
import { BUSINESS_CATEGORIES } from "../../../../api/categories";

//Business is the brain and passes the edit business modal these properties
//this component call the onsave, it will call the onsave method on the businessview
interface Properties {
  isOpen:   boolean;
  business: CompanyModel | null;
  onClose:  () => void;
  onSave:   (updated: CompanyModel) => void;
}

function EditBusinessModal({ isOpen, onClose, business, onSave }: Properties) {
  const [formData, setFormData] = useState<CompanyModel>({
    id:                      "",
    name:                    "",
    category:                 null,
    taxIdNumber: "",
    description:             "",
    phoneNumber:             "",
    faxNumber:               "",
    email:                   "",
    status:                  null,
    revenue:                 0,
    createdAt:               "",
    updatedAt:               "",
    creatorUsername:  "",
    address: {
      island:     "",
      city:       "",
      zone:       "",
      street:     "",
      postalCode: "",
    },
  });

  // When a different business is clicked for editing,
  // re-populate the form — like @ModelAttribute filling a form bean
  useEffect(() => {
    if (business) {
      setFormData(business);
    }
  }, [business]);

  if (!isOpen || !business) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Address fields need to be nested — check if the field belongs to address
    const addressFields = ["island", "city", "zone", "street", "postalCode"];

    if (addressFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Edit Business</span>
          <button className="m-close" onClick={onClose}>&times;</button>
        </div>

        <div className="m-body">
          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Business Name *</label>
              <input className="m-input" type="text" name="name"
                value={formData.name} onChange={handleChange} />
            </div>
            <div className="m-field">
            <label className="m-label">Category *</label>
                        <select 
                                className="form-select" 
                                id="type" 
                                name="category" 
                                value={formData.category ?? ""} 
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {BUSINESS_CATEGORIES.map((cat: string) => {
                                // Formats "FAST_FOOD" -> "Fast Food", "AI_ML_COMPANY" -> "Ai Ml Company"
                                const formattedLabel = cat
                                    .toLowerCase()
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (char) => char.toUpperCase());
        
                                return (
                                    <option key={cat} value={cat}>
                                    {formattedLabel}
                                    </option>
                                );
                                })}
                            </select>
            </div>
          </div>

          <div className="m-field">
            <label className="m-label">Description</label>
            <textarea className="m-textarea" name="description"
              value={formData.description} onChange={handleChange} />
          </div>

          <div className="m-field">
            <label className="m-label">Tax Identification Number</label>
            <input className="m-input" type="text" name="taxIdentificationNumber"
              value={formData.taxIdNumber} onChange={handleChange} />
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Phone</label>
              <input className="m-input" type="tel" name="phoneNumber"
                value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="m-field">
              <label className="m-label">Fax Number</label>
              <input className="m-input" type="text" name="faxNumber"
                value={formData.faxNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Email</label>
              <input className="m-input" type="email" name="email"
                value={formData.email} onChange={handleChange} />
            </div>
            <div className="m-field">
              <label className="m-label">Revenue</label>
              <input className="m-input" type="number" name="revenue"
                value={formData.revenue} onChange={handleChange} />
            </div>
          </div>

          <div className="m-field">
            <label className="m-label">Status</label>
            <select className="m-select " name="status" value={formData.status ?? ""} onChange={handleChange}>
              <option value="">Select status</option>
              <option value="OPERATING">OPERATING</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="m-field">
            <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Address</label>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Island</label>
              <input className="m-input" type="text" name="island"
                value={formData.address.island} onChange={handleChange} />
            </div>
            <div className="m-field">
              <label className="m-label">City</label>
              <input className="m-input" type="text" name="city"
                value={formData.address.city} onChange={handleChange} />
            </div>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label className="m-label">Zone</label>
              <input className="m-input" type="text" name="zone"
                value={formData.address.zone} onChange={handleChange} />
            </div>
            <div className="m-field">
              <label className="m-label">Postal Code</label>
              <input className="m-input" type="text" name="postalCode"
                value={formData.address.postalCode} onChange={handleChange} />
            </div>
          </div>

          <div className="m-field">
            <label className="m-label">Street</label>
            <input className="m-input" type="text" name="street"
              value={formData.address.street} onChange={handleChange} />
          </div>

          <div className="m-footer">
            <button className="m-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="m-btn-save" onClick={handleSave}>
              <i className="bi bi-check2"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBusinessModal;