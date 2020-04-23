var albumBucketName = 'god-of-interview-userdata';
var bucketRegion = 'ap-northeast-2';
var IdentityPoolId = 'ap-northeast-2:5f45d1c2-23ca-4889-ae75-cb16dbcf5deb';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});


let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stop = id('stop'),
  all = id('allbtn'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;
let urls = [];
let ulurls = id('all');
$(document).ready(function()
{
	if(navigator.getUserMedia || navigator.webkitGetUserMedia ||     navigator.mozGetUserMedia || navigator.msGetUserMedia
	  || navigator.mediaDevices.getUserMedia)
		$("#label").text("Mic Available");
	else
		$("#label").text("Mic not available");

	
});

gUMbtn.onclick = e => {
  let mv = id('mediaVideo'),
      mediaOptions = {
        audio: {
          tag: 'audio',
          type: 'audio/wav',
          ext: '.wav',
          gUM: {audio: true}
        }
      };
  media = mediaOptions.audio;
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    id('gUMArea').style.display = 'none';
    id('btns').style.display = 'inherit';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if(recorder.state == 'inactive')  makeLink();
    };
    log('got media successfully');
  }).catch(function(err) { alert(err); });
}

start.onclick = e => {
	try
	{
		 start.disabled = true;
		  stop.removeAttribute('disabled');
		  chunks=[];
		  recorder.start();
	}
	catch(err)
	{
		alert(err);
	}
 
}


stop.onclick = e => {
	try
	{
		stop.disabled = true;
		  recorder.stop();
		  start.removeAttribute('disabled');
	}
	catch(err)
	{
		alert(err);
	}
  
}

all.onclick = e => {
let i = 0;
urls.forEach(element => 
{
li = document.createElement('li');
hf = document.createElement('a');
hf.href = element;
  hf.download = `${i++}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;
li.appendChild(hf);
ulurls.appendChild(li);
})
}

function makeLink(){
	try
	{
		let blob = new Blob(chunks, {type: media.type })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
  ;
  mt.controls = true;
  mt.src = url;
  hf.href = url;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;
  li.appendChild(mt);
  li.appendChild(hf);
  ul.appendChild(li);
urls.push(url);
uploadToAWS(blob,`${counter - 1}${media.ext}`);
	}
	catch(err)
	{
		alert(err);
	}
  
}

function uploadToAWS(blob, fileName)
{
  var albumPhotosKey = encodeURIComponent('test_javascript') + '/';
  var photoKey = albumPhotosKey + fileName;
  var file = new File([blob],fileName);

 s3.upload({
    Key: photoKey,
    Body: file,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      return alert('There was an error uploading your photo: ', err.message);
    }
    alert('Successfully uploaded photo.');
  });
}