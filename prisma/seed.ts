import { PrismaClient } from "@prisma/client";
import { companies, salarySubmissions } from "../src/lib/mock-data";
import { normalizeCompanyName } from "../src/lib/compensation";

const prisma = new PrismaClient();

function normalizedKey(row: (typeof salarySubmissions)[number]) {
  return [
    normalizeCompanyName(row.company),
    row.role.toLowerCase(),
    row.level.toLowerCase(),
    row.location.toLowerCase(),
    row.currency,
    row.totalComp,
  ].join("|");
}

async function main() {
  await prisma.salarySubmission.deleteMany();
  await prisma.company.deleteMany();

  const companyIdBySlug = new Map<string, string>();

  for (const company of companies) {
    const created = await prisma.company.create({
      data: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        market: company.market,
        headquarters: company.headquarters,
        description: company.description,
      },
    });
    companyIdBySlug.set(created.slug, created.id);
  }

  for (const row of salarySubmissions) {
    const companyId = companyIdBySlug.get(row.companySlug);
    if (!companyId) throw new Error("Missing company for " + row.company);

    await prisma.salarySubmission.create({
      data: {
        id: row.id,
        companyId,
        role: row.role,
        level: row.level,
        levelRank: row.levelRank,
        location: row.location,
        market: row.market,
        currency: row.currency,
        base: row.base,
        bonus: row.bonus,
        stock: row.stock,
        totalComp: row.totalComp,
        totalCompUsd: row.totalCompUsd,
        yearsExperience: row.yearsExperience,
        submittedAt: new Date(row.submittedAt),
        verified: row.verified,
        normalizedKey: normalizedKey(row),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
