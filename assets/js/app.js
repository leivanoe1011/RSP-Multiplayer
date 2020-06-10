    
    
    // Each ocurrence of the app will track the score of the current user. 
    // Player 1 has won ......
    // Player 2 has won ......

    // Might want to display Room Name as well

    // Add validation of the Room name also. There can only be one Room with that name
    

    // Will need to remove the timer
    // Once someone submits an answer, they can log off. 
    // then the other user can submit their answer whenever they want. 
    // The main goal is to chat and the score is just side stuff


    // to control that someone submitted an answer, each app instance can populate 
    // "1" to a field.  We will continue reading the Database until 2 is return.
    // Once 2 is returned we can validate both answers and declare the winner. 
    // At the same time, we can populate the fields of who won.

    

    var gameOptions = ["p","s","r"];

    var gameRooms = [];

    var emptyMessage = [""]

    var currentRoomKey = sessionStorage.getItem("gameRoom");

    var playerId = sessionStorage.getItem("playerId");

    // Database structure
    var gameRoom = {
        roomName:"",
        playerCount: 0,
        player1Wins: 0,
        player2Wins: 0,
        messages: [],
        player1Choice: "",
        player2Choice: "",
        playerChoiceCnt: 0
    }

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyD7464x7kygEx9awwunT4uAf38Xm3KLvMY",
        authDomain: "rockpaperscissorgame-2c750.firebaseapp.com",
        databaseURL: "https://rockpaperscissorgame-2c750.firebaseio.com",
        projectId: "rockpaperscissorgame-2c750",
        storageBucket: "rockpaperscissorgame-2c750.appspot.com",
        messagingSenderId: "105753591151",
        appId: "1:105753591151:web:ba2b1592f51de18b0bbc9a",
        measurementId: "G-7T33DQ81BS"
    };

    // Initialize Firebase
    var app = firebase.initializeApp(firebaseConfig, 'app');

    var db2 = firebase.database(app);



    db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
        loadMessage(snapshot);
    })


    // When the count has changed, need to validate if both players have entered an answer
    db2.ref(currentRoomKey + "/playerChoiceCnt").on("value", function(snapshot){

        // Only one player will update the database
        if(playerId === "player1"){
            
            db2.ref(currentRoomKey).once("value").then(function(objSnapshot){

                var currentObj = objSnapshot.val();

                console.log(currentObj);

                var playerChoiceCnt = 0;
    
                if(objSnapshot.child("playerChoiceCnt").exists()){
                    playerChoiceCnt = currentObj.playerChoiceCnt;
                }
                
                if (playerChoiceCnt === 2){
                    validateAnswer(currentObj.player1Choice, currentObj.player2Choice);
                }

            });

        }
        
    })


    $("#createGameRoom").on("click", function(event){
        event.preventDefault();
        
        console.log("create game room");
        
        var gameRoomName = $("#roomName").val();
        
        console.log(gameRoomName);
        
        createNewGameRoom(gameRoomName);

        // If you create a new Room, then you're player 1
        playerId = "player1";

        // Create Initial Message
        var ref = db2.ref(currentRoomKey + "/messages" );

        var message = "Joined!";
    
        ref.push(playerId + ": " + message);


        sessionStorage.setItem("playerId", playerId);

        sessionStorage.setItem("gameRoom", currentRoomKey);

        
        db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
        
            loadMessage(snapshot);

        })


        $("#gameRoom").hide();
    })


    $(document).on("click", "#chat", function(event){
            
        event.preventDefault();

        var ref = db2.ref(currentRoomKey + "/messages" );

        var message = $("#chatMessage").val();

        ref.push(playerId + ": " + message);

        console.log(message);

        $("#chatMessage").val(' ');

    })


    $(document).on("click", ".room_selected", function(event){

        event.preventDefault();

        console.log($(this).text());

        // Variable created when the app loads
        currentRoomKey = $(this).data("roomkey");

        console.log(currentRoomKey)

        sessionStorage.setItem("gameRoom", currentRoomKey);

        // If you're joining a room, then you're player 2
        playerId = "player2";


        // Create Initial Message
        var ref = db2.ref(currentRoomKey + "/messages" );

        var message = "Joined!";
    
        ref.push(playerId + ": " + message);

        
        sessionStorage.setItem("playerId", playerId);

        db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
        
            loadMessage(snapshot);
            
        })

        $("#gameRoom").hide();
    });



    $(document).ready(function(){

        console.log(currentRoomKey);
        
        if(currentRoomKey !== null){
            $("#gameRoom").hide();
        }

        // Create Room Buttons
        // !!! Only need to create buttons for Rooms that only have 1 member Active
        createRoomButtons();
       
    })


 









