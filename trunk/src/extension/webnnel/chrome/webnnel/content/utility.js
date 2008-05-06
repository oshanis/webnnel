
urlRegex = /(((ht|f)tp(s?))\:\/\/)?([a-zA-Z0-9\-\@\:]+\.)+(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\/[a-zA-Z0-9\.\,\;\?\'\\\+&%\$#\=~_\-]*)*/

function arrayBeginsWith(array, beginsWith) {
    for (var i = 0; i < beginsWith.length; i++) {
        if (i >= array.length || array[i] != beginsWith[i]) {
            return false
        }
    }
    return true
}

function hash(hashMe, algorithmName) {
    if (!algorithmName) {
        algorithmName = "SHA1"
    }
    
    var stringStream = Components.
        classes["@mozilla.org/io/string-input-stream;1"].
        createInstance(Components.interfaces.nsIStringInputStream)
    var hasher = Components.
        classes["@mozilla.org/security/hash;1"].
        getService(Components.interfaces.nsICryptoHash)
    var PR_UINT32_MAX = 4294967295
    
    stringStream.setData(hashMe, -1)
    hasher.initWithString(algorithmName)
    hasher.updateFromStream(stringStream, PR_UINT32_MAX)
    return hasher.finish(true)
}

function isInMainBrowser(mainWindow, node) {
    var doc = node
    if (doc.ownerDocument) {
        doc = doc.ownerDocument
    }
    if (doc.wrappedJSObject) {
        doc = doc.wrappedJSObject
    }
    return getBrowserDocument(mainWindow) == doc
}

function boxNode(node, color) {
    if (!color) {
        color = "red"
    }
    
    var pos = getNodePosition(node)
    var doc = node.ownerDocument
    var div = doc.createElement("DIV")
    div.appendChild(createDiv(doc, pos.x - 2, pos.y - 2, 2, pos.h + 4, 1.0, color))
    div.appendChild(createDiv(doc, pos.x, pos.y - 2, pos.w, 2, 1.0, color))
    div.appendChild(createDiv(doc, pos.x + pos.w, pos.y - 2, 2, pos.h + 4, 1.0, color))
    div.appendChild(createDiv(doc, pos.x, pos.y + pos.h, pos.w, 2, 1.0, color))
    div.setAttribute("GregsBoxAroundNode", "true")
    doc.documentElement.appendChild(div)
    return div
}

function boxNodes(nodes, nodeColor, borderColor) {
    if (nodes.length == 0) {
        return
    }
    
    var doc = nodes[0].ownerDocument
    var div = doc.createElement("DIV")
    var bigPos = {}
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i]
        
        var pos = getNodePosition(n)
        div.appendChild(createDiv(doc, pos.x - 2, pos.y - 2, 2, pos.h + 4, 1.0, nodeColor))
        div.appendChild(createDiv(doc, pos.x, pos.y - 2, pos.w, 2, 1.0, nodeColor))
        div.appendChild(createDiv(doc, pos.x + pos.w, pos.y - 2, 2, pos.h + 4, 1.0, nodeColor))
        div.appendChild(createDiv(doc, pos.x, pos.y + pos.h, pos.w, 2, 1.0, nodeColor))
        
        pos.x2 = pos.x + pos.w
        pos.y2 = pos.y + pos.h
        
        if (!bigPos.x || pos.x < bigPos.x) bigPos.x = pos.x
        if (!bigPos.y || pos.y < bigPos.y) bigPos.y = pos.y
        if (!bigPos.x2 || pos.x2 > bigPos.x2) bigPos.x2 = pos.x2
        if (!bigPos.y2 || pos.y2 > bigPos.y2) bigPos.y2 = pos.y2
    }
    
    var pos = bigPos
    pos.w = pos.x2 - pos.x
    pos.h = pos.y2 - pos.y
    div.appendChild(createDiv(doc, pos.x - 4, pos.y - 4, 2, pos.h + 8, 1.0, borderColor))
    div.appendChild(createDiv(doc, pos.x - 2, pos.y - 4, pos.w + 4, 2, 1.0, borderColor))
    div.appendChild(createDiv(doc, pos.x + pos.w + 2, pos.y - 4, 2, pos.h + 8, 1.0, borderColor))
    div.appendChild(createDiv(doc, pos.x - 2, pos.y + pos.h + 2, pos.w + 4, 2, 1.0, borderColor))
    
    div.setAttribute("GregsBoxAroundNode", "true")
    doc.documentElement.appendChild(div)
    return div
}

function stableSort(array, sortFunc) {
    for (var i = 0; i < array.length; i++) {
        stableSort_helper_binaryInsertion(array, 0, i, array.splice(i, 1)[0], sortFunc)
    }
}
function stableSort_helper_binaryInsertion(array, start, end, element, sortFunc) {
    if (start == end) {
        array.splice(start, 0, element)
        return
    }
    var i = start + randomIndex(end - start)
    if (sortFunc(element, array[i]) >= 0) {
        stableSort_helper_binaryInsertion(array, i + 1, end, element, sortFunc)
    } else {
        stableSort_helper_binaryInsertion(array, start, i, element, sortFunc)
    }
}

