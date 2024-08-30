import { Request, Response, NextFunction } from 'express'
import { MeasureType } from '../enum/enumMeasureType'
import { validate } from 'uuid';

class validateType {
    private static isBase64(image: string): boolean {
        const base64Regex = /^([A-Za-z0-9+/=]\s*)*$/
        return base64Regex.test(image) && (image.length % 4 === 0)
    }

    public static validateCadatro(req: Request, res: Response, next: NextFunction): void {
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

        if (!req.body.measure_datatime || isNaN(Date.parse(req.body.measure_datatime))) {
            res.status(400).json({
                error_code: "INVALID_DATA", 
                error_description: "O campo tem que receber uma data valida "   
            })
        }

        next()
    }

    public static validateUpdate(req: Request, res: Response, next: NextFunction): void {
        const body = req.body

        if (typeof body.confirm_value !== 'string' || body.confirm_value.trim() === '') {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O valor não pode estar em branco"
            })
        }

        if (typeof body.measure_uuid !== 'string' || !validate(body.measure_uuid)) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O id da medição deve ser um UUID valido"
            })
        }

        next()
    }
}

export default validateType