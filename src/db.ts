import pgPromise, { IDatabase } from 'pg-promise';

const dbConfig = {
  host: '192.168.0.104',
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



export async function getButtons(tabID:string) {
  const queryText = 'SELECT * FROM buttons WHERE "tabID" = $1';
  const value =[tabID]
  try {
      const buttons = await db.any(queryText,value);
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

export async function saveOrderToHistory(userId: number,totalOrderPrice: number, materialTypeIds: number[],materialTypes: number[],price_item:number[]) {
  try {
    
    
      const query = `
          INSERT INTO order_history (user_id, total_price, material_type_ids,material_types,price_item)
          VALUES ($1, $2, $3,$4,$5)
      `;

      await db.none(query, [userId,totalOrderPrice, materialTypeIds,materialTypes,price_item]);
  } catch (error) {
      console.error('Error saving order to history:', error);
      throw error;
  }
}


export async function getOrderHistory(userId: string) {
  try {
    const query = `
    SELECT 
    oh.id AS order_id, 
    oh.total_price AS price,
    m.id AS material_id,
    m.name AS material_name,
    m.type AS material_type_id,
   
    m.img AS material_img,
    oh.price_item[1] AS price_item,
    (oh.order_date AT TIME ZONE 'Europe/Moscow' + interval '3 hours') AS adjusted_order_date
  FROM order_history oh
  JOIN materials m ON m.id = ANY(oh.material_type_ids)
 
  WHERE oh.user_id = $1
  ORDER BY adjusted_order_date DESC;
  
  
  
    `;

    const orderHistory = await db.many(query, [userId]);
    return orderHistory;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
}
interface ButtonData {
  id: number;
  name: string;
}

export async function getButtonsData(): Promise<ButtonData[]> {
  try {
    const result = await db.any('SELECT id, name FROM buttons');
    return result;
  } catch (error) {
    throw error;
  }
}



export async function getHelp() {
  const queryText = 'SELECT * FROM help';
  try {
      const help = await db.any(queryText);
      return help;
  } catch (error) {
      console.error('Error during button retrieval:', error);
      throw error;
  }
}
export async function getTab() {
  const queryText = 'SELECT * FROM tabs';
  try {
      const help = await db.any(queryText);
      return help;
  } catch (error) {
      console.error('Error during button retrieval:', error);
      throw error;
  }
}


// export async function saveItemToHistory(userId: number,totalOrderPrice: number, materialTypeIds: number,materialTypes: number) {
//   try {
//       const query = `
//           INSERT INTO item_history (user_id, total_price, material_type_ids,material_types)
//           VALUES ($1, $2, $3,$4)
//       `;

//       await db.none(query, [userId,totalOrderPrice, materialTypeIds,materialTypes]);
//   } catch (error) {
//       console.error('Error saving order to history:', error);
//       throw error;
//   }
// }export async function getItemToHistory(userId:number,orderId:number) {
//   const queryText = 'SELECT * FROM item_history WHERE';
//   try {
//       const help = await db.any(queryText);
//       return help;
//   } catch (error) {
//       console.error('Error during button retrieval:', error);
//       throw error;
//   }
// }

