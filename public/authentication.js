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
        isVegan,
        isVegetarian,
        isDairyFree,
        isLowCarb,
        isPescetarian
    };

    try {
        const response = await fetch('/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            document.getElementById('result').innerText = 'User successfully registered.';
        } else {
            document.getElementById('result').innerText = 'Error in registration.';
        }
    } catch (error) {
        document.getElementById('result').innerText = 'Network error.';
    }
});
