import prisma from '../config/prisma.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    })
    return successResponse(res, suppliers)
  } catch (err) { next(err) }
}

export const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.params.id },
      include: { products: true },
    })
    if (!supplier) return errorResponse(res, 'Supplier not found.', 404)
    return successResponse(res, supplier)
  } catch (err) { next(err) }
}

export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.create({ data: req.body })
    return successResponse(res, supplier, 'Supplier created.', 201)
  } catch (err) { next(err) }
}

export const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: req.params.id },
      data: req.body,
    })
    return successResponse(res, supplier, 'Supplier updated.')
  } catch (err) { next(err) }
}

export const deleteSupplier = async (req, res, next) => {
  try {
    await prisma.supplier.delete({ where: { id: req.params.id } })
    return successResponse(res, null, 'Supplier deleted.')
  } catch (err) { next(err) }
}
