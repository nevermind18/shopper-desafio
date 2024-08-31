import { GoogleGenerativeAI } from "@google/generative-ai"
import salvaImageTemp from "./salvaImageTemp"

async function detectText(fileName: string): Promise<Object> {

  const key = process.env.GEMINI_API_KEY || ""
  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
  })
  
  let upload = await salvaImageTemp(fileName)

  try{
  const result = await model.generateContent([
      {
        fileData: {
          mimeType: upload.file.mimeType,
          fileUri: upload.file.uri
        }
      },
      { text: "which measurement is being marked on the screen?" },
    ])
  
    return { measure_value: result.response.text().replace(/[^0-9\s]/g, '').trim(), image_url: upload.file.uri}
  } catch(error){
    console.log(error)
    return {}
  }
}

export default detectText