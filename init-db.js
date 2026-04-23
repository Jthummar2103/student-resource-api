const mysql = require("mysql2");
const fs = require("fs");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
  multipleStatements: true
});

const sql = fs.readFileSync('../sql/student_resource.sql', 'utf8');
const cleanup = `
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS=1;
`;

db.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    return;
  }
  console.log('Connected to database');

  db.query(cleanup + sql, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      return;
    }
    console.log('Database truncated and seeded successfully');
    db.end();
  });
});