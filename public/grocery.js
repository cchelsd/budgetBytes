// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function() {

    var selectedOption = 'none';
    //FIGURE OUT WAY TO NOT ALLOW DUPLICATE ADDS?? MAYBE THROW ERROR OR COMBINE # OF ITEMS ??
    $(function hideOthers() {
        $(".crudInput").hide();
        $("#theList").hide();
    });

    $("#addButton").on("click", function(e) {
        e.preventDefault();

        selectedOption = 'add';

        //hide other elements that could potentially be visible
        $("#updateName").hide();
        $("#updateQuantity").hide();
        $("#deleteName").hide();
        $("#deleteQuantity").hide();

        
        //show the elements that correspondto this button
        $("#addName").show();
        $("#addQuantity").show();
    });

    $("#updateButton").on("click", function(e) {
        e.preventDefault();

        selectedOption = 'update';

        //hide other elements that could potentially be visible
        $("#addName").hide();
        $("#addQuantity").hide();
        $("#deleteName").hide();
        $("#deleteQuantity").hide();

        //show the elements that correspondto this button
        $("#updateName").show();
        $("#updateQuantity").show();
    });

    $("#deleteItemButton").on("click", function(e) {
        e.preventDefault();

        selectedOption = 'deleteItem';

        //hide other elements that could potentially be visible
        $("#updateName").hide();
        $("#updateQuantity").hide();
        $("#addName").hide();
        $("#addQuantity").hide();

        //show the elements that correspondto this button
        $("#deleteName").show();
        $("#deleteQuantity").show();
    });

    //this syntax ensures that a window.confirm alert does not appear twice
    $("#deleteListButton").off("click").on("click", function(e) {
        e.preventDefault();

        if (window.confirm("delete entire grocery list?")) {
            //delete list
            selectedOption = 'deleteList';
        } 
        //else, do not change anything
    });

    // Ask the user to log in to view their grocery list - determine if they have an account
    // Get the userLogID value and store it in localStorage
    //this syntax ensures that an alert does not appear twice
    $("#loginButton").off("click").on("click", async function(e) {
        e.preventDefault();
        const userLogID = document.getElementById('idBox').value;
        if (userLogID) {
            //ensure that the ID is associated with an account
            verifyUser(userLogID);
        } else {
            alert("Please enter your user ID number to continue");
        }
    });

    //this syntax ensures that an alert does not appear twice
    $("#listChoice").off("click").on("click", function(e) {
        if (selectedOption === 'add') {
            handleAddingItemToList(e);
        } else if (selectedOption === 'update') {
            handleUpdatingListItem(e);
        } else if (selectedOption === 'deleteItem') {
            console.log("selected option matched to delete item");
            handleDeletingListItem(e);
        } else if (selectedOption === 'deleteList') {
            console.log("selected option matched to delete list");
            handleDeletingList(e);
        } else {
            alert("Please select one of the four options to continue.");
        }
    });

    //
    //verify that the user has an account
    async function verifyUser(userLogID) {
        try {
            const response = await fetch(`http://localhost:3000/user/${userLogID}`); 
            if (response.ok) {
                // Fetch user's grocery list
                fetchGroceryList(userLogID);
                // Store the user ID in localStorage after fetching the list
                localStorage.setItem('currentUserLogID', userLogID);
            } else {
                //the user does not have an account - they must register to use this feature
                $("#loginMessageOutput").text('You are not currently registered. Please visit the \'Chat with Budget Bytes\' page to use this feature.');
            }
        } catch (error) {
            console.error('Error:', error);
            $("#loginMessageOutput").text('Error fetching data');
        }
    }

    // Get user's grocery list from database
    async function fetchGroceryList(userLogID) {
        try {
            const response = await fetch(`http://localhost:3000/groceryList/${userLogID}`, {
                "Access-Control-Allow-Origin" : "*" 
            }); 
            if (response.ok) {
                const groceryList = await response.json();
                displayGroceryList(groceryList);
                $(".listOptions").show();
                $("#theList").show();
                $(".idSubmission").hide();
                $("#loginHeader").hide();
            } else {
                $("#loginMessageOutput").text('User\'s grocery list not found or error retrieving list');
            }
        } catch (error) {
            console.error('Error:', error);
            $("#loginMessageOutput").text('Error fetching data');
        }
    }

    // Function to display the user's grocery list
    function displayGroceryList(groceryList) {
        if (groceryList.recordset[0] && groceryList.recordset.length > 0) {
            $("#groceryEmptyStatus").hide();
            $('ul').empty();
            $.each(groceryList.recordset, function (index, listItem) {
                $("#groceryListDisplay").append('<li class="list-group-item displayItem"> Item: ' + groceryList.recordset[index].itemName + '<br> <span class="displayQuantity"> Quantity: ' + groceryList.recordset[index].itemQuantity + '</span></li>');
            });
        } else {
            $("#groceryEmptyStatus").show();
        }
    }

    // Handle adding item to grocery list
    async function handleAddingItemToList(e) {
        e.preventDefault();

        // Gather form input values
        const userLogID = document.getElementById('idBox').value;
        const itemName = document.getElementById('addNameInput').value;
        const itemQuantity = document.getElementById('addQuantityInput').value;

        // Create a grocery list item
        const groceryListItem = {
            itemName: itemName,
            itemQuantity: itemQuantity
        };

        try {
            // Send a POST request to add to the user's grocery list
            const response = await fetch('http://localhost:3000/groceryList/' + userLogID, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groceryListItem)
            });

            if (response.ok) {
                $("#groceryEmptyStatus").hide();
                $("#optionMessageOutput").text('Item added to list!');
                fetchGroceryList(userLogID);
            } else {
                const errorResponse = await response.json();
                $("#optionMessageOutput").text('Error adding item to list - ' + errorResponse.error);
            }
        } catch (error) {
            console.error('Error:', error);
            $("#optionMessageOutput").text('Network error.');
        }
    }

    // Handle updating item in grocery list
    async function handleUpdatingListItem(e) {
        e.preventDefault();

        // Gather form input values
        const userLogID = document.getElementById('idBox').value;
        const itemName = document.getElementById('updateNameInput').value;
        const itemQuantity = document.getElementById('updateQuantityInput').value;

        // Create a grocery list item
        const groceryListItem = {
            itemName: itemName,
            itemQuantity: itemQuantity
        };

        try {
            // Send a PUT request to update item in grocery list
            const response = await fetch('http://localhost:3000/groceryList/' + userLogID, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'userIDGroceryList' : userLogID, 'itemToUpdate': groceryListItem.itemName },
                body: JSON.stringify(groceryListItem)
            });

            if (response.ok) {
                $("#optionMessageOutput").text('Item updated in list!');
                fetchGroceryList(userLogID);
            } else {
                const errorResponse = await response.json();
                $("#optionMessageOutput").text('Error updating item in list -' + errorResponse.error);
            }
        } catch (error) {
            console.error('Error:', error);
            $("#optionMessageOutput").text('Network error.');
        }
    }

     // Handle deleting item from grocery list
    async function handleDeletingListItem(e) {
        e.preventDefault();

        // Gather form input values
        const userLogID = document.getElementById('idBox').value;
        const itemName = document.getElementById('deleteNameInput').value;

        console.log("item to delete: " + itemName );

        try {
            // Send a DELETE request to delete from the user's grocery list
            const response = await fetch('http://localhost:3000/groceryList/' + userLogID + "/" + itemName, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'userIDGroceryList' : userLogID, 'itemToDelete': itemName }
            });

            if (response.ok) {
                $("#optionMessageOutput").text('Item deleted from list');
                fetchGroceryList(userLogID);
            } else {
                const errorResponse = await response.json();
                $("#optionMessageOutput").text('Error deleting item from list - ' + errorResponse.error);
            }
        } catch (error) {
            console.error('Error:', error);
            $("#optionMessageOutput").text('Network error.');
        }
    }

     // Handle deleting user's entire grocery list
    async function handleDeletingList(e) {
        e.preventDefault();

        // Gather form input values
        const userLogID = document.getElementById('idBox').value;

        try {
            // Send a DELETE request to delete entire grocery list
            const response = await fetch('http://localhost:3000/groceryList/' + userLogID, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'userIDGroceryList' : userLogID }
            });
            if (response.ok) {
                $("#optionMessageOutput").text('List deleted');
                fetchGroceryList(userLogID);
            } else {
                const errorResponse = await response.json();
                $("#optionMessageOutput").text('Error deleting list - - ' + errorResponse.error);
            }
        } catch (error) {
            console.error('Error:', error);
            $("#optionMessageOutput").text('Network error.');
        }
    }
});
