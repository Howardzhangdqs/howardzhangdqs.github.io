let isDesktop = navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i) ? false : true;
let fontunit = isDesktop ? 20 : ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 320) * 10;
document.write('<style type="text/css">' + 'html,body {font-size:' + (fontunit < 30 ? fontunit : '30') + 'px;}' + (isDesktop ? '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position: absolute;}' : '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position:fixed;}@media screen and (orientation:landscape) {#landscape {display: box; display: -webkit-box; display: -moz-box; display: -ms-flexbox;}}') + '</style>');

var chart_option = {};

var pre_click_time = +(new Date());
var min_click_time = 10000000;

let tscore_list = [];

texture = texture1;

let slinec = {"sline1": true, "sline2": true, "sline3": true, "sline4": true};

var score_list = [0];
let l_gameScore = 0;

get_score_list = function() {
	score_list.push(_gameScore - l_gameScore);
	l_gameScore = _gameScore;
}

sline = function(num) {
	if (sline_mode) {
		slinec["sline" + num] = !slinec["sline" + num];
		if (slinec["sline" + num]) $("#sline" + num).css("background-color", "#fff");
		else $("#sline" + num).css("background-color", "#AAA");
		
		if (check_sline_full()) {
			$("#sline_text").css("color", "red");
			$("#sline_text").text("请勿ban掉所有的列");
			
			slinec["sline" + num] = !slinec["sline" + num];
			if (slinec["sline" + num]) $("#sline" + num).css("background-color", "#fff");
			else $("#sline" + num).css("background-color", "#AAA");
		} else {
			$("#sline_text").css("color", "black");
			$("#sline_text").text("请点击需要ban掉的列");
		}
	}
}

check_sline_full = function() {
	for (let i = 1; i <= 4; i ++) if (slinec["sline" + i]) return false;
	return true;
}

sline_mode_f = function() {
	if ($("#sline_mode").is(':checked')) {
		sline_mode = true;
		$("#sline").css("display", "flex");
		
		$("#basic-addon11").css("border-radius", ".25rem 0 0 0");
		$("#sline_text").text("请点击需要ban掉的列");
	} else {
		$("#sline").css("display", "none");
		
		$("#basic-addon11").css("border-radius", ".25rem 0 0 .25rem");
		$("#sline_text").text("畅享丝滑");
		
		sline_mode = false;
		$("#sline1, #sline2, #sline3, #sline4").css("background-color", "#fff");
		slinec = {"sline1": true, "sline2": true, "sline3": true, "sline4": true};
	}
}

cheat_mode_f = function() {
	if ($("#cheat_mode").is(':checked')) {
		$(".cheat").css("display", "flex");
		$("#cheat_text").text("你也算是是抬举的人了");
		
		//$("#introduction").css("display", "none");
		cheat_mode = true;
	} else {
		$(".cheat").css("display", "none");
		$("#cheat_text").text("给你机会你不中用啊");
		
		//$("#introduction").css("display", "block");
		cheat_mode = false;
	}
}

strToJson = function(str) {
    var json = (new Function("return " + str))();
    return json;
}

customize = function() {
	$("#texture-addon1").css("color", "green");
	$("#texture-addon1").text("格式正确");
	let tcustomize;
	try {
		tcustomize = strToJson($("#customized").val());
	} catch {
		console.log("配置项读取错误");
		$("#texture-addon1").css("color", "red");
		$("#texture-addon1").text("格式错误");
		return;
	}
	console.log("读取到配置项：" + JSON.stringify(tcustomize));
	if (typeof(tcustomize) != 'object') {
		console.log("请确保配置项格式正确");
		$("#texture-addon1").css("color", "red");
		$("#texture-addon1").text("格式错误");
		return;
	}
	console.log("正在解析配置项");
	$("#texture-addon1").css("color", "green");
	$("#texture-addon1").text("格式正确");
	init_texture(tcustomize);
}

changetexture = function() {
	let ct = parseInt($('#select option:selected').val());
	$("#customize").css("display", "none");
	if (ct == 0) texture = texture0;
	else if (ct == 1) texture = texture1;
	else if (ct == 2) texture = texture2;
	else if (ct == 3) {
		$("#customize").css("display", "flex");
	}
	init_texture(texture);
	customize();
}

