function clearHandler() {
 $('.dialfooter').empty();
}

function markHandler() {
$('.dialfooter').prepend('<hr style="height:5px;border-width:0;color:#AA0000;background-color:#AA0000">');
}

// Any hiding or unhiding of tag divs will happen here.
// For now we just allow filtering on SITE or whether the "Exclude Element Tags" checkbox is checked

function filterTags() {
  var thisSite = $('.sitefilter').val();
  var excludeElement = $('.excludeelement').is(':checked');

  console.log('Filter by site ' + thisSite);
  // Find all divs classed "datagrid" that DO NOT match the site, and hide them (unhide this site)
  $('.datagrid').each(function() {
    if ($(this).attr('site').indexOf(thisSite) != -1) {
      if ( excludeElement && $(this).attr('tagtype') == '15') {
        $(this).hide();
      } else {
        $(this).show();
      }
    } else {
      $(this).hide();
    }
 
  });
}



document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.clear').addEventListener('click', clearHandler);
});
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.mark').addEventListener('click', markHandler);
});
document.addEventListener('DOMContentLoaded', function () { 
  document.querySelector('.sitefilter').addEventListener('input', filterTags);
});
document.addEventListener('DOMContentLoaded', function () { 
  document.querySelector('.excludeelement').addEventListener('click', filterTags);
});


// Get current tabid and send it as a message to the background script. The background
// script NEEDs this in order to send messages to this script
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  chrome.extension.sendMessage({cmTagTabID: tabs[0].id}, function(response) {
    console.log(response);
  });
} );

