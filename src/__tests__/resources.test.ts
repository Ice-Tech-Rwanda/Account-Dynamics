import { prisma } from "@/lib/prisma";
import { validateUploadMeta, paginateResources } from "@/lib/services/resources";

describe('resources service', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('validate upload meta rejects bad extension and size', () => {
    const badExt = validateUploadMeta('file.exe', 1000);
    expect(badExt.ok).toBeFalsy();
    const tooLarge = validateUploadMeta('file.pdf', Number(process.env.RESOURCE_MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024) + 1);
    expect(tooLarge.ok).toBeFalsy();
  });

  test('pagination returns structure', async () => {
    const res = await paginateResources(1, 5);
    expect(res).toHaveProperty('items');
    expect(res).toHaveProperty('total');
  });
});
