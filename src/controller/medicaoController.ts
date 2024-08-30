import { Request, Response, NextFunction } from 'express'
import { IMedicao, medicao } from '../model/medicao'
// import multer from 'multer';
// import crypto from 'crypto';
// import path from 'path';
// import fs from 'fs';
import detectText from '../integration/detectText'

class MedicaoController {
    // static urlImagem(image: String): String {

    //     const storage = multer.diskStorage({
    //         destination: (req, file, cb) => {
    //             cb(null, 'uploads/');
    //         },
    //         filename: (req, file, cb) => {
    //             cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //         }
    //     });

    //     const upload = multer({ storage });
        
    //     const base64Data = image.replace(/^data:image\/png;base64,/, ""); // Ajuste o prefixo conforme necessário

    //     // Gerar um nome de arquivo temporário
    //     const tempFileName = crypto.randomBytes(16).toString('hex') + '.png';
    //     const tempFilePath = path.join(__dirname, 'uploads', tempFileName);

    //     // Salvar o Buffer como um arquivo temporário
    //     fs.writeFile(tempFilePath, base64Data, 'base64', (err) => {

    //         if (err) {
    //             console.log(err)
    //         }
            
    //     });

    //     return tempFilePath;

    // }

    static async cadastarMedicao(req: Request, res: Response, next: NextFunction): Promise<void> {  
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
                    error_code: "DOUBLE_REPORT",
                    error_description: "Leitura do mês já realizada"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async listarMedicoesPorCliente(req: Request, res: Response, next: NextFunction): Promise<void>{
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
                res.status(200).json({
                    custumer_code: req.params.customer_code,
                    measures:responseData
                    
                })
            } else{
                res.status(404).json({
                    error_code: "MEASURE_NOT_FOUND",
                    error_description: "Nenhuma leitura encontrada"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async confirmMedicao(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{
            var medicaoEncontrada = await medicao.findOne({ measure_uuid: req.body.measure_uuid})

            if (medicaoEncontrada !== null) {
                if(!medicaoEncontrada.has_confirmed){

                    medicaoEncontrada.measure_value = req.body.confirm_value
                    medicaoEncontrada.has_confirmed = true
                    await medicaoEncontrada.save();
                    res.status(200).json({
                        success: true
                    })
                }

                res.status(409).json({
                    error_code: "CONFIRMATION_DUPLICATE",
                    error_description: "Leitura já confirmada"
                })
            }

            res.status(404).json({
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada"
            })
        } catch (error) {
            next(error)
        }
    }
}

export default MedicaoController