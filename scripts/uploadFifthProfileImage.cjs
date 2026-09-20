const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

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

const sourceImage = process.argv[2] || path.resolve(__dirname, '../public/team/mithin.jpg');

if (!fs.existsSync(sourceImage)) {
  console.error('Source image not found at:', sourceImage);
  process.exit(1);
}

async function upload() {
  try {
    console.log('Uploading fifth profile image to Cloudinary...');
    const result = await cloudinary.uploader.upload(sourceImage, {
      folder: 'team',
      public_id: 'member_05',
      resource_type: 'image',
      overwrite: true
    });
    console.log('UPLOAD_SUCCESS');
    console.log(result.secure_url);
    console.log(JSON.stringify({ width: result.width, height: result.height, format: result.format, bytes: result.bytes }, null, 2));
  } catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
  }
}

upload();
