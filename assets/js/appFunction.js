
// Create new game room
function createNewGameRoom(roomName){

    emptyMessage.push("Start Game");

    var myRef = db2.ref().push({
        roomName: roomName,
        playerCount: 1,
        player1Wins: 0,
        player2Wins: 0,
        messages: JSON.stringify(emptyMessage),
        player1Choice: gameRoom.player1Choice,
        player2Choice: gameRoom.player2Choice,
        playerChoiceCnt: gameRoom.playerChoiceCnt
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


// Create new game room
function createNewGameRoom(roomName){

    emptyMessage.push("Start Game");

    var myRef = db2.ref().push({
        roomName: roomName,
        playerCount: 1,
        player1Wins: 0,
        player2Wins: 0,
        messages: JSON.stringify(emptyMessage),
        player1Choice: gameRoom.player1Choice,
        player2Choice: gameRoom.player2Choice,
        playerChoiceCnt: gameRoom.playerChoiceCnt
    });
    
    myRef.push();

    // After the Object is created, we get the Key
    var key = myRef.getKey();

    currentRoomKey = key;

}


// Creates the Game Rooms
function createRoomButtons(){

    // Capture all the entries in the Database
    db2.ref().on("value", function(snapshot){

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

