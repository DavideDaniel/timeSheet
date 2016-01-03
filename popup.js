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
  // ...query for the active tab...

  enableBtn.addEventListener('click', function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      // ...and send a request for the DOM info...
      var statusTxt = document.getElementById('statusExt');
      console.log('enableFunc');
      if (statusTxt.innerText == '' || statusTxt.innerText == 'disabled') {
        chrome.tabs.sendMessage(
          tabs[0].id,
          // sendMsg('enable'),
          {
            from: 'popup',
            subject: 'enable'
          },
          function() {
            statusTxt.innerText = 'enabled';
          });
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
            // sendMsg('disable'),
            {
              from: 'popup',
              subject: 'disable'
            },
            function() {
              statusTxt.innerText = 'disabled';
            });

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
  document.getElementById('statusExt').textContent = msg.statusOfExt;
}
