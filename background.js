console.log("DD's timesheet extension running in bg");

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
  var allInputs = document.querySelectorAll('span input')
  for (var i = 0; i < allInputs.length; i++) {
    if (allInputs[i].title.match(/Hrs/) && allInputs[i].title.match(/Mon|Tue|Wed|Thu|Fri/)) {
      inputHandler(allInputs[i]);
    }
  }
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

function inputHandler(input) {
  input.addEventListener('input', function() {
    clearTimeout(keyupTimer);
    keyupTimer = setTimeout(function() {
      var pNode = setParentNode(input);
      var parsedId = parseId(input.id);
      if (parsedId[1] > 1) {
        var startAt = document.querySelector('#' + testId(parseId(input.id))).value;

        var promise = new Promise(function(resolve, reject) {
          var startPoint = calculate(pNode).startInput(startAt);
          resolve(startPoint);
        });

        promise.then(function(result) {
          calculate(pNode).calcStopTime();
        })
      }
      if (parsedId[1] === 1) {
        calculate(pNode).calcStopTime();
      }
    }, 1000);
  });
}

detectInputs();
