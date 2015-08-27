$(document).ready(function() {
    ideaBox.bindEventListeners();
    truncateBody.truncate();
});

var ideaBox = {
    bindEventListeners: function() {
        $('#save').click(createIdea);
        $('#ideaList').on('click', '#deleteIdea', deleteIdea);
        $('#ideaList').on('click', '.updateQuality', updateQuality);
        $('#searchField').on('keyup', searchIdeas);
        $('#clearSearch').click(clearSearch);
        $('#ideaList').on('click', '#title', editIdea);
        $('#ideaList').on('click', '#body', editIdea);
    }
};

var truncateBody = {
    truncate: function(){
        $('.idea').each(function(_, idea){
            var $body = $(idea).find('#body');
            $body.text(cutString($body.text()));
        });
    }
};

function cutString(string){
    if(string.length >= 100) {
        var cut = string.lastIndexOf(' ', 100);
        string =  string.substring(0, cut) + '...';
    }
    return string;
};

function editIdea(event) {
    $(this).attr('contenteditable', 'true');
    $(this).addClass('red');
    $(this).focus();
    $(this).on('blur', updateIdea);
    $(this).keypress(function(event){
        if (event.which === 13){
            event.preventDefault();
            $(this).blur();
        };
    });
};

function updateIdea(event){
    var $idea = $(this).closest('.idea');
    var $title = $idea.find('#title').text();
    var $body = $idea.find('#body').text();
    var $values = updateObject($title, $body);
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

function updateObject(title, body) {
    return {idea: {title: title, body: body}};
};

function clearSearch() {
    $('#searchField').val('');
    $('#searchField').trigger('keyup');
};

function searchIdeas(event){
    var $searchTerm = $(this).val().toLowerCase();
    var $ideas = $('.idea');
    $ideas.each(function (_, idea) {
        var ideaText = $(idea).find('#title').text().toLowerCase() + ' ' + $(idea).find('#body').text().toLowerCase();
        var matches = ideaText.indexOf($searchTerm) !== -1;
        $(idea).toggle(matches);
    });
};

function updateQuality(event) {
    var $currentQuality = $(this).siblings('#quality').text();
    var $vote = $(this).data('vote');
    var $values = voteObject($currentQuality, $vote);
    var $idea = $(this).closest('.idea');
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