function inSet(set, element) {
    for (var i in set) {
        var a = set[i]
        if (a == element) {
            return true
        }
    }
    return false
}

function goodString(s) {
    return s && s.match(/\S/)
}

function getDomainName(url) {
    if (url.match(/^(((ht|f)tp(s?))\:\/\/)?([^\/]*)/)) {
        var a = RegExp.$5
        if (a.match(/([^\.]+)\.[^\.]+$/)) {
            return RegExp.$1
        }
    }
}

function escapeRegexQuote(s) {
    return regexQuote(s)
}

function regexQuote(s) {
    return s.replace(/([-\.\+\*\?\\\[\]\(\)\|\^\$\{\}])/g, "\\$1")
}

function removeNode(node) {
    node.parentNode.removeChild(node)
}

function getRandomHexDigit() {
    var digit = randomIndex(16)
    if (digit < 10) {
        return "" + digit
    } else {
        return String.fromCharCode("a".charCodeAt(0) + (digit - 10))
    }
}

function randomString() {
    return getRandomHexString(8)
}

function getRandomHexString(length) {
    var s = []
    for (var i = 0; i < length; i++) {
        s.push(getRandomHexDigit())
    }
    return s.join("")
}

function getRandomHexStrings(lengths) {
    var list = []
    for (var i = 0; i < lengths.length; i++) {
        list.push(getRandomHexString(lengths[i]))
    }
    return list
}

function getRandomGuid() {
    return "{" + getRandomHexStrings([8, 4, 4, 4, 12]).join("-") + "}"
}

function getChromeWindowForWindow(win) {
    while (win != win.parent) {
        win = win.parent
    }
    if (win.wrappedJSObject) {
        win = win.wrappedJSObject
    }
    
    var chromeWindows = listWindows()
    for (var i = 0; i < chromeWindows.length; i++) {
        var chromeWindow = chromeWindows[i]
        if (chromeWindow == win) {
            return chromeWindow
        }
        var frames = chromeWindow.frames
        for (var ii = 0; ii < frames.length; ii++) {
            var frame = frames[ii]
            if (frame == win) {
                return chromeWindow
            }
        }
    }
}

function getChromeWindowForNode(node) {
    return getChromeWindowForWindow(node.ownerDocument.defaultView)
}

function trimArrayToSize(array, size) {
    if (array.length > size) {
        array.splice(size, array.length - size)
    }
}

function createDocument() {
    var doc = Components.classes["@mozilla.org/xml/xml-document;1"].
        createInstance(Components.interfaces.nsIDOMDocument)
    var body = doc.createElement("body")
    doc.appendChild(body)
    return doc
}

function getAllNodes(doc) {
    if (doc.documentElement) {
        doc = doc.documentElement
    }
    
    var allNodes = []
    getAllNodes_Helper(doc, allNodes)
    return allNodes
}

function getAllNodes_Helper(node, allNodes) {
    if (node) {
        allNodes.push(node)
        getAllNodes_Helper(node.firstChild, allNodes)
        getAllNodes_Helper(node.nextSibling, allNodes)
    }
}

var stopWords = {
    "your" : 1,
    "of" : 1,
    "in" : 1,
    "on" : 1,
}

function Ident(string) {
    if (!string) {
        string = ""
    }
    this.string = string
    this.tokens = []
    this.tokenLocations = []
    RegExp.lastIndex = 0
    var a
    
    //~ while (a = /([^.\s]+\.\S+|[a-z]+|[A-Z]+[a-z]*|[0-9]+|\S)\s*/ig.exec(string)) {
    while (a = /([a-z]+|[A-Z]+[a-z]*|[0-9]+|\S)\s*/ig.exec(string)) {
        var token = a[1].toLowerCase()
        this.tokens.push(token)
        this.tokenLocations.push({
            start : RegExp.leftContext.length,
            end : (RegExp.leftContext.length + token.length),
        })
    }
    this.set = makeSet(this.tokens)
    
    this.score = function(that, wordsUsed) {
        var score = 0
        for (var word in this.set) {
            var thisScore = 0
            if (word.length > 1 && !stopWords[word]) {
                thisScore = bagGet(that.set, word)
            } else {
                thisScore = bagGet(that.set, word) * 0.001
            }
            score += thisScore
            if (wordsUsed && (thisScore > 0.2)) {
                wordsUsed[word] = 1
            }
        }
        score -= 0.01 * this.tokens.length
        return score
    }
    
    this.leftOver = function(startToken, endToken, insertString) {
        return this.subString(0, startToken) + insertString + this.subString(endToken, this.tokens.length)
    }
    
    this.subString = function(startToken, endToken) {
        if (startToken == endToken) {
            return ""
        } else {
            return this.string.substring(
                this.tokenLocations[startToken].start,
                this.tokenLocations[endToken - 1].end)
        }
    }
}

