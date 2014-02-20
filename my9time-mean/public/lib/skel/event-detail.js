//var eventName = $("h1#event-name").text();
//var eventCreator = $("span#event-creator").text();
//var eventStar = $( "span#event-start").text();
//var eventEnd = $( "span#event-end").text();
//var eventDescription = $( "span#event-description").text();

$( "button#change-intro" ).click(function() {
    $("h1#event-name").hide();
    $("p#update-event-name").show();
    $("p#event-creator").hide();
    $("p#update-event-creator").show();
    $("p#event-start").hide();
    $("p#update-event-start").show();
    $("p#event-end").hide();
    $("p#update-event-end").show();
    $("p#event-description").hide();
    $("p#update-event-description").show();
    $( "button#change-intro").hide();
    $('#submitEventIntro').show();
    $('#cancelEventIntro').show();

//  $( "h1#event-name").replaceWith( "<p id='event-name'>Tên Sự Kiện: <input type='text' id='eventName' name='eventName' data-ng-model='event.name' value=''> </p>");
//   document.getElementById('eventName').setAttribute('value', eventName);
//  $( "span#event-creator").replaceWith( "<p id='event-creator'><input type='text' id ='eventCreator' name='eventCreator' readonly value=''></p>");
//    document.getElementById('eventCreator').setAttribute('value', eventCreator);
//  $( "span#event-start").replaceWith( "<p id='event-start'><input type='text' id='start' name='start' data-ng-model='event.startTime' value=''></p>");
//    document.getElementById('start').setAttribute('value',eventStar);
//  $( "span#event-end").replaceWith( "<p id='event-end'><input type='text' id='end' name='end' data-ng-model='event.endTime' value=''></p>");
//    document.getElementById('end').setAttribute('value',eventEnd);
//  $( "span#event-description").replaceWith( "<p id='event-description'><input type='text' id='eventDescription' name='eventDescription' data-ng-model='eventDescription' value=''></p>");
//    document.getElementById('eventDescription').setAttribute('value',eventDescription);


});

$( "#submitEventIntro" ).click(function() {
    $( "button#change-intro").show();
    $('#submitEventIntro').hide();
    $('#cancelEventIntro').hide();
    $("h1#event-name").show();
    $("p#update-event-name").hide();
    $("p#event-creator").show();
    $("p#update-event-creator").hide();
    $("p#event-start").show();
    $("p#update-event-start").hide();
    $("p#event-end").show();
    $("p#update-event-end").hide();
    $("p#event-description").show();
    $("p#update-event-description").hide();
})

$( "#cancelEventIntro" ).click(function() {
    $( "button#change-intro").show();
    $('#submitEventIntro').hide();
    $('#cancelEventIntro').hide();
    $("h1#event-name").show();
    $("p#update-event-name").hide();
    $("p#event-creator").show();
    $("p#update-event-creator").hide();
    $("p#event-start").show();
    $("p#update-event-start").hide();
    $("p#event-end").show();
    $("p#update-event-end").hide();
    $("p#event-description").show();
    $("p#update-event-description").hide();
})

