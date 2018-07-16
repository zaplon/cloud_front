<template>
    <form @submit.prevent="save">
        <div class="form-group">
            <label for="file">Plik</label>
            <input @change="onFileChange" required :class="{ 'is-invalid form-control': errors.file, 'form-control': !errors.file }" type="file" id="file">
            <div v-if="errors.file" class="invalid-feedback">{{ errors.file }}</div>
        </div>
    </form>
</template>
<script>
import axios from 'axios'
export default {
  name: 'form-prescription-numbers',
  data () {
    return {
      errors: {file: ''},
      file: null
    }
  },
  methods: {
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      this.file = files[0]
    },
    save (callback) {
      if (!this.file) { this.errors.file = 'To pole jest obowiązkowe' } else { this.errors.file = null }
      if (this.errors.file) { return }
      let formData = new FormData()
      formData.append('file', this.file)
      return axios.post('medicines/prescription-numbers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => callback(response)).catch(error => { this.errors.file = error.response.data })
    }
  }
}
</script>
