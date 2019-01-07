<template>
  <v-container fluid grid-list-md id="party-iterator">
    <v-data-iterator
      :items="parties"
      :rows-per-page-items="[4]"
      :pagination.sync="pagination"
      content-tag="v-layout"
      row
      wrap
      :search="partySearch"
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg3
      >
        <v-card>
          <v-card-title class="subheading font-weight-bold">{{ props.item[partyKeys.name] }}</v-card-title>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Theme:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.theme] }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Start:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.startTimestamp] }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>End:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.endTimestamp] }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Capacity:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.capacity] }}</v-list-tile-content>
            </v-list-tile>
          </v-list>

          <v-divider class="mt-1"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="secondary"><v-icon>edit</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="primary"><v-icon>face</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="white"><v-icon color="black">photo_camera</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="accent"><v-icon>delete</v-icon></v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { partyKeys } from '../api'

export default {
  name: 'party-iterator',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      pagination: {
        rowsPerPage: 4
      }
    }
  },

  computed: {
    partyKeys () {
      return partyKeys
    },

    parties () {
      return this.partyObjects.map((partyObj) => {
        console.log(partyObj)
        return {
          [partyKeys.name]: partyObj[partyKeys.name],
          [partyKeys.capacity]: partyObj[partyKeys.capacity],
          [partyKeys.theme]: partyObj[partyKeys.theme],
          [partyKeys.startTimestamp]: this.dateForTimestamp(partyObj[partyKeys.startTimestamp]),
          [partyKeys.endTimestamp]: this.dateForTimestamp(partyObj[partyKeys.endTimestamp])
        }
      })
    },

    ...mapState({
      partyObjects: state => state.socialStore.parties,
      partySearch: state => state.socialStore.partySearch
    })
  },

  //------------------+
  //      METHODS     |
  //------------------+

  methods: {
    dateForTimestamp (item) {
      const itemDate = new Date(item.seconds * 1000)

      const date = itemDate.getDate()
      const month = itemDate.getMonth() + 1 // Months are zero based
      const year = itemDate.getFullYear()
      const twoDigitYear = year.toString().slice(2)

      var hour = itemDate.getHours()
      var amOrPm = hour < 12 ? 'AM' : 'PM'

      hour = hour % 12
      if (hour === 0) hour = 12

      const minute = itemDate.getMinutes()
      var minuteString = (minute.toString().length === 1 ? '0' : '') + minute

      return month + '/' + date + '/' + twoDigitYear + ' @ ' + hour + ':' + minuteString + ' ' + amOrPm
    }
  },

  // https://vuejs.org/v2/api/#watch
  watch: {
    msg: 'someMethod'
  }
}
</script>
