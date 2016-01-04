;
(function() {
  console.log('active');

  function calculate(node) {
    return {
      _node: function() {
        return node;
      },
      startInput: function(custom) {
        a = node.getElementsByTagName('input')[0];
        if (a.value === '') {
          a.value = '09:00'
        }
        if (custom) {
          a.value = custom;
        }
        return a;
      },
      stopInput: function() {
        b = node.getElementsByTagName('input')[1];
        return b;
      },
      valInput: function() {
        c = node.getElementsByTagName('input')[2];
        return c.value;
      },
      switchTab: function() {
        node = node.nextSibling;
        return this
      },
      calcStopTime: function() {
        a = this.startInput().value;
        b = this.stopInput();
        c = this.valInput();
        aMoment = new moment(a, 'HH:mm');
        var stopTime = aMoment.add(c, 'hours').format('HH:mm')
        b.value = stopTime;
        return stopTime;
      }
    }
  }

  function setParentNode(input) {
    return input.closest('.x1u').parentElement.closest('.x1u');
  }

  function detectInputs() {
    var allInputs = document.querySelectorAll('span input');
    var filteredInputs = [];
    for (var i = 0; i < allInputs.length; i++) {
      if (allInputs[i].title.match(/Hrs/) && allInputs[i].title.match(/Mon|Tue|Wed|Thu|Fri/)) {
        filteredInputs.push(allInputs[i]);
      }
    }
    return filteredInputs;
  }

  var keyupTimer = 0;

  function parseId(id) {
    var num = id.split('B')[1];
    var arrNums = num.split('_');
    return arrNums
  }

  function testId(arr) {
    var row = arr[1];
    var newId = 'B' + (arr[0] - 2);
    if (row > 1) {
      row -= 1;
      return newId += '_' + row + '_' + arr[2];
    }
    return newId += '_' + row + '_' + arr[2];
  }

  function keyUpHandler(e) {
    // e.currentTarget (if you're gonna do all of them together)
    // console.log('Event emitted by: ', e.target.id);
    clearTimeout(keyupTimer);
    keyupTimer = setTimeout(function() {
      var pNode = setParentNode(e.target);
      var parsedId = parseId(e.target.id);
      var startAt = document.querySelector('#' + testId(parseId(e.target.id))).value;
      if (parsedId[1] > 1) {
        var promise = new Promise(function(resolve, reject) {
          var startPoint = calculate(pNode).startInput(startAt);
          resolve(startPoint);
        });

        promise.then(function(result) {
          calculate(pNode).calcStopTime();
        })
      }
      if (parsedId[1] == 1) {
        calculate(pNode).startInput();
        calculate(pNode).calcStopTime();
      }
    }, 300);
  }

  function addAllHandlers() {
    var relevantInputs = detectInputs();
    for (var i = 0; i < relevantInputs.length; i++) {
      relevantInputs[i].addEventListener('input', keyUpHandler);
    }
  }

  function removeAllHandlers() {
    var relevantInputs = detectInputs();
    for (var i = 0; i < relevantInputs.length; i++) {
      relevantInputs[i].removeEventListener('input', keyUpHandler);
    }
  }

  addAllHandlers();

  // FOR SHOW PAGE ACTION IN URL
  //   chrome.runtime.sendMessage({
  //   from:    'content',
  //   subject: 'showPageAction'
  // });

  chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    var msgObj = {
        statusOfExt: ''
      }
      // FOR SHOW PAGE ACTION IN URL
      // if ((msg.from === 'popup') && (msg.subject === 'SetStatus')) {
      //     msgObj.statusOfExt = 'Enabled';
      //   response(msgObj);
      // }

    switch (msg.subject) {
      case 'enable':
        msgObj.statusOfExt = 'Enabled';
        addAllHandlers();
        break;
      case 'disable':
        msgObj.statusOfExt = 'Disabled';
        removeAllHandlers();
        break;
      default:
        console.error("Message: ", msg);
        break;
    }
    response(msgObj);
  });
})();
