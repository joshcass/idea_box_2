$(document).ready(function() {
    $('#save').click(createIdea);
    $('#ideaList').on('click', '#deleteIdea', deleteIdea);
    $('#ideaList').on('click', '.updateQuality', updateQuality);
});


function updateQuality(event) {
    var $currentQuality = $(this).siblings('#quality').text();
    var $vote = $(this).data('vote');
    var $values = voteObject($currentQuality, $vote);
    var $idea = $(this).closest('tr');
    $.ajax({
        type: 'PUT',
        url: '/ideas/' + $idea.data('id'),
        data: $values,
        success: function(data){
            $idea.replaceWith(data);
        },
        dataType: 'html'
    });
};

function voteObject(quality, vote){
    return {idea: {quality: quality, vote: vote}};
};

function createIdea(event){
    event.preventDefault();
    var $values = $('#newIdea').serialize();
    $.ajax({
        type: 'POST',
        url: '/ideas',
        data: $values,
        success: function(data){
            $(data).hide().prependTo('#ideaList').slideDown();
        },
        error: function(data){
            // error handling
        },
        dataType: 'html'
    });
    $('#newIdea').trigger('reset');
};

function deleteIdea() {
    var $idea = $(this).closest('.idea');
    $.ajax({
        type: 'DELETE',
        url: '/ideas/' + $idea.data('id'),
        success: function() {
            $idea.remove();
        }
    });
};
