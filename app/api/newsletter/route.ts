import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'

export const runtime = 'edge'

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validated = newsletterSchema.parse(body)
    const db = await getDb()
    
    // Check if already subscribed
    const existing = await db.prepare(
      'SELECT id, subscribed FROM newsletter WHERE email = ?'
    ).bind(validated.email).first()
    
    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 200 }
        )
      } else {
        // Resubscribe
        await db.prepare(
          'UPDATE newsletter SET subscribed = 1, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
        ).bind(validated.email).run()
      }
    } else {
      // New subscription
      await db.prepare(
        'INSERT INTO newsletter (id, email, subscribed, created_at, updated_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      ).bind(
        crypto.randomUUID(),
        validated.email
      ).run()
    }

    // TODO: Send welcome email
    // await sendWelcomeEmail(validated.email)

    return NextResponse.json(
      { message: 'Successfully subscribed' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}