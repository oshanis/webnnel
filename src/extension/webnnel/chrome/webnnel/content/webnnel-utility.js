
/**************************************************************************************************
 * Functions of link or button click
 **************************************************************************************************/

function clickLink(expression){
  var cWindow = getChromeWindowForNode(content.document.documentElement);
  var docs = getAllFrameDocs(content.document.documentElement);
  var pattern = expression;

  for(i=0;i<docs.length;i++){
  	
    var objs = docs[i].getElementsByTagName("A");
    for(j=0;j<objs.length;j++){
      if(pattern.exec(objs[j].innerHTML)!=null){
        highlightThenDo(objs[j], function(){goToUrl(wn_getBrowser(cWindow), objs[j].href, null);});
        return;
      }
    }
   
    var spans = docs[i].getElementsByTagName("SPAN");
    for(k=0;k<spans.length;k++){
      if(pattern.exec(spans[k].innerHTML)!=null){
        highlightThenDo(spans[k], function(){goToUrl(wn_getBrowser(cWindow), spans[k].parentNode, null);});
        return;
      }
    }
  }
}

function clickButton(expression){
  var cWindow = getChromeWindowForNode(content.document.documentElement);
  var docs = getAllFrameDocs(content.document.documentElement);
  var pattern = expression;

  for(i=0;i<docs.length;i++){
    var objs = docs[i].getElementsByTagName("INPUT");
    for(j=0;j<objs.length;j++){
      if(pattern.exec(objs[j].value)!=null){
        highlightThenDo(objs[j],null);
        objs[j].click();
      }
    }
  }
}

function wn_getBrowser(chromeWindow) {
  chromeWindow = getWindowRoot(chromeWindow);
  var tabBrowser = chromeWindow.document.getElementById("content");
  return tabBrowser.selectedBrowser;
}

function waitForPageToLoad(browser, thenDoThis) {
  var chrome = browser.ownerDocument.defaultView.parent;
  var handler = function(e) {
      if (e.originalTarget == browser.contentDocument) {
          chrome.removeEventListener("load", handler, true);
          thenDoThis();
      }
  }
  chrome.addEventListener("load", handler, true);
}

function goToUrl(browser, url, thenDoThis) {
  browser.loadURI(url);
  waitForPageToLoad(browser, thenDoThis);
}

function listWindows() {
  var windows = [];
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
  var e = wm.getEnumerator(null);
  while (e.hasMoreElements()) {
      var w = e.getNext();
      windows.push(w);
  }
  return windows;
}

function getChromeWindowForWindow(win) {
  while (win != win.parent) {
      win = win.parent;
  }
  if (win.wrappedJSObject) {
      win = win.wrappedJSObject;
  }
  
  var chromeWindows = listWindows();
  for (var i = 0; i < chromeWindows.length; i++) {
      var chromeWindow = chromeWindows[i];
      if (chromeWindow == win) {
          return chromeWindow;
      }
      var frames = chromeWindow.frames;
      for (var ii = 0; ii < frames.length; ii++) {
          var frame = frames[ii];
          if (frame == win) {
              return chromeWindow;
          }
      }
  }
}

function getChromeWindowForNode(node) {
  return getChromeWindowForWindow(node.ownerDocument.defaultView);
}

function getWindowRoot(win) {
  while (win != win.parent) {
      win = win.parent;
  }
  return win;
}

function getChromeWindowForNode(node) {
  return getChromeWindowForWindow(node.ownerDocument.defaultView);
}

function getAllFrameDocs(doc){
  var docs = [];
  traverseDoc(doc);
  return docs;
  
  function traverseDoc(doc){
    if(!doc) return;
    docs.push(doc);
    traverseFrames(doc.getElementsByTagName("frame"));
    traverseFrames(doc.getElementsByTagName("iframe"));
  }
  
  function traverseFrames(frames){
    for(var i=0;i<frames.length;i++){
      traverseDoc(frames[i].contentDocument);
    }
  }
}

/**************************************************************************************************
 * Create Shinning Effect
 **************************************************************************************************/

var shiningColor = "green";

function highlightThenDo(item, doThis) {
  var window = item.ownerDocument.defaultView;
  if (item.tagName == "OPTION") {
      item = item.parentNode;
  }
  
  var scrolled = ensureVisible(item);
  var pos = getNodePosition(item);
  var div;
  var div2;
  var o = 1;
  
  try {
      div = createDiv(item, pos.x, pos.y, pos.w, pos.h, 1, shiningColor);
      div2 = createDiv(item, pos.x, pos.y, pos.w, pos.h, 0.5, shiningColor);
  } catch (e) {}
  
  window.setTimeout(function() {
      for (var i = 1; i <= 10; i++) {
          var inc = 3;
          window.setTimeout(function () {
              pos.x -= inc;
              pos.y -= inc;
              pos.w -= -2 * inc;
              pos.h -= -2 * inc;
              o /= 1.45;
              
              try {
                  setDivStyle(div, pos.x, pos.y, pos.w, pos.h, o, shiningColor);
              } catch (e) {}
          }, i * 25)
      }
      window.setTimeout(function () {
          try {
              div.parentNode.removeChild(div);
              div2.parentNode.removeChild(div2);
          } catch (e) {}
          if (doThis != undefined) {
              doThis();
          }
      }, (10 + 2) * 25);
  }, scrolled ? 500 : 0);
}

function ensureVisible(node) {
  var doc = node.ownerDocument;
  var window = doc.defaultView;
  var pos = getNodePosition(node);
  
  var x = window.scrollX;
  var y = window.scrollY;
  var w = window.innerWidth;
  var h = window.innerHeight;
  
  var margin = 100;
  var scrolled = false;
  
  if (pos.x < x) {
      scrolled = true;
      x = pos.x - margin;
  }
  if (pos.x + pos.w > x + w) {
      scrolled = true;
      x = pos.x + margin + pos.w - w;
  }
  if (pos.y < y) {
      scrolled = true;
      y = pos.y - margin;
  }
  if (pos.y + pos.h > y + h) {
      scrolled = true;
      y = pos.y + margin + pos.h - h;
  }
  
  window.scrollTo(x, y);
  return scrolled;
}

function getNodePosition(node) {
  var pos = {};
  if ("offsetLeft" in node) {
      pos.x = node.offsetLeft;
      pos.y = node.offsetTop;
      pos.w = node.offsetWidth;
      pos.h = node.offsetHeight;
      if (node.offsetParent != null) {
          var parentPos = getNodePosition(node.offsetParent);
          pos.x += parentPos.x;
          pos.y += parentPos.y;
      }
  } else if (node.parentNode != null) {
      pos = getNodePosition(node.parentNode);
  } else {
      pos.x = 0;
      pos.y = 0;
      pos.w = 0;
      pos.h = 0;
  }
  return pos;
}

function createDiv(doc, x, y, w, h, o, color) {
  if (!doc.documentElement) {
      doc = doc.ownerDocument;
  }
  
  var div = doc.createElement("DIV");
  setDivStyle(div, x, y, w, h, o, color);
  doc.documentElement.appendChild(div);
  return div;
}

function setDivStyle(div, x, y, w, h, o, color) {
  if (color == undefined) {
      color = shiningColor;
  }
  div.style.position = "absolute";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.width = w + "px";
  div.style.height = h + "px";
  div.style.backgroundColor = color;
  div.style.opacity = o;
  div.style.zIndex = 100;
}

/**************************************************************************************************
 * Attach, Show or Hide the number tag to the elements
 **************************************************************************************************/

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
