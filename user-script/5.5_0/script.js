// ==UserScript==
// @name           OpenGG.Clean.Player
// @namespace      http://OpenGG.me
// @description    OpenGG.Clean.Player
// @version        5.5
// @updateURL      https://userscripts.org/scripts/source/120679.meta.js
// @downloadURL    https://userscripts.org/scripts/source/120679.user.js
// @match          http://*/*
// @match          https://*/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

function main() {
	'use strict';
	// var useGoogle=JSON.parse(localStorage.useGoogle);
	var useGoogle=false;
	var CONSTANTS={
		PLAYER_DOM:	'object[data],embed[src],iframe[src]',
		PLAYERS:[
			{
				find:/http:\/\/static\.youku\.com\/.*q?(player|loader)(_taobao)?\.swf/,
				replace:useGoogle?'http://gpch.googlecode.com/svn/trunk/loader.swf':'http://player.opengg.me/loader.swf'
			},
			{
				find:/http:\/\/js\.tudouui\.com\/.*\TudouVideoPlayer_Homer_\d+.swf/,
				replace:useGoogle?'http://gpch.googlecode.com/svn/trunk/TudouVideoPlayer_Homer_237.swf':'http://player.opengg.me/TudouVideoPlayer_Homer_237.swf'
			},
			{
				find:/http:\/\/player\.youku\.com\/player\.php\//,
				replace:'http://player.opengg.me/player.php/'
			},
			{
				find:/http:\/\/www.tudou.com\/(([a-z]|programs)\/.*)/,
				replace:'http://player.opengg.me/td.php/$1'
			}
		],
		SHARE_DOM:'#panel_share input',
		SHARES:[
			{
				find:/http:\/\/player\.youku\.com\/player\.php\//,
				replace:'http://player.opengg.me/player.php/'
			}
		],
		TIPS_HOLDER:'#miniheader,#gTop',
		TIPS:'<div class="tips_container">Youku.Tudou.Clean.Player in use. <!--<span id="toggleGoogle">switch</span> or--> <a href="http://opengg.me/687/youku-tudou-clean-player/" style="color:blue">Feedback</a></div>',
		STYLE:	'.playBox_thx #player.player,#playerBox #player.player{height:580px !important}.tips_container{position:absolute;bottom:-2em;right:50px;color:green;opacity:0.4}.tips_container:hover{opacity:0.8}.tips_container #toggleGoogle{color:red;cursor:pointer}',
		TOGGLE_BTN:	'#toggleGoogle'
	};

	var done = [];

	function reloadPlugin(elem) {
		var nextSibling = elem.nextSibling;
		var parentNode = elem.parentNode;
		parentNode.removeChild(elem);
		if(nextSibling) {
			parentNode.insertBefore(elem, nextSibling);
		}else {
			parentNode.appendChild(elem);
		}
	}

	function init(elem) {
		// console.log(elem);
		if(done.indexOf(elem) !== -1){
			return;
		}
		var needReload = false;
		if(modify(elem)){
			reloadPlugin(elem);
			done.push(elem);
		}
	}
	function modify(elem){
		var arr=['data','src'];
		var players=CONSTANTS.PLAYERS;
		var needReload=false;
		for(var i=0;i<arr.length;++i){
			for(var j=0;j<players.length;++j){
				if(elem[arr[i]]&&players[j].find.test(elem[arr[i]])){
					elem[arr[i]]=elem[arr[i]].replace(players[j].find,players[j].replace);
					needReload = true;
				}
			}
		}
		return needReload;
	}
	function onDOMNodeInsertedHandler(e){
		var target = e.target;
		if(target.nodeType === 1 && /OBJECT|EMBED|IFRAME/ig.test(target.nodeName)) {
			init(target);
		}
	}
	function share(elem){
		var shares=CONSTANTS.SHARES;
		for(var j=0;j<shares.length;++j){
			elem.value=elem.value.replace(shares[j].find,shares[j].replace);
		}
	}
	document.addEventListener('DOMNodeInserted', onDOMNodeInsertedHandler, false);
	(function(){
		var matches = document.querySelectorAll(CONSTANTS.PLAYER_DOM);
		for(var i = 0; i < matches.length; ++i) {
			init(matches[i]);
		}
	})();
	(function(){
		var matches=document.querySelectorAll(CONSTANTS.SHARE_DOM);
		for(var i = 0; i < matches.length; ++i) {
			share(matches[i]);
		}
	})();
	(function(){
		function onClickHandler(){
			localStorage.useGoogle=!localStorage.useGoogle;
			location.reload();
		}
		function copyHandler(e){
			var copyInput=e.target;
			copyInput.value = copyInput.value.replace(/http:\/\/www.tudou.com\/(([a-z]|programs)\/.*\.swf)/,'http://player.opengg.me/td.php/$1');
		}
		if(/youku\.com|tudou\.com/.test(location.href)){
			var holder=document.querySelector(CONSTANTS.TIPS_HOLDER);
			if(holder){
				var div = document.createElement('div');
				if(document.defaultView.getComputedStyle(holder,null).getPropertyValue('position')!=='relative'){
					div.style.position='relative';
				}
				div.innerHTML=CONSTANTS.TIPS;
				holder.appendChild(div);

				var css=document.createElement('style');
				css.textContent=CONSTANTS.STYLE;
				document.head.appendChild(css);

				// var toggle=document.querySelector(CONSTANTS.TOGGLE_BTN);
				// toggle.addEventListener('click', onClickHandler, false);
			}
			var youkuPlayer=document.querySelector('.playBox');
			var notWide = !document.querySelector('.playBox_thx');

			if(youkuPlayer&&notWide){
				youkuPlayer.className+=' playBox_thx';
			}

			var copyInput=document.querySelector('#copyInput');
			if(copyInput){
				copyInput.addEventListener('select',copyHandler,false);
			}
		}
	})();
}
/* for Chrome */
main();
/*/ for Chrome */
/* for Firefox */
document.addEventListener('DOMContentLoaded',main,false);
/*/ for Firefox */