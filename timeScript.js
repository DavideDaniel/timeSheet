
var startTime = "09:00";

// some node points in the DOM
var nodeStartPoint = '#B22_1_2';
var nodeStopPoint = '#B24_1_2';
var fullHourNode = '#B26_1_2';

var firstInput = document.querySelector('#B22_1_2');
var startingTab = firstInput.closest('.x1u');
var threeInputs = firstInput.closest('.x1u').getElementsByTagName('input');

// calculate func factory

function calculate(node,a,b,c) {
  return {
    equals: function() {
      return node
    },
    _thisNode: function() {
      node = node.closest('.x1u');
      return this;
    },
    startInput: function() {
      a = node.getElementsByTagName('input')[0]
      a.value = moment().set({'hour':9,'minute':00}).format("H:mm")
      return a;
    },
    stopInput: function() {
      b = node.getElementsByTagName('input')[1]
      b.value = moment().add(this.valInput)
      return b;
    },
    valInput: function() {
      c = node.getElementsByTagName('input')[2]
      return c;
    },
    switchTime: function(){

    },
    render: function(){

    }
  }
}

function findBucket(node) {
  return node.closest('.x1u');
}

function getBucketInputs(node) {
  return node.getElementsByTagName('input');
}

function concatIt(num) {
  var nodeId = '#B' + num + '_1_2';
  return nodeId
}

function setFirstNode(id) {
  var startingPoint = document.querySelector(id);
  startingPoint.
}

function calculate(node) {
  var hours = document.querySelector('#B26_1_2');
}


function dayNodeCalculator(a) {
  var stopPoint = a + 2;
}

function nextBucket(b) {
  var nextBucket = b + 1;
}

function nextDay(c) {
  var nextDay = c + 1;
}

function nodeCalculator(22, 1, 2) {
  day
}
