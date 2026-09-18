const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

const ffmpegBin = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\ABHIN\\AppData\\Local', 'Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-full_build\\bin');
if (fs.existsSync(ffmpegBin)) {
  process.env.PATH = `${ffmpegBin};${process.env.PATH}`;
}

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

const ASSETS_DIR = path.resolve(__dirname, '../src/assets');
const TEMP_DIR = path.resolve(__dirname, '../temp_upload');
const OUTPUT_JSON = path.resolve(__dirname, '../src/data/cloudinaryAssets.json');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(OUTPUT_JSON))) {
  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
}

// Load existing manifest if present to resume/skip completed uploads
let manifest = {};
if (fs.existsSync(OUTPUT_JSON)) {
  try {
    manifest = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf8'));
  } catch (e) {
    manifest = {};
  }
}

// Ensure pre-uploaded FERRARI is preserved in manifest
if (!manifest['automotive_FERRARI']) {
  manifest['automotive_FERRARI'] = {
    category: 'automotive',
    originalFile: 'FERRARI.mp4',
    resourceType: 'video',
    secureUrl: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789576675/automotive/oppl7ldj0h0ebzejzkqb.mov',
    posterUrl: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789576675/automotive/oppl7ldj0h0ebzejzkqb.jpg',
    publicId: 'automotive/oppl7ldj0h0ebzejzkqb'
  };
}

// Targets: 2-3 per category across all 9 folders
const uploadTargets = [
  // AUTOMOTIVE
  { category: 'automotive', relPath: 'AUTOMOTIVE/MCLAREN.mp4', type: 'video' },
  { category: 'automotive', relPath: 'AUTOMOTIVE/lmbo.mp4', type: 'video' },
  { category: 'automotive', relPath: 'AUTOMOTIVE/URUSS.mp4', type: 'video' },

  // CGI
  { category: 'cgi', relPath: 'CGI/PERFUME.mp4', type: 'video' },

  // CORPORATE
  { category: 'corporate', relPath: 'CORPORATE/STAND BUILD UP.mp4', type: 'video', needsCompress: true },
  { category: 'corporate', relPath: 'CORPORATE/WEB FORUM.mp4', type: 'video', needsCompress: true },

  // EVENTS
  { category: 'events', relPath: 'EVENTS/CARNIVAL.mp4', type: 'video' },
  { category: 'events', relPath: 'EVENTS/INTRO INTERSEC.mp4', type: 'video' },
  { category: 'events', relPath: 'EVENTS/GITEX 2025.mp4', type: 'video', needsCompress: true },

  // F&B
  { category: 'f&b', relPath: 'F&B/AMARA .mp4', type: 'video' },
  { category: 'f&b', relPath: 'F&B/BISTRO 2.mp4', type: 'video' },
  { category: 'f&b', relPath: 'F&B/MDC WINE.mp4', type: 'video' },

  // INFLUENCER
  { category: 'influencer', relPath: 'INFLUENCER/STARBUCKS.mp4', type: 'video' },
  { category: 'influencer', relPath: 'INFLUENCER/JETSKI OUT.mp4', type: 'video' },

  // REALESTATE
  { category: 'realestate', relPath: 'REALESTATE/JOELLE RAAD.mp4', type: 'video' },
  { category: 'realestate', relPath: 'REALESTATE/VILLA.mp4', type: 'video', needsCompress: true },

  // SPORTS
  { category: 'sports', relPath: 'SPORTS/TOPSPIN 3.mp4', type: 'video' },
  { category: 'sports', relPath: 'SPORTS/TOPSPIN.mp4', type: 'video', needsCompress: true },

  // PHOTOS
  { category: 'photos', relPath: 'PHOTOS/PRODUCT/WATCH.jpg', type: 'image', needsSharp: true },
  { category: 'photos', relPath: 'PHOTOS/PRODUCT/HEADPHONES.jpg', type: 'image', needsSharp: true },
  { category: 'photos', relPath: 'PHOTOS/F&B/MDC-134.jpg', type: 'image' },
  { category: 'photos', relPath: 'PHOTOS/PARTY/DSC00623.jpg', type: 'image', needsSharp: true }
];

