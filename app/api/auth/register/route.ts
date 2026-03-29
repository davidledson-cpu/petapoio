import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, type DemoUser } from '@/lib/auth/demo-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, role, petName, petSpecies, lossType, lossTime, moodScore,
      phone, crpNumber, specialties, bio, shortBio, sessionPrice, sessionDuration, languages,
      crpDocument, approachDescription, cancellationPolicy } = body

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, e-mail e senha são obrigatórios.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter ao menos 8 caracteres.' },
        { status: 400 }
      )
    }

    // Create the new user object
    const newUser: DemoUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: email.toLowerCase().trim(),
      name: fullName.trim(),
      role: role || 'patient',
      createdAt: new Date().toISOString().split('T')[0],
    }

    // Set session cookie (same as login)
    const response = NextResponse.json({
      success: true,
      user: newUser,
      redirectTo: newUser.role === 'professional'
        ? '/dashboard/profissional'
        : '/dashboard/paciente',
    })

    response.cookies.set(SESSION_COOKIE, JSON.stringify(newUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Also notify admin (fire-and-forget)
    try {
      const adminPayload: Record<string, unknown> = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
      if (role === 'patient' && petName) {
        adminPayload.petName = petName
        adminPayload.petSpecies = petSpecies
        adminPayload.lossType = lossType
        adminPayload.lossTime = lossTime
        adminPayload.moodScore = moodScore
      }
      if (role === 'professional') {
        adminPayload.phone = phone
        adminPayload.crpNumber = crpNumber
        adminPayload.specialties = specialties
        adminPayload.bio = bio
        adminPayload.shortBio = shortBio
        adminPayload.sessionPrice = sessionPrice
        adminPayload.sessionDuration = sessionDuration
        adminPayload.languages = languages
        adminPayload.crpDocument = crpDocument
        adminPayload.approachDescription = approachDescription
        adminPayload.cancellationPolicy = cancellationPolicy
      }

      const baseUrl = request.nextUrl.origin
      fetch(`${baseUrl}/api/notify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminPayload),
      }).catch(() => {})
    } catch {}

    return response
  } catch {
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 }
    )
  }
}

