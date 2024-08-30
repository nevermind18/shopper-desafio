import { Request, Response, NextFunction } from 'express'
import { IMedicao, medicao } from '../model/medicao'
import detectText from '../integration/detectText'

class MedicaoController {

    static async cadastarMedicao(req: Request, res: Response, next: NextFunction) {  
        try {
            const { customer_code, measure_type, measure_datatime } = req.body;  
            const pipeline = [
                {
                    $match: {
                        customer_code: customer_code,
                        measure_type: measure_type.toLowerCase(),
                        measure_datatime: {
                            $gte: new Date(new Date(measure_datatime).getFullYear(), new Date(measure_datatime).getMonth(), 1),
                            $lte: new Date(new Date(measure_datatime).getFullYear(), new Date(measure_datatime).getMonth() + 1, 0, 23, 59, 59, 999)
                        }
                    }
                }
            ];
            const medicaoEncontrada = await medicao.aggregate(pipeline).exec();
            if(medicaoEncontrada.length === 0){
                detectText(req.body.image).then(async (measure) => {
                    const medicaoCadastrar:IMedicao = await medicao.create(
                        {...req.body,
                            measure_type: req.body.measure_type.toLowerCase(),
                            ...measure,
                            has_confirmed: false
                        })

                    return res.status(201).json({
                        image_url: medicaoCadastrar.image_url,
                        measure_value: medicaoCadastrar.measure_value,
                        measure_uuid: medicaoCadastrar.measure_uuid
                    })
                }).catch((error) => {
                    next(error)
                });
            } else {
                return res.status(409).json({
                    error_code: "DOUBLE_REPORT",
                    error_description: "Leitura do mês já realizada"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async listarMedicoesPorCliente(req: Request, res: Response, next: NextFunction){
        try{
            const query: any = { customer_code: req.params.customer_code };

            if (req.query.measure_type) {
                query.measure_type = req.query.measure_type;
            }
            const medicaoEncontrada = await medicao.find(query)

            let responseData:any = [];
    
            medicaoEncontrada.forEach((medicao: IMedicao) => {
                responseData.push({
                    measure_value: medicao.measure_value,
                    measure_uuid: medicao.measure_uuid,
                    image_url: medicao.image_url,
                    has_confirmed: medicao.has_confirmed,
                    measure_datatime: medicao.measure_datatime,
                });
            });

            if(medicaoEncontrada.length !== 0){
                return res.status(200).json({
                    custumer_code: req.params.customer_code,
                    measures:responseData
                    
                })
            } else{
                return res.status(404).json({
                    error_code: "MEASURE_NOT_FOUND",
                    error_description: "Nenhuma leitura encontrada"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async confirmMedicao(req: Request, res: Response, next: NextFunction){
        try{
            var medicaoEncontrada = await medicao.findOne({ measure_uuid: req.body.measure_uuid})

            if (medicaoEncontrada !== null) {
                    if(!medicaoEncontrada.has_confirmed){
                    medicaoEncontrada.measure_value = req.body.confirm_value
                    medicaoEncontrada.has_confirmed = true
                    await medicaoEncontrada.save();

                    return res.status(200).json({
                        success: true
                    })
                }

                return res.status(409).json({
                    error_code: "CONFIRMATION_DUPLICATE",
                    error_description: "Leitura já confirmada"
                })
            }

            return res.status(404).json({
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada"
            })
        } catch (error) {
            next(error)
        }
    }
}

export default MedicaoController