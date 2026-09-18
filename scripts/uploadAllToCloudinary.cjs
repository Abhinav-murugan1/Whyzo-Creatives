const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

// Set FFmpeg PATH
const ffmpegBin = path.join(
  process.env.LOCALAPPDATA || 'C:\\Users\\ABHIN\\AppData\\Local',
  'Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-full_build\\bin'
);
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

// Load existing manifest
let manifest = {};
if (fs.existsSync(OUTPUT_JSON)) {
  try {
    manifest = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf8'));
  } catch (e) {
    manifest = {};
  }
}

// File extensions
const imgExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp', '.heic']);
const vidExts = new Set(['.mp4', '.mov', '.webm', '.mkv', '.avi']);

// Recursive scanner
function scanDir(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(scanDir(full));
    } else {
      const ext = path.extname(item.name).toLowerCase();
      if (imgExts.has(ext) || vidExts.has(ext)) {
        const stat = fs.statSync(full);
        const rel = path.relative(ASSETS_DIR, full).replace(/\\/g, '/');
        const isVid = vidExts.has(ext);
        files.push({
          fullPath: full,
          relPath: rel,
          fileName: item.name,
          ext,
          type: isVid ? 'video' : 'image',
          sizeBytes: stat.size,
          sizeMB: stat.size / (1024 * 1024)
        });
      }
    }
  }
  return files;
}

// Sanitize Cloudinary folder path
function sanitizeFolder(relPath) {
  const parts = path.dirname(relPath).split('/');
  return parts
    .map(p => {
      let s = p.toLowerCase().trim();
      s = s.replace(/f&b/g, 'fb').replace(/&/g, '_').replace(/\s+/g, '_');
      return s;
    })
    .filter(p => p && p !== '.')
    .join('/');
}

// Generate unique manifest key
function getManifestKey(target) {
  const cleanRel = target.relPath
    .replace(/\.[^/.]+$/, '')
    .replace(/[\\/]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/&/g, '_')
    .toLowerCase();
  return cleanRel;
}

// Get video duration via ffprobe
function getVideoDuration(filePath) {
  try {
    const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
    const out = execSync(cmd).toString().trim();
    return parseFloat(out) || 0;
  } catch (err) {
    return 0;
  }
}