function isWindowLoaded(win) {
    // work here : think of a better way (this works in all cases except windows which actually have the title "")
    return win.title != ""
}

function mostRecentWindow() {
    var windows = listWindows()
    return windows[windows.length - 1]
}

function getTopWindow(ofType) {
    // ofType is optional, see http://www.xulplanet.com/references/xpcomref/ifaces/nsIWindowMediator.html#method_getMostRecentWindow
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator)
    return wm.getMostRecentWindow(ofType)
}

function listWindowsFrontToBack() {
    var windows = []
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator)
    var e = wm.getZOrderDOMWindowEnumerator(null, true)
    while (e.hasMoreElements()) {
        var w = e.getNext()
        windows.push(w)
    }
    return windows
}

function listWindows() {
    var windows = []
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator)
    var e = wm.getEnumerator(null)
    while (e.hasMoreElements()) {
        var w = e.getNext()
        windows.push(w)
    }
    return windows
}

function injectHtmlTextHighlight(node, start, end, injectMe) {
    var document = node.ownerDocument
    var startIndex = 0
    var nodes = getNodes(".//text()", node)
    for (var i in nodes) {
        node = nodes[i]
        
        var string = node.textContent
        var s = startIndex
        var e = s + string.length
        if (s < end && e > start) {
            if (s < start) s = start
            if (e > end) e = end
            s -= startIndex
            e -= startIndex
            
            var parent = node.parentNode
            function add(a) {
                if (a != null && a.length > 0) {
                    parent.insertBefore(document.createTextNode(a), node)
                }
            }
            
            add(string.substring(0, s))
            var clone = injectMe.cloneNode(true)
            clone.appendChild(document.createTextNode(string.substring(s, e)))
            parent.insertBefore(clone, node)
            add(string.substring(e, string.length))
            parent.removeChild(node)
        }
        
        startIndex += string.length
    }
}

function randomIndex(size) {
    return Math.floor(Math.random() * size);
}
function getRandomLetter() {
    return String.fromCharCode("a".charCodeAt(0) + randomIndex(26))
}
function getRandomString(length) {
    var s = []
    for (var i = 0; i < length; i++) {
        s.push(getRandomLetter())
    }
    return s.join("")
}

function getParentNamed(node, name) {
    return getAncestorNamed(node, name)
}

function getAncestorNamed(node, name) {
    while (node) {
        if (node.nodeName == name) {
            return node
        }
        node = node.parentNode
    }
}

function test(a) {
    return "test succeeded1!"
}

function list(obj) {
    var s = ""
    for (var key in obj) {
        s += " : " + key
    }
    return s
}

function indexOf(array, element) {
	for (var k in array) {
		var e = array[k]
		if (e == element) {
			return k
		}
	}
	return null
}

function cloneArray(array) {
    return array.slice(0, array.length)
}

function repeatString(s, times) {
	var newString = ""
	for (var i = 0; i < times; i++) {
		newString += s
	}
	return newString
}

function pretty(o, maxDepth) {
    var blackList = []
    var whiteList = []
    cycleHelper(o, blackList, whiteList, 0, maxDepth)
    return prettyHelper(o, 0, [], whiteList, 0, maxDepth)
}
function cycleHelper(o, blackList, whiteList, depth, maxDepth) {
    if (maxDepth != null && depth > maxDepth) {
        return
    }

	if (typeof o == "object") {
		var index = indexOf(blackList, o)
		if (index) {
            whiteList.push(o)
            return
		} else {
            blackList.push(o)
		}
        
        if (!o.nodeName) {
            for (var k in o) {
                cycleHelper(o[k], blackList, whiteList, depth + 1, maxDepth)
            }
        }
	}
}
function prettyHelper(o, indent, blackList, whiteList, depth, maxDepth) {
    if (maxDepth != null && depth > maxDepth) {
        return "MAX DEPTH\n"
    }

	var s = ""
	var type = typeof o
    if (o == null) {
        return "null\n";
    } else if (type == "object") {
		var blackIndex = indexOf(blackList, o)
        var whiteIndex = indexOf(whiteList, o)        
		if (blackIndex) {
			return "{ __" + whiteIndex + "__ ... } \n"
		} else {
            blackList.push(o)
        }

		indent++
		s += "{ " + (whiteIndex ? "__" + whiteIndex + "__" : "") + "\n"
        if (!o.nodeName || !o.attributes) {
            for (var k in o) {
                s += repeatString("\t", indent)
                s += k + " = "
                s += prettyHelper(o[k], indent, blackList, whiteList, depth + 1, maxDepth)
            }
        } else {
            s += repeatString("\t", indent) + "skipping node...\n"
        }
		indent--
		s += repeatString("\t", indent)
		s += "}\n"
    } else if (type == "function") {
        s += "function (...) { ... }\n"
	} else {
		s += o + "\n"
	}
	return s
}

