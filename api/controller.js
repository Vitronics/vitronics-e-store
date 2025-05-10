// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();

// // Configure multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage, limits: { fileSize: 12 * 1024 * 1024 } });

// // Category storage
// let products = {
//   controller: [], plc: [], sensor: [], actuator: [], motors: [],
//   enclosure: [], relay: [], switch: [], cables: [], drives: [],
//   microcontroller: [], protection: [], display: []
// };

// // POST /api/upload/:category
// router.post('/upload/:category', upload.single('product_image'), (req, res) => {
//   const { category } = req.params;
//   const { product_name, price, quantity, voltage, current, supply, sensor } = req.body;

//   if (!products[category]) return res.status(400).json({ error: 'Invalid category' });
//   if (!product_name || !price || !quantity) return res.status(400).json({ error: 'Missing fields' });

//   const newProduct = {
//     id: Date.now(),
//     name: product_name,
//     price: parseFloat(price),
//     quantity: parseInt(quantity),
//     voltage: voltage || null,
//     current: current || null,
//     supply: supply || null,
//     sensor: sensor || null,
//     productImage: `/uploads/${req.file.filename}`,
//     category
//   };

//   products[category].push(newProduct);
//   res.status(201).json({ message: 'Product uploaded', product: newProduct });
// });

// // GET /api/upload/:category
// router.get('/upload/:category', (req, res) => {
//   const { category } = req.params;
//   if (!products[category]) return res.status(404).json({ error: 'Category not found' });
//   res.json(products[category]);
// });

// module.exports = router;
