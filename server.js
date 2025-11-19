const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for orders
let orders = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send current orders to the newly connected client
    socket.emit('update_orders', orders);

    // Handle new order
    socket.on('new_order', (orderData) => {
        const newOrder = {
            id: Date.now().toString(), // Simple ID generation
            ...orderData,
            status: 'pending',
            timestamp: new Date()
        };
        orders.push(newOrder);
        io.emit('update_orders', orders); // Broadcast to all clients
        console.log('New order received:', newOrder);
    });

    // Handle complete order
    socket.on('complete_order', (orderId) => {
        console.log(`Request to complete order: ${orderId} (Type: ${typeof orderId})`);
        const initialLength = orders.length;
        // Ensure both are strings for comparison
        orders = orders.filter(order => String(order.id) !== String(orderId));

        if (orders.length < initialLength) {
            console.log(`Order ${orderId} completed and removed.`);
        } else {
            console.log(`Order ${orderId} not found. Current orders:`, orders.map(o => o.id));
        }
        io.emit('update_orders', orders);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
