const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Docker-Compose!');
});

app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS `current_time`');
    res.json({
      db_status: 'connected',
      current_time: rows[0].current_time
    });
  } catch (err) {
    res.status(500).json({
      db_status: 'disconnected',
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
