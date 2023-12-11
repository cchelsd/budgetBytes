async function fetchOtherRecipes(userID) {
    const response = await fetch(`http://localhost:3001/explore/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const otherRecipes = await response.json();   
    return otherRecipes;
}

async function fetchAllRecipes() {
    const response = await fetch(`http://localhost:3001/history/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const otherRecipes = await response.json();   
    const recipes = otherRecipes[0];  
    return recipes;
}

async function fetchOtherFavorites() {
    const response = await fetch(`http://localhost:3001/explore/favorites/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();   
    const recipes = data[0];  
    return recipes;
}

async function fetchUserPreferences(userID) {
    const response = await fetch(`http://localhost:3001/user/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = response.json();
    console.log(data);
    return data;
}

async function displayRecipeCards(userID) {
    $(".recipeCards").empty();
    let recipes;
    if (userID !== "") {
        $("#msgContainer").empty();
        const fetchedData = await fetchUserPreferences(userID);
        const preferences = (fetchedData.recordset)[0];
        recipes = await fetchOtherRecipes(userID);
        const message = constructMessage(preferences);
        console.log(message);
        $("#msgContainer").append(`<h4>${message}</h4>`);
        
    } else {
        recipes = await fetchAllRecipes();
    }
    recipes.forEach(recipe => {
        const recipeCard = $("<div>").addClass("recipe-card")
        const recipeDetails = $("<div>").addClass("recipe-details");
        
        // Parse HTML content for ingredients
        const ingredientsList = $('<div>').append('<p>').html(recipe.recipe.ingredients);
        const ingredientItems = ingredientsList.find('li');

        // Extract and append ingredients to the final ingredients list
        const finalIngredientsList = $('<ul>');
        ingredientItems.each(function() {
            const ingredient = $('<li>').text($(this).text());
            finalIngredientsList.append(ingredient);
        });

        // Parse HTML content for instructions
        const instructionsList = $('<ol>').html(recipe.recipe.instructions);
        const instructionItems = instructionsList.find('li');

        // Extract and append instructions to the final instructions list
        const finalInstructionsList = $('<ol>');
        instructionItems.each(function() {
            const instruction = $('<li>').text($(this).text());
            finalInstructionsList.append(instruction);
        });

        // Add recipe name, ingredients list, and instructions list to recipe details
        recipeDetails.append(`<p>${recipe.recipe.name}</p>`);
        recipeDetails.append('<h4>Ingredients:</h4>').append(ingredientsList);
        recipeDetails.append('<h4>Instructions:</h4>').append(finalInstructionsList);

        // Attach ingredients and instructions data to the recipe card element
        recipeCard.data("ingredients", ingredientsList.clone());
        recipeCard.data("instructions", finalInstructionsList.clone());
        
        // Append the created recipe details to the card
        recipeCard.on("click", () => handleRecipeSelection(recipeCard));
        recipeCard.append(recipeDetails);
        $('.recipeCards').append(recipeCard);
    });
}

function getRecipes() {

}

function createMenu() {
    const items = $("<ul>").addClass("nav nav-pills flex-column").attr("id", "myTab").attr("role", "tablist");
    const title = $("<li>").addClass("nav-item").append($("<h4>Recipes</h4>"));
    items.append(title);
    const allTab = $("<li>").addClass("nav-item");
    const allLink = $("<a>", {id: `allHistoryTab`, class: "nav-link active", "data-bs-toggle": "pill", "href": `#allHistoryContent`, "role": "tab", "aria-controls": `allHistory`}).text('All');
    allTab.append(allLink);
    items.append(allTab);

    const byPrefTab = $("<li>").addClass("nav-item");
    const byPrefLink = $("<a>", {id: `byPrefTab`, class: "nav-link active", "data-bs-toggle": "pill", "href": `#byPrefContent`, "role": "tab", "aria-controls": `byPref`}).text('By Preference');
    byPrefTab.append(byPrefLink);
    items.append(byPrefTab);

    const favesByPrefTab = $("<li>").addClass("nav-item");
    const favesByPrefLink = $("<a>", {id: `favesByPrefTab`, class: "nav-link active", "data-bs-toggle": "pill", "href": `#favesByPrefContent`, "role": "tab", "aria-controls": `favesVyPref`}).text('Popular Recipes By Preference');
    favesByPrefTab.append(favesByPrefLink);
    items.append(favesByPrefTab);
    
    $('#collectionsMenu').append(items);
}

function constructMessage(obj) {
    count = 0;
    let resultString = "Here are "
    let preferences = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== 'userLogID' && obj[key] === 'true') {
            if (key === 'isDairyFree') {
                preferences.push("dairy free");
            } else if (key === 'isLowCarb') {
                preferences.push("Low carb");
            } else {
                preferences.push(key.substring(2).toLowerCase());
            }
        }
    }
    if (preferences.length === 1) {
        resultString += preferences[0];
    } else if (preferences.length === 2) {
        resultString += preferences.join(" & ");
    } else {
        resultString += preferences.slice(0, -1).join(", ") + ", and " + preferences.slice(-1);
    }
    resultString += " recipes from other Budget Bytes users"
    return resultString;
}

 /**
 * Display a more detailed recipe card about the selected recipe in a modal.
 * @param {Object} selectedRecipe - The selected recipe object containing its details.
 */
 function handleRecipeSelection(selectedRecipe) {
    const name = selectedRecipe.find('.recipe-details > p').text();
    const ingredients = selectedRecipe.data("ingredients").clone();
    const instructions = selectedRecipe.data("instructions").clone();
    // Update the modal content with the selected recipe details
    $("#recipeName").text(name);
    $("#recipeIngredients").empty().append(ingredients);
    $("#recipeInstructions").empty().append(instructions);
    // Show the modal
    $("#recipeModal").modal("show");
}

$(document).ready(function() {
    displayRecipeCards(getCurrentUserID());
});