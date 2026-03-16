-- ============================
-- LOCATIONS
-- ============================
INSERT INTO locations (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Drawer A', 'Main gauge drawer'),
('22222222-2222-2222-2222-222222222222', 'Maintenance', 'Maintenance room'),
('33333333-3333-3333-3333-333333333333', 'Line 1', 'Production Line 1');

-- ============================
-- GAUGES
-- ============================
INSERT INTO gauges (
    id,
    gauge_code,
    description,
    gauge_type,
    serial_number,
    range,
    verification_type,
    location_id
) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'G-EXT-001',
    'Pressure Gauge 0–10 bar',
    'Pressure',
    'PG-98231',
    '0–10 bar',
    'EXTERNAL',
    '11111111-1111-1111-1111-111111111111'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'G-INT-001',
    'Vernier Caliper 150mm',
    'Vernier',
    'VC-55421',
    '0–150 mm',
    'INTERNAL',
    '11111111-1111-1111-1111-111111111111'
);

-- ============================
-- CALIBRATIONS
-- ============================
INSERT INTO calibrations (
    id,
    gauge_id,
    calibration_date,
    due_date,
    result,
    performed_by,
    certificate_path
) VALUES
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '2025-01-10',
    '2026-01-10',
    'PASS',
    'External Lab ABC',
    '/uploads/certificates/G-EXT-001.pdf'
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '2025-02-05',
    '2026-02-05',
    'PASS',
    'John Technician',
    NULL
);

-- ============================
-- INTERNAL CALIBRATION DETAILS
-- ============================
INSERT INTO internal_calibration_details (
    calibration_id,
    master_gauge_number,
    target_value,
    actual_value,
    deviation
) VALUES
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'MASTER-001',
    50.000,
    50.015,
    0.015
);

-- ============================
-- GAUGE MOVEMENTS
-- ============================
INSERT INTO gauge_movements (
    gauge_id,
    movement_type,
    from_location,
    to_location,
    machine_name,
    moved_by,
    notes
) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'CHECK_OUT',
    'Drawer A',
    'Line 1',
    'Lathe 3',
    'Operator Mike',
    'Used for setup'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'CHECK_IN',
    'Line 1',
    'Drawer A',
    NULL,
    'Operator Mike',
    'Returned after use'
);
