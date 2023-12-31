import express, { Request, Response, Router } from "express";
import * as db from '../db';
import Material from "../types/calcbuild";
import { saveOrderToHistory } from "../db";

const router = express.Router();
/**
 * @openapi
 * /api/calc:
 *   get:
 *     summary: калькулятор 
 *     tags:
 *       - Логика
 *     parameters:
 *       - in: query
 *         name: Width
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *       - in: query
 *         name: Length
 *         required: true
 *         schema:
 *           type: string
 *         description: Пароль пользователя
 *       - in: query
 *         name: Schema
 *         required: true
 *         schema:
 *           type: string
 *         description: Пароль пользователя
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
 * /api/schema:
 *   get:
 *     summary: Схкма дома + этажи 
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
 * /calcmaterial:
 *   post:
 *     summary: Calculate Build Cost
 *     description: Calculate the total price based on provided materials.
 *     tags:
 *       - Логика
 *     requestBody:
 *       description: JSON payload containing an array of materials and house information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     material_type_id:
 *                       type: integer
 *                       description: ID of the material type.
 *                     selected_material_id:
 *                       type: integer
 *                       description: ID of the selected material.
 *                     first_input_value:
 *                       type: number
 *                       description: The first input value for the material.
 *                     second_input_value:
 *                       type: number
 *                       description: The second input value for the material.
 *               house_info:
 *                 type: object
 *                 properties:
 *                   width:
 *                     type: integer
 *                     description: Width of the house.
 *                   length:
 *                     type: integer
 *                     description: Length of the house.
 *                   scheme:
 *                     type: integer
 *                     description: Scheme of the house.
 *                   floors:
 *                     type: integer
 *                     description: Number of floors in the house.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               total_price: 123.45
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               error: 'Invalid input: materials should be an array'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */
/**
 * @openapi
 * /api/orderhistory:
 *   get:
 *     summary: Получение истории заказов пользователя
 *     tags:
 *       - Заказы
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID пользователя для получения истории заказов
 *     responses:
 *       '200':
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: integer
 *                         description: ID заказа
 *                       orderDetails:
 *                         type: string
 *                         description: Детали заказа
 *                       
 *       '400':
 *         description: Неверный ввод
 *         content:
 *           application/json:
 *             example:
 *               error: 'Invalid user ID provided'
 *       '500':
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */


router.get('/schema',async (req:Request,res: Response) => {
    try{
        const schemaDoma = ["Пятистенок","Шестистенок"]
        const floors = [1,2] 
        res.status(200).json({ schemaDoma,floors });

    }
    catch(error){}
})



router.get('/calc', async (req: Request, res: Response) => {
    try {
        const { Width, Length,Schema } = req.query;
        
        
        const parsedWidth: number = parseFloat(Width as string);
        const parsedLength: number = parseFloat(Length as string);

        if (parsedWidth > 0.0 && parsedLength > 0.0) {
            let Perimeter: number = 0.0;
            let Foundation: number;
            let BuildingArea: number = 0.0;
            switch (Schema) {
                case '0': // Пятистенок
                    Perimeter = 5 * parsedLength;
                    break;
                case '1': // Шестистенок
                    Perimeter = 6 * parsedLength;
                    break;
            }

            Foundation = 2 * (parsedLength + parsedWidth);
            BuildingArea = parsedWidth * parsedLength;
        res.status(200).json({ Perimeter,Foundation,BuildingArea });
    }} catch (error) {
        console.error('Error during material retrieval:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/calcmaterial', async (req: Request, res: Response) => {
    try {
        // Extracting the materials array and house_info from the request body
        const { materials, house_info } = req.body;
        const userID: string | number = req.query.userID as string | number;
        console.log(userID);
        
        // Checking if materials is an array and house_info is present
        if (Array.isArray(materials) && house_info) {
            // Array to store the results for each material
            const results = [];

            // Looping through each material in the array
            for (const material of materials) {
                const materialPrice = await db.getMaterialPrice(parseInt(material.selected_material_id, 10));

                let totalPrice = 0;

                // Checking if either value is -1
                if (material.first_input_value == -1) {
                    // Use only second_input_value if first_input_value is -1
                    totalPrice = materialPrice * 1.1;
                } else if (material.second_input_value == -1) {
                    // Use only first_input_value if second_input_value is -1
                    totalPrice = materialPrice * 1.1;
                } else if (material.second_input_value == -1 && material.first_input_value == -1) {
                    // Use only first_input_value if second_input_value is -1
                    totalPrice = materialPrice ;
                }else {
                    // Use both values if neither is -1
                    totalPrice = materialPrice * (1.1 + 1.1);
                }

                // Fetching width and length from house_info
                const { width, length } = house_info;
                var square = width * length
                // Calculating the total price for the entire house
                const houseTotalPrice = totalPrice * square

                // Extracting material_type_id from the current material
                const materialTypeId = material.material_type_id;
                const materialID = material.selected_material_id
               
                // Adding the result to the array
                results.push({ price: houseTotalPrice, material_type_id: materialTypeId,material_ID:materialID,material_price:totalPrice*square});
            }
            
            if(userID != 0){
                const totalOrderPrice = results.reduce((acc, result) => acc + result.price, 0);
                const materialIds = results.map(result => result.material_ID);
                const materialTypes = results.map(result => result.material_type_id);
                const materialPrices = results.map(result => result.material_price);
                
                const orderDate = new Date()
                await saveOrderToHistory(Number(userID), totalOrderPrice, materialIds,materialTypes,materialPrices );}
            // Sending the array of results as a JSON response
            res.json({material:results});
        }
         else {
            // Handling the case when materials is not an array or house_info is missing
            res.status(400).json({ error: 'Invalid input: materials should be an array, and house_info should be present' });
        }
    } catch (error) {
        // Handling any internal server error
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/orderhistory', async (req: Request, res: Response) => {
    try {
        const userID: string | number = req.query.userID as string | number;
        console.log(userID);
        
        // Call the getOrderHistory function to fetch order history
        const orderHistory = await db.getOrderHistory(String(userID));

        // Respond with the entire order history array
        res.json({ orderHistory });
        
    } catch (error) {
        // Handle errors
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;