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
export async function updateUserEstimate(username: string, newEstimate: number) {
  const queryText = 'UPDATE users SET estimate = COALESCE(estimate, 0) + $1 WHERE login = $2 RETURNING *';
  const values = [newEstimate, username];

  try {
    const result = await db.oneOrNone(queryText, values);
    return result; // Returns null if the user is not found, otherwise returns the updated user
  } catch (error) {
    console.error('Error updating user estimate:', error);
    throw error;
  }
}



export async function getButtons() {
  const queryText = 'SELECT * FROM buttons';
  try {
      const buttons = await db.any(queryText);
      return buttons;
  } catch (error) {
      console.error('Error during button retrieval:', error);
      throw error;
  }
}
export async function getFundament() {
  const queryText = 'SELECT * FROM fundament';
  try {
    const fundament = await db.any(queryText);


      return fundament;
    }

  
   catch (error) {
    console.error('Error during fundament retrieval:', error);
    throw error;
  }
}

export async function getFundamentID(id:string) {
  const queryText = 'SELECT * FROM materials WHERE type = $1';
  const value = [id]
  try {
    const fundament = await db.any(queryText,value);


      return fundament;
    }

  
   catch (error) {
    console.error('Error during fundament retrieval:', error);
    throw error;
  }
}
export async function getMaterialPrice(materialId: number): Promise<number> {
  try {
    const result = await db.one('SELECT material_price FROM materials WHERE id = $1', materialId);
    return result.material_price;
  } catch (error) {
    throw error;
  }
}
