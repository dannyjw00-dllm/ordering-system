const socket = io();

const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(orderForm);
    // Helper to get all checked values for a name
    const getCheckedValues = (name) => {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
            .map(cb => cb.value);
    };

    const orderData = {
        customerName: formData.get('customerName'),
        portion: formData.get('portion'),
        diningType: formData.get('diningType'),
        spicyLevel: formData.get('spicyLevel'), // Radio button works same as select for FormData if checked
        withOptions: getCheckedValues('withOptions'),
        withoutOptions: getCheckedValues('withoutOptions'),
        alaCart150: getCheckedValues('alaCart150'),
        alaCart200: getCheckedValues('alaCart200'),
        paymentMethod: formData.get('paymentMethod'),
        notes: formData.get('notes'),
        timestamp: new Date() // Ensure timestamp is added for display ordering logic
    };

    // Emit event to server
    socket.emit('new_order', orderData);

    // Reset form and give feedback
    orderForm.reset();
    alert('Order placed successfully!');
});
