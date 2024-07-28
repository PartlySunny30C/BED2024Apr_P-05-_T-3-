const apiUrl = 'http://localhost:3000'; 

// Function to register a user
function registerUser() {
    const name = document.getElementById('registerName').value;
    const password = document.getElementById('registerPassword').value;

    console.log('Registering user:', name); // Debug log

    fetch(`${apiUrl}/Users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.text();
    })
    .then(message => {
        console.log('Response message:', message); // Debug log
        showMessage(`Success: ${message}`, true);
    })
    .catch(error => {
        console.error('Error:', error); // Debug log
        showMessage(`Error: ${error.message}`, false);
    });
}

// Function to log in a user
function loginUser() {
    const name = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Logging in user:', name); // Debug log

    fetch(`${apiUrl}/Users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
    })
    .then(response => {
        return response.text().then(text => {
            if (!response.ok) {
                throw new Error(text);
            }
            return text;
        });
    })
    .then(message => {
        console.log('Response message:', message); // Debug log
        showMessage(`Success: ${message}`, true);
        if (message === 'Success') { 
            window.location.href = 'homepage.html'; 
        }
    })
    .catch(error => {
        console.error('Error:', error); // Debug log
        showMessage(`Error: ${error.message}`, false);
    });
}

// Function to change password
function changePassword() {
    const name = document.getElementById('changePasswordName').value;
    const newPassword = document.getElementById('newPassword').value;

    console.log('Changing password for user:', name); // Debug log

    fetch(`${apiUrl}/Users/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, newPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Password change failed');
        }
        return response.text();
    })
    .then(message => {
        console.log('Response message:', message); // Debug log
        showMessage(`Success: ${message}`, true);
    })
    .catch(error => {
        console.error('Error:', error); // Debug log
        showMessage(`Error: ${error.message}`, false);
    });
}

// Function to display messages
function showMessage(message, isSuccess) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    messageDiv.className = isSuccess ? 'message success' : 'message error';
    messageDiv.style.display = 'block';
}

// Adding event listeners for buttons in case you want to use event listeners instead of inline onclick attributes in HTML
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerBtn').addEventListener('click', registerUser);
    document.getElementById('loginBtn').addEventListener('click', loginUser);
    document.getElementById('changePasswordBtn').addEventListener('click', changePassword);
});
