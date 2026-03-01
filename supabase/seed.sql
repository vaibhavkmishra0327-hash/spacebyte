-- ============================================================
-- SpaceByte — Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ── LAUNCHES ──
INSERT INTO launches (id, vehicle, mission, date, time, site, pad, orbit, payload, payload_mass, status, description, countdown, "window") VALUES
('sslv-d5', 'SSLV-D5', 'EOS-10', '2026-03-03', '09:30 IST', 'SDSC-SHAR', 'FLP', 'SSO-500', 'Earth Observation', '320 kg', 'go', 'Fifth developmental flight of Small Satellite Launch Vehicle carrying EOS-10 multispectral imaging satellite.', 'T-04d 08h 32m', '09:30 — 10:15 IST'),
('pslv-c61', 'PSLV-C61', 'Resourcesat-3', '2026-03-18', '11:00 IST', 'SDSC-SHAR', 'SLP', 'SSO-817', 'Earth Resources', '1,350 kg', 'upcoming', 'Continuation of the Resourcesat series for natural resource monitoring with advanced LISS-V sensor.', NULL, '11:00 — 11:30 IST'),
('gslv-f16', 'GSLV-F16', 'NASA-ISRO SAR', '2026-04-12', '06:00 IST', 'SDSC-SHAR', 'SLP-UB', 'SSO-747', 'Dual-freq SAR', '2,800 kg', 'upcoming', 'Joint NASA-ISRO synthetic aperture radar mission. Dual-frequency (L+S band) radar for Earth surface dynamics.', NULL, '06:00 — 06:45 IST'),
('lvm3-m6', 'LVM3-M6', 'OneWeb-India-2', '2026-05-20', '00:30 IST', 'SDSC-SHAR', 'SLP-UB', 'LEO-1200', '36× OneWeb Sats', '5,796 kg', 'upcoming', 'Second commercial OneWeb constellation deployment by LVM3. 36 satellites to LEO for broadband coverage.', NULL, '00:30 — 01:00 IST'),
('pslv-c62', 'PSLV-C62', 'XPoSat-2', '2026-06-15', '10:00 IST', 'SDSC-SHAR', 'FLP', 'LEO-650', 'X-ray Polarimetry', '480 kg', 'upcoming', 'Follow-up X-ray polarimetry satellite with enhanced spectral capabilities for cosmic source studies.', NULL, NULL),
('lvm3-g1', 'LVM3-G1', 'Gaganyaan-1', '2026-08-15', '07:00 IST', 'SDSC-SHAR', 'SLP-G', 'LEO-400', 'Crew Module (3)', '8,200 kg', 'upcoming', 'India''s first crewed spaceflight. Three astronauts in a 400km orbit for a 3-day mission. Historic moment for ISRO.', NULL, '07:00 — 07:30 IST');

-- ── SATELLITES ──
INSERT INTO satellites (id, name, norad, type, orbit, altitude, inclination, period, health, signal, launched, band, status) VALUES
('1', 'GSAT-24', '56994', 'Communication', 'GEO', '35,786 km', '0.1°', '23h 56m', 'nominal', 97, '2022-06-23', 'Ku', 'Active'),
('2', 'Cartosat-3A', '58201', 'Earth Observation', 'SSO', '509 km', '97.5°', '94m 48s', 'nominal', 94, '2025-08-15', 'X', 'Active'),
('3', 'RISAT-2BR2', '48916', 'SAR', 'LEO', '556 km', '37.0°', '95m 42s', 'nominal', 91, '2024-02-14', 'X', 'Active'),
('4', 'NVS-01', '56710', 'Navigation', 'GEO', '35,786 km', '5.0°', '23h 56m', 'nominal', 98, '2023-05-29', 'L5/S', 'Active'),
('5', 'NVS-02', '59102', 'Navigation', 'GEO', '35,786 km', '28.0°', '23h 56m', 'nominal', 96, '2026-02-20', 'L5/S', 'Active'),
('6', 'Aditya-L1', '57888', 'Solar Observatory', 'L1', '1.5M km', '—', '177.86d', 'nominal', 88, '2023-09-02', 'S', 'Science Ops'),
('7', 'INSAT-3DS', '58910', 'Meteorology', 'GEO', '35,786 km', '0.2°', '23h 56m', 'warning', 76, '2024-02-17', 'S/C', 'Degraded'),
('8', 'EOS-06', '54363', 'Earth Observation', 'SSO', '720 km', '98.4°', '99m 12s', 'nominal', 93, '2022-11-26', 'X', 'Active'),
('9', 'SPADEX-A', '59050', 'Technology Demo', 'LEO', '470 km', '55.0°', '93m 48s', 'nominal', 89, '2026-01-28', 'S', 'Docked'),
('10', 'SPADEX-B', '59051', 'Technology Demo', 'LEO', '470 km', '55.0°', '93m 48s', 'nominal', 87, '2026-01-28', 'S', 'Docked'),
('11', 'GSAT-20', '58777', 'Communication', 'GEO', '35,786 km', '0.1°', '23h 56m', 'nominal', 99, '2024-11-18', 'Ka', 'Active'),
('12', 'Chandrayaan-4', '59100', 'Lunar Probe', 'HEO', '384,400 km', '28.6°', '—', 'nominal', 82, '2026-01-15', 'S/X', 'In Transit');

