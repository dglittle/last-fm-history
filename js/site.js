$(function() {
    function lastFm(url, params, callback) {
        params.format = "json"
        params.callback = randomIdentifier(20)
        eval(params.callback + ' = function (o) { callback(o) }')
        var s = []
        foreach(params, function (e, k) {
            s.push(escapeUrl(k) + '=' + escapeUrl(e))
        })
        $('body').append($('<script/>').attr('src', url + '?' + s.join('&'))) 
    }
    var c = $('.content')
    c.empty()
    c.append('<div class="title">music</div>')
    var d = $('<div/>')
    c.append(d)

    var input = $('<input type="text"/>')
    c.append($('<div style="width:20px;height:20px"/>'))
    c.append(input)
    input.hide()
    function copyName(s) {
        input.show().val(s).select().focus()
    }

    function addTrack(p, d, t) {
        var album = t.album['#text']
        if (album != p.prevAlbum) {
            p.prevAlbum = album
            p.prevCount = 0
        } else {
            p.prevCount++
        }
        if (p.prevCount == 5) {
            var dd = $('<div style="width:64px;height:64px; float:left"/>').click(function () {
                copyName(t.artist['#text'])
            })
            d.append(dd)
            
            var src = jsonPath(t.image, "$..[?(@.size == 'medium')]['#text']")[0]
            if (src) {
                dd.append($('<img>').attr('src', src).attr("width", "64px"))
            }
        }
    }

    function loadTracks(p, d, page, callback) {
        lastFm("http://ws.audioscrobbler.com/2.0/", {
            method : "user.getrecenttracks",
            user : "glittle",
            page : page,
            limit : "200",
            api_key : "80aa6bead950f13f9d46323920294042"
        }, function (o) {
            foreach(o.recenttracks.track, function (e) {
                addTrack(p, d, e)
            })
            
            if (callback)
                callback(o)
        })
    }

    var d1 = $('<div/>')
    d1.append($('<div class="subtle"/>').text("recent"))
    var d2 = $('<div/>')
    d2.append($('<div class="subtle"/>').text("random subsequence"))
    d.append(d1)
    d.append($('<div style="width:20px;height:20px;clear:both"/>'))
    d.append(d2)
    d.append($('<div style="width:20px;height:20px;clear:both"/>'))

    var p1 = {
        prevAlbum : "",
        prevCount : 0
    }
    var p2 = {
        prevAlbum : "",
        prevCount : 0
    }
    loadTracks(p1, d1, 1, function (o) {
        loadTracks(p1, d1, 2, function (o) {
            loadTracks(p1, d1, 3, function (o) {
                loadTracks(p1, d1, 4)
            })                
        })
        var ri = randomIndex(1 * o.recenttracks['@attr'].totalPages - 1) + 1
        loadTracks(p2, d2, ri)
        // known bug: this might get added first, but we don't care too much 
        loadTracks(p2, d2, ri + 1)
    })
});