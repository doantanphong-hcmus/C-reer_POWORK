import { AppError } from '../utils/AppError.js'

/**
 * Handler lỗi tập trung
 * Format lỗi theo API Contracts: { status: "error", message: "..." }
 */
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  }

  // Prisma: record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ status: 'error', message: 'Resource not found' })
  }

  // Prisma: unique constraint
  if (err.code === 'P2002') {
    return res.status(409).json({ status: 'error', message: 'Resource already exists' })
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    })
  }

  console.error('[UNHANDLED ERROR]', err)
  res.status(500).json({ status: 'error', message: 'Internal server error' })
}

export const notFoundHandler = (req, res) => {
  res.status(404).json({ status: 'error', message: `Route ${req.originalUrl} not found` })
}
