

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
            // playerChoiceCnt: 0
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

        
        function createDisplayValues(){

        }

        function displayScore(currentObj){
            
            // only player 1 will update the score
            // That way only one player rewrites the DB
            if(playerId === "player1"){
                
                var player1Choice = currentObj.player1Choice;

                var player2Choice = currentObj.player2Choice;

                var player2Wins = currentObj.player2Wins;

                var player1Wins = currentObj.player1Wins;
            }
            
        }

        function validateAnswer(player1, player2){

        }


        // When the count has changed, need to validate if both players have entered an answer
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

        // Only player 2 updates need to be reflected
        // Player 1 updates are reflected above
        db2.ref(currentRoomKey + "/player2Wins").on("value", function(snapshot){
            var currentObj = snapshot.val();
            
            if(playerId === "player2"){

            }
        })


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


        function createRoomButtons(){
            db2.ref().on("value", function(snapshot){

                snapshot.forEach(function(childSnapshot){
                    var room = childSnapshot.val();
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


        db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
            loadMessage(snapshot);
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

            console.log(currentRoomKey);

            // Variable created when the app loads
            currentRoomKey = $(this).data("roomkey");

            sessionStorage.setItem("gameRoom", currentRoomKey);

            // If you're joining a room, then you're player 2
            playerId = "player2";
            sessionStorage.setItem("playerId", playerId);

            console.log(currentRoomKey);

            db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
            
                $("#loadMessage").val('');
    
                var messages = "";
    
                // Loop through each message
                snapshot.forEach(function(childSnapshot){
                    var message = childSnapshot.val();
                    var textAreadMsg = message + "\n" // New line keyword
                    messages += textAreadMsg; // append the messages
                })
    
                $("#loadMessage").val(messages)
            })

            $("#gameRoom").hide();
        });


        $("#createGameRoom").on("click", function(event){
            event.preventDefault();
            
            console.log("create game room");
            
            var gameRoomName = $("#roomName").val();
            
            console.log(gameRoomName);
            
            createNewGameRoom(gameRoomName);

            // If you create a new Room, then you're player 1
            playerId = "player1";

            sessionStorage.setItem("playerId", playerId);

            sessionStorage.setItem("gameRoom", currentRoomKey);

            
            db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
            
                $("#loadMessage").val('');
    
                var messages = "";
    
                snapshot.forEach(function(childSnapshot){
                    var message = childSnapshot.val();
                    var textAreadMsg = message + "\n"
                    messages += textAreadMsg;
                    
                })
    
                $("#loadMessage").val(messages)
            })


            $("#gameRoom").hide();
        })


        // Loads answer from user to Firebase
        $("#submit").on("click", function(event){
            event.preventDefault();

            var choice = $("#choice").val();

            choice = choice.toLowerCase();

            // Returns true or false
            var isChoiceValid = gameOptions.includes(choice);

            // When user answer is not valid, notify them
            if(!isChoiceValid){
                alert("Please be sure to select an option between P(paper), S(scissor), R(rock)");
                $("#choice").val(' ');

                // Go back to the APP when the answer is not valid
                return;
            }

            // Grey out the submit button when the answer has been validated
            $("#submit").addClass("disabled");

            var createSpinner = $("<div>");
            $(createSpinner).addClass("spinner-border");
            $(createSpinner).attr("role", "status");

            var loading = $("<span>");
            $(loading).addClass("sr-only");
            $(loading).text("Loading...");
            
            $(createSpinner).append(loading);
            $("#loadingContainer").append(createSpinner);

            // Will need to remove the timer
            // Once someone submits an answer, they can log off. 
            // then the other user can submit their answer whenever they want. 
            // The main goal is to chat and the score is just side stuff

            // if (playerId === "player1"){
            //     db2.ref(currentRoomKey).set({
            //         player1Choice : choice,
            //         playerChoiceCnt : 1
            //     });
    
            // }else{
            //     db2.ref(currentRoomKey).set({
            //         player2Choice : choice,
            //         playerChoiceCnt : 1
            //     });
            // }


            setTimeout(function(){ 
                console.log("Hello"); 
                $("#loadingContainer").empty();
                $("#submit").removeClass("disabled");
                $("#choice").val(' ');
            }, 5000);

        })
        // End of Submit Answer Function


        db2.ref(currentRoomKey + "/messages").on("value", function(snapshot){
            
            $("#loadMessage").val(' ');

            var messages = "";

            snapshot.forEach(function(childSnapshot){
                var message = childSnapshot.val();
                var textAreadMsg = message + "\n"
                messages += textAreadMsg;
                
            })

            $("#loadMessage").val(messages)
        })
            
        $(document).ready(function(){

            console.log(currentRoomKey);
            
            if(currentRoomKey !== null){
                $("#gameRoom").hide();
            }

            // Create Room Buttons
            // !!! Only need to create buttons for Rooms that only have 1 member Active
            createRoomButtons();
           
        })


        // document.getElementById("choice").addEventListener("keydown", function(event){
        //     console.log("In keyup function");
        //     console.log(event.which);
        //     console.log(event.keyCode);
        //     console.log(event.key);
        // })



        // gameRooms.push(gameRoom);

        // if(snapshot.val() === null){
        //     console.log("null firebase");

        //     db2.ref().push({
        //         roomName: gameRoom.roomName,
        //         playerCount: gameRoom.playerCount,
        //         player1Wins: gameRoom.player1Wins,
        //         player2Wins: gameRoom.player2Wins,
        //         messages: JSON.stringify(emptyMessage),
        //         player1Choice: gameRoom.player1Choice,
        //         player2Choice: gameRoom.player2Choice
        //     });
        // }


        // Also need code to listen to that specific room when any value changes

        // Only get the messages from the room if the user has a key
        // get the messages for the specific room below
        // db2.ref(currentRoomKey + "/messages").once('value').then(function(snapshot){

        //     snapshot.forEach(function(childSnapshot){
        //         var message = childSnapshot.val();
        //         var textAreadMsg = message + "\n"
        //         $("#loadMessage").append(textAreadMsg)

        //     })
            
        // })
        

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

        


    // console.log(choice);
    // console.log(typeof choice);
    // console.log(gameOptions);

    // // var isChoiceValid = gameOptions.includes(choice);

    // var isChoiceValid = false

    // for(var i = 0; i < gameOptions.length; i++){
        
    //     var option = gameOptions[i];
    //     console.log("In for loop");
    //     console.log(option);
    //     console.log(typeof option);
        
    //     if(option === choice){
    //         console.log("in true loop")
    //         isChoiceValid = true;
    //         // break;
    //     }
    // }

    // console.log(isChoiceValid);

        
