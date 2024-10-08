import { Request, Response, NextFunction } from 'express'
import { MeasureType } from '../enum/enumMeasureType'
import { validate } from 'uuid';

class validateType {
    private static isBase64(image: string): boolean {
        const base64Regex = /^([A-Za-z0-9+/=]\s*)*$/
        return base64Regex.test(image) && (image.length % 4 === 0)
    }

    public static validateCadatro(req: Request, res: Response, next: NextFunction) {
        const body = req.body

        if (!(typeof body.image === 'string' && validateType.isBase64(body.image))) {
            return res.status(400).json({
                errorInterface: "INVALID_DATA",
                error_description: "O campo 'image' deve ser um valor válido codificado em Base64."
            })
        }

        if (typeof body.measure_type !== 'string' || (body.measure_type.toLowerCase() !== MeasureType.GAS && body.measure_type.toLowerCase() !== MeasureType.WATER)) {

            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O tipo deve ser GAS ou WATER"
            })
        }

        if (typeof body.customer_code !== 'string' || body.customer_code.trim() === ''){
            return res.status(400).json({
                error_code: "INVALID_DATA", 
                error_description: "O código do cliente não pode estar em branco"
            })
        }

        if (!req.body.measure_datatime || isNaN(Date.parse(req.body.measure_datatime))) {
            return res.status(400).json({
                error_code: "INVALID_DATA", 
                error_description: "O campo tem que receber uma data valida "   
            })
        }

        next()
    }

    public static validateUpdate(req: Request, res: Response, next: NextFunction) {
        const body = req.body

        if (typeof body.confirm_value !== 'number' || body.confirm_value < 0) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O valor tem que ser numerico e maior igual a 0"
            })
        }

        if (typeof body.measure_uuid !== 'string' || !validate(body.measure_uuid)) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O id da medição deve ser um UUID valido"
            })
        }

        next()
    }

    public static validateList(req: Request, res: Response, next: NextFunction) {
        const measure_type:any  = req.query.measure_type
        
        if (measure_type !== undefined && measure_type.toLowerCase() !== MeasureType.GAS && measure_type.toLowerCase() !== MeasureType.WATER) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Tipo de medição não permitida"
            });
        }

        if (typeof req.params.customer_code  !== 'string' || req.params.customer_code.trim() === ''){
            return res.status(400).json({
                error_code: "INVALID_DATA", 
                error_description: "O código do cliente não pode estar em branco"
            })
        }

        next()
    }
}

export default validateType