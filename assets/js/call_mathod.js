window.addEventListener('keydown', move, true);//注册键盘交互事件
//获取上个页面传的参数
var tid=JSON.parse(localStorage.getItem("obj_TID")).code
// alert(tid)
var cid=JSON.parse(localStorage.getItem("obj_CID")).code
// alert(cid)
var weekday=JSON.parse(localStorage.getItem("obj_WEEKDAY")).code
// alert(weekday)
var classindex=JSON.parse(localStorage.getItem("obj_CLASSINDEX")).code
// alert(classindex)
var week=JSON.parse(localStorage.getItem("obj_WEEK")).code
var tname=JSON.parse(localStorage.getItem("obj_TNAME")).code

initLoading();
showLoading();

var index = 0
var flag = 1
var studentList = []
var sum = 0
var get_count = async function(){
    await $.ajax({
        type:'get',
        url:'https://813f1298-ee3b-4e8e-b30d-3d36891afeb6.bspapp.com/http/studentinfocount',
        data:{"CID":cid,"CLASSINDEX":classindex,"WEEKDAY":weekday,"TID":tid},
        dataType:"json",
        success:function(data){
            //alert("已插入");
            // console.log(data)
            if(data.status==0)
            {
                alert("获取数据失败，请重试");
            }else{
                sum = data.COUNT;
                console.log(sum);
            }
        },
        error:function(data){
            alert("网络错误");
        }
    });
}
var get_check = function(){
    $.ajax({
        type:'get',
        url:'https://813f1298-ee3b-4e8e-b30d-3d36891afeb6.bspapp.com/http/studentinfo',
        data:{"CID":cid,"CLASSINDEX":classindex,"WEEKDAY":weekday,"TID":tid,"INDEX":index},
        dataType:"json",
        success:function(data){
            //alert("已插入");
            // console.log(data)
            if(data.status==0)
            {
                alert("获取数据失败，请重试");
            }else{
                var len = data.STUDENT.data.length;
                var i = 0;
                for(i = 0;i<len;i++){
                    //console.log(data.STUDENT.data[i].studentList[0]);
                    if(typeof(data.STUDENT.data[i].studentList[0])!="undefined")
                        studentList.push(data.STUDENT.data[i].studentList[0]);
                }
            }
        },
        error:function(data){
            alert("网络错误");
        }
    });
}
function cmp(prop){
    return function(a,b){
        var value1 = a[prop];
        var value2 = b[prop];
        return (value1<value2) ? -1 : 1;
    }
}
async function getinfo(){
    await get_count();
    console.log(sum);
    for(index = 0;index < sum;index+=10){
        await get_check();
        console.log(index);
    }
    await sleep(2000);
    hideLoading();
    studentList.sort(cmp('SID'));
    var m;
    var i = 0;
    var k = 0;
    var len = studentList.length;
    $(".info>span>button").first().click(function(){
        if($(this).text() == '开始'){
            var start = function(){
                $('audio').remove();
                m = setTimeout( start, 4000);
                var audio = "<audio autoplay=\"autoplay\">" + "<source src=\"http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=3&text=" + studentList[i].SNAME + "\" type=\"audio/mpeg\">" + "</audio>";
                $('body').append(audio);

                if(k!=4){
                    var imga = '<img src="data:image/png;base64, '+ studentList[i].FACE_DATA +'">';
                    var name = '<p>姓名：'+ studentList[i].SNAME + '</p>';
                    var Sno = '学号：'+'<span class="SID">' + studentList[i].SID + '</span>';
                    var stu = '<td class="dao">' + imga + name + Sno + '</td>';
                    $('table').children(':first-child').append(stu);
                }
                else{
                    k = 0;
                    $('table').children(':first-child').before('<tr></tr>')
                    var imga = '<img src="data:image/png;base64, '+ studentList[i].FACE_DATA +'">';
                    var name = '<p>姓名：'+ studentList[i].SNAME + '</p>';
                    var Sno = '学号：'+'<spa class="SID">' + studentList[i].SID + '</spa>';
                    var stu = '<td class="dao">' + imga + name + Sno + '</td>';
                    $('table').children(':first-child').append(stu);
                }
                // $('td').unbind('click').click(function(){
                // 	$(this).toggleClass('queqin');
                // })
                i++;
                if(i == len){
                    $(".info>span>button").first().unbind('click');
                    clearTimeout(m);
                    setTimeout(function(){
                        alert("点名结束");
                        window.removeEventListener('keydown', move, true);//注册键盘交互事件
                        BackData();
                    }, 2000);
                    return;
                }
                k++;
            };
            start();
            $(this).text('暂停');
        }
        else{
            clearTimeout(m);
            $(this).text('开始');
        }
    })
}
getinfo();
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
function move(ev){
	var GET = ev.keyCode;
	if (GET == 65 || GET == 37) {
		var ttd = $('table').children(':first-child').children(':last-child');
		ttd.removeClass('queqin');
		ttd.removeClass('qingjia')
		ttd.addClass('dao');
		console.log('左');
	}
	else if (GET == 68 || GET == 39) {
		var ttd = $('table').children(':first-child').children(':last-child');
		ttd.removeClass('queqin');
		ttd.removeClass('dao')
		ttd.addClass('qingjia');
		console.log('右');
	}
	else if (GET == 83 || GET == 40) {
		var ttd = $('table').children(':first-child').children(':last-child');
		ttd.removeClass('dao');
		ttd.removeClass('qingjia')
		ttd.addClass('queqin');
		console.log('下');
	}
}

  function BackData(){
    $.ajax({
      type:'get',
      url:'https://813f1298-ee3b-4e8e-b30d-3d36891afeb6.bspapp.com/http/get_studenthistory',
      data:{"DAO":$('.dao>.SID').text(),'QUE':$('.queqin>.SID').text(),'QING':$('.qingjia>.SID').text(),"WEEKDAY":weekday,"WEEK":week,"CLASSINDEX":classindex,"CID":cid,"TNAME":tname},
      dataType:"json",
      success:function(data){
      if(data.status==0)
      {
        alert("获取数据失败，请重试");
       }else
       {
          // 获取缺勤学生名单
          alert('发送成功');
    }}});
  }

// 设置加载模态窗
function  initLoading(){
    $( "body" ).append( "<!-- loading -->"  +
        "<div class='modal fade' id='loading' tabindex='-1' aria-hidden='true' data-backdrop='static'>"  +
        "<div class='modal-dialog modal-sm modal-dialog-centered'>"  +
        "<div class='modal-content'>"  +
        "<div class='modal-header clearfix'>"  +
        "<div class='spinner-border float-right'>" +
        "<span class='sr-only'>加载中Loading...</span>" +
        "</div>" +
        "<div>" +
        "<span>加载数据中，请稍后！</span>" +
        "</div>" +
        "</div>"  +
        "</div>"  +
        "</div>"  +
        "</div>"
    );
}

// 开启加载模态窗
function  showLoading(){
    $( "#loading" ).modal( "show" );
}

// 关闭加载模态窗
function  hideLoading(){
    $( "#loading" ).modal( "hide" );
}