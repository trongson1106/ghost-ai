import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectID: string }> },
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectID } = await params

  const project = await prisma.project.findUnique({ where: { id: projectID } })
  if (!project) {
    return Response.json({ error: 'Not Found' }, { status: 404 })
  }
  if (project.ownerId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const updated = await prisma.project.update({
    where: { id: projectID },
    data: { name },
  })

  return Response.json({ project: updated })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ projectID: string }> },
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectID } = await params

  const project = await prisma.project.findUnique({ where: { id: projectID } })
  if (!project) {
    return Response.json({ error: 'Not Found' }, { status: 404 })
  }
  if (project.ownerId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.project.delete({ where: { id: projectID } })

  return Response.json({ success: true })
}
