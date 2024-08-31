import { GoogleAIFileManager } from "@google/generative-ai/server"
import fs from 'fs';
import path from 'path';

async function salvaImageTemp(image: string){
  const key: string = process.env.GEMINI_API_KEY || ""
  const fileManager: GoogleAIFileManager = new GoogleAIFileManager(key)
  
  const base64Data = image.replace(/^data:image\/png;base64,/, "")
  const pathImage = path.join(__dirname, "teste.png")

  fs.writeFileSync(pathImage, base64Data, 'base64')

  const uploadResponse = await fileManager.uploadFile(pathImage, {
    mimeType: "image/png",
    displayName: "Jetpack drawing",
  })
  
  return uploadResponse
}

export default salvaImageTemp