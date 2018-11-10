var glasses = {
  sx1: 89,
  sy1: 87,
  sx2: 282,
  sy2: 87,
  r: 54,
  OL: -1,
  OP: -1,
  getData: function () {
    if (!$('#glasses-one')) { return '' }
    var tb2 = {}
    $('#glasses-two tbody').children().each(function (i, r) {
      tb2[i] = (r.children[1].innerHTML)
    })
    var data = {}
    data.tabela1 = getDataFromTable('#glasses-one', true)
    data.tabela2 = tb2
    data.zl = $('#zl').html()
    data.zp = $('#zp').html()
    data.op = glasses.OP
    data.ol = glasses.OL
    data.oprawa = $('#oprawa').html()
    data.szkla = $('#szkla').html()
    data.name = $('span#name input').val()
    return data
  },
  createRegions: function (co) {
    for (var a = 0; a >= -180; a = a - 10) {
      this.createRegion(co, a, this.r, this.sx1, this.sy1, false)
      this.createRegion(co, a, this.r, this.sx2, this.sy2, false)
    }
  },
  createRegion: function (co, a, r, sx, sy, fill) {
    var step = 9

    var y1 = sy + Math.round(Math.sin(2 * Math.PI / 360 * a) * r)
    var x1 = sx + Math.round(Math.cos(2 * Math.PI / 360 * a) * r)

    a = a - step

    var y2 = sy + Math.round(Math.sin(2 * Math.PI / 360 * a) * r)
    var x2 = sx + Math.round(Math.cos(2 * Math.PI / 360 * a) * r)

    r = r * 1.3

    a = a + step

    var y3 = sy + Math.round(Math.sin(2 * Math.PI / 360 * a) * r)
    var x3 = sx + Math.round(Math.cos(2 * Math.PI / 360 * a) * r)

    a = a - step

    var y4 = sy + Math.round(Math.sin(2 * Math.PI / 360 * a) * r)
    var x4 = sx + Math.round(Math.cos(2 * Math.PI / 360 * a) * r)

    co.beginPath()
    co.fillStyle = '#499bea'
    co.moveTo(x1, y1)
    co.lineTo(x2, y2)
    co.lineTo(x4, y4)
    co.lineTo(x3, y3)
    co.closePath()
    if (fill) {
      co.stroke()
      co.fill()
    }
  },
  drawArrow: function (co, x1, y1, x2, y2) {
    co.beginPath()
    co.strokeStyle = '#499bea'
    co.lineWidth = 2
    co.moveTo(x1, y1)
    co.lineTo(x2, y2)
    co.stroke()
  },
  saveAngle: function (eye, a) {
    a = Math.abs(a)
    if (eye === 1) { glasses.OP = a } else { glasses.OL = a }
  },
  tableCalc: function (e) {
    console.log(e)
    if (isNaN(e.target.innerHTML)) { e.target.innerHTML = 0 }
    // $(e.target).html(parseFloat(e.target.innerHTML));
    var st_num = 0
    var t_num = 0
    $('td[addTo="st"]').each(function (i, r) {
      if (r.innerHTML != '') st_num = st_num + parseFloat(r.innerHTML)
    })
    $('td[action="subtotal"]').html(st_num)
    $('td[addTo="t"]').each(function (i, r) {
      if (r.innerHTML != '') t_num = t_num + parseFloat(r.innerHTML)
    })
    console.log('qqqq')
    console.log(st_num)
    $('td[action="total"]').html(t_num)
  },
  clearAngleSelection: function () {
    glasses.OP = -1
    glasses.OL = -1
    var canvas = document.getElementById('glasses-top')
    var co = canvas.getContext('2d')
    co.clearRect(0, 0, Math.round(canvas.width), canvas.height)
  },
  init: function () {
    active = 0
    $('#glasses-one td').keydown(function (e) {
      var cell = e.target
      cell = $(cell)
      if (e.keyCode == 38) {
        console.log('qqqqq')
        $('#glasses-one td.one').focus()
      }
    })

    $('#glasses-one td').click(function () {

    })

    $('#glasses-two').keyup(glasses.tableCalc)

    $('.menu-bar li#print-g').click(function (e) {
      var d = glasses.getData()
      d = JSON.stringify(d)
      $.post('printGlasses', {'data': d.replace('<br>', '')}).done(function (r) {
        if (SPSR_autoPrint) {
          rp.print(r, 1)
        } else { window.open(r) }
      })
    })

    var canvas = document.getElementById('glasses')
    var context = canvas.getContext('2d')
    var canvas2 = document.getElementById('glasses-top')
    var context2 = canvas.getContext('2d')

    imageObj = new Image()

    glasses.createRegions(context)
    context.save()

    $('#clearAngleSelection').click(function () {
      glasses.clearAngleSelection()
    })

    canvas2.onmousemove = function (e) {
      var ca = e.target
      var co = ca.getContext('2d')
      var x = e.offsetX
      var y = e.offsetY
      canvas2.style.cursor = 'default'
      for (var a = 0; a >= -180; a = a - 10) {
        glasses.createRegion(co, a, glasses.r, glasses.sx1, glasses.sy1, false)
        if (co.isPointInPath(x, y)) {
          canvas2.style.cursor = 'pointer'
          return
        }
      }
      for (var a = 0; a >= -180; a = a - 10) {
        glasses.createRegion(co, a, glasses.r, glasses.sx2, glasses.sy2, false)
        if (co.isPointInPath(x, y)) {
          canvas2.style.cursor = 'pointer'
          return
        }
      }
    }
    canvas2.onclick = function (e) {
      var ca = e.target
      var co = ca.getContext('2d')
      var x = e.offsetX
      var y = e.offsetY

      for (var a = 0; a >= -180; a = a - 10) {
        glasses.createRegion(co, a, glasses.r, glasses.sx1, glasses.sy1, false)
        if (co.isPointInPath(x, y)) {
          console.log('in')
          var x2 = glasses.sx1 + Math.round(Math.cos(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * glasses.r * 1.15)
          var y2 = glasses.sy1 + Math.round(Math.sin(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * glasses.r * 1.15)
          console.log('arrow')
          console.log(x2)
          console.log(y2)
          var canvas = document.getElementById('glasses-top')
          var co = canvas.getContext('2d')
          co.clearRect(0, 0, Math.round(canvas.width / 2), canvas.height)
          glasses.drawArrow(co, glasses.sx1, glasses.sy1, x2, y2)
          glasses.createRegion(co, a, glasses.r, glasses.sx1, glasses.sy1, true)
          glasses.saveAngle(1, a)
          return
        }
      }
      for (var a = 0; a >= -180; a = a - 10) {
        glasses.createRegion(co, a, glasses.r, glasses.sx2, glasses.sy2, false)
        if (co.isPointInPath(x, y)) {
          console.log('in')
          var x2 = glasses.sx2 + Math.round(Math.cos(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * glasses.r * 1.15)
          var y2 = glasses.sy2 + Math.round(Math.sin(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * glasses.r * 1.15)
          var canvas = document.getElementById('glasses-top')
          var co = canvas.getContext('2d')
          co.clearRect(Math.round(canvas.width / 2), 0, canvas.width, canvas.height)
          glasses.drawArrow(co, glasses.sx2, glasses.sy2, x2, y2)
          glasses.createRegion(co, a, glasses.r, glasses.sx2, glasses.sy2, true)
          glasses.saveAngle(2, a)
          return
        }
      }
    }
  }

}

// $('#glasses-one').dataTable();
export default glasses
