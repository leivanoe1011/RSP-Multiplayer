    
        var gameOptions = ["p","s","r"];

        var gameRooms = [];

        var emptyMessage = [""]
   
        var currentRoomKey = sessionStorage.getItem("gameRoom");

        var playerId = sessionStorage.getItem("playerId");


        var gameRoom = {
            roomName:"",
            playerCount: 0,
            player1Wins: 0,
            player2Wins: 0,
            messages: [],
            player1Choice: "",
            player2Choice: ""
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


        function createNewGameRoom(roomName){

            emptyMessage.push("Start Game");

            var myRef = db2.ref().push({
                roomName: roomName,
                playerCount: 1,
                player1Wins: 0,
                player2Wins: 0,
                messages: JSON.stringify(emptyMessage),
                player1Choice: gameRoom.player1Choice,
                player2Choice: gameRoom.player2Choice
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
       

        $(document).on("click", "#chat", function(event){
            
            event.preventDefault();

            var ref = db2.ref(currentRoomKey + "/messages" );

            var message = $("#chatMessage").val();

            ref.push(playerId + ":" + message);

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
            sessionStorage.setItem("playerId", "Player2");

            console.log(currentRoomKey);

             $("#gameRoom").hide();
        });


        $("#createGameRoom").on("click", function(event){
            event.preventDefault();
            
            console.log("create game room");
            
            var gameRoomName = $("#roomName").val();
            
            console.log(gameRoomName);
            
            createNewGameRoom(gameRoomName);

            // If you create a new Room, then you're player 1
            sessionStorage.setItem("playerId", "Player1");

            sessionStorage.setItem("gameRoom", currentRoomKey);


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

            setTimeout(function(){ 
                console.log("Hello"); 
                $("#loadingContainer").empty();
                $("#submit").removeClass("disabled");
                $("#choice").val(' ');
            }, 5000);

        })

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
            
        $(document).ready(function(){

            console.log(currentRoomKey);
            
            if(currentRoomKey !== null){
                $("#gameRoom").hide();

            }

            // Create Room Buttons
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
        
        

        
