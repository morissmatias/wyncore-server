import { Router } from 'express'
import { getAllProducts, getAllProductsAdmin, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import { authenticateAdmin } from '../middleware/auth.js'
import { roleGuard } from '../middleware/roleGuard.js'

const router = Router()

// Public
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Purchasing + CEO/CFO
router.get('/admin/all', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), getAllProductsAdmin)
router.post('/', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), createProduct)
router.patch('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), updateProduct)
router.delete('/:id', authenticateAdmin, roleGuard('CEO_CFO', 'PURCHASING'), deleteProduct)

export default router
