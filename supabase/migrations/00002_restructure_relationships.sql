-- Add public_taxi_right_id to vehicles (required FK)
ALTER TABLE vehicles
  ADD COLUMN public_taxi_right_id UUID NOT NULL REFERENCES public_rights(id);

-- Add vehicle_id to drivers (nullable FK for assignment history)
ALTER TABLE drivers
  ADD COLUMN vehicle_id UUID REFERENCES vehicles(id);

-- Drop public_right_vehicle_assignments (replaced by direct FK on vehicles)
DROP TABLE IF EXISTS public_right_vehicle_assignments;
