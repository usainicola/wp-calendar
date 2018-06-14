function calendarioPrezzi(element,calData,year) {
  //variables
  var today = new Date();
  var currentDay = today.getDate(); //day of the month
  var currentWeekDay = today.getDay(); //week day
  var currentMonth = today.getMonth(); //current month
  var currentYear = year ? year : today.getFullYear(); //current year

  // function getTodayString(){
  //   //returns the local date time string

  //   var strNow = "It is now: "+ today.toLocaleDateString()+ ", ";
  //   strNow += today.toLocaleTimeString();
  //   return strNow;
  // }

  //================= date arrays

  //days according to getDay() order
  var arrWeekdays = new Array('domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato');

  //change feb days for a leap year
  var arrMonths = new Array(['gennaio', 31], ['febbraio', 28], ['marzo', 31], ['aprile', 30], ['maggio', 31], ['giugno', 30], ['luglio', 31], ['agosto', 31], ['settembre', 30], ['ottobre', 31], ['novembre', 30], ['dicembre', 31]);

  //================ leap year
  function isLeapYear(year) {
    //test for leap year
    //year: number, required
    //return: boolean

    endvalue = false;

    if (!isNaN(year)) {
      if (year % 4 === 0) {
        endvalue = true;
        if (year % 100 === 0) {
          endvalue = false;
          if (year % 400 === 0) {
            endvalue = true;
          }
        }
      }
    }
    return endvalue;
  }

  function makeMonthTable(calendarYear, monthIndex) {
    //return: string, for innerHTML: a table with a month oversight
    //@calendarYear: integer, 4 digit year
    //@monthIndex: integer, from 0-11

    //check arguments
    if (isNaN(calendarYear) || (calendarYear.toString().length != 4)) {
      return "bad year number";
    }
    if (isNaN(monthIndex) || (monthIndex < 0) || (monthIndex > 11)) {
      return "bad month number";
    }

    //weekday of the first day of the month
    var start_date = new Date(calendarYear, monthIndex, 1);
    var start_weekday = start_date.getDay();

    //determine end day of the month, possible exception feb of leap year
    var endDay = arrMonths[monthIndex][1];
    if ((monthIndex == 1) && (isLeapYear(calendarYear))) {
      endDay = 29
    }

    //build up return value string
    strMonthTable = "<table class='calendar'>\n";
    //title row
    strMonthTable += "<tr><th colspan='7' class=\"month\">" + arrMonths[monthIndex][0] + " ";
    strMonthTable += calendarYear + "</th></tr>\n";

    //day titles
    strMonthTable += "<tr>";
    for (var i = 0; i < 7; i++) {
      strMonthTable += "<td class=\"days\">" + arrWeekdays[i].substr(0, 2).toUpperCase() + "</td>";
    }
    strMonthTable += "</tr>\n"

    var day = 1;
    var count = 0;

    while (day <= endDay) {
      //week row
      strMonthTable += "<tr>";
      for (var i = 0; i < 7; i++) {
        //draw cells without or with days filled in
        var strId = ''; //id made up of maandIndex and dagnummer
        var strDayNumber = ''; // the day number
        //write the days
        if ((count >= start_weekday) && (day <= endDay)) {
          strDayNumber = day;
          strId = " id='" + calendarYear + "-" + (monthIndex+1) + "-" + day + "'";
          day++;
        }
        var emptyClass = strDayNumber ? 'filled' : 'empty';

        //write the cell
        strMonthTable += "<td " + strId + " class="+emptyClass+">" + strDayNumber + "</td>";
        count++;
      }
      strMonthTable += "</tr>\n";
    }
    strMonthTable += "</table>\n";
    return strMonthTable;
  } //end of makeMonthTable

  //================show the day
  function highlightDay(day,price, CSS_Class) {
    //required - css class in stylesheet, id in element
    // @selected - date object of day to highlight
    // @css_class - css class should be there

    //which year, month and day?
    var dDay = new Date(day).getDate();
    var dMonth = new Date(day).getMonth()+1;
    var dYear = new Date(day).getFullYear();

    //contruct id for cell
    var strId = dYear + "-" + dMonth + "-" + dDay;
    var dCel = document.getElementById(strId);
    if (dCel) {
      dCel.classList.add(CSS_Class);
      dCel.dataset.price = price;
      dCel.title = price+'€';
    }
  } //end of highlightDay


  //=====================a whole year calendar
  function makeYearCalendar(calendarYear) {
    //dependency: makemonthTable()
    //return: string, for innerHTML: 12 month tables

    // @calendarYear: integer, 4 digit year

    strYearCalendar = "";
    for (var i = 0; i < 12; i++) {
      strYearCalendar += "<div class='monthContainer'>";
      strYearCalendar += makeMonthTable(calendarYear, i);
      strYearCalendar += "</div>";
    }
    return strYearCalendar;
  } //end of makeYearCalendar

  //=================highlight days



  //DOM elements
  // var divOutput     = document.getElementById('output');
  var divCalendar = element;

  //divCalendar.innerHTML = makeMonthTable(thisYear, thisMonth);              //calendar for 1 month
  divCalendar.innerHTML = makeYearCalendar(currentYear); //calendar for 1 year

  // if (!calData) return;
  // console.log(calData)

    // console.log(calData)
  // for (var i = 0; i < calData.length; i++) {
    // highlightDay(element[i], 'selected');
  // }

  for (data in calData) {
    highlightDay(data,calData[data],'selected');
  }


  //places current date and time in the output element
  // divOutput.innerHTML = getTodayString();
}