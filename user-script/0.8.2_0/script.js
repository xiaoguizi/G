// ==UserScript==
// @name			校长之怒
// @version			0.8.2
// @namespace		angerOfPresident
// @include			http://tieba.baidu.com/*
// @author			anran
// @date			2012/4/19
// @updateURL		https://userscripts.org/scripts/source/105184.user.js
// ==/UserScript==
/************************************************************
 更新日志
 2012/4/19
 base64模式修复和文字混用显示错误的问题
 新旧列表页增加对各种ajax自动翻页或刷新的兼容
 ************************************************************/

//读取配置
var blacklist = new Array();
var config = new Array();
var usersign = new Array();
if(GM_getValue('config'))
	config = JSON.parse(GM_getValue('config'));
if(GM_getValue('blacklist'))
	blacklist = JSON.parse(GM_getValue('blacklist'));
if(GM_getValue('usersign'))
	usersign = JSON.parse(GM_getValue('usersign'));
var imgSize = getConfig(2);
if(imgSize == null) {
	imgSize = new Object();
	imgSize.imgMinWidth = 500;
	imgSize.imgMaxWidth = 999;
	imgSize.imgMinHeight = 300;
	imgSize.imgMaxHeight = 999;
}
if(usersign.length == 0) {
	usersign[0] = new Object();
	usersign[0].name = '内置签名1';
	usersign[0].imgUrl = 'http://imgsrc.baidu.com/forum/pic/item/18d8bc3eb13533fae9aee28ca8d3fd1f41345b73.jpg';

	usersign[1] = new Object();
	usersign[1].name = '内置签名2';
	usersign[1].imgUrl = 'http://imgsrc.baidu.com/forum/pic/item/c995d143ad4bd113dad2c6905aafa40f4bfb0570.jpg';
}
if(getConfig(6) != 0)
	GM_addStyle('body {font-family:Microsoft YaHei !important;}a, a> font {text-decoration:none !important;color:rgb(28, 64, 120) !important;}a:visited {color:rgb(130, 130, 130) !important;}#thread_list th, .l_menu {background-color:rgb(194, 207, 239) !important;}img#tieba_logo, table#rightAd, div.l_banner, #frs_banner_ad{display:none !important;}.p_thread,.l_container>.l_core>.p_postlist, .l_thread {width:99% !important;}.thread_list tr {height:35px !important;}.goTop_wide {left:98% !important;}');
GM_addStyle('ul#nunavigation {position: fixed;margin: 0px;padding: 0px;top: 0px;left: 10px;list-style: none;z-index: 999999;width: 721px;}ul#nunavigation li {width: 103px;display: inline;float: left;}ul#nunavigation li a {display: block;float: left;margin-top: -2px;width: 100px;height: 25px;background-color: #E7F2F9;background-repeat: no-repeat;background-position: 50% 10px;border: 1px solid #BDDCEF;-moz-border-radius: 0px 0px 10px 10px;-webkit-border-bottom-right-radius: 10px;-webkit-border-bottom-left-radius: 10px;-khtml-border-bottom-right-radius: 10px;-khtml-border-bottom-left-radius: 10px;text-decoration: none;text-align: center;padding-top: 80px;opacity: 0.7;}ul#nunavigation li a:hover {background-color: #CAE3F2;}ul#nunavigation li a span {letter-spacing: 2px;font-size: 11px;color: #60ACD8;text-shadow: 0 -1px 1px #fff;}ul#nunavigation .photos a {background-image: url(http://imgsrc.baidu.com/forum/pic/item/4d086e061d950a7b044160650ad162d9f2d3c91e.jpg);}ul#nunavigation .option a {background-image: url(http://imgsrc.baidu.com/forum/pic/item/b8014a90f603738d42102283b31bb051f819ec3d.jpg);}.overlay {background: transparent url(http://tympanus.net/Tutorials/CSSOverlay/images/overlay.png) repeat top left;position: fixed;top: 0px;bottom: 0px;left: 0px;right: 0px;z-index: 999;}.nubox {position: fixed;top: -400px;display:none;left: 28%;right: 28%;background-color: #fff;color: #7F7F7F;padding: 20px;border: 2px solid #ccc;-moz-border-radius: 20px;-webkit-border-radius: 20px;-khtml-border-radius: 20px;-moz-box-shadow: 0 1px 5px #333;-webkit-box-shadow: 0 1px 5px #333;z-index: 999;}.nubox h1 {border-bottom: 1px dashed #7F7F7F;margin: -20px -20px 0px -20px !important;padding: 10px !important;background-color: #FFEFEF;color: #EF7777;-moz-border-radius: 20px 20px 0px 0px;-webkit-border-top-left-radius: 20px;-webkit-border-top-right-radius: 20px;-khtml-border-top-left-radius: 20px;-khtml-border-top-right-radius: 20px;}a.boxclose {float: right;width: 26px;height: 26px;background: transparent url(http://imgsrc.baidu.com/forum/pic/item/267f9e2f07082838e11bf2b5b899a9014c08f179.jpg) repeat top left;margin-top: -30px;margin-right: -30px;cursor: pointer;}a.boxok {float: right;width: 32px;height: 32px;background: transparent url(http://imgsrc.baidu.com/forum/pic/item/a50f4bfbfbedab64da576361f736afc379311e6d.jpg) repeat top left;margin-top: -30px;cursor: pointer;}#header .i {opacity: 1 !important;}.subbtn_bg {float: none !important;}.subTip {float: none !important;}#postByUnicode, #convertLinks, #ConverToBase64 {width: 105px !important;background: url("http://imgsrc.baidu.com/forum/pic/item/3bf33a87e950352aaa7de3b15343fbf2b2118b6f.jpg") no-repeat scroll 0 0 transparent !important;}.base64html,.base64text {font-size:14px !important;}');
var line = 'http://hiphotos.baidu.com/matrox/pic/item/3bb2a319d6633f0c42a9adbc.jpg';

