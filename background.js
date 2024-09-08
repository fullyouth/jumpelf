chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  chrome.storage.sync.get(['mappings'], function(result) {
    let browserUrl = decodeURIComponent(details.url)
    console.log('-----', result)
    console.log('-----browserUrl', browserUrl)
    const mappings = result.mappings || {};
    for (const command in mappings) {
      if (browserUrl.includes(command)) {
        chrome.tabs.update(details.tabId, {
          url: mappings[command].url
        });
        break;
      }
    }
  });
});