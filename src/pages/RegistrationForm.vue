<template>
  <v-form v-model="valid">
    <v-subheader class="pa-0 mt-0">CONTACT DETAILS</v-subheader>
    <!-- FIRST NAME -->
    <v-text-field
      label="First Name"
      name="firstName"
      placeholder="Juan"
      v-model="formModel.firstName"
      v-validate="'required'"
      data-vv-name="firstName"
      :error-messages="errors.collect('firstName')"
    ></v-text-field>

    <!-- LAST NAME -->
    <v-text-field
      label="Last Name"
      name="lastName"
      placeholder="Fajardo"
      v-model="formModel.lastName"
      v-validate="'required'"
      data-vv-name="lastName"
      :error-messages="errors.collect('lastName')"
    ></v-text-field>

    <!-- GIVEN NAME -->
    <v-text-field
      label="Given Name"
      name="givenName"
      placeholder="If you go by another name..."
      v-model="formModel.lastName"
      data-vv-name="givenName"
      :error-messages="errors.collect('givenName')"
    ></v-text-field>

    <!-- EMAIL -->
    <v-text-field
      label="Email"
      placeholder="jfajardo@mit.edu"
      name="email"
      v-validate="'required|email'"
      data-vv-name="email"
      :error-messages="errors.collect('email')"
      v-model="formModel.email"
    ></v-text-field>

    <!-- PHONE -->
    <v-text-field
      label="Phone"
      placeholder="(###) ### - ####"
      v-validate="'required'"
      data-vv-name="phone"
      :error-messages="errors.collect('phone')"
      v-model="formModel.phone"
      mask="phone"
    ></v-text-field>

    <!-- STATE -->
    <v-select
      name="state"
      :items="states"
      v-validate="'required'"
      data-vv-name="state"
      :error-messages="errors.collect('state')"
      v-model="formModel.state"
      label="Hometown State"
      item-text="name"
      item-value="id"
    ></v-select>

    <!-- FACEBOOK -->
    <v-text-field
      label="Facebook"
      placeholder="Copy/paste Facebook profile URL here"
      v-model="formModel.fb"
      data-vv-name="fb"
      name="fb"
      :error-messages="errors.collect('fb')"
    ></v-text-field>

    <!-- SNAPCHAT -->
    <v-text-field
      label="Snapchat"
      placeholder="Snap handle"
      v-model="formModel.snapchat"
      data-vv-name="snapchat"
      name="snapchat"
      :error-messages="errors.collect('snapchat')"
  ></v-text-field>

    <!-- YEAR -->
    <v-select
      :items="years"
      name="year"
      v-validate="'required'"
      data-vv-name="year"
      :error-messages="errors.collect('year')"
      v-model="formModel.year"
      label="Class Year"
    ></v-select>

    <!-- INTERESTS -->
    <v-select
      label="Interests"
      name="interests"
      deletable-chips
      tags
      placeholder="Music"
      hint="Press enter after each interest"
      clearable
      v-model="formModel.interests"
    >
      <template slot="selection" slot-scope="data">
        <v-chip
          @input="remove(data.item)"
          :selected="data.selected"
        >
          <strong>{{ data.item }}</strong>&nbsp;
        </v-chip>
      </template>
    </v-select>

    <!-- BUTTONS -->
    <div class="form-btn">
      <v-btn @click="submit" color="primary">Submit</v-btn>
      <v-btn @click="clear">Clear</v-btn>
    </div>
  </v-form>
</template>

<script>

export default {
  $_veeValidate: {
    validator: 'new'
  },

  data: () => ({
    formModel: {
      country: null
    },
    states: [
      'Alabama',
      'Alaska',
      'American Samoa',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'District of Columbia',
      'Federated States of Micronesia',
      'Florida',
      'Georgia',
      'Guam',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Marshall Islands',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Carolina',
      'North Dakota',
      'Northern Mariana Islands',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Palau',
      'Pennsylvania',
      'Puerto Rico',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virgin Island',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming'
    ],
    valid: true
  }),

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    submit: function () {
      this.$validator.validateAll()
    },
    clear: function () {
      this.formModel = {}
      this.$validator.reset()
    }
  },

  computed: {
    years: function () {
      var dt = new Date()
      var years = []

      for (var i = 0; i < 5; i++) {
        var year = dt.getFullYear()
        years.push(year)
        dt.setFullYear(year + 1)
      }

      return years
    }
  }
}

</script>
