$(document).ready(function(){

  //initialize database variable
  var database = firebase.database();


  $('#addLine').on("click", function(e){
    e.preventDefault();

    var name = $('#name').val().trim();
    var destination = $('#destination').val().trim();
    var firstTrain = moment($('#startTime').val().trim(), "HH:mm").format("HH:mm");
    var rate = $('#rate').val().trim();

    //store new information in object
    var newLine = {
      name:name,
      place:destination,
      ftrain: firstTrain,
      freq: rate,
      stamp: firebase.database.ServerValue.TIMESTAMP
    }
    //upload train object to firebase
    database.ref().push(newLine);

    //clear inputs for next input of train line data
    $('#name').val("");
    $('#destination').val("");
    $('#startTime').val("");
    $('#rate').val("");
  });

  database.ref().on("child_added", function(childSnapshot) {
    //log to ensure data is stored properly
    console.log(childSnapshot.val());

    //store snapshot into variables

    var lineName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var firstTrain = childSnapshot.val().ftrain;
    var rate = childSnapshot.val().freq;

    // first Train pushed back to make sure it comes before current time
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    console.log(firstTimeConverted);
    var currentTime = moment().format("HH:mm");
    console.log("Current Time: "+currentTime);

    // store difference between currentTime and fisrt train converted in a variable.

    var diff = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(firstTrain);
    console.log('Difference: ' + diff);

    var timeRemainder = diff % rate;
    console.log(timeRemainder);

    // to calculate minutes till train,we store it in a variable
    var minToTrain = rate - timeRemainder;
    console.log(minToTrain);

    //next train variable
    var nextTrain = moment().add(minToTrain,"minutes").format("HH:mm");

    $('#lines>tbody').append("<tr><td>"+lineName+"</td><td>"+destination+"</td><td>"+rate+"</td><td>"+nextTrain+"</td><td>"+minToTrain+"</td></tr>");


  });

});
