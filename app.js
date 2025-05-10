// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const mysql = require('mysql2/promise');
// const fs = require('fs');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Create uploads directory if not exists
// if (!fs.existsSync('uploads')) {
//     fs.mkdirSync('uploads');
// }

// // MySQL connection pool
// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST || 'localhost',
//   port: process.env.MYSQLPORT || 3306,
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQLPASSWORD,
//   database: process.env.MYSQLDATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Initialize tables
// (async () => {
//     try {
//         const connection = await pool.getConnection();
//         const schema = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
//         const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);

//         for (let query of queries) {
//             await connection.query(query);
//         }
//         console.log('Database initialized');
//         connection.release();
//     } catch (error) {
//         console.error('Database initialization error:', error);
//     }
// })();

// // Multer setup
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 12 * 1024 * 1024 }
// });

// // CORS configuration
// app.use(cors({
//     origin: process.env.CLIENT_ORIGIN || 'https://vitronics-e-store-production.up.railway.app/',
//     methods: ['GET', 'POST']
// }));

// app.use(express.json());
// app.use(express.static('public'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Upload endpoint
// app.post('/api/upload/:category', upload.single('product_image'), async (req, res) => {
//     try {
//         const { category } = req.params;
//         const {
//             product_name,
//             price,
//             quantity,
//             voltage,
//             current,
//             supply,
//             sensor
//         } = req.body;

//         if (!product_name || !price || !quantity) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         const validCategories = [
//             'controller', 'plc', 'sensor', 'actuator', 'motors', 'enclosure',
//             'relay', 'switch', 'cables', 'drives', 'microcontroller', 'protection', 'display'
//         ];
//         if (!validCategories.includes(category)) {
//             return res.status(400).json({
//                 error: `Invalid category: ${category}`,
//                 validCategories
//             });
//         }

//         const [result] = await pool.query(
//             `INSERT INTO products 
//             (product_name, price, quantity, voltage, current, supply, sensor, product_image, category)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 product_name,
//                 parseFloat(price),
//                 parseInt(quantity),
//                 voltage || null,
//                 current || null,
//                 supply || null,
//                 sensor || null,
//                 req.file ? `/uploads/${req.file.filename}` : null,
//                 category
//             ]
//         );

//         res.status(201).json({
//             message: 'Product uploaded successfully',
//             productId: result.insertId
//         });

//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({
//             error: 'Internal server error',
//             message: error.message
//         });
//     }
// });

// // Get products by category
// app.get('/api/upload/:category', async (req, res) => {
//     try {
//         const { category } = req.params;

//         const [products] = await pool.query(`
//             SELECT 
//                 id,
//                 product_name AS name,
//                 price,
//                 quantity,
//                 voltage,
//                 current,
//                 supply,
//                 sensor,
//                 product_image AS productImage,
//                 category
//             FROM products 
//             WHERE category = ? 
//             ORDER BY created_at DESC
//         `, [category]);

//         if (products.length === 0) {
//             return res.status(404).json({ error: 'No products found in this category' });
//         }

//         res.json(products);

//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({
//             error: 'Internal server error',
//             message: error.message
//         });
//     }
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         error: 'Something went wrong!',
//         message: err.message
//     });
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
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

// Multer setup
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
    origin: process.env.CLIENT_ORIGIN || 'https://vitronics-e-store-production.up.railway.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// PRODUCT ENDPOINTS

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

// Get single product by ID
app.get('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params;

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
            WHERE id = ?
        `, [id]);

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(products[0]);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// CART ENDPOINTS

// Add item to cart
app.post('/api/cart', async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Verify product exists and has sufficient quantity
        const [products] = await pool.query(
            'SELECT id, price, quantity FROM products WHERE id = ?',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = products[0];
        
        if (product.quantity < quantity) {
            return res.status(400).json({
                error: 'Insufficient stock',
                available: product.quantity
            });
        }

        // In a real application, you would associate this with a user session
        // For simplicity, we'll just return the cart item
        res.json({
            message: 'Product added to cart',
            cartItem: {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.productImage
            }
        });

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

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});