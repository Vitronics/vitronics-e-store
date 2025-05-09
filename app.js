require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8080;

// ======================
// Configuration
// ======================

// Security and Performance Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev')); // HTTP request logging

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vitronics-e-store-production.up.railway.app']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

// ======================
// Database Setup
// ======================

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'mysql.railway.internal',
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'EMbJsOLDqrTEfMxwTAZkkspIJeDxuECy',
  database: process.env.MYSQLDATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Database connection monitoring
let isDatabaseConnected = false;

pool.on('connection', (connection) => {
  isDatabaseConnected = true;
  console.log('New database connection established');
});

pool.on('error', (err) => {
  isDatabaseConnected = false;
  console.error('Database error:', err);
});

// ======================
// File Upload Setup
// ======================

const uploadsDir = path.resolve(__dirname, 'uploads');

async function ensureUploadsDir() {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: Only JPEG, JPG, PNG, or GIF images are allowed!'));
  }
});

// ======================
// Routes
// ======================

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '1y',
  immutable: true
}));

// Product Routes
const productRouter = express.Router();

// Valid product categories
const validCategories = [
  'controller', 'plc', 'sensor', 'actuator', 'motors', 'enclosure',
  'relay', 'switch', 'cables', 'drives', 'microcontroller', 'protection', 'display'
];

// Upload product with category validation
productRouter.post('/api/upload/:category', upload.single('product_image'), async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validate category
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category: ${category}`,
        validCategories: validCategories
      });
    }

    // Validate required fields
    const requiredFields = ['product_name', 'price', 'quantity'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields
      });
    }

    // Process product data
    const { product_name, price, quantity, voltage, current, supply, sensor } = req.body;
    
    // Insert into database
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

    // Get the newly created product
    const [newProduct] = await pool.query(
      `SELECT 
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
      FROM products WHERE id = ?`, 
      [result.insertId]
    );

    res.status(201).json({
      message: 'Product uploaded successfully',
      product: newProduct[0]
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      try {
        await fs.unlink(path.join(uploadsDir, req.file.filename));
      } catch (err) {
        console.error('Failed to delete uploaded file:', err);
      }
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    });
  }
});

// Get products by category with validation
productRouter.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category: ${category}`,
        validCategories: validCategories
      });
    }

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
        category,
        created_at AS createdAt
      FROM products 
      WHERE category = ? 
      ORDER BY created_at DESC
    `, [category]);

    res.json({
      status: 'success',
      count: products.length,
      data: {
        category: category,
        products: products
      }
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    });
  }
});

// Mount product router
app.use('/api/products', productRouter);

// ======================
// Error Handling
// ======================

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    error: 'Not Found',
    message: `The requested resource ${req.path} was not found`
  });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      error: 'File upload error',
      message: err.message
    });
  }
  
  res.status(500).json({
    status: 'error',
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// ======================
// Server Initialization
// ======================

async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Check if products table exists
    const [tables] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'products'
    `, [process.env.MYSQLDATABASE || 'railway']);
    
    if (tables[0].count === 0) {
      const schemaPath = path.resolve(__dirname, 'database.sql');
      const schema = await fs.readFile(schemaPath, 'utf8');
      const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);
      
      for (const query of queries) {
        await connection.query(query);
      }
      console.log('✅ Database schema initialized');
    }
    
    isDatabaseConnected = true;
    console.log('✅ Database connection verified');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    isDatabaseConnected = false;
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function startServer() {
  try {
    await ensureUploadsDir();
    await initializeDatabase();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`➡️ Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        pool.end(() => {
          console.log('Server and database pool closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('🚨 Failed to start server:', error);
    process.exit(1);
  }
}

startServer();