import prisma from '../config/prisma.js'

export const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear()
  const count = await prisma.invoice.count()
  const sequence = String(count + 1).padStart(4, '0')
  return `INV-${year}-${sequence}`
}
