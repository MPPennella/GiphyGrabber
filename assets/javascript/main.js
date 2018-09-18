// Initial array of topics
var topics = ["Cats","Owls","Doge"];


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
    var btn = $("<button>").addClass("topicBtn");

    // Set data-topic attribute and text to the topic passed
    btn.attr("data-topic", topic);
    btn.text(topic);

    // Add the button to #buttonArea
    $("#buttonArea").append(btn);
    
}

// Calls Giphy API and retrieves set of images for clicked topic
function displayGifsForClicked() {

    // Get array of 10 gifs of topic from Giphy API
    var topic = $(this).attr("data-topic");

    // Giphy API Key: YKwD0wmIyRtqV6qgSW9bSPbVADvZzzoF
    var queryURL = "https://api.giphy.com/v1/gifs/search?q="+topic+"&limit=10&api_key=YKwD0wmIyRtqV6qgSW9bSPbVADvZzzoF";

    // Creates AJAX call for the specific button being clicked
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
        let gifs = response.data;
        console.log(gifs);

        // Remove current gifs displayed
        $("#gifArea").empty();

        for (let i=0; i<gifs.length; i++) {
            $("#gifArea").append( makeGifCard(gifs[i]) );
        }

    });

}

// Constructs a display card for a gif using Giphy API object
// Returns JQuery object of card
function makeGifCard( giphyData ) {
    let card = $("<div>");

    // Setup gif with .gif class, state tracker, and data for still and animated state sources, default to still source
    let gif = $("<img>").addClass("gif");
    let urlAnim = giphyData.images.fixed_width.url;
    let urlStill = giphyData.images.fixed_width_still.url;
    gif.attr({
        src: urlStill,
        "data-state": "still",
        "data-url-anim": urlAnim,
        "data-url-still": urlStill
    });
    
    // Add gif rating display
    let gifRating = $("<div>").text(giphyData.rating);

    // TODO: Make gifs toggle animation when clicked    

    card.append(gif);
    card.append(gifRating);

    return card;
}

// This function handles events where the #add-topic button is clicked
$("#add-topic").on("click", function(event) {
    event.preventDefault();
    // This line of code will grab the input from the textbox
    var newTopic = $("#input").val().trim();

    // Check if topic already exists
    if (!topics.includes(newTopic)){
      // If not, add topic to end of array and make a new button for it
      topics.push(newTopic);
      makeButton(newTopic);
    }

});

// Dynamically adds click event listeners to all .topicBtn elements
$(document).on("click", ".topicBtn", displayGifsForClicked);


$(document).ready( initializeButtons );