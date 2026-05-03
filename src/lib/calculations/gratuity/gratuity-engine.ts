export const GRATUITY_TAX_FREE_LIMIT = 2_000_000; // ₹20 lakh
export const GRATUITY_MIN_YEARS = 5;

export interface GratuityInput {
  lastSalary: number;
  yearsOfService: number;
  taxFreeLimit?: number;
}

export interface GratuityResult {
  gratuity: number;
  taxFree: number;
  taxable: number;
  eligible: boolean;
}

export function calculateGratuity({
  lastSalary,
  yearsOfService,
  taxFreeLimit = GRATUITY_TAX_FREE_LIMIT,
}: GratuityInput): GratuityResult {
  const gratuity = (lastSalary * 15 * yearsOfService) / 26;
  const taxFree = Math.min(gratuity, taxFreeLimit);
  const taxable = Math.max(0, gratuity - taxFreeLimit);
  const eligible = yearsOfService >= GRATUITY_MIN_YEARS;
  return { gratuity, taxFree, taxable, eligible };
}
