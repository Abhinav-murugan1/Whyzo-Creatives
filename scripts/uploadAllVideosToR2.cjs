const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// FFmpeg binary path
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
const TEMP_DIR = path.resolve(__dirname, '../temp_upload');
const MANIFEST_FILE = path.resolve(__dirname, '../src/data/cloudinaryAssets.json');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Explicit categorization of all videos
const CATEGORY_MAP = {
  // AUTOMOTIVE
  'FERRARI.mp4': 'automotive',
  'MCLAREN.mp4': 'automotive',
  'URUSS.mp4': 'automotive',
  'lmbo.mp4': 'automotive',
  'Comp 1_1-1.mp4': 'automotive',
  'Comp 1_2-2_1.mp4': 'automotive',

  // CGI
  'PERFUME.mp4': 'cgi',

  // CORPORATE
  'STAND BUILD UP.mp4': 'corporate',
  'WEB FORUM.mp4': 'corporate',
  'AMANA FINAL 4K.mp4': 'corporate',
  'AWS.mp4': 'corporate',
  'RTA.mp4': 'corporate',

  // EVENTS
  'INTRO INTERSEC.mp4': 'events',
  'GITEX 2025.mp4': 'events',
  'GITEX 2024.mp4': 'events',
  'GISEC 2025.mp4': 'events',
  'ADIPEC.mp4': 'events',

  // FOOD & BEVERAGE
  'AMARA.mp4': 'fb',
  'BISTRO BOTTLE.mp4': 'fb',
  'BISTRO.mp4': 'fb',
  'FOOD 2.mp4': 'fb',
  'MDC NEW.mp4': 'fb',
  'MIST 2.mp4': 'fb',
  'DROPSHOT.mp4': 'fb',
  'MDC WINE.mp4': 'fb',
  'MDC FINAL.mp4': 'fb',
  'MCD SUSHI.mp4': 'fb',

  // INFLUENCER
  'JETSKI OUT.mp4': 'influencer',
  'GANG OF GIRLS.mp4': 'influencer',

  // PODCAST
  'math pod 9.mp4': 'podcast',
  'P2.mp4': 'podcast',

  // LUXURY REAL ESTATE
  'JOELLE RAAD.mp4': 'realestate',
  'STOREY FINAL OUT.mp4': 'realestate',
  'TILAL NEW YT.mp4': 'realestate',

  // SPORTS & ATHLETICS
  'TOPSPIN.mp4': 'sports',
  'TOPSPIN ALEXA.mp4': 'sports',
  'TOPSPIN EVENT.mp4': 'sports'
};

// Title overrides and clean names
const CLEAN_NAMES = {
  'Comp 1_1-1.mp4': 'Comp_1_1-1',
  'Comp 1_2-2_1.mp4': 'Comp_1_2-2_1',
  'AMANA FINAL 4K.mp4': 'AMANA_FINAL_4K',
  'STAND BUILD UP.mp4': 'STAND_BUILD_UP',
  'WEB FORUM.mp4': 'WEB_FORUM',
  'INTRO INTERSEC.mp4': 'INTRO_INTERSEC',
  'GITEX 2025.mp4': 'GITEX_2025',
  'GITEX 2024.mp4': 'GITEX_2024',
  'GISEC 2025.mp4': 'GISEC_2025',
  'BISTRO BOTTLE.mp4': 'BISTRO_BOTTLE',
  'MDC WINE.mp4': 'MDC_WINE',
  'MDC FINAL.mp4': 'MDC_FINAL',
  'MCD SUSHI.mp4': 'MCD_SUSHI',
  'JETSKI OUT.mp4': 'JETSKI_OUT',
  'GANG OF GIRLS.mp4': 'GANG_OF_GIRLS',
  'math pod 9.mp4': 'math_pod_9',
  'JOELLE RAAD.mp4': 'JOELLE_RAAD',
  'STOREY FINAL OUT.mp4': 'STOREY_FINAL_OUT',
  'TILAL NEW YT.mp4': 'TILAL_NEW_YT',
  'TOPSPIN ALEXA.mp4': 'TOPSPIN_ALEXA',
  'TOPSPIN EVENT.mp4': 'TOPSPIN_EVENT',
  'FOOD 2.mp4': 'FOOD_2',
  'MDC NEW.mp4': 'MDC_NEW',
  'MIST 2.mp4': 'MIST_2'
};

