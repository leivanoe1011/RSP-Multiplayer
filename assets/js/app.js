    
    
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
        player1:"",
        player2:""
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

    var player1WinTotal = 0;

    var player2WinTotal = 0;



    if(currentRoomKey !== null){


        var dbRefObj = db2.ref().child(currentRoomKey);
        var dbRefMessage = dbRefObj.child("messages");
        var dbRefPlayer1 = dbRefObj.child("player1");
        var dbRefPlayer2 = dbRefObj.child("player2");
           
        
        function resetApp(){

            console.log("Reset App Function");
            
            $("#loadingContainer").empty();
            $("#submit").removeClass("disabled");
            $("#choice").val(' ');

        }


        function removeChildren(){

            dbRefPlayer1.child("player1Choice").remove();
            dbRefPlayer1.child("player1Waiting").remove();

            dbRefPlayer2.child("player2Choice").remove();
            dbRefPlayer2.child("player2Waiting").remove();

        }


        // Not sure if I can add the Function within the Current Room Key IF statement
        function compareAnswers(player1Waiting, player2Waiting){

            console.log(`Current Player ${playerId}`);
            console.log("compareAnswers Player 1 Waiting Value " );
            console.log(player1Waiting);
            console.log("compareAnswers Player 2 Waiting Value " );
            console.log(player2Waiting);
        
                    
            var win1 = 0;
            var win2 = 0;
            var player1Choice = "";
            var player2Choice = "";
            
            if(player1Waiting === 1 && player2Waiting === 1){
                console.log("updating the player choice cnt in playerChoiceCnt trigger");

        
                // Need to validate we are currently in a room
                if (currentRoomKey !== null){

                    console.log("In original Db Ref Obj Exists");


                    // All the updates to the Database and Get functions must be within this
                    // query because Firebase Queries run in parallel.
                    db2.ref(currentRoomKey).once("value", function(snapshot){
                
                        console.log("Got the values");
                        
                        var currentVal = snapshot.val(); 

                        console.log(currentVal);

                        win1 = currentVal.player1Wins;
                        win2 = currentVal.player2Wins;

                        console.log(`Player 1 wins ${win1}`);
                        console.log(`Player 2 wins ${win2}`);

                        console.log(`Player 1 wins Current Val ${currentVal.player1Wins}`);
                        console.log(`Player 2 wins Current Val ${currentVal.player2Wins}`);


                        dbRefPlayer1.once("value", snap => {
                            var value = snap.val();
    
                            console.log(value);
    
                            if (snap.child("player1Choice").exists() ){
                                player1Choice = value.player1Choice;
                            }
                        })
    
                        dbRefPlayer2.once("value", snap => {
                            var value = snap.val();
    
                            console.log(value);
    
                            if (snap.child("player2Choice").exists() ){
                                player2Choice = value.player2Choice;
                            }
                        })
    
                        // The logic below is only executed if Player 2 is waiting
                        var message = validateGameAnswers(player1Choice, player2Choice);
                
                        if (message === 1){
                            console.log("Player 1 won");
                            win1++;
                        }
                        else if( message === 2){
                            console.log("Player 2 won");
                            win2++;
                        }
                        else {
                            console.log("In Else Tie");
                        }
                
    
                        db2.ref(currentRoomKey).update({
                            player1Wins: win1,
                            player2Wins: win2
                        })
    
                        player1WinTotal = win1;

                        player2WinTotal = win2;
                
                        removeChildren();
                        resetApp();
                    });

                    
                }
                // End of Current Room Key NULL
        
            }
            // End of IF
        }


        // Listen if the answer has changed
        dbRefPlayer1.on('child_added', snap => {

            console.log("In player 1 waiting listener");
            console.log(snap.val());
            console.log(snap.key);

            if(currentRoomKey === null){
                return;
            }
     
            // Only want to run this function once
            if(snap.key === "player1Choice"){
                return;
            }
    
            var player1Waiting = 0;
            var player2Waiting = 0;

            dbRefPlayer1.once("value", snapshot => {

                var value = snapshot.val();
                
                console.log(value);

                player1Waiting = value.player1Waiting;
            })
    
            dbRefPlayer2.once("value", snapshot => {
                
                var value = snapshot.val();
                
                if(snapshot.child("player2Waiting").exists()){
                    
                    player2Waiting = value.player2Waiting;
                }
                else{
                    return;
                }
                
            })
    
            compareAnswers(player1Waiting, player2Waiting);
            
        })


        // Validate if both users have entered their Guess
        dbRefPlayer2.on('child_added', snap => {
           
            var player1Waiting = 0;
            var player2Waiting = 0;


            console.log("In player 2 child changed");
            console.log(snap.val());
            console.log(snap.key);

            if(currentRoomKey === null){
                return;
            }

            // Only want to run this function once
            if(snap.key === "player2Choice"){
                return;
            }

            console.log("In player 2 waiting listener");
    


            dbRefPlayer1.once("value", snapshot => {

                var value = snapshot.val();

                if(snapshot.child("player1Waiting").exists()){
                    
                    player1Waiting = value.player1Waiting;
                }
                else{
                    return;
                }
            })
    
            dbRefPlayer2.once("value", snapshot => {
                var value = snapshot.val();

                console.log(value);

                player2Waiting = value.player2Waiting;
            })
    

            compareAnswers(player1Waiting, player2Waiting);   
            
        })


        db2.ref(currentRoomKey + "/messages").on("value", snap =>{
            var messageVal = snap.val(); // Not sure if I'll need this or not
            
            console.log("In message value event handler");
            console.log(messageVal);

            loadMessage(snap);
        })
    
    
    }


    // Capture the input from the User
    $("#submit").on("click", function(event){
        
        // prevents the form from capturing the form input 
        // and sending it in a URL string
        event.preventDefault();

        var gameOptions = ["p","s","r"];

        var choice = $("#choice").val().trim().toLowerCase();

        if(!(gameOptions.includes(choice))){
            alert("Please be sure to select an option between P(paper), S(scissor), R(rock)");
            $("#choice").val(' ');

            // Go back to the APP when the answer is not valid
            return;
        }

        waitingForOpponent();


        // Load the input to Firebase
        if (playerId === "player1"){
            
            console.log("In Player 1 Submit Answer");

            db2.ref(currentRoomKey).once("value", function(snapshot){

                db2.ref(currentRoomKey + "/player1").set({
                    player1Choice : choice,
                    player1Waiting: 1
                })
            })
        }else{
            
            console.log("In Player 2 Submit Answer");

            db2.ref(currentRoomKey).once("value", function(snapshot){
                db2.ref(currentRoomKey + "/player2").set({
                    player2Choice : choice,
                    player2Waiting: 1
                })

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

        });

        loadPlayerScore();

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

        loadPlayerScore();

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

                player1WinTotal = obj.player1Wins;
                player2WinTotal = obj.player2Wins;

                if (choiceCnt === 1){
                    waitingForOpponent()
                }

                loadPlayerScore();

                db2.ref(currentRoomKey + "/messages").once("value", snap => {
                    var messageVal = snap.val(); // Not sure if I'll need this or not
                    loadMessage(snap);
                });

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




    // // This trigger exists to let Player 2 know, Player 1 made a choice
    // db2.ref(currentRoomKey + "/player1Choice").on("value", function(snapshot){
        
    //     var isWaiting = 0;

    //     db2.ref(currentRoomKey + "/player1Waiting").once("value", function(snapshot){
    //         isWaiting = snapshot.val();
    //     });
 

    //     // Are we waiting for an answer
    //     if (isWaiting === 0){
    //         return;
    //     }

    //     // Do we have a Room key
    //     if(currentRoomKey === null){
    //         return;
    //     }

    //     // We don't care about our own choice
    //     if(playerId === "player1"){
    //         console.log("Return because Player 1. In Player 1 choice")
    //         return
    //     }

    //     console.log("In Player 1 Choice firebase trigger");

    //     var player1Choice = snapshot.val();
    //     var myChoice = $("#choice").val(); // player 2 choice

    //     var player1Wins = 0;
    //     var player2Wins = 0;

    //     // We don't care about our own choice
    //     // Need to validate we are currently in a room
    //     if (currentRoomKey !== null){
    //         db2.ref(currentRoomKey).once("value", function(snapshot){
           
    //             if(snapshot.child("player1Wins").exists() 
    //                 && snapshot.child("player2Wins").exists() ){
                        
    //                     var currentObj = snapshot.val();
    //                     player1Wins = currentObj.player1Wins;
    //                     player2Wins = currentObj.player2Wins;
    
    //                 }
    //         })
    //     }

    //     console.log(player1Choice);

        
    //     // The logic below is only executed if Player 2 is waiting
    //     var message = validateGameAnswers(player1Choice, myChoice);

    //     if (message === 1){
    //         console.log("Player 1 won");
    //         player1Wins++;
    //     }
    //     else {
    //         player2Wins++;
    //     }


    //     if (currentRoomKey !== null){
    //         console.log("In player1Choice trigger");

    //         db2.ref(currentRoomKey).update({

    //             player1Wins: player1Wins,
    //             player2Wins: player2Wins
    //         })
    //     }

    //     // At Choice Cnt == 0 remove the Disable class from 
    //     // the Submit button and clear choice

        
    // })


    // // This trigger exists to let Player 1 know, Player 2 made a choice
    // db2.ref(currentRoomKey + "/player2Choice").on("value", function(snapshot){

    //     var waiting = 0;

    //     // Validate if its a legitimate entry by the player
    //     db2.ref(currentRoomKey + "/player2Waiting").once("value", function(snapshot){
    //         waiting = snapshot.val();
    //     });


    //     // Are we waiting for an answer
    //     if(waiting === 0){
    //         return;
    //     }

    //      // Do we have a Room key
    //     if(currentRoomKey === null){
    //         return;
    //     }

    //     console.log("In Player 2 Choice firebase trigger");
        
    //     var player2Choice = snapshot.val();
    //     var myChoice = $("#choice").val();


    //     var player1Wins = 0;
    //     var player2Wins = 0;


    //     // We don't care about our own choice
    //     // Need to validate we are currently in a room
    //     if (currentRoomKey !== null){
    //         db2.ref(currentRoomKey).once("value", function(snapshot){
           
    //             if(snapshot.child("player1Wins").exists() 
    //                 && snapshot.child("player2Wins").exists() ){
                        
    //                     var currentObj = snapshot.val();
    //                     player1Wins = currentObj.player1Wins;
    //                     player2Wins = currentObj.player2Wins;
    
    //                 }
    //         })
    //     }
        

    //     if(playerId === "player2"){
    //         return
    //     }
    //     else{
    //         // Here player 1 is waiting for Player 2
    //         var message = validateGameAnswers(myChoice, player2Choice);

    //         var opponentChoice = player2Choice;


    //         if (message === 1){
    //             console.log("Player 1 won");
    //             player1Wins++;
    //         }
    //         else {
    //             player2Wins++;
    //         }

    //         if (currentRoomKey !== null){
    //             console.log("In player2Choice trigger");
    //             db2.ref(currentRoomKey).update({
    //                 player1Wins: player1Wins,
    //                 player2Wins: player2Wins
    //             })
    //         }

    //         // At Choice Cnt == 0 remove the Disable class from 
    //         // the Submit button and clear choice
    //     }
    // })









