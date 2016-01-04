// btn.addEventListener('click', function () {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//           chrome.runtime.sendMessage(tabs[0].id, {type: "getCount"}, function(count) {
//               displayCount(count);
//           });
//       });
//
// });

window.addEventListener('DOMContentLoaded', function() {
  var enableBtn = document.getElementById('enableExt');
  var disableBtn = document.getElementById('disableExt');

  enableBtn.addEventListener('click', function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {

      var statusTxt = document.getElementById('statusExt');
      if (statusTxt.innerText == '' || statusTxt.innerText == 'Disabled') {
        chrome.tabs.sendMessage(
          tabs[0].id,

          {
            from: 'popup',
            subject: 'enable'
          },
          setStatus);
      }
    });
  });

  disableBtn.addEventListener('click', function() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
      },
      function(tabs) {
        var statusTxt = document.getElementById('statusExt');
        if (statusTxt.innerText == '' || statusTxt.innerText == 'Enabled') {
          chrome.tabs.sendMessage(
            tabs[0].id, {
              from: 'popup',
              subject: 'disable'
            },
            setStatus);
        }
      });
  });
});

function sendMsg(a) {
  return {
    from: 'popup',
    subject: a
  }
}

function setStatus(msg) {
  console.log(msg);
  if (msg && msg.statusOfExt) {
    document.getElementById('statusExt').textContent = msg.statusOfExt;
  }
}