// reads a file into a string
function slurp(file) {
    var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].
        createInstance(Components.interfaces.nsIFileInputStream)
    var streamHelper = Components.classes["@mozilla.org/scriptableinputstream;1"].
        createInstance(Components.interfaces.nsIScriptableInputStream)
    try {
        inputStream.init(file, 1, 0, false);
        streamHelper.init(inputStream);
        var contentsBuffer = []
        while (streamHelper.available() > 0) {
            contentsBuffer.push(streamHelper.read(streamHelper.available()))
        }
        streamHelper.close()
        inputStream.close()
        return contentsBuffer.join("")
    } catch (e) {
    }
}

function parseXml(xml) {
    var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"].
        getService(Components.interfaces.nsIDOMParser)
    return domParser.parseFromString(xml, "text/xml")
}

function domToString(dom) {
    var serializer = Components.classes["@mozilla.org/xmlextras/xmlserializer;1"].
        createInstance(Components.interfaces.nsIDOMSerializer)
    return serializer.serializeToString(dom)
}

function saveString(file, s) {
    var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
        createInstance(Components.interfaces.nsIFileOutputStream)
    outputStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0)
    outputStream.write(s, s.length)
    outputStream.close()
}

//~ function getExtensionPath(extensionName) {
    //~ var chromeRegistry = Components.
        //~ classes["@mozilla.org/chrome/chrome-registry;1"].
        //~ getService(Components.interfaces.nsIChromeRegistry);
    //~ var uri = Components.
        //~ classes["@mozilla.org/network/standard-url;1"].
        //~ createInstance(Components.interfaces.nsIURI);
    //~ uri.spec = "chrome://" + extensionName + "/content/";
    
    //~ var path = chromeRegistry.convertChromeURL(uri);
    //~ return unescape(path.spec)
//~ }

//~ function getFile(filename) {
    //~ return Components.
        //~ classes["@mozilla.org/network/protocol;1?name=file"].
        //~ getService(Components.interfaces.nsIFileProtocolHandler).
        //~ getFileFromURLSpec(filename)
//~ }

function getProfileFile(filename) {
    var file = Components.classes["@mozilla.org/file/directory_service;1"]
        .getService(Components.interfaces.nsIProperties)
        .get("ProfD", Components.interfaces.nsIFile);
    file.append(filename)
    return file
}

// makeSidebarOpen(chromeWindow, "chrome://koala-wikiproc-prototype/content/sidebar.xul", "view-koala-wikiproc-prototype-sidebar")
function makeSidebarOpen(chromeWindow, xulUrl, toggleViewId, thenDoThis) {
    if (!isThisSidebarOpen(chromeWindow, xulUrl)) {
        var sidebar = getSidebar(chromeWindow)
        var handler = function() {
            sidebar.removeEventListener("load", handler, true)
            thenDoThis()
        }
        sidebar.addEventListener("load", handler, true)
        chromeWindow.toggleSidebar(toggleViewId)
    } else {
        thenDoThis()
    }
}

// isThisSidebarOpen(chromeWindow, "chrome://koala-wikiproc-prototype/content/sidebar.xul")
function isThisSidebarOpen(chromeWindow, xulUrl) {
    if (isSidebarOpen(chromeWindow)) {
        return getSidebar(chromeWindow).getAttribute("src") == xulUrl
    } else {
        return false
    }
}

function isSidebarOpen(chromeWindow) {
    try {
        getSidebar(chromeWindow).contentDocument
        return true
    } catch (e) {
        return false
    }
}

function getSidebar(chromeWindow) {
    return chromeWindow.document.getElementById("sidebar")
}

function trim(string) {
    return string.replace(/^\s*|\s*$/g, "")
}

function getDocument(thing) {
    if (thing.documentElement) return thing
    if (thing.ownerDocument) return thing.ownerDocument
    if (thing.document) return thing.document
    if (thing.contentDocument) return thing.contentDocument
}

function getNodesRec(xpath, root) {
    var doc = getDocument(root)
    var nodes = []
    getNodesRecHelper(xpath, doc, nodes)
    return nodes
}

function getNodesRecHelper(xpath, root, nodes) {
    getNodesHelper(xpath, root, nodes)
    
    var frames = getNodes("//iframe | //frame", root)
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i]
        var doc = frame.contentDocument
        
        getNodesRecHelper(xpath, doc, nodes)
    }
}

function getNode(xpath, root) {
    return getNodes(xpath, root)[0]
}

function getNodes(xpath, root) {
    var nodes = []
    getNodesHelper(xpath, root, nodes)
    return nodes
}

