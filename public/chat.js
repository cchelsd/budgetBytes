$(document).ready(function () {
    let message = $('#message');
    let conversation = $('#conversation');
    // when a send button is clicked to send a message
    $('button').on('click', function () {
        // capture the message value from the textbox
        var text = $('#message').val();
        // output on the console window for debugging purposes
        console.log(text);

        // get the current date and time and format time in terms of hours:minutes format
        var hnow = new Date().getHours();
        var mnow = new Date().getMinutes();
        mnow = (mnow < 10) ? ('0' + mnow) : mnow;
        var d = hnow + ":" + mnow;

        // check if the message entered by the user is not empty
        if (text.length > 0) {

            // set the border color to this style
            message.css("border", "1px solid #f4f5f9");

            // append the conversation element to include a new list item containing the (a) message, (b) time
            conversation.append("<li class='message-right'><div class='message-hour'>" + d + " <span class='ion-android-done-all'></span></div><div class='message-avatar'><div class='avatar ion-ios-person user'><img src='images/user.png' alt='User avatar' id='userAvatar'></div><div class='name'>You</div></div><div class='message-text'>" + text + "</div></li>");

            // clear the message textbox
            message.val('');

            openAPIConnect(text, d).then(function (responseData) {
                // Check for unwanted content
                if (responseData.includes("#include") || responseData.includes("printf") || responseData.includes("return 0;")) {
                    responseData = "Sorry, I didn't get that. Can you please rephrase or ask again?";
                }

                // Check for potential recipe details
                if ((responseData.includes("Ingredients:") || responseData.includes("Instructions:")) && !responseData.includes("ideas")) {
                    // Display the individual recipe details in a structured format
                    let recipeId = new Date().getTime();
                    displayRecipe(responseData, d, recipeId);
                } else {
                    // Split the responseData into lines
                    var lines = responseData.split('\n');

                    // Check and format lines containing recipe ideas as a list
                    var formattedResponse = lines.map(line => {
                        if (/^\d+\./.test(line.trim())) {
                            return "<li>" + line.trim() + "</li>";
                        }
                        return line;
                    }).join("");

                    // Display the formatted recipe recommendations
                    message.css("border", "1px solid #f4f5f9");
                    conversation.append("<li class='message-left'><div class='message-hour'>" + d + " <span class='ion-android-done-all'></span></div><div class='message-avatar'><div class='avatar ion-ios-person .bot'><img src='images/logo.png' alt='chatGPT avatar' id='chatGPTAvatar'></div><div class='name'>chatGPT</div></div><div class='message-text'><ul id=recipeIdeas>" + formattedResponse + "</ul></div></li>");
                    message.val('');
                }
                console.log(responseData);
            }).catch(function (reason) {
                console.log(reason);
            });

            // adjust the widget converation such that it the recent messages are shown below and earlier ones scroll up
            // $('.widget-conversation').scrollTop($('ul li').last().position().top + $('ul li').last().height());
            $('.widget-conversation').scrollTop(conversation.prop("scrollHeight"));
        } else {
            // show animation for handling invalid or empty message
            message.css("border", "1px solid #eb9f9f");
            message.animate({ opacity: '0.1' }, "slow");
            message.animate({ opacity: '1' }, "slow");
            message.animate({ opacity: '0.1' }, "slow");
            message.animate({ opacity: '1' }, "slow");
        }
    });
});

