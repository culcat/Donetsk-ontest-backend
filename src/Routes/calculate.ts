import express, { Request, Response, Router } from "express";
import * as db from '../db';
import Material from "../types/calcbuild";

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

                // Calculating the total price for the entire house
                const houseTotalPrice = totalPrice * width * length;

                // Extracting material_type_id from the current material
                const materialTypeId = material.material_type_id;

                // Adding the result to the array
                results.push({ total_price: houseTotalPrice, material_type_id: materialTypeId });
            }

            // Sending the array of results as a JSON response
            res.json({material:results});
        } else {
            // Handling the case when materials is not an array or house_info is missing
            res.status(400).json({ error: 'Invalid input: materials should be an array, and house_info should be present' });
        }
    } catch (error) {
        // Handling any internal server error
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




export default router;