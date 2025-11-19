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
        // Specific Fields
        portion: formData.get('portion'),
        diningType: formData.get('diningType'),
        spicyLevel: formData.get('spicyLevel'),
        withOptions: getCheckedValues('withOptions'),
        withoutOptions: getCheckedValues('withoutOptions'),
        notes: formData.get('notes')
    };

    // Emit event to server
    socket.emit('new_order', orderData);

    // Reset form and give feedback
    orderForm.reset();
    alert('Order placed successfully!');
});
