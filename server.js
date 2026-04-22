const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Base de datos en memoria (se reinicia al apagar el servidor)
const productsDb = [
    { id: 1, name: 'Smartwatch Pro X', price: 159.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80', category: 'Wearables' },
    { id: 2, name: 'Auriculares Noise-Cancelling', price: 299.00, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80', category: 'Audio' },
    { id: 3, name: 'Teclado Mecánico RGB', price: 89.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500&q=80', category: 'Gaming' },
    { id: 4, name: 'Cámara Mirrorless 4K', price: 850.00, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80', category: 'Fotografía' },
    { id: 5, name: 'Mouse Gamer Inalámbrico', price: 65.00, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80', category: 'Periféricos' },
    { id: 6, name: 'Lámpara de Escritorio LED', price: 45.00, image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=500&q=80', category: 'Oficina' },
    { id: 7, name: 'Mochila Tech Impermeable', price: 75.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80', category: 'Accesorios' },
    { id: 8, name: 'Set de Lentes para Smartphone', price: 35.00, image: 'https://images.unsplash.com/photo-1617033934812-eb79e96536d4?auto=format&fit=crop&w=500&q=80', category: 'Fotografía' }
];

const usersDb = [
    { id: 1, email: 'admin@techstore.com', password: '123456', name: 'Admin Tech' }
];

// --- API ENDPOINTS ---

// Obtener productos
app.get('/api/products', (req, res) => {
    res.json(productsDb);
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = usersDb.find(u => u.email === email && u.password === password);
    
    if (user) {
        const { password, ...safeUser } = user;
        res.json({ message: 'Login exitoso', user: safeUser });
    } else {
        res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
});

// Registro de nuevos usuarios
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const exists = usersDb.find(u => u.email === email);
    if (exists) {
        return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const newUser = {
        id: usersDb.length + 1,
        name,
        email,
        password 
    };

    usersDb.push(newUser);
    const { password: pw, ...safeUser } = newUser;
    res.status(201).json({ message: 'Usuario creado', user: safeUser });
});

// Pedidos
app.post('/api/orders', (req, res) => {
    const { userId, items, total } = req.body;
    console.log(`[PEDIDO] Usuario ${userId} compró total $${total}`);
    res.status(201).json({ message: 'Pedido procesado' });
});

// Ruta por defecto que sirve el frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});