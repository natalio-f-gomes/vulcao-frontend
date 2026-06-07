import { useState } from "react";
import { CompanyRegistrationModel, CompanyImageUploadRequest } from "../../../../api/interfaces";
import { postCompanyImageKeys, registerCompany } from "../../../../api/requests";
import { BUSINESS_CATEGORIES } from "../../../../api/categories";
import { buildImageMetadata, uploadFileToS3 } from "../../../../api/ImageValidatorService";

const MAX_IMAGES = 2; // keep in sync with the backend

interface Properties {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function RegisterBusinessModal({ isOpen, onClose, onSuccess }: Properties) {
  const username = localStorage.getItem("username");

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [companyRegistrationForm, setCompanyRegistrationForm] = useState<CompanyRegistrationModel>({
    name: "",
    category: null,
    taxIdNumber: "",
    description: "",
    phoneNumber: "",
    faxNumber: "",
    email: "",
    address: { island: "", city: "", zone: "", street: "", postalCode: "" },
    status: null,
    imagesMetadata: [],
    creatorUsername: username!,
    revenue: 0,
  });

  const addressFields = ["island", "city", "zone", "street", "postalCode"];

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (addressFields.includes(name)) {
      setCompanyRegistrationForm((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setCompanyRegistrationForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------- image picking (capped) ---------- */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const filesArray = Array.from(event.target.files);
    event.target.value = ""; // allow re-selecting the same file

    const remaining = MAX_IMAGES - selectedImages.length;
    if (remaining <= 0) {
      setError(`You can attach at most ${MAX_IMAGES} images.`);
      return;
    }
    const accepted = filesArray.slice(0, remaining);
    if (accepted.length < filesArray.length) {
      setError(`Only ${remaining} more image(s) allowed; extras ignored.`);
    } else {
      setError(null);
    }

    setSelectedImages((prev) => [...prev, ...accepted]);
    setImagePreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    setError(null);
  };

  /* ---------- register -> presign -> S3 PUT -> confirm ---------- */
  const handleApiCall = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const metadata = await buildImageMetadata(selectedImages);
      // IMPORTANT: send the request object that carries the metadata
      const companyRegistrationRequest: CompanyRegistrationModel = {
        ...companyRegistrationForm,
        imagesMetadata: metadata,
      };

      const response = await registerCompany(companyRegistrationRequest);

      if (response.status === 201 || response.status === 204) {
        // registered with no images attached (or backend chose not to presign)
        alert("Company Successfully Registered");
        onSuccess();
        onClose();
        return;
      }

      if (response.status === 200) {
        // registered + presigned URLs returned for the images
        const payload = await response.json();
        const companyId: string = payload.companyId;
        const preSignResult: Array<{ url: string; key: string }> = payload.uploadResult;

        try {
          // upload each file to its matching URL (order is preserved)
          await Promise.all(
            selectedImages.map((file, i) => uploadFileToS3(preSignResult[i].url, file))
          );

          // confirm so the backend verifies, promotes, and persists the keys
          const uploadData: CompanyImageUploadRequest = {
            s3PresignKeys: preSignResult.map((p) => p.key),
            companyId: companyId,
          };
          const confirmResponse = await postCompanyImageKeys(uploadData);
          if (confirmResponse.ok) {
            alert("Company and all images successfully registered.");
          } else {
            alert("Company registered, but image confirmation failed.");
          }
        } catch (uploadError) {
          console.error("Error during image transfer to S3:", uploadError);
          setError("Company registered, but some images failed to upload.");
        }

        onSuccess();
        onClose();
        return;
      }

      if (response.status === 409) {
        alert("A Company with the same Tax ID Number or email already exists");
      } else if (response.status === 403) {
        alert("ACCESS DENIED");
      } else if (response.status === 400) {
        alert("Please make sure to fill in all of the values and select the company status");
      } else {
        setError(`Registration failed (${response.status})`);
      }
    } catch (err) {
      setError(`Registration failed: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const atLimit = selectedImages.length >= MAX_IMAGES;

  return (
    <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">Register a New Business</span>
          <button className="m-close" onClick={onClose}>&times;</button>
        </div>
        <form id="companyRegistrationForm" onSubmit={handleApiCall}>
          <div className="m-body">

            {error && (
              <div style={{ color: "#dc3545", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            {/* ---------- Business Images ---------- */}
            <div className="m-field">
              <label className="m-label">Business Images (max {MAX_IMAGES})</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {imagePreviews.map((url, index) => (
                  <div
                    key={index}
                    style={{ position: "relative", width: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid #ccc" }}
                  >
                    <img src={url} alt={`Preview ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute", top: "2px", right: "2px",
                        background: "rgba(0,0,0,0.6)", color: "#fff", border: "none",
                        borderRadius: "50%", width: "18px", height: "18px",
                        cursor: "pointer", fontSize: "12px",
                        display: "flex", alignItems: "center", justifyContent: "center", lineHeight: "1",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}

                {!atLimit && (
                  <label
                    style={{
                      width: "80px", height: "80px",
                      border: "2px dashed #ccc", borderRadius: "6px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      cursor: "pointer", backgroundColor: "#f9f9f9",
                      color: "#666", fontSize: "0.8rem",
                    }}
                  >
                    <i className="bi bi-camera" style={{ fontSize: "1.2rem", marginBottom: "2px" }}></i>
                    <span>Add</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* ---------- Business Info ---------- */}
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Business Name *</label>
                <input className="m-input" type="text" placeholder="e.g. ShopLane Boutique" name="name" value={companyRegistrationForm.name} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Category *</label>
                <select className="form-select" id="type" name="category" value={companyRegistrationForm.category ?? ""} onChange={handleInputChange}>
                  <option value="">Select Category</option>
                  {BUSINESS_CATEGORIES.map((cat: string) => {
                    const formattedLabel = cat
                      .toLowerCase()
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase());
                    return (
                      <option key={cat} value={cat}>{formattedLabel}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="m-field">
              <label className="m-label">Description</label>
              <textarea className="m-textarea" name="description" placeholder="Brief description..." required value={companyRegistrationForm.description} onChange={handleInputChange}></textarea>
            </div>

            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Tax Identification Number</label>
                <input className="m-input" type="tel" name="taxIdNumber" placeholder="123-232434233" required value={companyRegistrationForm.taxIdNumber} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Fax Number</label>
                <input className="m-input" type="tel" name="faxNumber" placeholder="123-232434233" required value={companyRegistrationForm.faxNumber} onChange={handleInputChange} />
              </div>
            </div>

            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Phone</label>
                <input className="m-input" type="tel" name="phoneNumber" placeholder="+1 (555) 000-0000" required value={companyRegistrationForm.phoneNumber} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Email</label>
                <input className="m-input" type="email" name="email" placeholder="business@example.com" value={companyRegistrationForm.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="m-field row">
              <div className="m-field col-6">
                <label className="m-label">Revenue</label>
                <input className="m-input" type="number" name="revenue" placeholder="e.g. 100000" required value={companyRegistrationForm.revenue} onChange={handleInputChange} />
              </div>
              <div className="col-6">
                <label className="m-label">Status *</label>
                <select className="m-select form-select" name="status" id="status" value={companyRegistrationForm.status ?? ""} onChange={handleInputChange}>
                  <option value="">STATUS</option>
                  <option value={"OPERATING"}>OPERATING</option>
                  <option value={"INACTIVE"}>INACTIVE</option>
                  <option value={"CLOSED"}>CLOSED</option>
                </select>
              </div>
            </div>

            <div className="m-field">
              <label className="m-label"><i className="bi bi-geo-alt-fill me-1"></i> Address</label>
            </div>
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Island</label>
                <input className="m-input" type="text" name="island" placeholder="e.g. Santiago" required value={companyRegistrationForm.address.island} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">City</label>
                <input className="m-input" type="text" name="city" placeholder="e.g. Praia" required value={companyRegistrationForm.address.city} onChange={handleInputChange} />
              </div>
            </div>
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Zone</label>
                <input className="m-input" type="text" name="zone" placeholder="e.g. Plateau" required value={companyRegistrationForm.address.zone} onChange={handleInputChange} />
              </div>
              <div className="m-field">
                <label className="m-label">Postal Code</label>
                <input className="m-input" type="text" name="postalCode" placeholder="e.g. 7600" value={companyRegistrationForm.address.postalCode} onChange={handleInputChange} />
              </div>
            </div>
            <div className="m-field">
              <label className="m-label">Street</label>
              <input className="m-input" type="text" name="street" placeholder="e.g. Rua do Município" value={companyRegistrationForm.address.street} onChange={handleInputChange} />
            </div>

            <div className="m-footer">
              <button className="m-btn-cancel" type="button" onClick={onClose} disabled={loading}>Cancel</button>
              <button className="m-btn-save" type="submit" disabled={loading}>
                <i className="bi bi-check2"></i> {loading ? "Saving..." : "Save Business"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterBusinessModal;