/**
 * Chuẩn hóa response format theo Coding Convention POWORK
 *
 * Success: { status: "success", data: { ... } }
 * Error:   { status: "error", error_code: "AUTH_001", message: "..." }
 *          (error format được xử lý bởi error.middleware.js)
 */
export const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const body = { status: 'success', data }
  if (message) body.message = message
  return res.status(statusCode).json(body)
}

export const sendCreated = (res, data, message = null) => {
  return sendSuccess(res, data, message, 201)
}
