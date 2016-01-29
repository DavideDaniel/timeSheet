;
(function() {
  console.log('active');

  var keyupTimer = 0;

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

  function createTemplate(row, task, type) {
    fillOutProject(row);
    fillOutTasks(row, task);
    fillOutTypes(row, type);
    fillOutCountry(row);
    fillOutState(row);
  }

  function fillOutProject(row) {
    // var projectInputs = document.querySelectorAll('span>input[title="Project"]');
    // for (var i = projectInputs.length - 1; i >= 0; i--) {
    //   console.log(projectInputs[i].value);
    // };
    // '300484328-1ZK1- OMC MX Admin US'

    $(row).find('span>input[title="Project"]').val('300484328-1ZK1- OMC MX Admin US');
  }

  function fillOutTasks(row, task) {
    // '16 BT' '02 IN' '15 LU' '01 AD' '08 UA' '06 VA' '05 SI' '04 HO' '11 MK'

    $(row).find('span>input[title="Task"]').val(task);
  }

  function fillOutTypes(row, type) {
    // 'LABOR - Straight Time' 'Lunch Hours' 'Public Holiday Not Worked' 'Vacation' 'Sick Pay'
    $(row).find('span>input[title="Type"]').val(type);
  }

  function fillOutCountry(row) {
    // 'United States'
    $(row).find('span>input[title="Work Location Country"]').val('United States');
  }

  function fillOutState(row) {
    // 'New York'
    $(row).find('span>input[title="Work Location State/Province"]').val('New York');
  }

  function detectInputs() {
    var allInputs = document.querySelectorAll('span input');
    var filteredInputs = [];
    for (var i = 0; i < allInputs.length; i++) {
      if (allInputs[i].title.match(/Hrs/) && allInputs[i].title.match(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/)) {
        filteredInputs.push(allInputs[i]);
        0
      }
    }
    return filteredInputs;
  }

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

  // addAllHandlers();

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
      case 'import':
        removeAllHandlers();
        msgObj.statusOfExt = "Imported & disabled";
        importOAhrs();
        break
      default:
        console.error("Message: ", msg);
        break;
    }
    response(msgObj);
  });
  //

  function getDays() {
    var days = new Promise(function(resolve, reject) {
      chrome.storage.local.get('week', function(item) {
        console.log('getting', item.week);
        // restoredObjs = item.week;
        resolve(item.week);
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
  function importOAhrs() {

    getDays().then(function(week) {
      // var inputNodes = ;
      return {week: week, inputs: detectInputs()}
    }).then(function(data) {
      console.log(data);
      var dates = checkDates(data.inputs);
      return {week: data.week, dates: dates, inputs: data.inputs}
    }).then(function(data) {
      console.log(data);

      for (var i = 0; i < data.week.length; i++) {
        console.log(data.dates[i]);
        data.dates[i] = dateChecker(data.dates[i]);
        if (data.dates[i] === data.week[i].date) {
          // console.log(data.dates[i]);
          var timesFor = moment(data.week[i].date, ['DD/MM/YY']).format(' ddd, MMM DD');
          console.log('OA matched times for:', timesFor);
        }
      }
      return {week: data.week, dates: data.dates, inputs: data.inputs}
    }).then(function(data) {
      console.log(data);
      // breakUpHrs(data);

      // for (var j = 0; j < data.inputs.length; j++) {
      //
      //   console.log(data.dates[i], data.inputs[j]);
      //
      //   if (data.dates[i] === dateChecker(data.inputs[j].title)) {

      for (var w = 0; w < data.week.length; w++) {
        var holidayHours = data.week[w].holidayHrs;
        var vacationHours = data.week[w].vacationHrs;
        var totalHours = data.week[w].totalHrs;
        var billedHours = data.week[w].billableHours;
        var sickHours = data.week[w].sickHrs;
        var nextBilledHrs = 0;
        if (billedHours > 4) {
          billedHours = nextBilledHrs = billedHours / 2
        }

        if (data.dates[w] === data.week[w].date) {

          for (var j = 0; j < data.inputs.length; j++) {
            if (data.dates[w] === dateChecker(data.inputs[j].title)) {

              var pNode = setParentNode(data.inputs[j]);
              var pRow = $(pNode).closest('tr');
              var parsedId = parseId(data.inputs[j].id);
              var startAt = document.querySelector('#' + testId(parseId(data.inputs[j].id))).value;
              var hoursNow = 0;

              if (holidayHours > 1) {
                console.log(data.inputs[j].title);
              }

              switch (parsedId[1]) {
                case "1":
                  // data.inputs[j].value = 0;
                  if (data.week[w].internalHrs > 0) {
                    hoursNow += data.inputs[j].value = data.week[w].internalHrs;
                    createTemplate(pRow, '02 IN', 'LABOR - Straight Time');
                    calculate(pNode).startInput();
                    calculate(pNode).calcStopTime();
                  }
                  break;
                case "2":
                  // data.inputs[j].value = 0;
                  if (billedHours > 0) {
                    data.inputs[j].value = billedHours;
                    createTemplate(pRow, '16 BT', 'LABOR - Straight Time');
                    calculate(pNode).startInput(startAt);
                    calculate(pNode).calcStopTime();
                  }
                  break;
                case "3":
                  // data.inputs[j].value = 0;
                  if (holidayHours === 0 && totalHours > 3) {
                    data.inputs[j].value = 1;
                    createTemplate(pRow, '15 LU', 'Lunch Hours');
                    calculate(pNode).startInput(startAt);
                    calculate(pNode).calcStopTime();
                  }
                  break;
                case "4":
                  // data.inputs[j].value = 0;
                  if (nextBilledHrs > 0) {
                    data.inputs[j].value = nextBilledHrs;
                    createTemplate(pRow, '16 BT', 'LABOR - Straight Time');
                    calculate(pNode).startInput(startAt);
                    calculate(pNode).calcStopTime();
                  }

                  break;
                case "5":
                  // data.inputs[j].value = 0;
                  if (data.week[w].adminHrs > 0) {

                    hoursNow += data.inputs[j].value = data.week[w].adminHrs;
                    createTemplate(pRow, '01 AD', 'LABOR - Straight Time');
                    calculate(pNode).startInput(startAt);
                    calculate(pNode).calcStopTime();

                  }

                  break;
                case "6":
                // data.inputs[j].value = 0;
                // if($(pRow).find('span>input[title="Task"]').val()==='04 HO'){
                //   // calculate(pNode).startInput(startAt);
                //   // calculate(pNode).calcStopTime();
                // }
                  if (holidayHours >= 8) {

                    data.inputs[j].value = holidayHours;
                    createTemplate(pRow, '04 HO', 'Public Holiday Not Worked');
                    // calculate(pNode).startInput(startAt);
                    // calculate(pNode).calcStopTime();
                  }

                  break;
                case "7":
                // data.inputs[j].value = 0;
                // if($(pRow).find('span>input[title="Task"]').val()==='06 VA'){
                //   // data.inputs[j].value = 0;
                //   calculate(pNode).startInput(startAt);
                //   calculate(pNode).calcStopTime();
                //
                // }
                  if (vacationHours >= 1) {

                    data.inputs[j].value = vacationHours;
                    createTemplate(pRow, '06 VA', 'Vacation');
                    // calculate(pNode).startInput(startAt);
                    // calculate(pNode).calcStopTime();
                  }

                  break;
                case "8":
                  if (sickHours >= 1) {
                    data.inputs[j].value = sickHours;
                    createTemplate(pRow, '05 SI', 'Sick Pay');
                  }
                case "9":
                  if (data.week[w].nonBillableHrs > 0) {
                    data.inputs[j].value = data.week[w].nonBillableHrs;
                    createTemplate(pRow, '08 UA', 'LABOR - Straight Time');
                    calculate(pNode).startInput(startAt);
                    calculate(pNode).calcStopTime();
                  }

                  break;
                default:
                  // data.inputs[j].value = 0;
                  break;
              }

            }
          }
        }

      }
    }, function(error) {
      console.log('CAUGHT::', error);
    });

  }

  function checkDates(days) {
    var arrayOfDates = [];
    // var nodeObj = {};
    for (var i = 0; i < 7; i++) {
      var date = days[i].title.split('Hrs ')[1];
      // nodeObj[date]=days[i];
      arrayOfDates.push(date);
    }
    arrayOfDates.push(arrayOfDates.shift());
    arrayOfDates.push(arrayOfDates.shift());
    return arrayOfDates
  }


  function indexRows(node){
    function setJQpNode(input) {
    return $(input).closest('.x1u').parent().closest('.x1u');
  }

  var startNode = setJQpNode($(node));

  var $row = $(startNode).parent()
  var colIndex = $row.children().index(startNode);
  var col = $row.parent().children('tr').index($parentTab)
  var $rows = $row.parent().children('tr')
  }

  // function breakUpHrs(hrs) {
  //
  //   var week = hrs.week
  //   for (var i = week.length - 1; i >= 0; i--) {
  //     var day = week[i]
  //     if (day.vacationHrs >= 8 || day.holidayHrs >= 8) {
  //       // console.log('use vacation template')
  //     }
  //     if (day.holidayHrs < 8 && day.totalHrs >= 4) {
  //       console.log('use lunch standard day template');
  //     }
  //     // if (day.totalHrs >= 4 && day.) {};
  //   }
  // }

  //   console.log(getResults('05_01_16'));
})();
