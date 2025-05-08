const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

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
    limits: { fileSize: 12 * 1024 * 1024 } // Match frontend's 12MB limit
});

// Enable CORS and JSON parsing
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory
app.use('/uploads', express.static('uploads'));

// Fixed categories to match form values
let products = {
    controller: [],
    plc: [],
    sensor: [],
    actuator: [],
    motors: [],
    enclosure: [],
    relay: [],
    switch: [],
    cables: [],
    drives: [],
    microcontroller: [],
    protection: [],
    display: []
};

// Serve upload form
app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/upload.html'));
});

const productRoutes = require('./api/controller');
app.use('/api', productRoutes);

// Upload endpoint
app.post('/api/upload/:category', upload.single('product_image'), (req, res) => {
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
        
        if (!products.hasOwnProperty(category)) {
            return res.status(400).json({ 
                error: `Invalid category: ${category}`,
                validCategories: Object.keys(products)
            });
        }

        // Validate required fields
        if (!product_name || !price || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProduct = {
            id: Date.now(),
            name: product_name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            // voltage: voltage || null,
            // current: current || null,
            // supply: supply || null,
            // sensor: sensor || null,
            imageUrl: `/uploads/${req.file.filename}`,
            category
        };

        products[category].push(newProduct);

        res.status(201).json({
            message: 'Product uploaded successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get products by category
app.get('/api/upload/:category', (req, res) => {
    const { category } = req.params;
    if (!products[category]) {
        return res.status(404).json({ error: 'Category not found' });
    }
    res.json(products[category]);
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
    console.log('Required directory structure:');
    console.log('├── public/    # Contains upload.html and category pages');
    console.log('└── uploads/   # For storing product images');
});