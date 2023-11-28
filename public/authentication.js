// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('newUserForm');
//     if (form) {
//         form.addEventListener('submit', async function(e) {
//             e.preventDefault();

//             const userLogID = document.getElementById('userLogID').value;
//             const isVegan = document.querySelector('input[name="isVegan"]').checked;
//             const isVegetarian = document.querySelector('input[name="isVegetarian"]').checked;
//             const isDairyFree = document.querySelector('input[name="isDairyFree"]').checked;
//             const isLowCarb = document.querySelector('input[name="isLowCarb"]').checked;
//             const isPescetarian = document.querySelector('input[name="isPescetarian"]').checked;

//             const userData = {
//                 userLogID,
//                 isVegan: isVegan.toString(),
//                 isVegetarian: isVegetarian.toString(),
//                 isDairyFree: isDairyFree.toString(),
//                 isLowCarb: isLowCarb.toString(),
//                 isPescetarian: isPescetarian.toString()
//             };

//             try {
//                 const response = await fetch('http://localhost:3000/user/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(userData),
//                 });

//                 if (response.ok) {
//                     document.getElementById('result').innerText = 'User successfully registered.';
//                 } else {
//                     const errorResponse = await response.json();
//                     console.error(errorResponse);
//                     document.getElementById('result').innerText = 'Error in registration: ' + errorResponse.error;
//                 }
//             } catch (error) {
//                 document.getElementById('result').innerText = 'Network error.';
//             }
//         });
//     }
// });


document.addEventListener('DOMContentLoaded', function() {
    const newUserButton = document.getElementById('newUserButton');
    const returningUserButton = document.getElementById('returningUserButton');
    const newUserFormContainer = document.getElementById('newUserFormContainer');
    const returningUserFormContainer = document.getElementById('returningUserFormContainer');

    newUserButton.addEventListener('click', function() {
        newUserFormContainer.style.display = 'block'; // Show new user form
        returningUserFormContainer.style.display = 'none'; // Hide returning user form
    });

    returningUserButton.addEventListener('click', function() {
        newUserFormContainer.style.display = 'none'; // Hide new user form
        returningUserFormContainer.style.display = 'block'; // Show returning user form
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
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });
    
                    if (response.ok) {
                        document.getElementById('result').innerText = 'User successfully registered.';
                    } else {
                        const errorResponse = await response.json();
                        console.error(errorResponse);
                        document.getElementById('result').innerText = 'Error in registration: ' + errorResponse.error;
                    }
                } catch (error) {
                    document.getElementById('result').innerText = 'Network error.';
                }
            });
        }
    });


    const returningUserForm = document.getElementById('returningUserForm');
    const returningUserLogIDInput = document.getElementById('returningUserLogID');

    // Function to populate the returning user form with fetched data
    async function populateReturningUserForm(userLogID) {
        try {
            const response = await fetch(`http://localhost:3000/user/${userLogID}`, { method: 'GET' });
            if (response.ok) {
                const userData = await response.json();
                document.querySelector('input[name="isVegan"][value="' + userData.isVegan + '"]').checked = true;
                document.querySelector('input[name="isVegetarian"][value="' + userData.isVegetarian + '"]').checked = true;
                document.querySelector('input[name="isDairyFree"][value="' + userData.isDairyFree + '"]').checked = true;
                document.querySelector('input[name="isLowCarb"][value="' + userData.isLowCarb + '"]').checked = true;
                document.querySelector('input[name="isPescetarian"][value="' + userData.isPescetarian + '"]').checked = true;
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching user data');
        }
    }

    // Event listener for the returning user button to fetch current preferences
    returningUserButton.addEventListener('click', async function() {
        const userLogID = prompt("Please enter your 4-digit code:");
        if (userLogID) {
            returningUserLogIDInput.value = userLogID;
            await populateReturningUserForm(userLogID);
            newUserFormContainer.classList.add('hidden');
            returningUserFormContainer.classList.remove('hidden');
        }
    });

    // Returning User Form Submission
    if (returningUserForm) {
        returningUserForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const userLogID = returningUserLogIDInput.value;
            const updatedUserData = {
                isVegan: document.querySelector('input[name="isVegan"]').checked.toString(),
                isVegetarian: document.querySelector('input[name="isVegetarian"]').checked.toString(),
                isDairyFree: document.querySelector('input[name="isDairyFree"]').checked.toString(),
                isLowCarb: document.querySelector('input[name="isLowCarb"]').checked.toString(),
                isPescetarian: document.querySelector('input[name="isPescetarian"]').checked.toString()
            };

            try {
                const updateResponse = await fetch(`http://localhost:3000/user/${userLogID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUserData),
                });

                if (updateResponse.ok) {
                    alert('Preferences successfully updated.');
                } else {
                    throw new Error('Failed to update preferences');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating preferences');
            }
        });
    }