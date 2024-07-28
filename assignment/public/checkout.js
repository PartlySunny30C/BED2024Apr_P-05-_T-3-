document.addEventListener('DOMContentLoaded', function() {
    const cartList = document.getElementById('cart-list');
    const form = document.getElementById('order-form');

    // Load cart items
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let cartContent = '<ul>';
        cart.forEach(item => {
            cartContent += `<li>${item.name} - Quantity: ${item.quantity}</li>`;
        });
        cartContent += '</ul>';
        cartList.innerHTML = cartContent;
    }

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const managerName = document.getElementById('manager').value;
        const branchNumber = document.getElementById('branch-number').value;

        if (!managerName || !branchNumber) {
            alert('Please fill in all fields.');
            return;
        }

        // Prepare data to send to the server
        const orderData = {
            manager: managerName,
            branch_number: branchNumber,
            items: cart
        };

        // Send data to the server
        fetch('/createorders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Order submitted successfully!');
            sessionStorage.removeItem('cart');
            form.reset(); // Clear form fields upon successful submission
            cartList.innerHTML = '<p>Your cart is empty.</p>'; 
            window.location.href = 'homepage.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your order.');
        });
    });
});
