import express, { Request, Response, Router } from "express";
import * as db from '../db';

const router = express.Router();

/**
 * @openapi
 * /api/fundament:
 *   get:
 *     summary: Фундамент
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

/**
 * @openapi
 * /api/material:
 *   get:
 *     summary: Материал
 *     tags:
 *       - Визуал
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Идентификатор материала
 *     responses:
 *       '200':
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 material:
 *                   type: string
 *                   description: Информация о материале
 *       '400':
 *         description: Неверный запрос
 *       '500':
 *         description: Внутренняя ошибка сервера
 */

router.get('/fundament', async (req: Request, res: Response) => {
    try {
        const fundament = await db.getFundament();
        res.status(200).json({ fundament });
    } catch (error) {
        console.error('Error during fundament retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/material', async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        // Validate 'id' and handle potential undefined or non-string values
        if (typeof id !== 'string') {
            res.status(400).json({ error: 'Bad Request' });
            return;
        }

        const material = await db.getFundamentID(id);
        res.status(200).json({ material });
    } catch (error) {
        console.error('Error during material retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
