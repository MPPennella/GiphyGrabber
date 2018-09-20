// Initial array of topics
var topics = ["Doge","Cat","Owl","Dinosaur","Monkey","Baby Hedgehog"];

// Holds desired offset for Giphy API calls
var offset = 0;

// Holds value of current topic
var currentTopic;


// Creates initial buttons from array of topics
function initializeButtons() {
    // Loops through the array of topics and makes a button for each
    for (var i = 0; i < topics.length; i++) {
        makeButton( topics[i] );
    }
}

// Creates a button with text and data of the passed topic
function makeButton(topic) {
    // Use class of topicBtn so listeners can be attached
    var btn = $("<button>").addClass("topicBtn col-6 col-sm-3 col-md-2");

    // Set data-topic attribute and text to the topic passed
    btn.attr("data-topic", topic);
    btn.text(topic);

    // Add the button to #buttonArea
    $("#buttonArea").append(btn);
    
}

// Calls Giphy API and retrieves set of images for clicked topic
function displayGifsForTopic(topic) {

    // Get array of 10 gifs of topic from Giphy API
    // Giphy API Key: YKwD0wmIyRtqV6qgSW9bSPbVADvZzzoF
    var queryURL = "https://api.giphy.com/v1/gifs/search?q="+topic+"&offset="+offset+"&limit=10&api_key=YKwD0wmIyRtqV6qgSW9bSPbVADvZzzoF";

    // Creates AJAX call for the specific button being clicked
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
        let gifs = response.data;
        console.log(gifs);

        for (let i=0; i<gifs.length; i++) {
            $("#gifArea").append( makeGifCard(gifs[i]) );
        }

        // Increase offset by 10 for next set called
        offset +=10;

        let moreBtn = $("<button>").text("Show More");
        $("#gifArea").append(moreBtn)
        moreBtn.on("click", function() {
            $(this).remove();
            displayGifsForTopic(currentTopic);
        })

    });

}

// Constructs a display card for a gif using Giphy API object
// Returns JQuery object of card
function makeGifCard( giphyData ) {
    let card = $("<div>").addClass("card text-center");

    let header = $("<h5>").addClass("card-header");
    header.text(giphyData.title);
    card.append(header);
    console.log(giphyData.title)

    let cardBody = $("<div>").addClass("card-body");
    card.append(cardBody);
    // Setup gif with .gif class, state tracker, and data for still and animated state sources, default to still source
    let gif = $("<img>").addClass("gif card-img-bottom mb-1");
    let urlAnim = giphyData.images.fixed_width.url;
    let urlStill = giphyData.images.fixed_width_still.url;
    gif.attr({
        src: urlStill,
        "data-state": "still",
        "data-url-anim": urlAnim,
        "data-url-still": urlStill
    });
    
    // Add gif rating display
    let rating = giphyData.rating.toUpperCase()
    let gifRating = $("<div>").addClass("card-text")
    gifRating.text(`Rating: ${rating}`);

    cardBody.append(gif);
    cardBody.append(gifRating);

    return card;
}

// Toggle animation of a clicked gif
function toggleAnimation() {
    let gif = $(this)
    let state = gif.attr("data-state");
    if (state=="still") {
        gif.attr({
            "data-state": "animate",
            "src": gif.attr("data-url-anim")
        });
    } else if (state=="animate") {
        gif.attr({
            "data-state": "still",
            "src": gif.attr("data-url-still")
        });
    }
}

// This function handles events where the #add-topic button is clicked
$("#add-topic").on("click", function(event) {
    event.preventDefault();
    // This line of code will grab the input from the textbox
    var newTopic = $("#input").val().trim();

    // Check if topic was empty or already exists
    if (newTopic!="" && !topics.includes(newTopic)){
      // If not, add topic to end of array and make a new button for it
      topics.push(newTopic);
      makeButton(newTopic);
    }

    // Clear value of #input
    $("#input").val("");

});

// Dynamically adds click event listeners to all .topicBtn elements
$(document).on("click", ".topicBtn", function() {
    offset = 0;
    currentTopic = $(this).attr("data-topic");
    $("#gifArea").empty();
    displayGifsForTopic( currentTopic );
});

// Dynamically adds click event listeners to all .gif elements
$(document).on("click", ".gif", toggleAnimation)

$(document).ready( initializeButtons );