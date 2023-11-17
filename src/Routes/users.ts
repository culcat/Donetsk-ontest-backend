import express, { Request, Response } from 'express';
import * as db from '../db'; // Подключение к базе данных (примерно как в предыдущем ответе)
import * as crypto from 'crypto';
import jwt, { TokenExpiredError, verify } from 'jsonwebtoken';

const router = express.Router();
/**
/**
 * @openapi
 * /api/login:
 *   get:
 *     summary: Вход
 *     tags:
 *       - Пользователи
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *       - in: query
 *         name: password
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
 * /api/auth:
 *   post:
 *     summary: Регистрация
 *     tags:
 *       - Пользователи
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *               - name
 *               - lastname
 *     responses:
 *       '201':
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *       '400':
 *         description: Ошибка валидации данных
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
/**
 * @openapi
 * /api/verify:
 *   get:
 *     summary: Вход
 *     tags:
 *       - Пользователи
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *      
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
 *         description: Invalid token
 *       '500':
 *         description: Внутренняя ошибка сервера
 */

function generateSecretKey():string{
    const secretKey = crypto.randomBytes(64).toString('hex');
    return secretKey;
}
const secretkey = generateSecretKey()
console.log(secretkey);


router.post('/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log(secretkey);
  
      const user = await db.getUserByUsername(username as string);
  
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
      }
  
      const token = jwt.sign({ username: user.username }, secretkey, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.get('/verify', async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      console.log('Received Token:', token);
  
      if (!token) {
        return res.status(401).json({ error: 'Token is required' });
      }
  
      const decoded = jwt.verify(token as string, secretkey) as jwt.JwtPayload;
      console.log('Decoded Payload:', decoded);
  
      if (!decoded.username) {
        return res.status(401).json({ error: 'Invalid token structure' });
      }
  
      // You need to await the result of the asynchronous operation
      const userInfo = await db.getUserByUsername(decoded.username);
  
      // Return user information in the response
      res.status(200).json({userInfo});
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ error: 'Token has expired' });
      }
  
      console.error('Error verifying token:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  });
  


  
  router.post('/auth', async (req: Request, res: Response) => {
    try {
      const { username, password, name, lastname } = req.body;
  
      if (!username || !password || !name || !lastname) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const existingUser = await db.getUserByUsername(username);
  
      if (existingUser) {
        return res.status(400).json({ error: 'User with this username already exists' });
      }
  
      const userId = await db.createUser(username, password, name, lastname);
  
      // Generate a token for the newly registered user
      const token = jwt.sign({ username }, secretkey, { expiresIn: '1h' });
  
      res.status(201).json({ id: userId, username, token });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  


export default router;