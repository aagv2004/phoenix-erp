-- Habilitar extensión para UUIDs (Vital para evitar colisiones)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EMPRESAS (Tenants)
-- La entidad raíz. Todo pertenece a una company.
CREATE TABLE companies (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name varchar(255) NOT NULL,
    tax_id varchar(50), -- RUT o ID Fiscal
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- 2. USUARIOS (Simplificado)
-- Eliminamos la complejidad de invitaciones por ahora.
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    email varchar(255) NOT NULL UNIQUE,
    password_hash varchar(255) NOT NULL,
    full_name varchar(255) NOT NULL,
    role varchar(50) DEFAULT 'staff' CHECK (role IN ('super_admin', 'admin', 'manager', 'staff')),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- 3. SUCURSALES (Physical Locations)
CREATE TABLE branches (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name varchar(255) NOT NULL,
    branch_code varchar(20), -- Ej: "SCL-01"
    address varchar(255),
    is_main boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTOS (Catálogo Global)
CREATE TABLE products (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    sku varchar(100) NOT NULL, -- Stock Keeping Unit
    name varchar(255) NOT NULL,
    description text,
    min_stock_alert integer DEFAULT 5, -- Alerta simple de stock bajo
    is_service boolean DEFAULT false, -- Para cosas que se venden pero no tienen stock (ej: instalación)
    is_active boolean DEFAULT true,
    metadata jsonb, -- Para atributos flexibles (color, talla, peso)
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT products_sku_company_unique UNIQUE (company_id, sku)
);

-- 5. NIVELES DE STOCK (La foto actual)
-- Cuánto hay de X producto en Y sucursal AHORA.
CREATE TABLE stock_levels (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity numeric(15, 2) DEFAULT 0 NOT NULL,
    last_updated timestamptz DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT stock_branch_product_unique UNIQUE (branch_id, product_id)
);

-- 6. MOVIMIENTOS DE INVENTARIO (El historial contable)
-- Cada vez que el stock cambia, SE DEBE escribir aquí.
CREATE TABLE inventory_movements (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL, -- Quién hizo el movimiento
    
    type varchar(50) NOT NULL CHECK (type IN ('INBOUND', 'OUTBOUND', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'SALE', 'RETURN')),
    quantity numeric(15, 2) NOT NULL, -- Positivo o negativo según lógica de negocio, o siempre positivo y el tipo define
    
    -- DATOS FINANCIEROS (Lo que faltaba)
    unit_cost numeric(15, 2) DEFAULT 0, -- Costo al momento del movimiento
    total_cost numeric(15, 2) DEFAULT 0, -- quantity * unit_cost
    
    reason text, -- "Venta #123", "Merma por rotura", "Recepción OC #55"
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES (Para que vuele cuando tengas 1 millón de datos)
CREATE INDEX idx_stock_product ON stock_levels(product_id);
CREATE INDEX idx_stock_branch ON stock_levels(branch_id);
CREATE INDEX idx_movements_date ON inventory_movements(created_at);
CREATE INDEX idx_products_sku ON products(sku);