init_texture = function(ttexture) {
	var texture_bc = $("#texture_bc"), // Before Click
		texture_ac = $("#texture_ac"); //  After Click

	texture_bc.html(construct_texture(ttexture));
	texture_ac.html(construct_texture(ttexture, "aimg", "t"));
	gameInit(ttexture);
	
    if (ttexture.hasOwnProperty("idtext"))
        for (let j in ttexture.idtext) $("#" + j).html(ttexture.idtext[j]);
}

construct_texture = function(ttexture, tag="bimg", sign="") {
    let dj = 0, tts = "";
    for (let di = 0; di <= 39; di++) {
        let ts = 'div[num="' + di + '"].' + sign;
        tts += '' + ts + 't1, ' + ts + 't2, ' + ts + 't3, ' + ts + 't4, ' + ts + 't5{background-image: url(' + ttexture[tag][dj] + ');}\n';
        if ((++ dj) >= ttexture[tag].length) dj = 0;
    }
    return tts;
}

$(function(){
	$('#select').val("1");
	init_texture(texture1);
	gaming_time = 2000;
	_gameTimeNum = gaming_time;
    GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
});

let map = {
    'd': 1,
    'f': 2,
    'j': 3,
    'k': 4
};

if (isDesktop) {
    document.write('<div id="gameBody">');
    document.onkeydown = function(e) {
        let key = e.key.toLowerCase();
        if (Object.keys(map).indexOf(key) !== -1)
            click(map[key]);
    }
}

let body, blockSize, GameLayer = [], GameLayerBG, touchArea = [], GameTimeLayer;
let transform, transitionDuration;
invincible__mode = (invincible__mode | invincible_mode) & cheat_mode;

function init() {
    showWelcomeLayer();
    body = document.getElementById('gameBody') || document.body;
    body.style.height = window.innerHeight + 'px';
    transform = typeof (body.style.webkitTransform) != 'undefined' ? 'webkitTransform' : (typeof (body.style.msTransform) != 'undefined' ? 'msTransform' : 'transform');
    transitionDuration = transform.replace(/ransform/g, 'ransitionDuration');
    GameTimeLayer = document.getElementById('GameTimeLayer');
    GameLayer.push(document.getElementById('GameLayer1'));
    GameLayer[0].children = GameLayer[0].querySelectorAll('div');
    GameLayer.push(document.getElementById('GameLayer2'));
    GameLayer[1].children = GameLayer[1].querySelectorAll('div');
    GameLayerBG = document.getElementById('GameLayerBG');
    if (GameLayerBG.ontouchstart === null)
        GameLayerBG.ontouchstart = gameTapEvent;
    else
        GameLayerBG.onmousedown = gameTapEvent;
    gameInit(texture);
    initSetting();
    window.addEventListener('resize', refreshSize, false);
    let btn = document.getElementById('ready-btn');
    btn.className = 'btn btn-primary btn-lg';
    btn.onclick = function() {
        closeWelcomeLayer();
    }
}

function winOpen() {
    window.open(location.href + '?r=' + Math.random(), 'nWin', 'height=500,width=320,toolbar=no,menubar=no,scrollbars=no');
    let opened = window.open('about:blank', '_self');
    opened.opener = null;
    opened.close();
}

let refreshSizeTime;

function refreshSize() {
    clearTimeout(refreshSizeTime);
    refreshSizeTime = setTimeout(_refreshSize, 200);
}

function _refreshSize() {
    countBlockSize();
    for (let i = 0; i < GameLayer.length; i++) {
        let box = GameLayer[i];
        for (let j = 0; j < box.children.length; j++) {
            let r = box.children[j], rstyle = r.style;
            rstyle.left = (j % 4) * blockSize + 'px';
            rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
            rstyle.width = blockSize + 'px';
            rstyle.height = blockSize + 'px';
        }
    }
    let f, a;
    if (GameLayer[0].y > GameLayer[1].y) {
        f = GameLayer[0];
        a = GameLayer[1];
    } else {
        f = GameLayer[1];
        a = GameLayer[0];
    }
    let y = ((_gameBBListIndex) % 10) * blockSize;
    f.y = y;
    f.style[transform] = 'translate3D(0,' + f.y + 'px,0)';
    a.y = -blockSize * Math.floor(f.children.length / 4) + y;
    a.style[transform] = 'translate3D(0,' + a.y + 'px,0)';
}

