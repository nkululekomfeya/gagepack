-- 1?? Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2?? ENUM types
CREATE TYPE verification_type_enum AS ENUM ('INTERNAL', 'EXTERNAL');
CREATE TYPE calibration_result_enum AS ENUM ('PASS', 'FAIL');
CREATE TYPE gauge_status_enum AS ENUM ('ACTIVE', 'OUT_OF_SERVICE');
CREATE TYPE movement_type_enum AS ENUM ('CHECK_OUT', 'CHECK_IN');

-- 3?? Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4?? Gauges
CREATE TABLE gauges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    gauge_code TEXT NOT NULL UNIQUE,
    description TEXT,
    gauge_type TEXT,
    serial_number TEXT,
    range TEXT,

    verification_type verification_type_enum NOT NULL,

    location_id UUID REFERENCES locations(id),

    status gauge_status_enum NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5?? Calibrations
CREATE TABLE calibrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    gauge_id UUID NOT NULL
        REFERENCES gauges(id)
        ON DELETE CASCADE,

    calibration_date DATE NOT NULL,
    due_date DATE NOT NULL,

    result calibration_result_enum NOT NULL,

    performed_by TEXT,

    certificate_path TEXT,
    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6?? Internal calibration details
CREATE TABLE internal_calibration_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    calibration_id UUID NOT NULL UNIQUE
        REFERENCES calibrations(id)
        ON DELETE CASCADE,

    master_gauge_number TEXT NOT NULL,

    target_value NUMERIC NOT NULL,
    actual_value NUMERIC NOT NULL,
    deviation NUMERIC NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 7?? Gauge movement (check-in / check-out)
CREATE TABLE gauge_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    gauge_id UUID NOT NULL
        REFERENCES gauges(id)
        ON DELETE CASCADE,

    movement_type movement_type_enum NOT NULL,

    from_location TEXT,
    to_location TEXT,
    machine_name TEXT,
    moved_by TEXT,

    moved_at TIMESTAMP NOT NULL DEFAULT NOW(),

    notes TEXT
);

-- 8?? Indexes
CREATE INDEX idx_gauges_gauge_code ON gauges(gauge_code);
CREATE INDEX idx_calibrations_gauge_id ON calibrations(gauge_id);
CREATE INDEX idx_calibrations_due_date ON calibrations(due_date);
CREATE INDEX idx_gauge_movements_gauge_id ON gauge_movements(gauge_id);

