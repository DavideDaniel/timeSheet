
// var startTime = "09:00";

// some node points in the DOM
var nodeStartPoint = '#B22_1_2';
var nodeStopPoint = '#B24_1_2';
var fullHourNode = '#B26_1_2';

var firstInput = document.querySelector('#B22_1_2');
var startingTab = firstInput.closest('.x1u').parentElement.closest('.x1u');
var threeInputs = firstInput.closest('.x1u').getElementsByTagName('input');

// calculate func factory

function calculate(node) {
  return {
    equals: function() {
      return node
    },
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
    switchTab: function(){
      node = node.nextSibling;
      return this
    },
    switchTime: function(){

    },
    calcStopTime: function(){
      a = this.startInput().value;
      b = this.stopInput();
      c = this.valInput();
      aMoment = new moment(a,'HH:mm');
      var stopTime = aMoment.add('hours', c).format('HH:mm')
      b.value = stopTime;
      return stopTime;
    },
    render: function(){

    }
  }
}

//
// function findBucket(node) {
//   return node.closest('.x1u');
// }
//
// function getBucketInputs(node) {
//   return node.getElementsByTagName('input');
// }
//
// function concatIt(num) {
//   var nodeId = '#B' + num + '_1_2';
//   return nodeId
// }
//
function setFirstNode(id) {
  var startingPoint = document.querySelector(id);
}

var allBuckets = document.querySelectorAll('.x1u');

function makeArray(allBuckets){
  var newArray = [];
  for (var i = 0; i < allBuckets.length; i++) {
    var _this = allBuckets[i];
    var _that = allBuckets[i+1];
    if (_this.contains(_that)){
      newArray.push(_this);
    }
  }
  return newArray;
}


//
// function calculate(node) {
//   var hours = document.querySelector('#B26_1_2');
// }
//
//
// function dayNodeCalculator(a) {
//   var stopPoint = a + 2;
// }
//
// function nextBucket(b) {
//   var nextBucket = b + 1;
// }
//
// function nextDay(c) {
//   var nextDay = c + 1;
// }
//
// function nodeCalculator(22, 1, 2) {
//   // day
// }
