import prisma from '../config/prisma.js'
import { logActivity } from '../services/activityLog.service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import { sendOrderStatusEmail } from '../services/email.service.js'

// ── Get all invoices (admin) ───────────────────────────────
export const getAllInvoices = async (req, res, next) => {
  try {
    const { status } = req.query
    const invoices = await prisma.invoice.findMany({
      where: { ...(status && { status }) },
      include: {
        order: {
          include: {
            customer: { select: { id: true, name: true, email: true, companyOrigin: true } },
          },
        },
        reviewedBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return successResponse(res, invoices)
  } catch (err) { next(err) }
}

// ── Get invoice by ID ──────────────────────────────────────
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        order: {
          include: {
            customer: true,
            orderItems: { include: { product: true } },
            serviceRequest: { include: { service: true } },
          },
        },
        reviewedBy: { select: { id: true, name: true, role: true } },
      },
    })
    if (!invoice) return errorResponse(res, 'Invoice not found.', 404)
    return successResponse(res, invoice)
  } catch (err) { next(err) }
}

// ── Review invoice: approve or reject ─────────────────────
export const reviewInvoice = async (req, res, next) => {
  try {
    const { status, remarks, quotedPrice } = req.body
    // status must be APPROVED or REJECTED

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return errorResponse(res, 'Status must be APPROVED or REJECTED.', 400)
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { order: { include: { serviceRequest: true } } },
    })
    if (!invoice) return errorResponse(res, 'Invoice not found.', 404)
    if (invoice.status !== 'PENDING') {
      return errorResponse(res, 'This invoice has already been reviewed.', 400)
    }

    // Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        status,
        remarks,
        reviewedAt: new Date(),
        reviewedById: req.admin.id,
      },
    })

    // Update order status to match
    const orderStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED'
    await prisma.order.update({
      where: { id: invoice.orderId },
      data: { status: orderStatus },
    })

    // If service order and quotedPrice provided, update service request
    if (invoice.order.serviceRequest && quotedPrice) {
      await prisma.serviceRequest.update({
        where: { orderId: invoice.orderId },
        data: { quotedPrice },
      })
    }

    await logActivity(req.admin.id, `INVOICE_${status}`, invoice.id, remarks || null)

    // Send status email to customer
    try {
      const fullOrder = await prisma.order.findUnique({
        where: { id: invoice.orderId },
        include: { customer: true },
      })
      await sendOrderStatusEmail(fullOrder.customer, fullOrder, updatedInvoice, status, remarks)
    } catch (e) { console.error('Email error:', e.message) }

    return successResponse(res, updatedInvoice, `Invoice ${status.toLowerCase()} successfully.`)
  } catch (err) { next(err) }
}
