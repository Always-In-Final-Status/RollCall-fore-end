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
$.ajax({
  type:'get',
  url:'https://813f1298-ee3b-4e8e-b30d-3d36891afeb6.bspapp.com/http/studentinfo',
  data:{"CID":cid,"CLASSINDEX":classindex,"WEEKDAY":weekday,"TID":tid},
  dataType:"json",
  success:function(data){
    // console.log(data)
    if(data.status==0)
    {
      alert("获取数据失败，请重试");
    }else{
      // alert(data.status)
      var m;
      var i = 0;
      var k = 0;
      var len = data.STUDENT.length;
      $(".info>span>button").first().click(function(){
        if($(this).text() == '开始'){
          var start = function(){
            $('audio').remove();
            m = setTimeout( start, 2000);
            var audio = "<audio autoplay=\"autoplay\">" + "<source src=\"http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=3&text=" + data.STUDENT[i].SNAME + "\" type=\"audio/mpeg\">" + "</audio>";
            $('body').append(audio);
            
            if(k!=4){
              var imga = '<img src="data:image/png;base64, '+ data.STUDENT[i].FACE_DATA +'">';
              var name = '<p>姓名：'+ data.STUDENT[i].SNAME + '</p>';
              var Sno = '学号：'+'<span class="SID">' + data.STUDENT[i].SID + '</span>';
              var stu = '<td>' + imga + name + Sno + '</td>';
              $('table').children(':first-child').append(stu);
            }
            else{
              k = 0;
              $('table').children(':first-child').before('<tr></tr>')
              var imga = '<img src="'+ data.STUDENT[i].FACE_DATA +'">';
              var name = '<p>姓名：'+ data.STUDENT[i].SNAME + '</p>';
              var Sno = '学号：'+'<spa class="SID">' + data.STUDENT[i].SID + '</spa>';
              var stu = '<td>' + imga + name + Sno + '</td>';
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
  },
  error:function(data){
    alert("网络错误");
  }
});

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
      data:{"DAO":$('.dao>.SID').text(),'QUE':$('.queqin>.SID').text(),'QING':$('.qingjia>.SID').text(),"WEEKDAY":weekday,"WEEK":week,"CLASSINDEX":classindex,"CID":cid},
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