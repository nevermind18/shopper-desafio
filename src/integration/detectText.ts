import { ImageAnnotatorClient } from '@google-cloud/vision';

// Cria um cliente
const client = new ImageAnnotatorClient();

async function detectText(fileName: string): Promise<String | void> {

    const request = {
        image: {
            content: fileName
        }
    };

    try {
        const [result] = await client.textDetection(request);
        const detections = result.textAnnotations;
        if (detections) {
            for(let i:number = 1; i < detections.length; i++){
                const description = detections[i].description ?? ''
                if(/^\d+$/.test(description)){
                    return description
                }
            }
        }
        console.log('Nenhum texto detectado.');
        
    } catch (error) {
        console.error('Erro ao detectar texto:', error);
    }
}

export default detectText;