var tid=JSON.parse(localStorage.getItem("obj_userID")).code
var tname=JSON.parse(localStorage.getItem("obj_TNAME")).code
$.ajax({
  type:'get',
  url:'https://813f1298-ee3b-4e8e-b30d-3d36891afeb6.bspapp.com/http/get_table',
  data:{"TID":tid},
  dataType:"json",
  success:function(data){
    if(data.status==0)
    {
      alert("获取数据失败，请重试");
    }else{
      for(var k = 1; k < 11; k++){
        for (var i = 1; i < 6; i++) {
          for (var j = 1; j < 8; j++) {
              $("#table_"+ k + "_" + j + "_" + i).html("");
          }
        }
      }
      for(var j = 1; j < 11; j++){
        for (var i = 0; i < data.TABLE.length; i++) {
          if(data.TABLE[i].CSTART<=j && j<=data.TABLE[i].CEND){
            if(data.TABLE[i].CLASSINDEX.length == 3){
              var aa = data.TABLE[i].CLASSINDEX[2] - data.TABLE[i].CLASSINDEX[0];
              if(aa == 1){
                $("#table_" + j + "_" + data.TABLE[i].WEEKDAY + "_" + data.TABLE[i].CLASSINDEX[2]*1/2).html('<a onclick="Go(this)"'+' CID="'+data.TABLE[i].CID+'"'+' TID="'+data.TABLE[i].TID+'"'+' WEEKDAY="'+data.TABLE[i].WEEKDAY+'"'+' CLASSINDEX="'+data.TABLE[i].CLASSINDEX+'"'+ ' data-toggle="modal" data-target="#Modal">' + data.TABLE[i].CNAME + "<br>" + data.TABLE[i].CPLACE + '</a>');
              }
              else if(aa == 3){
                $("#table_" + j + "_" + data.TABLE[i].WEEKDAY + "_" + data.TABLE[i].CLASSINDEX[2]*1/2-1).html('<a onclick="Go(this)"'+' CID="'+data.TABLE[i].CID+'"'+' TID="'+data.TABLE[i].TID+'"'+' WEEKDAY="'+data.TABLE[i].WEEKDAY+'"'+' CLASSINDEX="'+data.TABLE[i].CLASSINDEX+'"'+ ' data-toggle="modal" data-target="#Modal">' + data.TABLE[i].CNAME + "<br>" + data.TABLE[i].CPLACE + '</a>');
                $("#table_" + j + "_" + data.TABLE[i].WEEKDAY + "_" + data.TABLE[i].CLASSINDEX[2]*1/2).html('<a onclick="Go(this)"'+' CID="'+data.TABLE[i].CID+'"'+' TID="'+data.TABLE[i].TID+'"'+' WEEKDAY="'+data.TABLE[i].WEEKDAY+'"'+' CLASSINDEX="'+data.TABLE[i].CLASSINDEX+'"'+ ' data-toggle="modal" data-target="#Modal">' + data.TABLE[i].CNAME + "<br>" + data.TABLE[i].CPLACE + '</a>');
              }
            }
          }
        }
      }
    }
  },
  error:function(data){
    alert("网络错误");
  }
 });


function Go(e){
    k = $(e);
    var CID = k.attr('CID');
    var TID = k.attr('TID');
    var WEEKDAY = k.attr('WEEKDAY');
    var CLASSINDEX = k.attr('CLASSINDEX');
    var WEEK = k.parent().parent().parent().parent().prev().text().slice(1,-1);

    $('#HH').unbind('click').click(function(k){
      localStorage.setItem("obj_CID",JSON.stringify({
          obj_name:"CID",
          code:CID
      }))
      localStorage.setItem("obj_TID",JSON.stringify({
          obj_name:"TID",
          code:TID
      }))
      localStorage.setItem("obj_WEEKDAY",JSON.stringify({
          obj_name:"WEEKDAY",
          code:WEEKDAY
      }))
      localStorage.setItem("obj_CLASSINDEX",JSON.stringify({
          obj_name:"CLASSINDEX",
          code:CLASSINDEX    
      }))
      localStorage.setItem("obj_WEEK",JSON.stringify({
        obj_name:"WEEK",
        code:WEEK
      }))
        $(location).attr('href', 'Htar.html');
    });

    $('#PP').unbind('click').click(function(k){
      localStorage.setItem("obj_CID",JSON.stringify({
          obj_name:"CID",
          code:CID
      }))
      localStorage.setItem("obj_TID",JSON.stringify({
          obj_name:"TID",
          code:TID
      }))
      localStorage.setItem("obj_WEEKDAY",JSON.stringify({
          obj_name:"WEEKDAY",
          code:WEEKDAY
      }))
      localStorage.setItem("obj_CLASSINDEX",JSON.stringify({
          obj_name:"CLASSINDEX",
          code:CLASSINDEX
      }))
      $(location).attr('href', 'Stats.html');
    });
  }