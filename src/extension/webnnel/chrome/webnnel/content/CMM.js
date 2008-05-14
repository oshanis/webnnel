/**************************************************************************************************
 * Web Channel (Webnnel)
 * Content Manipulation Module (CMM)
 **************************************************************************************************/

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
  var current = content.window.scrollY;  
  var hTotal = content.document.documentElement.clientHeight;
  var windowHeight = content.window.innerHeight;
  
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
                        content.window.scrollTo(0, current);
                      }else{
                        content.window.scrollTo(0, tarY);
                        clear(scrollTimer);
                      }
                    }else if(scroll == "down"){
                      current += yIntervalPMS;
                      if(current < tarY){
                        content.window.scrollTo(0, current);
                      }else{
                        content.window.scrollTo(0, tarY);
                        clear(scrollTimer);
                      }
                    }
                }, triggerPeriod);
    
  setTimeout(function(){
               clearInterval(scrollTimer);
             }, totalScrollTime);
    
}
         
function removeAllImages(){
  var imgs=content.document.getElementsByTagName("img");

  for(i=0;i<imgs.length;i++){
    imgs[i].style.display = "none";
  }
}

function restore_removeAllImages(){
  var imgs=content.document.getElementsByTagName("img");

  for(i=0;i<imgs.length;i++){
    imgs[i].removeAttribute("style");
  }
}


