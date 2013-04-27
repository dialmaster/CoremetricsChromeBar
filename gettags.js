console.log('----------Coremetrics Tagbar for Chrome-----------');

// Create the window to do the tagging in
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

var ourTabId;

// We need to receive the tabID for the new window that this extension creates to display the tag data.
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('Hey, the background script got a message!' +request.greeting);
        ourTabId = request.greeting;
    } 
);

// Listen for HTTP requests. Filter on eluminate and then send the data to our window
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    console.log('Request: ' + details.url);
    var siteUrl = details.url.split('/')[2];
    if (details.url.indexOf("ci=") != -1) {
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
          chrome.tabs.sendMessage(ourTabId, {
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
            "at1": queryString['pr_a1'] || '', 
            "at2": queryString['pr_a2'] || '', 
            "at3": queryString['pr_a3'] || '', 
            "at4": queryString['pr_a4'] || '', 
            "at5": queryString['pr_a5'] || '', 
            "at6": queryString['pr_a6'] || '',
            "s1": queryString['s_a1'] || '', 
            "s2": queryString['s_a2'] || '', 
            "s3": queryString['s_a3'] || '', 
            "s4": queryString['s_a4'] || '', 
            "s5": queryString['s_a5'] || '', 
            "s6": queryString['s_a6'] || '',
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
            "cd": queryString['cd'] || ''

          }, function(res){console.log(res);});  
      }
    
    }
   
 
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]);
