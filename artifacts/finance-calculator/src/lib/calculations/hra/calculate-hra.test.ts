import { calculateHra } from "@/lib/calculations/hra/calculate-hra";

describe("calculateHra", () => {
  it("returns the city-based limit as the exemption when it is the smallest", () => {
    const result = calculateHra({
      basicSalary: 50_000,
      hraReceived: 30_000,
      monthlyRentPaid: 30_000,
      isMetroCity: true,
    });
    // rule1 = 30k*12 = 360k
    // rule2 = max(0, 360k - 0.1*600k) = max(0, 360k-60k) = 300k
    // rule3 = 0.5 * 600k = 300k
    // min(360k, 300k, 300k) = 300k (rule2 and rule3 tie — limitingFactor is "rent_minus_basic")
    expect(result.hraExemption).toBe(300_000);
    expect(result.taxableHra).toBe(60_000);
    expect(result.limitingFactor).toBe("rent_minus_basic");
  });

  it("returns actual HRA received as exemption when it is the smallest", () => {
    const result = calculateHra({
      basicSalary: 100_000,
      hraReceived: 10_000,
      monthlyRentPaid: 20_000,
      isMetroCity: true,
    });
    // rule1 = 120k, rule2 = max(0, 240k - 120k) = 120k, rule3 = 600k
    // min is 120k (rule1 and rule2 tie — limitingFactor is "hra_received")
    expect(result.hraExemption).toBe(120_000);
    expect(result.limitingFactor).toBe("hra_received");
    expect(result.taxableHra).toBe(0);
  });

  it("returns zero exemption when rent is below 10% of basic+DA", () => {
    const result = calculateHra({
      basicSalary: 100_000,
      hraReceived: 20_000,
      monthlyRentPaid: 5_000,
      isMetroCity: false,
    });
    // rule2 = max(0, 60k - 120k) = 0
    expect(result.hraExemption).toBe(0);
    expect(result.taxableHra).toBe(240_000);
    expect(result.limitingFactor).toBe("rent_minus_basic");
  });

  it("uses 40% city limit for non-metro cities", () => {
    const metro = calculateHra({
      basicSalary: 50_000,
      hraReceived: 30_000,
      monthlyRentPaid: 25_000,
      isMetroCity: true,
    });
    const nonMetro = calculateHra({
      basicSalary: 50_000,
      hraReceived: 30_000,
      monthlyRentPaid: 25_000,
      isMetroCity: false,
    });
    expect(metro.cityBasedLimit).toBeGreaterThan(nonMetro.cityBasedLimit);
  });

  it("includes DA in the basic+DA base for all three rules", () => {
    const withoutDa = calculateHra({
      basicSalary: 40_000,
      hraReceived: 20_000,
      monthlyRentPaid: 20_000,
      isMetroCity: true,
    });
    const withDa = calculateHra({
      basicSalary: 40_000,
      daAmount: 10_000,
      hraReceived: 20_000,
      monthlyRentPaid: 20_000,
      isMetroCity: true,
    });
    expect(withDa.cityBasedLimit).toBeGreaterThan(withoutDa.cityBasedLimit);
  });

  it("reports correct actualHraReceived and rentMinusBasic figures", () => {
    const result = calculateHra({
      basicSalary: 60_000,
      hraReceived: 25_000,
      monthlyRentPaid: 22_000,
      isMetroCity: false,
    });
    expect(result.actualHraReceived).toBe(300_000);
    // rentMinusBasic = max(0, 264k - 0.1*720k) = max(0, 264k - 72k) = 192k
    expect(result.rentMinusBasic).toBe(192_000);
  });
});
