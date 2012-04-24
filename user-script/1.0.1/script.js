// ==UserScript==
// @name           后台优酷视频自动暂停

// @include        http://v.youku.com/v_*.html

// ==/UserScript== 
document.addEventListener("mozvisibilitychange", function(){unsafeWindow.PlayerPause(document.mozHidden)}, false); 