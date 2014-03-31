
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

function toggleStatus() {
    if ($('#privacy-privacy').is(':checked')) {
        $('#friend-token :input').attr('disabled', true);
        $('#invite-token :input').attr('disabled', true);
    } else {
        $('#friend-token :input').removeAttr('disabled');
        $('#invite-token :input').removeAttr('disabled');
    }
}