function getNodesHelper(xpath, root, nodes) {
    var it = getDocument(root).evaluate(xpath, root, null, 0, null)
    var node
    while (node = it.iterateNext()) {
        nodes.push(node)
    }
}

function post(url, variables) {
    var h = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance()
    h.open("POST", url, false)
    h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    var vars = []
    for (var v in variables) {
        vars.push(v + "=" + escape(variables[v]))
    }
    h.send(vars.join("&"))
    return h.responseText
}

function loadWebPage(url) {
    var h = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance()
    h.open("get", url, false)
    h.send("")
    return h.responseText
}

function loadWebPageXml(url) {
    var h = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance()
    h.overrideMimeType("text/xml");
    h.open("get", url, false)
    h.send("")
    return h.responseXML
}

function safeLength(array) {
    if (array) {
        return array.length
    } else {
        return 0
    }
}

function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

function nextNode(node) {
    if (node && node.firstChild) {
        return node.firstChild
    } else {
        while (node && !node.nextSibling) {
            node = node.parentNode
        }
        if (node) {
            return node.nextSibling
        }
    }
}

function previousNode(node) {
    if (node.previousSibling) {
        node = node.previousSibling
        while (node.lastChild) {
            node = node.lastChild
        }
        return node
    } else {
        return node.parentNode
    }
}

function getChild(node, i) {
    for (var child = node.firstChild; child; child = child.nextSibling) {
        if (i == 0) {
            return child
        } else {
            i--
        }
    }
}

function random(max) {
    if (max) {
        return Math.floor(Math.random() * max)
    } else {
        return Math.random()
    }
}

function makeSet(array) {
    var set = {}
    for (var i = 0; i < array.length; i++) {
        set[array[i]] = 1
    }
    return set
}

function getTime() {
    return new Date().getTime()
}

function ProfileEntry() {
    this.lastStartTime = -1
    this.timeAccum = 0
    
    this.begin = function() {
        this.lastStartTime = getTime()
    }
        
    this.end = function() {
        this.timeAccum += getTime() - this.lastStartTime
        this.lastStartTime = -1
    }
        
    this.seconds = function() {
        return this.timeAccum / 1000
    }
}

profileEntries = {}
profileCounts = {}

function profileClear() {
    profileEntries = {}
    profileCounts = {}
}

function profileCount(tag) {
    bagInc(profileCounts, tag)
}

function profile(tag) {
    var pe = profileEntries[tag];
    if (!pe) {
        pe = new ProfileEntry()
        profileEntries[tag] = pe
    }
    
    if (pe.lastStartTime < 0) {
        pe.begin()
    } else {
        pe.end()
    }
}

function profileStart(tag) {
    profileBegin(tag)
}
function profileBegin(tag) {
    var pe = profileEntries[tag]
    if (!pe) {
        pe = new ProfileEntry()
        profileEntries[tag] = pe
    }
    pe.begin()
}

function profileStop(tag) {
    profileEnd(tag)
}
function profileEnd(tag) {
    var pe = profileEntries[tag]
    if (!pe) {
        pe = new ProfileEntry()
        profileEntries[tag] = pe
    }
    pe.end()
}
    
function profileToString() {
    var buf = []
    for (var tag in profileEntries) {
        var pe = profileEntries[tag]
        buf.push(tag + ": " + pe.seconds() + "\n");
    }
    for (var tag in profileCounts) {
        buf.push(tag + ": " + bagGet(profileCounts, tag) + "\n");
    }
    return buf.join("")
}

function ensureVisible(node) {
    var doc = node.ownerDocument
    var window = doc.defaultView
    var pos = getNodePosition(node)
    
    var x = window.scrollX
    var y = window.scrollY
    var w = window.innerWidth
    var h = window.innerHeight
    
    var margin = 100
    var scrolled = false
    
    if (pos.x < x) {
        scrolled = true
        x = pos.x - margin
    }
    if (pos.x + pos.w > x + w) {
        scrolled = true
        x = pos.x + margin + pos.w - w
    }
    if (pos.y < y) {
        scrolled = true
        y = pos.y - margin
    }
    if (pos.y + pos.h > y + h) {
        scrolled = true
        y = pos.y + margin + pos.h - h
    }
    
    window.scrollTo(x, y)
    return scrolled
}

function getNodePosition(node) {
    var pos = {}
    if ("offsetLeft" in node) {
        pos.x = node.offsetLeft
        pos.y = node.offsetTop
        pos.w = node.offsetWidth
        pos.h = node.offsetHeight
        if (node.offsetParent != null) {
            var parentPos = getNodePosition(node.offsetParent)
            pos.x += parentPos.x
            pos.y += parentPos.y
        }
    } else if (node.parentNode != null) {
        pos = getNodePosition(node.parentNode)
    } else {
        pos.x = 0
        pos.y = 0
        pos.w = 0
        pos.h = 0
    }
    return pos
}

