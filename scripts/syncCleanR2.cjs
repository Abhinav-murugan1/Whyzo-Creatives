const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Configure FFmpeg binary path
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
  console.error('Missing R2 credentials in .env.');
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

const MAX_TOTAL_BYTES = 9.8 * 1024 * 1024 * 1024; // 9.8 GB strictly enforced ceiling
const PUBLIC_BASE = R2_PUBLIC_URL.replace(/\/+$/, '');
const VIDEOS_DIR = path.resolve(__dirname, '../src/assets/VIDEOS');
const TEAM_DIR = path.resolve(__dirname, '../src/assets/PHOTOS/TEAM');
const TEMP_DIR = path.resolve(__dirname, '../temp_upload');
const MANIFEST_FILE = path.resolve(__dirname, '../src/data/cloudinaryAssets.json');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Folder to category mapping
const FOLDER_TO_CATEGORY = {
  'AUTOMOTIVES': 'automotive',
  'CGI': 'cgi',
  'CORPORATE FILMS': 'corporate',
  'EVENTS': 'events',
  'F&B': 'fb',
  'INFLUENCER': 'influencer',
  'REALESTATE': 'realestate',
  'SPORTS': 'sports',
  'Product photography': 'photos'
};

// Explicit clean base overrides for filenames with unusual characters
const CLEAN_BASE_OVERRIDES = {
  'Comp 1_1-1.mp4': 'Comp_1_1-1',
  'Comp 1_2-2_1.mp4': 'Comp_1_2-2_1',
  'AWS .mp4': 'AWS',
  'hansika..02_prob3.mp4': 'hansika_02_prob3',
  'RTA..mp4': 'RTA',
  'AMARA BISTRO .mp4': 'AMARA_BISTRO',
  'Dubai mall.mp4': 'Dubai_mall',
  'Outfit brand.mp4': 'Outfit_brand',
  'THE VILLA.mp4': 'THE_VILLA',
  'TILAL NEW REEL.mp4': 'TILAL_NEW_REEL',
  'TILAL NEW YT.mp4': 'TILAL_NEW_YT',
  'STAND BUILD UP.mp4': 'STAND_BUILD_UP',
  'WEB FORUM.mp4': 'WEB_FORUM',
  'AMANA FINAL 4K.mp4': 'AMANA_FINAL_4K',
  'GANG OF GIRLS.mp4': 'GANG_OF_GIRLS',
  'GISEC 2025.mp4': 'GISEC_2025',
  'GITEX 2024.mp4': 'GITEX_2024',
  'GITEX 2025.mp4': 'GITEX_2025',
  'MDC NEW YEAR.mp4': 'MDC_NEW_YEAR',
  'MIST NEW YEAR.mp4': 'MIST_NEW_YEAR',
  'BISTRO 2.mp4': 'BISTRO_2',
  'MDC 1.mp4': 'MDC_1',
  'MDC 6.mp4': 'MDC_6',
  'MDC WINE.mp4': 'MDC_WINE',
  'JETSKI OUT.mp4': 'JETSKI_OUT',
  'SEI SAADIYATH.mp4': 'SEI_SAADIYATH',
  'TOPSPIN 3.mp4': 'TOPSPIN_3',
  'TOPSPIN ALEXA.mp4': 'TOPSPIN_ALEXA',
  'TOPSPIN EVENT.mp4': 'TOPSPIN_EVENT',
  'COFFEE CUP.mp4': 'COFFEE_CUP',
  'MC AIRPODS.jpg': 'MC_AIRPODS',
  'IMG_1221 2.JPG': 'IMG_1221_2'
};

function getCleanBase(filename) {
  if (CLEAN_BASE_OVERRIDES[filename]) return CLEAN_BASE_OVERRIDES[filename];
  const ext = path.extname(filename);
  let base = path.basename(filename, ext);
  return base
    .trim()
    .replace(/[.\s_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function getCurrentR2Storage() {
  let totalBytes = 0;
  let token = undefined;
  do {
    const res = await s3Client.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      ContinuationToken: token
    }));
    if (res.Contents) {
      for (const obj of res.Contents) {
        totalBytes += obj.Size;
      }
    }
    token = res.NextContinuationToken;
  } while (token);
  return totalBytes;
}

let currentTotalR2Bytes = 0;

async function uploadToR2Safe(filePath, r2Key, contentType) {
  const stat = fs.statSync(filePath);
  if (currentTotalR2Bytes + stat.size > MAX_TOTAL_BYTES) {
    throw new Error(`SAFETY LIMIT REACHED: Uploading ${r2Key} (${(stat.size / (1024 * 1024)).toFixed(1)} MB) would exceed 9.8 GB cap!`);
  }

  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileStream,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  });

  await s3Client.send(command);
  currentTotalR2Bytes += stat.size;
  return `${PUBLIC_BASE}/${r2Key}`;
}

