let mappings = {
  // 'aaa': {
  //   url: '1111'
  // },
  // 'aaa1': {
  //   url: '1111111'
  // }
};

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

function addMapping() {
  const command = document.getElementById('command').value;
  const url = document.getElementById('url').value;
  if (command && url) {
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

chrome.storage.sync.get(['mappings'], function(result) {
  mappings = result.mappings || {};
  displayMappings();
});

function transStr2Html(_html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(_html, "text/html");
  const divElement = doc.body.firstChild;
  return divElement
}