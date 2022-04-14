var hsu = "";

// tr 1
hsu += "<tr><th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 1; i <= 3; i++) {
    hsu += "<tr>"
    for (var j = 1; j <= 3; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th>";

hsu += "<th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 1; i <= 3; i++) {
    hsu += "<tr>"
    for (var j = 4; j <= 6; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th>";

hsu += "<th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 1; i <= 3; i++) {
    hsu += "<tr>"
    for (var j = 7; j <= 9; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th></tr>";

// tr 2
hsu += "<tr><th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 4; i <= 6; i++) {
    hsu += "<tr>"
    for (var j = 1; j <= 3; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th>";

hsu += "<th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 4; i <= 6; i++) {
    hsu += "<tr>"
    for (var j = 4; j <= 6; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th>";

hsu += "<th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 4; i <= 6; i++) {
    hsu += "<tr>"
    for (var j = 7; j <= 9; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th></tr>";

// tr 3
hsu += "<tr><th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 7; i <= 9; i++) {
    hsu += "<tr>"
    for (var j = 1; j <= 3; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th>";

hsu += "<th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 7; i <= 9; i++) {
    hsu += "<tr>"
    for (var j = 4; j <= 6; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th>";

hsu += "<th><table class=\"tb_mbox\" align=\"center\"><tr>";
for (var i = 7; i <= 9; i++) {
    hsu += "<tr>"
    for (var j = 7; j <= 9; j++) {
        hsu += "<th id=\"" + j + i + "\" class=\"tb_sbox\"></th>"
    }
    hsu += "</tr>"
}
hsu += "</tr></table></th></tr>";

$("#hsu").html(hsu);

hsu = "";
hsu += "<tr><th id=\"dell\" class=\"nb_sbox\">Del</th>";
for (var i = 1; i <= 9; i ++) {
	hsu += "<th id=\"n" + i + "\" class=\"nb_sbox\">" + i + "</th>";
}
hsu += "<th id=\"n10\" class=\"nb_sbox\"></th></tr>";
$("#hsbt").html(hsu);