

// Create new game room
function createNewGameRoom(roomName){

    emptyMessage.push("Start Game");

    var myRef = db2.ref().push({
        roomName: roomName,
        playerCount: 1,
        player1Wins: 0,
        player2Wins: 0,
        messages: JSON.stringify(emptyMessage),
        player1: gameRoom.player1,
        player2: gameRoom.player2
    });
    
    myRef.push();

    // After the Object is created, we get the Key
    var key = myRef.getKey();

    currentRoomKey = key;

}



function loadMessage(snapshot){
    $("#loadMessage").val('');

    var messages = "";

    // Loop through each message
    snapshot.forEach(function(childSnapshot){
        var message = childSnapshot.val();
        var textAreadMsg = message + "\n" // New line keyword
        messages += textAreadMsg; // append the messages
    })

    $("#loadMessage").val(messages)
}


// Creates the Game Rooms
function createRoomButtons(){

    // Capture all the entries in the Database
    db2.ref().once("value", function(snapshot){


        snapshot.forEach(function(childSnapshot){
            var room = childSnapshot.val();

            // Each Key will get loaded into each button
            var key = childSnapshot.key;

            // console.log(room);

            var roomButton = $("<button>");
            $(roomButton).addClass("btn btn-primary room_selected");
            $(roomButton).attr("data-roomkey", key);

            $(roomButton).text(room.roomName);
            $("#joinRoom").append(roomButton);
        });    

    });
}


function validateGameAnswers(player1, player2){
    
    var message = 0;

    console.log(`validate game ans player 1 ${player1}`);
    console.log(`validate game ans player 2 ${player2}`);
    

    if(player2 === "p" && player1 === "s"){
        message = 1;
        console.log("player 1 wins");
        return message;
    }
    else if (player2 === "s" && player1 === "p"){
        message = 2;
        console.log("player 2 wins");
        return message;
    }
    else if (player2 === "r" && player1 === "p"){
        message = 1;
        console.log("player 1 wins");
        return message;
    }
    else if (player2 === "p" && player1 === "r"){
        message = 2;
        console.log("player 2 wins");
        return message;
    }
    else if (player2 === "s" && player1 === "r"){
        message = 1;
        console.log("player 1 wins");
        return message;
    }
    else if (player2 === "r" && player1 === "s"){
        message = 2;
        console.log("player 2 wins");
        return message;
    }
    else{
        console.log("tie");
        return message;
    }
}


function waitingForOpponent(){
    // Once the data is submitted, the user cannot enter a new value.
    // This will be removed once both users enter a value
    $("#submit").addClass("disabled");


    // Create a spinner while waiting for the opponent to enter 
    // their choice
    var createSpinner = $("<div>");
    $(createSpinner).addClass("spinner-border");
    $(createSpinner).attr("role", "status");

    var loading = $("<span>");
    $(loading).addClass("sr-only");
    $(loading).text("Loading...");
    
    $(createSpinner).append(loading);
    $("#loadingContainer").append(createSpinner);
}


function loadPlayerScore(){

    console.log("In load player score");
    
    var loadScoreContainer = $("#loadScore");
    $(loadScoreContainer).empty();

    var currentPlayer = $("<p>");
    $(currentPlayer).html("<strong>Current Player: </strong> " + playerId);

    var player1Score = $("<p>");
    $(player1Score).html("<strong>Player 1 Wins: </strong> " + player1WinTotal);

    var player2Score = $("<p>");
    $(player2Score).html("<strong>Player 2 Wins: </strong> " + player2WinTotal);

    $(loadScoreContainer).append(currentPlayer);
    $(loadScoreContainer).append(player1Score);
    $(loadScoreContainer).append(player2Score);
}

// {"player1Choice":"r", "player1Waiting":1}

// {"player1Choice":"p", "player1Waiting":1}

// {"player1Choice":"s", "player1Waiting":1}









