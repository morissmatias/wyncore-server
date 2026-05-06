import { Router } from 'express'
import { placeProductOrder, requestService, getMyOrders, cancelOrder, getAllOrders, getOrderById } from '../controllers/order.controller.js'
import { authenticateCustomer, authenticateAdmin } from '../middleware/auth.js'
import { roleGuard } from '../middleware/roleGuard.js'

const router = Router()

// Customer
router.post('/product', authenticateCustomer, placeProductOrder)
router.post('/service', authenticateCustomer, requestService)
router.get('/my', authenticateCustomer, getMyOrders)
router.patch('/:id/cancel', authenticateCustomer, cancelOrder)

// Admin
router.get('/', authenticateAdmin, roleGuard('CEO_CFO', 'CUSTOMER_SERVICE'), getAllOrders)
router.get('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'CUSTOMER_SERVICE'), getOrderById)

export default router
