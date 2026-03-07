-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'office');
CREATE TYPE driver_status AS ENUM ('active', 'inactive');
CREATE TYPE driver_engagement_type AS ENUM ('licensed_dealer', 'payroll');
CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'inactive');
CREATE TYPE public_right_status AS ENUM ('available', 'assigned_to_company_vehicle', 'rented_to_private', 'frozen');
CREATE TYPE renter_status AS ENUM ('active', 'inactive');
CREATE TYPE charge_type AS ENUM ('vehicle_rental', 'public_right_rental');
CREATE TYPE charge_status AS ENUM ('draft', 'open', 'paid', 'cancelled');

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLES
-- ============================================================

-- app_users
CREATE TABLE app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'office',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- drivers
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  id_number TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  license_expiry DATE,
  status driver_status NOT NULL DEFAULT 'active',
  engagement_type driver_engagement_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT NOT NULL UNIQUE,
  make TEXT,
  model TEXT,
  year INTEGER,
  color TEXT,
  vin TEXT UNIQUE,
  status vehicle_status NOT NULL DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- public_rights
CREATE TABLE public_rights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  right_number TEXT NOT NULL UNIQUE,
  status public_right_status NOT NULL DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER public_rights_updated_at
  BEFORE UPDATE ON public_rights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- public_right_renters
CREATE TABLE public_right_renters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  id_number TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT,
  company_name TEXT,
  status renter_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER public_right_renters_updated_at
  BEFORE UPDATE ON public_right_renters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ASSIGNMENT TABLES
-- ============================================================

-- driver_vehicle_assignments
CREATE TABLE driver_vehicle_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES app_users(id)
);

-- One active assignment per driver
CREATE UNIQUE INDEX idx_unique_active_driver
  ON driver_vehicle_assignments (driver_id)
  WHERE is_active = true;

-- One active driver per vehicle
CREATE UNIQUE INDEX idx_unique_active_vehicle_driver
  ON driver_vehicle_assignments (vehicle_id)
  WHERE is_active = true;

-- public_right_vehicle_assignments
CREATE TABLE public_right_vehicle_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_right_id UUID NOT NULL REFERENCES public_rights(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES app_users(id)
);

-- One active vehicle per public right
CREATE UNIQUE INDEX idx_unique_active_pr_vehicle
  ON public_right_vehicle_assignments (public_right_id)
  WHERE is_active = true;

-- One active public right per vehicle
CREATE UNIQUE INDEX idx_unique_active_vehicle_pr
  ON public_right_vehicle_assignments (vehicle_id)
  WHERE is_active = true;

-- public_right_renter_assignments
CREATE TABLE public_right_renter_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_right_id UUID NOT NULL REFERENCES public_rights(id),
  renter_id UUID NOT NULL REFERENCES public_right_renters(id),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES app_users(id)
);

-- One active renter per public right
CREATE UNIQUE INDEX idx_unique_active_pr_renter
  ON public_right_renter_assignments (public_right_id)
  WHERE is_active = true;

-- ============================================================
-- CHARGES
-- ============================================================

CREATE TABLE charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charge_type charge_type NOT NULL,
  charge_status charge_status NOT NULL DEFAULT 'draft',
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ILS',
  description TEXT,
  period_start DATE,
  period_end DATE,
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  renter_id UUID REFERENCES public_right_renters(id),
  public_right_id UUID REFERENCES public_rights(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES app_users(id)
);

CREATE TRIGGER charges_updated_at
  BEFORE UPDATE ON charges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- vehicle_rental charges must have driver_id and vehicle_id
ALTER TABLE charges ADD CONSTRAINT chk_vehicle_rental_fields
  CHECK (
    charge_type != 'vehicle_rental'
    OR (driver_id IS NOT NULL AND vehicle_id IS NOT NULL)
  );

-- public_right_rental charges must have renter_id and public_right_id
ALTER TABLE charges ADD CONSTRAINT chk_pr_rental_fields
  CHECK (
    charge_type != 'public_right_rental'
    OR (renter_id IS NOT NULL AND public_right_id IS NOT NULL)
  );

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_right_renters ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_vehicle_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_right_vehicle_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_right_renter_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;

-- Helper: get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM app_users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- app_users policies (admin manages, users see own row)
-- ============================================================

CREATE POLICY "Users can view own row"
  ON app_users FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Admins can insert app_users"
  ON app_users FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "Admins can update app_users"
  ON app_users FOR UPDATE
  TO authenticated
  USING (get_user_role() = 'admin');

CREATE POLICY "Admins can delete app_users"
  ON app_users FOR DELETE
  TO authenticated
  USING (get_user_role() = 'admin');

-- ============================================================
-- Entity table policies (macro: all auth can SELECT/INSERT/UPDATE, only admin DELETE)
-- Applied to: drivers, vehicles, public_rights, public_right_renters,
--             driver_vehicle_assignments, public_right_vehicle_assignments,
--             public_right_renter_assignments, charges
-- ============================================================

-- drivers
CREATE POLICY "Auth users can view drivers" ON drivers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert drivers" ON drivers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update drivers" ON drivers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete drivers" ON drivers FOR DELETE TO authenticated USING (get_user_role() = 'admin');

-- vehicles
CREATE POLICY "Auth users can view vehicles" ON vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update vehicles" ON vehicles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete vehicles" ON vehicles FOR DELETE TO authenticated USING (get_user_role() = 'admin');

-- public_rights
CREATE POLICY "Auth users can view public_rights" ON public_rights FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert public_rights" ON public_rights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update public_rights" ON public_rights FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete public_rights" ON public_rights FOR DELETE TO authenticated USING (get_user_role() = 'admin');

-- public_right_renters
CREATE POLICY "Auth users can view public_right_renters" ON public_right_renters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert public_right_renters" ON public_right_renters FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update public_right_renters" ON public_right_renters FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete public_right_renters" ON public_right_renters FOR DELETE TO authenticated USING (get_user_role() = 'admin');

-- driver_vehicle_assignments
CREATE POLICY "Auth users can view dva" ON driver_vehicle_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert dva" ON driver_vehicle_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update dva" ON driver_vehicle_assignments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete dva" ON driver_vehicle_assignments FOR DELETE TO authenticated USING (get_user_role() = 'admin');

-- public_right_vehicle_assignments
CREATE POLICY "Auth users can view prva" ON public_right_vehicle_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert prva" ON public_right_vehicle_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update prva" ON public_right_vehicle_assignments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete prva" ON public_right_vehicle_assignments FOR DELETE TO authenticated USING (get_user_role() = 'admin');

-- public_right_renter_assignments
CREATE POLICY "Auth users can view prra" ON public_right_renter_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert prra" ON public_right_renter_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update prra" ON public_right_renter_assignments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete prra" ON public_right_renter_assignments FOR DELETE TO authenticated USING (get_user_role() = 'admin');

-- charges
CREATE POLICY "Auth users can view charges" ON charges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert charges" ON charges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update charges" ON charges FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete charges" ON charges FOR DELETE TO authenticated USING (get_user_role() = 'admin');
