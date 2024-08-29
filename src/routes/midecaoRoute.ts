import express, { Router } from 'express';
import MedicaoController from '../controller/medicaoController';

// Definindo o roteador
const routes: Router = express.Router();

// Definindo as rotas para o controlador de autores
routes.post('/upload', MedicaoController.cadastarMedicao);
routes.get('/list', MedicaoController.listarMedicoes);
routes.get('/measureid/:id/list', MedicaoController.listarMedicoesPorId);
routes.get('/:customer_code/list', MedicaoController.listarMedicoesPorCliente);
routes.patch('/confirm', MedicaoController.confirmMedicao);

export default routes;
