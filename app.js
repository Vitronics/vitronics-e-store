const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'villier',
    password: 'Vill@4171#',
    database: 'products',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize tables
(async () => {
    try {
        const connection = await pool.getConnection();
        const schema = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);

        for (let query of queries) {
            await connection.query(query);
        }
        console.log('Database initialized');
        connection.release();
    } catch (error) {
        console.error('Database initialization error:', error);
    }
})();

// Configure storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 }
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/api/upload/:category', upload.single('product_image'), async (req, res) => {
    try {
        const { category } = req.params;
        const {
            product_name,
            price,
            quantity,
            voltage,
            current,
            supply,
            sensor
        } = req.body;

        if (!product_name || !price || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const validCategories = [
            'controller', 'plc', 'sensor', 'actuator', 'motors', 'enclosure',
            'relay', 'switch', 'cables', 'drives', 'microcontroller', 'protection', 'display'
        ];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                error: `Invalid category: ${category}`,
                validCategories
            });
        }

        const [result] = await pool.query(
            `INSERT INTO products 
            (product_name, price, quantity, voltage, current, supply, sensor, product_image, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product_name,
                parseFloat(price),
                parseInt(quantity),
                voltage || null,
                current || null,
                supply || null,
                sensor || null,
                req.file ? `/uploads/${req.file.filename}` : null,
                category
            ]
        );

        res.status(201).json({
            message: 'Product uploaded successfully',
            productId: result.insertId
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get products by category
app.get('/api/upload/:category', async (req, res) => {
    try {
        const { category } = req.params;

        const [products] = await pool.query(`
            SELECT 
                id,
                product_name AS name,
                price,
                quantity,
                voltage,
                current,
                supply,
                sensor,
                product_image AS productImage,
                category
            FROM products 
            WHERE category = ? 
            ORDER BY created_at DESC
        `, [category]);

        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found in this category' });
        }

        res.json(products);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