var tid_hash = { 1: "Page View Tag",
                     2: "Registration Tag",
                     3: "Order Info Tag",
                     4: "Shop Tag",
                     5: "Product View Tag",
                     6: "Technical Properties Tag",
                     7: "Custom Details Tag",
                     8: "Link Click Tag",
                     9: "Link Impressions Tag",
                     10: "Form Action Tag",
                     14: "Conversion Event Tag",
                     15: "Element Tag",
                     404: "Error Tag" };


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var whichSite = request.destinationUrl.split('/')[2];
   $('.dialfooter').prepend(
      '<div class="datagrid" site="' + whichSite + '" tagtype="' + request.tagType + '"><table>' + 
      '<thead><tr><th colspan="2">' + tid_hash[request.tagType] + ' (tid "'+ request.tagType + '")' + ' (' + request.siteUrl + ')</th></tr></thead>' +
      '<tbody>'+ 
      (request.pageId ? '<tr><td width="100px">Page ID</td><td>' + request.pageId + '</td></tr>' : '') +
      (request.targetUrl ? '<tr><td width="100px">Target HREF/URL</td><td>' + request.targetUrl + '</td></tr>' : '') +
      (request.clientId ? '<tr><td width="100px">Client ID</td><td>' + request.clientId + '</td></tr>' : '') +
      (request.category ? '<tr><td width="100px">Category ID</td><td>' + request.category + '</td></tr>' : '') +
      (request.libraryVersion ? '<tr><td width="100px">Library Version</td><td>' + request.libraryVersion + '</td></tr>' : '') +
      (request.conversionId ? '<tr><td width="100px">Conversion Event ID</td><td>' + request.conversionId + '</td></tr>' : '') +
      (request.conversionAction ? '<tr><td width="100px">Conversion Action Type</td><td>' + request.conversionAction + '</td></tr>' : '') +
      (request.conversionCat ? '<tr><td width="100px">Conversion Category ID</td><td>' + request.conversionCat + '</td></tr>' : '') +
      (request.conversionPoints ? '<tr><td width="100px">Conversion Event Points</td><td>' + request.conversionPoints + '</td></tr>' : '') +
      (request.productId ? '<tr><td width="100px">Product ID</td><td>' + request.productId + '</td></tr>' : '') +
      (request.productName ? '<tr><td width="100px">Product Name</td><td>' + request.productName + '</td></tr>' : '') +
      (request.quantity ? '<tr><td width="100px">Quantity</td><td>' + request.quantity + '</td></tr>' : '') +
      (request.basePrice ? '<tr><td width="100px">Base Price</td><td>' + request.basePrice + '</td></tr>' : '') +
      (request.slotNumber ? '<tr><td width="100px">Slot Number</td><td>' + request.slotNumber + '</td></tr>' : '') +
      (request.actionType ? '<tr><td width="100px">Action Type</td><td>' + request.actionType + '</td></tr>' : '') +
      (request.at1 ? '<tr><td width="100px">Attribute 1 (Explore)</td><td>' + request.at1 + '</td></tr>' : '') +
      (request.at2 ? '<tr><td width="100px">Attribute 2 (Explore)</td><td>' + request.at2 + '</td></tr>' : '') +
      (request.at3 ? '<tr><td width="100px">Attribute 3 (Explore)</td><td>' + request.at3 + '</td></tr>' : '') +
      (request.at4 ? '<tr><td width="100px">Attribute 4 (Explore)</td><td>' + request.at4 + '</td></tr>' : '') +
      (request.at5 ? '<tr><td width="100px">Attribute 5 (Explore)</td><td>' + request.at5 + '</td></tr>' : '') +
      (request.at6 ? '<tr><td width="100px">Attribute 6 (Explore)</td><td>' + request.at6 + '</td></tr>' : '') +
      (request.o_a1 ? '<tr><td width="100px">Attribute 1 (Explore)</td><td>' + request.o_a1 + '</td></tr>' : '') +
      (request.s1 ? '<tr><td width="100px">Attribute 1 (Explore)</td><td>' + request.s1 + '</td></tr>' : '') +
      (request.s2 ? '<tr><td width="100px">Attribute 2 (Explore)</td><td>' + request.s2 + '</td></tr>' : '') +
      (request.s3 ? '<tr><td width="100px">Attribute 3 (Explore)</td><td>' + request.s3 + '</td></tr>' : '') +
      (request.s4 ? '<tr><td width="100px">Attribute 4 (Explore)</td><td>' + request.s4 + '</td></tr>' : '') +
      (request.s5 ? '<tr><td width="100px">Attribute 5 (Explore)</td><td>' + request.s5 + '</td></tr>' : '') +
      (request.s6 ? '<tr><td width="100px">Attribute 6 (Explore)</td><td>' + request.s6 + '</td></tr>' : '') +
      (request.ps1 ? '<tr><td width="100px">Extra Field 1</td><td>' + request.ps1 + '</td></tr>' : '') +
      (request.ps2 ? '<tr><td width="100px">Extra Field 2</td><td>' + request.ps2 + '</td></tr>' : '') +
      (request.ps3 ? '<tr><td width="100px">Extra Field 3</td><td>' + request.ps3 + '</td></tr>' : '') +
      (request.ps4 ? '<tr><td width="100px">Extra Field 4</td><td>' + request.ps4 + '</td></tr>' : '') +
      (request.ps5 ? '<tr><td width="100px">Extra Field 5</td><td>' + request.ps5 + '</td></tr>' : '') +
      (request.ps6 ? '<tr><td width="100px">Extra Field 6</td><td>' + request.ps6 + '</td></tr>' : '') +
      (request.ps7 ? '<tr><td width="100px">Extra Field 7</td><td>' + request.ps7 + '</td></tr>' : '') +
      (request.ps8 ? '<tr><td width="100px">Extra Field 8</td><td>' + request.ps8 + '</td></tr>' : '') +
      (request.eid ? '<tr><td width="100px">Element ID</td><td>' + request.eid + '</td></tr>' : '') +
      (request.ecat ? '<tr><td width="100px">Element Category</td><td>' + request.ecat + '</td></tr>' : '') +
      (request.lineNumber ? '<tr><td width="100px">Line Number</td><td>' + request.lineNumber + '</td></tr>' : '') +
      (request.referralUrl ? '<tr><td width="100px">Referral Url</td><td>' + request.referralUrl + '</td></tr>' : '') +
      (request.cd ? '<tr><td width="100px">Customer ID</td><td>' + request.cd + '</td></tr>' : '') +
      (request.em ? '<tr><td width="100px">Email</td><td>' + request.em + '</td></tr>' : '') +
      (request.nl ? '<tr><td width="100px">Newsletter Name</td><td>' + request.nl + '</td></tr>' : '') +
      (request.sd ? '<tr><td width="100px">Subscribed Flag</td><td>' + request.sd + '</td></tr>' : '') +
      (request.destinationUrl ? '<tr><td width="100px">Destination Url</td><td>' + request.destinationUrl + '</td></tr>' : '') +

      '</tbody></table></div>'
    )
    filterTags();
  });
