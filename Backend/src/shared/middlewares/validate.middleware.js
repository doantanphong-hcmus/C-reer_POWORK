/**
 * Validate Middleware — dùng chung cho mọi domain
 * Nhận 1 Zod schema, validate req.body, ném lỗi nếu sai (ZodError được error.middleware.js bắt và trả 400 kèm danh sách field lỗi)
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    req.body = schema.parse(req.body) // parse() throw ZodError nếu sai
    next()
  }
}