function countBlockSize() {
    blockSize = body.offsetWidth / 4;
    body.style.height = window.innerHeight + 'px';
    GameLayerBG.style.height = window.innerHeight + 'px';
    touchArea[0] = window.innerHeight - blockSize * 0;
    touchArea[1] = window.innerHeight - blockSize * 3;
}
let _gameBBList = [], _gameBBListIndex = 0, _gameOver = false, _gameStart = false, _gameTime, _gameTimeNum, _gameScore, _date1, deviation_time;

function gameInit(ttexture) {
    createjs.Sound.registerSound({
        src: ttexture.sound[0],
        id: "err"
    });
    createjs.Sound.registerSound({
        src: ttexture.sound[1],
        id: "end"
    });
    createjs.Sound.registerSound({
        src: ttexture.sound[2],
        id: "tap"
    });
    gameRestart();
}

function gameRestart() {
    _gameBBList = [];
    _gameBBListIndex = 0;
    _gameScore = 0;
    _gameOver = false;
    _gameStart = false;
    _gameTimeNum = gaming_time;
    GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    countBlockSize();
    refreshGameLayer(GameLayer[0]);
    refreshGameLayer(GameLayer[1], 1);
	gaming_time = parseInt($("#gaming-time").val()) * 100;
}

function gameStart() {
    _date1 = new Date();
    _gameStart = true;
    _gameTime = setInterval(gameTime, 10);
	
	score_list = [0];
	l_gameScore = 0;
    //_get_score_list = setInterval(get_score_list, 1000);
}

Deal_aftermath1 = function() {
	get_score_list();
	console.log(score_list);
	
	while (score_list.length > parseInt($("#gaming-time").val()) + 1) {
		score_list[$("#gaming-time").val()] += score_list.pop();
		console.log("length over " + $("#gaming-time").val());
		console.log(score_list);
	}
}

Deal_aftermath2 = function() {
	if (min_click_time == 10000000) {
		$("#GameScoreLayer-fastest").css("display", "none");
	} else {
		let mainchart = document.getElementById("mainchart");
		for (let i = 1; i <= score_list.length; i ++) tscore_list.push(score_list[i]);
		chart_option = {
			grid: {
		left: '0%',
		bottom: '0%',
		width:'100%',
		height:'100%',
		containLabel: true},
			tooltip: {},
			legend: {show:false
			},
			xAxis: {type: "category", min: 1, max: (score_list.length - 1)},
			yAxis: {type: "value"},
			series: [{
				name: '每秒点击量',
				type: 'bar',
				data: score_list
			}]
		};
		console.log((mainchart.clientWidth || mainchart.offsetWidth));
		console.log((mainchart.clientHeight || mainchart.offsetHeight));
		//mainchart.style.width = "" + (mainchart.clientWidth || mainchart.offsetWidth) + "px";
		//mainchart.style.height = "" + (mainchart.clientHeight || mainchart.offsetHeight) + "px";
		var myChart = echarts.init(mainchart);
		myChart.setOption(chart_option);
		
		console.log(min_click_time);
		
		$("#GameScoreLayer-fastest").css("display", "block");
		$("#GameScoreLayer-fastest").text("最快点击速度" + (1000 / min_click_time).toFixed(3) + "次/秒");
		$("#GameScoreLayer-average").text("平均点击速度" + (1000 / (((parseInt($("#gaming-time").val()) * 100 - _gameTimeNum) / _gameScore) * 10)).toFixed(3) + "次/秒");
	}
	min_click_time = 10000000;
}

function gameOver(natural_death=false) {
    if (opportunity_mode && cheat_mode) {
        if (natural_death)
            _gameOver = true;
        if (natural_death) {
            clearInterval(_gameTime);
			//clearInterval(_get_score_list);
			Deal_aftermath1();
		}
        setTimeout(function() {
            if (natural_death)
                GameLayerBG.className = '';
            if (natural_death)
                showGameScoreLayer();
            $(".bad").removeClass("bad");
			Deal_aftermath2();
        }, 100);
    } else {
        _gameOver = true;
        clearInterval(_gameTime);
		//clearInterval(_get_score_list);
		Deal_aftermath1();
		
        setTimeout(function() {
            GameLayerBG.className = '';
            showGameScoreLayer();
			Deal_aftermath2();
        }, 800);
    }
}

