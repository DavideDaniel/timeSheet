$('.noBorder [valign="bottom"]').next().next().addClass('firstDayRow dayRow')
$('tr[valign="top"]:contains("Day Total")').each(function(index, el) {
  if (index < $('tr[valign="top"]:contains("Day Total")').length) {
    $(el).addClass('dayDivider');
    if (index < $('tr[valign="top"]:contains("Day Total")').length - 1) {
      $(el).next().next().addClass('firstDayRow dayRow');
    }
    $(el).prev().prev().addClass('lastDayRow dayRow');
  }
});

$('.dayDivider:last').addClass('lastDivider')

$('.firstDayRow').nextUntil('.lastDivider').filter('tr[valign="top"]').not('.dayDivider').addClass('dayRow');
// $('.dayDivider').removeClass('dayRow')
$('.dayDivider').css('background-color', '#777');
$('.firstDayRow').css('background-color', 'yellow');
$('.lastDayRow').css('background-color', 'pink');

$('.dayRow').css('background-color', 'orange');

function getText(el) {
  if (typeof el.textContent == 'string') return el.textContent;
  if (typeof el.innerText == 'string') return el.innerText;
}

var datesArr = [];
var dayClass = '';

$('.dayRow').each(function(index, el) {
  var billClass = '';
  var internalClass = '';
  var adminClass = '';
  var vacationClass = '';

  if ($(el).hasClass('firstDayRow')) {
    dayClass = getText(el.cells[1]).replace(/\//g, '_');
    if (dayClass !== '' && datesArr.indexOf(dayClass) == -1) {
      datesArr.push(dayClass)
    }
  }

  if (getText(el.cells[11]) == 'Billable') {
    $(this).css('background-color', 'pink');
    billClass = 'billable';
  }

  if (getText(el.cells[7]) == 'Meetings \/ calls' || getText(el.cells[7]) == 'Comms \/ Email') {
    $(this).css('background-color', 'yellow');
    internalClass = 'internal';
  }

  if (getText(el.cells[7]) == 'Personal admin') {
    $(this).css('background-color', 'purple');
    adminClass = 'admin';
  }

  if (getText(el.cells[7]) == 'Vacation' || getText(el.cells[7]) == 'Bank\/Statutory holiday') {
    $(this).css('background-color', 'blue');
    vacationClass = 'vacation';
  }

  $(el.cells).each(function(index, el) {
    var num = $(this).text();
    if ($.isNumeric(num)) {
      $(this).css('background-color', 'green');
      $(this).addClass(billClass + ' mm_hours ' + dayClass + ' ' + vacationClass + ' ' + adminClass + ' ' + internalClass + '');

    }
  });
});

function getHours(el) {
  return parseFloat(el.textContent);
}

function getBillHrs(arr) {
  var hours = 0;
  for (var i = 0; i < arr.length; i++) {
    hours += getHours(arr[i]);
  }
  return hours;
}

var HoursObj = function(date) {
  this.date = date;
  this.billableHours = getBillHrs($('.' + date).filter('.billable'));
  this.nonBillableHrs = getBillHrs($('.' + date).not('.billable, .vacation, .admin, .internal'));
  this.vacationHrs = getBillHrs($('.' + date).filter('.vacation'));
  this.adminHrs = getBillHrs($('.' + date).filter('.admin'));
  this.internalHrs = getBillHrs($('.' + date).filter('.internal'));
}

var datesObj = [];

for (var i = 0; i < datesArr.length; i++) {
  var hrsObj = new HoursObj(datesArr[i]);
  datesObj.push(hrsObj);
}

function saveDays() {

  var obj = {};
  for (var i = 0; i < datesObj.length; i++) {
    var date = 'd'+datesObj[i].date;
    obj[date] = datesObj[i];
    debugger
    chrome.storage.local.set(obj);
  }
}
saveDays();


var restoredObjs = [];
function getDays(date){
  date = ('d'+date).toString();
  debugger
  chrome.storage.local.get(date, function(item){
    debugger
    restoredObjs.push(item);
  });
}

getDays("04_01_16");

// debugger
// for (var i = 0; i < 5; i++) {
//
//   restoredObjs.push(chrome.storage.local.get('day'+i));
//
// }
