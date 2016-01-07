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
      if (allInputs[i].title.match(/Hrs/) && allInputs[i].title.match(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/)) {
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
    var pNode = setParentNode(e.target);
    var parsedId = parseId(e.target.id);
    var startAt = document.querySelector('#' + testId(parseId(e.target.id))).value;
    if (parsedId[1] > 1) {
      var startTime = calculate(pNode).startInput(startAt);
      calculate(pNode).calcStopTime();
    }

    if (parsedId[1] == 1) {
      calculate(pNode).startInput();
      calculate(pNode).calcStopTime();
    }
    // }, 300);
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
  //

  var restoredObjs = [];

  function getDays() {
    var days = new Promise(function(resolve, reject) {
      chrome.storage.local.get('week', function(item) {
        console.log('getting', item.week);
        restoredObjs = item.week;
        resolve(item.week)
      });

    });
    return days
  }

  function dateFormatter(date) {
    return date.replace(/_/g, '\/');
  }

  function dateChecker(date) {
    return moment(date, ['DD/MM/YY']).format('DD/MM/YY');
  }
  getDays().then(function() {
    var dates = checkDates();
    for (var i = 0; i < restoredObjs.length; i++) {
      dates[i] = dateChecker(dates[i]);
      var date = '';
      if (dates[i]) {
        date = dates[i].replace(/\//g, '_');
      }
        if (date === restoredObjs[i].date) {
          var timesFor = moment(dateFormatter(restoredObjs[i].date), ['DD/MM/YY']).format(' ddd, MMM DD');
          console.log('OA matched times for:', timesFor);
        }
      // var objJSON = JSON.stringify(restoredObjs[i]);
    }
  });

  function checkDates() {
    var arrayOfDates = [];
    var days = detectInputs();
    for (var i = 0; i < 7; i++) {
      var date = days[i].title.split('Hrs ')[1];
      arrayOfDates.push(date);
    }
    debugger
    arrayOfDates.push(arrayOfDates.shift());
    arrayOfDates.push(arrayOfDates.shift());
    return arrayOfDates
  }

  //   console.log(getResults('05_01_16'));
})();
