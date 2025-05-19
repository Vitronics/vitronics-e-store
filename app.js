// // const express = require('express');
// // const multer = require('multer');
// // const path = require('path');
// // const cors = require('cors');
// // const mysql = require('mysql2/promise');
// // const fs = require('fs');
// // require('dotenv').config();

// // const app = express();
// // const port = process.env.PORT || 3000;

// // // Create uploads directory if not exists
// // if (!fs.existsSync('uploads')) {
// //     fs.mkdirSync('uploads');
// // }

// // // MySQL connection pool
// // const pool = mysql.createPool({
// //   host: process.env.MYSQLHOST || 'localhost',
// //   port: process.env.MYSQLPORT || 3306,
// //   user: process.env.MYSQLUSER,
// //   password: process.env.MYSQLPASSWORD,
// //   database: process.env.MYSQLDATABASE,
// //   waitForConnections: true,
// //   connectionLimit: 10,
// //   queueLimit: 0
// // });

// // // Initialize tables
// // (async () => {
// //     try {
// //         const connection = await pool.getConnection();
// //         const schema = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
// //         const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);

// //         for (let query of queries) {
// //             await connection.query(query);
// //         }
// //         console.log('Database initialized');
// //         connection.release();
// //     } catch (error) {
// //         console.error('Database initialization error:', error);
// //     }
// // })();

// // // Multer setup
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, 'uploads/');
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + path.extname(file.originalname));
// //     }
// // });

// // const upload = multer({
// //     storage: storage,
// //     limits: { fileSize: 12 * 1024 * 1024 }
// // });

// // // CORS configuration
// // app.use(cors({
// //     origin: process.env.CLIENT_ORIGIN || 'https://vitronics-e-store-production.up.railway.app/',
// //     methods: ['GET', 'POST']
// // }));

// // app.use(express.json());
// // app.use(express.static('public'));
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // Upload endpoint
// // app.post('/api/upload/:category', upload.single('product_image'), async (req, res) => {
// //     try {
// //         const { category } = req.params;
// //         const {
// //             product_name,
// //             price,
// //             quantity,
// //             voltage,
// //             current,
// //             supply,
// //             sensor
// //         } = req.body;

// //         if (!product_name || !price || !quantity) {
// //             return res.status(400).json({ error: 'Missing required fields' });
// //         }

// //         const validCategories = [
// //             'controller', 'plc', 'sensor', 'actuator', 'motors', 'enclosure',
// //             'relay', 'switch', 'cables', 'drives', 'microcontroller', 'protection', 'display'
// //         ];
// //         if (!validCategories.includes(category)) {
// //             return res.status(400).json({
// //                 error: `Invalid category: ${category}`,
// //                 validCategories
// //             });
// //         }

// //         const [result] = await pool.query(
// //             `INSERT INTO products 
// //             (product_name, price, quantity, voltage, current, supply, sensor, product_image, category)
// //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //             [
// //                 product_name,
// //                 parseFloat(price),
// //                 parseInt(quantity),
// //                 voltage || null,
// //                 current || null,
// //                 supply || null,
// //                 sensor || null,
// //                 req.file ? `/uploads/${req.file.filename}` : null,
// //                 category
// //             ]
// //         );

// //         res.status(201).json({
// //             message: 'Product uploaded successfully',
// //             productId: result.insertId
// //         });

// //     } catch (error) {
// //         console.error('Server error:', error);
// //         res.status(500).json({
// //             error: 'Internal server error',
// //             message: error.message
// //         });
// //     }
// // });

// // // Get products by category
// // app.get('/api/upload/:category', async (req, res) => {
// //     try {
// //         const { category } = req.params;

// //         const [products] = await pool.query(`
// //             SELECT 
// //                 id,
// //                 product_name AS name,
// //                 price,
// //                 quantity,
// //                 voltage,
// //                 current,
// //                 supply,
// //                 sensor,
// //                 product_image AS productImage,
// //                 category
// //             FROM products 
// //             WHERE category = ? 
// //             ORDER BY created_at DESC
// //         `, [category]);

// //         if (products.length === 0) {
// //             return res.status(404).json({ error: 'No products found in this category' });
// //         }

// //         res.json(products);

// //     } catch (error) {
// //         console.error('Server error:', error);
// //         res.status(500).json({
// //             error: 'Internal server error',
// //             message: error.message
// //         });
// //     }
// // });

// // // Error handling middleware
// // app.use((err, req, res, next) => {
// //     console.error(err.stack);
// //     res.status(500).json({
// //         error: 'Something went wrong!',
// //         message: err.message
// //     });
// // });

// // // Start server
// // app.listen(port, () => {
// //     console.log(`Server running on port ${port}`);
// // });
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
//     host: process.env.MYSQLHOST || 'localhost',
//     port: process.env.MYSQLPORT || 3306,
//     user: process.env.MYSQLUSER,
//     password: process.env.MYSQLPASSWORD,
//     database: process.env.MYSQLDATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
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
//     // filename: (req, file, cb) => {
//     //     cb(null, Date.now() + path.extname(file.originalname));
//     // }

