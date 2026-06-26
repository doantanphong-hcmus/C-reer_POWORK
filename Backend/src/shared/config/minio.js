/**
 * MinIO Client — Object Storage cho file bài nộp
 * Dùng chung cho toàn app — đặt ở shared/ vì không thuộc 1 domain cụ thể
 */
import { Client } from 'minio'
import { config } from './index.js'

const minioClient = new Client({
  endPoint: config.minio.endpoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
})

// Đảm bảo bucket tồn tại — gọi 1 lần khi server start
export const ensureBucketExists = async () => {
  const exists = await minioClient.bucketExists(config.minio.bucket).catch(() => false)
  if (!exists) {
    await minioClient.makeBucket(config.minio.bucket)
    console.log(`✅ Đã tạo MinIO bucket: ${config.minio.bucket}`)
  }
}

export default minioClient
