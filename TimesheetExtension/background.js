
console.log("DD's timesheet extension running in bg");

function calculate(node) {
  return {
    _node: function() {
      return node;
    },
    startInput: function(custom) {
      a = node.getElementsByTagName('input')[0];
      if (custom) {
        a.value = custom;
        return a;
      }
      a.value = '09:00'
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

function setParentNode(input){
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

function inputHandler(input){
  input.addEventListener('input', function(){
    clearTimeout(keyupTimeoutID);
    keyupTimeoutID = setTimeout(function() {
        var pNode = setParentNode(input);
        calculate(pNode).calcStopTime();
        console.log(input.id);
    }, 1000);
  });
}

detectInputs();
