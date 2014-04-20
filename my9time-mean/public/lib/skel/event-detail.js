
$("#changeNotice").click(function(){
    $("#eventAnnouncement").prop('readonly', false);
    $( "#changeNotice").hide();
    $('#submitAnnouncement').show();
    $('#cancelAnnouncement').show();
})

$("#submitAnnouncement").click(function(){
    $("#eventAnnouncement").prop('readonly', true);
    $( "#changeNotice").show();
    $('#submitAnnouncement').hide();
    $('#cancelAnnouncement').hide();
})

$("#cancelAnnouncement").click(function(){
    $("#eventAnnouncement").prop('readonly', true);
    $( "#changeNotice").show();
    $('#submitAnnouncement').hide();
    $('#cancelAnnouncement').hide();
})

