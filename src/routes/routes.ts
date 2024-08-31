import express, { Application, Request, Response } from 'express';
import medicao from './midecaoRoute';

const routes = (app: Application): void => {
	if (!app.use) {
        throw new Error('app não é uma instância do Express.');
    }

    app.get('/teste', (req: Request, res: Response) => {
        res.status(200).send('curso de node');
    });

    app.use(express.json());

    app.use('/', medicao);
}

export default routes;