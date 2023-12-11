// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function() {
    // Get references to various HTML elements by their IDs
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

    // Get a reference to the "Submit" button for new user registration
    const newUserSubmitButton = document.getElementById('newUserSubmit');

    // Get the userLogID value from the returning user form and store it in localStorage
    const userLogID = document.getElementById('returningUserLogID').value;
    localStorage.setItem('currentUserLogID', userLogID); // Store the user ID

    // Initially disable the submit button for new user registration
    newUserSubmitButton.disabled = true;

    // Clear messages and reset button state when the user changes the 4-digit code
    userLogIDInput.addEventListener('input', function() {
        codeCheckResult.innerText = '';
        newUserSubmitButton.disabled = true; // Disable the submit button when the input changes
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

    // Toggle Form Visibility when clicking the "New User" or "Returning User" buttons
    newUserButton.addEventListener('click', () => toggleForms('new'));
    returningUserButton.addEventListener('click', () => toggleForms('returning'));

    // Function to toggle the visibility of new and returning user forms
    function toggleForms(formType) {
        newUserFormContainer.style.display = formType === 'new' ? 'block' : 'none';
        returningUserFormContainer.style.display = formType === 'returning' ? 'block' : 'none';
    }

    // Add a submission event listener for the New User Form
    if (newUserForm) {
        newUserForm.addEventListener('submit', handleNewUserFormSubmission);
    }

    // Add a submission event listener for the Returning User Form
    returningUserForm.addEventListener('submit', handleReturningUserFormSubmission);

    // Handle submission of the New User Form
    async function handleNewUserFormSubmission(e) {
        e.preventDefault();

        // Gather form input values
        const userLogID = document.getElementById('userLogID').value;
        const isVegan = document.querySelector('input[name="isVegan"]').checked;
        const isVegetarian = document.querySelector('input[name="isVegetarian"]').checked;
        const isDairyFree = document.querySelector('input[name="isDairyFree"]').checked;
        const isLowCarb = document.querySelector('input[name="isLowCarb"]').checked;
        const isPescetarian = document.querySelector('input[name="isPescetarian"]').checked;

        // Create a user data object
        const userData = {
            userLogID,
            isVegan: isVegan.toString(),
            isVegetarian: isVegetarian.toString(),
            isDairyFree: isDairyFree.toString(),
            isLowCarb: isLowCarb.toString(),
            isPescetarian: isPescetarian.toString()
        };

        try {
            // Send a POST request to the server to register the new user
            const response = await fetch('http://localhost:3001/user/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                document.getElementById('result').innerText = 'User successfully registered.';
            } else {
                const errorResponse = await response.json();
                document.getElementById('result').innerText = 'Error in registration: ' + errorResponse.error;
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('result').innerText = 'Network error.';
        }
    }

    // Handle submission of the Returning User Form
    async function handleReturningUserFormSubmission(event) {
        event.preventDefault();
        const userLogID = document.getElementById('returningUserLogID').value;
        if (userLogID) {
            // Fetch user data from the server
            fetchUserData(userLogID);
            // Store the user ID in localStorage after fetching user data
            localStorage.setItem('currentUserLogID', userLogID);
        }
    }

    // Fetch user data from the server
    async function fetchUserData(userLogID) {
        try {
            const response = await fetch(`http://localhost:3001/user/${userLogID}`);
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
            const response = await fetch(`http://localhost:3001/user/${userLogID}`);
            const data = await response.json();
            if (data.recordsets && data.recordsets[0].length === 0) {
                newUserSubmitButton.disabled = false; // Enable the submit button
                return true; // User ID does not exist, hence available
            } else {
                newUserSubmitButton.disabled = true; // Keep the submit button disabled
                return false; // User ID exists, hence not available
            }
        } catch (error) {
            console.error('Error checking userLogID:', error);
            codeCheckResult.innerText = 'Error occurred while checking code.';
            newUserSubmitButton.disabled = true; // Keep the submit button disabled
            return false;
        }
    }

    // Function to display user data in the returning user form
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
