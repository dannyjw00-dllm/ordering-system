const socket = io();

const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(orderForm);
    const orderData = {
        customerName: formData.get('customerName'),
        tableNumber: formData.get('tableNumber'),
        items: formData.get('items'),
        notes: formData.get('notes')
    };

    // Emit event to server
    socket.emit('new_order', orderData);

    // Reset form and give feedback
    orderForm.reset();
    alert('Order placed successfully!');
});
