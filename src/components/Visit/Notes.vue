<template>
    <div id="notes">
        <form>
            <div class="form-group row">
                <label for="new-note" class="col-md-2 col-form-label tab-focus">Treść notatki</label>
                <div class="col-md-10">
                    <textarea style="height:100px;" max-length="1024" class="form-control" id="new-note" v-model="newNote"></textarea>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-10 offset-md-2">
                    <div class="row">
                        <div class="col-auto">
                            <button class="btn btn-success" :disabled="newNote.length==0" type="button" @click="addNote">Dodaj</button>
                        </div>
                        <div class="col-auto">
                            <div class="form-check">
                                <input type="checkbox" id="privateNote" class="form-check-input" v-model="privateNote">
                                <label for="privateNote">Notatka prywatna</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div>
            <blockquote v-for="note in notes" class="blockquote" :key="note.id">
                <p class="mb-0 row">
                    <span class="col-md-10">{{ note.text }}</span>
                    <span class="col-md-2 text-right pr-2" v-if="note.doctor == doctor.id">
                    <button class="btn btn-sm btn-danger" @click="deleteNote(note)">Usuń</button></span>
                </p>
                <footer class="blockquote-footer">{{ note.author }}
                    <span class="badge badge-info" v-show="note.private"></span>
                </footer>
            </blockquote>
        </div>

        <div class="text-center" v-if="notes.length==0">
            <span class="text-muted">Brak notatek na temat pacjenta</span>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'notes',
  methods: {
    addNote () {
      axios.post('rest/notes/', {text: this.newNote, patient: 1, doctor: this.doctor.id, private: this.privateNote}).then(response => {
        this.notes.push(response.data)
      })
    },
    deleteNote (note) {
      axios.delete('rest/notes/' + note.id).then(response => { this.notes.splice(this.notes.indexOf(note), 1) })
    }
  },
  data () {
    return {
      newNote: '',
      doctor: this.$store.state.user.doctor,
      notes: [],
      privateNote: false
    }
  },
  mounted () {
    axios.get('rest/notes/').then(response => { this.notes = response.data })
  }
}
</script>
