import dotenv from "dotenv";
dotenv.config();
import streamifier from "streamifier";
import multer from "multer";
import cloudinary from "cloudinary"

const storage = multer.memoryStorage();
export const upload = multer({ storage })

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const streamUpload = (fileBuffer, resourceType) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.v2.uploader.upload_stream(
            { resource_type: resourceType },
            (error, result) => {
                if (result) resolve(result)
                else reject(error)
            }
        )
        streamifier.createReadStream(fileBuffer).pipe(stream);
    })
}