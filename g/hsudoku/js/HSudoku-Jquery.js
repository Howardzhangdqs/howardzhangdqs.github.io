/* HSudoku for Jquery v1.0.2 | (c) 2021, 2028 HowardZhangdqs GDev, Inc. license */

var values = {
    "s_size": 30,
    "text_size": 20,
    "border_size": 1,
    "padding": 7
};
var pre = -1
  , pre_n = -1;
$(document).ready(function() {
    var f = false;
    $(".tb_lbox").attr("border", "0");
    $(".tb_lbox").css("font-size", values.text_size + "px");
    $(".tb_lbox").css("border-spacing", "0px");
    $(".tb_lbox").css("border", values.border_size + "px solid #000000");
    $(".tb_mbox").attr("border", "1");
    $(".tb_mbox").css("border-spacing", "0px");
    $(".tb_sbox").css("width", values.s_size + "px");
    $(".tb_sbox").css("height", values.s_size + "px");
    $(".tb_sbox").css("border", values.border_size + "px solid #000000");
    $(".nb_sbox").css("width", values.s_size + "px");
    $(".nb_sbox").css("height", values.s_size + "px");
    $(".nb_sbox").css("border", values.border_size + "px solid #000000");
    $(".helpertxt").css("padding", values.padding + "px");
    $(".nb_sbox").attr("title", "请先选择单元格");
    $(".tb_sbox").bind('click', function(event) {
        $(".nb_sbox").css("cursor", "pointer");
        $(".nb_sbox").removeAttr("title");
        f = true;
        if (event.type == "click") {
            $("#" + pre).css("border", values.border_size + "px solid #000000");
            $("#" + pre).css("box-shadow", "");
            pre = event.target.id;
            $("#" + pre_n).removeAttr("style");
            $("#" + pre_n).attr("style", $("#n10").attr("style"));
            pre_n = 0;
            $("#" + event.target.id).css("border", values.border_size + "px solid #FF0000");
            $("#" + event.target.id).css("box-shadow", "0px 0px 3px #FF0000");
        }
    });
    $(".nb_sbox").bind('click', function(event) {
        if ((event.type == "click") && f) {
            if (event.target.id == "dell") {
                $("#" + pre).text("");
            } else {
                $("#" + pre_n).removeAttr("style");
                $("#" + pre_n).attr("style", $("#n10").attr("style"));
                pre_n = event.target.id;
                $("#" + event.target.id).css("border", values.border_size + "px solid #00FF00");
                $("#" + event.target.id).css("box-shadow", "0px 0px 3px #00FF00");
                $("#" + pre).text(event.target.id.replace("n", ""));
            }
        }
    });
    $("#helper").click(function() {
        $("#helpiframe").removeAttr("src");
        $("#helpiframe").attr("src", "HSudoku instructions.html");
        $("#helptxt").fadeIn(800);
        $("#maskk").fadeIn(800);
    });
    $("#close-help").click(function() {
        $("#helptxt").fadeOut(800);
        $("#maskk").fadeOut(800);
    });
});
