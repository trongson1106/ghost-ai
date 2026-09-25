import { prisma } from '@/lib/prisma'

export async function getOwnedProjects(userId: string) {
  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })
}

export async function getSharedProjects(userEmail: string) {
  return prisma.project.findMany({
    where: { collaborators: { some: { email: userEmail } } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })
}
