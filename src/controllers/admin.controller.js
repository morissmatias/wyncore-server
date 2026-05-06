import prisma from '../config/prisma.js'
import { hashPassword } from '../utils/hashPassword.js'
import { logActivity } from '../services/activityLog.service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// ── Get all admins (CEO/CFO only) ──────────────────────────
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, createdById: true },
      orderBy: { createdAt: 'desc' },
    })
    return successResponse(res, admins)
  } catch (err) { next(err) }
}

// ── Create admin (CEO/CFO only) ────────────────────────────
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) return errorResponse(res, 'Email already in use.', 409)

    const passwordHash = await hashPassword(password)
    const admin = await prisma.admin.create({
      data: { name, email, passwordHash, role, createdById: req.admin.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    await logActivity(req.admin.id, 'CREATED_ADMIN', admin.id, `Created ${role} admin: ${email}`)
    return successResponse(res, admin, 'Admin account created.', 201)
  } catch (err) { next(err) }
}

// ── Delete admin (CEO/CFO only) ────────────────────────────
export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params
    if (id === req.admin.id) return errorResponse(res, 'You cannot delete your own account.', 400)

    const admin = await prisma.admin.findUnique({ where: { id } })
    if (!admin) return errorResponse(res, 'Admin not found.', 404)

    await prisma.admin.delete({ where: { id } })
    await logActivity(req.admin.id, 'DELETED_ADMIN', id, `Deleted admin: ${admin.email}`)
    return successResponse(res, null, 'Admin account deleted.')
  } catch (err) { next(err) }
}

// ── Get activity logs (CEO/CFO only) ──────────────────────
export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: { admin: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return successResponse(res, logs)
  } catch (err) { next(err) }
}

// ── Dashboard stats (CEO/CFO only) ────────────────────────
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalCustomers, totalOrders, pendingOrders, totalProducts, totalServices] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count(),
      prisma.service.count(),
    ])
    return successResponse(res, { totalCustomers, totalOrders, pendingOrders, totalProducts, totalServices })
  } catch (err) { next(err) }
}
