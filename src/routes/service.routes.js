import { Router } from 'express'
import { getAllServices, getAllServicesAdmin, getServiceById, createService, updateService, deleteService } from '../controllers/service.controller.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { roleGuard } from '../middleware/roleGuard.js'

const router = Router()

router.get('/', getAllServices)
router.get('/:id', getServiceById)

router.get('/admin/all', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), getAllServicesAdmin)
router.post('/', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), createService)
router.patch('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), updateService)
router.delete('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), deleteService)

export default router
