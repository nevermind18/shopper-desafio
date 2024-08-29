import express, { Application, Request, Response } from 'express';
import medicao from './midecaoRoute';

const routes = (app: Application): void => {
	if (!app.use) {
        throw new Error('app não é uma instância do Express.');
    }

    // Definir a rota raiz
    app.get('/teste', (req: Request, res: Response) => {
        res.status(200).send('curso de node');
    });

    // Adicionar middleware para análise do JSON
    app.use(express.json());

    // Adicionar roteador
    app.use('/', medicao);
}

export default routes;