import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateWorkbook, exportToExcel } from "./excel-export";

describe("excel-export", () => {
  describe("generateWorkbook", () => {
    const data = [
      { month: 1, emi: 1000, principal: 800, interest: 200, balance: 5000 },
      { month: 2, emi: 1000, principal: 820, interest: 180, balance: 4180 },
    ];

    const columns = [
      { header: "Month", key: "month" as const, format: "number" as const },
      { header: "EMI", key: "emi" as const, format: "currency" as const },
      { header: "Principal", key: "principal" as const, format: "currency" as const, color: "FFD1FAE5" },
      { header: "Interest", key: "interest" as const, format: "currency" as const, color: "FFFEE2E2" },
    ];

    it("should create a workbook with correctly formatted headers", () => {
      const workbook = generateWorkbook("Schedule", data, columns);
      const worksheet = workbook.getWorksheet("Schedule");

      expect(worksheet).toBeDefined();
      const headerRow = worksheet!.getRow(1);
      
      expect(headerRow.getCell(1).value).toBe("Month");
      expect(headerRow.getCell(2).value).toBe("EMI");
      
      // Header styling check
      expect(headerRow.font?.bold).toBe(true);
      expect((headerRow.fill as any).fgColor?.argb).toBe("FF1E3A8A");
    });

    it("should apply correct number formats to columns", () => {
      const workbook = generateWorkbook("Schedule", data, columns);
      const worksheet = workbook.getWorksheet("Schedule");

      expect(worksheet).toBeDefined();
      expect(worksheet!.getColumn(1).numFmt).toBe("#,##0.00"); // number
      expect(worksheet!.getColumn(2).numFmt).toBe("₹#,##0.00"); // currency
    });

    it("should apply specific color coding to columns", () => {
      const workbook = generateWorkbook("Schedule", data, columns);
      const worksheet = workbook.getWorksheet("Schedule");

      expect(worksheet).toBeDefined();
      // Principal column (index 3) should have green tint
      const principalCell = worksheet!.getRow(2).getCell(3);
      expect((principalCell.fill as any).fgColor?.argb).toBe("FFD1FAE5");

      // Interest column (index 4) should have red tint
      const interestCell = worksheet!.getRow(2).getCell(4);
      expect((interestCell.fill as any).fgColor?.argb).toBe("FFFEE2E2");
    });

    it("should apply alternating row colors to non-colored columns", () => {
      const workbook = generateWorkbook("Schedule", data, columns);
      const worksheet = workbook.getWorksheet("Schedule");

      expect(worksheet).toBeDefined();
      // Row 2 is index 0 (even), so it should have alternating color
      // But only for columns 1 and 2 (Month, EMI)
      const monthCell = worksheet!.getRow(2).getCell(1);
      expect((monthCell.fill as any).fgColor?.argb).toBe("FFF3F4F6");

      // Column 3 has its own color, so it shouldn't be overwritten by alternating row color
      const principalCell = worksheet!.getRow(2).getCell(3);
      expect((principalCell.fill as any).fgColor?.argb).toBe("FFD1FAE5");
    });
  });

  describe("exportToExcel", () => {
    let createObjectURLMock: any;
    let revokeObjectURLMock: any;
    let appendChildMock: any;
    let removeChildMock: any;

    beforeEach(() => {
      createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url");
      revokeObjectURLMock = vi.fn();
      
      // Polyfill URL methods for jsdom
      window.URL.createObjectURL = createObjectURLMock;
      window.URL.revokeObjectURL = revokeObjectURLMock;

      appendChildMock = vi.spyOn(document.body, "appendChild").mockImplementation(() => undefined);
      removeChildMock = vi.spyOn(document.body, "removeChild").mockImplementation(() => undefined);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should generate a workbook, create an object URL, and trigger a download", async () => {
      const data = [
        { month: 1, emi: 1000, interest: 200, balance: 5000 },
        { month: 2, emi: 1000, interest: 180, balance: 4180 },
      ];

      const columns = [
        { header: "Month", key: "month", format: "number" as const },
        { header: "EMI", key: "emi", format: "currency" as const },
      ];

      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      };

      const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tagName) => {
        if (tagName === "a") return mockAnchor as any;
        // Have to return a real element for other tags just in case
        const el = document.createElement.getMockImplementation()?.(tagName);
        return el;
      });

      await exportToExcel("Test_Export", "Schedule", data, columns);

      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
      expect(createObjectURLMock.mock.calls[0][0]).toBeInstanceOf(Blob);
      
      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockAnchor.href).toBe("blob:mock-url");
      expect(mockAnchor.download).toBe("Test_Export.xlsx");
      expect(appendChildMock).toHaveBeenCalledWith(mockAnchor);
      expect(mockAnchor.click).toHaveBeenCalledTimes(1);
      expect(removeChildMock).toHaveBeenCalledWith(mockAnchor);
      expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
    });
  });
});
