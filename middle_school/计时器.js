var now = new Date,
	des = new Date("November 26, 2122 16:50:00"),
	totsecond = (des.getTime() - now.getTime()) % (24 * 60 * 60 * 1000),
	ans = "",
	pre = "",
	minute,
	hour,
	disa = false,
	second;

function hide(){
	if (! disa){
		$("#timer").fadeOut(1000);
		$("#div1").animate({
			top:'-=200px',
		},1000);
		disa = true;
	}
}

function Timer(){
	pre = ans;
	ans = "";
	now = new Date;
	totsecond = (des.getTime() - now.getTime()) % (24 * 60 * 60 * 1000);
	totsecond -= totsecond % 1000;
	totsecond /= 1000;
	second = totsecond % 60; totsecond -= second; totsecond /= 60;
	minute = totsecond % 60; totsecond -= minute; totsecond /= 60;
	hour = totsecond;
	if (hour >= 1){
		ans = "自习还未开始";
		hide();
	}
	if (hour >= 23){
		ans = "自习已结束";
		hide();
	}
	if (ans == ""){
		if (hour == 0){
			if (minute == 0){
				ans = "距离自习结束还有 " + second.toString() + " 秒";
			} else {
				ans = "距离自习结束还有 " + minute.toString() + " 分 " + second.toString() + " 秒";
			}
		} else {
			if (minute == 0){
				ans = "距离自习结束还有 " + hour.toString() + " 小时 " + second.toString() + " 秒";
			} else {
				ans = "距离自习结束还有 " + hour.toString() + " 小时 " + minute.toString() + " 分 " + second.toString() + " 秒";
			}
		}
	}
	if (ans != pre){
		document.getElementById("timer").innerHTML = ans;
		pre = ans;
	}
}

setInterval(function(){
  Timer();
},1000);