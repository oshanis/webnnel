
var webnnel = {
	
  onLoad: function(evnt) {
  	
  	// If not for main window, then return. => This is used to avoid onLoad event is evoked multiple times
  	// if(evnt.originalTarget != document) return;
  	
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("webnnel-strings");
    
    document.getElementById("contentAreaContextMenu")
            .addEventListener("popupshowing", function(e) { this.showContextMenu(e); }, false);

    check_isLoadingStatus();
    
  }
};

window.addEventListener("load", function(e) { webnnel.onLoad(e); }, true);

function check_isLoadingStatus(){
  var tabBrowser = chromeWindow.document.getElementById('content');
  
  if(tabBrowser.selectedBrowser.checking != "true"){
  	tabBrowser.selectedBrowser.checking = "true";
  	
    var webProgress = tabBrowser.selectedBrowser.webProgress;
    checkTimer = setInterval(function(){
      if(!webProgress.isLoadingDocument){
          tabBrowser.selectedBrowser.checking = "false";
          
          //Initialize Webnnel related functioins
          attachNumTag();
 
          initWebnnelStatus();
          
          clearInterval(checkTimer);
      }
    }, 1000);
  }      
}

function attachNumTag(){
  var links = content.document.getElementsByTagName("A");

  for(i=0;i<links.length;i++){
    var link = links[i];
  
    var tag = content.document.createElement("SPAN");
    tag.id = i;
    tag.className = "numTag";
    tag.innerHTML = i;
    tag.setAttribute("style", "display:none;");
  
    link.appendChild(tag);
  }
}

function showNumTag(){
  var objs = content.document.getElementsByTagName("SPAN");
  
  for(i=0;i<objs.length;i++){
  	if(objs[i].className == "numTag"){
      objs[i].setAttribute("style","color:red;font-size:12px;font-weight:normal;max-width:20px;border:thin solid green;");
    }  
  }  
}

function hideNumTag(){
  var objs = content.document.getElementsByTagName("SPAN");
  for(i=0;i<objs.length;i++){
  	if(objs[i].className == "numTag"){
  		objs[i].removeAttribute("style");
      objs[i].setAttribute("style","display:none;");
    }  
  }  
}

function initWebnnelStatus(){
  var textbox = document.getElementById("webnnel-toolbar-command");
  textbox.addEventListener('keydown',function (evt) {    		
  	// keyCode 13 is the enter command
  	if(evt.keyCode == 13){
  	  var command = document.getElementById("webnnel-toolbar-command");
      cmdParser(command.value);
      command.value = "";
      command.focus();
    }
  }, true);
  
  var command = document.getElementById("webnnel-toolbar-command");
  command.focus();
}

function myLog(s) {
	Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage(s);
}

var channels = [
 "",
 "http://www.yahoo.com",
 "http://www.cnn.com",
 "http://www.nytimes.com",
 "http://news.google.com",
 "http://www.technologyreview.com/",
 "http://www.youtube.com/"
];

var preAction = "";

function cmdParser(cmd){
	
	var tokens = cmd.split(" ");
	
	switch(tokens[0]){
		
		/********************************************************
		 * Navigation Categories
		 ********************************************************/
		 	
		case "web":
		  if(tokens[1] == "channel"){
		    goWebnnel();
		  }  
		  break;
		case "grid":
		  if(tokens[1] == "mode") gridMode();
		  break;
		case "frame":
		  if(tokens[1] == "mode") frameMode();
		  break;
		case "left":
		  left();
		  break;
		case "right":
		  right();
		  break;
		case "channel":
      var index = tokens[1];
      if(index < "7" && index > "0"){
        content.document.location = channels[index];
      }  
      break;
		case "back":
		  goBack();
		  break;
		case "next":
		  goNext();
		  break;
		case "scroll":
      if(tokens[1] == "up"){
        scrollUP();
      }else if(tokens[1] == "down"){
        scrollDown();
      }  
      break;
    case "undo":
      if(preAction == "clean page"){
      	//Depend on previous action to know undo which action
        undo_cleanPage();
      }else if(preAction == "remove image"){
        undo_removeImage();
      }
  	  break;
    case "homepage":
      homepage();
      break;

    /********************************************************
		 * Content Access Categories
		 ********************************************************/
  	case "clean":
      if(tokens[1] == "page"){
        cleanPage();
      }  
      break;
    case "click":
      var term = new RegExp(tokens[1],"i");
      clickLink(term);
      break;
    case "remove":
      if(tokens[1] == "image"){
        removeImage();
      }
      break;
   
    /********************************************************
		 * Macros
		 ********************************************************/
		 
    case "my":
      if(tokens[1] == "email"){
      	myEmail();
      }else if(tokens[1] == "news"){
      	myNews();
      }	
      break;
    case "logout":
      logout();
      break;
    case "yahoo":
      Yahoo();    
      var command = document.getElementById("webnnel-toolbar-command");
      command.focus();
      break;
    case "cnn": 
      CNN();
      break;
    
    /********************************************************
		 * Audio Command Categories
		 ********************************************************/

    case "one":
      if(tokens[1] == "clap"){
        oneClap();
      }  
      break;
    case "two":
      if(tokens[1] == "clap"){
        twoClap();
      }  
      break;
    
    /********************************************************
		 * Utility Command Categories
		 ********************************************************/

    case "show":
      if(tokens[1] == "tag"){
        showNumTag();
      }  
      break;
    case "hide":
      if(tokens[1] == "tag"){
        hideNumTag();
      }  
      break;
   
   /********************************************************
		* Default
		********************************************************/
 		default:
		  break;
  }
  
  if(tokens[0] == "clean"){
  	preAction = "clean page";
  }else if(tokens[0] == "remove"){
  	preAction = "remove image";
  }else{
    preAction = "";
  }
}

