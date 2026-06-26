import 'dotenv/config'
import app from './app.js'
import { config } from './shared/config/index.js'
import prisma from './shared/config/prisma.js'
import { ensureBucketExists } from './shared/config/minio.js'

const start = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')
  } catch (err) {
    console.warn('⚠️  Database not available - running in MOCK mode:', err.message)
  }

  try {
    await ensureBucketExists()
  } catch (err) {
    console.warn('⚠️  MinIO not available — presigned-url endpoint sẽ lỗi:', err.message)
  }

  app.listen(config.port, () => {
    console.log(`POWORK Backend running on http://localhost:${config.port}`)
    console.log(`Environment: ${config.nodeEnv}`)
    console.log(`Health check: http://localhost:${config.port}/health`)
  })
}

start()