//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 12 * 1024 * 1024 }
// });

// // CORS configuration
// app.use(cors({
//     origin: process.env.CLIENT_ORIGIN || 'https://vitronics-e-store-production.up.railway.app/',
//     methods: ['GET', 'POST', 'DELETE']
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

// // ===== CART ENDPOINTS =====

// // Add to cart (no user ID)
// // Enhanced Add to Cart endpoint
// app.post('/api/cart/add', async (req, res) => {
//   const { product_id, name, price, quantity = 1 } = req.body;

//   if (!product_id || !name || !price) {
//     return res.status(400).json({ error: 'Missing product_id, name, or price' });
//   }

//   try {
//     const [existing] = await pool.query(
//       'SELECT id, quantity FROM cart_items WHERE product_id = ?',
//       [product_id]
//     );

//     if (existing.length > 0) {
//       await pool.query(
//         'UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?',
//         [quantity, product_id]
//       );
//     } else {
//       await pool.query(
//         'INSERT INTO cart_items (product_id, product_name, price, quantity) VALUES (?, ?, ?, ?)',
//         [product_id, name, price, quantity]
//       );
//     }

//     // Get updated cart count
//     const [[{ cartCount }]] = await pool.query(
//       'SELECT SUM(quantity) as cartCount FROM cart_items'
//     );

//     res.status(200).json({ 
//       message: 'Product added to cart',
//       cartCount: cartCount || 0
//     });

//   } catch (err) {
//     console.error('Error adding to cart:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Enhanced Get Cart endpoint with total count
// // Get all cart items from the database
// app.get('/api/cart', async (req, res) => {
//   try {
//     const [items] = await pool.query(`
//       SELECT 
//         c.id AS cart_id,
//         c.quantity,
//         p.id AS product_id,
//         p.product_name,
//         p.price,
//         p.product_image
//       FROM cart_items c
//       JOIN products p ON c.product_id = p.id
//     `);

//     // Calculate total items and price
//     const [countRows] = await pool.query('SELECT SUM(quantity) AS cartCount FROM cart_items');
//     const cartCount = countRows[0]?.cartCount || 0;

//     res.json({ items, cartCount });
//   } catch (error) {
//     console.error('Error fetching cart:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Enhanced Clear Cart endpoint
// app.delete('/api/cart', async (req, res) => {
//   try {
//     await pool.query('DELETE FROM cart_items');
//     res.json({ 
//       message: 'All items removed from cart',
//       cartCount: 0
//     });
//   } catch (error) {
//     console.error('Clear cart error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Enhanced Remove Item endpoint
// app.delete('/api/cart/:product_id', async (req, res) => {
//     const { product_id } = req.params;

//     try {
//         await pool.query('DELETE FROM cart_items WHERE product_id = ?', [product_id]);
        
//         // Get updated cart count
//         const [[{ cartCount }]] = await pool.query(
//           'SELECT SUM(quantity) as cartCount FROM cart_items'
//         );

//         res.json({ 
//           message: 'Item removed from cart',
//           cartCount: cartCount || 0
//         });
//     } catch (error) {
//         console.error('Delete cart item error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
// // Global error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         error: 'Something went wrong!',
//         message: err.message
//     });
// });

// ////////////////////Order checkout////////////////////////
// // Get cart items for checkout
// app.get('/api/checkout/cart', async (req, res) => {
//   try {
//     const [items] = await pool.query(`
//       SELECT 
//         p.id AS product_id,
//         p.product_name,
//         p.price,
//         c.quantity
//       FROM cart_items c
//       JOIN products p ON c.product_id = p.id
//     `);

//     // Calculate total
//     const [[total]] = await pool.query(`
//       SELECT SUM(p.price * c.quantity) AS total
//       FROM cart_items c
//       JOIN products p ON c.product_id = p.id
//     `);

//     res.json({
//       items,
//       total: total.total || 0
//     });
//   } catch (error) {
//     console.error('Error fetching checkout cart:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Process order
// app.post('/api/checkout/order', async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     phone,
//     city,
//     notes,
//     paymentMethod,
//     cartItems,
//     totalAmount
//   } = req.body;

//   if (!firstName || !email || !cartItems || cartItems.length === 0) {
//       return res.json({ success: false, error: 'Missing required fields or cart is empty' });
//     }

//   try {
//     // Start transaction
//     const connection = await pool.getConnection();
//     await connection.beginTransaction();

//     try {
//       // Insert order
//       const [orderResult] = await connection.query(
//         `INSERT INTO orders (
//           first_name,
//           last_name,
//           email, 
//           phone, 
//           city, 
//           notes, 
//           total_amount, 
//           payment_method
//         ) VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
//         [
//           firstName,
//           lastName,
//           email,
//           phone,
//           city,
//           notes,
//           totalAmount,
//           paymentMethod
//         ]
//       );