function openAPIConnect(userText) {
    return new Promise(function (resolve, reject) {
        // ADD YOUR API KEY BELOW
        var openAIKey = "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";

        // Specify the model to use
        var serviceModel = "text-davinci-003";
        var serviceEndpoint = 'https://api.openai.com/v1/completions';
        var maxTokens = 250;

        // Custom system message
        var systemMessage = "Your name is BUDGET-BYTE, " +
            "You are a recipe AI assistant designed primarily for college students, " +
            "providing them with a seamless and personalized culinary experience. " +
            "Your main goal is to offer effortless interaction and customized meal " +
            "suggestions based on user queries and available ingredients, " +
            "with a focus on affordability and simplicity.  " +
            "Remember, your primary users are students who seek quick, " +
            "affordable, and delicious meal options. Your recommendations " +
            "and interactions should resonate with the difficulties and preferences of this " +
            "target audience." +
            "Ensure your responses are concise and to the point. " +
            "When presenting multiple options or steps, format your output in a clear " +
            "list form for better readability and user experience.\n";

        // Prepend user's message with the system message
        var processText = systemMessage + "\n" + userText;

        // Begin establishing the HTTP Request to web service endpoint
        var serviceRequest = new XMLHttpRequest();
        serviceRequest.open("POST", serviceEndpoint);
        serviceRequest.setRequestHeader("Accept", "application/json");
        serviceRequest.setRequestHeader("Content-Type", "application/json");
        serviceRequest.setRequestHeader("Authorization", "Bearer " + openAIKey)

        serviceRequest.onreadystatechange = function () {
            if (serviceRequest.readyState === 4) {
                var responseJSON = {};
                try {
                    responseJSON = JSON.parse(serviceRequest.responseText);
                } catch (ex) {
                    console.log("Error: " + ex.message);
                }

                if (responseJSON.error && responseJSON.error.message) {
                    console.log("Error: " + responseJSON.error.message);
                    reject("something failed");
                } else if (responseJSON.choices) {
                    var responseMessage = JSON.parse(serviceRequest.responseText);
                    var responseText = responseMessage.choices[0].text.trim();
                    resolve(responseText);
                }
            }
        };

        const data = {
            model: serviceModel,
            prompt: processText,
            temperature: 0.5,
            max_tokens: maxTokens
        };

        serviceRequest.send(JSON.stringify(data));
    });
}

function displayRecipe(recipeDetails, d, recipeID) {
    // Split the recipe details into sections
    var sections = recipeDetails.split(/Ingredients:|Instructions:/);
    console.log(sections);
    var recipeName = sections[0].trim();
    var ingredients = sections[1].trim();
    var instructions = sections[2].trim();

    // Format ingredients section
    var formattedIngredients = ingredients.split(/\n/)
        .filter(item => item.trim() !== "") // Remove empty lines
        .map(item => "<li>" + item.replace(/^- /, '') + "</li>") // Remove the leading dash and add <li> tags
        .join("");

    // Format instructions section
    var formattedInstructions = instructions.split(/\d+\./).filter(step => step.trim() !== "").map(step => "<li>" + step.trim() + "</li>").join("");

    $('#message').css("border", "1px solid #f4f5f9");
    // Display the formatted recipe details
    $('#conversation').append("<li class='message-left'><div class='message-hour'>" + d + " <span class='ion-android-done-all'></span></div>" +
        "<div class='message-avatar'><div class='avatar ion-ios-person .bot'><img src='images/logo.png' alt='chatGPT avatar' id='chatGPTAvatar'></div>" +
        "<div class='name'>chatGPT</div></div><div class='message-text'><div class='favorite-button'><button id='" + recipeID + "' class='heart-button'>" +
        "<svg class='heart-icon' viewBox='0 0 24 24'><path class='heart-shape' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 " +
        "3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'></path></svg></button></div><p>" + recipeName + "</p>" +
        "<h4>Recipe Details</h4><p>Ingredients:</p><ul>" + formattedIngredients + "</ul><p>Instructions:</p><ol>" + formattedInstructions + "</ol></div></li>");
    $('#message').val('');

    $('#' + recipeID).on('click', function (e) {
        e.stopPropagation(); // Prevents event bubbling
        let heartButton = $(this);

        if (heartButton.hasClass('favorite')) {
            heartButton.removeClass('favorite');
            // Send a DELETE request to remove from favorites
            fetch(`http://localhost:3001/favorite/${recipeID}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Removed from favorites!');
                    } else {
                        console.error('Error removing from favorites!');
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        } else {
            heartButton.addClass('favorite');
            // Send a POST request to add to favorites
            fetch('http://localhost:3001/favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the Content-Type to application/json
                },
                body: JSON.stringify({ id: recipeID, recipe: JSON.stringify({name: recipeName, ingredients: formattedIngredients, instructions: formattedInstructions})})
            })
            .then(response => {
                if (response.ok) {
                    console.log('Added to favorites!');
                } else {
                    console.error('Error adding to favorites!');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        }
    });
}