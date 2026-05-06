# WynCore Server
Backend API for Wyn Power Corporation's Online Service Request and Ordering Management System.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL via Supabase
- **Auth**: JWT (jsonwebtoken)
- **Deployment**: Railway

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your DATABASE_URL from Supabase and set JWT_SECRET
```

### 3. Generate Prisma client
```bash
npm run db:generate
```

### 4. Run migrations
```bash
npm run db:migrate
```

### 5. Seed the database
```bash
npm run db:seed
```

### 6. Start development server
```bash
npm run dev
```

## Default Accounts (after seeding)
| Role        | Email                      | Password       |
|-------------|----------------------------|----------------|
| CEO/CFO     | ceo@wynpower.com           | Admin@1234     |
| CS Admin    | cs@wynpower.com            | Admin@1234     |
| Purchasing  | purchasing@wynpower.com    | Admin@1234     |
| Customer    | demo@client.com            | Customer@1234  |

## API Endpoints

### Auth
| Method | Endpoint                    | Access   |
|--------|-----------------------------|----------|
| POST   | /api/auth/customer/register | Public   |
| POST   | /api/auth/customer/login    | Public   |
| POST   | /api/auth/admin/login       | Public   |

### Orders
| Method | Endpoint                    | Access              |
|--------|-----------------------------|---------------------|
| POST   | /api/orders/product         | Customer            |
| POST   | /api/orders/service         | Customer            |
| GET    | /api/orders/my              | Customer            |
| PATCH  | /api/orders/:id/cancel      | Customer            |
| GET    | /api/orders                 | CEO/CFO, CS Admin   |
| GET    | /api/orders/:id             | CEO/CFO, CS Admin   |

### Invoices
| Method | Endpoint                    | Access              |
|--------|-----------------------------|---------------------|
| GET    | /api/invoices               | CEO/CFO, CS Admin   |
| GET    | /api/invoices/:id           | CEO/CFO, CS Admin   |
| PATCH  | /api/invoices/:id/review    | CEO/CFO, CS Admin   |

### Products
| Method | Endpoint                    | Access              |
|--------|-----------------------------|---------------------|
| GET    | /api/products               | Public              |
| GET    | /api/products/admin/all     | CEO/CFO, Purchasing |
| POST   | /api/products               | CEO/CFO, Purchasing |
| PATCH  | /api/products/:id           | CEO/CFO, Purchasing |
| DELETE | /api/products/:id           | CEO/CFO, Purchasing |

### Admins (CEO/CFO only)
| Method | Endpoint                    | Access   |
|--------|-----------------------------|----------|
| GET    | /api/admins                 | CEO/CFO  |
| POST   | /api/admins                 | CEO/CFO  |
| DELETE | /api/admins/:id             | CEO/CFO  |
| GET    | /api/admins/dashboard       | CEO/CFO  |
| GET    | /api/admins/logs            | CEO/CFO  |
