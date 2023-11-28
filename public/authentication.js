document.addEventListener('DOMContentLoaded', function() {
    const newUserButton = document.getElementById('newUserButton');
    const returningUserButton = document.getElementById('returningUserButton');
    const newUserFormContainer = document.getElementById('newUserFormContainer');
    const returningUserFormContainer = document.getElementById('returningUserFormContainer');
    const returningResult = document.getElementById('returningResult');
    const returningUserForm = document.getElementById('returningUserForm');
    const newUserForm = document.getElementById('newUserForm');
    const checkCodeButton = document.getElementById('checkCodeButton');
    const codeCheckResult = document.getElementById('codeCheckResult');
    const userLogIDInput = document.getElementById('userLogID');

     // Clear messages and reset button state when the user changes the 4-digit code
     userLogIDInput.addEventListener('input', function() {
        codeCheckResult.innerText = '';
    });

     // Event listener for the Check Code Button
     checkCodeButton.addEventListener('click', async function() {
        const userLogID = userLogIDInput.value;
        if (userLogID && userLogID.length === 4) {
            const available = await checkUserLogIDAvailability(userLogID);
            codeCheckResult.innerText = available ? '4-digit code is available.' : 'This 4-digit code already exists.';
        } else {
            codeCheckResult.innerText = 'Please enter a valid 4-digit code.';
        }
    });

    // Toggle Form Visibility
    newUserButton.addEventListener('click', () => toggleForms('new'));
    returningUserButton.addEventListener('click', () => toggleForms('returning'));

    // Toggle function for forms
    function toggleForms(formType) {
        newUserFormContainer.style.display = formType === 'new' ? 'block' : 'none';
        returningUserFormContainer.style.display = formType === 'returning' ? 'block' : 'none';
    }

    // New User Form Submission
    if (newUserForm) {
        newUserForm.addEventListener('submit', handleNewUserFormSubmission);
    }

    // Returning User Form Submission
    returningUserForm.addEventListener('submit', handleReturningUserFormSubmission);

    // Handle New User Form Submission
    async function handleNewUserFormSubmission(e) {
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
    }

    // Handle Returning User Form Submission
    async function handleReturningUserFormSubmission(event) {
        event.preventDefault();
        const userLogID = document.getElementById('returningUserLogID').value;
        if (userLogID) {
            fetchUserData(userLogID);
        }
    }

    // Fetch User Data
    async function fetchUserData(userLogID) {
        try {
            const response = await fetch(`http://localhost:3000/user/${userLogID}`);
            if (response.ok) {
                const userData = await response.json();
                displayUserData(userData);
            } else {
                returningResult.textContent = 'User not found or error fetching data';
            }
        } catch (error) {
            console.error('Error:', error);
            returningResult.textContent = 'Error fetching data';
        }
    }

    // Function to check if userLogID is available
    async function checkUserLogIDAvailability(userLogID) {
        try {
            const response = await fetch(`http://localhost:3000/user/${userLogID}`);
            const data = await response.json();
            if (data.recordsets && data.recordsets[0].length === 0) {
                return true; // User ID does not exist, hence available
            } else {
                return false; // User ID exists, hence not available
            }
        } catch (error) {
            console.error('Error checking userLogID:', error);
            return false; // Assume not available if there's a network error
        }
    }

    function displayUserData(userData) {
        if (userData.recordset && userData.recordset.length > 0) {
            const userPrefs = userData.recordset[0];
            const prefsHtml = `
                <ul>
                    <li>Vegan: ${userPrefs.isVegan}</li>
                    <li>Vegetarian: ${userPrefs.isVegetarian}</li>
                    <li>Dairy Free: ${userPrefs.isDairyFree}</li>
                    <li>Low Carb: ${userPrefs.isLowCarb}</li>
                    <li>Pescetarian: ${userPrefs.isPescetarian}</li>
                </ul>
            `;
            returningResult.innerHTML = `<strong>Dietary Preferences:</strong> ${prefsHtml}`;
        } else {
            returningResult.textContent = 'No dietary preferences found for this user.';
        }
    }
});


