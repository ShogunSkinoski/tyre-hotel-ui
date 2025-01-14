import { NextResponse } from 'next/server'
import { oauth2Client, uploadToDrive } from '@/lib/google-drive'

export async function POST(request: Request) {
  try {
    const { code, fileName, content } = await request.json()

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    // Upload to Google Drive
    const result = await uploadToDrive(fileName, content, tokens.access_token)
    return NextResponse.json({ success: true, fileId: result.id })
  } catch (error) {
    console.error('Google Drive upload failed:', error)
    return NextResponse.json(
      { error: 'Failed to upload to Google Drive' }, 
      { status: 500 }
    )
  }
}

// Add this to handle the initial OAuth redirect
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/backup?error=No authorization code', request.url))
  }

  // Use absolute URL for redirect
  const callbackUrl = new URL('/auth/callback/google', request.url)
  console.log(callbackUrl)
  callbackUrl.searchParams.set('code', code)
  
  return NextResponse.redirect(callbackUrl)
} 