function encrypt(text) {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTzGwX6FVKc7rDiyF3H+jKpBlRCV4jOiJ4JR33qZPVXx8ahW6brdBF9H1vdHBAyO6AeYBumKIyunXP9xzvs1qJdRNhNoVwHCwGDu7TA+U4M7G9FArDG0Y6k4LbS0Ks9zeRBMiWkW53yQlPshhtOxXCuZZOMLqk1vEvTCODYYqX5QIDAQAB");
    let data = encrypt.encrypt(text);
    return data;
}

function SubmitResults() {
    let system = "其他操作系统";
    let area = "异世界";
    if (document.getElementById("username").value) {
        if (navigator.appVersion.indexOf("Win") != -1)
            system = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1)
            system = "Macintosh";
        if (navigator.appVersion.indexOf("Linux") != -1)
            system = "Linux";
        if (navigator.appVersion.indexOf("Android") != -1)
            system = "Android";
        if (navigator.appVersion.indexOf("like Mac") != -1)
            system = "iOS";
        if (returnCitySN['cname']) {
            area = returnCitySN['cname']
        }
        ;let httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', './SubmitResults.php', true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        let name = document.getElementById("username").value;
        let message = document.getElementById("message").value;
        let test = "|_|";
        httpRequest.send(encrypt(_gameScore + test + name + test + tj + test + system + test + area + test + message));
    }
}

function gameTime() {
    _gameTimeNum -= 1;
	if (_gameTimeNum % 100 == 0) get_score_list();
    if (_gameTimeNum <= 0) {
        GameTimeLayer.innerHTML = '&nbsp;时间到！';
        gameOver(true);
        GameLayerBG.className += ' flash';
        createjs.Sound.play("end");
    } else {
        GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    }
}

function creatTimeText(n) {
    return '剩余时间:' + ("" + Math.floor(n / 100)).padStart(2, 0) + '\'' + ("" + Math.floor(n % 100)).padStart(2, 0) + '\"';
}

let _ttreg = / t{1,2}(\d+)/
  , _clearttClsReg = / t{1,2}\d+| bad/;

get_i = function(num) {
	if (texture.hasOwnProperty("formatter")) return texture.formatter(num);
	let ii = Math.floor(Math.random() * 1000) % 4;
	if (! sline_mode) return ii;
	while (! slinec["sline" + (ii + 1)]) ii = Math.floor(Math.random() * 1000) % 4;
	return ii;
}

function refreshGameLayer(box, loop, offset) {
    let i = get_i(0) + (loop ? 0 : 4);
    for (let k = 0; k < box.children.length; k++) {
        let j = k;
        let jm = Math.floor(k / 4) * 4;

        let r = box.children[j], rstyle = r.style;

        rstyle.left = (j % 4) * blockSize + 'px';
        rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
        rstyle.width = blockSize + 'px';
        rstyle.height = blockSize + 'px';
        r.className = r.className.replace(_clearttClsReg, '');
        if (i == j) {
            _gameBBList.push({
                cell: i % 4,
                id: r.id
            });
            let t = (Math.floor(Math.random() * 1000) % 1 + 1);
            r.className += ' t' + t;
            r.notEmpty = true;
            i = get_i(k) + (Math.floor(j / 4) + 1) * 4;
        } else {
            r.notEmpty = false;
        }
    }
    if (loop) {
        box.style.webkitTransitionDuration = '0ms';
        box.style.display = 'none';
        box.y = -blockSize * (Math.floor(box.children.length / 4) + (offset || 0)) * loop;
        setTimeout(function() {
            box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
            setTimeout(function() {
                box.style.display = 'block';
            }, 100);
        }, 200);
    } else {
        box.y = 0;
        box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
    }
    box.style[transitionDuration] = '150ms';
}

function gameLayerMoveNextRow() {
    for (let i = 0; i < GameLayer.length; i++) {
        let g = GameLayer[i];
        g.y += blockSize;
        if (g.y > blockSize * (Math.floor(g.children.length / 4))) {
            refreshGameLayer(g, 1, -1);
        } else {
            g.style[transform] = 'translate3D(0,' + g.y + 'px,0)';
        }
    }
}

