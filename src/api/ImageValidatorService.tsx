
import { OfferingType } from "./categories";


export interface ImageMetadata {
  name: string;
  byteSize: number;
  extension: string; // NOTE: holds the MIME type (e.g. "image/png"), not "png"
}

export interface Dimensions {
  width: number;
  height: number;
}


export interface PresignBatchRequest{
    offeringType: OfferingType,
    images: ImageMetadata[]
}
    

export function buildImageMetadata(images: File[]): ImageMetadata[] {
  return images.map((img) => ({
    name: img.name,
    byteSize: img.size,
    extension: img.type,

  }));
}


// Part 2 — PUT the actual bytes straight to S3
export async function uploadFileToS3(url: string, file: File): Promise<void> {
  console.log("File type", file.type)
  
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type }, 
    body: file,                             
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`S3 Error Body for ${file.name}:`, errorText);
    throw new Error(`S3 upload failed: ${res.status}`);
  }
}




export const getImageDimensions = (file: File): Promise<Dimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(objectUrl); // free memory once measured
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl); // also free it on failure
      reject(err);
    };
  });
}; 
  