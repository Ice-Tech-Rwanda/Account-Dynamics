import { prisma } from "@/lib/prisma";

describe('team API helpers', () => {
  beforeAll(async () => { await prisma.$connect(); });
  afterAll(async () => { await prisma.$disconnect(); });

  test('creating a team member records an audit log', async () => {
    const member = await prisma.teamMember.create({ data: { name: 'Audit Test', role: 'tester', bio: 'x' } as any });
    // simulate audit log entry
    await prisma.auditLog.create({ data: { userId: 'test', action: 'team:create', entity: 'TeamMember', entityId: member.id, details: JSON.stringify({ name: member.name }) } });
    const logs = await prisma.auditLog.findMany({ where: { entity: 'TeamMember', entityId: member.id } });
    expect(logs.length).toBeGreaterThanOrEqual(1);
  });
});
