import { Request, Response, NextFunction } from 'express';

function notFound(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({
        message: "Página não encontrada"
    });
}

export default notFound;