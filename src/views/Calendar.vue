<template>
    <div>
        <div class="card">
            <div class="card-body" v-if="this.$store.state.user.type == 'doctor'"
                 v-bind:class="{ toggled: sidebarToggled }">
                <div id="calendar-container">
                        <terms-calendar ref="terms"></terms-calendar>
                </div>
                <div id="calendar-sidebar">
                    <v-calendar :attributes='attrs' v-on:dayclick="setCalendarDate"></v-calendar>
                    <next-visits></next-visits>
                </div>
                <div class="sidebar-toggle text-muted">
                    <i @click="sidebarToggle" v-if="!sidebarToggled" class="fa fa-chevron-right" aria-hidden="true"
                    title="Schowaj panel"></i>
                    <i @click="sidebarToggle" v-if="sidebarToggled" class="fa fa-chevron-left" aria-hidden="true"
                    title="Pokaż panel"></i>
                </div>
            </div>
            <div class="card-body" v-else>
                <filters @search-doctors="searchDoctors"></filters>
                <div class="mt-4" id="calendar-with-table">
                    <div style="width: 250px; margin-right: 10px; margin-bottom: 6px;">
                        <doctors-list ref="doctorsList" @load-calendar="loadDoctorCalendar"></doctors-list>
                    </div>
                    <div style="width: calc(100% - 260px);">
                        <terms-calendar ref="terms"></terms-calendar>
                    </div>
                </div>
            </div>
        </div>
        <button v-permission="'add_visit'" class="btn bottom-right button-add font-lg" @click="addNewVisit"><i class="fa fa-plus"></i></button>
    </div>
</template>
<script>
import TermsCalendar from '@/components/Calendar/TermsCalendar'
import NextVisits from '@/components/Calendar/NextVisits'
import Filters from '@/components/Calendar/Filters'
import DoctorsList from '../components/Calendar/DoctorsList'
export default {
  name: 'calendar',
  methods: {
    sidebarToggle () {
      this.sidebarToggled = !this.sidebarToggled
    },
    loadDoctorCalendar (doctor) {
      this.doctor = doctor.id
      this.$refs.terms.loadDoctorCalendar(doctor)
    },
    searchDoctors (params) {
      this.$refs.doctorsList.searchDoctors(params)
    },
    setCalendarDate (payload) {
      this.attrs[0].dates = payload.date
      this.$refs.terms.$refs.calendar.fireMethod('gotoDate', payload.date)
    },
    addNewVisit () {
      this.$refs.terms.addNewVisit()
    }
  },
  data: () => {
    return {
      doctor: 0,
      sidebarToggled: false,
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#008cba'
            // Other properties are available too, like `height` & `borderRadius`
          },
          contentStyle: {
            color: '#fafafa'
          },
          dates: new Date(new Date().setHours(0, 0, 0, 0))
        }
      ]
    }
  },
  components: {
    DoctorsList,
    NextVisits,
    Filters,
    TermsCalendar
  }
}
</script>
<style>
    .toggled #calendar-container {
        width: 100%;
    }
    .toggled #calendar-sidebar div:not(.sidebar-toggle) {
        display: none;
    }
    #calendar-with-table {
        display: flex;
    }
    #calendar-sidebar {
        display: inline-block;
        width: 295px;
        text-align: right;
    }
    #calendar-sidebar ul {
        list-style: none;
    }
    #calendar-container {
        vertical-align: top;
        display: inline-block;
        width: calc(100% - 300px);
    }
    .c-day-content {
        cursor: pointer!important;
    }
    .sidebar-toggle {
        display: inline-block;
        float: right;
    }
    .sidebar-toggle i {
        cursor: pointer;
    }
</style>