-- ── MISSIONS ──
INSERT INTO missions (id, name, type, status, phase, progress, launch_date, vehicle, mission_day, telemetry_altitude, telemetry_velocity, telemetry_fuel, description) VALUES
('chandrayaan-4', 'Chandrayaan-4', 'Lunar Sample Return', 'active', 'Trans-Lunar Injection', 38, '2026-01-15', 'LVM3-M5', 43, '384,400 km', '1.02 km/s', '67%', 'India''s first lunar sample return mission. Spacecraft en route to lunar orbit for descent and sample collection.'),
('gaganyaan-1', 'Gaganyaan-1', 'Human Spaceflight', 'preparation', 'Crew Training Phase III', 72, '2026-08-15', 'LVM3-G1', 0, '—', '—', '—', 'India''s maiden human spaceflight program. Crew module and service module undergoing final integration.'),
('aditya-l1', 'Aditya-L1', 'Solar Observatory', 'operational', 'L1 Halo Orbit — Science Ops', 100, '2023-09-02', 'PSLV-C57', 908, '1.5M km', '29.8 km/s', '81%', 'Solar observation mission at Sun-Earth L1 point. All seven payloads operational and returning science data.'),
('spadex', 'SPADEX', 'Docking Experiment', 'operational', 'Proximity Ops — Docked', 100, '2026-01-28', 'PSLV-C60', 30, '470 km', '7.6 km/s', '44%', 'Space docking experiment demonstrating autonomous rendezvous and docking capability in LEO.'),
('nisar', 'NASA-ISRO SAR', 'Earth Observation', 'preparation', 'Launch Campaign', 88, '2026-04-12', 'GSLV-F16', 0, '—', '—', '—', 'Joint NASA-ISRO dual-frequency SAR mission for Earth surface dynamics, ecosystem disturbances, and ice sheet collapse.'),
('shukrayaan', 'Shukrayaan-1', 'Venus Orbiter', 'concept', 'Phase-A Study', 15, '2028-12', 'GSLV Mk III', 0, '—', '—', '—', 'Proposed Venus orbiter mission to study the surface and atmosphere of Venus using synthetic aperture radar.');

-- ── INTEL FEED ──
INSERT INTO intel_feed (id, time, date, category, priority, title, body, source, tags) VALUES
('1', '14:32', '2026-02-27', 'LAUNCH', 'high', 'Gaganyaan-1 Crew Training Phase III Completed', 'All three astronauts have completed high-altitude survival and zero-G parabolic training at HSFC Bengaluru. Crew module integration on track for Q3 launch window. Medical clearance pending final review.', 'ISRO HSFC', ARRAY['Gaganyaan', 'Human Spaceflight', 'HSFC']),
('2', '13:18', '2026-02-27', 'ORBIT', 'high', 'Chandrayaan-4 Orbit Insertion Burn Confirmed', 'Propulsion module executed 42-second burn at periapsis for lunar orbit insertion. Telemetry confirms 100km × 100km circular orbit achieved. Descent module separation scheduled for T+45d.', 'ISTRAC Bengaluru', ARRAY['Chandrayaan-4', 'Lunar', 'Orbit Mechanics']),
('3', '12:05', '2026-02-27', 'POLICY', 'medium', 'IN-SPACe Approves 3 New Commercial Launch Providers', 'Indian National Space Promotion and Authorization Centre grants operational licenses to Skyroot Aerospace (Vikram-II), Agnikul Cosmos (Agnibaan SOrTeD), and Bellatrix Aerospace (launch services). Launches expected from 2027.', 'IN-SPACe', ARRAY['Commercial', 'Policy', 'Licensing']),
('4', '10:44', '2026-02-27', 'ORBIT', 'medium', 'GSAT-24 Transponder C7 Elevated Thermal Signature', 'Ku-band transponder C7 on GSAT-24 reporting temperatures 12°C above nominal baseline. NSIL monitoring with contingency plan to switch to backup transponder C7-R. No service disruption reported.', 'MCF Hassan', ARRAY['GSAT-24', 'Thermal', 'Anomaly']),
('5', '09:22', '2026-02-27', 'LAUNCH', 'medium', 'SSLV-D5 Vehicle Integration Started at SDSC-SHAR', 'Stage stacking operations commenced at First Launch Pad for SSLV-D5 / EOS-10 mission. SS1 solid motor already mounted on launch platform. Payload integration in clean room FIC-01.', 'SDSC-SHAR', ARRAY['SSLV', 'Integration', 'EOS-10']),
('6', '08:15', '2026-02-27', 'COMMERCIAL', 'low', 'NSIL Signs $140M Contract for GSAT-25 Transponder Lease', 'NewSpace India Limited signs multi-year transponder lease agreement with Tata Play for GSAT-25 Ka-band capacity. Expected launch Q1 2027 on LVM3.', 'NSIL', ARRAY['NSIL', 'Commercial', 'GSAT-25']),
('7', '06:30', '2026-02-27', 'SCIENCE', 'medium', 'Aditya-L1 VELC Captures New Coronal Mass Ejection Data', 'Visible Emission Line Coronagraph records high-resolution imagery of CME event S2026-019. Data downlinked to ISSDC. Solar wind parameters shared with NOAA for space weather forecasting.', 'ISSDC Bengaluru', ARRAY['Aditya-L1', 'Solar', 'CME']),
('8', '22:10', '2026-02-26', 'DEFENSE', 'high', 'DRDO ASAT Deterrence Test — Debris-Free Simulation Success', 'Defence Research Organisation completes software-defined ASAT engagement simulation with zero debris generation profile. Test validates kinetic kill vehicle tracking algorithms against LEO target signatures.', 'DRDO', ARRAY['DRDO', 'ASAT', 'Defense']);
