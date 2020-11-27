var tname=JSON.parse(localStorage.getItem("obj_TNAME")).code

var text1="";
day = new Date( );
time = day.getHours( );

if (( time >= 8 ) && (time < 12)) text1="上午好!"
else if (( time >= 12) && (time < 14)) text1="中午好!"
else if (( time >=14) && (time < 18)) text1="下午好!"
else text1="晚上好！"

$('#tname').text(tname);
$('#welcome').text(text1);