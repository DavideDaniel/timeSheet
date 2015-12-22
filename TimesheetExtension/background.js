console.log("DD's timesheet extension running in bg");

function calculate(node) {
  return {
    _node: function() {
      return node;
    },
    startInput: function(custom) {
      a = node.getElementsByTagName('input')[0];
      if (a.value === '') {
      a.value = '09:00'}
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

function setFirstNode(id) {
  var startingPoint = document.querySelector(id);
}

// get all buckets
var allBuckets = document.querySelectorAll('.x1u');
// filter out to parents
function makeArray(array) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    var _this = array[i];
    var _that = array[i + 1];
    if (_this.contains(_that)) {
      newArray.push(_this);
    }
  }
  return newArray;
}

var inputID = document.querySelectorAll('span input')

function detectInputs() {
  for (var i = 0; i < inputID.length; i++) {
    if (inputID[i].title.match(/Hrs/) && inputID[i].title.match(/Mon|Tue|Wed|Thu|Fri/)) {
      console.log(inputID[i]);
      inputHandler(inputID[i]);
    }
  }
}

var keyupTimeoutID = 0;

function parseId(id){
  var num = id.split('B')[1];
  var arrNums = num.split('_');
  return arrNums
}

function testId(arr){
  var row = arr[1];
  var newId = 'B' + (arr[0]-2);
  if (row > 1){
    console.log('>');
    row -= 1;
    return newId += '_'+ row +'_'+ arr[2];
  }
  return newId += '_'+ row +'_'+ arr[2];
}

function inputHandler(input) {
  input.addEventListener('input', function() {
    clearTimeout(keyupTimeoutID);
    keyupTimeoutID = setTimeout(function() {
      var pNode = setParentNode(input);
      var parsedId = parseId(input.id);
      if (parsedId[1] > 1){
        // if (/26_2_/.test(input.id)) {
          var startAt = document.querySelector('#' + testId(parseId(input.id))).value;

          var promise = new Promise(function(resolve, reject) {
            var startPoint = calculate(pNode).startInput(startAt);
            resolve(startPoint);
          });

          promise.then(function(result) {
            console.log(result);
            console.log('inside the promise');
            calculate(pNode).calcStopTime();
          })
        // }

      }
      if (/26_1_/.test(input.id)) {
        calculate(pNode).calcStopTime();
      }
      console.log(input.id);
    }, 1000);
  });
}

detectInputs();
