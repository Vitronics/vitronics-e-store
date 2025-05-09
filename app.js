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

const app = express();
const port = process.env.PORT || 3000;

// Security and Performance Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vitronics-e-store-production.up.railway.app']
    : '*',
  methods: ['GET', 'POST'],
  credentials: true
};
app.use(cors(corsOptions));

// Database connection pool with Railway ENV variables
const pool = mysql.createPool({
  
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'mysql',
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'myapp',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });


    //   DB_PORT=3306
    //   DB_USER=root
    //   DB_PASSWORD=EMbJsOLDqrTEfMxwTAZkkspIJeDxuECy
    //   DB_NAME=railway
    //   DB_HOST=mysql.railway.internal


// Initialize database schema
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    const schemaPath = path.resolve(__dirname, 'database.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Split and execute queries sequentially
    const queries = schema.split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);
    
    for (const query of queries) {
      await connection.query(query);
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1); // Exit if DB setup fails
  } finally {
    if (connection) connection.release();
  }
}

// File upload configuration
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
    cb(new Error('Error: Images only!'));
  }
});

// Serve static files
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '1y',
  immutable: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Product routes
const productRouter = express.Router();

// Valid product categories
const validCategories = [
  'controller', 'plc', 'sensor', 'actuator', 'motors', 'enclosure',
  'relay', 'switch', 'cables', 'drives', 'microcontroller', 'protection', 'display'
];

// Upload product
productRouter.post('/:category', upload.single('product_image'), async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category: ${category}`,
        validCategories
      });
    }

    const requiredFields = ['product_name', 'price', 'quantity'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    const { product_name, price, quantity, voltage, current, supply, sensor } = req.body;
    
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
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get products by category
productRouter.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category: ${category}`,
        validCategories
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
        category
      FROM products 
      WHERE category = ? 
      ORDER BY created_at DESC
    `, [category]);

    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Mount product router
app.use('/api/products', productRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
async function startServer() {
  await ensureUploadsDir();
  await initializeDatabase();
  
  app.listen(port, () => {
    console.log(`🌐 Server running on port ${port}`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});