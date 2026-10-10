const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

// Set FFmpeg PATH if Gyan build exists
const ffmpegBin = path.join(
  process.env.LOCALAPPDATA || 'C:\\Users\\ABHIN\\AppData\\Local',
  'Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-full_build\\bin'
);
if (fs.existsSync(ffmpegBin)) {
  process.env.PATH = `${ffmpegBin};${process.env.PATH}`;
}

require('dotenv').config();

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
  console.error('Missing R2 credentials in .env. Please check R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL.');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

const PUBLIC_BASE = R2_PUBLIC_URL.replace(/\/+$/, '');
const ASSETS_DIR = path.resolve(__dirname, '../src/assets');
const TEMP_DIR = path.resolve(__dirname, '../temp_upload');
const OUTPUT_JSON = path.resolve(__dirname, '../src/data/cloudinaryAssets.json');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

let manifest = {};
if (fs.existsSync(OUTPUT_JSON)) {
  try {
    manifest = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf8'));
  } catch (e) {
    manifest = {};
  }
}

// Upload a single buffer/file to R2
async function uploadToR2(filePath, r2Key, contentType) {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileStream,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  });

  await s3Client.send(command);
  return `${PUBLIC_BASE}/${r2Key}`;
}

// Extract video poster frame
function extractPoster(videoPath, outPosterPath) {
  try {
    const cmd = `ffmpeg -y -ss 00:00:00.5 -i "${videoPath}" -vframes 1 -q:v 2 "${outPosterPath}"`;
    execSync(cmd, { stdio: 'ignore' });
    return fs.existsSync(outPosterPath);
  } catch (e) {
    try {
      const fallbackCmd = `ffmpeg -y -ss 00:00:00 -i "${videoPath}" -vframes 1 -q:v 2 "${outPosterPath}"`;
      execSync(fallbackCmd, { stdio: 'ignore' });
      return fs.existsSync(outPosterPath);
    } catch (_) {
      return false;
    }
  }
}

// Create 480p preview clip for video
function extractPreview(videoPath, outPreviewPath) {
  try {
    const cmd = `ffmpeg -y -i "${videoPath}" -t 15 -vf "scale='min(480,iw)':-2" -c:v libx264 -crf 28 -preset fast -an -movflags +faststart "${outPreviewPath}"`;
    execSync(cmd, { stdio: 'ignore' });
    return fs.existsSync(outPreviewPath);
  } catch (e) {
    return false;
  }
}

// Process and upload a video asset
async function processVideo(fullPath, relPath, category, baseName) {
  const r2VideoKey = `${category}/${baseName}.mp4`;
  const r2PosterKey = `${category}/${baseName}_poster.jpg`;
  const r2PreviewKey = `${category}/${baseName}_preview.mp4`;

  console.log(`\n  [VIDEO] Uploading: ${relPath}`);

  // 1. Full video
  console.log(`    -> Uploading master video: ${r2VideoKey}`);
  const secureUrl = await uploadToR2(fullPath, r2VideoKey, 'video/mp4');

  // 2. Poster frame
  let posterUrl = secureUrl;
  const tempPoster = path.join(TEMP_DIR, `${baseName}_poster.jpg`);
  if (extractPoster(fullPath, tempPoster)) {
    console.log(`    -> Uploading video poster: ${r2PosterKey}`);
    posterUrl = await uploadToR2(tempPoster, r2PosterKey, 'image/jpeg');
    try { fs.unlinkSync(tempPoster); } catch (_) {}
  }

  // 3. 480p Preview clip
  let previewUrl = secureUrl;
  const tempPreview = path.join(TEMP_DIR, `${baseName}_preview.mp4`);
  if (extractPreview(fullPath, tempPreview)) {
    console.log(`    -> Uploading preview clip: ${r2PreviewKey}`);
    previewUrl = await uploadToR2(tempPreview, r2PreviewKey, 'video/mp4');
    try { fs.unlinkSync(tempPreview); } catch (_) {}
  }

  return {
    category,
    originalFile: path.basename(fullPath),
    resourceType: 'video',
    secureUrl,
    posterUrl,
    previewUrl,
    publicId: `${category}/${baseName}`
  };
}

