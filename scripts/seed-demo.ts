import { PrismaClient } from "@prisma/client"
import { DEMO_CREATORS, cover, avatar } from "../lib/landing-data"

const db = new PrismaClient()

async function main() {
  for (const c of DEMO_CREATORS) {
    const user = await db.user.upsert({
      where: { handle: c.handle },
      update: {
        brandName: c.brandName,
        avatar: avatar(c.handle),
        accentColor: c.accentColor,
        bio: c.bio,
        socials: c.socials,
      },
      create: {
        email: `${c.handle}@demo.drop`,
        handle: c.handle,
        brandName: c.brandName,
        avatar: avatar(c.handle),
        accentColor: c.accentColor,
        bio: c.bio,
        socials: c.socials,
        plan: "PRO",
      },
    })

    for (const d of c.drops) {
      await db.drop.upsert({
        where: { slug: d.slug },
        update: {
          title: d.title,
          description: d.description,
          price: d.price,
          stock: d.stock,
          status: d.status,
          coverImage: cover(d.slug),
          launchAt: new Date(Date.now() + d.launchOffsetHours * 3600 * 1000),
        },
        create: {
          userId: user.id,
          slug: d.slug,
          title: d.title,
          description: d.description,
          price: d.price,
          stock: d.stock,
          status: d.status,
          coverImage: cover(d.slug),
          launchAt: new Date(Date.now() + d.launchOffsetHours * 3600 * 1000),
        },
      })
    }
    console.log(`✓ ${c.brandName} (@${c.handle}) — ${c.drops.length} drop(s)`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
