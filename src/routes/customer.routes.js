import { Router } from 'express'
import { getMyProfile, updateMyProfile, getAllCustomers, getCustomerById } from '../controllers/customer.controller.js'
import { authenticateCustomer, authenticateAdmin } from '../middleware/auth.js'
import { roleGuard } from '../middleware/roleGuard.js'

const router = Router()

// Customer self-service
router.get('/me', authenticateCustomer, getMyProfile)
router.patch('/me', authenticateCustomer, updateMyProfile)

// Admin access
router.get('/', authenticateAdmin, roleGuard('CEO_CFO', 'CUSTOMER_SERVICE'), getAllCustomers)
router.get('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'CUSTOMER_SERVICE'), getCustomerById)

export default router
