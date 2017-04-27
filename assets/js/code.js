$(function() { 
    var currLang = document.documentElement.lang;
    $('#language_select select').on('change', function() {
        var lang = $(this).val();
        window.location.href = '/' + (lang === 'en' ? '' : lang);
    });
    $('div[data-role=youtube-playlist]').each(function() {
        var $playlist = this,
            listId = $(this).attr('data-list-id'),
            reqUrl = 'https://www.googleapis.com/youtube/v3/playlistItems',
            reqParams = {
                part: 'contentDetails,snippet,status',
                playlistId: listId,
                key: 'AIzaSyDM8-uF9EGwVl4litOnFGSbBzWodGVRnLU',
                maxResults: 50
            };
        $.get(reqUrl, reqParams, renderVideoList);

        function renderVideoList(data) {
            var publicVideos = data.items.filter(isPublic);
            var thumbs = publicVideos.map(function(item) {
                var link = (typeof item.snippet.thumbnails === 'undefined') ? 'https://academy.binary.com/images/thumbnail-binaryTV.png' : item.snippet.thumbnails.high.url;
                return '<a class="video-thumb" data-video-id="' + item.snippet.resourceId.videoId + '" title="' + item.snippet.title.replace(/\"/g,"%22") + '">' + '<img src="' + link + '">' + '<p>' + item.snippet.title + '</p>' + '</a>';
            });
            $(thumbs.join('')).appendTo($playlist);
        }
    });
    function isPublic(value) {
        return (value.status.privacyStatus === 'public');
    }
    $('div[data-role=youtube-playlist]').on('click', '.video-thumb', function() {
        var videoId = $(this).attr('data-video-id');
        $('.video-container iframe').attr('src', '//www.youtube.com/embed/' + videoId + '?autoplay=1');
        $('html, body').animate({
            scrollTop: $(".video-container").offset().top
        }, 300);
    });
    $('.report-list').on('change', function() {
        $('.single-report').hide();
        $('#report-' + $('.report-list').val()).show();
    });
});