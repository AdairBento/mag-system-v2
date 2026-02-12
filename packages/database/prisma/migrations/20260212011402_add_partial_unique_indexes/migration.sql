-- USERS: email único (case-insensitive) apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS users_email_active_ci_ux
ON users (lower(email))
WHERE deleted_at IS NULL;

-- CLIENTS: documento único apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS clients_document_active_ux
ON clients (document)
WHERE deleted_at IS NULL;

-- DRIVERS: documento único apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS drivers_document_active_ux
ON drivers (document)
WHERE deleted_at IS NULL;

-- DRIVERS: CNH única apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS drivers_license_number_active_ux
ON drivers (license_number)
WHERE deleted_at IS NULL;

-- VEHICLES: placa única apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS vehicles_plate_active_ux
ON vehicles (plate)
WHERE deleted_at IS NULL;

-- VEHICLES: renavam único apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS vehicles_registration_number_active_ux
ON vehicles (registration_number)
WHERE deleted_at IS NULL;

-- VEHICLES: chassi único apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS vehicles_chassis_active_ux
ON vehicles (chassis)
WHERE deleted_at IS NULL;

-- INVOICES: número da nota único apenas quando ativo
CREATE UNIQUE INDEX IF NOT EXISTS invoices_invoice_number_active_ux
ON invoices (invoice_number)
WHERE deleted_at IS NULL;

-- CONTRACTS: 1 contrato ativo por locação
CREATE UNIQUE INDEX IF NOT EXISTS contracts_rental_id_active_ux
ON contracts (rental_id)
WHERE deleted_at IS NULL;
-- This is an empty migration.