let mappings = {};

function displayMappings() {
  const mappingsDisplay = document.getElementById('mappings-display');
  mappingsDisplay.innerHTML = '';

  let genTable = () => {
    let ret = ''
    for (const command in mappings) {
      let url = mappings[command].url
      ret += `
        <tr>
            <td>${command}</td>
            <td>${url}</td>
            <td><button type="button" data-command="${command}" class="layui-btn layui-btn-primary layui-btn-sm deleteCommand">删除</button></td>
          </tr>
      `
    }
    return ret
  }
  let _html = `
      <table class="layui-table">
        <colgroup>
          <col width="150">
          <col>
          <col width="150">
        </colgroup>
        <thead>
          <tr>
            <th>命令</th>
            <th>url</th>
            <th>操作</th>
          </tr> 
        </thead>
        <tbody>
          ${genTable()}
        </tbody>
      </table>
    `
    mappingsDisplay.appendChild(transStr2Html(_html));

    document.querySelectorAll('.deleteCommand').forEach(ele => {
      ele.addEventListener('click', (e) => {
        clickDelete(e)
      })
    })
}

function addMapping(obj) {
  const command = obj?.key || document.getElementById('command').value;
  const url = obj?.value || document.getElementById('url').value;
  if (command && url) {
    if (url.includes(command)) {
        alert('URL 不能包含（includes）命令,不然会导致死循环');
        return;
    }
    mappings[command] = {
      url
    };
    chrome.storage.sync.set({ mappings: mappings }, function() {
      console.log('Mapping added.');
      displayMappings();
      clearForm()
    });
  }
}

function deleteMapping(command) {
  delete mappings[command];
  chrome.storage.sync.set({ mappings: mappings }, function() {
    console.log('Mapping deleted.');
    displayMappings();
  });
}

function clearForm() {
  document.getElementById('command').value = '';
  document.getElementById('url').value = '';
}

function clickDelete(e) {
  let command = e.target.dataset?.command
  console.log('delete cmd', command)
  deleteMapping(command)
}

// test
// displayMappings()

document.getElementById('add-mapping').addEventListener('click', addMapping);

// 获取当前页面 URL 并填入输入框
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    document.getElementById('url').value = currentUrl;
});

chrome.storage.sync.get(['mappings'], function(result) {
  mappings = result.mappings || {}
  if (mappings && Object.keys(mappings)?.length > 0) {
    displayMappings();
  } else {
    // 设置默认值
    // addMapping({
    //   key: '/open/baidu',
    //   value: 'https://www.baidu.com/'
    // })
  }
});

function transStr2Html(_html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(_html, "text/html");
  const divElement = doc.body.firstChild;
  return divElement
}