function setVisible(node, on) {
    node.style.visibility = (on) ? "visible" : "hidden"
}

function setDivStyle(div, x, y, w, h, o, color) {
    if (color == undefined) {
        color = "green"
    }
    div.style.position = "absolute"
    div.style.left = x + "px"
    div.style.top = y + "px"
    div.style.width = w + "px"
    div.style.height = h + "px"
    div.style.backgroundColor = color
    div.style.opacity = o
    div.style.zIndex = 100
}

function createDiv(doc, x, y, w, h, o, color) {
    if (!doc.documentElement) {
        doc = doc.ownerDocument
    }
    
    var div = doc.createElement("DIV")
    setDivStyle(div, x, y, w, h, o, color)
    doc.documentElement.appendChild(div)
    return div
}

function highlightNode(node, color) {
    if (node.tagName == "OPTION") {
        node = node.parentNode
    }
    
    if (!color) {
        color = "red"
    }
    
    var pos = getNodePosition(node)
    return createDiv(node, pos.x, pos.y, pos.w, pos.h, 0.5, color)
}

function highlightNodes(items, color) {
    for (var k in items) {
        highlightNode(items[k], color)
    }
}

function highlightThenDo(item, doThis) {
    var window = item.ownerDocument.defaultView
    if (item.tagName == "OPTION") {
        item = item.parentNode
    }
    
    var scrolled = ensureVisible(item)

    var pos = getNodePosition(item)

    var div
    var div2
    var o = 1
    
    try {
        div = createDiv(item, pos.x, pos.y, pos.w, pos.h, 1, "green")
        div2 = createDiv(item, pos.x, pos.y, pos.w, pos.h, 0.5, "green")
    } catch (e) {}
    
    window.setTimeout(function() {
        for (var i = 1; i <= 10; i++) {
            var inc = 3
            window.setTimeout(function () {
                pos.x -= inc
                pos.y -= inc
                pos.w -= -2 * inc
                pos.h -= -2 * inc
                o /= 1.45
                
                try {
                    setDivStyle(div, pos.x, pos.y, pos.w, pos.h, o, "green")
                } catch (e) {}
            }, i * 25)
        }
        window.setTimeout(function () {
            try {
                div.parentNode.removeChild(div)
                div2.parentNode.removeChild(div2)
            } catch (e) {}
            if (doThis != undefined) {
                doThis()
            }
        }, (10 + 2) * 25)
    }, scrolled ? 500 : 0)
}

function betterThenDoThis(window, thenDoThis) {
    window.setTimeout(function() {
        var browser = getBrowser(window)
        var webProgress = browser.webProgress
        if (webProgress.isLoadingDocument) {
            waitForPageToLoad(browser, thenDoThis)
        } else {
            thenDoThis()
        }
    }, 0)
}

function select(item, thenDoThis, yes) {
    var window = getChromeWindowForNode(item)
    if (yes == undefined) {
        yes = true
    }
    
    highlightThenDo(item, function() {
        if (item.tagName == "OPTION") {
            var change = item.selected != yes
            item.selected = yes
            if (change) {
                try {
                    var listbox = item.parentNode
                    if ("onchange" in listbox) {
                        listbox.onchange()
                    }
                } catch (er) {
                    if (Components.reportError) {
                        Components.reportError(er)
                    }
                }
            }
        } else {
            item.checked = yes
        }
        betterThenDoThis(window, thenDoThis)
    })
}

function deselect(item, thenDoThis) {
    select(item, thenDoThis, false)
}

function getSelected(item) {
    if (item.tagName == "OPTION") {
        return item.selected
    } else {
        return item.checked
    }
}

function toggle(item, thenDoThis) {
    turn(item, !getSelected(item), thenDoThis)
}

function turn(item, turnOn, thenDoThis) {
    if (turnOn) {
        select(item, thenDoThis)
    } else {
        deselect(item, thenDoThis)
    }
}

function click(item, thenDoThis) {
    var window = getChromeWindowForNode(item)
    highlightThenDo(item, function() {
        if (item.tagName == "A") {
            try {
                if ("onclick" in item) {
                    item.onclick();
                }
            } catch (er) {
                if (Components.reportError) {
                    Components.reportError(er);
                }
            }
            
            goToUrl(getBrowser(window), item.href, thenDoThis)
        } else {
            item.click()
            betterThenDoThis(window, thenDoThis)
        }
    })
}

function unfancy_appendText(string, textbox) {
    var s = textbox.value
    if (!s.match(/\n$/)) {
        s += "\n"
    }
    s += string
    textbox.value = s
}

function appendText(string, textbox, thenDoThis) {
    var window = getChromeWindowForNode(textbox)
    textbox.scrollTop = textbox.scrollHeight
    highlightThenDo(textbox, function() {
        unfancy_appendText(string, textbox)
        textbox.scrollTop = textbox.scrollHeight
        betterThenDoThis(window, thenDoThis)
    })
}

