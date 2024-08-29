import { Request, Response, NextFunction } from 'express'
import { IMedicao, medicao } from '../model/medicao'
import detectText from '../integration/detectText'

class MedicaoController {
    static async cadastarMedicao(req: Request, res: Response): Promise<void> {      
        const { customer_code, measure_type, measure_datatime } = req.body;  
        const pipeline = [
            {
                $match: {
                    customer_code: customer_code,
                    measure_type: measure_type,
                    measure_datatime: {
                        $gte: new Date(new Date(measure_datatime).getFullYear(), new Date(measure_datatime).getMonth(), 1),
                        $lte: new Date(new Date(measure_datatime).getFullYear(), new Date(measure_datatime).getMonth() + 1, 0, 23, 59, 59, 999)
                    }
                }
            }
        ];
        try {
            const medicaoEncontrada = await medicao.aggregate(pipeline).exec();
            console.log(medicaoEncontrada.length)
            if(medicaoEncontrada.length === 0){
                detectText(req.body.image).then(async (measure_value) => {
                    const medicaoCadastrar:IMedicao = await medicao.create(
                        {...req.body,
                            image_url: req.body.image,
                            measure_value,
                            has_confirmed: false
                        })

                    res.status(201).json({
                        image_url: medicaoCadastrar.image_url,
                        measure_value: medicaoCadastrar.measure_value,
                        measure_uuid: medicaoCadastrar.measure_uuid
                    })
                }).catch((error) => {
                    console.error('Erro ao executar a detecção:', error)
                });
            } else {
                res.status(409).json({
                    error_code: "CONFIRMATION_DUPLICATE",
                    error_description: "Leitura do mês já realizada"
                })
            }
        } catch (error) {
            console.error('Erro ao buscar a medição:', error);
            res.status(500).json({
                error_code: "SEARCH_ERROR",
                error_description: "Erro ao buscar a medição"
            });
        }
    }
    
    static async listarMedicoes(req: Request, res: Response): Promise<void>{
        res.status(200).json({
            message: "Medições Listadas",
            medicao: await medicao.find({})
        })
    }

    static async listarMedicoesPorId(req: Request, res: Response): Promise<void>{
        res.status(200).json({
            message: "Medição encontrada",
            medicao: await medicao.findById(req.params.id)
        })
    }

    static async listarMedicoesPorCliente(req: Request, res: Response): Promise<void>{
        const medicaoEncontrada = await medicao.find({ customer_code: req.params.customer_code})

        if(medicaoEncontrada){
            res.status(200).json({
                custumer_code: req.params.customer_code,
                measures: medicaoEncontrada
            })
        }

        res.status(404).json({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Nenhuma leitura encontrada"
        })
    }

    static async confirmMedicao(req: Request, res: Response): Promise<void>{
        var medicaoEncontrada: IMedicao | null = await medicao.findById(req.body.measure_uuid);

        if (medicaoEncontrada !== null) {
            if(!medicaoEncontrada.has_confirmed){

                medicaoEncontrada.measure_value = req.body.confirm_value
                medicaoEncontrada.has_confirmed = true
                await medicao.findByIdAndUpdate(req.body.measure_uuid, medicaoEncontrada)
                res.status(200).json({
                    succes: true
                })
            }

            res.status(409).json({
                error_code: "CONFIRMATION_DUPLICATE",
                error_description: "Leitura do mês já realizada"
            })
        }

        res.status(404).json({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Leitura não encontrada"
        })
    }
}

export default MedicaoController