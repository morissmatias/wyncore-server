import { Router } from 'express'
import { getAllInvoices, getInvoiceById, reviewInvoice } from '../controllers/invoice.controller.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { roleGuard } from '../middleware/roleGuard.js'

const router = Router()

router.get('/', authenticateAdmin, roleGuard('CEO_CFO', 'CUSTOMER_SERVICE'), getAllInvoices)
router.get('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'CUSTOMER_SERVICE'), getInvoiceById)
router.patch('/:id/review', authenticateAdmin, roleGuard('CEO_CFO', 'CUSTOMER_SERVICE'), reviewInvoice)

export default router
