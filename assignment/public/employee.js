document.addEventListener('DOMContentLoaded', function() {
    fetch('/employees')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('employee-table').querySelector('tbody');
            data.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.role}</td>
                    <td>${employee.contactNumber}</td>
                    <td>${employee.datejoin}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function goToEmployeePage() {
    window.location.href = '/findemployee.html';
}



  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('employeeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const employeeId = document.getElementById('employeeid').value;
        fetch(`/employees/${employeeId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Employee not found');
                }
                return response.json();
            })
            .then(data => {
                const detailsContainer = document.getElementById('employee-details');
                detailsContainer.innerHTML = `
                    <h2>Employee Details</h2>
                    <div><strong>ID:</strong> ${data.id}</div>
                    <div><strong>Name:</strong> ${data.name}</div>
                    <div><strong>Role:</strong> ${data.role}</div>
                    <div><strong>Contact Number:</strong> ${data.contactNumber}</div>
                    <div><strong>Date Join:</strong> ${data.datejoin}</div>
                `;
            })
            .catch(error => {
                document.getElementById('employee-details').innerText = error.message;
            });
    });
});