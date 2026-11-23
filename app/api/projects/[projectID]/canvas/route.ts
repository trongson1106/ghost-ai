import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'
import { getIdentity, getProjectAccess } from '@/lib/project-access'
import type { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectID: string }> },
) {
  const identity = await getIdentity()
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectID } = await params
  const project = await getProjectAccess(projectID, identity.userId, identity.email)
  if (!project) return Response.json({ error: 'Not Found' }, { status: 404 })

  const row = await prisma.project.findUnique({ where: { id: projectID }, select: { canvasUrl: true } })
  if (!row?.canvasUrl) return Response.json({ nodes: [], edges: [] })

  const res = await fetch(row.canvasUrl)
  if (!res.ok) return Response.json({ nodes: [], edges: [] })
  const data = await res.json()
  return Response.json(data)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectID: string }> },
) {
  const identity = await getIdentity()
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectID } = await params
  const project = await getProjectAccess(projectID, identity.userId, identity.email)
  if (!project) return Response.json({ error: 'Not Found' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body) return Response.json({ error: 'Invalid body' }, { status: 400 })

  const blob = await put(`canvas/${projectID}.json`, JSON.stringify(body), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true
  })

  await prisma.project.update({
    where: { id: projectID },
    data: { canvasUrl: blob.url },
  })

  return Response.json({ url: blob.url })
}
