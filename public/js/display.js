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
                <div>
                    <span class="table-num">${order.diningType}</span>
                    <div style="font-size: 0.9em; color: #d1d5db; margin-top: 4px;">${order.customerName || 'No Name'}</div>
                </div>
                <span class="time">${timeElapsed}m ago</span>
            </div>
            <div class="card-body">
                <div class="meta-info">
                    <span class="badge-outline">📏 ${order.portion}</span>
                    <span class="badge-outline">🌶️ ${order.spicyLevel || 'No spiciness'}</span>
                    <span class="badge-outline">💳 ${order.paymentMethod || 'Unknown'}</span>
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

                ${order.alaCart150 && order.alaCart150.length > 0 ? `
                <div class="meta-group">
                    <strong>单点 (+RM1.50):</strong>
                    <div class="tags">
                        ${order.alaCart150.map(opt => `<span class="badge-outline" style="border-color: #f59e0b; color: #f59e0b;">${opt}</span>`).join('')}
                    </div>
                </div>` : ''}

                ${order.alaCart200 && order.alaCart200.length > 0 ? `
                <div class="meta-group">
                    <strong>单点 (+RM2.00):</strong>
                    <div class="tags">
                        ${order.alaCart200.map(opt => `<span class="badge-outline" style="border-color: #8b5cf6; color: #8b5cf6;">${opt}</span>`).join('')}
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
