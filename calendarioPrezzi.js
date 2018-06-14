window.addEventListener('load', function () {
  window.calendar = document.getElementById('calendar');
  var textareaValue = JSON.parse(document.forms['post'].prices.value);
  window.calData = typeof textareaValue === 'object' ? textareaValue : new Object();
  buildCalendar();
});

function buildCalendar() {
  var year = document.forms['post'].calendarYear.value;
  calendarioPrezzi(calendar,calData,year);
}

document.forms['post'].calendarYear.addEventListener('input', function (event) {
  buildCalendar();
});

function buildData() {
  var data = calendar.querySelectorAll('.filled');
  data.forEach( function(element, index) {
    var price = element.dataset.price ? element.dataset.price : '';
    calData[element.id] = price;
  });
  document.forms['post'].prices.value = JSON.stringify(calData);
}

window.addEventListener('load', function () {
  var priceInput = document.querySelector('.cControl.priceInput');
  var dayPrice = priceInput.querySelector('input[name="dayPrice"]');
  document.addEventListener('click', function (argument) {
    if (argument.target.closest('td.filled')) {
      argument.target.classList.add('chosen');
      dayPrice.disabled = false;
      dayPrice.value = argument.target.getAttribute('data-price');
      dayPrice.focus();
    } else {
      if (argument.target.closest('div.priceInput')) return;
      if (argument.target.closest('th.month')) return;
      calendar.querySelectorAll('.chosen').forEach(function (el) {
        el.classList.remove('chosen');
      });
      dayPrice.disabled = true;
      dayPrice.value = '';
      buildData();
    }
  });
  dayPrice.addEventListener('keydown',function (e) {
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var isNumeric = () => charCode >= 48&&charCode <= 57;
    var isDot = () => charCode == 190;
    var isTab = () => charCode == 9;
    var isCanc = () => charCode == 46;
    var isBackspace = () => charCode == 8;
    if (!isNumeric()&&!isDot()&&!isTab()&&!isCanc()&&!isBackspace()) e.preventDefault();
    buildData();
  });
  dayPrice.addEventListener('keyup',function (e) {
    var value = dayPrice.value;
    calendar.querySelectorAll('.chosen').forEach(function (chosen) {
      chosen.setAttribute('data-price', value);
      chosen.classList.add('selected');
    });
    buildData();
  });
});

calendar.addEventListener('click',function(e){
  if( e.target && e.target.classList.contains('month') ) {
    e.target.parentNode.parentNode.querySelectorAll('.filled').forEach(function (filled) {
      filled.classList.add('chosen');
    });
    var dayPrice = document.querySelector('input[name="dayPrice"]');
    dayPrice.disabled = false;
    dayPrice.value = '';
    dayPrice.focus(); 
  }
});