// Calculate current total storage in R2 bucket
async function getCurrentR2Storage() {
  let totalBytes = 0;
  let isTruncated = true;
  let token = undefined;
  while (isTruncated) {
    const res = await s3Client.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      ContinuationToken: token
    }));
    if (res.Contents) {
      for (const obj of res.Contents) {
        totalBytes += obj.Size;
      }
    }
    isTruncated = res.IsTruncated;
    token = res.NextContinuationToken;
  }
  return totalBytes;
}

// Upload with safety check
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

// Probe video metadata
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

// Optimize video for web if > 75 MB or 4K
function prepareWebVideo(srcPath, tempDest, meta, sizeMB) {
  const is4K = meta.width > 1920 || meta.height > 1920;
  const isLarge = sizeMB > 75;

  if (!is4K && !isLarge) {
    return { uploadPath: srcPath, isTemp: false };
  }

  console.log(`    [FFmpeg] Web optimizing (${sizeMB.toFixed(1)} MB, ${meta.width}x${meta.height})...`);
  const scale = "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))'";
  const cmd = `ffmpeg -y -i "${srcPath}" -vf "${scale}" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -movflags +faststart "${tempDest}"`;
  execSync(cmd, { stdio: 'ignore' });
  const newSizeMB = fs.statSync(tempDest).size / (1024 * 1024);
  console.log(`    [FFmpeg] Reduced to: ${newSizeMB.toFixed(1)} MB (${((1 - newSizeMB / sizeMB) * 100).toFixed(0)}% saved)`);
  return { uploadPath: tempDest, isTemp: true };
}

// Extract poster
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

// Extract 480p preview clip
function extractPreview(videoPath, tempPreview) {
  try {
    const cmd = `ffmpeg -y -i "${videoPath}" -t 15 -vf "scale='min(480,iw)':-2" -c:v libx264 -crf 28 -preset fast -an -movflags +faststart "${tempPreview}"`;
    execSync(cmd, { stdio: 'ignore' });
    return fs.existsSync(tempPreview);
  } catch (e) {
    return false;
  }
}

// Find all video files recursively
function scanVideos(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      res = res.concat(scanVideos(full));
    } else if (item.name.endsWith('.mp4') || item.name.endsWith('.mov')) {
      res.push({ fullPath: full, fileName: item.name, size: fs.statSync(full).size });
    }
  }
  return res;
}

