const { PrismaClient } = require('@prisma/client')
const { generateSalt, hashPassword } = require("../src/util/password.util")

const prisma = new PrismaClient()

const userData = [
  {
    name: 'Alice',
    email: 'alice@gmail.com',
    password: "1234",
    posts: {
      create: [
        {
          title: 'Check this out',
          content: 'https://fastly.picsum.photos/id/301/200/300.jpg?hmac=J1lB0L-QDteqCpkHkYdHQBz6JYeppA2L1Y_8LRGLVfY',
          published: true,
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const { salt, hashedPassword } = hashPassword(u.password, generateSalt())
    u.salt = salt
    u.hashedPassword = hashedPassword
    delete u.password
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