function enter(string, textbox, thenDoThis) {
    var window = getChromeWindowForNode(textbox)
    highlightThenDo(textbox, function() {
        textbox.value = string
        betterThenDoThis(window, thenDoThis)
    })
}

function clear(textbox, thenDoThis) {
    var window = getChromeWindowForNode(textbox)
    highlightThenDo(textbox, function() {
        textbox.value = ""
        betterThenDoThis(window, thenDoThis)
    })
}

function getWindowRoot(win) {
    while (win != win.parent) {
        win = win.parent
    }
    return win
}

function getBrowser(chromeWindow) {
    chromeWindow = getWindowRoot(chromeWindow)
    var tabBrowser = chromeWindow.document.getElementById("content")
    return tabBrowser.selectedBrowser
}

function getBrowserWindow(chromeWindow) {
    return getBrowser(chromeWindow).contentWindow
}

function getBrowserDocument(chromeWindow) {
    return getBrowser(chromeWindow).contentDocument
}

function waitForPageToLoad(browser, thenDoThis) {
    var chrome = browser.ownerDocument.defaultView.parent
    var handler = function(e) {
        if (e.originalTarget == browser.contentDocument) {
            chrome.removeEventListener("load", handler, true)
            thenDoThis()
        }
    }
    chrome.addEventListener("load", handler, true)
}

function goToUrl(browser, url, thenDoThis) {
    browser.loadURI(url)
    waitForPageToLoad(browser, thenDoThis);
}

function back(browser, thenDoThis) {
    if (browser.canGoBack) {
        browser.goBack()
        waitForPageToLoad(browser, thenDoThis);
    }
}

function forward(browser, thenDoThis) {
    if (browser.canGoForward) {
        browser.forward()
        waitForPageToLoad(browser, thenDoThis);
    }
}

function reload(browser, thenDoThis) {
    browser.reload()
    waitForPageToLoad(browser, thenDoThis);
}

function flatten(source) {
    var dest = []
    flattenHelper(source, dest)
    return dest
}

function flattenHelper(source, dest) {
    for (var i = 0; i < source.length; i++) {
        if (source[i] instanceof Array) {
            flattenHelper(source[i], dest)
        } else {
            dest.push(source[i])
        }
    }
}

function bagInc(map, entry, amount) {
    if (!amount) {
        amount = 1
    }
    map[entry] = bagGet(map, entry) + amount
}

function bagGet(map, entry) {
    var value = map[entry]
    return !value ? 0 : value
}

function getWebType(node) {
    if (node.nodeName == "A")               return "link"
    else if (node.nodeName == "SELECT")     return "listbox"
    else if (node.nodeName == "OPTION")     return "listitem"
    else if (node.nodeName == "BUTTON")     return "button"
    else if (node.nodeName == "TEXTAREA")   return "textbox"
    else {
        var t = node.getAttribute("type")
        if (t) {
            t = t.toLowerCase()
        }
        if (!t || t.length == 0)                                    return "textbox"
        else if (t == "submit" || t == "reset" || t == "button")    return "button"
        else if (t == "radio")                                      return "radiobutton"
        else if (t == "checkbox")                                   return "checkbox"
        else                                                        return "textbox"
    }
}

function getText(node, override) {
    var buf = []
    function myPush(text) {
        text = trim(text)
        if (text.length > 0) {
            buf.push(text)
        }
    }
    var document = node.ownerDocument
    it = document.evaluate(". | descendant::text() | .//*[@alt]", node, null, 0, null)
    while (node = it.iterateNext()) {
        if (override || (node.parentNode.nodeName != "OPTION" && node.parentNode.nodeName != "INPUT" && node.parentNode.nodeName != "TEXTAREA")) {
            if (node.nodeName == "#text") {
                myPush(node.textContent)
            } else {
                if (node.getAttribute("alt")) {
                    myPush(node.getAttribute("alt"))
                }
            }
        }
    }
    return trim(buf.join(" ").replace(/<!\-\-(\-[^-]|[^-])*\-\->/g, ""))
}

