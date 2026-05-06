import prisma from '../config/prisma.js'
import { hashPassword, comparePassword } from '../utils/hashPassword.js'
import { createCustomerToken, createAdminToken } from '../services/auth.service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// ── Customer Register ──────────────────────────────────────
export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, companyOrigin, password } = req.body
    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing) return errorResponse(res, 'Email already registered.', 409)

    const passwordHash = await hashPassword(password)
    const customer = await prisma.customer.create({
      data: { name, email, phone, companyOrigin, passwordHash },
      select: { id: true, name: true, email: true, phone: true, companyOrigin: true, createdAt: true },
    })

    const token = createCustomerToken(customer)
    return successResponse(res, { customer, token }, 'Registration successful.', 201)
  } catch (err) { next(err) }
}

// ── Customer Login ─────────────────────────────────────────
export const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const customer = await prisma.customer.findUnique({ where: { email } })
    if (!customer) return errorResponse(res, 'Invalid email or password.', 401)

    const valid = await comparePassword(password, customer.passwordHash)
    if (!valid) return errorResponse(res, 'Invalid email or password.', 401)

    const token = createCustomerToken(customer)
    const { passwordHash, ...safeCustomer } = customer
    return successResponse(res, { customer: safeCustomer, token }, 'Login successful.')
  } catch (err) { next(err) }
}

// ── Admin Login ────────────────────────────────────────────
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) return errorResponse(res, 'Invalid email or password.', 401)

    const valid = await comparePassword(password, admin.passwordHash)
    if (!valid) return errorResponse(res, 'Invalid email or password.', 401)

    const token = createAdminToken(admin)
    const { passwordHash, ...safeAdmin } = admin
    return successResponse(res, { admin: safeAdmin, token }, 'Login successful.')
  } catch (err) { next(err) }
}
