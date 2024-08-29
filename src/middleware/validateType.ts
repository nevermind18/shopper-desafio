import { Request, Response, NextFunction } from 'express'
import { MeasureType } from '../enum/enumMeasureType'

class validateType {
    private static isBase64(image: string): boolean {
        const base64Regex = /^([A-Za-z0-9+/=]\s*)*$/
        return base64Regex.test(image) && (image.length % 4 === 0)
    }

    public static validate(req: Request, res: Response, next: NextFunction): void {
        const body = req.body

        if (!(typeof body.image === 'string' && validateType.isBase64(body.image))) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O campo 'image' deve ser um valor válido codificado em Base64."
            })
        }

        if (!(body.measure_type.toLowerCase() === MeasureType.GAS || body.measure_type.toLowerCase() === MeasureType.WATER)) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O tipo deve ser GAS ou WATER"
            })
        }

        if (typeof body.customer_code !== 'string' || body.customer_code.trim() === ''){
            res.status(400).json({
                error_code: "INVALID_DATA", 
                error_description: "O código do cliente não pode estar em branco"
            })
        }

        next()
    }
}

export default validateType