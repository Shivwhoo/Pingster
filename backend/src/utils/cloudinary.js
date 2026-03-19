import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const match = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
};

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Lazy Config: Jab function call hoga tabhi env load hoga
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        if (!localFilePath) return null;
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // 🚀 FIX: Safety check before deleting the local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return response;

    } catch (error) {
        console.log("❌ CLOUDINARY ERROR: ", error);
        
        // 🚀 FIX: Agar upload fail ho jaye, tab bhi safely temp file hata do
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); 
        }
        
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

    try {
        const publicId = getPublicIdFromUrl(avatarUrl);
        if (!publicId) return;
        
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("❌ CLOUDINARY DELETE ERROR: ", error);
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };