import prisma from '../config/prisma.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const getAllProducts = async (req, res, next) => {
  try {
    const { category } = req.query
    const products = await prisma.product.findMany({
      where: { ...(category && { category }), isAvailable: true },
      include: { supplier: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    })
    return successResponse(res, products)
  } catch (err) { next(err) }
}

export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { supplier: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return successResponse(res, products)
  } catch (err) { next(err) }
}

export const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { supplier: true },
    })
    if (!product) return errorResponse(res, 'Product not found.', 404)
    return successResponse(res, product)
  } catch (err) { next(err) }
}

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, unit, stock, imageUrl, supplierId } = req.body
    const product = await prisma.product.create({
      data: { name, description, category, price, unit, stock, imageUrl, supplierId },
    })
    return successResponse(res, product, 'Product created.', 201)
  } catch (err) { next(err) }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    })
    return successResponse(res, product, 'Product updated.')
  } catch (err) { next(err) }
}

export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    return successResponse(res, null, 'Product deleted.')
  } catch (err) { next(err) }
}