function gameTapEvent(e) {
	console.log("click");
	let now_click_time = +(new Date());
	min_click_time = Math.min(min_click_time, now_click_time - pre_click_time);
	pre_click_time = now_click_time;
    if (_gameOver)
        return false;
    let tar = e.target;
    let y = e.clientY || e.targetTouches[0].clientY
      , x = (e.clientX || e.targetTouches[0].clientX) - body.offsetLeft
      , p = _gameBBList[_gameBBListIndex];
    if (y > touchArea[0] || y < touchArea[1])
        return false;
    if ((p.id == tar.id && tar.notEmpty) || (p.cell == 0 && x < blockSize) || (p.cell == 1 && x > blockSize && x < 2 * blockSize) || (p.cell == 2 && x > 2 * blockSize && x < 3 * blockSize) || (p.cell == 3 && x > 3 * blockSize) || invincible__mode) {
        if (!_gameStart)
            gameStart();
        createjs.Sound.play("tap");
        tar = document.getElementById(p.id);
        tar.className = tar.className.replace(_ttreg, ' tt$1');
        _gameBBListIndex++;
        _gameScore++;
        gameLayerMoveNextRow();
    } else if (_gameStart && !tar.notEmpty) {
        createjs.Sound.play("err");
        gameOver();
        tar.className += ' bad';
    }
    return false;
}

function createGameLayer() {
    let html = '<div id="GameLayerBG">';
    for (let i = 1; i <= 2; i++) {
        let id = 'GameLayer' + i;
        html += '<div id="' + id + '" class="GameLayer">';
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 4; k++) {
                html += '<div id="' + id + '-' + (k + j * 4) + '" num="' + (k + j * 4) + '" class="block' + (k ? ' bl' : '') + '"></div>';
            }
        }
        html += '</div>';
    }
    html += '</div>';
    html += '<div id="GameTimeLayer"></div>';
    return html;
}

function closeWelcomeLayer() {
    let l = document.getElementById('welcome');
    l.style.display = 'none';
}

function showWelcomeLayer() {
    let l = document.getElementById('welcome');
    l.style.display = 'block';
}

function showGameScoreLayer() {
    let l = document.getElementById('GameScoreLayer');
    let c = document.getElementById(_gameBBList[_gameBBListIndex - 1].id).className.match(_ttreg)[1];
    l.className = l.className.replace(/bgc\d/, 'bgc' + c);
    document.getElementById('GameScoreLayer-text').innerHTML = shareText(_gameScore);
    let score_text = '得分&nbsp;&nbsp;';
    score_text += deviation_time < 23000 ? _gameScore : "<span style='color:red;'>" + _gameScore + "</span>";
    document.getElementById('GameScoreLayer-score').innerHTML = score_text;
    let bast = cookie('bast-score');
    if (deviation_time < 23000) {
        if (!bast || _gameScore > bast) {
            bast = _gameScore;
            cookie('bast-score', bast, 100);
        }
    }
    document.getElementById('GameScoreLayer-bast').innerHTML = '最佳&nbsp;&nbsp;' + bast;
    l.style.display = 'block';
}

function hideGameScoreLayer() {
    let l = document.getElementById('GameScoreLayer');
    l.style.display = 'none';
}

function replayBtn() {
    gameRestart();
    hideGameScoreLayer();
}

function backBtn() {
    gameRestart();
    hideGameScoreLayer();
    showWelcomeLayer();
}

function shareText(score) {
    let date2 = new Date();
    deviation_time = (date2.getTime() - _date1.getTime());
    deviation_time = 10;
    if (deviation_time > 23000)
        return '倒计时多了' + ((deviation_time / 1000) - 20).toFixed(2) + "s";
    SubmitResults();
	for (let i = 0; i < texture.score.length; i ++) {
		if (score < (texture.score[i] * parseInt($("#gaming-time").val()))) return texture.text[i];
	}
    return texture.text[texture.score.length];
}

function toStr(obj) {
    if (typeof obj == 'object')
        return JSON.stringify(obj);
    else
        return obj;
}

