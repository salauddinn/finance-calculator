export type HraResult = {
  hraExemption: number;
  taxableHra: number;
  actualHraReceived: number;
  rentMinusBasic: number;
  cityBasedLimit: number;
  limitingFactor: "hra_received" | "rent_minus_basic" | "city_limit";
};

export function calculateHra({
  basicSalary,
  daAmount = 0,
  hraReceived,
  monthlyRentPaid,
  isMetroCity,
}: {
  basicSalary: number;
  daAmount?: number;
  hraReceived: number;
  monthlyRentPaid: number;
  isMetroCity: boolean;
}): HraResult {
  const basicPlusDa = basicSalary + daAmount;
  const annualBasicPlusDa = basicPlusDa * 12;
  const annualHraReceived = hraReceived * 12;
  const annualRentPaid = monthlyRentPaid * 12;

  // Rule 1: Actual HRA received
  const rule1 = annualHraReceived;

  // Rule 2: Actual rent paid – 10% of (Basic + DA)
  const rule2 = Math.max(0, annualRentPaid - 0.1 * annualBasicPlusDa);

  // Rule 3: 50% of (Basic + DA) for metro, 40% for non-metro
  const rule3 = (isMetroCity ? 0.5 : 0.4) * annualBasicPlusDa;

  const hraExemption = Math.min(rule1, rule2, rule3);
  const taxableHra = Math.max(0, annualHraReceived - hraExemption);

  let limitingFactor: HraResult["limitingFactor"];
  const minVal = Math.min(rule1, rule2, rule3);
  if (minVal === rule1) limitingFactor = "hra_received";
  else if (minVal === rule2) limitingFactor = "rent_minus_basic";
  else limitingFactor = "city_limit";

  return {
    hraExemption: Math.round(hraExemption),
    taxableHra: Math.round(taxableHra),
    actualHraReceived: Math.round(annualHraReceived),
    rentMinusBasic: Math.round(rule2),
    cityBasedLimit: Math.round(rule3),
    limitingFactor,
  };
}
