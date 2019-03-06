<template>
    <div class="card">
        <div class="card-body">
            <button class="btn btn-primary" @click="getXml">Pobierz oświadczenie</button>
        </div>
    </div>
</template>
<script>
import {ezla} from '@/api'
export default {
  name: 'EZLA',
  methods: {
    getXml () {
      window.open('data:application/octet-stream,' + encodeURIComponent(ezla.getXml()))
    }
  }
}
</script>
