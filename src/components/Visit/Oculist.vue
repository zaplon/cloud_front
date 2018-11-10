<template>
    <div>
        <div class="row">
            <form id="this-form">
                <input name="op" type="hidden" value="-1">
                <input name="ol" type="hidden" value="-1">
            </form>
            <div class="col-md-12">
                <canvas @mousemove="canvasOver($event)" @click="canvasClick($event)" id="this-top" width="380" height="150" style="position: absolute; z-index: 2; cursor: default;"></canvas>
                <canvas id="this" width="380" height="150" style="position:absolute; z-index:1;"></canvas>
            </div>
        </div>
        <div class="row mb-1" style="margin-top: 160px;">
            <div class="col-md-4">
                <div @click="clearAngleSelection" class="btn btn-secondary">Usuń zaznaczenie</div>
                <div @click="print" class="mr-2 btn btn-primary">Drukuj</div>
            </div>
        </div>
        <div class="row oculist-tables">
            <div class="col-md-8">
                <table id="this-one" class="table table-striped table-bordered">
                    <colgroup></colgroup>
                    <thead class="blue">
                    <tr>
                        <th ></th>
                        <th ></th>
                        <th>Sfera</th>
                        <th>Cylinder</th>
                        <th>Oś</th>
                        <th>Pryzma</th>
                        <th ></th>
                        <th ></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td rowspan="2">Do dali</td>
                        <td>OP</td>
                        <td><input type="text" class="text-control" v-model="table[0]"></td>
                        <td><input type="text" class="text-control" v-model="table[1]"></td>
                        <td><input type="text" class="text-control" v-model="table[2]"></td>
                        <td><input type="text" class="text-control" v-model="table[3]"></td>
                        <td rowspan="2">Odl. źrenic</td>
                        <td rowspan="2"><input type="text" class="text-control" v-model="table[94]"></td>
                    </tr>
                    <tr>
                        <td>OL</td>
                        <td><input type="text" class="text-control" v-model="table[4]"></td>
                        <td><input type="text" class="text-control" v-model="table[5]"></td>
                        <td><input type="text" class="text-control" v-model="table[6]"></td>
                        <td><input type="text" class="text-control" v-model="table[7]"></td>
                    </tr>
                    <tr>
                        <td rowspan="2">Do bliży</td>
                        <td>OP</td>
                        <td><input type="text" class="text-control" v-model="table[8]"></td>
                        <td><input type="text" class="text-control" v-model="table[9]"></td>
                        <td><input type="text" class="text-control" v-model="table[10]"></td>
                        <td><input type="text" class="text-control" v-model="table[11]"></td>
                        <td rowspan="2">Odl. źrenic</td>
                        <td rowspan="2"><input type="text" class="text-control" v-model="table[93]"></td>
                    </tr>
                    <tr>
                        <td>OL</td>
                        <td><input type="text" class="text-control" v-model="table[12]"></td>
                        <td><input type="text" class="text-control" v-model="table[13]"></td>
                        <td><input type="text" class="text-control" v-model="table[14]"></td>
                        <td><input type="text" class="text-control" v-model="table[15]"></td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>SZKŁA</td>
                        <td colspan="3"><input type="text" class="text-control" v-model="table[16]"></td>
                        <td>OPRAWA</td>
                        <td colspan="3"><input type="text" class="text-control" v-model="table[17]"></td>
                    </tr>
                    </tfoot>
                </table>
                <span class="text-muted">Podpowiedź: zmiana komórki tabeli za pomocą klawisza TAB</span>
            </div>
            <div class="col-md-4">
                <table class="table table-striped table-bordered" id="this-two">
                    <colgroup>
                        <col style="width:60%;">
                        <col style="width:40%;">
                    </colgroup>
                    <thead>
                    <tr>
                        <th>MIEJSCE DLA WYCENY</th>
                        <th>Koszt [zł]</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Oprawa</td>
                        <td>
                            <input type="text" pattern="/d" class="text-control" v-model="oprawa">
                        </td>
                    </tr>
                    <tr>
                        <td>Cena oprawy odliczona od droższej oprawy</td>
                        <td>
                            <input type="text" pattern="/d" class="text-control" v-model="cenaOprawy">
                        </td>
                    </tr>
                    <tr>
                        <td>Prawe szkło</td>
                        <td>
                            <input type="text" pattern="/d" class="text-control" v-model="praweSzklo">
                        </td>
                    </tr>
                    <tr>
                        <td>Lewe szkło</td>
                        <td>
                            <input type="text" pattern="/d" class="text-control" v-model="leweSzklo">
                        </td>
                    </tr>
                    <tr>
                        <td>Futerł</td>
                        <td>
                            <input type="text" pattern="/d" class="text-control" v-model="futeral">
                        </td>
                    </tr>
                    <tr>
                        <td>Suma</td>
                        <td>
                            {{ suma }}
                        </td>
                    </tr>
                    <tr>
                        <td>Usługa</td>
                        <td><input type="text" pattern="/d" class="text-control" v-model="usluga"></td>
                    </tr>
                    <tr>
                        <td>Razem</td>
                        <td>
                            {{ razem }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import EventBus from '@/eventBus'
export default {
  name: 'oculist',
  props: {
    patient: Object
  },
  methods: {
    getData () {
      return this.data
    },
    loadData (data) {
      for (let d in data) {
        this[d] = data[d]
      }
    },
    print () {
      var data = {tabela2: [this.oprawa, this.cenaOprawy, this.praweSzklo, this.leweSzklo, this.futeral,
        this.suma, this.usluga, this.razem],
      tabela1: this.table,
      op: this.OP,
      ol: this.OL,
      name: this.patient.first_name + ' ' + this.patient.last_name}
      axios.post('visit/oculist_recipe/', data).then((response) => {
        let url = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data
        EventBus.$emit('show-document', url, 'Recepta okulistyczna')
      })
    },
    initialize () {
      this.canvas = document.getElementById('this')
      this.context = this.canvas.getContext('2d')
      this.canvas2 = document.getElementById('this-top')
      this.context2 = this.canvas.getContext('2d')
      this.imageObj = new Image()
      this.createRegions(this.context)
      this.context.save()
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
      if (eye === 1) { this.OP = a } else { this.OL = a }
    },
    clearAngleSelection () {
      this.OP = -1
      this.OL = -1
      var canvas = document.getElementById('this-top')
      var co = canvas.getContext('2d')
      co.clearRect(0, 0, Math.round(canvas.width), canvas.height)
    },
    canvasOver (e) {
      console.log('over')
      var ca = e.target
      var co = ca.getContext('2d')
      var x = e.offsetX
      var y = e.offsetY
      this.canvas2.style.cursor = 'default'
      for (let a = 0; a >= -180; a = a - 10) {
        this.createRegion(co, a, this.r, this.sx1, this.sy1, false)
        if (co.isPointInPath(x, y)) {
          this.canvas2.style.cursor = 'pointer'
          return
        }
      }
      for (let a = 0; a >= -180; a = a - 10) {
        this.createRegion(co, a, this.r, this.sx2, this.sy2, false)
        if (co.isPointInPath(x, y)) {
          this.canvas2.style.cursor = 'pointer'
          return
        }
      }
    },
    canvasClick (e) {
      var ca = e.target
      var co = ca.getContext('2d')
      var x = e.offsetX
      var y = e.offsetY

      for (let a = 0; a >= -180; a = a - 10) {
        this.createRegion(co, a, this.r, this.sx1, this.sy1, false)
        if (co.isPointInPath(x, y)) {
          let x2 = this.sx1 + Math.round(Math.cos(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * this.r * 1.15)
          let y2 = this.sy1 + Math.round(Math.sin(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * this.r * 1.15)
          let canvas = document.getElementById('this-top')
          let co = canvas.getContext('2d')
          co.clearRect(0, 0, Math.round(canvas.width / 2), canvas.height)
          this.drawArrow(co, this.sx1, this.sy1, x2, y2)
          this.createRegion(co, a, this.r, this.sx1, this.sy1, true)
          this.saveAngle(1, a)
          return
        }
      }
      for (let a = 0; a >= -180; a = a - 10) {
        this.createRegion(co, a, this.r, this.sx2, this.sy2, false)
        if (co.isPointInPath(x, y)) {
          let x2 = this.sx2 + Math.round(Math.cos(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * this.r * 1.15)
          let y2 = this.sy2 + Math.round(Math.sin(2 * Math.PI / 360 * a - 2 * Math.PI / 360 * 4.5) * this.r * 1.15)
          let canvas = document.getElementById('this-top')
          let co = canvas.getContext('2d')
          co.clearRect(Math.round(canvas.width / 2), 0, canvas.width, canvas.height)
          this.drawArrow(co, this.sx2, this.sy2, x2, y2)
          this.createRegion(co, a, this.r, this.sx2, this.sy2, true)
          this.saveAngle(2, a)
          return
        }
      }
    },
    addPointer (e) {
      var ca = e.target
      var co = ca.getContext('2d')
      var x = e.offsetX
      var y = e.offsetY
      this.canvas2.style.cursor = 'default'
      for (let a = 0; a >= -180; a = a - 10) {
        this.createRegion(co, a, this.r, this.sx1, this.sy1, false)
        if (co.isPointInPath(x, y)) {
          this.canvas2.style.cursor = 'pointer'
          return
        }
      }
      for (let a = 0; a >= -180; a = a - 10) {
        this.createRegion(co, a, this.r, this.sx2, this.sy2, false)
        if (co.isPointInPath(x, y)) {
          this.canvas2.style.cursor = 'pointer'
          return
        }
      }
    }
  },
  data () {
    return {
      sx1: 89,
      sy1: 87,
      sx2: 282,
      sy2: 87,
      r: 54,
      OL: -1,
      OP: -1,
      table: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      futeral: null,
      leweSzklo: null,
      praweSzklo: null,
      cenaOprawy: null,
      oprawa: null,
      usluga: null
    }
  },
  computed: {
    suma () {
      return (this.futeral ? parseInt(this.futeral) : 0) + (this.praweSzklo ? parseInt(this.praweSzklo) : 0) +
          (this.leweSzklo ? parseInt(this.leweSzklo) : 0) + (this.oprawa ? parseInt(this.oprawa) : 0) +
          (this.cenaOprawy ? parseInt(this.cenaOprawy) : 0)
    },
    razem () {
      return this.suma + (this.usluga ? parseInt(this.usluga) : 0)
    }
  },
  mounted () {
    this.initialize()
  }
}
</script>
<style>
    .oculist-tables input {
        width: 40px;
    }
</style>
