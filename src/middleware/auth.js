import jwt from 'jsonwebtoken'
import { errorResponse } from '../utils/apiResponse.js'

export const authenticateCustomer = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return errorResponse(res, 'Unauthorized. No token provided.', 401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.type !== 'customer') return errorResponse(res, 'Forbidden.', 403)
    req.customer = decoded
    next()
  } catch {
    return errorResponse(res, 'Invalid or expired token.', 401)
  }
}

export const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return errorResponse(res, 'Unauthorized. No token provided.', 401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.type !== 'admin') return errorResponse(res, 'Forbidden.', 403)
    req.admin = decoded
    next()
  } catch {
    return errorResponse(res, 'Invalid or expired token.', 401)
  }
}
