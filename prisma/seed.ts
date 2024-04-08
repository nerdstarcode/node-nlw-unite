import { PrismaClient } from '@prisma/client'
async function seed() {
  const eventId = "af7c1fe6-d669-414e-b066-e9733f0de7a8"
  const prisma = new PrismaClient()
  await prisma.event.create({
    data: {
      "id": eventId,
      "title": "Sample Title",
      "slug": "sample_title",
      "details": "Um Evento para quem é apaixonado por programação",
      "maximumAttendees": 100
    }
  })
  seed().then(() => {
    console.log("Database seeder!")
    prisma.$disconnect()
  })
}