import { randomUUID as uuidv4 } from 'crypto';
import pkg from 'pg';

const { Client } = pkg;

// PostgreSQLの接続設定
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function manyInsert() {
  await client.connect();
  try {
    console.log('データ投入開始...');
    const startTime = Date.now();

    // トランザクション開始
    await client.query('BEGIN');

    // 1000000行のデータを生成して投入
    for (let i = 0; i < 1000000; i++) {
      const value = Math.floor(Math.random() * 1000);
      const message = `ログメッセージ ${i}`;

      await client.query(
        'INSERT INTO device_logs (id, device_id, event_time, location) VALUES ($1, $2, NOW(), ST_SetSRID(ST_MakePoint($3, $4), 4326))',
        [uuidv4(), 'device_1', Math.random() * 180 - 90, Math.random() * 360 - 180]
      );

      if (i % 10000 === 0) {
        console.log(`${i}行完了`);
      }
    }

    // トランザクションをコミット
    await client.query('COMMIT');

    const endTime = Date.now();
    console.log(`データ投入完了: ${(endTime - startTime) / 1000}秒`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('エラーが発生しました:', err);
  }
}

// メイン処理の実行
(async () => {
  try {
    await manyInsert();
  } catch (err) {
    console.error('エラーが発生しました:', err);
  } finally {
    await client.end();
  }
})();