function probeVideo(filePath) {
  try {
    const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration:format=duration -of json "${filePath}"`;
    const out = JSON.parse(execSync(cmd).toString());
    const stream = out.streams && out.streams[0] ? out.streams[0] : {};
    const fmt = out.format || {};
    return {
      width: stream.width || 1920,
      height: stream.height || 1080,
      duration: parseFloat(fmt.duration || stream.duration || 0)
    };
  } catch (e) {
    return { width: 1920, height: 1080, duration: 0 };
  }
}

function prepareWebVideo(srcPath, tempDest, meta, sizeMB) {
  const is4K = meta.width > 1920 || meta.height > 1920;
  const isLarge = sizeMB > 75;

  if (!is4K && !isLarge) {
    return { uploadPath: srcPath, isTemp: false };
  }

  console.log(`    [FFmpeg] Web optimizing (${sizeMB.toFixed(1)} MB, ${meta.width}x${meta.height})...`);
  const scale = "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))'";
  const cmd = `ffmpeg -y -i "${srcPath}" -vf "${scale}" -map 0:v:0 -map 0:a? -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -movflags +faststart "${tempDest}"`;
  execSync(cmd, { stdio: 'ignore' });
  const newSizeMB = fs.statSync(tempDest).size / (1024 * 1024);
  console.log(`    [FFmpeg] Reduced to: ${newSizeMB.toFixed(1)} MB (${((1 - newSizeMB / sizeMB) * 100).toFixed(0)}% saved)`);
  return { uploadPath: tempDest, isTemp: true };
}

function extractPoster(videoPath, tempPoster) {
  try {
    const cmd = `ffmpeg -y -ss 00:00:01 -i "${videoPath}" -vframes 1 -q:v 2 "${tempPoster}"`;
    execSync(cmd, { stdio: 'ignore' });
    return fs.existsSync(tempPoster);
  } catch (e) {
    try {
      execSync(`ffmpeg -y -ss 00:00:00.1 -i "${videoPath}" -vframes 1 -q:v 2 "${tempPoster}"`, { stdio: 'ignore' });
      return fs.existsSync(tempPoster);
    } catch (_) {
      return false;
    }
  }
}

function extractPreview(videoPath, tempPreview) {
  try {
    const cmd = `ffmpeg -y -i "${videoPath}" -t 15 -vf "scale='if(gt(iw,ih),min(480,iw),-2)':'if(gt(iw,ih),-2,min(480,ih))'" -c:v libx264 -crf 28 -preset fast -an -movflags +faststart "${tempPreview}"`;
    execSync(cmd, { stdio: 'ignore' });
    return fs.existsSync(tempPreview);
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log('================================================================');
  console.log('🚀 CLEAN R2 SYNCHRONIZATION (Strict 9.8 GB Ceiling)');
  console.log('================================================================');

  currentTotalR2Bytes = await getCurrentR2Storage();
  console.log(`Current R2 storage: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(2)} MB`);

  const manifest = {};

  // 1. COLLECT ALL ASSETS
  const videoItems = [];
  const photoItems = [];
  const teamItems = [];

  const subdirs = fs.readdirSync(VIDEOS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const subdir of subdirs) {
    const category = FOLDER_TO_CATEGORY[subdir.name];
    if (!category) continue;

    const fullDirPath = path.join(VIDEOS_DIR, subdir.name);
    const files = fs.readdirSync(fullDirPath, { recursive: true, withFileTypes: true }).filter(f => f.isFile());

    for (const f of files) {
      if (f.name.endsWith('.zip')) continue;
      const fullPath = path.join(f.path || f.parentPath || fullDirPath, f.name);
      const ext = path.extname(f.name).toLowerCase();
      const cleanBase = getCleanBase(f.name);

      if (ext === '.mp4' || ext === '.mov') {
        videoItems.push({
          fullPath,
          fileName: f.name,
          category,
          cleanBase,
          size: fs.statSync(fullPath).size
        });
      } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        photoItems.push({
          fullPath,
          fileName: f.name,
          category: 'photos', // All photos categorized under Commercial Photography
          cleanBase,
          size: fs.statSync(fullPath).size
        });
      }
    }
  }

  // Team portraits
  if (fs.existsSync(TEAM_DIR)) {
    const teamFiles = fs.readdirSync(TEAM_DIR, { withFileTypes: true }).filter(f => f.isFile());
    for (const f of teamFiles) {
      const ext = path.extname(f.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const fullPath = path.join(TEAM_DIR, f.name);
        const cleanBase = path.basename(f.name, ext).trim();
        teamItems.push({
          fullPath,
          fileName: f.name,
          category: 'team',
          cleanBase,
          size: fs.statSync(fullPath).size
        });
      }
    }
  }

  console.log(`Discovered:`);
  console.log(`  - Videos: ${videoItems.length}`);
  console.log(`  - Commercial Photos: ${photoItems.length}`);
  console.log(`  - Team Portraits: ${teamItems.length}`);
  console.log(`Total items to process: ${videoItems.length + photoItems.length + teamItems.length}\n`);

  // 2. PROCESS VIDEOS
  console.log('--- Processing Videos ---');
  for (let i = 0; i < videoItems.length; i++) {
    const item = videoItems[i];
    const manifestKey = `${item.category}_${item.cleanBase}`;
    const sizeMB = item.size / (1024 * 1024);
    console.log(`[Video ${i + 1}/${videoItems.length}] ${manifestKey} (${item.fileName}, ${sizeMB.toFixed(1)} MB)`);

    const meta = probeVideo(item.fullPath);
    const r2VideoKey = `${item.category}/${item.cleanBase}.mp4`;
    const r2PosterKey = `${item.category}/${item.cleanBase}_poster.jpg`;
    const r2PreviewKey = `${item.category}/${item.cleanBase}_preview.mp4`;

    const tempOptVideo = path.join(TEMP_DIR, `opt_${item.cleanBase}.mp4`);
    const tempPoster = path.join(TEMP_DIR, `poster_${item.cleanBase}.jpg`);
    const tempPreview = path.join(TEMP_DIR, `preview_${item.cleanBase}.mp4`);

    try {
      // Step A: Web optimize if needed
      const { uploadPath, isTemp } = prepareWebVideo(item.fullPath, tempOptVideo, meta, sizeMB);

      // Step B: Upload video
      console.log(`    -> Uploading video: ${r2VideoKey}`);
      const secureUrl = await uploadToR2Safe(uploadPath, r2VideoKey, 'video/mp4');
      if (isTemp && fs.existsSync(uploadPath)) {
        try { fs.unlinkSync(uploadPath); } catch (_) {}
      }

      // Step C: Poster
      let posterUrl = secureUrl;
      if (extractPoster(item.fullPath, tempPoster)) {
        console.log(`    -> Uploading poster: ${r2PosterKey}`);
        posterUrl = await uploadToR2Safe(tempPoster, r2PosterKey, 'image/jpeg');
        try { fs.unlinkSync(tempPoster); } catch (_) {}
      }

      // Step D: Preview
      let previewUrl = secureUrl;
      if (extractPreview(item.fullPath, tempPreview)) {
        console.log(`    -> Uploading preview: ${r2PreviewKey}`);
        previewUrl = await uploadToR2Safe(tempPreview, r2PreviewKey, 'video/mp4');
        try { fs.unlinkSync(tempPreview); } catch (_) {}
      }

      // Step E: Manifest entry
      manifest[manifestKey] = {
        category: item.category,
        originalFile: item.fileName,
        resourceType: 'video',
        secureUrl,
        posterUrl,
        previewUrl,
        publicId: `${item.category}/${item.cleanBase}`,
        width: meta.width > meta.height ? Math.min(1920, meta.width) : Math.min(1080, meta.width),
        height: meta.width > meta.height ? Math.min(1080, meta.height) : Math.min(1920, meta.height),
        duration: meta.duration
      };

      fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
      console.log(`  ✓ Done ${manifestKey} (R2 total: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(1)} MB)\n`);
    } catch (err) {
      console.error(`  ✗ Error processing ${item.fileName}:`, err.message);
      if (fs.existsSync(tempOptVideo)) try { fs.unlinkSync(tempOptVideo); } catch (_) {}
      if (fs.existsSync(tempPoster)) try { fs.unlinkSync(tempPoster); } catch (_) {}
      if (fs.existsSync(tempPreview)) try { fs.unlinkSync(tempPreview); } catch (_) {}
      throw err;
    }
  }

  // 3. PROCESS COMMERCIAL PHOTOS
  console.log('\n--- Processing Commercial Photography ---');
  for (let i = 0; i < photoItems.length; i++) {
    const item = photoItems[i];
    const manifestKey = `photos_${item.cleanBase}`;
    const sizeMB = item.size / (1024 * 1024);
    console.log(`[Photo ${i + 1}/${photoItems.length}] ${manifestKey} (${item.fileName}, ${sizeMB.toFixed(1)} MB)`);

    const r2MasterKey = `photos/${item.cleanBase}.jpg`;
    const r2ThumbKey = `photos/${item.cleanBase}_800.jpg`;

    const tempMaster = path.join(TEMP_DIR, `master_${item.cleanBase}.jpg`);
    const tempThumb = path.join(TEMP_DIR, `thumb_${item.cleanBase}.jpg`);

    try {
      const meta = await sharp(item.fullPath).metadata();

      // Master capped at 2560px for ultra-sharp 4K viewing at minimal file size
      await sharp(item.fullPath)
        .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(tempMaster);

      // Thumbnail width capped at 800px
      await sharp(item.fullPath)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(tempThumb);

      console.log(`    -> Uploading master: ${r2MasterKey}`);
      const secureUrl = await uploadToR2Safe(tempMaster, r2MasterKey, 'image/jpeg');

      console.log(`    -> Uploading thumbnail: ${r2ThumbKey}`);
      const thumbUrl = await uploadToR2Safe(tempThumb, r2ThumbKey, 'image/jpeg');

      try { fs.unlinkSync(tempMaster); } catch (_) {}
      try { fs.unlinkSync(tempThumb); } catch (_) {}

      manifest[manifestKey] = {
        category: 'photos',
        originalFile: item.fileName,
        resourceType: 'image',
        secureUrl,
        posterUrl: secureUrl,
        thumbUrl,
        publicId: `photos/${item.cleanBase}`,
        width: meta.width,
        height: meta.height
      };

      fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
      console.log(`  ✓ Done ${manifestKey} (R2 total: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(1)} MB)\n`);
    } catch (err) {
      console.error(`  ✗ Error processing ${item.fileName}:`, err.message);
      if (fs.existsSync(tempMaster)) try { fs.unlinkSync(tempMaster); } catch (_) {}
      if (fs.existsSync(tempThumb)) try { fs.unlinkSync(tempThumb); } catch (_) {}
      throw err;
    }
  }

  // 4. PROCESS TEAM PORTRAITS
  console.log('\n--- Processing Team Portraits ---');
  for (let i = 0; i < teamItems.length; i++) {
    const item = teamItems[i];
    const manifestKey = `team_${item.cleanBase}`;
    console.log(`[Team ${i + 1}/${teamItems.length}] ${manifestKey} (${item.fileName})`);

    const r2MasterKey = `team/${item.cleanBase}.jpg`;
    const r2ThumbKey = `team/${item.cleanBase}_800.jpg`;

    const tempMaster = path.join(TEMP_DIR, `team_${item.cleanBase}.jpg`);
    const tempThumb = path.join(TEMP_DIR, `team_thumb_${item.cleanBase}.jpg`);

    try {
      const meta = await sharp(item.fullPath).metadata();

      await sharp(item.fullPath)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 90, mozjpeg: true })
        .toFile(tempMaster);

      await sharp(item.fullPath)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(tempThumb);

      console.log(`    -> Uploading master: ${r2MasterKey}`);
      const secureUrl = await uploadToR2Safe(tempMaster, r2MasterKey, 'image/jpeg');

      console.log(`    -> Uploading thumbnail: ${r2ThumbKey}`);
      const thumbUrl = await uploadToR2Safe(tempThumb, r2ThumbKey, 'image/jpeg');

      try { fs.unlinkSync(tempMaster); } catch (_) {}
      try { fs.unlinkSync(tempThumb); } catch (_) {}

      manifest[manifestKey] = {
        category: 'team',
        originalFile: item.fileName,
        resourceType: 'image',
        secureUrl,
        posterUrl: secureUrl,
        thumbUrl,
        publicId: `team/${item.cleanBase}`,
        width: meta.width,
        height: meta.height
      };

      fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
      console.log(`  ✓ Done ${manifestKey} (R2 total: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(1)} MB)\n`);
    } catch (err) {
      console.error(`  ✗ Error processing ${item.fileName}:`, err.message);
      if (fs.existsSync(tempMaster)) try { fs.unlinkSync(tempMaster); } catch (_) {}
      if (fs.existsSync(tempThumb)) try { fs.unlinkSync(tempThumb); } catch (_) {}
      throw err;
    }
  }

  console.log('================================================================');
  console.log('🎉 ALL ASSETS SYNCHRONIZED TO R2 SUCCESSFULLY!');
  console.log(`Final R2 Storage: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(2)} MB (${(currentTotalR2Bytes / (1024 * 1024 * 1024)).toFixed(3)} GB)`);
  console.log(`Storage headroom remaining: ${((MAX_TOTAL_BYTES - currentTotalR2Bytes) / (1024 * 1024 * 1024)).toFixed(2)} GB`);
  console.log(`Clean manifest written to: ${MANIFEST_FILE}`);
  console.log('================================================================');
}

run().catch(err => {
  console.error('FATAL SYNC ERROR:', err);
  process.exit(1);
});
