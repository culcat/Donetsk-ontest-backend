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
    const { tabID } = req.query as { tabID: string };
    try {
        const buttons = await db.getButtons(tabID);
        res.status(200).json({ buttons });
    } catch (error) {
        console.error('Error during button retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/buttonsData', async (req: Request<any, any, any, { ids?: string }>, res: Response) => {
    try {
      // Получение айдишников кнопок с фронта
      // const frontEndIds = req.query.ids;
      //
      // // Проверка, что ids не является undefined
      // if (frontEndIds === undefined) {
      //   throw new Error('Ids are undefined');
      // }
  
      // Преобразование строковых ids в массив чисел
      // const idsArray = frontEndIds.split(',').map((id) => parseInt(id, 10));
  
      // Запрос в базу данных для получения айди и нейм из таблицы buttons
      const buttonsData = await db.getButtonsData();
  
      // Отправка данных на фронт
      res.json(buttonsData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
export default router;