/* CAI */

function goWebnnel(){
	/*Still need to check when to execute initializeChannel();*/
  content.document.location = "chrome://webnnel/content/webnnel.html";
  setTimeout(function(){
    gridMode();
  },500);
}

function gridMode(){
  showChannelsInGrid();
}

function frameMode(){
  showChannelsInFrame();
}

function left(){
  turnLeft();
}

function right(){
	turnRight();
}

function channel(number){
	content.document.location = channels[number];
}

function goBack(){
	content.history.back();
}

function goNext(){
	content.history.forward();
}

function scrollUP(){
	scroll("up");
}

function scrollDown(){
	scroll("down");
}

/* Content Access APIs */

function cleanPage(){
	do_cleanPage(content.document.documentElement);
}

function undo_cleanPage(){
  restore_cleanPage(content.document.documentElement);
}

function removeImage(){
	removeAllImages();
}

function undo_removeImage(){
	restore_removeAllImages();
}



function oneClap(){
  goWebnnel();
}

function twoClap(){
  homepage();
}

/* Macro APIs */

function myEmail(){
	toMyEmail("http://gmail.com","webnnel","pwebnnel");
}

function logout(){
	var term = new RegExp("Sign out","i");
	clickLink(term);
}

function myNews(){
	content.document.location = "http://www.technologyreview.com/";
}

function Yahoo(){
	content.document.location = "http://www.yahoo.com/";
}

function CNN(){
	content.document.location = "http://www.cnn.com/";
}

/* Audio Command APIs */

function homepage(){
	var home = chromeWindow.document.getElementById('home-button');
  content.document.location = home.tooltipText;
}


/* CAP */


function showChannelsInGrid(){
		
	// Switch the template
  var template1 = content.document.getElementById("grid_mode");
  template1.removeAttribute("style");
  
  var template2 = content.document.getElementById("frame_mode");
  template2.setAttribute("style", "display:none");
  
  var padding = content.document.getElementById("padding_space");
  padding.setAttribute("style", "display:none");
	
	for(i=1;i<7;i++){
	  var cid = "gm_ch_" + i;
    var channel = content.document.getElementById(cid);
    channel.border = "1";
    channel.src = "chrome://webnnel/content/channels/ch_" + i + ".png";
  }
  
}

var fm_start = 1;
var fm_length = 3;
var fm_totalChannels = 6;

function showChannelsInFrame(){

  // Switch the template
  var tpt1 = content.document.getElementById("grid_mode");
  tpt1.setAttribute("style","display:none");
  
  var tpt2 = content.document.getElementById("frame_mode");
  tpt2.removeAttribute("style");
  
  var padding = content.document.getElementById("padding_space");
  padding.setAttribute("style","line-height:180px"); 	
  
  // Sweeze in snapshots
  
  for(i=fm_start,j=1;i<fm_length+1;i++,j++){
	  var cid = "fm_" + i;
    var channel = content.document.getElementById(cid);
    channel.border = "1";
    channel.src = "chrome://webnnel/content/channels/ch_" + i + ".png";
    
    var title = content.document.getElementById(cid + "_title");
    title.innerHTML = i;
  }  
	
	// Adjust the channel display
	
	var pre = content.document.getElementById("fm_1");
	pre.width = pre.width * 0.6;
	pre.height = pre.height * 0.6;

  var pre_con = content.document.getElementById("fm_1_con");
	pre_con.style.left = "100px";
	
	var middle = content.document.getElementById("fm_2");
	middle.width = middle.width * 1.4;
	middle.height = middle.height * 1.4;
	
	var middle_con = content.document.getElementById("fm_2_con");
	middle_con.style.left = "150px";
	
	var last = content.document.getElementById("fm_3");
	last.width = last.width * 0.6;
	last.height = last.height * 0.6;
	
	var last_con = content.document.getElementById("fm_3_con");
	last_con.style.left = "200px";
	
}

function turnLeft(){
  
  // Record which channel is located in the first frame
  fm_start = fm_start + 1;
  
  // Sweeze in snapshots
  if(fm_start > fm_totalChannels){
    fm_start = 1;
  }
  
  for(i=fm_start,j=1;j<(fm_length+1);i++,j++){
	  var cid = "fm_" + j;
    var channel = content.document.getElementById(cid);
    var index = i%fm_totalChannels;
    
    if(index == 0) index = fm_totalChannels;
    
    channel.setAttribute("border","1");
    channel.setAttribute("src","chrome://webnnel/content/channels/ch_" + index + ".png");
    
    var title = content.document.getElementById(cid + "_title");
    title.innerHTML = index;
  }

}

function turnRight(){
  
  // Record which channel is located in the first frame
  fm_start = fm_start - 1;
  
  // Sweeze in snapshots
  if(fm_start <= 0){
    fm_start = fm_totalChannels;
  }
  
  for(i=fm_start,j=1;j<(fm_length+1);i++,j++){
	  var cid = "fm_" + j;
    var channel = content.document.getElementById(cid);
    var index = i%fm_totalChannels;
    
    if(index == 0) index = fm_totalChannels;
    
    channel.setAttribute("border","1");
    channel.setAttribute("src","chrome://webnnel/content/channels/ch_" + index + ".png");
    
    var title = content.document.getElementById(cid + "_title");
    title.innerHTML = index;
  }

}

/* CMM */

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
	var path = "C:\\Projects\\webnnel\\src\\channels\\";
  for(i=1; i<channels.length;i++){
    go(channels[i]);
    takeSnapshot(path, "ch_"+i+".png");
  }
}
