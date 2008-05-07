/**************************************************************************************************
 * Web Channel (Webnnel)
 * Channel Aggregation and Presentation (CAP)
 **************************************************************************************************/

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