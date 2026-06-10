/**
 * Chuẩn hóa response format theo API Contracts
 *
 * Format chuẩn:
 *   { status: "success", data: { ... } }
 *   { status: "success", message: "...", data: { ... } }   ← khi có message
 *   { status: "error", message: "..." }                    ← lỗi (error.middleware xử lý)
 */

export const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const body = { status: 'success', data }
  if (message) body.message = message
  return res.status(statusCode).json(body)
}

export const sendCreated = (res, data, message = null) => {
  return sendSuccess(res, data, message, 201)
}
