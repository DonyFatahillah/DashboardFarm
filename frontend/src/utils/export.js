import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to Excel
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, fileName = 'data-export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    console.warn('No data to export to Excel');
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Export data to PDF
 * @param {Array} headers - Array of table headers (e.g., [['Name', 'Age']])
 * @param {Array} data - Array of arrays for table rows (e.g., [['John', 30], ['Jane', 25]])
 * @param {string} fileName - Name of the file
 * @param {string} title - Title displayed in the PDF
 */
export const exportToPDF = (headers, data, fileName = 'data-export', title = 'Data Export') => {
  if (!data || data.length === 0) {
    console.warn('No data to export to PDF');
    return;
  }
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  // Add timestamp
  const date = new Date().toLocaleString('id-ID');
  doc.text(`Generated on: ${date}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: headers,
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // primary-500 equivalent
    styles: { fontSize: 9 },
  });

  doc.save(`${fileName}.pdf`);
};
