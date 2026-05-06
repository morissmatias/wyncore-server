import { errorResponse } from '../utils/apiResponse.js'

// Usage: roleGuard('CEO_CFO') or roleGuard('CEO_CFO', 'CUSTOMER_SERVICE')
export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) return errorResponse(res, 'Unauthorized.', 401)
    if (!allowedRoles.includes(req.admin.role)) {
      return errorResponse(res, 'You do not have permission to perform this action.', 403)
    }
    next()
  }
}
