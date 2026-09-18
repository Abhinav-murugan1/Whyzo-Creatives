const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

/*
 * Credentials come from the environment, never the repository. Copy .env.example to .env and fill it
 * in; .env is gitignored. The previous hardcoded api_secret granted write access to the whole
 * Cloudinary account, so it must be rotated in the console.
 */
require('dotenv').config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary credentials. Copy .env.example to .env and set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const sourceImage = 'C:/Users/ABHIN/.gemini/antigravity/brain/a2b83818-6096-4756-adfb-d6302171da8f/.user_uploaded/media_1789739733562.jpg';

if (!fs.existsSync(sourceImage)) {
  console.error('Source image not found at:', sourceImage);
  process.exit(1);
}

// Save local copy to assets as backup
const destDir = path.resolve(__dirname, '../src/assets/PHOTOS/TEAM');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
const localCopy = path.join(destDir, 'member_02.jpg');
fs.copyFileSync(sourceImage, localCopy);
console.log('Saved local copy to:', localCopy);

async function upload() {
  try {
    console.log('Uploading second profile image to Cloudinary...');
    const result = await cloudinary.uploader.upload(sourceImage, {
      folder: 'team',
      public_id: 'member_02',
      resource_type: 'image',
      overwrite: true
    });
    console.log('UPLOAD_SUCCESS');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
  }
}

upload();
