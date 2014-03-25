
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