main();
function main() {

	if(window != window.top || window.document.title == "")
		return;
	//JQuery支持
	var JQueryDiv = document.createElement("div");
	JQueryDiv.setAttribute("onclick", "return $;");
	$ = JQueryDiv.onclick();
	var W = unsafeWindow;
	var sbId;

	var counter = 1;
	setTimeout(function() {
		sbId = W.rich_postor._dom_id.add_post_submit.replace('aps', '');
		if($("td.thread_title").length > 0 || $("div.th_w2").length > 0) {
			init2();
		} else {
			init1();
		}
	}, 1);
	//帖子页面初始化
	function init1() {
		displayUserArea();
		displayUserArea2();
		blockReplyInfo();
		blockUserSign();
		displayFixedMenu();
		displayOptionDialog();
		ipQueryDisplay();
		addButtons();
		displayUserSignArea();
		contenteditableBugFix();
	}

	var cur = $('.cur').text();
	//列表页面初始化
	function init2() {
		displayFixedMenu();
		displayOptionDialog();
		displayThreadList();
		addButtons();
		displayUserSignArea();
		contenteditableBugFix();
	}

	//用户区各种显示
	var zhikanUrl = "http://tianyatool.com/cgi-bin/baidu/baidu-lz.pl?url=" + window.location.href.replace(/\?.*/, "");
	function displayUserArea() {
		var $users = $("a.p_author_name");
		var $tbodys = $users.parent().parent().parent().parent().parent();
		for(var i = 0; i < $users.length; i++) {
			displayUserArea3(i, $users, $tbodys);
		}
		$('div.p_postlist').find("p.d_post_content").each(function(i) {
			autoConvertBase64($(this));
		});
	}

	//兼容ajax翻页
	function displayUserArea2() {
		document.addEventListener('DOMNodeInserted', function(event) {
			var $users = $(event.target).find('a.p_author_name');
			var $tbodys = $users.parent().parent().parent().parent().parent();
			$(event.target).find('div.l_post').each(function(i) {
				displayUserArea3(i, $users, $tbodys);
			});
			$(event.target).find("p.d_post_content").each(function() {
				try {
					autoConvertBase64($(this));
				} catch(e) {
				}
			});
		}, true);
	}

	//添加用户区按钮 屏蔽用户
	function displayUserArea3(i, $users, $tbodys) {
		var $user = $users.eq(i);
		var $tbody = $tbodys.eq(i);
		var username = $user.text();
		var ul = '';
		var a1 = '<a href="' + zhikanUrl + '&unm=' + encodeURI(username) + '">只看此人</a>';
		ul += '<li>' + a1 + '</li>';
		var a2 = '<a href="javascript:void(0);" class="blockUser" name="' + username + '">屏蔽此人</a>';
		ul += '<li>' + a2 + '</li>';
		$user.append(ul);
		$user.find("a")[1].addEventListener('click', addToBlacklist, false);

		var st1_1 = getConfig(3);
		for(var j = 0; j < blacklist.length; j++) {
			if(username == blacklist[j]) {
				$tbody.css("display", "none");
				if(st1_1 == 0) {
					$tbody.parent().append(newTbody(username));
				} else {
					if($tbody.parent().parent().attr('class') == 'p_post') {
						$tbody.parent().parent().remove();
					} else {
						//新版贴吧兼容
						$tbody.parent().remove();
					}
				}
			}
		}
	}

	//自动解码base64
	function autoConvertBase64($d_post_content) {
		var temp = $d_post_content.text();
		if(!/data:text\/html;base64,.*/.test(temp))
			return;
		$d_post_content.parent().prepend('<a href="javascript:void(0);" style="text-decoration: none;" class="convertBase64ToHtml">转换为html</a>&emsp;<a href="javascript:void(0);" style="text-decoration: none;" class="convertBase64ToText">转换为文本</a>&emsp;<a href="javascript:void(0);" style="text-decoration: none;" class="convertBase64ToNone">取消转换</a>&emsp;<font style="font-size:11px;line-height:11px;color:red;" class="base64font">未转换的base64数据 : </font><hr>');

		$d_post_content.parent().find(".convertBase64ToHtml")[0].addEventListener("click", function() {
			convertBase64ToHTML($d_post_content, temp);
		}, false);
		$d_post_content.parent().find(".convertBase64ToText")[0].addEventListener("click", function() {
			convertBase64ToText($d_post_content, temp);
		}, false);
		$d_post_content.parent().find(".convertBase64ToNone")[0].addEventListener("click", function() {
			$d_post_content.css("display", "");
			$d_post_content.parent().find(".base64font").html('未转换的base64数据');
			$d_post_content.parent().find(".base64text").remove();
			$d_post_content.parent().find(".base64html").remove();
		}, false);
		var i = getConfig(7);
		if(i == 1) {
			convertBase64ToHTML($d_post_content, temp);
		} else if(i != 0) {
			convertBase64ToText($d_post_content, temp);
		}

	}

	//base64解码为文本
	function convertBase64ToText($d_post_content, temp) {
		$d_post_content.css("display", "none");
		$d_post_content.parent().find(".base64font").html('文本形式的base64数据');
		$d_post_content.parent().find(".base64text").remove();
		$d_post_content.parent().find(".base64html").remove();
		var str = /data:text\/html;base64,\w*\+?/.exec(temp) + '';
		var str2 = atob(str.replace(/data:text\/html;base64,/, ''));

		var tmp = str.match(/&#(\d+);/g);
		if(tmp != null)
			for(var i = 0; i < tmp.length; i++) {
				str = str.replace(tmp[i], String.fromCharCode(tmp[i].replace(/[&#;]/g, '')));
			}
		var result = $d_post_content.html().replace(str, str2.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
		$d_post_content.parent().append("<p class='base64text'>" + result + "</p>");
	}

	//base64解码为html
	function convertBase64ToHTML($d_post_content, temp) {
		$d_post_content.css("display", "none");
		$d_post_content.parent().find(".base64font").html('html形式的base64数据');
		$d_post_content.parent().find(".base64text").remove();
		$d_post_content.parent().find(".base64html").remove();
		var str = /data:text\/html;base64,\w*/.exec(temp) + '';
		var str2 = atob(str.replace(/data:text\/html;base64,/, ''));
		var result = $d_post_content.html().replace(str, str2);
		$d_post_content.parent().append("<p class='base64html'>" + result + "</p>");
	}

	//显示悬浮功能菜单
	function displayFixedMenu() {

		var ul = '<ul id="nunavigation"><li class="option"><a id="option" href="#optionDialog"><span>配置</span></a></li>';
		ul += '<li class="photos"><a id="onlyShowImg" href="javascript:void(0);"><span>仅看图片</span></a></li></ul>';
		$(document.body).append(ul);

		var d = 300;
		$('#nunavigation a').each(function() {
			$(this).stop().animate({
				'marginTop' : '-80px'
			}, d += 150);
		});
		$('#nunavigation > li').hover(function() {
			$('a', $(this)).stop().animate({
				'marginTop' : '-2px'
			}, 200);
		}, function() {
			$('a', $(this)).stop().animate({
				'marginTop' : '-80px'
			}, 200);
		});

		$("#onlyShowImg")[0].addEventListener("click", onlyShowImg, false);
	}

	//配置窗口设置
	function displayOptionDialog() {
		var div = '<div class="overlay" id="overlay" style="display:none;"></div>';
		div += '<div class="nubox" id="box"><a class="boxclose" id="boxclose"></a><h1>Option<br></h1><br>';

		var st6 = "<li><input type='checkbox' id='st6'/>&emsp;开启美化&emsp;";
		div += st6;

		var st1 = "<li><input type='checkbox' id='st1'/>&emsp;开启列表页面黑名单过滤&emsp;";
		st1 += "<input type='checkbox' id='st1_2'/>&emsp;开启黑名单完全过滤</li>";
		div += st1;

		var st7 = "<li>base64转换 : &emsp;&emsp;禁止自动转换<input type='radio' name='st7' value = '0'/>";
		st7 += "&emsp;&emsp;转换为html<input type='radio' name='st7' value = '1'/>";
		st7 += "&emsp;&emsp;转换为文本<input type='radio' name='st7' value = '2'/></li>";
		div += st7;

		var st5 = "<li>屏蔽签名档 : &emsp;&emsp;完全屏蔽<input type='radio' name='st5' value = '0'/>";
		st5 += "&emsp;&emsp;屏蔽多次<input type='radio' name='st5' value = '1'/>";
		st5 += "&emsp;&emsp;完全显示<input type='radio' name='st5' value = '2' /></li>";
		div += st5;

		var st2 = "<li>仅看图片大小：&emsp;&emsp;&nbsp;";
		st2 += "<input type='text' style='width:50px;' id='st2_1'/>";
		st2 += " < 宽  < <input type='textField' style='width:50px;' id='st2_2'/>";
		st2 += "&emsp;且 &emsp;<input type='text' style='width:50px;' id='st2_3'/>";
		st2 += " < 高  < <input type='textField' style='width:50px;' id='st2_4'/></li>";
		div += st2;

		var st3 = "<li>黑名单 (逗号分隔)： <textarea rows=2 style='resize: none;width:100%' id='st3'/> </li>";
		div += st3;

		var st4 = "<li>签名档 (换行分隔)： <textarea rows=3 style='resize: none;width:100%' id='st4'/> </li>";
		div += st4;
		div += '<br><br><a class="boxok" id="boxok"></a></div>';

		$(document.body).append(div);

		$('#boxok')[0].addEventListener("click", saveConfig, false);
		$('#option').click(function() {
			flushConfig();
			$('#overlay').fadeIn('fast', function() {
				$('#box').animate({
					'top' : '100px'
				}, 500);
				$('#box').css("display", "block");
			});
		});
		$('#boxclose').click(function() {
			$('#box').animate({
				'top' : '-400px'
			}, 500, function() {
				$('#box').css("display", "none");
				$('#overlay').fadeOut('fast');
			});
		});
	}

	//刷新配置菜单
	function flushConfig() {
		var st1 = getConfig(0);
		if(st1 == null || st1 != 0) {
			$("#st1").attr("checked", true);
		} else {
			$("#st1").attr("checked", false);
		}

		var st1_2 = getConfig(3);
		if(st1_2 == null || st1_2 != 0) {
			$("#st1_2").attr("checked", true);
		} else {
			$("#st1_2").attr("checked", false);
		}

		var st4 = "";
		for(var i = 0; i < usersign.length; i++)
			st4 += usersign[i].name + ":" + usersign[i].imgUrl + "\n";

		var st5 = getConfig(4) == undefined ? 2 : getConfig(4);

		var st6 = getConfig(6);

		var st7 = getConfig(7) == undefined ? 2 : getConfig(7);

		$("#st2_1").val(imgSize.imgMinWidth);
		$("#st2_2").val(imgSize.imgMaxWidth);
		$("#st2_3").val(imgSize.imgMinHeight);
		$("#st2_4").val(imgSize.imgMaxHeight);
		$("#st3").val(blacklist);
		$("#st4").val(st4);
		$("input:radio[name='st5']").eq(st5).attr("checked", true);
		$("#st6").attr("checked", st6 != 0);
		$("input:radio[name='st7']").eq(st7).attr("checked", true);
	}

	//存储配置信息
	function saveConfig() {
		//列表过滤
		{
			var st1 = $("#st1")[0].checked ? 1 : 0;
			setConfig(0, st1);
		}
		//完全屏蔽
		{
			var st1_2 = $("#st1_2")[0].checked ? 1 : 0;
			setConfig(3, st1_2);
		}
		//屏蔽签名档
		{
			var st5 = $("input:radio[name='st5']:checked").val();
			setConfig(4, st5);
		}
		//仅看图片
		{
			imgSize.imgMinWidth = $("#st2_1").val();
			imgSize.imgMaxWidth = $("#st2_2").val();
			imgSize.imgMinHeight = $("#st2_3").val();
			imgSize.imgMaxHeight = $("#st2_4").val();
			setConfig(2, imgSize);
		}
		//黑名单
		{
			blacklist = $("#st3").val().replace('，', ',').split(',');
			GM_setValue("blacklist", JSON.stringify(blacklist));
		}
		//自定义签名
		{
			if($("#st4").val().length > 3) {
				var a = $("#st4").val().replace('：', ':').split('\n');
				var b = new Array();
				for(var i = 0; i < a.length; i++) {
					var c = new Object();
					c.name = a[i].substring(0, a[i].indexOf(":"));
					c.imgUrl = a[i].substring(a[i].indexOf(":") + 1);
					if(c.name != "" && c.imgUrl != "") {
						b[i] = c;
					}
				}
				GM_setValue("usersign", JSON.stringify(b));
			} else {
				GM_setValue("usersign", JSON.stringify(new Array()));
			}
		}
		//美化
		{
			var st6 = $("#st6")[0].checked ? 1 : 0;
			setConfig(6, st6);
		}
		//是否转换base64
		{
			var st7 = $("input:radio[name='st7']:checked").val();
			setConfig(7, st7);
		}
		window.location.reload();
	}

	//屏蔽签名档
	function blockUserSign() {
		var st5 = getConfig(4);
		var $d_sign_split = $('.d_sign_split');
		var $usersignSplit = $('.d_post_content img[src="' + line + '"]');
		if(st5 == 0) {
			for(var i = 0; i < $d_sign_split.length; i++) {
				var split = $d_sign_split.eq(i);
				var next = split.next();
				next.remove();
				split.remove();
			}
			for(var i = 0; i < $usersignSplit.length; i++) {
				var split = $usersignSplit.eq(i);
				split.next().next().remove();
				split.next().remove();
				split.remove();
			}
		} else if(st5 == 1) {
			var temps = new Array();
			for(var i = 0; i < $d_sign_split.length; i++) {
				var split = $d_sign_split.eq(i);
				var next = split.next();
				if(temps.contains(next.attr('src'))) {
					next.remove();
					split.remove();
				} else {
					temps.push(next.attr('src'));
				}
			}
			for(var i = 0; i < $usersignSplit.length; i++) {
				var split = $usersignSplit.eq(i);
				var next = split.next().next();
				if(temps.contains(next.attr('src'))) {
					next.remove();
					split.next().remove();
					split.remove();
				} else {
					temps.push(next.attr('src'));
				}
			}
		}
	}

	//IP查询绑定
	function ipQueryDisplay() {
		var $users = $("td.d_author_anonym");
		for(var i = 0; i < $users.length; i++) {
			var $u = $users.eq(i);
			var ip = $u.text();
			var url = "javascript:void(0);";
			$u.html("<a target='_blank' class='ip_query' ip=" + ip.replace('\*', 0) + ">" + ip + "</a>");
			$u.children()[0].addEventListener("click", IpAddressQuery, false);
		}
	}

	//IP归属地查询
	function IpAddressQuery() {
		GM_xmlhttpRequest({
			method : 'GET',
			url : 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' + $(this).attr('ip'),
			headers : {
				'User-agent' : 'Mozilla/4.0 (compatible) Greasemonkey',
				'Accept' : 'application/atom+xml,application/xml,text/xml',
			},
			onload : function(responseDetails) {
				var data = responseDetails.responseText;
				data = data.substring(20, data.length - 1);
				var obj = JSON.parse(data);
				var str = "查询结果:\t" + obj.country + "\t" + obj.province + "\t" + obj.city + "\t" + obj.isp;
				W.alert(str);
			}
		});
	}

	//列表相关显示
	function displayThreadList() {

		//兼容ajax自动翻页
		$('#container')[0].addEventListener('DOMNodeInserted', function(event) {

			$(event.target).find("td.thread_title").each(function(i) {
				displayThreadList1($(this));
			});
			$(event.target).find("div.th_w2").each(function(i) {
				displayThreadList1($(this));
			});
		}, true);

		displayThreadList1($("td.thread_title"));
		displayThreadList2($("div.th_w2"));
	}

	function displayThreadList1($ThreadList) {
		var temp = new Object();
		for(var i = 0; i < $ThreadList.length; i++) {
			//最后一页
			var td = $ThreadList.eq(i);
			var pn = Math.floor(td.parent().attr("replay") / 30);
			var href = td.find("a").attr("href");
			if(pn > 0) {
				td.append("<a target='_blank' href=" + href + "?pn=" + ++pn + ">>></a>");
			}
			var st1 = getConfig(0);
			//黑名单过滤
			if(st1 == null || st1 != 0) {
				var username = $ThreadList.eq(i).next().first().text();
				for(var j = 0; j < blacklist.length; j++) {
					if(username == blacklist[j]) {
						$ThreadList.eq(i).parent().css("display", "none");
						temp[username] = temp[username] == null ? 1 : temp[username] + 1;
					}
				}
			}
		}

		var str = "";
		for(var user in temp) {
			str += user + " (" + temp[user] + ")  ";
		}
		if(str != ""){
			var $info = $("div.th_footer").find('[name=blockinfo]');
			if($info.length == 0){
				$("div.th_footer").append(' , 屏蔽信息 : <span name="blockinfo" class="red">' + str + '</span>');
			} else {
				$info.text($info.html() + str);
			}
		}
			
	}

	//新版
	function displayThreadList2($ThreadList) {
		var temp = new Object();
		for(var i = 0; i < $ThreadList.length; i++) {
			//最后一页
			{
				var $Thread = $ThreadList.eq(i);
				var $a = $Thread.find('a.th_tit').eq(0);
				var pn = Math.floor($Thread.prev().children().eq(0).text() / 30);
				var href = $a.attr("href");
				if(pn > 0) {
					$a.after("<a target='_blank' href=" + href + "?pn=" + ++pn + ">>></a>");
				}
			}
			var st1 = getConfig(0);
			//黑名单过滤
			if(st1 == null || st1 != 0) {
				var username = $ThreadList.eq(i).find('span.th_author').children().eq(0).text();
				for(var j = 0; j < blacklist.length; j++) {
					if(username == blacklist[j]) {
						$ThreadList.eq(i).parent().css("display", "none");
						temp[username] = temp[username] == null ? 1 : temp[username] + 1;
					}
				}
			}
		}

		var str = "";
		for(var user in temp) {
			str += user + " (" + temp[user] + ")  ";
		}
		if(str != "")
			$("div.th_footer_l").append(' , 屏蔽信息 : <span class="red">' + str + '</span>');
	}

	//各种按钮
	function addButtons() {
		var button = '&nbsp;<input type="button" value="unicode发表" class="subbtn_bg" id="postByUnicode">';
		button += '&nbsp;<input type="button" value="转换为base64" class="subbtn_bg" id="ConverToBase64">';
		button += '&nbsp;<input type="button" value="竖 排" class="subbtn_bg" id="changeText">';
		button += '&nbsp;<input type="button" value="和谐测试" class="subbtn_bg" id="hexieTest">';

		$('#aps' + sbId).after(button);

		var title = getConfig(5) == null ? "怒!!!  =皿=" : getConfig(5);
		var musicUrl = '<tr><td></td><td>&nbsp;标题 : <input value="' + title + '" style="width:100px" id="musicUrlTitle">';
		musicUrl += '&nbsp;链接 : <input style="width:300px" id="musicUrl">';
		musicUrl += '&nbsp;<input type="button" id="convertLinks" class="subbtn_bg" value="插入音乐链接"></td></tr>';
		$('#pu' + sbId).after(musicUrl);

		$('#postByUnicode')[0].addEventListener("click", postByUnicode, true);
		$('#ConverToBase64')[0].addEventListener("click", ConverToBase64, true);
		$('#changeText')[0].addEventListener("click", changeText, false);
		$('#hexieTest')[0].addEventListener("click", hexieTest, false);
		$('#convertLinks')[0].addEventListener("click", convertLinks, false);
	}

	//转换为base64
	function ConverToBase64() {
		var str = a2u($("div.tb-editor-editarea").text());
		var result = 'data:text/html;base64,' + btoa(str);
		$("div.tb-editor-editarea").html(result);
	}

	//贴吧复制bug修复
	function contenteditableBugFix() {
		$e = $("div.tb-editor-editarea");
		window.onclick = function(event) {
			var $target = $(event.target);
			if(event.button == 2 && $target.attr('class') != 'tb-editor-editarea') {
				$e.attr('contenteditable', 'false');
			} else if(event.button == 0) {
				$e.attr('contenteditable', 'true');
			}
		}
	}

	//和谐测试
	function hexieTest() {
		GM_xmlhttpRequest({
			method : 'POST',
			url : 'http://xiaohexie.com/~xiaohexi/ff_test.php',
			data : "co=" + W.rich_postor._editor.editArea.innerHTML.replace(/&nbsp;/gi, ' '),
			headers : {
				"Content-Type" : "application/x-www-form-urlencoded"
			},
			onload : function(data) {
				var temp = data.responseText.replace(/\s/gi, '&nbsp;').replace(/丄/gi, '龘');
				W.rich_postor._editor.editArea.innerHTML = temp;
			}
		});
	}

	//音乐链接
	function convertLinks() {
		var url = $('#musicUrl').val();
		$('#musicUrl').val('');
		var title = $('#musicUrlTitle').val();
		setConfig(5, title);
		if(url.indexOf('http://') == -1 && url.indexOf('https://') == -1 && url.indexOf('ftp://') == -1)
			url = 'http://' + url;

		var temp = '<img width="20" height="20" data-height="95" data-width="400"';
		temp += ' title="http://box.baidu.com/widget/flash/bdspacesong.swf?from=tiebasongwidget&amp;url=';
		temp += url;
		temp += '&amp;name=' + encodeURIComponent(title) + '&amp;artist=';
		temp += '&amp;extra=&amp;autoPlay=false&amp;loop=true"';
		temp += 'src="http://tb.himg.baidu.com/sys/portrait/item/91afc9cfbfceb2bbd7bcb7c5c6a86c0c" class="BDE_Music">';
		W.rich_postor._editor.editArea.innerHTML += temp;
	}

	//构建屏蔽信息
	function newTbody(username) {
		var font = document.createElement("font");
		font.color = "red";
		font.innerHTML = "此楼来自于被屏蔽用户 " + username + " . ";

		var a = document.createElement("a");
		a.innerHTML = "将该用户移出黑名单.";
		a.href = "javascript:void(0);";
		a.style.textDecoration = "none";
		a.name = username;
		$(a).attr("class", "blockInfo");
		a.addEventListener("click", removeFromBlacklist, false);

		var tbody = document.createElement("tbody");
		tbody.align = "center";
		tbody.appendChild(font);
		tbody.appendChild(a);
		return tbody;
	}

	//加入黑名单
	function addToBlacklist() {
		var username = $(this).attr("name");
		for(var i = 0; i < blacklist.length; i++)
			if(username == blacklist[i])
				return;

		blacklist.push(username);
		GM_setValue("blacklist", JSON.stringify(blacklist));

		var $p = $("a[name=" + username + "]").parent().parent().parent().parent().parent().parent().parent();
		$p.css("display", "none");

		var st1_1 = getConfig(3);
		for(var i = 0; i < $p.length; i++) {
			if(st1_1 == 0) {
				$p.eq(i).parent().append(newTbody(username));
			} else {
				if($p.parent().parent().attr('class') == 'p_post') {
					$p.parent().parent().parent().remove();
				} else {
					//新版贴吧兼容
					$p.parent().parent().remove();
				}
			}
		}

		$(this).parent().parent().css("display", "none");
		blockReplyInfo();
	}

	//引用屏蔽
	function blockReplyInfo() {
		var $legend = $('legend');
		for(var i = 0; i < $legend.length; i++) {
			for(var j = 0; j < blacklist.length; j++) {
				var temp = '引用&nbsp;' + blacklist[j];
				if($legend[i].innerHTML.indexOf(temp) == 0 && blacklist[j].length > 0)
					$legend.eq(i).next().text('被屏蔽的发言');
			}
		}
	}

	//移出黑名单
	function removeFromBlacklist() {
		var username = $(this).attr("name");
		blacklist.deleteElementByValue(username);
		GM_setValue("blacklist", JSON.stringify(blacklist));
		window.location.reload();
	}

	//自定义签名
	function displayUserSignArea() {

		var div = '<tr>';
		var names = "";
		for(var i = 0; i < usersign.length; i++)
			names += "<option oid = " + (i + 1) + ">" + usersign[i].name + "</option>";
		div += "<td></td><td>是否使用自定义签名档<input type='checkbox' id='doUserSign'/><select id='UserSignImg'>";
		div += "<option oid = 0>随机签名</option>"
		div += names + "</select></td></tr>";
		$("tr#pu" + sbId).parent().append(div);

		var $doUserSign = $("input#doUserSign");
		var $UserSignImg = $("select#UserSignImg");
		var config1 = getConfig(1);
		if(config1 != -1) {
			$doUserSign.attr("checked", true);
			$UserSignImg.find("option").eq(config1).attr("selected", true);
		}

		//签名档BUG修复,暂时用预读解决 ,相信还会有更好的方法.
		$(document.body).append('<img style="display:none" src="' + line + '">');
		for(var i = 0; i < usersign.length; i++) {
			var temp = '<img style="display:none" src="' + usersign[i].imgUrl + '">';
			$(document.body).append(temp);
		}

		unsafeWindow.rich_postor._submit2 = unsafeWindow.rich_postor._submit;
		unsafeWindow.rich_postor._submit = function() {
			setTimeout(function() {
				unsafeWindow.rich_postor._submit2()
			}, 1);
		}
		$('#aps' + sbId).click(submitWithUserSign);
		$doUserSign[0].addEventListener("click", saveUserSignInfo, false);
		$UserSignImg[0].addEventListener("click", saveUserSignInfo, false);
	}

	//添加签名,发帖
	function submitWithUserSign() {
		if(!$("input#doUserSign")[0].checked)
			return;
		var optionIndex = parseInt($("select#UserSignImg").find("option:selected").attr("oid"));
		if(optionIndex == 0) {
			var len = $("select#UserSignImg").find("option").length - 1;
			optionIndex = Math.floor(Math.random() * len + 1);
		}
		var scope = W.rich_postor._editor._events.paste[0].scope;
		var img = scope.createImageTagFromUrl(line);
		var img2 = scope.createImageTagFromUrl(usersign[optionIndex - 1].imgUrl);
		//W.rich_postor._editor.execCommand("inserthtml", img);
		W.rich_postor._editor.editArea.innerHTML += "<br>" + img + "<br>" + img2;
	}

	//自定义签名状态记忆
	function saveUserSignInfo() {
		if(!$('input#doUserSign')[0].checked) {
			setConfig(1, -1);
			return;
		}
		var optionIndex = $("select#UserSignImg").find("option:selected").attr("oid");
		setConfig(1, Number(optionIndex));
	}

	//竖排模块
	function changeText() {
		var text = $("div.tb-editor-editarea").html();
		var result;
		if(counter++ & 1 == 1) {
			result = getEncryptedText(text);
			$('input#changeText').val("横 排");
		} else {
			result = getDecryptedText(text);
			$('input#changeText').val("竖 排");
		}
		$("div.tb-editor-editarea").html(result);
	}

	//竖排
	function getEncryptedText(text) {
		text = text.replace(/<br>/gi, "〓").replace(/<[^>]*>/gi, "");
		text = toSBC(text);
		var len = text.length;
		var row = 0;
		if(len == 0) {
			return;
		} else if(len <= 20) {
			row = 2;
		} else if(len > 20 && len < 150) {
			row = 10;
		} else {
			row = Math.ceil(len / 22);
		}
		var column = Math.ceil(len / row);
		var array = splitByLength(text, column);
		var result = "";
		for(var j = 0; j < array[0].length; j++) {
			for(var i = array.length - 1; i >= 0; i--) {
				var str = array[i].charAt(j);
				if(str == "")
					str = "　"
				result += str + "&emsp;";
			}
			result += "<br>"
		}
		return result;
	}

	function splitByLength(str, len) {
		var length = Math.ceil(str.length / len);
		var array = new Array(length);
		var start = 0;
		for(var i = 0; i < length; i++) {
			array[i] = str.substring(start, start + len);
			start = start + len;
		}
		return array;
	}

	//横排
	function getDecryptedText(text) {
		text = text.split(/<br>/gi);
		var result = "";
		var len = text[0].length;
		for(var i = len - 1; i >= 0; i--) {
			for(var j = 0; j < text.length - 1; j++) {
				var tmp = text[j].charAt(i);
				if(tmp != null)
					result += tmp;
			}
		}
		result = result.replace(/〓/gi, "<br>").replace(/\s/gi, "")
		return result;
	}

	//unicode发表
	function postByUnicode() {
		submitWithUserSign();
		var str = W.rich_postor._editor.getHtml();
		str = str.replace(/<\/?a[^>]*>/gi, "");
		var temps = new Array();

		var i = 0;
		while(/<[^>]*>|&nbsp;|@\S*/.test(str)) {
			temps[i] = /<[^>]*>|&nbsp;|@\S*/.exec(str);
			str = str.replace(temps[i], "㊣");
			i++;
		}
		var out = "";
		for(var i = 0; i < str.length; i++) {
			out += "&#" + str.charCodeAt(i) + ";";
		}
		for(var i = 0; i < temps.length; i++) {
			var temp = temps[i] + "";
			out = out.replace(/&#12963;/, temp);
		}
		W.rich_postor._editor.getHtml = function() {
			return out;
		}
		W.rich_postor._submit();
	}

	function postByUnicode2() {
		var tbs = unsafeWindow.PageData.tbs;
		var content = 'content';
		var tid = unsafeWindow.PageData.thread.id;
		$.post("http://tieba.baidu.com/f/commit/post/add", {
			"content" : content,
			"kw" : kw,
			"sign_id" : null,
			"tbs" : tbs,
			"tid" : tid,
			"useSignName" : "on"
		}, function(responseData) {
			location.reload();
		});
	}

	//asic转unicode
	function a2u(str) {
		var result = '';
		for(var i = 0; i < str.length; i++) {
			if(str.charCodeAt(i) < 128) {
				result += str.charAt(i);
			} else {
				result += "&#" + str.charCodeAt(i) + ";";
			}
		}
		return result;
	}

	//半角转全角
	function toSBC(text) {
		var res = "", c;
		for(var i = 0; i < text.length; i++) {
			c = text.charCodeAt(i);
			if(c >= 0x21 && c <= 0x7e)
				res += String.fromCharCode(c + 0xFEE0);
			else if(c == 0x20)
				res += String.fromCharCode(0x3000);
			else
				res += text.charAt(i);
		}
		return res;
	}

	//删除指定
	Array.prototype.deleteElementByValue = function(varElement) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] == varElement) {
				this.splice(i, 1);
				break;
			}
		}
	}
	//是否包含
	Array.prototype.contains = function(obj) {
		var i = this.length;
		while(i--)
		if(this[i] === obj)
			return true;
		return false;
	}
	//只看图片
	function onlyShowImg() {
		var temp = '';
		for(var i = 0; i < document.images.length; i++) {
			var img = document.images[i];
			if(img.height >= imgSize.imgMinHeight && img.height <= imgSize.imgMaxHeight)
				if(img.width >= imgSize.imgMinWidth && img.width <= imgSize.imgMaxWidth)
					temp += '<img src=' + img.src + '><br>';
		}
		if(temp != '') {
			document.write('<center>' + temp + '</center>');
			void (document.close())
		} else {
			W.alert("没有满足条件的图片!")
		}
	}

}

//写入配置
function setConfig(num, value) {
	config[num] = value;
	GM_setValue("config", JSON.stringify(config));
}

//读取配置
//|	id	|	value
//|	0	|	列表屏蔽
//|	1	|	是否开启自定义签名
//|	2	|	自定义签名详细
//|	3	|   完全屏蔽
//|	4	|   签名档屏蔽
//|	5	|	音乐链接标题
//| 6	|	是否美化
//| 7	|	是否自动转换base64
function getConfig(num) {
	return config[num];
}