function getLabel(node, reverse) {
    if (reverse == null) {
        var a = getAncestorNamed(node, "INPUT")
        if (a) {
            var type = a.getAttribute("type")
            if (type) {
                type = type.toLowerCase()
                reverse = (type == "checkbox" || type == "radio")
            }
        }
    }

    if (node.parentNode.nodeName == "LABEL") {
        return getText(node.parentNode)
    }
    if (node.nextSibling && node.nextSibling.nodeName == "LABEL") {
        return getText(node.nextSibling)
    }
    var xpath = []
    for (var k in {"id" : 1, "name" : 1}) {
        var id = node.getAttribute(k)
        if (id) {
            xpath.push("@for='" + id + "' or @class='" + id + "'")
        }
    }
    if (xpath.length > 0) {
        xpath = xpath.join(" or ")
        var label = getNode("//label[" + xpath + "]", node.ownerDocument)
        if (label) {
            return getText(label)
        }
    }
    
    
    var type = getWebType(node)
    
    var text = getText(node, type == "listitem")
    if (goodString(text)) {
        return text
    }
    
    if (goodString(node.getAttribute("title"))) {
        return node.getAttribute("title")
    }

    var strictLabel = getLabelHelperStrict(node, reverse)
    if (strictLabel) {
        return strictLabel
    }
    
    if (goodString(node.getAttribute("value"))) {
        return node.getAttribute("value")
    }
    if (goodString(node.getAttribute("name"))) {
        return node.getAttribute("name")
    }
    
    var label = []
    
    if (type == "listitem") {
        label.push(node.parentNode.firstChild.textContent)
    }

    var text = getText(node, true)
    if (text.match(/\S/) && (type != "listbox") && (type != "textbox")) {
        label.push(text)
    } else {
        label.push(getLabelHelper(node, reverse))
    }
    if (type == "textbox" && node.defaultValue && node.defaultValue.length > 0) {
        label.push(node.defaultValue.length)
    }
    
    return label.join(" ")
}
var badLabelNodeNames = {"SCRIPT" : 1, "NOSCRIPT" : 1, "#comment" : 1}
function getLabelHelper(node, reverse) {
    var nextNode = reverse ? node.nextSibling : node.previousSibling
    if (nextNode) {
        var text = getText(nextNode)
        if (goodString(text) && !badLabelNodeNames[nextNode.nodeName]) {
            return text
        } else {
            return getLabelHelper(nextNode, reverse)
        }
    } else if (node.parentNode) {
        return getLabelHelper(node.parentNode, reverse)
    } else {
        return undefined
    }
}
var getLabelHelperStrict_whiteRegex = /^(\#text|B|BR|STRONG|BIG|EM|I|SMALL|SUB|SUP|IMG|FONT|H4|H3|H2|H1|TT|U|STRIKE|TT|DFN|CODE|SAMP|KBD|VAR|A|BASEFONT|LABEL)$/

function getLabelHelperStrict(node, reverse, maxDepth) {
    if (maxDepth == undefined) {
        maxDepth = 8
    }
    if (maxDepth <= 0) {
        return undefined
    }
    var nextNode = reverse ? node.nextSibling : node.previousSibling
    if (nextNode) {
        node = nextNode
    
        if (goodString(node.textContent)) {
            if (badLabelNodeNames[node.nodeName]) {
                return null
            }
        
            // first, make sure there is only white-listed nodes
            var nodes = getNodes(".//*", node)
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i]
                
                if (!n.nodeName.match(getLabelHelperStrict_whiteRegex)) {
                    return undefined
                }
            }
            
            return getText(node)
        } else {
            return getLabelHelperStrict(node, reverse, maxDepth - 1) // I realize this isn't strictly "depth", but this is what I want
        }
    } else if (node.parentNode) {
        return getLabelHelperStrict(node.parentNode, reverse, maxDepth - 1)
    } else {
        return undefined
    }
}

/******************************************************************************/

var global_this = this

const CLASS_ID    = Components.ID("{cd4656dc-507c-46cc-9135-987f3f58c708}");
const CLASS_NAME  = "my-util";
const CONTRACT_ID = "@koala.ibm.com/my-util/;1";

function MyService() {
  this.wrappedJSObject = global_this;
}


// The only interface we support is nsISupports.
// All the action happens through wrappedJSObject.
MyService.prototype.QueryInterface = function(iid) {
  if (!iid.equals(Components.interfaces.nsISupports))
    throw Components.results.NS_ERROR_NO_INTERFACE;
  return this;
}


/* gModule implements Components.interfaces.nsIModule */
var gModule = {

  //~ _firstTime : true,

  _factory : {
      createInstance: function (aOuter, aIID) {
        if (aOuter != null) throw Components.results.NS_ERROR_NO_AGGREGATION;
        return new MyService().QueryInterface(aIID);
      }
  },

  registerSelf: function(aCompMgr, aFileSpec, aLocation, aType) {
    //~ if (!this._firstTime) throw Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
    //~ this._firstTime = false;
    aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.registerFactoryLocation(CLASS_ID,
                                     CLASS_NAME,
                                     CONTRACT_ID,
                                     aFileSpec,
                                     aLocation,
                                     aType);
  },

  unregisterSelf: function(aCompMgr, aLocation, aType) {
    aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);        
  },
  
  getClassObject: function(aCompMgr, aCID, aIID) {
    if (!aIID.equals(Components.interfaces.nsIFactory)) {
      throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
    }
    if (aCID.equals(CLASS_ID)) {
      return this._factory;
    }
    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
  
};

function NSGetModule(aCompMgr, aFileSpec) { return gModule; }
