import 'dotenv/config'
import app from './app.js'
import { config } from './shared/config/index.js'
import prisma from './shared/config/prisma.js'

const start = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')
  } catch (err) {
    console.warn('⚠️  Database not available - running in MOCK mode:', err.message)
  }

  app.listen(config.port, () => {
    console.log(`POWORK Backend running on http://localhost:${config.port}`)
    console.log(`Environment: ${config.nodeEnv}`)
    console.log(`Health check: http://localhost:${config.port}/health`)
  })
}

start()
