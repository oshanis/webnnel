include("fileio.js");

/*************************************************************************
 * Specific Functions
 *************************************************************************/

// Usage: takeSnapshot("c:\\","shot.png");

function takeSnapshot(path, filename) {
	
  var wTotal = document.documentElement.clientWidth;
  var hTotal = document.documentElement.clientHeight;
  
  var wViewable = window.innerWidth;
  var hViewable = window.innerHeight;
  
  var width = Math.min(wTotal, wViewable); 
  var height = Math.min(hTotal, hViewable);
  
  var x = window.scrollX;
  var y = window.scrollY;

  var scale = 1.0;

  var canvas = document.createElement("canvas");
  canvas.width = width*scale;
  canvas.height = height*scale;

  var context = canvas.getContext("2d");
  context.clearRect(x, y, canvas.width, canvas.height);
  context.scale(scale, scale);
  context.drawWindow(window, x, y, width, height, "rgb(0,0,0)");
  
  sleep(0.2);

  var data = atob(canvas.toDataURL("image/png").toString().slice(22));
  
  writeBytes(path + filename, data);
}

var channels = [];

function addChannel(URL){
  var length = channels.length;
  channels[length] = URL;
}

function deleteChannel(ID){
  channels[ID-1] = "";
}

addChannel("test");
addChannel("bbb");
addChannel("ccc");
deleteChannel("2");
output(channels);
