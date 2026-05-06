import { Router } from 'express'
import { getAllAdmins, createAdmin, deleteAdmin, getActivityLogs, getDashboardStats } from '../controllers/admin.controller.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { roleGuard } from '../middleware/roleGuard.js'

const router = Router()

router.get('/dashboard', authenticateAdmin, roleGuard('CEO_CFO'), getDashboardStats)
router.get('/logs', authenticateAdmin, roleGuard('CEO_CFO'), getActivityLogs)
router.get('/', authenticateAdmin, roleGuard('CEO_CFO'), getAllAdmins)
router.post('/', authenticateAdmin, roleGuard('CEO_CFO'), createAdmin)
router.delete('/:id', authenticateAdmin, roleGuard('CEO_CFO'), deleteAdmin)

export default router
