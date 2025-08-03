// --- IMPORTANT ---
// PASTE THE WEB APP URL YOU COPIED FROM GOOGLE APPS SCRIPT HERE
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypDV3ZPX64vY5RmVSZ43slrvbHmsXaSF3EbaC0S3usMY-6DCbX_hy6eLXZOCghM2fL1A/exec';

const form = document.getElementById('budget-form');
const submitButton = document.getElementById('submit-button');
const statusMessage = document.getElementById('status-message');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop the form from submitting the traditional way

    submitButton.disabled = true;
    statusMessage.textContent = 'Submitting...';

    // Get the form data
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const type = document.querySelector('input[name="type"]:checked').value;

    const data = { description, amount, type };

    // Send the data to our Google Apps Script
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors', // Important for cross-origin requests
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Apps Script web apps need text/plain
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.result === 'success') {
            statusMessage.textContent = '✅ Transaction added successfully!';
            form.reset(); // Clear the form
        } else {
            throw new Error(data.message || 'An unknown error occurred.');
        }
    })
    .catch(error => {
        statusMessage.textContent = `❌ Error: ${error.message}`;
        console.error('Error!', error.message);
    })
    .finally(() => {
        submitButton.disabled = false;
        // Clear the success/error message after a few seconds
        setTimeout(() => {
            statusMessage.textContent = '';
        }, 4000);
    });
});