/* Functions for CAIs */
function toMyEmail(URL, username, pass){
  var window = getChromeWindowForNode(content.document.documentElement);
  goToUrl(wn_getBrowser(window), URL, null);
  
  setTimeout(function(){
    var usr = content.document.getElementById("Email");
    highlightThenDo(usr, function(){usr.value = username;});
  },1000); 
  
  setTimeout(function(){
    var pas = content.document.getElementById("Passwd");
    highlightThenDo(pas, function(){pas.value = pass;});
  },2000);  
  
  setTimeout(function(){
    clickButton(/Sign in/i);
  },3000);
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

function addChannel(URL){
  var length = channels.length;
  channels[length] = URL;
}

function deleteChannel(ID){
  channels[ID-1] = "";
}

function initializeChannel(){
	//var path = "C:\\Projects\\webnnel\\src\\channels\\";
  var path = "chrome://webnnel//content//channels//";
  var window = getChromeWindowForNode(content.document.documentElement);
  
  for(i=1; i<channels.length;i++){
    //go(channels[i]);
    goToUrl(wn_getBrowser(window), channels[i], null);
  
    takeSnapshot(path, "ch_"+i+".png");
  }
}

/*******************************************************************************
 * Function for Content Transformation                    
 *******************************************************************************/

function readMagic(evnt){
  
  var target = (evnt.target)? evnt.target : evnt.srcElement;
  
  // Avoid if target is a link
  if(target.nodeName == 'A') return;
  
  var area = target.offsetWidth * target.offsetHeight;
  var wholearea = content.document.documentElement.scrollWidth * content.document.documentElement.scrollHeight;
  var ratio = area/wholearea;
  
  // The process area are too large, we assume user click the whole article
  if(ratio > 0.2) return;
  
  if(target.status == "on"){
    
    target.status = "off";
    target.innerHTML = target.orgInnerHTML;
    target.setAttribute("style","background-color:");
    
  }else{
  
    var parentNode = target.parentNode;
    
    /* For target node, which parentNode's status is "on" */
    if(parentNode.status && (parentNode.status == "on")){
      parentNode.status = "off";
      parentNode.innerHTML = parentNode.orgInnerHTML;
      parentNode.setAttribute("style","background-color:");
     
      return;
    }
    
    target.status = "on";
  
    var data = target.innerHTML;
    var sentences = new Array();
    var finalPara = "";
    var fontSize = "100%";
    
    target.orgInnerHTML = data;

    /* Doing data processing */
    var pattern1 = /(\.|\?|\!)+("|')*(\s)+/g;    
    var data1 = data.replace(pattern1,"$1$2$3__ICATCHU__");
    
    var pattern2 = /(Mr\.|Jr\.|Jan\.|Feb\.|Aug\.|Sep\.|Sept\.|Gen\.|Lt\.|Col\.|Fig\.|e\.g\.|\s[a-zA-Z]\.[a-zA-Z]\.|\s[A-Z]\.|\s\!)+(\s)+__ICATCHU__/g;
    var data2 = data1.replace(pattern2, "$1$2 ");
    
    var deliminator = /__ICATCHU__/g;
    sentences = data2.split(deliminator);
    
    if(sentences.length == 1){
      finalPara = finalPara 
                  + "<div style=\"font-size:" + fontSize 
                  + ";padding-top:.1in;padding-left:.1in;padding-right:.1in;white-space:normal;\">" + sentences[0] 
                  + "</div>";  
      target.innerHTML = finalPara;
      target.setAttribute("style","background-color:#F5F6AD");
      return;
    }
    
    for(i=0;i<sentences.length;i++){
      
      if(i == 0){
        finalPara = finalPara 
                    + "<div style=\"font-size:" + fontSize 
                    + ";padding-top:.1in;padding-left:.1in;padding-right:.1in;white-space:normal;\">" + sentences[i] 
                    + "</div><br>";  
      }else if(i == (sentences.length-1)){
        
        // To avoid any space at the end of the sentence
        if(sentences[i] != ""){
          finalPara = finalPara 
                      + "<div style=\"font-size:" + fontSize 
                      + ";padding-left:.1in;padding-right:.1in;white-space:normal;\">" + sentences[i] 
                      + "</div><br>"; 
        }
        
      }else{
        finalPara = finalPara 
                    + "<div style=\"font-size:" + fontSize 
                    + ";padding-left:.1in;padding-right:.1in;white-space:normal;\">" + sentences[i] 
                    + "</div><br>";
      }
    }
        
    target.innerHTML = finalPara;
    target.setAttribute("style","background-color:#F5F6AD");
    
  }  
}

var bgColorsJ = {
	              0: "white",              // Original paragraph's background color
                1: "",                   // Background color after click - Light Gray: rgb(222,223,226)
                2: "rgb(245,246,173)",   // Background color after click - Light Yellow: rgb(245,246,173)
                3: "#F5F6AD",   // Sentence background color after click = Light yellow
                4: "" 
               };
               
var sentenceShiftPercentage = 30; // The unit is pixel
var sentenceShiftBumper = sentenceShiftPercentage/2;

function jengaTrans(evnt){
  
  var target = (evnt.target)? evnt.target : evnt.srcElement;
    
  // Avoid if target is a link
  if(target.nodeName == 'A') return;
  
  var area = target.offsetWidth * target.offsetHeight;
  var wholearea = content.document.documentElement.scrollWidth * content.document.documentElement.scrollHeight;
  var ratio = area/wholearea;
  
  // The process area are too large, we assume user click the whole article
  if(ratio > 0.2) return;
  
  if(target.tagName == "P" && target.status == "on"){
    
    target.status = "off";
    target.innerHTML = target.orgInnerHTML;
    target.setAttribute("style","background-color:" + bgColorsJ[0]);
    
  }else if((target.tagName == "SPAN" || target.tagName == "DIV") && (target.parentNode.tagName == "P") && (target.parentNode.status == "on")){
  	
  	target = target.parentNode;
  	
  	target.status = "off";
    target.innerHTML = target.orgInnerHTML;
    target.setAttribute("style","background-color:" + bgColorsJ[0]);
  	
  }else if(target.tagName == "SPAN" || target.tagName == "DIV" || target.tagName == "P"){
    
    if(target.parentNode.tagName == "P"){
      target = target.parentNode;
    }
    
    target.status = "on";
  
    var data = target.innerHTML;
    
    var sentences = new Array();
    var finalPara = "";
    var firstSentenceFontSize = "100%";
    var restSentenceFontSize = "100%";
    var contentFontFamily = "Verdana";
    
    target.orgInnerHTML = target.innerHTML;

    /* Doing data processing */
    var pattern1 = /(\.|\?|\!)+("|')*(\s)+/g;    
    var data1 = data.replace(pattern1,"$1$2$3__ICATCHU__");
    
    var pattern2 = /(Dr\.|Mr\.|Jr\.|Jan\.|Feb\.|Aug\.|Sep\.|Sept\.|Gen\.|Lt\.|Col\.|Fig\.|e\.g\.|\s[a-zA-Z]\.[a-zA-Z]\.|\s[A-Z]\.|\s\!)+(\s)+__ICATCHU__/g;
    var data2 = data1.replace(pattern2, "$1$2 ");
    
    var deliminator = /__ICATCHU__/g;
    sentences = data2.split(deliminator);
    
    if(sentences.length == 1){
      finalPara = finalPara 
                  + "<div style=\"display:inline; font-size:" + firstSentenceFontSize 
                  + ";padding-bottom:2pt;padding-left:2pt;border-left:1px solid lightgray;\">" + sentences[0]
                  + "</div>";
                    
      target.innerHTML = finalPara;
      //target.setAttribute("style","background-color:" + bgColors[0]);

      return;
    }
    
    var lineNum = 0;
    
    for(i=0;i<sentences.length;i++){
      
      if(i == 0){
      	lineNum += 1;
      	
        finalPara = finalPara 
                    + "<div style=\"display:inline; position:relative; top: 0px; font-size:" + firstSentenceFontSize 
                    + ";padding-bottom:2pt;padding-left:2pt"
                    + ";background-color:" + bgColorsJ[3]
                    + ";white-space:normal;\">" + sentences[i] 
                    + "</div>";
      }else if(i == (sentences.length-1)){
        
        // To avoid any space at the end of the sentence
        if(sentences[i] != ""){
        	lineNum += 1;
        	
          finalPara = finalPara 
                      + "<span id=\"sec-click\" linenum=\"" + lineNum + "\"" 
                      + " style=\"display:inline; position:relative; top:"+ i*sentenceShiftPercentage +"px; font-size:" + restSentenceFontSize 
                      + ";padding-bottom:2pt;padding-left:2pt"
                      + ";background-color:" + bgColorsJ[3]
                      + ";white-space:normal;\">" + sentences[i] 
                      + "</span>";
        }
        
        finalPara = finalPara                      
                    + "<div id=\"Bumper\" style=\"line-height:" + (lineNum*sentenceShiftPercentage-sentenceShiftBumper) + "px;\" lineNum=\"" + lineNum +"\">&nbsp;</div>"; 
        
      }else{
      	
      	lineNum += 1;
      	
        finalPara = finalPara 
                    + "<span id=\"sec-click\" linenum=\"" + lineNum + "\"" 
                    + " style=\"display:inline; position:relative; top:"+ i*sentenceShiftPercentage + "px; font-size:" + restSentenceFontSize 
                    + ";padding-bottom:2pt;padding-left:2pt"
                    + ";background-color:" + bgColorsJ[3]
                    + ";white-space:normal;\">" + sentences[i] 
                    + "</span>";
      }
    }
        
    target.innerHTML = finalPara;
    target.setAttribute("style","border-bottom:1px solid lightgray; padding-left:.1in;padding-top:.1in;padding-right:.1in;background-color:" + bgColorsJ[1] + ";font-family:" + contentFontFamily);

  }
}
