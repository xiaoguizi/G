// ==UserScript==
// @name        doubanIMDb
// @namespace	http://notimportant.org
// @version	v1.6.0
// @include	http://movie.douban.com/subject/*
// @author	iseansay@gmail.com
// ==/UserScript==

function imdb(){
    rottenTomatoesApiKey = 'waz8xhsmeakxvwy9h2ddq9et';
    var imdbnum;  // IMDb 編號
    $("div#info span.pl").each(function(){
        if($(this).text() == 'IMDb链接:')
            imdbnum = $(this).next().text();
    });
    if (!imdbnum)
        return;
    var imdbUrl = "http://imdbapi.xiuxiu.de/" + imdbnum;
    var rottenUrl = "http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json?" +
                    "type=imdb&id=" + imdbnum.slice(2) +
                    "&apikey=" + rottenTomatoesApiKey;
    var imgUrl = "http://getimdb.sinaapp.com/";
    
    $.ajax({
        type : "GET",
        dataType: "json",
        url :imdbUrl,
        success : function(data) {
            var rating = data.Rating;
            var rank = data.Rank;
            var rateHtml;       // IMDb rating score HTML stiring
            var rankHtml;       // IMDb rank HTML string
            if(rating && rating!=='-') {            // construct IMDb score html
                rateHtml ='<span>IMDb:'+rating+'</span>';
            }
            else {
                rateHtml='';
            }

            if(rank) {                            // construct IMDb top250 tank html
                rankHtml = '<b style="color:red;">'+rank+'<b>';
            }
		    else {
		        rankHtml = '';
	        }
            $("strong.rating_num").after('<div id="imdb_score" >' + rateHtml + ' ' + rankHtml + '</div>');
            $('#imdb_score').css({
                "font-size": "14px",
                "color": "green",
                "line-height": "18px"
            });
        }
    });
     
    $.ajax({
			type : "GET",
            dataType: "jsonp",
            url :rottenUrl,
			success : function(data) {
                var rottenImage;
                var rottenText = "";
                var rottenTextColor = "grey";
                var numberRating;
                if (data.error) {
                    numberRating = -1;
                } else {
                    numberRating = data.ratings.critics_score;
                } 
                
                if (numberRating === -1) {
                    rottenImage = "none.png";
                    rottenText = "N/A"
                } else if (numberRating >= 60) {               // if the movie is fresh
                    rottenImage =  "fresh.png";
                    rottenText = numberRating + "%";
                    rottenTextColor = "red";
                } else if (numberRating < 60 && numberRating >= 0) { 	    // if the movie is rotten 
                    rottenImage = 'rotten.png';
                    rottenText = numberRating + "%";
                    rottenTextColor = "green";
                     if (numberRating < 10) {
                         rottenText = " " + numberRating +"%";
                     }
                 } else if (numberRating === -1) {    // if the score is not available
                     rottenImage = "none.png";
                     rottenText = "N/A"
                 }
                $('span.year').after('<span dir="ltr" id="rottentomato" ><img src="' + imgUrl + rottenImage +'"/> '+ rottenText +'</span>');
                $('#rottentomato').css({
                    "color": rottenTextColor,
                    "margin-left": "10px"
                    });
                }
    });
}

// Content Script Injection, see http://wiki.greasespot.net/Content_Script_Injection
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

contentEval(imdb);