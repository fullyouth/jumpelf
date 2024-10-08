chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  chrome.storage.sync.get(['mappings'], function (result) {
    let browserUrl = decodeURIComponent(details.url)
    console.log('配置的映射---->', result)
    console.log('浏览器搜索框中的url----->', browserUrl)
    const currentItem = mappingStrategy(result, browserUrl)
    if (currentItem.url) {
      chrome.tabs.update(details.tabId, {
        url: currentItem.url
      });
    }
  });
});


/**
 * 1、如果直接相等，就命中
 * 2、open/task?taskid=111 url?taskid=111
 */
function mappingStrategy(result, browserUrl) {
  const mappings = result.mappings || {};
  // 使用path可以防止死循环，一直redirect
  let [path] = browserUrl.split(',')
  if (1 || browserUrl.startsWith('file:///open') || browserUrl.startsWith('file:///op')) {
    let params = {}
    try {
      params = getUrlParams(browserUrl)
    } catch (error) {}
    console.log('params====', params)

    let item = {}
    for (const command in mappings) {
      if (path.includes(command)) {
        item = mappings[command]
        break;
      }
    }

    // TODO: 暂时去掉url参数的拼接
    // if (item.url) {
    //   item.url = buildUrl(item.url, params)
    // }
    return item
  } else {
    return {}
  }
}

function getUrlParams(url) {
  let [, s] = url.split('?')

  let ret = {}
  s.split('&').map(item => {
    let [k, v] = item.split('=')
    ret[k] = v
  })
  return ret
}

function buildUrl(url, params) {
  params = params || {}
  let [path] = url.split('?')
  console.log('url', url)
  console.log('path', path)

  let urlParams = {}
  if (url.includes('?')) {
    urlParams = getUrlParams(url)
  }

  let finallyParams = {
    ...urlParams,
    ...params
  }
  console.log('finallyParams', finallyParams)
  let finallyParamsStr = ''
  for (key in finallyParams) {
    finallyParamsStr = finallyParamsStr + '&' + key + '=' + finallyParams[key]
  }
  finallyParamsStr = finallyParamsStr.slice(1)

  return path + '?' + finallyParamsStr
}
