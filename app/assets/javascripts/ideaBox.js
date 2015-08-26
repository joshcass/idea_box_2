$(document).ready(function() {
    $('#save').click(function () {
        var $values = $('#newIdea').serialize();
        $.ajax({
            type: 'POST',
            url: '/ideas',
            data: $values,
            success: function(data){
                $(data).hide().prependTo('#ideaList').slideDown();
            },
            error: function(data){
            },
            dataType: 'html'
        });
        $('#newIdea').trigger('reset');
        return false;
    });

    $('#ideaList').delegate('#deleteIdea', 'click', function() {
        var $idea = $(this).closest('.idea');
        $.ajax({
            type: 'DELETE',
            url: '/ideas/' + $idea.data('id'),
            success: function() {
                $idea.remove();
            }
        });
    });
});
