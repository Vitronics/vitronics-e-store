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
const bcrypt = require('bcryptjs')

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
// Enhanced Add to Cart endpoint
app.post('/api/cart/add', async (req, res) => {
  const { product_id, name, price, quantity = 1 } = req.body;

  if (!product_id || !name || !price) {
    return res.status(400).json({ error: 'Missing product_id, name, or price' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE product_id = ?',
      [product_id]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?',
        [quantity, product_id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (product_id, product_name, price, quantity) VALUES (?, ?, ?, ?)',
        [product_id, name, price, quantity]
      );
    }

    // Get updated cart count
    const [[{ cartCount }]] = await pool.query(
      'SELECT SUM(quantity) as cartCount FROM cart_items'
    );

    res.status(200).json({ 
      message: 'Product added to cart',
      cartCount: cartCount || 0
    });

  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enhanced Get Cart endpoint with total count
// Get all cart items from the database
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

    // Calculate total items and price
    const [countRows] = await pool.query('SELECT SUM(quantity) AS cartCount FROM cart_items');
    const cartCount = countRows[0]?.cartCount || 0;

    res.json({ items, cartCount });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Enhanced Clear Cart endpoint
app.delete('/api/cart', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items');
    res.json({ 
      message: 'All items removed from cart',
      cartCount: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced Remove Item endpoint
app.delete('/api/cart/:product_id', async (req, res) => {
    const { product_id } = req.params;

    try {
        await pool.query('DELETE FROM cart_items WHERE product_id = ?', [product_id]);
        
        // Get updated cart count
        const [[{ cartCount }]] = await pool.query(
          'SELECT SUM(quantity) as cartCount FROM cart_items'
        );

        res.json({ 
          message: 'Item removed from cart',
          cartCount: cartCount || 0
        });
    } catch (error) {
        console.error('Delete cart item error:', error);
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

////////////////////Order checkout////////////////////////
// Get cart items for checkout
app.get('/api/checkout/cart', async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT 
        p.id AS product_id,
        p.product_name,
        p.price,
        c.quantity
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
    `);

    // Calculate total
    const [[total]] = await pool.query(`
      SELECT SUM(p.price * c.quantity) AS total
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
    `);

    res.json({
      items,
      total: total.total || 0
    });
  } catch (error) {
    console.error('Error fetching checkout cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process order
app.post('/api/checkout/order', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    city,
    notes,
    paymentMethod,
    cartItems,
    totalAmount
  } = req.body;

  if (!firstName || !email || !cartItems || cartItems.length === 0) {
      return res.json({ success: false, error: 'Missing required fields or cart is empty' });
    }

  try {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (
          first_name,
          last_name,
          email, 
          phone, 
          city, 
          notes, 
          total_amount, 
          payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
        [
          firstName,
          lastName,
          email,
          phone,
          city,
          notes,
          totalAmount,
          paymentMethod
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of cartItems) {
        await connection.query(
          `INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            price,
            quantity
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            orderId,
            item.product_id,
            item.product_name,
            item.price,
            item.quantity
          ]
        );
      }

      // Clear cart
      await connection.query('DELETE FROM cart_items');

      // Commit transaction
      await connection.commit();
      connection.release();

      res.json({
        success: true,
        orderId,
        message: 'Order placed successfully'
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process order' 
    });
  }
});


// user register
app.post('/api/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const conn = await pool.getConnection();

        // Check if email or username already exists
        const [existing] = await conn.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            conn.release();
            return res.status(409).json({ message: 'Email or username already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await conn.query(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );

        conn.release();
        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// User login route
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log('Login attempt with email:', email);

//         const conn = await pool.getConnection();

//         const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
//         conn.release();

//         if (rows.length === 0) {
//             console.log('User not found for email:', email);
//             return res.status(404).json({ message: 'User not found!' });
//         }

//         const user = rows[0];
//         console.log('User found:', user);

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         console.log('Password comparison result:', isPasswordValid);

//         if (!isPasswordValid) {
//             console.log('Invalid password for user:', email);
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         // If valid, return success
//         res.status(200).json({
//             message: 'Login successful',
//             user_id: user.id,
//             user: {
//                 email: user.email,
//                 username: user.username
//             }
//         });

//         console.log('Logged in user ID:', user.id, user.email);
//     } catch (err) {
//         console.error('Error during login:', err);
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// });


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with email:', email);

        const conn = await pool.getConnection();

        // Get user from database
        const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        conn.release();

        if (rows.length === 0) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: 'User not found!' });
        }

        const user = rows[0];
        console.log('User found:', user.email);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create session
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Session error' });
            }

            console.log('Logged in user ID:', user.id);
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            });
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


// Check authentication status
app.get('/api/check-auth', (req, res) => {
    res.json({ 
        authenticated: !!req.session.userId,
        user: req.session.userId ? { 
            id: req.session.userId,
            email: req.session.userEmail 
        } : null
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
