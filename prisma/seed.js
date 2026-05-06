import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const passwordHash = await bcrypt.hash('Admin@1234', 12)

  // ── CEO/CFO Admin ──────────────────────────────────────
  const ceo = await prisma.admin.upsert({
    where: { email: 'ceo@wynpower.com' },
    update: {},
    create: {
      name: 'Rodel B. Arada',
      email: 'ceo@wynpower.com',
      passwordHash,
      role: 'CEO_CFO',
    },
  })

  // ── Department Admins ──────────────────────────────────
  await prisma.admin.upsert({
    where: { email: 'cs@wynpower.com' },
    update: {},
    create: {
      name: 'Customer Service Admin',
      email: 'cs@wynpower.com',
      passwordHash,
      role: 'CUSTOMER_SERVICE',
      createdById: ceo.id,
    },
  })

  await prisma.admin.upsert({
    where: { email: 'purchasing@wynpower.com' },
    update: {},
    create: {
      name: 'Purchasing Admin',
      email: 'purchasing@wynpower.com',
      passwordHash,
      role: 'PURCHASING',
      createdById: ceo.id,
    },
  })

  // ── Supplier ───────────────────────────────────────────
  const supplier = await prisma.supplier.upsert({
    where: { id: 'supplier-001' },
    update: {},
    create: {
      id: 'supplier-001',
      name: 'PhilPower Supply Co.',
      contact: 'Juan Dela Cruz',
      email: 'sales@philpowersupply.ph',
      address: 'Calamba, Laguna, Philippines',
    },
  })

  // ── Products ───────────────────────────────────────────
  const products = [
    {
      id: 'prod-001',
      name: '25 kVA Distribution Transformer',
      description: 'Single-phase distribution transformer for residential and light commercial use.',
      category: 'TRANSFORMER',
      price: 85000,
      unit: 'unit',
      stock: 15,
      supplierId: supplier.id,
    },
    {
      id: 'prod-002',
      name: '100 kVA Distribution Transformer',
      description: 'Three-phase transformer for medium commercial and industrial applications.',
      category: 'TRANSFORMER',
      price: 220000,
      unit: 'unit',
      stock: 8,
      supplierId: supplier.id,
    },
    {
      id: 'prod-003',
      name: 'LED Street Light 150W',
      description: 'High-efficiency LED street light with aluminum die-cast housing.',
      category: 'STREET_LIGHTING',
      price: 12500,
      unit: 'unit',
      stock: 50,
      supplierId: supplier.id,
    },
    {
      id: 'prod-004',
      name: 'Main Distribution Panel 200A',
      description: '200-ampere main distribution panel with circuit breakers for commercial buildings.',
      category: 'CONTROL_PANEL',
      price: 45000,
      unit: 'unit',
      stock: 20,
      supplierId: supplier.id,
    },
  ]

  for (const p of products) {
    await prisma.product.upsert({ where: { id: p.id }, update: {}, create: p })
  }

  // ── Services ───────────────────────────────────────────
  const services = [
    {
      id: 'svc-001',
      name: 'Electrical System Layout & Design',
      description: 'Complete layout and design of electrical systems for commercial and industrial facilities.',
      type: 'LAYOUT_DESIGN',
    },
    {
      id: 'svc-002',
      name: 'Transformer Installation',
      description: 'Professional installation of distribution transformers including civil and electrical works.',
      type: 'INSTALLATION',
      basePrice: 35000,
    },
    {
      id: 'svc-003',
      name: 'Substation Construction',
      description: 'End-to-end construction of electrical substations for utility and industrial clients.',
      type: 'SUBSTATION',
    },
    {
      id: 'svc-004',
      name: 'Solar Rooftop Installation',
      description: 'Complete supply and installation of solar rooftop systems for commercial buildings.',
      type: 'SOLAR_ROOFTOP',
    },
    {
      id: 'svc-005',
      name: 'Utility Scale Solar PV Plant',
      description: 'Design, supply, and construction of utility-scale solar photovoltaic power plants.',
      type: 'SOLAR_PV_UTILITY',
    },
  ]

  for (const s of services) {
    await prisma.service.upsert({ where: { id: s.id }, update: {}, create: s })
  }

  // ── Sample Customer ────────────────────────────────────
  const customerHash = await bcrypt.hash('Customer@1234', 12)
  await prisma.customer.upsert({
    where: { email: 'demo@client.com' },
    update: {},
    create: {
      name: 'Demo Client',
      email: 'demo@client.com',
      phone: '09171234567',
      companyOrigin: 'Demo Corporation',
      passwordHash: customerHash,
    },
  })

  console.log('Seeding complete!')
  console.log('CEO/CFO:    ceo@wynpower.com        / Admin@1234')
  console.log('CS Admin:   cs@wynpower.com          / Admin@1234')
  console.log('Purchasing: purchasing@wynpower.com  / Admin@1234')
  console.log('Customer:   demo@client.com          / Customer@1234')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
