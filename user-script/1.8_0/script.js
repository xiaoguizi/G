// ==UserScript==
// @name           Onlinedown.No.Ads
// @namespace      Onlinedown.No.Ads
// @description    Onlinedown.No.Ads
// @version        1.8
// @match          http://*.onlinedown.net/softdown/*
// @match          http://*.newhua.com/softdown/*
// ==/UserScript==

(function(){
	var script = document.createElement('script');
	script.textContent = "(" + main.toString() + ")();";
	document.body.appendChild(script);
	function main(){
		var style = document.createElement('style');
		style.textContent='.down_verify,#YMADSDivId{display:none !important}';
		document.getElementsByTagName('head')[0].appendChild(style);
		var g=(typeof unsafeWindow!=='undefined')?unsafeWindow:window;
		var urls=g.durl;
		var html='';
		var item='<a style="width:16%;padding-bottom:10px;display:inline-block" href="{link}">{text}</a>';
		var split='<hr />';
		var lines={};
		(function(){
			var index='';
			var url='';
			var text='';
			for(var i=0;i<urls.length;++i){
				index=urls[i][2];
				url=urls[i][1];
				text=urls[i][0];
				if(!lines[index]){
					lines[index]='';
				}
				lines[index]+=item.replace('{link}',url).replace('{text}',text);
			}
		})();
		for(var i in lines){
			if(typeof lines[i]==='string'){
				html+=lines[i]+split;
			}
		}
		var holder=document.getElementById('add_info');
		if(holder){
			holder.innerHTML=html;
		}
	}
})();