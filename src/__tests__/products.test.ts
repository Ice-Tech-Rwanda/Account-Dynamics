import { prisma } from "@/lib/prisma";
import { validateProductInput, createProduct, updateProduct, generateProductImageToken } from "@/lib/services/products";

describe('products service', () => {
  beforeAll(async () => { await prisma.$connect(); });
  afterAll(async () => { await prisma.$disconnect(); });

  test('validation rejects negative price/stock', async () => {
    const bad = await validateProductInput({ name: 'x', price: -5, stock: -1 });
    expect(bad.ok).toBe(false);
  });

  test('create and update product', async () => {
    const input = { name: `P-${Date.now()}`, price: 9.99, stock: 10 };
    const res = await createProduct(input as any, 'test');
    expect(res.ok).toBeTruthy();
    const prod = res.product;
    const up = await updateProduct(prod.id, { price: 19.99, stock: 5 } as any, 'test');
    expect(up.ok).toBeTruthy();
  });

  test('generate image token format', () => {
    const token = generateProductImageToken('picture.png', 60);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(2);
  });
});
