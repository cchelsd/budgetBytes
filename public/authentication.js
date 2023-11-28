document.getElementById('newUserForm').addEventListener('submit', async function(e) {
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