async function optimizeImage(srcPath, destPath) {
  console.log(`  [Sharp] Optimizing image: ${path.basename(srcPath)}`);
  await sharp(srcPath)
    .resize({ width: 2560, withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(destPath);
  const stat = fs.statSync(destPath);
  console.log(`  [Sharp] Output size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

function compressVideo(srcPath, destPath) {
  console.log(`  [FFmpeg] Compressing video: ${path.basename(srcPath)}`);
  // Use H.264 CRF 25 1080p web optimization
  const cmd = `ffmpeg -y -i "${srcPath}" -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 25 -preset fast -c:a aac -b:a 128k -movflags +faststart "${destPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  const stat = fs.statSync(destPath);
  console.log(`  [FFmpeg] Output size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

async function uploadFile(target) {
  const baseName = path.basename(target.relPath, path.extname(target.relPath)).trim();
  const key = `${target.category}_${baseName}`;

  if (manifest[key] && manifest[key].secureUrl) {
    console.log(`>>> [SKIPPING] Already uploaded: ${key} -> ${manifest[key].secureUrl}`);
    return manifest[key];
  }

  const fullPath = path.join(ASSETS_DIR, target.relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`!!! [ERROR] File not found: ${fullPath}`);
    return null;
  }

  let uploadPath = fullPath;
  let isTemp = false;

  try {
    if (target.needsSharp) {
      const tempImg = path.join(TEMP_DIR, `opt_${path.basename(target.relPath)}`);
      await optimizeImage(fullPath, tempImg);
      uploadPath = tempImg;
      isTemp = true;
    } else if (target.needsCompress) {
      const tempVid = path.join(TEMP_DIR, `opt_${path.basename(target.relPath)}`);
      compressVideo(fullPath, tempVid);
      uploadPath = tempVid;
      isTemp = true;
    }

    console.log(`>>> [UPLOADING] ${target.category} / ${path.basename(target.relPath)} to Cloudinary...`);
    const uploadFolder = target.category === 'f&b' ? 'fb' : target.category;
    const uploadResult = await cloudinary.uploader.upload(uploadPath, {
      resource_type: target.type,
      folder: uploadFolder,
      use_filename: true,
      unique_filename: false
    });

    console.log(`✓ [SUCCESS] Uploaded: ${uploadResult.secure_url}`);

    let posterUrl = uploadResult.secure_url;
    if (target.type === 'video') {
      posterUrl = uploadResult.secure_url.replace(/\.(mp4|mov|webm)$/i, '.jpg');
      // Inject thumbnail transformation for best quality first frame
      posterUrl = posterUrl.replace('/upload/', '/upload/so_0,f_jpg,q_auto/');
    }

    const entry = {
      category: target.category,
      originalFile: path.basename(target.relPath),
      resourceType: target.type,
      secureUrl: uploadResult.secure_url,
      posterUrl,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration
    };

    manifest[key] = entry;
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(manifest, null, 2), 'utf8');

    if (isTemp && fs.existsSync(uploadPath)) {
      try { fs.unlinkSync(uploadPath); } catch (_) {}
    }

    return entry;
  } catch (err) {
    console.error(`!!! [UPLOAD FAILED] ${target.relPath}:`, err.message || err);
    if (isTemp && fs.existsSync(uploadPath)) {
      try { fs.unlinkSync(uploadPath); } catch (_) {}
    }
    return null;
  }
}

async function run() {
  console.log(`=========================================`);
  console.log(`Starting Cloudinary Batch Upload`);
  console.log(`Total Targets: ${uploadTargets.length}`);
  console.log(`=========================================\n`);

  for (let i = 0; i < uploadTargets.length; i++) {
    const target = uploadTargets[i];
    console.log(`\n[${i + 1}/${uploadTargets.length}] Processing ${target.category}: ${target.relPath}`);
    await uploadFile(target);
  }

  console.log(`\n=========================================`);
  console.log(`Upload Complete! Saved manifest to: ${OUTPUT_JSON}`);
  console.log(`Total Uploaded Assets: ${Object.keys(manifest).length}`);
  console.log(`=========================================`);
}

run().catch(console.error);
