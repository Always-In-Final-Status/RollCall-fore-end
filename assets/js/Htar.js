//昨晚能正确运行的代码，加了点注释

var tid=JSON.parse(localStorage.getItem("obj_userID")).code
var tname=JSON.parse(localStorage.getItem("obj_TNAME")).code
var cid=JSON.parse(localStorage.getItem("obj_CID")).code
var weekday=JSON.parse(localStorage.getItem("obj_WEEKDAY")).code
var week=JSON.parse(localStorage.getItem("obj_WEEK")).code
var classindex=JSON.parse(localStorage.getItem("obj_CLASSINDEX")).code

$.ajax({
  type:'get',
  async: false,
  url:'https://813f1298-ee3b-4e8e-b30d-3d36891afeb6.bspapp.com/http/show_historyTable',
  contentType:'application/json',
  data:{"CID":cid,"TID":tid,"WEEKDAY":weekday,"WEEK":week,"CLASSINDEX":classindex},
  dataType:"json",
  success:function(data){
    if(data.status==0)
    {
      alert("查询失败");
    }else
    {
      creatTable(data);
    }
  },
  error:function(data){
    alert("网络错误");
  }
 });
//收到的数据按checkornot降序排列，2请假→1缺勤→0出勤
function creatTable(data){ 
  var flag = data.history[0].CHECKORNOT;//判断学生出勤状况
  var flag1 = 0;//每行写五个，flag=4的时候换行
  var flag2 = 0;//首列输出“出勤”，“缺勤”，“请假”
  var tableData="<tr>" +
                "<th scope='col' id='cname'>"+data.CNAME+"</th>" +
                "<th scope='col' id='cplace'>"+data.CPLACE+"</th>" +
                "<th scope='col' id='classtime'>第"+week+"周</th>" +
                "<th scope='col' id='classindex'>"+classindex+"节</th>" +
                "<th scope='col'>出勤"+data.DAO+"人</th>" +
                "<th scope='col'>缺勤"+data.QUE+"人</th>" +
                "<th scope='col'>请假"+data.QING+"人</th>" +
                "</tr>";

  for(var i=0;i<data.history.length;i++)
  {
      if(data.history[i].CHECKORNOT == flag)//不同出勤情况分界
      {
        if(flag2 == 0)//主要用来写第一个出勤情况，后面就没用了
        { 
          tableData+="<tr>"
          if(flag==2)tableData+="<td>"+"请假"+"</td>"+"<td>"+data.history[i].SNAME+"</td>";
          else if(flag==1)tableData+="<td>"+"缺勤"+"</td>"+"<td>"+data.history[i].SNAME+"</td>";
          else if(flag==0)tableData+="<td>"+"出勤"+"</td>"+"<td>"+data.history[i].SNAME+"</td>";
          flag2 = 1;
          flag1++;
        }
        else 
        {
          if(flag1==5)//输出完第五个之后换行
          {
            tableData+="<td>"+data.history[i].SNAME+"</td>"+"</tr>";
            flag1 = 0;
          }
          else if (flag1==0)//第一列是出勤情况，不写学生名，好像应该要在前面加个<tr>的
          {
            tableData+="<tr>"
            tableData+="<td>"+"</td>"+"<td>"+data.history[i].SNAME+"</td>";
            flag1 = 1;
          }
          else 
          {
            tableData+="<td>"+data.history[i].SNAME+"</td>";
            flag1 ++;
          }
        }
      }
      else //请假→缺勤，缺勤→出勤，这里最前面应该加个</tr>
      { 
        if(flag1 != 0){
          for(;flag1<6;flag1++){
            tableData+="<td></td>";
          }
          tableData+="</tr>"
        }
        flag = data.history[i].CHECKORNOT;
        tableData+="<tr>"
        if(flag==2)tableData+="<td>"+"请假"+"</td>"+"<td>"+data.history[i].SNAME+"</td>";
        else if(flag==1)tableData+="<td>"+"缺勤"+"</td>"+"<td>"+data.history[i].SNAME+"</td>";
        else if(flag==0)tableData+="<td>"+"出勤"+"</td>"+"<td>"+data.history[i].SNAME+"</td>";
        flag2 = 1;
        flag1 = 1;
      }
      
  }
  tableData+="</tr>"
  $("#tbody1").html(tableData)
 }


     //太晚了真顶不住了，生成的表格套进div里直接挤成一团了，麻烦了帮擦屁股了~
    
 