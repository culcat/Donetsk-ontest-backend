import pgPromise, { IDatabase } from 'pg-promise';

const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'donetskontest',
  user: 'postgres',
  password: 'postgrespw',
};

const pgp = pgPromise();
const db: IDatabase<{}> = pgp(dbConfig);

export async function query(queryText: string, values?: any[]) {
  try {
    return await db.any(queryText, values);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function createUser(username: string, password: string, name: string, lastname:string) {
  const queryText = 'INSERT INTO users (login, password, name, lastname) VALUES ($1, $2, $3, $4) RETURNING id';
  const values = [username, password, name, lastname];

  try {
    const result = await db.one(queryText, values);
    return result.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  const queryText = 'SELECT * FROM users WHERE login = $1';
  const values = [username];

  try {
    const user = await db.oneOrNone(queryText, values);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}
