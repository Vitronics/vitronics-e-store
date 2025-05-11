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
    // filename: (req, file, cb) => {
    //     cb(null, Date.now() + path.extname(file.originalname));
    // }

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 }
});

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'https://vitronics-e-store-production.up.railway.app/',
    methods: ['GET', 'POST', 'DELETE']
}));

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// ===== CART ENDPOINTS =====

// Add to cart (no user ID)
app.post('/api/cart/add', async (req, res) => {
  const { product_id, name, price } = req.body;

  if (!product_id || !name || !price) {
    return res.status(400).json({ error: 'Missing product_id, name, or price' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM cart_items WHERE product_id = ?',
      [product_id]
    );

    if (existing.length > 0) {
      // Update quantity if product already exists
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = ?',
        [product_id]
      );
    } else {
      // Insert new cart item
      await pool.query(
        'INSERT INTO cart_items (product_id, product_name, price, quantity) VALUES (?, ?, ?, ?)',
        [product_id, name, price, 1]
      );
    }

    res.status(200).json({ message: 'Product added to cart' });

  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Get all items in cart
app.get('/api/cart', async (req, res) => {
    try {
        const [items] = await pool.query(`
            SELECT 
                c.id AS cart_id,
                c.quantity,
                p.id AS product_id,
                p.product_name,
                p.price,
                p.product_image
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
        `);

        res.json(items);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// clear item from cart
app.delete('/api/cart', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items');
    res.json({ message: 'All items removed from cart' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Delete cart items
app.delete('/api/cart', async (req, res) => {
  try {
    console.log('Attempting to clear cart...'); // Add this
    const result = await pool.query('DELETE FROM cart_items');
    console.log('Cart cleared, affected rows:', result.affectedRows); // Add this
    res.json({ message: 'All items removed from cart' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Global error handler
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
