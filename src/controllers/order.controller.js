import prisma from '../config/prisma.js'
import { createInvoiceForOrder } from '../services/invoice.service.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import { sendOrderConfirmationEmail } from '../services/email.service.js'

// ── Place a product order (cart checkout) ──────────────────
export const placeProductOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, notes, items } = req.body
    // items: [{ productId, quantity }]

    // Fetch products and compute totals
    let totalAmount = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product || !product.isAvailable) {
        return errorResponse(res, `Product ${item.productId} is unavailable.`, 400)
      }
      const unitPrice = parseFloat(product.price.toString())
      const subtotal = unitPrice * item.quantity
      totalAmount += subtotal
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotal,
      })
    }

    const order = await prisma.order.create({
      data: {
        orderType: 'PRODUCT',
        deliveryAddress,
        notes,
        customerId: req.customer.id,
        orderItems: { create: orderItemsData },
      },
      include: { orderItems: { include: { product: true } } },
    })

    const invoice = await createInvoiceForOrder(order.id, totalAmount)

    // Send confirmation email
    try {
      const customer = await prisma.customer.findUnique({ where: { id: req.customer.id } })
      await sendOrderConfirmationEmail(customer, order, invoice)
    } catch (e) { console.error('Email error:', e.message) }

    return successResponse(res, { order, invoice }, 'Order placed successfully. Invoice generated.', 201)

  } catch (err) { next(err) }
}

// ── Request a service ──────────────────────────────────────
export const requestService = async (req, res, next) => {
  try {
    const { deliveryAddress, notes, serviceId, details, preferredDate } = req.body

    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service || !service.isAvailable) return errorResponse(res, 'Service is unavailable.', 400)

    const order = await prisma.order.create({
      data: {
        orderType: 'SERVICE',
        deliveryAddress,
        notes,
        customerId: req.customer.id,
        serviceRequest: {
          create: {
            serviceId,
            details,
            preferredDate: preferredDate ? new Date(preferredDate) : null,
          },
        },
      },
      include: { serviceRequest: { include: { service: true } } },
    })

    const invoice = await createInvoiceForOrder(order.id, service.basePrice || 0)

    // Send confirmation email
    try {
      const customer = await prisma.customer.findUnique({ where: { id: req.customer.id } })
      await sendOrderConfirmationEmail(customer, order, invoice)
    } catch (e) { console.error('Email error:', e.message) }

    return successResponse(res, { order, invoice }, 'Service request submitted. Invoice generated.', 201)
  } catch (err) { next(err) }
}

// ── Get my orders (customer) ───────────────────────────────
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.customer.id },
      include: {
        orderItems: { include: { product: true } },
        serviceRequest: { include: { service: true } },
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return successResponse(res, orders)
  } catch (err) { next(err) }
}

// ── Cancel order (customer, only if PENDING) ───────────────
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!order) return errorResponse(res, 'Order not found.', 404)
    if (order.customerId !== req.customer.id) return errorResponse(res, 'Forbidden.', 403)
    if (order.status !== 'PENDING') return errorResponse(res, 'Only pending orders can be cancelled.', 400)

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    })
    return successResponse(res, updated, 'Order cancelled.')
  } catch (err) { next(err) }
}

// ── Get all orders (admin: CS and CEO/CFO) ─────────────────
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, type } = req.query
    const orders = await prisma.order.findMany({
      where: {
        ...(status && { status }),
        ...(type && { orderType: type }),
      },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true, companyOrigin: true } },
        orderItems: { include: { product: true } },
        serviceRequest: { include: { service: true } },
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return successResponse(res, orders)
  } catch (err) { next(err) }
}

// ── Get single order (admin) ───────────────────────────────
export const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
        serviceRequest: { include: { service: true } },
        invoice: true,
      },
    })
    if (!order) return errorResponse(res, 'Order not found.', 404)
    return successResponse(res, order)
  } catch (err) { next(err) }
}
