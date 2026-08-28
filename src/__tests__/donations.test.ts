import { calculateTotals, maskDonor } from "@/lib/services/donations";

describe("donations service", () => {
  test("calculateTotals sums only completed donations", () => {
    const items = [
      { id: "1", amount: 1000, status: "completed", anonymous: false } as any,
      { id: "2", amount: 500, status: "pending", anonymous: false } as any,
      { id: "3", amount: 2500, status: "completed", anonymous: false } as any,
    ];
    const result = calculateTotals(items);
    expect(result.total).toBe(3500);
    expect(result.count).toBe(2);
  });

  test("maskDonor removes PII for anonymous donations", () => {
    const d = { id: "1", donorName: "Alice", donorEmail: "a@x.com", anonymous: true } as any;
    const masked = maskDonor(d);
    expect(masked.donorName).toBeNull();
    expect(masked.donorEmail).toBeNull();
  });
});
