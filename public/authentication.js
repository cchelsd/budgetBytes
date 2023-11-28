document.addEventListener('DOMContentLoaded', function() {
    const newUserButton = document.getElementById('newUserButton');
    const returningUserButton = document.getElementById('returningUserButton');
    const newUserFormContainer = document.getElementById('newUserFormContainer');
    const returningUserFormContainer = document.getElementById('returningUserFormContainer');
    const returningResult = document.getElementById('returningResult');
    const returningUserForm = document.getElementById('returningUserForm');
    const returningUserLogIDInput = document.getElementById('returningUserLogID');

    // Event listener for New User button
    newUserButton.addEventListener('click', function() {
        newUserFormContainer.style.display = 'block';
        returningUserFormContainer.style.display = 'none';
    });

    // Event listener for Returning User button
    returningUserButton.addEventListener('click', function() {
        newUserFormContainer.style.display = 'none';
        returningUserFormContainer.style.display = 'block';
    });

// Returning User Form Submission
returningUserForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const userLogID = returningUserLogIDInput.value;

    if (!userLogID || userLogID.length !== 4 || isNaN(userLogID)) {
        alert("Please enter a valid 4-digit code.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/user/${userLogID}`, { method: 'GET' });
        if (response.ok) {
            const userData = await response.json();
            if (userData) {
                // Assuming userData contains properties like isVegan, isVegetarian, etc.
                const isVegan = userData.isVegan === 'true' ? 'Yes' : 'No';
                const isVegetarian = userData.isVegetarian === 'true' ? 'Yes' : 'No';
                const isDairyFree = userData.isDairyFree === 'true' ? 'Yes' : 'No';
                const isLowCarb = userData.isLowCarb === 'true' ? 'Yes' : 'No';
                const isPescetarian = userData.isPescetarian === 'true' ? 'Yes' : 'No';
                
                returningResult.innerText = `Dietary Preferences: Vegan: ${isVegan}, Vegetarian: ${isVegetarian}, Dairy-Free: ${isDairyFree}, Low Carb: ${isLowCarb}, Pescetarian: ${isPescetarian}`;
                
            } else {
                alert('User not found. Please check your code.');
            }
        } else {
            alert('User not found. Please check your code.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data');
    }
});


    // New User Form Submission
    const newUserForm = document.getElementById('newUserForm');
    if (newUserForm) {
        newUserForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const userLogID = document.getElementById('userLogID').value;
            const isVegan = document.querySelector('input[name="isVegan"]').checked;
            const isVegetarian = document.querySelector('input[name="isVegetarian"]').checked;
            const isDairyFree = document.querySelector('input[name="isDairyFree"]').checked;
            const isLowCarb = document.querySelector('input[name="isLowCarb"]').checked;
            const isPescetarian = document.querySelector('input[name="isPescetarian"]').checked;

            const userData = {
                userLogID,
                isVegan: isVegan.toString(),
                isVegetarian: isVegetarian.toString(),
                isDairyFree: isDairyFree.toString(),
                isLowCarb: isLowCarb.toString(),
                isPescetarian: isPescetarian.toString()
            };

            try {
                const response = await fetch('http://localhost:3000/user/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    document.getElementById('result').innerText = 'User successfully registered.';
                } else {
                    const errorResponse = await response.json();
                    console.error(errorResponse);
                    document.getElementById('result').innerText = 'Error in registration: ' + errorResponse.error;
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('result').innerText = 'Network error.';
            }
        });
    }
});