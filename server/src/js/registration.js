function validateForm() {
    const playerName = document.getElementById('playerName').value;
    const playerAge = document.getElementById('playerAge').value;
    const playerPhoto = document.getElementById('playerPhoto').files[0];
    const address = document.getElementById('address').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const aadharCard = document.getElementById('aadharCard').files[0];
    const playerCategory = document.querySelector('input[name="playerCategory"]:checked');
    const playerType = document.querySelector('input[name="playerType"]:checked');

    if (!playerName || !playerAge || !playerPhoto || !address || !phoneNumber || !aadharCard || !playerCategory || !playerType) {
        alert('Please fill in all fields and select options.');
        return false;
    }

    // Additional validation can be added here

    alert('Registration successful!');
    return true;
}

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateForm()) {
        // Submit the form or perform further actions
    }
});