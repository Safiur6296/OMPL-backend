// main.js
document.addEventListener('DOMContentLoaded', function() {
    const registerLink = document.getElementById('register-link');
    
    registerLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'registration.html';
    });
    
    // Additional interactive elements can be added here
});