/* HSudoku solver v1.0.2 | (c) 2021, 2028 HowardZhangdqs GDev, Inc. license */

var a = new Array(), g = new Array(), x = new Array(), y = new Array(), mem_a;
for (var i = 1; i <= 9; i++) {
    a[i] = new Array();
    g[i] = new Array();
    x[i] = new Array();
    y[i] = new Array();
    for (var j = 1; j <= 9; j++) {
        a[i][j] = 0;
        g[i][j] = 0;
        x[i][j] = 0;
        y[i][j] = 0;
    }
}
var p_time;
var c, h;
function check(xx, yy) {
    if (xx <= 3) {
        if (yy <= 3) {
            return 1;
        }
        if ((yy > 3) && (yy <= 6)) {
            return 2;
        }
        return 3;
    } else {
        if ((xx > 3) && (xx <= 6)) {
            if (yy <= 3) {
                return 4;
            }
            if ((yy > 3) && (yy <= 6)) {
                return 5;
            }
            return 6;
        } else {
            if (yy <= 3) {
                return 7;
            }
            if ((yy > 3) && (yy <= 6)) {
                return 8;
            }
        }
    }
    return 9;
}
function dfs(xx, yy) {
    if ((new Date().getTime() - p_time) > 2000) {
        $("#sodoku_output").text("该数独大概率无解");
        return;
    }
    if (h) {
        return;
    }
    if (xx > 9) {
        for (var i = 1; i <= 9; i++)
            for (var j = 1; j <= 9; j++)
                $("#" + j + i).text(a[i][j]);
        h = 1;
        $("#sodoku_output").text("完成！共耗时" + (new Date().getTime() - p_time) + "毫秒");
        return;
    }
    if (a[xx][yy]) {
        if (yy < 9) {
            dfs(xx, yy + 1);
        } else {
            dfs(xx + 1, 1);
        }
        return;
    }
    for (var i = 1; i <= 9; i++) {
        if ((!x[xx][i]) && (!y[yy][i]) && (!g[check(xx, yy)][i])) {
            x[xx][i] = 1;
            y[yy][i] = 1;
            g[check(xx, yy)][i] = 1;
            a[xx][yy] = i;
            if (yy < 9) {
                dfs(xx, yy + 1);
            } else {
                dfs(xx + 1, 1);
            }
            a[xx][yy] = 0;
            x[xx][i] = 0;
            y[yy][i] = 0;
            g[check(xx, yy)][i] = 0;
        }
    }
}
var compare = function(x, y) {
    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    } else {
        return 0;
    }
}
function legal_sudoku() {
    var t = new Array();
    t[0] = 0;
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            t[j] = a[i][j];
        }
        t = t.sort(compare);
        for (var k = 1; k <= 8; k++) {
            if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
                return 1;
            }
        }
    }
    for (var j = 1; j <= 9; j++) {
        for (var i = 1; i <= 9; i++) {
            t[i] = a[i][j];
        }
        t = t.sort(compare);
        for (var k = 1; k <= 8; k++) {
            if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
                return 2;
            }
        }
    }
    t[1] = a[1][1];
    t[2] = a[1][2];
    t[3] = a[1][3];
    t[4] = a[2][1];
    t[5] = a[2][2];
    t[6] = a[2][3];
    t[7] = a[3][1];
    t[8] = a[3][2];
    t[9] = a[3][3];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 3;
        }
    }
    t[1] = a[4][1];
    t[2] = a[4][2];
    t[3] = a[4][3];
    t[4] = a[5][1];
    t[5] = a[5][2];
    t[6] = a[5][3];
    t[7] = a[6][1];
    t[8] = a[6][2];
    t[9] = a[6][3];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 4;
        }
    }
    t[1] = a[7][1];
    t[2] = a[7][2];
    t[3] = a[7][3];
    t[4] = a[8][1];
    t[5] = a[8][2];
    t[6] = a[8][3];
    t[7] = a[9][1];
    t[8] = a[9][2];
    t[9] = a[9][3];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 5;
        }
    }
    t[1] = a[1][4];
    t[2] = a[1][5];
    t[3] = a[1][6];
    t[4] = a[2][4];
    t[5] = a[2][5];
    t[6] = a[2][6];
    t[7] = a[3][4];
    t[8] = a[3][5];
    t[9] = a[3][6];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 6;
        }
    }
    t[1] = a[4][4];
    t[2] = a[4][5];
    t[3] = a[4][6];
    t[4] = a[5][4];
    t[5] = a[5][5];
    t[6] = a[5][6];
    t[7] = a[6][4];
    t[8] = a[6][5];
    t[9] = a[6][6];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 7;
        }
    }
    t[1] = a[7][4];
    t[2] = a[7][5];
    t[3] = a[7][6];
    t[4] = a[8][4];
    t[5] = a[8][5];
    t[6] = a[8][6];
    t[7] = a[9][4];
    t[8] = a[9][5];
    t[9] = a[9][6];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 8;
        }
    }
    t[1] = a[1][7];
    t[2] = a[1][8];
    t[3] = a[1][9];
    t[4] = a[2][7];
    t[5] = a[2][8];
    t[6] = a[2][9];
    t[7] = a[3][7];
    t[8] = a[3][8];
    t[9] = a[3][9];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 9;
        }
    }
    t[1] = a[4][7];
    t[2] = a[4][8];
    t[3] = a[4][9];
    t[4] = a[5][7];
    t[5] = a[5][8];
    t[6] = a[5][9];
    t[7] = a[6][7];
    t[8] = a[6][8];
    t[9] = a[6][9];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 10;
        }
    }
    t[1] = a[7][7];
    t[2] = a[7][8];
    t[3] = a[7][9];
    t[4] = a[8][7];
    t[5] = a[8][8];
    t[6] = a[8][9];
    t[7] = a[9][7];
    t[8] = a[9][8];
    t[9] = a[9][9];
    t = t.sort(compare);
    for (var k = 1; k <= 8; k++) {
        if ((t[k] == t[k + 1]) && (t[k] != 0) && (t[k + 1] != 0)) {
            return 11;
        }
    }
    return 0;
}
function solve_sudoku() {
    $("#" + pre_n).removeAttr("style");
    $("#" + pre_n).attr("style", $("#n10").attr("style"));
    $("#sodoku_output").text("");
    $("#sodoku_output").text("该数独可能无解");
    var temp_a;
    h = 0;
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            a[i][j] = 0;
            g[i][j] = 0;
            x[i][j] = 0;
            y[i][j] = 0;
        }
    }
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            temp_a = $("#" + j + i).text();
            if (temp_a != "") {
                a[i][j] = parseInt(temp_a);
                x[i][a[i][j]] = 1;
                y[j][a[i][j]] = 1;
                g[check(i, j)][a[i][j]] = 1;
            } else {
                a[i][j] = 0;
            }
        }
    }
    mem_a = a;
    if (legal_sudoku() != 0) {
        $("#sodoku_output").text("该数独无解");
        return;
    }
    p_time = (new Date().getTime());
    dfs(1, 1);
}
function clean_sudoku() {
    $("#" + pre_n).removeAttr("style");
    $("#" + pre_n).attr("style", $("#n10").attr("style"));
    $("#sodoku_output").text("");
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            $("#" + j + i).text("");
        }
    }
}
function reduc_sudoku() {
    $("#" + pre_n).removeAttr("style");
    $("#" + pre_n).attr("style", $("#n10").attr("style"));
    $("#sodoku_output").text("");
    for (var i = 1; i <= 9; i++) {
        for (var j = 1; j <= 9; j++) {
            if (mem_a[i][j] == 0) {
                $("#" + j + i).text("");
            } else {
                $("#" + j + i).text(mem_a[i][j]);
            }
        }
    }
}
