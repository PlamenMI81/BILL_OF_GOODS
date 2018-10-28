/* global $, myArray */
// ***********************************************
// AUTHOR: WWW.CGISCRIPT.NET, LLC
// URL: http://www.cgiscript.net
// Use the script, just leave this message intact.
// Download your FREE CGI/Perl Scripts today!
// ( http://www.cgiscript.net/scripts.htm )
// ***********************************************
function addRow () {
  let str = `<tr class="item-row">
              <td class="item-count">
                <div class="delete-wpr">
                  <a class="delete" href="javascript:;" title="Изтрии ред">
                    X
                  </a>
                  <input class="count" value=1>
                </div>
              </td>
              <td class="item-name"><input class="name" placeholder="Въведете артикул" onclick="this.select()"></td>
              <td class="item-unit"><input class="unit" value='бр.' onclick="this.select()"></td>
              <td class="item-qty"><input class="qty" value=1 onclick="this.select()"></td>
              <td class="item-cost"><input class="cost" placeholder="Цена" value=0.00 onclick="this.select()"></td>
              <td class="item-discount"><input class="discount" value=0 onclick="this.select()"></td>
              <td class="item-price"><input class="price" value=0.00></td>
            </tr>`
  $('.item-row:last').after(str)
  bind()
  updateCount()
  deleteEvent()
  showDelete()
}

function showHideLogo () {
  let value = $('#image').css('display')
  if (value == 'none') {
    $('#image').css('display', 'block')
    return
  }
  $('#image').css('display', 'none')
}

function autocomplete (e) {
  $(e.target).autocomplete({
    source: myArray,
    minLength: 3
  })
}

function bind () {
  $('.cost').blur(updatePrice)
  $('.qty').blur(updatePrice)
  $('.discount').blur(updatePrice)
  $('#dds').blur(updateTotal)
  $('#grand-discount').blur(updateTotal)
  $('.name').blur(uppercase)
  $('.name').focus(autocomplete)
}

function deleteEvent () {
  $('.delete').on('click', function () {
    $(this).parents('.item-row').remove()
    updateTotal()
    if ($('.delete').length < 2) $('.delete').hide()
    updateCount()
  })
}

function printToday () {
  var now = new Date()
  var months = ['Януари', 'Февруари', 'Март', 'Април', 'Май',
    'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']
  var date = ((now.getDate() < 10) ? '0' : '') + now.getDate()
  function fourdigits (number) {
    return (number < 1000) ? number + 1900 : number
  }
  var today = date + ' ' + months[now.getMonth()] + ', ' + (fourdigits(now.getYear()))
  return today
}

function updateTotal () {
  let subtotal = 0
  $('.price').each(function (i) {
    let price = $(this).val()
    if (!isNaN(price)) subtotal += Number(price)
  })

  $('#total').val(subtotal.toFixed(2))
  let total = Number($('#total').val())
  let dds = Number($('#dds').val().replace(',', '.'))
  let grandDiscount = Number($('#grand-discount').val().replace(',', '.'))
  let grandTotal = (total - (total * (grandDiscount / 100))) * (dds / 100 + 1)
  $('#dds').val(dds)
  $('#grand-discount').val(grandDiscount)
  $('#grand-total').val('тотал: ' + grandTotal.toFixed(2) + ' лв')
}

function updatePrice (e) {
  if (e) {
    let value = $(e.target).val().replace(',', '.')
    e.target.className !== 'discount'
      ? $(e.target).val(Number(value).toFixed(2))
      : $(e.target).val(Number(value))
  }
  var row = $(this).parents('.item-row')
  var price = row.find('.cost').val() * row.find('.qty').val()
  price -= (price * (row.find('.discount').val() / 100))
  isNaN(price) ? row.find('.price').html('N/A') : row.find('.price').val(price.toFixed(2))

  updateTotal()
}

function uppercase (e) {
  let value = $(e.target).val()
  $(e.target).val(value.toUpperCase())
}

function updateCount () {
  $('.item-row').each(function (i, e) {
    $(e).find('.count').val(i)
  })
}

$.ui.autocomplete.prototype._renderItem = function (ul, item) {
  item.label = item.label.replace(new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + $.ui.autocomplete.escapeRegex(this.term) + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<strong style="background: yellow">$1</strong>')
  return $('<li></li>')
    .data('item.autocomplete', item)
    .append('<a>' + item.label + '</a>')
    .appendTo(ul)
}

function showDelete () {
  $('.item-count:last').hover(function () {
    let ind = $(this).find('.delete').css('z-index')
    Number(ind) === 0
      ? $(this).find('.delete').css('z-index', '-1')
      : $(this).find('.delete').css('z-index', '0')
  })
}

$(document).ready(function () {
  myArray.sort()
  for (let index = 1; index <= 5; index++) {
    addRow()
  }
  $('#cbLogo').click(showHideLogo)
  $('#addrow').click(addRow)
  $(document).keydown((e) => {
    if (e.keyCode === 45) {
      addRow()
    }
  })
  $('#date').text(printToday())
  $('#dds').val('0.00')
  $('#grand-discount').val('0.00')
  updatePrice()
})
