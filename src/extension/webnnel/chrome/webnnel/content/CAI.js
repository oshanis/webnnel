/**************************************************************************************************
 * Web Channel (Webnnel)
 * Command Abstraction Interface (CAP)
 **************************************************************************************************/

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

var curFormat = ""; //Global variable to record current applied method to the content

function applyReadMagic(){
	if(curFormat == "JF"){
    content.document.removeEventListener("click", jengaTrans, false);
	}
	
  content.document.addEventListener("click", readMagic, false);
  curFormat = "SSF";
}

function applyJenga(){
	if(curFormat == "SSF"){
	  content.document.removeEventListener("click", readMagic, false);
  }
  
  content.document.addEventListener("click", jengaTrans, false);
  curFormat = "JF";
}

function removeFormat(){
  if(curFormat == "SSF"){
    content.document.removeEventListener("click", readMagic, false);
  }else if(curFormat == "JF"){
  	content.document.removeEventListener("click", jengaTrans, false);
  }
  curFormat = "";
}

/* Audio Command APIs */

function homepage(){
	var home = chromeWindow.document.getElementById('home-button');
  content.document.location = home.tooltipText;
}
