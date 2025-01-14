import { google } from 'googleapis'
import fs from 'fs'

const SCOPES = ['https://www.googleapis.com/auth/drive.file']

export const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/callback/google'
)

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
}

export async function uploadToDrive(fileName: string, content: string, accessToken: string) {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })
    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    const fileMetadata = {
      name: fileName,
      mimeType: 'application/json',
    }

    const media = {
      mimeType: 'application/json',
      body: content,
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    })

    return response.data
  } catch (error) {
    console.error('Drive upload failed:', error)
    throw error
  }
}

export async function getBackupContent(fileId: string, accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const response = await drive.files.get({
    fileId: fileId,
    alt: 'media'
  })

  return response.data
} 