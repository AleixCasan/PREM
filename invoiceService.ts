
import { jsPDF } from "jspdf";
import { Transaction } from '../types';

export const VENDOR_DETAILS = {
  name: 'PREM TALENT SCP',
  taxId: 'J04965778',
  address: "C/ La Miquela, 18b",
  city: '17162 Bescanó (Girona)',
  country: 'Espanya',
  email: 'administracio@prem.cat',
  phone: '+34 972 000 000'
};

export const generateInvoicePDF = (transaction: Transaction, billingData: any) => {
  const doc = new jsPDF();
  const ivaRate = 0.21;
  const totalAmount = transaction.amount;
  const baseImponible = totalAmount / (1 + ivaRate);
  const ivaTotal = totalAmount - baseImponible;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55); // Prem Gold
  doc.text("PREM ACADEMY", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("FACTURA ELECTRÒNICA", 150, 20);
  doc.text(`Nº: ${transaction.id.replace('TX', 'INV-2024')}`, 150, 26);
  doc.text(`Data: ${transaction.date}`, 150, 32);

  // Line
  doc.setDrawColor(230);
  doc.line(14, 40, 196, 40);

  // Vendor Info
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("DADES DE L'EMISSOR", 14, 50);
  doc.setFont("helvetica", "normal");
  doc.text(VENDOR_DETAILS.name, 14, 56);
  doc.text(`NIF: ${VENDOR_DETAILS.taxId}`, 14, 62);
  doc.text(VENDOR_DETAILS.address, 14, 68);
  doc.text(VENDOR_DETAILS.city, 14, 74);
  doc.text(`Email: ${VENDOR_DETAILS.email}`, 14, 80);

  // Client Info
  doc.setFont("helvetica", "bold");
  doc.text("RECEPTOR (CLIENT)", 110, 50);
  doc.setFont("helvetica", "normal");
  const clientName = billingData.isCompany ? billingData.companyName : billingData.name;
  doc.text(clientName, 110, 56);
  doc.text(`NIF/DNI: ${billingData.isCompany ? billingData.companyTaxId : billingData.taxId}`, 110, 62);
  doc.text(billingData.address, 110, 68);
  doc.text(`${billingData.postalCode} ${billingData.city}`, 110, 74);
  doc.text(billingData.email, 110, 80);

  // Table Header
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 95, 182, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Descripció", 20, 101);
  doc.text("Quantitat", 120, 101);
  doc.text("Preu Unitari", 150, 101);
  doc.text("Total", 175, 101);

  // Table Body
  doc.setFont("helvetica", "normal");
  doc.text(transaction.pack, 20, 115);
  doc.text("1", 125, 115);
  doc.text(`${baseImponible.toFixed(2)}€`, 150, 115);
  doc.text(`${baseImponible.toFixed(2)}€`, 175, 115);

  // Totals
  doc.line(14, 130, 196, 130);
  doc.text("Base Imposable:", 140, 140);
  doc.text(`${baseImponible.toFixed(2)}€`, 175, 140);
  doc.text("IVA (21%):", 140, 146);
  doc.text(`${ivaTotal.toFixed(2)}€`, 175, 146);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL FACTURA:", 140, 156);
  doc.text(`${totalAmount.toFixed(2)}€`, 175, 156);

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
  doc.text("Aquesta factura s'ha generat automàticament mitjançant el sistema de pagament segur de Prem Academy.", 14, 270);
  doc.text("Gràcies per la seva confiança.", 14, 275);
  doc.text(`© 2024 ${VENDOR_DETAILS.name}`, 14, 280);

  // Save
  doc.save(`Factura_${transaction.id}.pdf`);
};
