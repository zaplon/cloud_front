<template>
    <div>
        <generic-form ref="form" :fields="fields"></generic-form>
        <span class="mb-2 mt-4"><strong>Opakowania</strong></span>
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Wielkość opakowania</th>
                <th>Kod EAN</th>
                <th>Kategoria dostępności</th>
                <th>Refundacja</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr :key="child.id" v-for="(child, index) in children">
                <td><input type="text" v-model="child.size" class="form-control"></td>
                <td><input type="text" v-model="child.ean" class="form-control"></td>
                <td>
                    <select v-model="child.availability_cat" class="form-control">
                        <option :title="cat.desc" :value="cat.name" v-for="cat in availabilityCats" :key="cat.name">
                            {{cat.name}}
                        </option>
                    </select>
                </td>
                <td>
                    <select v-model="child.refundations" class="form-control">
                        <option :value="r" v-for="r in refundations" :key="r">
                            {{r}}
                        </option>
                    </select>
                <td>
                    <button @click="addChild" v-if="index == children.length - 1" class="btn-success btn">
                        <i class="fa fa-plus"></i>
                    </button>
                    <button @click="removeChild(child.id)" v-else class="btn-danger btn"><i class="fa fa-times"></i></button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios'
import GenericForm from './GenericForm'
export default {
  name: 'medicine',
  params: {
    instanceId: {
      type: Boolean,
      default: 0,
      required: false
    }
  },
  components: {GenericForm},
  data () {
    return {
      medicine: {},
      endpointUrl: 'rest/medicine_parents/',
      availabilityCats: [
        {name: 'OTC', desc: 'wydawane bez przepisu lekarza'},
        {name: 'Rp', desc: 'wydawane z przepisu lekarza'},
        {name: 'Rpz', desc: 'wydawane z przepisu lekarza do zastrzeżonego stosowania'},
        {name: 'Rpw', desc: 'wydawane z przepisu lekarza, zawierające środki odurzające lub substancje psychotropowe, określone w odrębnych przepisach'},
        {name: 'Lz', desc: 'stosowane wyłącznie w lecznictwie zamkniętym'}
      ],
      refundations: ['30%', '50%', 'bezpłatny', 'ryczałt'],
      children: [{size: '', ean: '', availability_cat: '', refundations: ''}],
      fields: [
        {name: 'name', label: 'Nazwa'},
        {name: 'composition', label: 'Skład'},
        {name: 'form', label: 'Postać'},
        {name: 'dose', label: 'Dawka'}
      ]
    }
  },
  methods: {
    getBlankRow () {
      return {size: '', ean: '', availability_cat: '', refundations: ''}
    },
    removeChild (id) {
      let index = this.children.indexOf(x => x.id === id)
      this.children.splice(index, 1)
    },
    addChild () {
      this.children.push(this.getBlankRow())
    },
    getData () {
      let formData = this.$refs.form.getData()
      formData.children = this.children
      var isFilled = false
      for (let field in formData.children[-1]) {
        if (formData.children[-1][field]) {
          isFilled = true
        }
      }
      if (!isFilled) { formData.children.splice(0, -1) }
      return formData
    },
    setData (data) {
      this.$refs.form.setData(data)
    },
    setChildren (children) {
      children.concat(this.$refs.form.children)
      this.$refs.form.children = children
    },
    save () {
      let data = this.getData()
      if (this.$route.params.id) {
        axios.patch(this.endpointUrl + this.$route.params.id + '/', data).then(response => {
          this.$router.push({name: 'medicinesList'})
        }).catch(error => {
          this.$refs.form.errors = error.response.data
        })
      } else {
        axios.post(this.endpointUrl, data).then(response => {
          this.$router.push({name: 'medicinesList'})
        }).catch(error => {
          this.$refs.form.errors = error.response.data
        })
      }
    }
  }
}
</script>
