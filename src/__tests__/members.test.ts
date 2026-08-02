import { maskMemberPII, generateMembersCsv } from "@/lib/services/members";

describe("members service", () => {
  test("maskMemberPII hides email and phone when inactive or hideEmail flag", () => {
    const m = { id: "1", name: "Bob", email: "b@x.com", phone: "123", status: "inactive" } as any;
    const masked = maskMemberPII(m as any);
    expect(masked.email).toBeNull();
    expect(masked.phone).toBeNull();

    const m2 = { id: "2", name: "Alice", email: "a@x.com", phone: "321", status: "active" } as any;
    const masked2 = maskMemberPII(m2 as any, true);
    expect(masked2.email).toBeNull();
    expect(masked2.phone).toBe("321");
  });

  test("generateMembersCsv returns CSV with headers and rows", () => {
    const items = [
      { id: "1", name: "A", email: "a@x.com", phone: "", category: "individual", status: "active", createdAt: new Date("2020-01-01") },
      { id: "2", name: "B", email: "b@x.com", phone: "123", category: "student", status: "active", createdAt: new Date("2020-02-01") },
    ] as any;
    const csv = generateMembersCsv(items);
    expect(csv).toContain("id,name,email,phone,category,status,createdAt");
    expect(csv.split("\n").length).toBeGreaterThanOrEqual(3);
  });
});
