console.log('----------Coremetrics Tagbar for Chrome-----------');

// Create the window to do the tagging in
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.windows.create({
		type: 'popup',
		url: "tagwindow.html",
		top: 100,
		left: 100,
		width: 800,
		height: 760
	}, function (newWindow) {
		console.log(newWindow);
	});
});

var ourTabId;

// We need to receive the tabID for the new window that this extension creates to display the tag data.
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        // If the message contains a cmTagWindowID, it the one we were waiting for. This is our output window.
        if (request.cmTagTabID) {
            console.log('Display window registered with background script. Tab ID is ' +request.cmTagTabID);
            ourTabId = request.cmTagTabID;
        }
    } 
);

// Listen for HTTP requests. Assume a request with 'ci=' and 'tid=' is a coremetrics request
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    console.log('Request: ' + details.url);
    var siteUrl = details.url.split('/')[2];
    if (details.url.indexOf("ci=") != -1 && details.url.indexOf("tid=") != -1) {
     var queryString = {};
     
     var theseParams = details.url.split("?")[1];
     theseParams.split("&").forEach(function (pair) {
       if (pair === "") return;
       var parts = pair.split("=");
       //queryString[parts[0]] = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, " "));
       queryString[parts[0]] = unescape(parts[1]);
     }); 

      
      // Send a message about this tag...
      // This kind of evolved from a few to MANY attributes and now it's horrible.
      // Should probably just change to send all of queryString.
      if (ourTabId) {
        console.log("Sending a message to the tab " + ourTabId);

		var tabParams = {
            "siteUrl": siteUrl,
            "tagType": queryString['tid'] || '',  
            "clientId": queryString['ci'] || '',          
            "category": queryString['cg'] || '',
            "pageId": queryString['pi'] || '',
            "actionType": queryString['at'] || '',
            "referralUrl": queryString['rf'] || '',
            "destinationUrl": queryString['ul'] || '',
            "libraryVersion": queryString['vn1'] || '',
            "productId": queryString['pr'] || '',
            "productName": queryString['pm'] || '',
            "targetUrl": queryString['hr'] || '',
            "quantity": queryString['qt'] || '',
            "basePrice": queryString['bp'] || '',
            "slotNumber": queryString['sn'] || '',
            "ps1": queryString['ps1'] || '', 
            "ps2": queryString['ps2'] || '', 
            "ps3": queryString['ps3'] || '', 
            "ps4": queryString['ps4'] || '', 
            "ps5": queryString['ps5'] || '', 
            "ps6": queryString['ps6'] || '', 
            "ps7": queryString['ps7'] || '', 
            "conversionId": queryString['cid'] || '', 
            "conversionAction": queryString['cat'] || '', 
            "conversionCat": queryString['ccid'] || '', 
            "conversionPoints": queryString['cpt'] || '', 
            "lineNumber": queryString['li'] || '', 
            "eid": queryString['eid'] || '', 
            "ecat": queryString['ecat'] || '', 
            "cd": queryString['cd'] || '',
            "em": queryString['em'] || '',
            "nl": queryString['nl'] || '',
            "sd": queryString['sd'] || ''

          };

		// explore attributes for the different coremetrics tags
		// get all query parameters matching ..._a99 pattern - pv_a99, pr_a99, s_a99, o_a99, etc.
		var exploreAttributesPattern = /_a([\d]+)$/;
		var exploreAttributes = Object.keys(queryString).filter( function(element) {return exploreAttributesPattern.test(element)} );
		for (index=0; index<exploreAttributes.length; index++) { 
			attributeName = exploreAttributes[index];
			attributeNameIndex = exploreAttributesPattern.exec(attributeName)[1];
			tabParams[attributeName]=queryString[attributeName] || '';
		}

        chrome.tabs.sendMessage(ourTabId, tabParams, function(res){console.log(res);});  
      }
    
    }
   
 
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]);
