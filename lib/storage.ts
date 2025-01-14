export async function saveToDrawIO(fileName: string, content: string) {
  try {
    // Create a URL that will open diagrams.net with the backup data
    const jsonString = encodeURIComponent(content)
    const drawioUrl = `https://app.diagrams.net/?create=https://raw.githubusercontent.com/${jsonString}&title=${fileName}`
    
    return drawioUrl
  } catch (error) {
    console.error('Storage save failed:', error)
    throw error
  }
} 