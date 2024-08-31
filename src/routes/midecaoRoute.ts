import express, { Router } from 'express'
import MedicaoController from '../controller/medicaoController'
import validateType from '../middleware/validateType'

// Definindo o roteador
const routes: Router = express.Router()

// Definindo as rotas para o controlador de autores
routes.post('/upload', validateType.validateCadatro , MedicaoController.cadastarMedicao)
routes.get('/:customer_code/list', validateType.validateList, MedicaoController.listarMedicoesPorCliente)
routes.patch('/confirm', validateType.validateUpdate, MedicaoController.confirmMedicao)

export default routes
