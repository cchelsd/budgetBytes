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
    const returningResult = document.getElementById('returningResult');

    newUserButton.addEventListener('click', function() {
        newUserFormContainer.style.display = 'block';
        returningUserFormContainer.style.display = 'none';
    });

    returningUserButton.addEventListener('click', async function() {
        const userLogID = prompt("Please enter your 4-digit code:");
        if (userLogID) {
            try {
                const response = await fetch(`http://localhost:3000/user/${userLogID}`, { method: 'GET' });
                if (response.ok) {
                    const userData = await response.json();
                    // Display user's stored dietary preferences
                    returningResult.innerText = `Dietary Preferences: Vegan: ${userData.isVegan}, Vegetarian: ${userData.isVegetarian}, Dairy-Free: ${userData.isDairyFree}, Low Carb: ${userData.isLowCarb}, Pescetarian: ${userData.isPescetarian}`;
                    returningUserFormContainer.style.display = 'block';
                    newUserFormContainer.style.display = 'none';
                } else {
                    alert('User not found. Please check your code.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error fetching user data');
            }
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