import { useState } from "react";
import { AddProductModel, AddWearableModel, OfferingImageUploadRequest, ProductModel, WearableModel } from "../../../api/interfaces";
import { MAX_OFFERING_PICTURES } from "../../../api/global";
import { imageUrlFromKey } from "../../../components/ImageCarousel";
import { buildImageMetadata, getImageDimensions, uploadFileToS3 } from "../../../api/ImageValidatorService";
import { postOfferingImageKeys, updateProductImage, updateWearableImage } from "../../../api/requests";

interface Parameters {
  isOpen: boolean;
  onClose: () => void;
  wearableToEdit: WearableModel;
}

function WearableUploadImageModal({ isOpen, onClose, wearableToEdit }: Parameters) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wearable, setWearable] = useState<WearableModel> (wearableToEdit)

  // Local state to manage selected file objects and preview URLs
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Handles adding new images to the stack
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  // Handles removing an image by index
  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (selectedImages.length === 0) {
      setError("Please select at least one image to upload.");
      return;
    }

    setLoading(true);
    try {
    for(const image of selectedImages){
       console.log("Dimesions: ",  getImageDimensions(image));
    }
    const metadata = buildImageMetadata(selectedImages);
    const productRequest: AddWearableModel = {...wearable, imagesMetadata:metadata}
    const response = await updateWearableImage(productRequest);
    console.log("RESPONSE UPDATING WEARABLE IMAGES", response);
    if(!response.ok){alert("There was an issue updating the prodcut images");return;}
    else if(response.status === 200){
        const preSignUrlResponse = await response.json();
        const productId: string = preSignUrlResponse.offeringId;
        const preSignResult: Array<{ url: string; key: string }> = preSignUrlResponse.uploadResult;
            try {
              console.log("selectedImages:", selectedImages);
              console.log("preSignResult:", preSignResult);
              console.log("selectedImages length:", selectedImages.length);
              console.log("preSignResult length:", preSignResult.length);
              // 3. Map through the files and trigger S3 uploads in parallel
              const uploadPromises = selectedImages.map((image, index) => {
                // Pull out the URL belonging to this exact index matching the image order
                const s3PresignUrl = preSignResult[index].url;
                const s3PresignKey = preSignResult[index].key;
                console.log("S3 Signed URL: ", s3PresignUrl)
                console.log("S3 Signed KEY: ", s3PresignKey)
                return uploadFileToS3(s3PresignUrl, image );
                
              });
        
             try {
                await Promise.all(uploadPromises);
                const keys = preSignResult.map((p) => p.key);
                const uploadData: OfferingImageUploadRequest = { s3PresignKeys: keys, offeringId: productId, offeringType: "WEARABLE" };
                const postImgDataResponse =  await postOfferingImageKeys(uploadData);  
                console.log("postImgDataResponse: ",postImgDataResponse);
                  alert("Vestível e todas as imagens adicionados com sucesso.");
                   setLoading(false);
                } catch (uploadError) {
                  console.error("Error during image transfer to S3:", uploadError);
                  setError("Product saved, but some images failed to upload.");
                }
        
          } catch (uploadError) {
            console.error("Error during image transfer to S3:", uploadError);
            setError("Failed to upload images. Please check connection.");
          }
    }
    onClose();
     setLoading(false);

      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setSelectedImages([]);
      setImagePreviews([]);
      onClose();
    } catch (err) {
        console.log("Error trying to upload pictures to s3 bucket: ",err)
      setError("Something went wrong during image processing.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Safeguard array for existing images
  const existingImages = wearableToEdit?.imgS3UrlKeys || [];

  return (
    <>
       {loading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
          Loading ...
        </div>
      )}
      <div className="m-overlay open">
      <div className="m-box">
        <div className="m-head">
          <span className="m-head-title">
            {wearableToEdit ? `Update Images for ${wearableToEdit.name}` : "Upload Images"}
          </span>
          <button type="button" className="m-close" onClick={onClose}>&times;</button>
        </div>
        
        <div style={{ padding: "15px 15px 0 15px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6c757d", display: "block", marginBottom: "12px" }}>
            You can have at most {MAX_OFFERING_PICTURES} pictures per offering.
          </span>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}>
              Current Active Images ({existingImages.length})
            </label>
            
            {existingImages.length === 0 ? (
              <div style={{ color: "#8c8c8c", fontSize: "0.85rem", fontStyle: "italic", padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}>
                No active images found for this offering.
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", background: "#f8f9fa", padding: "10px", borderRadius: "6px", border: "1px solid #e9ecef" }}>
                {existingImages.map((key, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      width: "90px", 
                      height: "70px", 
                      borderRadius: "4px", 
                      overflow: "hidden", 
                      border: "1px solid #dee2e6",
                      backgroundColor: "#fff"
                    }}
                  >
                    <img 
                      src={imageUrlFromKey(key)}
                      alt={`${wearableToEdit.name} asset ${index + 1}`} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* --- END OF IMAGE LIST --- */}
        </div>

        <form onSubmit={handleUploadSubmit}>
          <div className="m-body" style={{ paddingTop: "0" }}>
            {error && (
              <div style={{ color: "#dc3545", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            {/* Product Images Field */}
            <div className="m-field">
              <label className="m-label" style={{ marginBottom: "8px", display: "block", fontWeight: "600" }}>
                New Images to Upload
              </label>
              
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                
                {/* Image Previews Wrapper */}
                {imagePreviews.map((url, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      position: "relative", 
                      width: "80px", 
                      height: "80px", 
                      borderRadius: "6px", 
                      overflow: "hidden", 
                      border: "1px solid #ccc" 
                    }}
                  >
                    <img 
                      src={url} 
                      alt={`Preview ${index}`} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1"
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}

                {/* Upload Trigger Square */}
                <label 
                  style={{
                    width: "80px",
                    height: "80px",
                    border: "2px dashed #ccc",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                    transition: "border-color 0.2s"
                  }}
                >
                  <i className="bi bi-camera" style={{ fontSize: "20px", color: "#6c757d" }}></i>
                  <span style={{ fontSize: "11px", color: "#6c757d", marginTop: "4px" }}>Add</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageChange} 
                    style={{ display: "none" }} 
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="m-foot" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "15px", borderTop: "1px solid #eee" }}>
            <button 
              type="button" 
              className="qa-btn secondary" 
              onClick={onClose}
              disabled={loading}
              style={{ padding: "8px 16px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="qa-btn primary"
              disabled={loading || selectedImages.length === 0}
              style={{ 
                padding: "8px 16px", 
                borderRadius: "4px", 
                border: "none", 
                background: selectedImages.length === 0 ? "#86b7fe" : "#0d6efd", 
                color: "#fff", 
                cursor: selectedImages.length === 0 ? "not-allowed" : "pointer" 
              }}
            >
              {loading ? "Uploading..." : `Upload ${selectedImages.length > 0 ? `(${selectedImages.length})` : ""}`}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
    
  );
}

export default WearableUploadImageModal;