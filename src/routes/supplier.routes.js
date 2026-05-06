import { Router } from 'express'
import { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplier.controller.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { roleGuard } from '../middleware/roleGuard.js'

const router = Router()

router.get('/', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), getAllSuppliers)
router.get('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), getSupplierById)
router.post('/', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), createSupplier)
router.patch('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), updateSupplier)
router.delete('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), deleteSupplier)

export default router
