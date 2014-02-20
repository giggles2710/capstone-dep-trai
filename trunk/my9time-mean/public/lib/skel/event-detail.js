//var eventName = $("h1.event-name").text();
//var eventCreator = $("span.event-creator").text();
//var eventStar = $( "span.event-start").text();
//var eventEnd = $( "span.event-end").text();
//var eventDescription = $( "span.event-description").text();

$( "#change-intro" ).click(function() {
    $("#event-name").hide();
    $("#update-event-name").show();
    $("#event-intro-view").hide();
    $("#event-intro-update").show();

//  $( "h1.event-name").replaceWith( "<p id='event-name'>Tên Sự Kiện: <input type='text' id='eventName' name='eventName' data-ng-model='event.name' value=''> </p>");
//   document.getElementById('eventName').setAttribute('value', eventName);
//  $( "span.event-creator").replaceWith( "<p id='event-creator'><input type='text' id ='eventCreator' name='eventCreator' readonly value=''></p>");
//    document.getElementById('eventCreator').setAttribute('value', eventCreator);
//  $( "span.event-start").replaceWith( "<p id='event-start'><input type='text' id='start' name='start' data-ng-model='event.startTime' value=''></p>");
//    document.getElementById('start').setAttribute('value',eventStar);
//  $( "span.event-end").replaceWith( "<p id='event-end'><input type='text' id='end' name='end' data-ng-model='event.endTime' value=''></p>");
//    document.getElementById('end').setAttribute('value',eventEnd);
//  $( "span.event-description").replaceWith( "<p id='event-description'><input type='text' id='eventDescription' name='eventDescription' data-ng-model='eventDescription' value=''></p>");
//    document.getElementById('eventDescription').setAttribute('value',eventDescription);


});

$( "#submitEventIntro" ).click(function() {
    $("#event-name").show();
    $("#update-event-name").hide();
    $("#event-intro-view").show();
    $("#event-intro-update").hide();
})

$( "#cancelEventIntro" ).click(function() {
    $("#event-name").show();
    $("#update-event-name").hide();
    $("#event-intro-view").show();
    $("#event-intro-update").hide();
})

$("#changeNotice").click(function(){
    $("#eventAnnouncement").prop('disabled', false);
    $( "#changeNotice").hide();
    $('#submitAnnouncement').show();
    $('#cancelAnnouncement').show();
})

$("#submitAnnouncement").click(function(){
    $("#eventAnnouncement").prop('disabled', true);
    $( "#changeNotice").show();
    $('#submitAnnouncement').hide();
    $('#cancelAnnouncement').hide();
})

$("#cancelAnnouncement").click(function(){
    $("#eventAnnouncement").prop('disabled', true);
    $( "#changeNotice").show();
    $('#submitAnnouncement').hide();
    $('#cancelAnnouncement').hide();
})
