import prisma from '../config/prisma.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const getAllServices = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isAvailable: true },
      orderBy: { name: 'asc' },
    })
    return successResponse(res, services)
  } catch (err) { next(err) }
}

export const getAllServicesAdmin = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } })
    return successResponse(res, services)
  } catch (err) { next(err) }
}

export const getServiceById = async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } })
    if (!service) return errorResponse(res, 'Service not found.', 404)
    return successResponse(res, service)
  } catch (err) { next(err) }
}

export const createService = async (req, res, next) => {
  try {
    const service = await prisma.service.create({ data: req.body })
    return successResponse(res, service, 'Service created.', 201)
  } catch (err) { next(err) }
}

export const updateService = async (req, res, next) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
    })
    return successResponse(res, service, 'Service updated.')
  } catch (err) { next(err) }
}

export const deleteService = async (req, res, next) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } })
    return successResponse(res, null, 'Service deleted.')
  } catch (err) { next(err) }
}