async function run() {
  console.log('======================================================');
  console.log('Cloudflare R2 Video Synchronization (Strict 9.8GB Limit)');
  console.log('======================================================');

  console.log('Checking current R2 bucket usage...');
  currentTotalR2Bytes = await getCurrentR2Storage();
  console.log(`Current R2 storage: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(2)} MB (${(currentTotalR2Bytes / (1024 * 1024 * 1024)).toFixed(3)} GB)`);
  const remainingMB = (MAX_TOTAL_BYTES - currentTotalR2Bytes) / (1024 * 1024);
  console.log(`Remaining capacity under 9.8 GB cap: ${remainingMB.toFixed(1)} MB (${(remainingMB / 1024).toFixed(2)} GB)\n`);

  let manifest = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try { manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')); } catch (_) {}
  }

  const videos = scanVideos(VIDEOS_DIR);
  console.log(`Found ${videos.length} videos in ${VIDEOS_DIR}\n`);

  let successCount = 0;

  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const category = CATEGORY_MAP[v.fileName] || 'general';
    const cleanBase = CLEAN_NAMES[v.fileName] || path.basename(v.fileName, path.extname(v.fileName)).trim().replace(/\s+/g, '_');
    const manifestKey = `${category}_${cleanBase}`;
    const sizeMB = v.size / (1024 * 1024);

    if (manifest[manifestKey] && manifest[manifestKey].secureUrl && !process.env.FORCE_REUPLOAD) {
      console.log(`[${i + 1}/${videos.length}] Skipping already synced ${manifestKey}...`);
      successCount++;
      continue;
    }

    console.log(`[${i + 1}/${videos.length}] Processing ${manifestKey} (${v.fileName}, ${sizeMB.toFixed(1)} MB)...`);

    const meta = probeVideo(v.fullPath);
    const r2VideoKey = `${category}/${cleanBase}.mp4`;
    const r2PosterKey = `${category}/${cleanBase}_poster.jpg`;
    const r2PreviewKey = `${category}/${cleanBase}_preview.mp4`;

    const tempOptVideo = path.join(TEMP_DIR, `opt_${cleanBase}.mp4`);
    const tempPoster = path.join(TEMP_DIR, `poster_${cleanBase}.jpg`);
    const tempPreview = path.join(TEMP_DIR, `preview_${cleanBase}.mp4`);

    try {
      // 1. Prepare video (compress if needed)
      const { uploadPath, isTemp } = prepareWebVideo(v.fullPath, tempOptVideo, meta, sizeMB);

      // 2. Upload master video
      console.log(`    -> Uploading video: ${r2VideoKey}`);
      const secureUrl = await uploadToR2Safe(uploadPath, r2VideoKey, 'video/mp4');
      if (isTemp && fs.existsSync(uploadPath)) {
        try { fs.unlinkSync(uploadPath); } catch (_) {}
      }

      // 3. Extract and upload poster
      let posterUrl = secureUrl;
      if (extractPoster(v.fullPath, tempPoster)) {
        console.log(`    -> Uploading poster: ${r2PosterKey}`);
        posterUrl = await uploadToR2Safe(tempPoster, r2PosterKey, 'image/jpeg');
        try { fs.unlinkSync(tempPoster); } catch (_) {}
      }

      // 4. Extract and upload 480p preview
      let previewUrl = secureUrl;
      if (extractPreview(v.fullPath, tempPreview)) {
        console.log(`    -> Uploading preview: ${r2PreviewKey}`);
        previewUrl = await uploadToR2Safe(tempPreview, r2PreviewKey, 'video/mp4');
        try { fs.unlinkSync(tempPreview); } catch (_) {}
      }

      // 5. Update manifest entry
      manifest[manifestKey] = {
        category,
        originalFile: v.fileName,
        resourceType: 'video',
        secureUrl,
        posterUrl,
        previewUrl,
        publicId: `${category}/${cleanBase}`,
        width: meta.width > meta.height ? Math.min(1920, meta.width) : Math.min(1080, meta.width),
        height: meta.width > meta.height ? Math.min(1080, meta.height) : Math.min(1920, meta.height),
        duration: meta.duration
      };

      if (manifestKey === 'fb_DROPSHOT' && manifest['sports_DROPSHOT']) {
        delete manifest['sports_DROPSHOT'];
      }

      fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
      console.log(`  ✓ Completed ${manifestKey} (R2 total now: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(1)} MB)\n`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed ${v.fileName}:`, err.message);
      // Clean up temp files if failed
      if (fs.existsSync(tempOptVideo)) try { fs.unlinkSync(tempOptVideo); } catch (_) {}
      if (fs.existsSync(tempPoster)) try { fs.unlinkSync(tempPoster); } catch (_) {}
      if (fs.existsSync(tempPreview)) try { fs.unlinkSync(tempPreview); } catch (_) {}

      if (err.message.includes('SAFETY LIMIT REACHED')) {
        console.warn('Stopping uploads due to 9.8 GB safety limit.');
        break;
      }
    }
  }

  console.log('======================================================');
  console.log(`Sync Complete! Successfully processed: ${successCount}/${videos.length}`);
  console.log(`Final R2 Total Storage: ${(currentTotalR2Bytes / (1024 * 1024)).toFixed(2)} MB (${(currentTotalR2Bytes / (1024 * 1024 * 1024)).toFixed(3)} GB)`);
  console.log(`Remaining under 9.8 GB: ${((MAX_TOTAL_BYTES - currentTotalR2Bytes) / (1024 * 1024 * 1024)).toFixed(2)} GB`);
  console.log(`Manifest updated at: ${MANIFEST_FILE}`);
  console.log('======================================================');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
