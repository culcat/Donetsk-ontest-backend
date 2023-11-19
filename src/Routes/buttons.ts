import express,{ Request ,Response, Router } from "express";
import * as db from '../db'

const router =  express.Router()
/**
/**
 * @openapi
 * /api/buttons:
 *   get:
 *     summary: Кнопки
 *     tags:
 *       - Визуал
 *     responses:
 *       '200':
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       '401':
 *         description: Неверное имя пользователя или пароль
 *       '500':
 *         description: Внутренняя ошибка сервера
 */


router.get('/buttons', async (req: Request, res: Response) => {
    try {
        const buttons = await db.getButtons();
        res.status(200).json({ buttons });
    } catch (error) {
        console.error('Error during button retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;