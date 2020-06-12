    
    
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

    var opponentChoice = "";

    // Database structure
    var gameRoom = {
        roomName:"",
        playerCount: 0, // Used to validate if there is 2 players
        player1Wins: 0,
        player2Wins: 0,
        messages: [],
        player1Choice: "", 
        player1Waiting: 0, // Used to flag which player is waiting
        player2Choice: "",
        player2Waiting: 0, // Used to flag which player is waiting
        playerChoiceCnt: 0 // Reflects if both users have entered an answer
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


    // Event listener when new messages are pushed to Firebase
    db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
        
        if(currentRoomKey == null){
            return;
        }

        loadMessage(snapshot);
    })

    // if the player choice count is back to 0 then remove Disable class
    // from form and submit button
    db2.ref(currentRoomKey + "/playerChoiceCnt").on("value", function(snapshot){

        if(currentRoomKey == null){
            return;
        }

        console.log("reset submit form and button");
        console.log(snapshot);

        var choiceCnt = snapshot.val();

        if(choiceCnt === 2){
            db2.ref(currentRoomKey).update({
                player1Choice: "", 
                player1Waiting: 0, // Used to flag which player is waiting
                player2Choice: "",
                player2Waiting: 0, // Used to flag which player is waiting
                playerChoiceCnt: 0 // Reflects if both users have entered an answer
            })

            resetApp();
        }
        
    })


    // Get the Player Choice
    db2.ref(currentRoomKey + "/player1Choice").on("value", function(snapshot){
        
        var isWaiting = 0;

        db2.ref(currentRoomKey + "/player1Waiting").once("value", function(snapshot){
            isWaiting = snapshot.val();
        });

        // Are we waiting for an answer
        if (isWaiting === 0){
            return;
        }

        // Do we have a Room key
        if(currentRoomKey === null){
            return;
        }

        console.log("In Player 1 Choice firebase trigger");

        var player1Choice = snapshot.val();
        var myChoice = $("#choice").val();

        var player1Wins = 0;
        var player2Wins = 0;

        // We don't care about our own choice
        // Need to validate we are currently in a room
        if (currentRoomKey !== null){
            db2.ref(currentRoomKey).once("value", function(snapshot){
           
                if(snapshot.child("player1Wins").exists() 
                    && snapshot.child("player2Wins").exists() ){
                        
                        var currentObj = snapshot.val();
                        player1Wins = currentObj.player1Wins;
                        player2Wins = currentObj.player2Wins;
    
                    }
            })
        }

        console.log(player1Choice);

        // We don't care about our own choice
        if(playerId === "player1"){
            return
        }
        else{
            // Here player 2 is waiting for Player 1
            var message = validateGameAnswers(player1Choice, myChoice);

            var opponentChoice = player1Choice;

            var playerChoiceCnt = 0;

            db2.ref(currentRoomKey + "/playerChoiceCnt").once("value", function(snapshot){
                playerChoiceCnt = snapshot.val();
            })

            if (message === 1){
                console.log("Player 1 won");
                player1Wins++;
            }
            else {
                player2Wins++;
            }

            if (currentRoomKey !== null){
                db2.ref(currentRoomKey).update({
                    player1Wins: player1Wins,
                    player2Wins: player2Wins,
                    playerChoiceCnt: playerChoiceCnt++
                })
            }

            // At Choice Cnt == 0 remove the Disable class from 
            // the Submit button and clear choice

        }
    })

    db2.ref(currentRoomKey + "/player2Choice").on("value", function(snapshot){

        var waiting = 0;

        // Validate if its a legitimate entry by the player
        db2.ref(currentRoomKey + "/player2Waiting").once("value", function(snapshot){
            waiting = snapshot.val();
        });

        // Are we waiting for an answer
        if(waiting === 0){
            return;
        }

         // Do we have a Room key
        if(currentRoomKey === null){
            return;
        }

        console.log("In Player 2 Choice firebase trigger");
        
        var player2Choice = snapshot.val();
        var myChoice = $("#choice").val();


        var player1Wins = 0;
        var player2Wins = 0;


        // We don't care about our own choice
        // Need to validate we are currently in a room
        if (currentRoomKey !== null){
            db2.ref(currentRoomKey).once("value", function(snapshot){
           
                if(snapshot.child("player1Wins").exists() 
                    && snapshot.child("player2Wins").exists() ){
                        
                        var currentObj = snapshot.val();
                        player1Wins = currentObj.player1Wins;
                        player2Wins = currentObj.player2Wins;
    
                    }
            })
        }
        

        if(playerId === "player2"){
            return
        }
        else{
            // Here player 1 is waiting for Player 2
            var message = validateGameAnswers(myChoice, player2Choice);

            var opponentChoice = player2Choice;

            var playerChoiceCnt = 0;

            db2.ref(currentRoomKey + "/playerChoiceCnt").once("value", function(snapshot){
                playerChoiceCnt = snapshot.val();
            })

            if (message === 1){
                console.log("Player 1 won");
                player1Wins++;
            }
            else {
                player2Wins++;
            }

            if (currentRoomKey !== null){
                db2.ref(currentRoomKey).update({
                    player1Wins: player1Wins,
                    player2Wins: player2Wins,
                    playerChoiceCnt: playerChoiceCnt++
                })
            }

            // At Choice Cnt == 0 remove the Disable class from 
            // the Submit button and clear choice
        }
    })


    // Capture the input from the User
    $("#submit").on("click", function(event){
        
        // prevents the form from capturing the form input 
        // and sending it in a URL string
        event.preventDefault();

        var choice = $("#choice").val();

        choice = choice.toLowerCase();

        var isChoiceValid = gameOptions.includes(choice);

        if(!isChoiceValid){
            alert("Please be sure to select an option between P(paper), S(scissor), R(rock)");
            $("#choice").val(' ');

            // Go back to the APP when the answer is not valid
            return;
        }

        waitingForOpponent();


        // Load the input to Firebase
        if (playerId === "player1"){
            db2.ref(currentRoomKey).once("value", function(snapshot){
                if(snapshot.child("player1Choice").exists() 
                    && snapshot.child("player1Waiting").exists() 
                    && snapshot.child("playerChoiceCnt").exists()){
                        db2.ref(currentRoomKey).update({
                            player1Choice : choice,
                            player1Waiting: 1,
                            playerChoiceCnt : playerChoiceCnt + 1
                        });
                    }
            })
        }else{
            db2.ref(currentRoomKey).once("value", function(snapshot){
                if(snapshot.child("player2Choice").exists() 
                    && snapshot.child("player2Waiting").exists() 
                    && snapshot.child("playerChoiceCnt").exists()){
                        db2.ref(currentRoomKey).update({
                            player2Choice : choice,
                            player2Waiting: 1,
                            playerChoiceCnt : playerChoiceCnt + 1
                        });
                    }
            })
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

        // Here might want to update this to ONCE instead of ON.
        db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
        
            loadMessage(snapshot);
            
        })

        db2.ref(currentRoomKey).update({
            playerCount: 2
        });

        $("#gameRoom").hide();
    });



    $(document).ready(function(){

        if(currentRoomKey !== null){

            console.log(currentRoomKey);

            $("#gameRoom").hide();

            // Waiting for opponent and should not be allowed to enter new value
            db2.ref(currentRoomKey).once("value", function(snapshot){
                var obj = snapshot.val();

                var choiceCnt = obj.playerChoiceCnt;
                var player1Choice = obj.player1Choice;
                var player2Choice = obj.player2Choice;

                if (choiceCnt === 1){
                    waitingForOpponent()
                }
            })
        }

        // Create Room Buttons
        // !!! Only need to create buttons for Rooms that only have 1 member Active
        createRoomButtons();
       
    })


 


    // // When the count has changed, need to validate if both players have entered an answer
    // db2.ref(currentRoomKey + "/playerChoiceCnt").on("value", function(snapshot){

    //     // Only one player will update the database
    //     if(playerId === "player1"){
            
    //         db2.ref(currentRoomKey).once("value").then(function(objSnapshot){

    //             var currentObj = objSnapshot.val();

    //             console.log(currentObj);

    //             var playerChoiceCnt = 0;
    
    //             if(objSnapshot.child("playerChoiceCnt").exists()){
    //                 playerChoiceCnt = currentObj.playerChoiceCnt;
    //             }
                
    //             if (playerChoiceCnt === 2){
    //                 validateAnswer(currentObj.player1Choice, currentObj.player2Choice);
    //             }

    //         });

    //     }
        
    // })