//       const orderId = orderResult.insertId;

//       // Insert order items
//       for (const item of cartItems) {
//         await connection.query(
//           `INSERT INTO order_items (
//             order_id,
//             product_id,
//             product_name,
//             price,
//             quantity
//           ) VALUES (?, ?, ?, ?, ?)`,
//           [
//             orderId,
//             item.product_id,
//             item.product_name,
//             item.price,
//             item.quantity
//           ]
//         );
//       }

//       // Clear cart
//       await connection.query('DELETE FROM cart_items');

//       // Commit transaction
//       await connection.commit();
//       connection.release();

//       res.json({
//         success: true,
//         orderId,
//         message: 'Order placed successfully'
//       });
//     } catch (error) {
//       await connection.rollback();
//       connection.release();
//       throw error;
//     }
//   } catch (error) {
//     console.error('Error processing order:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to process order' 
//     });
//   }
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

// Configuration
const UPLOAD_DIR = 'uploads';
const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB
const VALID_CATEGORIES = [
  'controller', 'plc', 'sensor', 'actuator', 'motors', 'enclosure',
  'relay', 'switch', 'cables', 'drives', 'microcontroller', 'protection', 'display'
];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Database connection pool
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

// Initialize database
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    const schema = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    const queries = schema.split(';').filter(q => q.trim().length > 0);

    for (const query of queries) {
      await connection.query(query);
    }
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: Only images are allowed (jpeg, jpg, png, gif)'));
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://vitronics-e-store-production.up.railway.app',
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, UPLOAD_DIR)));

// Helper functions
async function validateProductInput(req) {
  const { product_name, price, quantity } = req.body;
  const { category } = req.params;

  if (!product_name || !price || !quantity) {
    throw new Error('Missing required fields: product_name, price, quantity');
  }

  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category. Valid categories: ${VALID_CATEGORIES.join(', ')}`);
  }

  return {
    product_name,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    voltage: req.body.voltage || null,
    current: req.body.current || null,
    supply: req.body.supply || null,
    sensor: req.body.sensor || null,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    category
  };
}

// Routes
// Product routes
app.post('/api/products/:category', upload.single('product_image'), async (req, res) => {
  try {
    const productData = await validateProductInput(req);
    
    const [result] = await pool.query(
      `INSERT INTO products SET ?`, 
      [productData]
    );

    res.status(201).json({
      success: true,
      message: 'Product uploaded successfully',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Product upload error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/products/:category', async (req, res) => {
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

    res.json({
      success: true,
      data: products.length ? products : [],
      message: products.length ? '' : 'No products found in this category'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Cart routes
app.post('/api/cart', async (req, res) => {
  try {
    const { product_id, name, price, quantity = 1 } = req.body;

    if (!product_id || !name || !price) {
      throw new Error('Missing product_id, name, or price');
    }

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

    const [[{ cartCount }]] = await pool.query(
      'SELECT SUM(quantity) as cartCount FROM cart_items'
    );

    res.json({
      success: true,
      cartCount: cartCount || 0,
      message: 'Product added to cart'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

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

    const [[{ cartCount }]] = await pool.query(
      'SELECT SUM(quantity) as cartCount FROM cart_items'
    );

    res.json({
      success: true,
      data: {
        items,
        cartCount: cartCount || 0
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
});

app.delete('/api/cart/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE product_id = ?',
      [product_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found in cart'
      });
    }

    const [[{ cartCount }]] = await pool.query(
      'SELECT SUM(quantity) as cartCount FROM cart_items'
    );

    res.json({
      success: true,
      cartCount: cartCount || 0,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item'
    });
  }
});

app.delete('/api/cart', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items');
    res.json({
      success: true,
      cartCount: 0,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
});

// Checkout routes
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

    const [[{ total }]] = await pool.query(`
      SELECT SUM(p.price * c.quantity) AS total
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
    `);

    res.json({
      success: true,
      data: {
        items,
        total: total || 0
      }
    });
  } catch (error) {
    console.error('Checkout cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load checkout data'
    });
  }
});

app.post('/api/checkout/order', async (req, res) => {
  const connection = await pool.getConnection();
  try {
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

    if (!firstName || !email || !cartItems?.length) {
      throw new Error('Missing required fields or empty cart');
    }

    await connection.beginTransaction();

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders SET ?`, 
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        city,
        notes,
        total_amount: totalAmount,
        payment_method: paymentMethod
      }
    );

    // Add order items
    const orderItems = cartItems.map(item => [
      orderResult.insertId,
      item.product_id,
      item.product_name,
      item.price,
      item.quantity
    ]);

    await connection.query(
      `INSERT INTO order_items 
      (order_id, product_id, product_name, price, quantity) 
      VALUES ?`,
      [orderItems]
    );

    // Clear cart
    await connection.query('DELETE FROM cart_items');

    await connection.commit();

    res.json({
      success: true,
      orderId: orderResult.insertId,
      message: 'Order placed successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Checkout error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();