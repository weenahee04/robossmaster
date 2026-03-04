const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.branch.findMany({ select: { slug: true, name: true } }).then(b => {
  console.log(JSON.stringify(b));
  p.$disconnect();
});
