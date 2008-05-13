
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

var pageShowNumTag;

function initWebnnelStatus(){
	
	//Initialize global variables
	curFormat = "";
	
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
  
  pageShowNumTag = false;
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
		  if(tokens[1] == "mode"){
		    frameMode();
		    right();
		  }
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
        preAction = "";
      }else if(preAction == "remove image"){
        undo_removeImage();
        preAction = "";
      }
  	  break;
    case "homepage":
      homepage();
      break;
    case "select":
      var index = stack[1];
      content.document.location = channels[index];
      break;

    /********************************************************
		 * Content Access Categories
		 ********************************************************/
  	case "clean":
      if(tokens[1] == "page"){
      	preAction = "clean page";
        cleanPage();
      }  
      break;
    case "click":
      var term = new RegExp(tokens[1],"i");
      clickLink(term);
      break;
    case "remove":
      if(tokens[1] == "image"){
      	preAction = "remove image";
        removeImage();
      }else if(tokens[1] == "format"){
        removeFormat();
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
    case "SSF":
      if(tokens[1] == "format"){
        applyReadMagic();
      }
      break;
    case "JF":
      if(tokens[1] == "format"){
        applyJenga();
      }
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
}

