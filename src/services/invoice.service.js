import prisma from '../config/prisma.js'
import { generateInvoiceNumber } from '../utils/generateInvoiceNumber.js'

export const createInvoiceForOrder = async (orderId, totalAmount) => {
  const invoiceNumber = await generateInvoiceNumber()
  return prisma.invoice.create({
    data: {
      invoiceNumber,
      totalAmount,
      status: 'PENDING',
      orderId,
    },
  })
}
