var getParam = function () {
	try{
		var url = window.location.href;
		var result = url.split("?")[1];
		var keyValue = result.split("&");
		var obj = {};
		for (var i = 0; i < keyValue.length; i++) {
			var item = keyValue[i].split("=");
			obj[item[0]] = item[1];
		}
		return obj;
	} catch(e){
		var obj = {
			no_infor: true
		};
		console.warn("There has no param value!");
		return obj;
	}
};

var data = getParam();
console.log(data);
if (data.no_infor == true){
	data = data;
} else {
	document.getElementById("textl").innerHTML = decodeURIComponent(data.textl);
	document.getElementById("textr").innerHTML = decodeURIComponent(data.textr);
}