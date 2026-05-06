import { Router } from 'express'
import { registerCustomer, loginCustomer, loginAdmin } from '../controllers/auth.controller.js'

const router = Router()

router.post('/customer/register', registerCustomer)
router.post('/customer/login', loginCustomer)
router.post('/admin/login', loginAdmin)

export default router
