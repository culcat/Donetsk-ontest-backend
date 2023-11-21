import express,{ Request ,Response, Router } from "express";
import * as db from '../db'

const router =  express.Router()
/**
/**
 * @openapi
 * /api/help:
 *   get:
 *     summary: Помощь
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


router.get('/help', async (req: Request, res: Response) => {
    try {
        const help_list = await db.getHelp();
        res.json({ help_list });
    } catch (error) {
        console.error('Error during button retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;