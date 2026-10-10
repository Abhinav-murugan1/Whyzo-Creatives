const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Missing credentials in .env');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

async function wipeBucket() {
  console.log(`Starting wipe of bucket: ${R2_BUCKET_NAME}...`);
  let totalDeleted = 0;
  let token;

  do {
    const listRes = await s3.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        ContinuationToken: token
      })
    );

    if (listRes.Contents && listRes.Contents.length > 0) {
      const keysToDelete = listRes.Contents.map(obj => ({ Key: obj.Key }));
      console.log(`Deleting batch of ${keysToDelete.length} objects...`);
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: R2_BUCKET_NAME,
          Delete: {
            Objects: keysToDelete,
            Quiet: true
          }
        })
      );
      totalDeleted += keysToDelete.length;
    }

    token = listRes.NextContinuationToken;
  } while (token);

  console.log(`Successfully wiped bucket! Total objects deleted: ${totalDeleted}`);
}

wipeBucket().catch(err => {
  console.error('Error wiping bucket:', err);
  process.exit(1);
});
