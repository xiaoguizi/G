// ==UserScript==
// @name          Douban New Style Avatar with CSS3
// @namespace     http://userstyles.org
// @description	  A New Style Avatar for douban user Avatar
// @homepage      http://userstyles.org/
// @include       http://www.douban.com/*
// @include       https://www.douban.com/*
// @include       http://*.www.douban.com/*
// @include       https://*.www.douban.com/*
// ==/UserScript==
(function() {
	var css = "\
		.hd img,.pic img,dt .m_sub_img,.user-face,.mbtl img,img.face{-webkit-border-radius:5px;-webkit-box-shadow:1px 2px 3px #999;} \
	";
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	heads[0].appendChild(node); 
})();