document.querySelectorAll('.product-button').forEach(button => {
    button.addEventListener('click', function() {
        const productElement = this.parentElement;
        const productName = productElement.querySelector('h2').textContent;
        const quantity = parseInt(productElement.querySelector('.quantity-input').value, 10);

        addToCart(productName,  quantity);
        alert(`${productName} has been added to the cart.`);
    });
});

function addToCart(productName,  quantity) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex > -1) {
        cart[productIndex].quantity += quantity;
    } else {
        cart.push({ name: productName,  quantity: quantity });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
}
