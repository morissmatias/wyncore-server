import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import customerRoutes from './routes/customer.routes.js'
import adminRoutes from './routes/admin.routes.js'
import productRoutes from './routes/product.routes.js'
import serviceRoutes from './routes/service.routes.js'
import orderRoutes from './routes/order.routes.js'
import invoiceRoutes from './routes/invoice.routes.js'
import supplierRoutes from './routes/supplier.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

// ── Global Middleware ──────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/products', productRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/suppliers', supplierRoutes)

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'WynCore API is running.' })
})

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' })
})

// ── Error Handler ──────────────────────────────────────────
app.use(errorHandler)

export default app
