<template>
    <div class="card">
        <label>Typ użytkownika:</label>
        <select v-model="role">
            <option>Lekarz</option>
            <option>Rejestracja</option>
            <option>Administracja</option>
        </select>
    </div>
</template>
<script>
export default {
  name: 'user-type',
  data () {
    return {
    }
  }
}
</script>
