import { GoogleGenerativeAI } from "@google/generative-ai"
import salvaImageTemp from "./salvaImageTemp"

async function detectText(fileName: string) {

    const key = process.env.GEMINI_API_KEY || ""
    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
    })
    
    return salvaImageTemp(fileName).then(async (upload) => {

        const result = await model.generateContent([
            {
              fileData: {
                mimeType: upload.file.mimeType,
                fileUri: upload.file.uri
              }
            },
            { text: "which measurement is being marked on the screen?" },
          ])
        // Output the generated text to the console
        return { measure_value: result.response.text().replace(/[^0-9\s]/g, '').trim(), image_url: upload.file.uri}
    })
}

export default detectText