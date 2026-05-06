import prisma from '../config/prisma.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// ── Get my profile (customer) ──────────────────────────────
export const getMyProfile = async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.customer.id },
      select: { id: true, name: true, email: true, phone: true, companyOrigin: true, createdAt: true },
    })
    return successResponse(res, customer)
  } catch (err) { next(err) }
}

// ── Update my profile ──────────────────────────────────────
export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone, companyOrigin } = req.body
    const customer = await prisma.customer.update({
      where: { id: req.customer.id },
      data: { name, phone, companyOrigin },
      select: { id: true, name: true, email: true, phone: true, companyOrigin: true },
    })
    return successResponse(res, customer, 'Profile updated.')
  } catch (err) { next(err) }
}

// ── Get all customers (admin: CS and CEO/CFO) ──────────────
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true, name: true, email: true, phone: true,
        companyOrigin: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return successResponse(res, customers)
  } catch (err) { next(err) }
}

// ── Get customer by ID (admin) ─────────────────────────────
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, email: true, phone: true, companyOrigin: true, createdAt: true,
        orders: {
          include: { invoice: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    if (!customer) return errorResponse(res, 'Customer not found.', 404)
    return successResponse(res, customer)
  } catch (err) { next(err) }
}
