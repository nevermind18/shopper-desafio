import express, { Router } from 'express'
import MedicaoController from '../controller/medicaoController'
import validateType from '../middleware/validateType'

const routes: Router = express.Router()

routes.post('/upload', validateType.validateCadatro , MedicaoController.cadastarMedicao)
routes.get('/:customer_code/list', validateType.validateList, MedicaoController.listarMedicoesPorCliente)
routes.patch('/confirm', validateType.validateUpdate, MedicaoController.cadastarMedicao)

export default routes
