function Share(){
	var l = document.getElementById("textl").innerHTML.toString();
	var r = document.getElementById("textr").innerHTML.toString();
	var ans = window.location.href.toString() + "?";
	/*
	l = l.replace(/<br>/g," \\n ");
	l = l.replace(/<div>/g,"\\n");
	l = l.replace(/<\/div>/g,"");
	l = l.replace(/&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; /g,"　　　");
	l = l.replace(/&nbsp; /g," ");
	l = l.replace(/&nbsp;/g," ");
	l = l.replace(/<h1 id=\"textl\" class=\"smaller\" style=\"text-align: left;\">/g,"");
	l = l.replace(/<\/h1>/g,"");
	l = l.replace(/\\n\\n/g,"");
	var ans = "{\"msgtype\":\"text\",\"text\": {\"content\": \"" + l + "\"},\"at\":{\"isAtAll\": false}}";
	document.getElementById("share").value = ans;
	*/
	ans += "textl=" + window.btoa(l) + "&textl=" + window.btoa(r);
	document.getElementById("share").value = ans;
}
