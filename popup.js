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
  setStatus();

  enableBtn.addEventListener('click', function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {

      var statusTxt = document.getElementById('statusExt');
      console.log('enableFunc');
      if (statusTxt.innerText == '' || statusTxt.innerText == 'disabled') {
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
        console.log(statusTxt);
        if (statusTxt.innerText == '' || statusTxt.innerText == 'enabled') {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              from: 'popup',
              subject: 'disable'
            },
            setStatus);

        }
      });
  });
  chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('clickeeed');
  });
});

function sendMsg(a) {
  return {
    from: 'popup',
    subject: a
  }
}

function setStatus(msg) {
  document.getElementById('statusExt').textContent = '';
  if (msg) {
  document.getElementById('statusExt').textContent = msg.statusOfExt
  }

}
