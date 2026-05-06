import jwt from 'jsonwebtoken'

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export const createCustomerToken = (customer) => {
  return signToken({
    id: customer.id,
    email: customer.email,
    type: 'customer',
  })
}

export const createAdminToken = (admin) => {
  return signToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    type: 'admin',
  })
}
