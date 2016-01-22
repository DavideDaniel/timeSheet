$('.noBorder [valign="bottom"]').next().next().addClass('firstDayRow dayRow');
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
function colorRows() {
  // $('.dayDivider').removeClass('dayRow')
  $('.dayDivider').css('background-color', 'teal');
  // $('.firstDayRow').css('background-color', 'yellow');
  // $('.lastDayRow').css('background-color', 'pink');

  // $('.dayRow').css('background-color', 'orange');
}
colorRows();

function getText(el) {
  if (typeof el.textContent == 'string')
    return el.textContent;
  if (typeof el.innerText == 'string')
    return el.innerText;
  }

var datesArr = [];
var dayClass = '';

$('.firstDayRow').each(function(i, e) {
  var dateClass = getText(e.cells[1]).replace(/\//g, '_');
  $('.dayDivider').eq(i).addClass(dateClass);
});

$.when($('.dayRow').each(function(index, el) {
  var billClass = '';
  var internalClass = '';
  var adminClass = '';
  var vacationClass = '';
  var holidayClass = '';

  if ($(el).hasClass('firstDayRow')) {
    dayClass = getText(el.cells[1]).replace(/\//g, '_');
    if (dayClass !== '' && datesArr.indexOf(dayClass) == -1) {
      datesArr.push(dayClass)
    }
  }

  if (getText(el.cells[3]) != 'Maxymiser') {
    $(this).css('background-color', 'pink');
    billClass = 'billable';
  }

  // if (getText(el.cells[7]) == 'Meetings \/ calls' || getText(el.cells[7]) == 'Comms \/ Email') {
  //   // $(this).css('background-color', 'yellow');
  //   internalClass = 'internal';
  // }

  if (getText(el.cells[3]) == 'Maxymiser') {
    $(this).css('background-color', 'yellow');
    internalClass = 'internal';
  }

  if (getText(el.cells[7]) == 'Personal admin') {
    $(this).css('background-color', 'purple');
    adminClass = 'admin';
  }

  if (getText(el.cells[7]) == 'Vacation') {
    $(this).css('background-color', 'blue');
    vacationClass = 'vacation';
  }

  if (getText(el.cells[7]) == 'Bank\/Statutory holiday') {
    $(this).css('background-color', 'green');
    holidayClass = 'holiday';
    // $(this).addClass('holiday');
  }

  $(el.cells).each(function(index, el) {
    var num = $(this).text();
    if ($.isNumeric(num)) {
      // $(this).css('background-color', 'green');
      $(this).addClass(billClass + ' mm_hours ' + dayClass + ' ' + holidayClass + ' ' + vacationClass + ' ' + adminClass + ' ' + internalClass + '');

    }
  });

})).then(function() {
  $('.internal').each(function(index, el) {
    if ($(el).hasClass('holiday') || $(el).hasClass('vacation') || $(el).hasClass('admin')) {
      $(el).removeClass('internal');
    }
  });
}, function(err) {
  console.error(err);
});

function getHours(el) {
  return parseFloat(el.textContent);
}

function getBillHrs(arr) {
  var hours = 0;
  for (var i = 0; i < arr.length; i++) {
    hours += getHours(arr[i]);
  }

  if (arr.hasClass('dayDivider')) {
    return parseFloat(arr.text().match(/([\d.])+/m)[0])
  }

  return hours;
}

var HoursObj = function(date) {
  this.date = date.replace(/_/g, '\/');
  this.billableHours = getBillHrs($('.' + date).filter('.billable'));
  this.nonBillableHrs = getBillHrs($('.' + date).not('.dayDivider, .billable, .vacation, .holiday, .admin, .internal'));
  this.vacationHrs = getBillHrs($('.' + date).filter('.vacation'));
  this.holidayHrs = getBillHrs($('.' + date).filter('.holiday'));
  this.adminHrs = getBillHrs($('.' + date).filter('.admin'));
  this.internalHrs = getBillHrs($('.' + date).filter('.internal'));
  this.totalHrs = getBillHrs($('.' + date).filter('.dayDivider'));
}

var datesObjArr = [];

for (var i = 0; i < datesArr.length; i++) {
  var hrsObj = new HoursObj(datesArr[i]);
  datesObjArr.push(hrsObj);
}

chrome.storage.local.set({'week': []})
var restoredObjs = [];
function saveDays() {
  getDays().then(function(data) {
    data = datesObjArr;
    chrome.storage.local.set({'week': data});
    console.log(restoredObjs, 'saving week as:', data);
  }).catch(function(reason) {
    console.error(reason);
  });
}

saveDays();

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
// getDays().then(function(data) {
//     restoredObjs = data;
//
//   })
//   .catch(function(reason) {
//     console.error(reason);
//   });
