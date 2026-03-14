import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Yahan se bahar wala cloudinary.config() hata do
// (Aur yahan se wo extra dotenv import bhi hata sakte ho)

const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const match = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
};

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // LAZY CONFIG: Ab yeh exact us time run hoga jab file upload karni hogi
        // Tab tak tumhara environment poori tarah ready ho chuka hoga!
        console.log("🔍 API KEY CHECK: ", process.env.CLOUDINARY_API_KEY);
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        if (!localFilePath) return null;
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.log("❌ CLOUDINARY ERROR: ", error);
        fs.unlinkSync(localFilePath); 
        return null;
    }
}

const deleteFromCloudinary = async (avatarUrl) => {
    if (!avatarUrl) return;
    
    // Yahan bhi delete karne se pehle config zaroori hai
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const publicId = getPublicIdFromUrl(avatarUrl);
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
}

export { uploadOnCloudinary, deleteFromCloudinary };