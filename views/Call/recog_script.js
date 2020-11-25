// version: recog_script(loadJSON)
const video = document.getElementById("video");
var res;
var label = ['021800626', '021800813', '021800901', '031502208', '031802103', '031802105', '031802107', '031802108', '031802110', '031802111', '031802116', '031802118', '031802119', '031802120', '031802121', '031802122', '031802123', '031802126', '031802130', '031802132', '031802136', '031802137', '031802140', '031802143', '031802145', '031802209', '031802216', '031802217', '031802221', '031802222', '031802226', '031802228', '031802230', '031802232', '031802234', '031802238', '031802239', '031802245', '031802306', '031802312', '031802315', '031802318', '031802326', '031802327', '031802331', '031802340', '031802342', '031802401', '031802402', '031802411', '031802413', '031802414', '031802415', '031802416', '031802418', '031802423', '031802425', '031802431', '031802432', '031802433', '031802435', '031802437', '031802440', '031802442', '031802501', '031802508', '031802510', '031802518', '031802528', '031802531', '031802604', '031802605', '031802606', '031802610', '031802614', '031802615', '031802618', '031802620', '031802621', '031802623', '031802624', '031802625', '031802626', '031802627', '031802629', '031802633', '031802641', '031804101', '031804102', '031804104', '031804106', '031804108', '031804109', '031804110', '031804111', '031804112', '031804113', '031804114', '031804115', '031804117', '031804118', '031804119', '031804120', '031804121', '031804124', '031804125', '031804126', '031804127', '031804129', '031804130', '031804131', '031804132', '031804133', '031804134', '031804135', '031804139', '031804140', '041801413', '041801420', '041802135', '041803101', '061800202', '061800339', '081800228', '081800321', '081800339', '111800207', '111800827', '181700405', '181800331']
var Attendance = new Array()
for(var i=0;i<label.length;i++){
    Attendance[label[i]]=5
  }

// const video = document.getElementById("video");
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

async function startVideo(){
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.log(err) 
        )
} 

video.addEventListener('play', async() => {
    // const canvas = faceapi.createCanvasFromMedia(video);
    // document.body.append(canvas);
    const canvas = faceapi.createCanvasFromMedia(video);
    document.getElementById("vid").append(canvas)
    
    // const labeledFaceDescriptors = await loadLabeledImages()
    // var json_str = "{\"parent\":" + JSON.stringify(labeledFaceDescriptors) + "}"
    // // save the json_str to json file
    // var data = JSON.stringify(json_str)
    // var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "./studata.json");
    // console.log("successfully saved data!")
  
    // Load json file and parse
    const json_str = await getFromJSON()
    console.log(json_str)
    var content = JSON.parse(json_str)
    for (var x = 0; x < Object.keys(content.parent).length; x++) {
    for (var y = 0; y < Object.keys(content.parent[x]._descriptors).length; y++) {
    var results = Object.values(content.parent[x]._descriptors[y]);
    content.parent[x]._descriptors[y] = new Float32Array(results);
    }
}
    const faceMatcher = await createFaceMatcher(content);
//   var Descriptors = await getFromJSON()

//   const labeledFaceDescriptors = JSON.parse(Descriptors)
//   console.log(labeledFaceDescriptors)

//   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4)

  const displaySize = { width : video.width, height : video.height}
  faceapi.matchDimensions(canvas,displaySize);
  setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 512 }))
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors()

          const resizedDetections = faceapi.resizeResults(detections,displaySize);
          canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
          faceapi.draw.drawDetections(canvas,resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas,resizedDetections);
        
          const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
          results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
          drawBox.draw(canvas)
        //   console.log(result.toString())
        var stu = result.toString().slice(0,9)
          console.log(stu)
          if(Attendance[stu]>0){
            Attendance[stu]--;
          }
          else if(Attendance[stu]<=0){
            toastr.success(`Hello ${stu}`);
            // function to record
          }
        })
  },500);
});      


async function getFromJSON(){
    // res=$.getJSON("save.json", "", function(data) {　 //each循环 使用$.each方法遍历返回的数据date
    //     // var resData = JSON.parse(data)
    //     return data
    // });

    res=await $.ajax({
        url: "./stuFaceData/_studata.json", //json文件位置
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function(data) { //请求成功完成后要执行的方法 
            console.log(data)
            return data
        }
    })
    return res
    // return JSON.stringify(res)
}


// -----------------------------------------------------------------------


function loadLabeledImages() {
    const labels = ['021800626', '021800813', '021800901', '031502208', '031802103', '031802105', '031802107', '031802108', '031802110', '031802111', '031802116', '031802118', '031802119', '031802120', '031802121', '031802122', '031802123', '031802126', '031802130', '031802132', '031802136', '031802137', '031802140', '031802143', '031802145', '031802209', '031802216', '031802217', '031802221', '031802222', '031802226', '031802228', '031802230', '031802232', '031802234', '031802238', '031802239', '031802245', '031802306', '031802312', '031802315', '031802318', '031802326', '031802327', '031802331', '031802340', '031802342', '031802401', '031802402', '031802411', '031802413', '031802414', '031802415', '031802416', '031802418', '031802423', '031802425', '031802431', '031802432', '031802433', '031802435', '031802437', '031802440', '031802442', '031802501', '031802508', '031802510', '031802518', '031802528', '031802531', '031802604', '031802605', '031802606', '031802610', '031802614', '031802615', '031802618', '031802620', '031802621', '031802623', '031802624', '031802625', '031802626', '031802627', '031802629', '031802633', '031802641', '031804101', '031804102', '031804104', '031804106', '031804108', '031804109', '031804110', '031804111', '031804112', '031804113', '031804114', '031804115', '031804117', '031804118', '031804119', '031804120', '031804121', '031804124', '031804125', '031804126', '031804127', '031804129', '031804130', '031804131', '031804132', '031804133', '031804134', '031804135', '031804139', '031804140', '041801413', '041801420', '041802135', '041803101', '061800202', '061800339', '081800228', '081800321', '081800339', '111800207', '111800827', '181700405', '181800331']
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`../photos/processed/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
          console.log(detections.descriptor)
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  }


// Create Face Matcher
async function createFaceMatcher(data) {
    const labeledFaceDescriptors = await Promise.all(data.parent.map(className => {
    const descriptors = [];
    for (var i = 0; i < className._descriptors.length; i++) {
        descriptors.push(className._descriptors[i]);
    }
    return new faceapi.LabeledFaceDescriptors(className._label, descriptors);
    }))
    return new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4);
}