// Optimize Image using Sharp
async function optimizeImage(srcPath, destPath) {
  console.log(`    [Sharp] Downsampling image: ${path.basename(srcPath)}`);
  await sharp(srcPath)
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(destPath);
  const stat = fs.statSync(destPath);
  console.log(`    [Sharp] Optimized size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

// Compress Video using FFmpeg
function compressVideo(srcPath, destPath, currentSizeMB) {
  console.log(`    [FFmpeg] Compressing video: ${path.basename(srcPath)} (${currentSizeMB.toFixed(2)} MB)`);
  const duration = getVideoDuration(srcPath);
  console.log(`    [FFmpeg] Duration: ${duration.toFixed(1)}s (~${(duration / 60).toFixed(1)} mins)`);

  let ffmpegArgs = '';
  // Cloudinary free tier allows up to 100 MB (104,857,600 bytes). Target 80 MB max for safety.
  if (duration > 0) {
    const targetBits = 80 * 1024 * 1024 * 8; // 80 MB in bits
    const totalBitrateBps = targetBits / duration;
    const audioBitrateKbps = 128;
    let videoBitrateKbps = Math.floor((totalBitrateBps / 1000) - audioBitrateKbps);

    // Clamp video bitrate
    if (videoBitrateKbps > 6500) videoBitrateKbps = 6500;
    if (videoBitrateKbps < 500) videoBitrateKbps = 500;

    console.log(`    [FFmpeg] Target video bitrate: ${videoBitrateKbps}k`);
    const scale = videoBitrateKbps < 1200 ? "'min(1280,iw)':-2" : "'min(1920,iw)':-2";
    ffmpegArgs = `-vf "scale=${scale}" -c:v libx264 -b:v ${videoBitrateKbps}k -maxrate ${Math.floor(videoBitrateKbps * 1.3)}k -bufsize ${Math.floor(videoBitrateKbps * 2)}k -preset veryfast -c:a aac -b:a 128k -movflags +faststart`;
  } else {
    ffmpegArgs = `-vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 128k -movflags +faststart`;
  }

  const cmd = `ffmpeg -y -i "${srcPath}" ${ffmpegArgs} "${destPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  const stat = fs.statSync(destPath);
  console.log(`    [FFmpeg] Result size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);

  // Fallback safety: if still > 95 MB, compress with lower bitrate
  if (stat.size > 95 * 1024 * 1024 && duration > 0) {
    console.log(`    [FFmpeg] File still exceeds 95MB, re-encoding with lower bitrate...`);
    const fallbackDest = destPath + '.fallback.mp4';
    const emergencyCmd = `ffmpeg -y -i "${srcPath}" -vf "scale='min(1280,iw)':-2" -c:v libx264 -b:v 1500k -maxrate 2000k -bufsize 3000k -preset ultrafast -c:a aac -b:a 96k -movflags +faststart "${fallbackDest}"`;
    execSync(emergencyCmd, { stdio: 'inherit' });
    fs.renameSync(fallbackDest, destPath);
    console.log(`    [FFmpeg] Secondary result size: ${(fs.statSync(destPath).size / (1024 * 1024)).toFixed(2)} MB`);
  }
}

async function uploadSingleAsset(asset, index, total) {
  const key = getManifestKey(asset);
  console.log(`\n[${index + 1}/${total}] Processing ${asset.type.toUpperCase()}: ${asset.relPath}`);

  // Check if existing manifest already has this file uploaded
  for (const k in manifest) {
    const m = manifest[k];
    if (m && (m.originalRelPath === asset.relPath || (m.originalFile === asset.fileName && m.resourceType === asset.type))) {
      if (m.secureUrl) {
        console.log(`  >>> [SKIPPING] Already uploaded: ${m.secureUrl}`);
        return m;
      }
    }
  }

  const folder = sanitizeFolder(asset.relPath) || 'general';
  let uploadPath = asset.fullPath;
  let isTemp = false;

  try {
    // Determine if pre-processing is needed
    if (asset.type === 'image' && asset.sizeMB > 9.5) {
      const tempImg = path.join(TEMP_DIR, `opt_${path.basename(asset.fullPath, asset.ext)}.jpg`);
      await optimizeImage(asset.fullPath, tempImg);
      uploadPath = tempImg;
      isTemp = true;
    } else if (asset.type === 'video' && asset.sizeMB > 92.0) {
      const tempVid = path.join(TEMP_DIR, `opt_${path.basename(asset.fullPath, asset.ext)}.mp4`);
      compressVideo(asset.fullPath, tempVid, asset.sizeMB);
      uploadPath = tempVid;
      isTemp = true;
    }

    console.log(`  >>> [UPLOADING] ${asset.fileName} to Cloudinary folder "${folder}"...`);
    const uploadResult = await cloudinary.uploader.upload(uploadPath, {
      resource_type: asset.type,
      folder,
      use_filename: true,
      unique_filename: false,
      timeout: 600000
    });

    console.log(`  ✓ [SUCCESS] Uploaded: ${uploadResult.secure_url}`);

    let posterUrl = uploadResult.secure_url;
    if (asset.type === 'video') {
      posterUrl = uploadResult.secure_url.replace(/\.(mp4|mov|webm|mkv|avi)$/i, '.jpg');
      posterUrl = posterUrl.replace('/upload/', '/upload/so_0,f_jpg,q_auto/');
    }

    const entry = {
      manifestKey: key,
      originalRelPath: asset.relPath,
      originalFile: asset.fileName,
      category: folder.split('/')[0],
      folder,
      resourceType: asset.type,
      secureUrl: uploadResult.secure_url,
      posterUrl,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration || null,
      bytes: uploadResult.bytes
    };

    manifest[key] = entry;
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(manifest, null, 2), 'utf8');

    if (isTemp && fs.existsSync(uploadPath)) {
      try { fs.unlinkSync(uploadPath); } catch (_) {}
    }

    return entry;
  } catch (err) {
    console.error(`  !!! [FAILED] ${asset.relPath}:`, err.message || err);
    if (isTemp && fs.existsSync(uploadPath)) {
      try { fs.unlinkSync(uploadPath); } catch (_) {}
    }
    return null;
  }
}

async function runAll() {
  console.log('======================================================');
  console.log('Starting Full Cloudinary Asset Synchronization');
  console.log('Scanning folder:', ASSETS_DIR);
  console.log('======================================================\n');

  const allAssets = scanDir(ASSETS_DIR);
  console.log(`Found total assets: ${allAssets.length} (${allAssets.filter(a => a.type === 'video').length} videos, ${allAssets.filter(a => a.type === 'image').length} images)\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allAssets.length; i++) {
    const asset = allAssets[i];
    const res = await uploadSingleAsset(asset, i, allAssets.length);
    if (res) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n======================================================');
  console.log('Synchronization Complete!');
  console.log(`Total scanned: ${allAssets.length}`);
  console.log(`Processed/Saved: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log('Manifest saved to:', OUTPUT_JSON);
  console.log('======================================================');
}

runAll().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