// Process and upload an image asset
async function processImage(fullPath, relPath, category, baseName) {
  const ext = path.extname(fullPath).toLowerCase();
  const r2Key = `${category}/${baseName}.jpg`;
  const r2ThumbKey = `${category}/${baseName}_800.jpg`;

  console.log(`\n  [IMAGE] Processing: ${relPath}`);

  // Master image (max 2560px, JPEG quality 85)
  const tempMaster = path.join(TEMP_DIR, `${baseName}_master.jpg`);
  await sharp(fullPath)
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(tempMaster);

  console.log(`    -> Uploading master image: ${r2Key}`);
  const secureUrl = await uploadToR2(tempMaster, r2Key, 'image/jpeg');
  try { fs.unlinkSync(tempMaster); } catch (_) {}

  // Derivative image (800px card width)
  const tempThumb = path.join(TEMP_DIR, `${baseName}_800.jpg`);
  await sharp(fullPath)
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true })
    .toFile(tempThumb);

  console.log(`    -> Uploading 800w thumbnail: ${r2ThumbKey}`);
  const thumbUrl = await uploadToR2(tempThumb, r2ThumbKey, 'image/jpeg');
  try { fs.unlinkSync(tempThumb); } catch (_) {}

  return {
    category,
    originalFile: path.basename(fullPath),
    resourceType: 'image',
    secureUrl,
    posterUrl: secureUrl,
    thumbUrl,
    publicId: `${category}/${baseName}`
  };
}

// Recursive scanner for directory
const imgExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);
const vidExts = new Set(['.mp4', '.mov', '.webm', '.mkv']);

function scan(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(scan(full));
    } else {
      const ext = path.extname(item.name).toLowerCase();
      if (imgExts.has(ext) || vidExts.has(ext)) {
        results.push({
          fullPath: full,
          fileName: item.name,
          ext,
          isVideo: vidExts.has(ext)
        });
      }
    }
  }
  return results;
}

async function run(targetDir) {
  const scanFolder = targetDir || ASSETS_DIR;
  console.log('======================================================');
  console.log('Cloudflare R2 Asset Sync');
  console.log('Scanning:', scanFolder);
  console.log('Bucket:', R2_BUCKET_NAME);
  console.log('Public URL:', PUBLIC_BASE);
  console.log('======================================================');

  const files = scan(scanFolder);
  console.log(`Found ${files.length} asset(s) to process.\n`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rel = path.relative(scanFolder, file.fullPath).replace(/\\/g, '/');
    const folderParts = path.dirname(rel).split('/');
    let category = (folderParts[folderParts.length - 1] || 'general').toLowerCase().replace(/f&b/g, 'fb').replace(/\s+/g, '_');
    if (category === '.') category = 'general';

    const baseName = path.basename(file.fileName, file.ext).trim().replace(/\s+/g, '_');
    const manifestKey = `${category}_${baseName}`;

    console.log(`[${i + 1}/${files.length}] Processing ${manifestKey}...`);

    try {
      let entry;
      if (file.isVideo) {
        entry = await processVideo(file.fullPath, rel, category, baseName);
      } else {
        entry = await processImage(file.fullPath, rel, category, baseName);
      }

      manifest[manifestKey] = entry;
      fs.writeFileSync(OUTPUT_JSON, JSON.stringify(manifest, null, 2), 'utf8');
      console.log(`  ✓ Completed: ${manifestKey}`);
    } catch (err) {
      console.error(`  ✗ Error processing ${file.fileName}:`, err.message || err);
    }
  }

  console.log('\n======================================================');
  console.log(`Finished! Manifest updated at ${OUTPUT_JSON}`);
  console.log('======================================================');
}

const customTarget = process.argv[2] ? path.resolve(process.argv[2]) : null;
run(customTarget).catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
