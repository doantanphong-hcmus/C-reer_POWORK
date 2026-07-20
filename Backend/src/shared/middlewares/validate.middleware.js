/**
 * Validate req.body
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    req.body = schema.parse(req.body)

    next()
  }
}

/**
 * Validate req.query
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    req.query = schema.parse(req.query)

    next()
  }
}
