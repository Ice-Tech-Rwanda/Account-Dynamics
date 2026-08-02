import { generateSignedToken, verifySignedToken } from "@/lib/uploads/signer";

describe("upload signer", () => {
  test("generate and verify valid token", () => {
    const filename = "test-image.jpg";
    const token = generateSignedToken(filename, 60);
    expect(typeof token).toBe("string");
    expect(verifySignedToken(filename, token)).toBe(true);
  });

  test("expired token fails verification", () => {
    const filename = "old.jpg";
    const token = generateSignedToken(filename, -10); // already expired
    expect(verifySignedToken(filename, token)).toBe(false);
  });
});
