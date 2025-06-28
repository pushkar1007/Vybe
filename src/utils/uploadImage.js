// src/utils/uploadImageToCloudinary.js

export const uploadImage = async (file) => {
  const url = "https://api.cloudinary.com/v1_1/dw1ikwae9/upload";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "vybe_uploads");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await res.json();
    return data.secure_url; // ✅ Final image URL
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    throw err;
  }
};