function cookie(name, value, time) {
    if (name) {
        if (value) {
            if (time) {
                let date = new Date();
                date.setTime(date.getTime() + 864e5 * time),
                time = date.toGMTString();
            }
            return document.cookie = name + "=" + escape(toStr(value)) + (time ? "; expires=" + time + (arguments[3] ? "; domain=" + arguments[3] + (arguments[4] ? "; path=" + arguments[4] + (arguments[5] ? "; secure" : "") : "") : "") : ""),
            !0;
        }
        return value = document.cookie.match("(?:^|;)\\s*" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)"),
        value = value && "string" == typeof value[1] ? unescape(value[1]) : !1,
        (/^(\{|\[).+\}|\]$/.test(value) || /^[0-9]+$/g.test(value)) && eval("value=" + value),
        value;
    }
    let data = {};
    value = document.cookie.replace(/\s/g, "").split(";");
    for (let i = 0; value.length > i; i++)
        name = value[i].split("="),
        name[1] && (data[name[0]] = unescape(name[1]));
    return data;
}
document.write(createGameLayer());

function initSetting() {
    document.getElementById("username").value = cookie("username") ? cookie("username") : "";
    document.getElementById("message").value = cookie("message") ? cookie("message") : "";
    if (cookie("keyboard")) {
        document.getElementById("keyboard").value = cookie("keyboard");
        map = {}
        map[cookie("keyboard").charAt(0).toLowerCase()] = 1;
        map[cookie("keyboard").charAt(1).toLowerCase()] = 2;
        map[cookie("keyboard").charAt(2).toLowerCase()] = 3;
        map[cookie("keyboard").charAt(3).toLowerCase()] = 4;
    }
}
function show_btn() {
	if ($("#opportunity_mode").is(':checked')) opportunity_mode = true;
	else opportunity_mode = false;
	if ($("#invincible_mode").is(':checked')) invincible_mode = true, invincible__mode = true;
	else invincible_mode = false, invincible__mode = false;
	gaming_time = parseInt($("#gaming-time").val()) * 100;
    document.getElementById("btn_group").style.display = "block";
    document.getElementById("setting").style.display = "none";
    gameRestart();
}

show_setting_in_the_middle = function() {
    gameRestart();
	showWelcomeLayer();
    document.getElementById("GameScoreLayer").style.display = "none";
	show_setting();
}

function show_setting() {
    document.getElementById("btn_group").style.display = "none";
    document.getElementById("setting").style.display = "block";
}
function save_cookie() {
    cookie('username', document.getElementById("username").value, 100);
    cookie('message', document.getElementById("message").value, 100);
    cookie('keyboard', document.getElementById("keyboard").value, 100);
    initSetting();
}
function isnull(val) {
    let str = val.replace(/(^\s*)|(\s*$)/g, '');
    if (str == '' || str == undefined || str == null) {
        return true;
    } else {
        return false;
    }
}
function goRank() {
    let name = document.getElementById("username").value;
    let link = './rank.php';
    if (!isnull(name)) {
        link += "?name=" + name;
    }
    window.location.href = link;
}

function click(index) {
    let p = _gameBBList[_gameBBListIndex];
    let base = parseInt(document.getElementById(p.id).getAttribute("num")) - p.cell;
    let num = base + index - 1;
    let id = p.id.substring(0, 11) + num;

    let fakeEvent = {
        clientX: ((index - 1) * blockSize + index * blockSize) / 2 + body.offsetLeft,
        // Make sure that it is in the area
        clientY: (touchArea[0] + touchArea[1]) / 2,
        target: document.getElementById(id),
    };

    gameTapEvent(fakeEvent)
}

console.log("不修改，好嘛？乱传又有什么用呢？(ˉ▽ˉ；)...")
console.log("")
console.log("上面那句话是原作者写的，我觉得写的不错就留着了")
console.log("很高兴您会按下%cF12%c并且会%c打开console%c", "color:#00f", "color:#000", "color:#f00", "color:#000")
console.log("原作者的开源地址在这里：%chttps://github.com/Xiaohuang257/RapeSenpai%c", "color:#00f", "color:#000")
console.log("顺便吐槽一句：%c原作者的代码写的真太TM好了", "font-size:30px;color:#f00;font-weight:bold")
console.log("还有下面的那些报错不用管，程序可以正常运行")