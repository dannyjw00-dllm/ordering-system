const socket = io();
const ordersGrid = document.getElementById('ordersGrid');

// Update clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Render orders
function renderOrders(orders) {
    ordersGrid.innerHTML = '';

    if (orders.length === 0) {
        ordersGrid.innerHTML = '<div class="no-orders">No active orders</div>';
        return;
    }

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';

        const timeElapsed = Math.floor((new Date() - new Date(order.timestamp)) / 60000);

        card.innerHTML = `
            <div class="card-header">
                <span class="table-num">${order.diningType}</span>
                <span class="time">${timeElapsed}m ago</span>
            </div>
            <div class="card-body">
                <div class="meta-info">
                    <span class="badge-outline">📏 ${order.portion}</span>
                    <span class="badge-outline">🌶️ ${order.spicyLevel}</span>
                </div>

                ${order.withOptions && order.withOptions.length > 0 ? `
                <div class="meta-group">
                    <strong>要 With:</strong>
                    <div class="tags">
                        ${order.withOptions.map(opt => `<span class="badge-success">${opt}</span>`).join('')}
                    </div>
                </div>` : ''}

                ${order.withoutOptions && order.withoutOptions.length > 0 ? `
                <div class="meta-group">
                    <strong>不要 Without:</strong>
                    <div class="tags">
                        ${order.withoutOptions.map(opt => `<span class="badge-danger">${opt}</span>`).join('')}
                    </div>
                </div>` : ''}

                ${order.notes ? `<p class="notes"><strong>Remarks:</strong> ${order.notes}</p>` : ''}
            </div>
            <div class="card-footer">
                <button class="btn-complete" onclick="completeOrder('${order.id}')">Complete</button>
            </div>
        `;
        ordersGrid.appendChild(card);
    });
}

// Socket events
socket.on('update_orders', (orders) => {
    renderOrders(orders);
});

// Complete order function
window.completeOrder = (orderId) => {
    if (confirm('Mark this order as complete?')) {
        socket.emit('complete_order', orderId);
    }
};
