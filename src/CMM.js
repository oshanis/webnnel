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

function do_cleanPage(node){
  
  /* Initialize the global variables */
  avgImgWidth = 0;
  avgImgHeight = 0;
  imageNum = 0;
  totalImgWidth = 0;
  totalImgHeight = 0;

  imagesClassification(node);
  
  avgImgWidth = Math.floor(totalImgWidth/imageNum);  
  avgImgHeight = Math.floor(totalImgHeight/imageNum);
  
  imagesTransformation(node);
}

function restore_cleanPage(node){

  if (node.nodeType == 1){   
    
    /* if(node.nodeName == ('IMG' || 'EMBED' || 'IFRAME' || 'OBJECT')){ => There is a bug */
    if((node.nodeName == 'IMG')||(node.nodeName == 'EMBED')||(node.nodeName == 'IFRAME')||(node.nodeName == 'OBJECT')){
      node.width = node.orgWidth;
      node.height = node.orgHeight;
      node.style.opacity = 1;
    }
    
    if(node.nodeName == 'INPUT'){
      if(node.type == "radio"){	
      	node.style.background = "";
      }else{
        node.style.background = "";
      }  
    }else if(node.nodeName == ('SELECT' || 'BUTTON' || 'TEXTAREA')){
      node.style.background = "";
    }          	

  }

  var childNodes = node.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    restore_cleanPage(childNodes[i]);
  }

}

function scroll(direction){
  
  var scrollTimer;  
  var current = window.scrollY;
  
  var hTotal = document.documentElement.clientHeight;
  var windowHeight = window.innerHeight;
  
  var triggerPeriod = 10;
  var totalScrollTime = 500;
    
  var scroll = direction;
  
  // To have less scroll time and get larger yIntervalPMS
  var scrollTimes = (totalScrollTime/triggerPeriod);
  var yIntervalPMS = Math.ceil(windowHeight/scrollTimes);
  yIntervalPMS += 10;
  
  if(scroll == "up"){
    tarY = current - windowHeight;
  }else if(scroll == "down"){
    tarY = current + windowHeight;
  }
  
  scrollTimer = setInterval(function(){                   
                    if(scroll == "up"){
                      current -= yIntervalPMS;
                      if(current > tarY){
                        window.scrollTo(0, current);
                      }else{
                        window.scrollTo(0, tarY);
                        clear(scrollTimer);
                      }
                    }else if(scroll == "down"){
                      current += yIntervalPMS;
                      if(current < tarY){
                        window.scrollTo(0, current);
                      }else{
                        window.scrollTo(0, tarY);
                        clear(scrollTimer);
                      }
                    }
                }, triggerPeriod);
    
  setTimeout(function(){
               clearInterval(scrollTimer);
             }, totalScrollTime);
    
}
         
function removeAllImages(){
  var imgs=document.getElementsByTagName("img");

  for(i=0;i<imgs.length;i++){
    imgs[i].style.display = "none";
  }
}

function restore_removeAllImages(){
  var imgs=document.getElementsByTagName("img");

  for(i=0;i<imgs.length;i++){
    imgs[i].removeAttribute("style");
  }
}


/* Functions for CAIs */
function toMyEmail(URL, username, pass){
  go(URL);
  enter("Username", username);
  enter("Password", pass);
  click("Sign in");
}
  
/*******************************************************************************
 * Function for images classification and transformation                       *                    
 *******************************************************************************/

const UI_BRANDING_IMG = "1";
const CONTENT_AD_IMG = "2";
const UNKNOWN = "3";

var imageNum = 0;
var totalImgWidth = 0;
var totalImgHeight = 0;

function imagesClassification(node){
  if (node.nodeType == 1){
      
      if(node.nodeName == 'IMG'){ 	
      	/* Need some ways to detect UI and Branding images */
      	if ((imageNum<5) && (node.width>100) && (node.height>50))
      	{
      	  node.icType = UI_BRANDING_IMG;
      	  
      	  imageNum += 1;
          totalImgWidth += node.width;
          totalImgHeight += node.height;
      	  
      	  return;
      	}
      	
      	/* Generic rules*/
      	if (!node.isMap) {
          node.icType = CONTENT_AD_IMG;
          
          if((node.width != 0) && (node.width != 0)){
            imageNum += 1;
            totalImgWidth += node.width;
            totalImgHeight += node.height;
          }    
        }else{
          node.icType = UI_BRANDING_IMG;
        }
        
      }else if(node.nodeName == 'IFRAME'){
        node.icType = CONTENT_AD_IMG;
      }else if(node.nodeName == 'EMBED'){
        node.icType = CONTENT_AD_IMG;
      }else if(node.nodeName == 'OBJECT'){
        node.icType = CONTENT_AD_IMG;
      }
      
  } /* End of node type */
  
  var childNodes = node.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    imagesClassification(childNodes[i]);
  }
}

