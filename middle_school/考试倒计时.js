var if_accurate = false,
	pre2 = "";
function accurate(){
	if (if_accurate == true){
		if_accurate = false;
	} else {
		if_accurate = true;
	}
	init();
}
function init(){
	var day = new Array(),
		per_id = 0;
	per_id ++; day[per_id] = {name : "一模", birthday : new Date("January 12, 2021 08:00:00")};
	per_id ++; day[per_id] = {name : "二模", birthday : new Date("May 12, 2021 08:00:00")};
	var today = new Date;
	var minn = 1000000;
	var numinn;
	for (var i = 1; i <= per_id; i ++){
		var dtdate;
		if (if_accurate == false){
			dtdate = (day[i].birthday.getTime() - today.getTime()) / 1000 / 60 / 60 / 24;
			dtdate = Math.ceil(dtdate);
		} else {
			dtdate = (day[i].birthday.getTime() - today.getTime()) / 1000 / 60 / 60 / 24;
		}
		if (dtdate > 1){
			if (day[i].birthday > today){
				if (minn > dtdate){
					minn = dtdate;
					numinn = i;
				}
			}
		}
	}
	if (if_accurate == true){
		var m2s = minn.toString();
		while(m2s.length < 18){
			m2s += "0";
		}
		minn --;
		var ans_date = "距离" + (day[numinn].name) + "还有 " + m2s + " 天";
	} else {
		var ans_date = "距离" + (day[numinn].name) + "还有 " + minn.toString() + " 天";
	}
	if (pre2 != ans_date){
		pre2 = ans_date;
		document.getElementById("date").innerHTML = ans_date;
	}
}
init();
setInterval(function(){
  init();
},1000);