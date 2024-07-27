document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        console.log('Logout button clicked');
        fetch('/logout', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                alert('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('getOrderForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Get Order form submitted');
        const orderId = document.getElementById('orderIdInput').value;
        getOrderById(orderId);
    });
});

function fetchOrders() {
    console.log('Fetching all orders');
    fetch('/api/orders')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            displayOrders(data);
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function getOrderById(orderId) {
    fetch(`/api/orders/${orderId}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Order not found');
                } else {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
            }
            return response.json();
        })
        .then(order => {
            displayOrderDetails(order);
        })
        .catch(error => {
            console.error('Error fetching order:', error);
            displayErrorMessage('Order not found. Please check the order ID and try again.');
        });
}

function displayOrders(orders) {
    console.log('Orders to display:', orders); // Verify orders data

    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';

    orders.forEach(order => {
        console.log('Order:', order); // Verify each order object

        // Parse items from JSON string to JavaScript array
        let items = [];
        try {
            items = JSON.parse(order.items);
        } catch (e) {
            console.error('Error parsing items:', e);
        }

        // Ensure items is correctly formatted
        const itemsList = Array.isArray(items) && items.length > 0
            ? items.map(item => `
                <li>
                    <span class="item-name">${item.name}</span> - 
                    <span class="item-quantity">Quantity: ${item.quantity}</span>
                </li>`).join('')
            : '<li>No items available</li>';

        const orderElement = document.createElement('div');
        orderElement.className = 'order';
        orderElement.id = `order_${order.order_id}`;

        const orderDetails = `
            <h2>Order ID: ${order.order_id}</h2>
            <p>Manager: ${order.manager}</p>
            <p>Status: ${order.status}</p>
            <p>Branch Number: ${order.branch_number}</p>
            <h3>Items:</h3>
            <ul>${itemsList}</ul>
            <button class="btn deleteOrderBtn" onclick="confirmDeleteOrder('${order.order_id}')">Delete Order</button>
            <form id="updateStatusForm${order.order_id}" class="updateStatusForm">
                <input type="text" id="newStatusInput${order.order_id}" placeholder="Enter New Status" required>
                <button type="submit" class="btn updateStatusBtn">Update Status</button>
            </form>
        `;
        orderElement.innerHTML = orderDetails;
        ordersContainer.appendChild(orderElement);

        document.querySelector(`#updateStatusForm${order.order_id}`).addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Update Status form submitted for order', order.order_id);
            const newStatus = document.querySelector(`#newStatusInput${order.order_id}`).value;
            confirmUpdateOrderStatus(order.order_id, newStatus);
        });
    });
}

function displayOrderDetails(order) {
    console.log('Order details to display:', order); // Verify order details

    // Parse items from JSON string to JavaScript array
    let items = [];
    try {
        items = JSON.parse(order.items);
    } catch (e) {
        console.error('Error parsing items:', e);
    }

    const itemsList = Array.isArray(items) && items.length > 0 
        ? items.map(item => `
            <li>
                <span class="item-name">${item.name}</span> - 
                <span class="item-quantity">Quantity: ${item.quantity}</span>
            </li>`).join('') 
        : '<li>No items available</li>';

    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <h2>Order ID: ${order.order_id}</h2>
        <p>Manager: ${order.manager}</p>
        <p>Status: ${order.status}</p>
        <p>Branch Number: ${order.branch_number}</p>
        <h3>Items:</h3>
        <ul>${itemsList}</ul>
        <button class="btn deleteOrderBtn" onclick="confirmDeleteOrder('${order.order_id}')">Delete Order</button>
        <form id="updateStatusFormDetails" class="updateStatusForm">
            <input type="text" id="newStatusInputDetails" placeholder="Enter New Status" required>
            <button type="submit" class="btn updateStatusBtn">Update Status</button>
        </form>
    `;
    orderDetails.style.display = 'block';

    // Attach event listener after adding form to the DOM
    document.getElementById('updateStatusFormDetails').addEventListener('submit', function(event) {
        event.preventDefault();
        const newStatus = document.getElementById('newStatusInputDetails').value;
        confirmUpdateOrderStatus(order.order_id, newStatus);
    });
}


function clearOrderDetails() {
    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = '';
    orderDetails.style.display = 'none';
}

function displayErrorMessage(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.style.display = 'block';
        errorContainer.innerHTML = `<p class="error">${message}</p>`;
    } else {
        console.error('Error container element not found');
    }
}

function clearErrorMessage() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    } else {
        console.error('Error container element not found');
    }
}

function updateOrderStatus(orderId, newStatus) {
    fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Network response was not ok: ${response.statusText} - ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
    })
    .then(updatedOrder => {
        alert('Order status updated successfully');
        clearOrderDetails();
        fetchOrders(); 
        clearErrorMessage(); 
    })
    .catch(error => {
        console.error('Error updating order status:', error);
        displayErrorMessage('Failed to update order status. Please try again.');
    });
}

function confirmUpdateOrderStatus(orderId, newStatus) {
    if (confirm('Are you sure you want to update the order status?')) {
        updateOrderStatus(orderId, newStatus);
    } else {
        console.log('Order status update canceled');
    }
}

function deleteOrder(orderId) {
    fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        alert('Order deleted successfully');
        clearOrderDetails();
        fetchOrders();
        clearErrorMessage();
    })
    .catch(error => console.error('Error deleting order:', error));
}

function confirmDeleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        deleteOrder(orderId);
    }
}
