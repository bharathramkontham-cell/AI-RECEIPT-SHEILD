import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear all tables
  await prisma.decision.deleteMany();
  await prisma.evidenceRequest.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.evidenceItem.deleteMany();
  await prisma.caseFile.deleteMany();
  await prisma.extraction.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.ledgerTxn.deleteMany();
  await prisma.travelBooking.deleteMany();
  await prisma.invoicePO.deleteMany();
  await prisma.policyRule.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.employee.deleteMany();

  console.log('🗑️  Cleared all tables');

  // =====================================================
  // EMPLOYEES
  // =====================================================
  const emp101 = await prisma.employee.create({
    data: {
      id: 'emp-101',
      empCode: 'EMP-101',
      name: 'Riya Sharma',
      dept: 'Engineering',
      homeCity: 'Mumbai',
      cardLast4: '4821',
    },
  });

  const emp102 = await prisma.employee.create({
    data: {
      id: 'emp-102',
      empCode: 'EMP-102',
      name: 'Arjun Mehta',
      dept: 'Sales',
      homeCity: 'Delhi',
      cardLast4: '7392',
    },
  });

  const emp103 = await prisma.employee.create({
    data: {
      id: 'emp-103',
      empCode: 'EMP-103',
      name: 'Priya Nair',
      dept: 'Marketing',
      homeCity: 'Bangalore',
      cardLast4: '5614',
    },
  });

  const emp104 = await prisma.employee.create({
    data: {
      id: 'emp-104',
      empCode: 'EMP-104',
      name: 'Vikram Patel',
      dept: 'Finance',
      homeCity: 'Ahmedabad',
      cardLast4: '8053',
    },
  });

  const emp105 = await prisma.employee.create({
    data: {
      id: 'emp-105',
      empCode: 'EMP-105',
      name: 'Sneha Reddy',
      dept: 'HR',
      homeCity: 'Hyderabad',
      cardLast4: '3267',
    },
  });

  console.log('👥 Created 5 employees');

  // =====================================================
  // MERCHANTS
  // =====================================================
  const merchants = await Promise.all([
    prisma.merchant.create({
      data: {
        id: 'merch-001',
        name: 'ABC Hotels Pvt Ltd',
        aliases: JSON.stringify(['ABC Grand Hotel', 'ABC Hotels', 'A.B.C. Grand Hotel']),
        gstOrVatNo: '27AABCA1234F1Z5',
        city: 'Pune',
        category: 'hotel',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-002',
        name: 'The Coastal Kitchen',
        aliases: JSON.stringify(['Coastal Kitchen', 'The Coastal Kitchen Restaurant']),
        gstOrVatNo: '07BBCKR5678G2H3',
        city: 'Delhi',
        category: 'restaurant',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-003',
        name: 'Metro Cab Services',
        aliases: JSON.stringify(['Metro Cabs', 'Metro Taxi']),
        gstOrVatNo: '29CCCMS9012J3K1',
        city: 'Bangalore',
        category: 'transport',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-004',
        name: 'Skyline Suites',
        aliases: JSON.stringify(['Skyline Hotel', 'Skyline Suites & Spa']),
        gstOrVatNo: '07DDDSS3456L4M2',
        city: 'Delhi',
        category: 'hotel',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-005',
        name: 'Airport Express Café',
        aliases: JSON.stringify(['Airport Express', 'AE Café', 'Airport Exp Cafe']),
        gstOrVatNo: '27EEEAC7890N5P3',
        city: 'Mumbai',
        category: 'restaurant',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-006',
        name: 'IndianOil Fuel Station',
        aliases: JSON.stringify(['Indian Oil', 'IOCL', 'IndianOil']),
        gstOrVatNo: '27FFFIO1234Q6R4',
        city: 'Mumbai',
        category: 'fuel',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-007',
        name: 'TechMart Electronics',
        aliases: JSON.stringify(['TechMart', 'Tech Mart']),
        gstOrVatNo: '29GGGTM5678S7T5',
        city: 'Bangalore',
        category: 'office_supplies',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-008',
        name: 'BlueStar Travels',
        aliases: JSON.stringify(['Blue Star Travels', 'BlueStar']),
        gstOrVatNo: '36HHHBT9012U8V6',
        city: 'Hyderabad',
        category: 'transport',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-009',
        name: 'Café Coffee Day',
        aliases: JSON.stringify(['CCD', 'Cafe Coffee Day']),
        gstOrVatNo: '29IIICCD345W9X7',
        city: 'Bangalore',
        category: 'restaurant',
        verified: true,
      },
    }),
    prisma.merchant.create({
      data: {
        id: 'merch-010',
        name: 'Raj Office Supplies',
        aliases: JSON.stringify(['Raj Supplies', 'Raj Office']),
        gstOrVatNo: '24JJJRO6789Y0Z8',
        city: 'Ahmedabad',
        category: 'office_supplies',
        verified: true,
      },
    }),
  ]);

  console.log('🏪 Created 10 merchants');

  // =====================================================
  // POLICY RULES
  // =====================================================
  await Promise.all([
    prisma.policyRule.create({
      data: {
        id: 'pol-001',
        category: 'hotel',
        field: 'amount',
        op: 'MAX',
        value: '8000',
        severity: 'WARNING',
        name: 'Hotel Nightly Cap',
        docRef: 'Policy v3.2 §4.1',
      },
    }),
    prisma.policyRule.create({
      data: {
        id: 'pol-002',
        category: 'restaurant',
        field: 'amount',
        op: 'MAX',
        value: '3000',
        severity: 'WARNING',
        name: 'Meal Cap',
        docRef: 'Policy v3.2 §4.2',
      },
    }),
    prisma.policyRule.create({
      data: {
        id: 'pol-003',
        category: 'fuel',
        field: 'amount',
        op: 'MAX',
        value: '5000',
        severity: 'WARNING',
        name: 'Monthly Fuel Cap',
        docRef: 'Policy v3.2 §4.3',
      },
    }),
    prisma.policyRule.create({
      data: {
        id: 'pol-004',
        category: 'transport',
        field: 'amount',
        op: 'MAX',
        value: '2000',
        severity: 'INFO',
        name: 'Single Ride Cap',
        docRef: 'Policy v3.2 §4.4',
      },
    }),
    prisma.policyRule.create({
      data: {
        id: 'pol-005',
        category: 'office_supplies',
        field: 'amount',
        op: 'MAX',
        value: '10000',
        severity: 'WARNING',
        name: 'Office Supplies Cap',
        docRef: 'Policy v3.2 §4.5',
      },
    }),
  ]);

  console.log('📋 Created 5 policy rules');

  // =====================================================
  // TRAVEL BOOKINGS (for Riya — Persona A verification)
  // =====================================================
  await Promise.all([
    prisma.travelBooking.create({
      data: {
        id: 'tb-001',
        empId: emp101.id,
        city: 'Pune',
        startDate: new Date('2026-09-10'),
        endDate: new Date('2026-09-12'),
        bookingRef: 'BK-2026-4821-001',
        hotel: 'ABC Grand Hotel',
      },
    }),
    prisma.travelBooking.create({
      data: {
        id: 'tb-002',
        empId: emp102.id,
        city: 'Delhi',
        startDate: new Date('2026-09-13'),
        endDate: new Date('2026-09-15'),
        bookingRef: 'BK-2026-7392-001',
        hotel: 'Skyline Suites',
      },
    }),
    prisma.travelBooking.create({
      data: {
        id: 'tb-003',
        empId: emp105.id,
        city: 'Bangalore',
        startDate: new Date('2026-09-08'),
        endDate: new Date('2026-09-09'),
        bookingRef: 'BK-2026-3267-001',
        hotel: null,
      },
    }),
  ]);

  console.log('✈️  Created 3 travel bookings');

  // =====================================================
  // LEDGER TRANSACTIONS (Corporate Card)
  // =====================================================
  const ledgerTxns = await Promise.all([
    // Persona A — EXACT MATCH for CLM-001
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-001',
        empId: emp101.id,
        cardLast4: '4821',
        amount: 18750,
        date: new Date('2026-09-11'),
        merchantName: 'ABC Hotels',
        txnRef: 'TXN-2026-4821-09110001',
      },
    }),
    // Persona B — MISMATCH for CLM-002 (₹5,450 vs claimed ₹8,450)
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-002',
        empId: emp102.id,
        cardLast4: '7392',
        amount: 5450,
        date: new Date('2026-09-14'),
        merchantName: 'Coastal Kitchen',
        txnRef: 'TXN-2026-7392-09140001',
      },
    }),
    // CLM-005 — RECONSTRUCT card match for Airport Express Café
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-003',
        empId: emp101.id,
        cardLast4: '4821',
        amount: 450,
        date: new Date('2026-09-08'),
        merchantName: 'Airport Exp Cafe',
        txnRef: 'TXN-2026-4821-09080001',
      },
    }),
    // Background VERIFIED claims
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-004',
        empId: emp104.id,
        cardLast4: '8053',
        amount: 2400,
        date: new Date('2026-09-05'),
        merchantName: 'Indian Oil',
        txnRef: 'TXN-2026-8053-09050001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-005',
        empId: emp105.id,
        cardLast4: '3267',
        amount: 850,
        date: new Date('2026-09-08'),
        merchantName: 'CCD',
        txnRef: 'TXN-2026-3267-09080001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-006',
        empId: emp104.id,
        cardLast4: '8053',
        amount: 1800,
        date: new Date('2026-09-07'),
        merchantName: 'Raj Office',
        txnRef: 'TXN-2026-8053-09070001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-007',
        empId: emp101.id,
        cardLast4: '4821',
        amount: 1350,
        date: new Date('2026-09-09'),
        merchantName: 'Metro Cabs',
        txnRef: 'TXN-2026-4821-09090001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-008',
        empId: emp105.id,
        cardLast4: '3267',
        amount: 5200,
        date: new Date('2026-09-09'),
        merchantName: 'TechMart',
        txnRef: 'TXN-2026-3267-09090001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-009',
        empId: emp102.id,
        cardLast4: '7392',
        amount: 1650,
        date: new Date('2026-09-12'),
        merchantName: 'BlueStar',
        txnRef: 'TXN-2026-7392-09120001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-010',
        empId: emp103.id,
        cardLast4: '5614',
        amount: 2100,
        date: new Date('2026-09-06'),
        merchantName: 'Cafe Coffee Day',
        txnRef: 'TXN-2026-5614-09060001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-011',
        empId: emp101.id,
        cardLast4: '4821',
        amount: 780,
        date: new Date('2026-09-07'),
        merchantName: 'CCD',
        txnRef: 'TXN-2026-4821-09070001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-012',
        empId: emp104.id,
        cardLast4: '8053',
        amount: 3500,
        date: new Date('2026-09-10'),
        merchantName: 'Indian Oil',
        txnRef: 'TXN-2026-8053-09100001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-013',
        empId: emp102.id,
        cardLast4: '7392',
        amount: 950,
        date: new Date('2026-09-10'),
        merchantName: 'Cafe Coffee Day',
        txnRef: 'TXN-2026-7392-09100001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-014',
        empId: emp103.id,
        cardLast4: '5614',
        amount: 4200,
        date: new Date('2026-09-11'),
        merchantName: 'TechMart',
        txnRef: 'TXN-2026-5614-09110001',
      },
    }),
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-015',
        empId: emp105.id,
        cardLast4: '3267',
        amount: 1500,
        date: new Date('2026-09-12'),
        merchantName: 'BlueStar',
        txnRef: 'TXN-2026-3267-09120001',
      },
    }),
    // CLM-019 match
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-016',
        empId: emp101.id,
        cardLast4: '4821',
        amount: 2800,
        date: new Date('2026-09-13'),
        merchantName: 'Indian Oil',
        txnRef: 'TXN-2026-4821-09130001',
      },
    }),
    // CLM-020 match
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-017',
        empId: emp103.id,
        cardLast4: '5614',
        amount: 900,
        date: new Date('2026-09-07'),
        merchantName: 'Metro Cabs',
        txnRef: 'TXN-2026-5614-09070001',
      },
    }),
    // CLM-021 match
    prisma.ledgerTxn.create({
      data: {
        id: 'ltx-018',
        empId: emp104.id,
        cardLast4: '8053',
        amount: 650,
        date: new Date('2026-09-12'),
        merchantName: 'CCD',
        txnRef: 'TXN-2026-8053-09120001',
      },
    }),
  ]);

  console.log('💳 Created 18 ledger transactions');

  // =====================================================
  // CLAIMS — Persona A: VERIFIED (CLM-001)
  // =====================================================
  await prisma.claim.create({
    data: {
      id: 'clm-001',
      empId: emp101.id,
      merchantRaw: 'ABC Grand Hotel',
      amount: 18750,
      currency: 'INR',
      date: new Date('2026-09-11'),
      category: 'hotel',
      description: 'Hotel stay for client meeting in Pune — 1 night',
      receiptFileKey: '/receipts/hotel-receipt.webp',
      receiptId: 'RCPT-ABH-2026-09110842',
      status: 'VERIFIED',
      riskLevel: 'LOW',
    },
  });

  // =====================================================
  // CLAIMS — Persona B: CONFLICTING (CLM-002)
  // =====================================================
  await prisma.claim.create({
    data: {
      id: 'clm-002',
      empId: emp102.id,
      merchantRaw: 'The Coastal Kitchen',
      amount: 8450,
      currency: 'INR',
      date: new Date('2026-09-14'),
      category: 'restaurant',
      description: 'Team dinner with prospective clients',
      receiptFileKey: '/receipts/restaurant-receipt.webp',
      receiptId: 'RCPT-TCK-2026-09142135',
      status: 'CONFLICTING',
      riskLevel: 'HIGH',
    },
  });

  // =====================================================
  // CLAIMS — UNVERIFIED (CLM-003)
  // =====================================================
  await prisma.claim.create({
    data: {
      id: 'clm-003',
      empId: emp103.id,
      merchantRaw: 'Metro Cab Services',
      amount: 1200,
      currency: 'INR',
      date: new Date('2026-09-15'),
      category: 'transport',
      description: 'Cab from airport to client site',
      receiptFileKey: '/receipts/cab-receipt.webp',
      receiptId: 'RCPT-MCS-2026-09151045',
      status: 'UNVERIFIED',
      riskLevel: 'MEDIUM',
    },
  });

  // =====================================================
  // CLAIMS — POLICY_EXCEPTION (CLM-004)
  // =====================================================
  await prisma.claim.create({
    data: {
      id: 'clm-004',
      empId: emp102.id,
      merchantRaw: 'Skyline Suites',
      amount: 14500,
      currency: 'INR',
      date: new Date('2026-09-13'),
      category: 'hotel',
      description: 'Hotel stay during annual sales conference',
      receiptFileKey: '/receipts/hotel-receipt.webp',
      receiptId: 'RCPT-SKY-2026-09131420',
      status: 'POLICY_EXCEPTION',
      riskLevel: 'MEDIUM',
    },
  });

  // =====================================================
  // CLAIMS — RECONSTRUCTED (CLM-005)
  // =====================================================
  await prisma.claim.create({
    data: {
      id: 'clm-005',
      empId: emp101.id,
      merchantRaw: 'Airport Express Café',
      amount: 450,
      currency: 'INR',
      date: new Date('2026-09-08'),
      category: 'restaurant',
      description: 'Coffee and snack before flight — original receipt lost',
      receiptFileKey: '/receipts/cafe-receipt.webp',
      receiptId: 'RCPT-AEC-2026-09080715',
      status: 'RECONSTRUCTED_VERIFIED',
      riskLevel: 'LOW',
    },
  });

  // =====================================================
  // CLAIMS — Prior duplicate of CLM-002 (CLM-006)
  // =====================================================
  await prisma.claim.create({
    data: {
      id: 'clm-006',
      empId: emp102.id,
      merchantRaw: 'The Coastal Kitchen',
      amount: 8450,
      currency: 'INR',
      date: new Date('2026-09-11'),
      category: 'restaurant',
      description: 'Client dinner',
      receiptFileKey: '/receipts/restaurant-receipt.webp',
      receiptId: 'RCPT-TCK-2026-09142135', // SAME receipt ID as CLM-002
      status: 'CONFLICTING',
      riskLevel: 'HIGH',
    },
  });

  // =====================================================
  // CLAIMS — Background VERIFIED claims (CLM-007 to CLM-021)
  // =====================================================
  const backgroundClaims = [
    { id: 'clm-007', empId: emp104.id, merchant: 'IndianOil Fuel Station', amount: 2400, date: '2026-09-05', category: 'fuel', desc: 'Fuel for site visit', receiptId: 'RCPT-IOC-2026-09050930' },
    { id: 'clm-008', empId: emp105.id, merchant: 'Café Coffee Day', amount: 850, date: '2026-09-08', category: 'restaurant', desc: 'Working lunch with team', receiptId: 'RCPT-CCD-2026-09081230' },
    { id: 'clm-009', empId: emp104.id, merchant: 'Raj Office Supplies', amount: 1800, date: '2026-09-07', category: 'office_supplies', desc: 'Printer cartridges', receiptId: 'RCPT-ROS-2026-09071100' },
    { id: 'clm-010', empId: emp101.id, merchant: 'Metro Cab Services', amount: 1350, date: '2026-09-09', category: 'transport', desc: 'Cab to Pune office', receiptId: 'RCPT-MCS-2026-09091500' },
    { id: 'clm-011', empId: emp105.id, merchant: 'TechMart Electronics', amount: 5200, date: '2026-09-09', category: 'office_supplies', desc: 'USB hubs for team', receiptId: 'RCPT-TME-2026-09091400' },
    { id: 'clm-012', empId: emp102.id, merchant: 'BlueStar Travels', amount: 1650, date: '2026-09-12', category: 'transport', desc: 'Airport transfer', receiptId: 'RCPT-BST-2026-09121830' },
    { id: 'clm-013', empId: emp103.id, merchant: 'Café Coffee Day', amount: 2100, date: '2026-09-06', category: 'restaurant', desc: 'Client meeting over coffee', receiptId: 'RCPT-CCD-2026-09061000' },
    { id: 'clm-014', empId: emp101.id, merchant: 'Café Coffee Day', amount: 780, date: '2026-09-07', category: 'restaurant', desc: 'Quick coffee meeting', receiptId: 'RCPT-CCD-2026-09070830' },
    { id: 'clm-015', empId: emp104.id, merchant: 'IndianOil Fuel Station', amount: 3500, date: '2026-09-10', category: 'fuel', desc: 'Fuel for client visits', receiptId: 'RCPT-IOC-2026-09101045' },
    { id: 'clm-016', empId: emp102.id, merchant: 'Café Coffee Day', amount: 950, date: '2026-09-10', category: 'restaurant', desc: 'Team standup coffee', receiptId: 'RCPT-CCD-2026-09100900' },
    { id: 'clm-017', empId: emp103.id, merchant: 'TechMart Electronics', amount: 4200, date: '2026-09-11', category: 'office_supplies', desc: 'Wireless keyboard and mouse sets', receiptId: 'RCPT-TME-2026-09111530' },
    { id: 'clm-018', empId: emp105.id, merchant: 'BlueStar Travels', amount: 1500, date: '2026-09-12', category: 'transport', desc: 'Inter-city travel', receiptId: 'RCPT-BST-2026-09121600' },
    { id: 'clm-019', empId: emp101.id, merchant: 'IndianOil Fuel Station', amount: 2800, date: '2026-09-13', category: 'fuel', desc: 'Fuel for return trip', receiptId: 'RCPT-IOC-2026-09130800' },
    { id: 'clm-020', empId: emp103.id, merchant: 'Metro Cab Services', amount: 900, date: '2026-09-07', category: 'transport', desc: 'Cab to office', receiptId: 'RCPT-MCS-2026-09070715' },
    { id: 'clm-021', empId: emp104.id, merchant: 'Café Coffee Day', amount: 650, date: '2026-09-12', category: 'restaurant', desc: 'Coffee with vendor', receiptId: 'RCPT-CCD-2026-09121130' },
  ];

  for (const c of backgroundClaims) {
    await prisma.claim.create({
      data: {
        id: c.id,
        empId: c.empId,
        merchantRaw: c.merchant,
        amount: c.amount,
        currency: 'INR',
        date: new Date(c.date),
        category: c.category,
        description: c.desc,
        receiptId: c.receiptId,
        status: 'VERIFIED',
        riskLevel: 'LOW',
      },
    });
  }

  console.log('📄 Created 21 claims (6 key + 15 background)');

  // =====================================================
  // EXTRACTIONS (simulated OCR — per §6)
  // =====================================================
  const extractions = [
    {
      claimId: 'clm-001',
      fields: { merchant: 'ABC Grand Hotel', amount: 18750, date: '2026-09-11', taxNo: '27AABCA1234F1Z5', receiptId: 'RCPT-ABH-2026-09110842' },
      confidence: { merchant: 0.95, amount: 0.98, date: 0.97, taxNo: 0.88, receiptId: 0.92 },
    },
    {
      claimId: 'clm-002',
      fields: { merchant: 'The Coastal Kitchen', amount: 8450, date: '2026-09-14', taxNo: '07BBCKR5678G2H3', receiptId: 'RCPT-TCK-2026-09142135' },
      confidence: { merchant: 0.93, amount: 0.96, date: 0.94, taxNo: 0.85, receiptId: 0.91 },
    },
    {
      claimId: 'clm-003',
      fields: { merchant: 'Metro Cab Services', amount: 1200, date: '2026-09-15', taxNo: '29CCCMS9012J3K1', receiptId: 'RCPT-MCS-2026-09151045' },
      confidence: { merchant: 0.90, amount: 0.94, date: 0.92, taxNo: 0.78, receiptId: 0.87 },
    },
    {
      claimId: 'clm-004',
      fields: { merchant: 'Skyline Suites', amount: 14500, date: '2026-09-13', taxNo: '07DDDSS3456L4M2', receiptId: 'RCPT-SKY-2026-09131420' },
      confidence: { merchant: 0.96, amount: 0.97, date: 0.95, taxNo: 0.90, receiptId: 0.93 },
    },
    {
      claimId: 'clm-005',
      fields: { merchant: 'Airport Express Café', amount: 450, date: '2026-09-08', taxNo: '27EEEAC7890N5P3', receiptId: 'RCPT-AEC-2026-09080715' },
      confidence: { merchant: 0.72, amount: 0.80, date: 0.75, taxNo: 0.60, receiptId: 0.65 },
    },
  ];

  for (const e of extractions) {
    await prisma.extraction.create({
      data: {
        claimId: e.claimId,
        fields: JSON.stringify(e.fields),
        confidence: JSON.stringify(e.confidence),
        correctedByUser: e.claimId === 'clm-005', // reconstructed one was corrected
      },
    });
  }

  console.log('🔍 Created 5 extractions');

  // =====================================================
  // EVIDENCE ITEMS — pre-seeded for the key claims
  // =====================================================

  // CLM-001 (VERIFIED) — all checks pass
  await prisma.evidenceItem.createMany({
    data: [
      {
        claimId: 'clm-001',
        source: 'MERCHANT_REGISTRY',
        kind: 'merchant_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ matched: 'ABC Hotels Pvt Ltd', alias: 'ABC Grand Hotel', gstNo: '27AABCA1234F1Z5', gstValid: true }),
        summary: 'Merchant "ABC Grand Hotel" matched to registered entity "ABC Hotels Pvt Ltd" via alias. GST number verified.',
      },
      {
        claimId: 'clm-001',
        source: 'CARD_LEDGER',
        kind: 'transaction_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ claimedAmount: 18750, ledgerAmount: 18750, difference: 0, txnRef: 'TXN-2026-4821-09110001', ledgerDate: '2026-09-11', ledgerMerchant: 'ABC Hotels' }),
        summary: 'Corporate card transaction matches: ₹18,750 on 11-Sep-2026 at ABC Hotels. Exact amount match.',
      },
      {
        claimId: 'clm-001',
        source: 'TRAVEL_BOOKINGS',
        kind: 'travel_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ bookingRef: 'BK-2026-4821-001', city: 'Pune', hotel: 'ABC Grand Hotel', startDate: '2026-09-10', endDate: '2026-09-12' }),
        summary: 'Travel booking BK-2026-4821-001 confirms Pune stay at ABC Grand Hotel from 10-Sep to 12-Sep.',
      },
      {
        claimId: 'clm-001',
        source: 'POLICY',
        kind: 'policy_check',
        status: 'VERIFIED',
        detail: JSON.stringify({ rule: 'Hotel Nightly Cap', cap: 8000, nights: 1, totalCap: 8000, note: 'Amount ₹18,750 exceeds nightly cap but includes taxes and service charges within acceptable range for Pune properties' }),
        summary: 'Within policy limits for hotel category after tax adjustment.',
      },
      {
        claimId: 'clm-001',
        source: 'PRIOR_CLAIMS',
        kind: 'duplicate_check',
        status: 'VERIFIED',
        detail: JSON.stringify({ duplicatesFound: 0 }),
        summary: 'No duplicate claims found for this receipt ID or merchant/amount/date combination.',
      },
    ],
  });

  // CLM-002 (CONFLICTING) — amount mismatch + duplicate
  await prisma.evidenceItem.createMany({
    data: [
      {
        claimId: 'clm-002',
        source: 'MERCHANT_REGISTRY',
        kind: 'merchant_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ matched: 'The Coastal Kitchen', gstNo: '07BBCKR5678G2H3', gstValid: true }),
        summary: 'Merchant "The Coastal Kitchen" verified in registry. GST number valid.',
      },
      {
        claimId: 'clm-002',
        source: 'CARD_LEDGER',
        kind: 'transaction_match',
        status: 'CONFLICTING',
        detail: JSON.stringify({ claimedAmount: 8450, ledgerAmount: 5450, difference: 3000, txnRef: 'TXN-2026-7392-09140001', ledgerDate: '2026-09-14', ledgerMerchant: 'Coastal Kitchen' }),
        summary: 'Amount conflict: Claimed ₹8,450 but corporate card ledger shows ₹5,450. Difference: ₹3,000.',
      },
      {
        claimId: 'clm-002',
        source: 'PRIOR_CLAIMS',
        kind: 'duplicate_check',
        status: 'CONFLICTING',
        detail: JSON.stringify({ duplicatesFound: 1, duplicateClaimId: 'clm-006', matchType: 'receipt_id', sharedReceiptId: 'RCPT-TCK-2026-09142135' }),
        summary: 'Duplicate receipt: Receipt ID RCPT-TCK-2026-09142135 was previously submitted on claim CLM-006 (11-Sep-2026).',
      },
      {
        claimId: 'clm-002',
        source: 'POLICY',
        kind: 'policy_check',
        status: 'POLICY_EXCEPTION',
        detail: JSON.stringify({ rule: 'Meal Cap', cap: 3000, claimed: 8450, exceeded: 5450, docRef: 'Policy v3.2 §4.2' }),
        summary: 'Exceeds meal cap: ₹8,450 claimed vs ₹3,000 policy limit (Policy v3.2 §4.2). Exceeds by ₹5,450.',
      },
    ],
  });

  // CLM-003 (UNVERIFIED) — no card match, no booking
  await prisma.evidenceItem.createMany({
    data: [
      {
        claimId: 'clm-003',
        source: 'MERCHANT_REGISTRY',
        kind: 'merchant_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ matched: 'Metro Cab Services', gstNo: '29CCCMS9012J3K1', gstValid: true }),
        summary: 'Merchant "Metro Cab Services" verified in registry.',
      },
      {
        claimId: 'clm-003',
        source: 'CARD_LEDGER',
        kind: 'transaction_match',
        status: 'NOT_FOUND',
        detail: JSON.stringify({ claimedAmount: 1200, searchWindow: '±2 days', matchesFound: 0 }),
        summary: 'No matching corporate card transaction found within ±2 days for ₹1,200 at Metro Cab Services.',
      },
      {
        claimId: 'clm-003',
        source: 'TRAVEL_BOOKINGS',
        kind: 'travel_match',
        status: 'NOT_FOUND',
        detail: JSON.stringify({ claimCity: 'Bangalore', claimDate: '2026-09-15', bookingsFound: 0 }),
        summary: 'No travel booking found covering 15-Sep-2026 in Bangalore.',
      },
    ],
  });

  // CLM-004 (POLICY_EXCEPTION)
  await prisma.evidenceItem.createMany({
    data: [
      {
        claimId: 'clm-004',
        source: 'MERCHANT_REGISTRY',
        kind: 'merchant_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ matched: 'Skyline Suites', gstNo: '07DDDSS3456L4M2', gstValid: true }),
        summary: 'Merchant "Skyline Suites" verified in registry.',
      },
      {
        claimId: 'clm-004',
        source: 'POLICY',
        kind: 'policy_check',
        status: 'POLICY_EXCEPTION',
        detail: JSON.stringify({ rule: 'Hotel Nightly Cap', cap: 8000, claimed: 14500, exceeded: 6500, docRef: 'Policy v3.2 §4.1' }),
        summary: 'Exceeds hotel nightly cap: ₹14,500 claimed vs ₹8,000 limit (Policy v3.2 §4.1). Exceeds by ₹6,500. This is not an indication of wrongdoing — may be legitimate with management approval.',
      },
      {
        claimId: 'clm-004',
        source: 'TRAVEL_BOOKINGS',
        kind: 'travel_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ bookingRef: 'BK-2026-7392-001', city: 'Delhi', hotel: 'Skyline Suites', startDate: '2026-09-13', endDate: '2026-09-15' }),
        summary: 'Travel booking confirms Delhi stay at Skyline Suites from 13-Sep to 15-Sep.',
      },
    ],
  });

  // CLM-005 (RECONSTRUCTED_VERIFIED)
  await prisma.evidenceItem.createMany({
    data: [
      {
        claimId: 'clm-005',
        source: 'MERCHANT_REGISTRY',
        kind: 'merchant_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ matched: 'Airport Express Café', gstNo: '27EEEAC7890N5P3', gstValid: true }),
        summary: 'Merchant "Airport Express Café" verified in registry.',
      },
      {
        claimId: 'clm-005',
        source: 'CARD_LEDGER',
        kind: 'transaction_match',
        status: 'VERIFIED',
        detail: JSON.stringify({ claimedAmount: 450, ledgerAmount: 450, difference: 0, txnRef: 'TXN-2026-4821-09080001', ledgerDate: '2026-09-08', ledgerMerchant: 'Airport Exp Cafe', note: 'Receipt replacement — original lost. Transaction independently verified via card ledger.' }),
        summary: 'Receipt replacement verified: Corporate card confirms ₹450 at Airport Exp Cafe on 08-Sep-2026.',
      },
    ],
  });

  console.log('🔎 Created evidence items for all key claims');

  // =====================================================
  // FINDINGS — numbered per-claim explanations
  // =====================================================

  // CLM-001 findings
  await prisma.finding.create({
    data: {
      claimId: 'clm-001',
      rank: 1,
      title: 'All evidence sources corroborate this claim',
      detail: 'Merchant identity verified via GST registry. Corporate card ledger shows an exact amount match (₹18,750) on the same date. Travel booking confirms the location and dates. No duplicate submissions found.',
      sourceRef: 'CARD_LEDGER, MERCHANT_REGISTRY, TRAVEL_BOOKINGS, PRIOR_CLAIMS',
      severity: 'INFO',
    },
  });

  // CLM-002 findings
  await prisma.finding.createMany({
    data: [
      {
        claimId: 'clm-002',
        rank: 1,
        title: 'Amount conflict with corporate card ledger',
        detail: 'The claimed amount of ₹8,450 does not match the corporate card transaction of ₹5,450 recorded on the same date at the same merchant. The difference is ₹3,000. Both values and their sources are shown for the approver to evaluate.',
        sourceRef: 'CARD_LEDGER',
        severity: 'CRITICAL',
      },
      {
        claimId: 'clm-002',
        rank: 2,
        title: 'Duplicate receipt ID detected',
        detail: 'Receipt ID RCPT-TCK-2026-09142135 was previously submitted on claim CLM-006 dated 11-Sep-2026. The same receipt cannot support two separate expense claims.',
        sourceRef: 'PRIOR_CLAIMS',
        severity: 'CRITICAL',
      },
      {
        claimId: 'clm-002',
        rank: 3,
        title: 'Meal policy limit exceeded',
        detail: 'The claimed amount of ₹8,450 exceeds the ₹3,000 meal cap defined in Policy v3.2 §4.2. This is a policy exception and may require management approval. This is not an indication of wrongdoing.',
        sourceRef: 'POLICY',
        severity: 'WARNING',
      },
    ],
  });

  // CLM-003 findings
  await prisma.finding.createMany({
    data: [
      {
        claimId: 'clm-003',
        rank: 1,
        title: 'No matching corporate card transaction found',
        detail: 'No transaction matching ₹1,200 (±₹10 or ±1%) was found on the corporate card ending 5614 within ±2 days of 15-Sep-2026. This may indicate a personal card was used, or the transaction has not yet posted.',
        sourceRef: 'CARD_LEDGER',
        severity: 'WARNING',
      },
      {
        claimId: 'clm-003',
        rank: 2,
        title: 'No travel booking covers this date and location',
        detail: 'No active travel booking was found for the employee in Bangalore on 15-Sep-2026. A matching travel authorization or booking confirmation would resolve this.',
        sourceRef: 'TRAVEL_BOOKINGS',
        severity: 'WARNING',
      },
    ],
  });

  // CLM-004 findings
  await prisma.finding.create({
    data: {
      claimId: 'clm-004',
      rank: 1,
      title: 'Hotel nightly rate exceeds policy cap',
      detail: 'The claimed ₹14,500 per night exceeds the ₹8,000 nightly hotel cap in Policy v3.2 §4.1 by ₹6,500. Travel booking confirms the stay at Skyline Suites during the annual sales conference. This is a policy exception — not an indication of wrongdoing. Conference-period rates may require pre-approval.',
      sourceRef: 'POLICY, TRAVEL_BOOKINGS',
      severity: 'WARNING',
    },
  });

  // CLM-005 findings
  await prisma.finding.create({
    data: {
      claimId: 'clm-005',
      rank: 1,
      title: 'Lost receipt reconstructed and independently verified',
      detail: 'Original receipt was lost. The expense of ₹450 has been independently verified through the corporate card ledger (TXN-2026-4821-09080001, 08-Sep-2026) and merchant registry (Airport Express Café, GST verified). This claim is marked as a receipt replacement, not the original document.',
      sourceRef: 'CARD_LEDGER, MERCHANT_REGISTRY',
      severity: 'INFO',
    },
  });

  console.log('📝 Created findings for all key claims');

  // =====================================================
  // CASE FILES
  // =====================================================
  await prisma.caseFile.createMany({
    data: [
      {
        claimId: 'clm-001',
        decisionStatus: 'VERIFIED',
        recommendedAction: 'Approve — all evidence sources corroborate this claim.',
      },
      {
        claimId: 'clm-002',
        decisionStatus: 'CONFLICTING',
        recommendedAction: 'Request Evidence — ask the employee to explain the ₹3,000 difference between the claimed amount and the card ledger, and clarify the duplicate receipt submission.',
      },
      {
        claimId: 'clm-003',
        decisionStatus: 'UNVERIFIED',
        recommendedAction: 'Hold — Insufficient Evidence. Request a personal card statement or ride confirmation to verify the transaction. A travel booking for Bangalore on 15-Sep would also help.',
      },
      {
        claimId: 'clm-004',
        decisionStatus: 'POLICY_EXCEPTION',
        recommendedAction: 'Escalate for approval — the stay is confirmed by travel booking, but the nightly rate exceeds policy limits. Conference-period pricing may justify the exception.',
      },
      {
        claimId: 'clm-005',
        decisionStatus: 'RECONSTRUCTED_VERIFIED',
        recommendedAction: 'Approve — receipt was lost but the expense is independently verified via corporate card ledger and merchant registry. Marked as receipt replacement.',
      },
    ],
  });

  console.log('📁 Created 5 case files');

  // =====================================================
  // DECISIONS (sample audit trail)
  // =====================================================
  await prisma.decision.create({
    data: {
      claimId: 'clm-001',
      actor: 'Meera Kapoor',
      role: 'Finance',
      action: 'APPROVE',
      reason: 'All evidence verified — hotel stay confirmed by card, booking and registry.',
      evidenceSnapshot: JSON.stringify({ status: 'VERIFIED', evidenceCount: 5, allVerified: true }),
      at: new Date('2026-09-16T10:30:00'),
    },
  });

  console.log('✅ Created 1 sample decision');

  // =====================================================
  // EVIDENCE REQUEST (for CLM-002)
  // =====================================================
  await prisma.evidenceRequest.create({
    data: {
      claimId: 'clm-002',
      requestedItems: JSON.stringify([
        'Explanation for the ₹3,000 difference between your claimed amount (₹8,450) and the corporate card transaction (₹5,450)',
        'Clarification on why receipt RCPT-TCK-2026-09142135 appears on a prior claim (CLM-006, 11-Sep-2026)',
        'Any additional documentation supporting the claimed amount',
      ]),
      deadline: new Date('2026-09-20'),
      message: 'We have identified conflicting evidence on your expense claim CLM-002. Please review the items below and provide the requested documentation by 20-Sep-2026. This is a request for information, not an accusation.',
      sentAt: new Date('2026-09-17T09:00:00'),
    },
  });

  console.log('📨 Created 1 evidence request');

  // =====================================================
  // SEED SELF-TEST
  // =====================================================
  console.log('\n🧪 Running seed self-test...');

  const verifiedClaims = await prisma.claim.findMany({
    where: { status: { in: ['VERIFIED', 'RECONSTRUCTED_VERIFIED'] } },
    include: { employee: true },
  });

  const allLedgerTxns = await prisma.ledgerTxn.findMany();
  const allMerchants = await prisma.merchant.findMany();

  let testsPassed = 0;
  let testsFailed = 0;

  for (const claim of verifiedClaims) {
    // Skip background claims for now (they all have matching txns by construction)
    const matchingTxns = allLedgerTxns.filter((txn) => {
      const amountMatch = Math.abs(txn.amount - claim.amount) <= Math.max(claim.amount * 0.01, 10);
      const claimDate = new Date(claim.date);
      const txnDate = new Date(txn.date);
      const daysDiff = Math.abs((claimDate.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24));
      const dateMatch = daysDiff <= 2;
      const empMatch = txn.empId === claim.empId;

      // Check merchant alias match
      const merchant = allMerchants.find((m) => {
        const aliases: string[] = JSON.parse(m.aliases);
        return (
          m.name.toLowerCase() === claim.merchantRaw.toLowerCase() ||
          aliases.some((a) => a.toLowerCase() === claim.merchantRaw.toLowerCase()) ||
          m.name.toLowerCase() === txn.merchantName.toLowerCase() ||
          aliases.some((a) => a.toLowerCase() === txn.merchantName.toLowerCase())
        );
      });

      return amountMatch && dateMatch && empMatch && !!merchant;
    });

    if (matchingTxns.length > 0) {
      testsPassed++;
      console.log(`  ✅ ${claim.id} (${claim.merchantRaw}, ₹${claim.amount}) — ledger match found`);
    } else {
      testsFailed++;
      console.error(`  ❌ ${claim.id} (${claim.merchantRaw}, ₹${claim.amount}) — NO LEDGER MATCH`);
    }
  }

  console.log(`\n🧪 Self-test results: ${testsPassed} passed, ${testsFailed} failed out of ${verifiedClaims.length} VERIFIED claims`);

  if (testsFailed > 0) {
    throw new Error(`Seed self-test FAILED: ${testsFailed} VERIFIED claims have no matching ledger transaction!`);
  }

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
