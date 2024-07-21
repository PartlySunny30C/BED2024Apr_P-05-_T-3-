document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const response = await fetch('http://localhost:3030/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            passwordHash: password,
        }),
    });

    const messageElement = document.getElementById('login-message');
    if (response.ok) {
        messageElement.textContent = 'Login successful';
        document.getElementById('books-section').style.display = 'block';
    } else {
        messageElement.textContent = 'Login failed';
    }
});

document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    const response = await fetch('http://localhost:3030/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            passwordHash: password,
        }),
    });

    const messageElement = document.getElementById('register-message');
    if (response.ok) {
        messageElement.textContent = 'Registration successful';
    } else {
        messageElement.textContent = 'Registration failed';
    }
});

document.getElementById('fetch-books').addEventListener('click', async function () {
    const response = await fetch('http://localhost:3030/books', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';

    if (response.ok) {
        const books = await response.json();
        books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = `${book.title} by ${book.author}`;
            booksList.appendChild(li);
        });
    } else {
        booksList.innerHTML = 'Failed to fetch books';
    }
});