var UPPER_THRESHOLD = 2.5;
var LOWER_THRESHOLD = 0.4;
var thresholdDistance = UPPER_THRESHOLD - LOWER_THRESHOLD;

var UPPER_RATIO = 0.3;
var LOWER_RATIO = 0.7;
var ratioDistance = Math.abs(UPPER_RATIO-LOWER_RATIO);

var unitRatio = ratioDistance/thresholdDistance;

function imagesTransformation(node){

  if (node.nodeType == Node.ELEMENT_NODE){   
      
      /* To transform Content and AD images */
      if(node.icType == CONTENT_AD_IMG){
        if(node.nodeName == 'IMG'){
      	  
      	  node.orgWidth = node.width;
      	  node.orgHeight = node.height;
      	  
      	  if ((node.width > 50) && (node.height > 50)){ /* The difference between "IMG" ant other tags. */
      	  
      	    var widthRatio = node.width/avgImgWidth;
      	    var heightRatio = node.height/avgImgHeight;
      	    
      	    if(widthRatio > UPPER_THRESHOLD){
      	      node.width = node.width * UPPER_RATIO;
      	    }else if(widthRatio < LOWER_THRESHOLD){
              node.width = node.width * LOWER_RATIO;
            }else{
              var finalRatio = LOWER_RATIO - (unitRatio * (widthRatio-LOWER_THRESHOLD));
              node.width = Math.floor(node.width * finalRatio);
            }
          
            if(heightRatio > UPPER_THRESHOLD){
              node.height = node.height * UPPER_RATIO;
            }else if(heightRatio < LOWER_THRESHOLD){
              node.height = node.height * LOWER_RATIO;
            }else{
              var finalRatio = LOWER_RATIO - (unitRatio * (heightRatio-LOWER_THRESHOLD));
              node.height = Math.floor(node.height * finalRatio);
            }
          
            node.style.opacity = 0.25;
          }  
      	  
      	}else if((node.nodeName == 'IFRAME')||(node.nodeName == 'EMBED')||(node.nodeName == 'OBJECT')){
      	  node.orgWidth = node.width;
      	  node.orgHeight = node.height;
      	  
      	  var widthRatio = node.width/avgImgWidth;
      	  var heightRatio = node.height/avgImgHeight;
      	  
      	  if(widthRatio > UPPER_THRESHOLD){
      	    node.width = node.width * UPPER_RATIO;
          }else if(widthRatio < LOWER_THRESHOLD){
            node.width = node.width * LOWER_RATIO;
          }else{
            var finalRatio = LOWER_RATIO - (unitRatio * (widthRatio-LOWER_THRESHOLD));
            node.width = Math.floor(node.width * finalRatio);
          }
          
          if(heightRatio > UPPER_THRESHOLD){
            node.height = node.height * UPPER_RATIO;
          }else if(heightRatio < LOWER_THRESHOLD){
            node.height = node.height * LOWER_RATIO;
          }else{
            var finalRatio = LOWER_RATIO - (unitRatio * (heightRatio-LOWER_THRESHOLD));
            node.height = Math.floor(node.height * finalRatio);
          }
      	  
      	  node.setAttribute("style","-moz-opacity:0.2");
      	}
      	
      }else if(node.icType == UI_BRANDING_IMG){
        
        node.orgWidth = node.width;
      	node.orgHeight = node.height;
      
      }
      
  } /* End of node type */
  
  var childNodes = node.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    imagesTransformation(childNodes[i]);
  }
}

/*******************************************************************************
 * Function for Channel access                                                 *                    
 *******************************************************************************/

var channels = [
 "",
 "http://www.yahoo.com",
 "http://www.cnn.com",
 "http://www.nytimes.com",
 "http://news.google.com",
 "http://www.technologyreview.com/",
 "http://www.youtube.com/"
];

function addChannel(URL){
  var length = channels.length;
  channels[length] = URL;
}

function deleteChannel(ID){
  channels[ID-1] = "";
}

function initializeChannel(){
	var path = "C:\\Projects\\webnnel\\src\\channels\\";
  for(i=1; i<channels.length;i++){
    go(channels[i]);
    takeSnapshot(path, "ch_"+i+".png");
  }
}
