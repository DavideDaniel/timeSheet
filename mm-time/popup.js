;
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    var enableBtn = document.getElementById('enableExt');
    var disableBtn = document.getElementById('disableExt');
    var importBtn = document.getElementById('importOA');
    enableBtn.addEventListener('click', function() {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {

        var statusTxt = document.getElementById('statusExt');
        if (statusTxt.innerText == '' || statusTxt.innerText == 'Disabled') {
          chrome.tabs.sendMessage(
            tabs[0].id, {
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

    importBtn.addEventListener('click', function(){
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
                subject: 'import'
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
    if (msg && msg.statusOfExt) {
      document.getElementById('statusExt').textContent = msg.statusOfExt;
    }
  }
}());
