/**
 * 新浪爱问
 */

var dbIsak = function() {
        var title = $('html head title').text(),
            keyword1 = title.replace('(豆瓣)', '').trim(),
            keyword2 = encodeURIComponent(keyword1),
            url = 'http://api.iask.sina.com.cn/api/isharesearch.php?key=' + keyword2 + '&datatype=json&start=0&num=5&keycharset=utf8',
            html_title = '<div class="da3" style="margin-bottom:0px;padding-bottom:1px;"><h2><img src="http://iask.com/favicon.ico" width="15px;" height="15px;" style="margin-bottom:-2px;" />&nbsp;&nbsp;新浪爱问资源   · · · · · · </h2></div>',
            html_body_start = '<div class="indent" id="db-doulist-section" style="padding-left:5px;border:1px #F4F4EC solid;"><ul class="bs">',
            html_body_yes = '',
            html_body_no = '<li>没有找到相关资料，<a href="http://ishare.iask.sina.com.cn/upload/?from=douban" title="资料上传" target="_blank"><b>立即上传</b></a>即可与豆友们分享！</li>',
            html_body_end = '</ul>',
            html_body_endmore = '<div style="text-align:right; padding:5px 10px 5px 0px;"><a href="http://ishare.iask.sina.com.cn/upload/?from=douban" target="_blank">分享资料</a>&nbsp;&nbsp;<a href="http://api.iask.sina.com.cn/api/search2.php?key=' + keyword2 + '&from=douban&format=" target="_blank">更多&hellip;</a></div>',
            html_body_endend = '</div>',
            length = 30,
            unitname = new Array('K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'),
            unitsize = new Array(1024, 1024 * 1024, 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024);
        $.ajax({
            type: 'GET',
            dataType: 'script',
            url: url,
            success: function() {
                if (iaskSearchResult.sp.m > 0) {
                    var title, title2, image, filesize, url, unit;
                    var regex = /([A-Z\u0391-\uffe5])/g;
                    for (key in iaskSearchResult.sp.result) {
                        title = iaskSearchResult.sp.result[key].title;
                        title2 = title.replace(regex, "$1*");
                        ellipsis = title2.length > length ? '..' : '';
                        title2 = title2.substr(0, length).replace(/\*/g, '') + ellipsis;
                        image = iaskSearchResult.sp.result[key].format;
                        filesize = iaskSearchResult.sp.result[key].filesize;
                        if (filesize < 1024) filesize = filesize + 'B'
                        else {
                            for (var i = 0; i < unitname.length; i++) {
                                if (filesize > unitsize[i] || filesize == unitsize[i]) {
                                    filesize = Math.round(filesize / unitsize[i] * 10) / 10 + unitname[i];
                                    break;
                                }
                            }
                        }
                        url = iaskSearchResult.sp.result[key].url;
                        html_body_yes += '<li><img src="http://www.sinaimg.cn/pfp/ask/images/' + image + '.gif" style="margin-bottom:-2px;" /> <a href="' + url + '?from=douban" title="' + title + '" target="_blank">' + title2 + '</a><span class="pl">(大小:' + filesize + ')</span></li>';
                    }
                    $('.aside').prepend(html_title + html_body_start + html_body_yes + html_body_end + html_body_endmore + html_body_endend);
                } else {
                    $('.aside').prepend(html_title + html_body_start + html_body_no + html_body_end + html_body_endend);
                }
            }
        });
}

/**
 * 屏蔽QQ空间模块
 * @return {[type]} [description]
 * @author koala
 */
var qzoneExcute = function() {
        var doc = window.document,
            QzoneMode = [
                ["#OriginalBroadcasterCon", true],
                ["#QM_Container_11", true],
                ["#QM_Container_38", true],
                ["#QM_Container_39", true],
                ["#QM_Container_3a", true],
                ["#QM_Container_3b", true],
                ["#QM_Container_3c", true],
                ["#colMenu .collet_box[3]", true],
                ["#fixLayout", true]
            ];

        function dealModeName(str) {
            if (typeof str !== "string") {
                return;
            }
            var nameArr = str.trim();
            if (nameArr.indexOf(" ") > -1) {
                var arr, i = 1,
                    executeList = "";
                arr = nameArr.split(" ");
                for (; i < arr.length; i++) {
                    var match = arr[i].match(/(.*)\[([\d])\]/),
                        elem = match[1],
                        item = match[2];
                    executeList += ">" + elem + ":nth-of-type(" + item + ")";
                }
                return doc.querySelector(arr[0] + executeList);
            } else {
                return doc.querySelector(str);
            }
        }
        var QzoneEvent = function() {
                var elem, time, delay, i = 0;
                for (i in QzoneMode) {
                    var obj = QzoneMode[i];
                    if (obj[1]) {
                        elem = dealModeName(obj[0]);
                        if (typeof elem === "undefined");
                        else elem.style.display = "none";
                    }
                }
        }
        window.addEventListener("load", QzoneEvent, false);
}

/**
 * 豆瓣电影下载
 * @return {[type]}
 */
var dbMovie = function(){
    function mkQueryUrl(douban_url) {
        //data is book title
        //var timestamp = new Date().getTime();
        return "http://720p.so/api/movies/show.json?douban_url=" + douban_url;
    }

    function getMovieUrl(id) {
        return "http://720p.so/movies/" + id + "?rel=douban-movie-chrome";
    }

    function getButton(url, has_attach) {
        var btn;
        if (has_attach) {
            var link = getMovieLink(url);
            link = link ? link : url;
            btn = '<a href="' + link + '"  title="下载资源" class="movie_bt_true" target="_blank">高清下载</a>';
        } else {
            btn = '<span title="没有找到电影资源." class="movie_bt_false">暂无资源</span>';
        }
        return btn;
    }

    function getMovieLink(url){
        var link;
        $.ajax({
            url: url,
            datatype: "html",
            type: "GET",
            async: false,
            success: function (cont) {
                var node = $(".attach", cont);
                if (node) {
                    link = node.attr("href");
                } else {
                    link = url;
                }
            }

        });
        return link;
    }

    function queryAndGenerateButton(url) {
        $.ajax({
            url: mkQueryUrl(url),
            dataType: "JSON",
            type: "GET",
            success: function(json) {
                if (json.success) {
                    url = getMovieUrl(json.id)
                } else {
                    url = 'http://720p.so/movies/new?douban_url=' + url + '&rel=douban-movie-chrome';
                }
                btn = getButton(url, json.has_attach);
                $('.a_stars').before(btn);
            }
        });
    }
    var url = window.location.toString();

    // Book Page
    if (url.indexOf('subject') != -1) {
        queryAndGenerateButton(url);
    }
}

/**
 * 跳过chrome沙箱执行
 * @param  {[type]} source [description]
 * @return {[type]}
 */
function contentEval( source ) {
    if ('function' == typeof source) {
            source = '(' + source + ')();'
    }
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

/**
 * 判断执行模块
 * @type {[type]}
 */
var domain = document.domain;
var ArrHost = domain.split(".");
var emHost = ArrHost[ArrHost.length - 2].toString();
switch (emHost) {
    case "qq":
        qzoneExcute();
        break;
    case "douban":
        dbMovie();
        contentEval( dbIsak );
        break;
}
