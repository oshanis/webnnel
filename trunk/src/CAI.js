include("CMM.js");
include("CAP.js");

/*************************************************************************
 * APIs for Speech Command Extraction (SCE)
 *************************************************************************/

/* Navigation APIs */

function webnnel(){
  //Still need to check when to execute initializeChannel();
  document.location = "file:///C:/Projects/webnnel/src/webnnel.html";
  gridMode();
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
	document.location = channels[number];
}

function goBack(){
	history.back();
}

function goNext(){
	history.forward();
}

function scrollUP(){
	scroll("up");
}

function scrollDown(){
	scroll("down");
}

/* Content Access APIs */

function cleanPage(){
	do_cleanPage(document.documentElement);
}

function undo_cleanPage(){
  restore_cleanPage(document.documentElement);
}

function removeImage(){
	removeAllImages();
}

function undo_removeImage(){
	restore_removeAllImages();
}

function clickLink(keyword){
  click(find(keyword));  
}
/* Macro APIs */

function myEmail(){
	toMyEmail("http://gmail.com","webnnel","pwebnnel");
}

function logout(){
  click("Sign out");
}

function myNews(){
	document.location = "http://www.technologyreview.com/";
}

function Yahoo(){
	document.location = "http://www.yahoo.com/";
}

function CNN(){
	document.location = "http://www.cnn.com/";
}

/* Audio Command APIs */

function homepage(){
	var home = chromeWindow.document.getElementById('home-button');
  document.location = home.tooltipText;
}


// Used for testing turn left and right in frame mode
webnnel();
frameMode();
document.addEventListener("click",mouseclick,false);
function mouseclick(){
 right();
}