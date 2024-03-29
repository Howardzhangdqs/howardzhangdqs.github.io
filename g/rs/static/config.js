opportunity_mode = false;
invincible_mode  = false;
cheat_mode       = false;

gaming_time      = 2000

let Pack = function(sig = 1, temps) {
	if (sig == 1) return "./static/image/texture"  + temps + ".jpg";
	if (sig == 2) return "./static/image/texture_" + temps + ".jpg";
	if (sig == 3) return "./static/music/"         + temps + ".mp3";
}

let texture1 = {
	"bimg":  [Pack(1,  "1"),  Pack(1,  "2"),  Pack(1,  "3"),  Pack(1,  "4"),  Pack(1,  "5"),
	          Pack(1,  "6"),  Pack(1,  "7"),  Pack(1,  "8"),  Pack(1,  "9"),  Pack(1, "10"),
			  Pack(1, "11"),  Pack(1, "12"),  Pack(1, "13"),  Pack(1, "14"),  Pack(1, "15"),
	          Pack(1, "16"),  Pack(1, "17"),  Pack(1, "18"),  Pack(1, "19"),  Pack(1, "20")],
	"aimg":  [Pack(2,  "1"),  Pack(2,  "2"),  Pack(2,  "3"),  Pack(2,  "4"),  Pack(2,  "5"),
	          Pack(2,  "6"),  Pack(2,  "7"),  Pack(2,  "8"),  Pack(2,  "9"),  Pack(2, "10"),
			  Pack(2, "11"),  Pack(2, "12"),  Pack(2, "13"),  Pack(2, "14"),  Pack(2, "15"),
	          Pack(2, "16"),  Pack(2, "17"),  Pack(2, "18"),  Pack(2, "19"),  Pack(2, "20")],
	"sound": [Pack(3, "gnjhnbzya"), Pack(3, "gjyws"), Pack(3, "wl")],
	"score": [1.5, 2.5, 3.5, 5],
	"idtext":  {"again": "再次整活", "introduction": "点击有图片的格子，看看你在规定时间内能点中多少个<br>"},
	"text":  ['这个彬彬就是逊啦', '朕愧对祖宗，愧对天地！', '三点几嚟，饮茶先啦！', '我这里刚好有一个面包', '我是一个~精~通~人♂性的'],
	//"formatter": function() {return 1;}
};

let texture0 = {
	"bimg":  ["./static/image/default.png"],
	"aimg":  ["./static/image/default_.png"],
	"sound": [Pack(3, "err"), Pack(3, "end"), Pack(3, "tap")],
	"score": [1.5, 2.5, 3.5, 5],
	"idtext":  {"again": "再撅一次", "introduction": "点击有学生的格子<br>看看你在规定时间内能撅多少下<br>"},
	"text":  ['逊呐', '哼哼哼', '你是一个一个一个', '哼哼哼啊啊啊啊啊', '都撅烂了罢（恼']
};

let texture2 = {
	"bimg":  ["./static/image/kennidi.jpg"],
	"aimg":  ["./static/image/kennidi_.jpg"],
	"sound": [Pack(3, "gun"), Pack(3, "gun"), Pack(3, "singlegun")],
	"score": [1.5, 2.5, 3.5, 5],
	"idtext":  {"again": "再次刺杀", "introduction": "刺杀肯尼迪<br>看看你在规定时间内能成功刺杀多少次<br>"},
	"text":  ['Do not pray for easy lives', 'Pray to be stronger men', 'Forgive your enemies.', 'Ask not what your country can do for you.', 'Ask what you can do for your country.']
};