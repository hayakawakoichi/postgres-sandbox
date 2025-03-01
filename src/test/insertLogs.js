import { randomUUID as uuidv4 } from 'crypto';
import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function insertLogs() {
  await client.connect();
    console.log('Connected to the database');

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS device_logs (
        id UUID PRIMARY KEY,
        device_id VARCHAR(255) NOT NULL,
        event_time TIMESTAMPTZ NOT NULL,
        location GEOGRAPHY(Point,4326) NULL
    );
    `;

  await client.query(createTableQuery);
  console.log('Table created');

  setInterval(async () => {
    const query = `
      INSERT INTO device_logs (id, device_id, event_time, location)
      VALUES
        ($1, $2, NOW(), ST_SetSRID(ST_MakePoint($3, $4), 4326)),
        ($5, $6, NOW(), ST_SetSRID(ST_MakePoint($7, $8), 4326));
    `;

    const values = [
      uuidv4(), `device_1`, Math.random() * 180 - 90, Math.random() * 360 - 180,
      uuidv4(), `device_2`, null, null,
    ];

    try {
      await client.query(query, values);
      console.log('Inserted 2 records');
    } catch (err) {
      console.error('Error inserting records:', err);
    }
  }, 1000);
}

insertLogs().catch(console.error);
