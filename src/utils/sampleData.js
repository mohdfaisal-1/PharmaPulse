export const SAMPLE_COMPLAINTS = [
  {
    id: 'sample-ceftriaxone',
    title: 'Sample 1: Ceftriaxone 1g Injection Particulates (Critical FDF)',
    severityLabel: 'Critical',
    priorityLabel: 'Urgent',
    customerName: 'Mercy General Hospital, Pharmacy Dept',
    productName: 'Ceftriaxone for Injection USP 1g',
    batchLotNumber: 'CTX-2026-088',
    mfgDate: '2026-01-15',
    expiryDate: '2027-12-31',
    quantityAffected: '450',
    quantityUnit: 'vials',
    text: `URGENT PHARMACOVIGILANCE COMPLAINT REPORT
Date: 2026-03-15
Source: Hospital Clinical Pharmacy Department
Customer Name: Mercy General Hospital, Pharmacy Dept
Contact: Chief Pharmacist (Inpatient Services)

Product Name: Ceftriaxone for Injection USP
Strength / Grade: 1g Sterile Powder Vial (USP Grade)
Batch / Lot ID: CTX-2026-088
Manufacturing Date: 2026-01-15
Expiry Date: 2027-12-31
Quantity Affected: 450 vials (Box Lot #088-A)

Complaint Category: Physical Contamination / Foreign Particulates
Initial Severity: Critical
Priority Tier: Urgent

Detailed Description:
Visible grey foreign particulate matter was observed suspended inside the reconstituted solution upon dissolving Ceftriaxone 1g vials with 10 mL Sterile Water for Injection (SWFI). The dark fibers (>200 microns) remained undissolved after 3 minutes of vigorous swirling. Two planned patient administrations in the ICU ward were immediately held. All 450 vials from Lot CTX-2026-088 have been placed in pharmacy quarantine. Requesting immediate investigation, stopper rubber integrity review, and CAPA initiation.`
  },
  {
    id: 'sample-metformin',
    title: 'Sample 2: Metformin HCl API Poly-Liner Breach (Major API)',
    severityLabel: 'Major',
    priorityLabel: 'High',
    customerName: 'AstraFormulations Ltd',
    productName: 'Metformin Hydrochloride API Micronized',
    batchLotNumber: 'MF-API-994',
    mfgDate: '2025-11-20',
    expiryDate: '2028-10-31',
    quantityAffected: '120',
    quantityUnit: 'kg',
    text: `QUALITY INCIDENT & DEVIATION REPORT
Date: 2026-03-08
Source: Receiving Raw Material QC Inspection
Customer Name: AstraFormulations Ltd (Manufacturing Site 2)

Product Name: Metformin Hydrochloride API Micronized
Strength / Grade: 850mg Micronized USP/EP Grade
Batch / Lot ID: MF-API-994
Manufacturing Date: 2025-11-20
Expiry Date: 2028-10-31
Quantity Affected: 120 kg (Drum #3 of 10)

Complaint Category: Packaging Defect & Moisture Risk
Initial Severity: Major
Priority Tier: High

Detailed Description:
During incoming QC receipt sampling of Batch MF-API-994, a 15-cm tear in the inner double poly-liner was detected inside Fiber Drum #3 out of 10. The associated desiccant pouch was physically torn with loose silica gel beads mixed into the top layer of raw powder. Immediate quarantine of the entire 120 kg shipment was enacted upon receipt. Requesting replacement drums, drum sealing line thermal audit, and desiccant pouch integrity CAPA.`
  }
];
