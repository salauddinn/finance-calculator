import * as ExcelJS from 'exceljs';

export interface ExcelColumn<T> {
  header: string;
  key: keyof T;
  width?: number;
  format?: 'currency' | 'percent' | 'number' | 'text';
  color?: string; // ARGB format, e.g., 'FFFFE0B2'
}

export function generateWorkbook<T extends Record<string, any>>(
  worksheetName: string,
  data: T[],
  columns: ExcelColumn<T>[]
): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(worksheetName);

  worksheet.columns = columns.map(c => ({
    header: c.header,
    key: c.key as string,
    width: c.width || 15
  }));

  // Style headers: Deep blue professional theme
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A8A' } // Tailwind blue-900
  };

  // Add data first so cells exist
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Apply column formatting and specific color coding
  columns.forEach((col, index) => {
    const column = worksheet.getColumn(index + 1);
    
    // Default alignment
    column.alignment = { vertical: 'middle', horizontal: 'right' };
    
    if (col.format === 'currency') {
      column.numFmt = '₹#,##0.00';
    } else if (col.format === 'percent') {
      column.numFmt = '0.00%';
    } else if (col.format === 'number') {
      column.numFmt = '#,##0.00';
    } else if (col.format === 'text') {
      column.alignment = { vertical: 'middle', horizontal: 'left' };
    }

    if (col.color) {
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > 1 && rowNumber <= data.length + 1) { // Skip header, only color data rows
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: col.color }
          };
        }
      });
    }
  });

  // Alternating row colors for readability (only if the column doesn't have a specific color)
  data.forEach((_, index) => {
    const rowNumber = index + 2; // Data starts at row 2
    if (index % 2 === 0) {
      const row = worksheet.getRow(rowNumber);
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber <= columns.length && !columns[colNumber - 1].color) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' } // Tailwind gray-100
          };
        }
      });
    }
  });

  // Freeze the top header row
  worksheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 1 }
  ];

  // Try to adjust border for all cells with data
  const lastRow = data.length + 1;
  const lastCol = columns.length;
  for (let r = 1; r <= lastRow; r++) {
    for (let c = 1; c <= lastCol; c++) {
      const cell = worksheet.getCell(r, c);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    }
  }

  return workbook;
}

export async function exportToExcel<T extends Record<string, any>>(
  filename: string,
  worksheetName: string,
  data: T[],
  columns: ExcelColumn<T>[]
): Promise<void> {
  const workbook = generateWorkbook(worksheetName, data, columns);

  // Generate buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
