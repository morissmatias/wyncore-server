import prisma from '../config/prisma.js'

export const logActivity = async (adminId, action, targetId = null, details = null) => {
  return prisma.activityLog.create({
    data: { adminId, action, targetId, details },
  })
}
