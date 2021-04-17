function randNum(){
	var max = 31;
	var min = 1;
	var num = 2;
	while ((num == 2) || (num == 6) || (num == 11) || (num == 18) || (num == 24) || (num == 26)){
		num = parseInt(Math.random()*(max-min+1)+min,10);
		num = Math.floor(Math.random()*(max-min+1)+min);
	}
	document.getElementById("randNumber").innerHTML = num.toString();
}

function randNumber(){
	var interval2 = window.setInterval("randNum()",1);
	setTimeout( function(){ window.clearInterval(interval2); },500);
}