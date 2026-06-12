import React, { useEffect, useState } from "react";
import { AddressModel, CompanyAboutInfo, CompanyContact, CompanyModel } from "../../../api/interfaces";
import { useUserAuthManager } from "../../../api/authentication-handler";
import { useNavigate } from "react-router-dom";
import { updateCompanyAboutInfo, updateCompanyAddress, updateCompanyContact } from "../../../api/requests";
import ImageCarousel from "../../../components/ImageCarousel";
import UpdateCompanyImageModal from "../../employer/dashboard/modals/CompanyUpdateImageModal";

interface Parameters {
  company: CompanyModel;
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        padding: "9px 0",
        borderBottom: "1px solid #f0ece6",
        fontSize: "0.88rem",
      }}
    >
      <span className="field-label" style={{ alignSelf: "center" }}>{label}</span>
      <span style={{ color: "var(--ink)", fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function CompanyOverView({ company }: Parameters) {
  const companyStatus = company.status === "OPERATING" ? "biz-status-badge active" : "biz-status-badge inactive";
  const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
  const [editingSection, setEditingSection] = useState<string | null>(null);
   const [companyImageUpload, setcompanyImageUpload] = useState<CompanyModel| null>(null);
  const [aboutInfo, setAboutInfo] = useState<CompanyAboutInfo>({
    description: company.description,
    status: company.status,
  });
  const [address, setAddress] = useState<AddressModel>({
    island: company.address.island,
    city: company.address.city,
    postalCode: company.address.postalCode,
    street: company.address.street,
    zone: company.address.zone,
  });

  const [contact, setContact] = useState<CompanyContact>({
    email: company.email,
    phoneNumber: company.phoneNumber,
    faxNumber: company.faxNumber,
    taxIdNumber: company.taxIdNumber,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!isEntityLoggedIn) navigate("/employer-login");
  }, [isEntityLoggedIn]);

  const contactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setContact((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };
  const addressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id.replace("inp-", "") as keyof FormData;
    setAddress((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const aboutInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAboutInfo((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (section: string) => setEditingSection(section);
  const cancelEditing = () => setEditingSection(null);
  const isEditing = (section: string) => editingSection === section;
  const closeEditingSection = (alertMessage: string) => { setEditingSection(null); alert(alertMessage); };

  const saveSection = async (section: string) => {
    if (!company) return;
    let dataToUpdate: any = {};
    try {
      if (section === "address") {
        dataToUpdate = { island: address.island, city: address.city, street: address.street, zone: address.zone, postalCode: address.postalCode };
        const response = await updateCompanyAddress(dataToUpdate, company.id!);
        console.log("Response trying to update the user address: ", response);
        if (response.status === 200) {
          setAddress({ island: address.island, city: address.city, street: address.street, zone: address.zone, postalCode: address.postalCode });
          closeEditingSection("Company Address updated successfully!");
        } else if (response.status === 400) {
          alert("At least 1 field contained Invalid Info!");
        } else {
          alert("Failed to update company address");
        }
      } else if (section === "contact") {
        dataToUpdate = { email: contact.email, phoneNumber: contact.phoneNumber, taxIdNumber: contact.taxIdNumber, faxNumber: contact.faxNumber };
        const response = await updateCompanyContact(dataToUpdate, company.id!);
        console.log("Response trying to update the company contact: ", response);
        if (response.status === 200) {
          setContact({ email: contact.email, phoneNumber: contact.phoneNumber, taxIdNumber: contact.taxIdNumber, faxNumber: contact.faxNumber });
          closeEditingSection("Company Contact information updated successfully!");
        } else if (response.status === 400) {
          alert("At least 1 field contained Invalid Info!");
        } else {
          alert("Failed to update company Contact Information");
        }
      } else if (section === "about") {
        dataToUpdate = { description: aboutInfo.description, status: aboutInfo.status };
        console.log("Data to Update: ", dataToUpdate);
        const response = await updateCompanyAboutInfo(company.id!, dataToUpdate);
        console.log("Response trying to update the company contact: ", response);
        if (response.status === 200) {
          setAboutInfo({ description: aboutInfo.description, status: aboutInfo.status });
          closeEditingSection("Company About information updated successfully!");
        } else if (response.status === 400) {
          alert("At least 1 field contained Invalid Info!");
        } else {
          alert("Failed to update company Contact Information");
        }
      }
    } catch (exception) {
      console.log(`There was an issue updating the company: ${exception}`);
    }
  };

  useEffect(() => {
    if (company) {
      setAddress({
        island: company.address.island || "",
        city: company.address.city || "",
        postalCode: company.address.postalCode || "",
        street: company.address.street || "",
        zone: company.address.zone || "",
      });
      setContact({
        email: company.email || "",
        phoneNumber: company.phoneNumber || "",
        faxNumber: company.faxNumber || "",
        taxIdNumber: company.taxIdNumber || "",
      });
      setAboutInfo({
        description: company.description || "",
        status: company.status,
      });
    }
  }, [company]);

  return (
    <>
      {/* ---- header: name + status, dashboard heading style ---- */}
      <div className="view-heading" style={{ marginTop: "1px" }}>{company.name}</div>
      <div className="view-sub" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className={companyStatus}>{company.status}</span>
        <span>{company.category?.replaceAll("_", " ")}</span>
      </div>
      <div>
          {company.imgS3UrlKeys && (
                  <div style={{ marginTop: "12px", marginBottom: "15px" }}>
                    <div className="biz-actions" style={{ width: "100%", marginBottom: "5px" }}>
                      <button 
                        className="biz-btn edit" 
                        onClick={()=> setcompanyImageUpload(company)}
                      >
                        <i className="bi bi-pencil"></i>
                        {(company.imgS3UrlKeys?.length ?? 0) > 0 ? " Edit Images" : " Upload Images"}
                      </button>
                    </div>
                  </div>
                )}

                <ImageCarousel
                  imageKeys={company.imgS3UrlKeys}
                  width={'100qv'}
                  height={140}
                  altText={company.name}
                />
      </div>

      {/* ---- contact + address, two columns ---- */}
      <div className="company-overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="profile-section" style={{ marginBottom: 0 }}>
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-envelope-fill"></i>
              <span className="section-head-title">Contact</span>
            </div>
            <button
              className={`btn-edit ${isEditing("contact") ? "editing" : ""}`}
              onClick={() => (isEditing("contact") ? cancelEditing() : startEditing("contact"))}
            >
              <i className="bi bi-pencil"></i> {isEditing("contact") ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="fields-grid">
            <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
              <span className="field-label">Phone Number</span>
              <span className="field-value">{contact.phoneNumber || "Not Set"}</span>
              <input className="field-input" id="inp-phoneNumber" type="text"
                value={contact.phoneNumber} onChange={contactInputChange} />
            </div>
            <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
              <span className="field-label">Email</span>
              <span className="field-value">{contact.email || "Not Set"}</span>
              <input className="field-input" id="inp-email" type="email"
                value={contact.email} onChange={contactInputChange} />
            </div>
            <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
              <span className="field-label">Fax Number</span>
              <span className="field-value">{contact.faxNumber || "Not Set"}</span>
              <input className="field-input" id="inp-faxNumber" type="text"
                value={contact.faxNumber} onChange={contactInputChange} />
            </div>
            <div className={`field-group ${isEditing("contact") ? "is-editing" : ""}`}>
              <span className="field-label">Tax Id Number</span>
              <span className="field-value">{contact.taxIdNumber || "Not Set"}</span>
              <input className="field-input" id="inp-taxIdNumber" type="text"
                value={contact.taxIdNumber} onChange={contactInputChange} />
            </div>
          </div>

          {isEditing("contact") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
              <button className="btn-save" onClick={() => saveSection("contact")}>
                <i className="bi bi-check2"></i> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="profile-section" style={{ marginBottom: 0 }}>
          <div className="section-head">
            <div className="section-head-left">
              <i className="bi bi-geo-alt-fill"></i>
              <span className="section-head-title">Address</span>
            </div>
            <button
              className={`btn-edit ${isEditing("address") ? "editing" : ""}`}
              onClick={() => (isEditing("address") ? cancelEditing() : startEditing("address"))}
            >
              <i className="bi bi-pencil"></i> {isEditing("address") ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="fields-grid">
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Island</span>
              <span className="field-value">{address.island || "Not Set"}</span>
              <input className="field-input" id="inp-island" type="text"
                value={address.island} onChange={addressInputChange} />
            </div>
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">City</span>
              <span className="field-value">{address.city || "Not Set"}</span>
              <input className="field-input" id="inp-city" type="text"
                value={address.city} onChange={addressInputChange} />
            </div>
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Zone</span>
              <span className="field-value">{address.zone || "Not Set"}</span>
              <input className="field-input" id="inp-zone" type="text"
                value={address.zone} onChange={addressInputChange} />
            </div>
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Postal Code</span>
              <span className="field-value">{address.postalCode || "Not Set"}</span>
              <input className="field-input" id="inp-postalCode" type="text"
                value={address.postalCode} onChange={addressInputChange} />
            </div>
            <div className={`field-group ${isEditing("address") ? "is-editing" : ""}`}>
              <span className="field-label">Street</span>
              <span className="field-value">{address.street || "Not Set"}</span>
              <input className="field-input" id="inp-street" type="text"
                value={address.street} onChange={addressInputChange} />
            </div>
          </div>

          {isEditing("address") && (
            <div className="save-bar visible">
              <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
              <button className="btn-save" onClick={() => saveSection("address")}>
                <i className="bi bi-check2"></i> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---- about, full width ---- */}
      <div className="profile-section" style={{ marginTop: 16 }}>
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-card-text"></i>
            <span className="section-head-title">About</span>
          </div>
          <button
            className={`btn-edit ${isEditing("about") ? "editing" : ""}`}
            onClick={() => (isEditing("about") ? cancelEditing() : startEditing("about"))}
          >
            <i className="bi bi-pencil"></i> {isEditing("about") ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="fields-grid single">
          <div className={`field-group ${isEditing("about") ? "is-editing" : ""}`}>
            <span className="field-label">Description</span>
            <span className="field-value" style={{ whiteSpace: "pre-wrap" }}>
              {aboutInfo.description || "No description provided."}
            </span>
            <textarea className="field-input" name="description" style={{ width: "100%" }} id="inp-description" rows={10}
              value={aboutInfo.description} onChange={aboutInfoChange} />
          </div>
          <div className={`field-group ${isEditing("about") ? "is-editing" : ""}`}>
            <span className="field-label">Status</span>
            <span className="field-value" style={{ whiteSpace: "pre-wrap" }}>
              {aboutInfo.status || "No description provided."}
            </span>
            <select name="status"
              id="inp-status"
              className="field-input"
              value={aboutInfo.status as string}
              onChange={aboutInfoChange}
            >
              <option value="" disabled>Select Status...</option>
              <option value="OPERATING">OPERATING</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        {isEditing("about") && (
          <div className="save-bar visible">
            <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
            <button className="btn-save" onClick={() => saveSection("about")}>
              <i className="bi bi-check2"></i> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* ---- updates, read-only ---- */}
      <div className="profile-section" style={{ marginTop: 16 }}>
        <div className="section-head">
          <div className="section-head-left">
            <i className="bi bi-clock-history"></i>
            <span className="section-head-title">Updates</span>
          </div>
        </div>
        <div style={{ padding: "16px 22px" }}>
          <InfoRow label="Created At" value={company.createdAt} />
          <InfoRow label="Updated At" value={company.updatedAt} />
        </div>
      </div>

      {/* collapse the two-column grid on small screens */}
      <style>{`
        @media (max-width: 991px) {
          .company-overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      { companyImageUpload && (
        <UpdateCompanyImageModal
        onClose={()=> setcompanyImageUpload(null)}
        isOpen={companyImageUpload !== null}
        company={companyImageUpload}
        />
      )}
    </>
  );
}

export default CompanyOverView;