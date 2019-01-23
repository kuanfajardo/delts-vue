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
      v-model="formModel.givenName"
      data-vv-name="givenName"
      :error-messages="errors.collect('givenName')"
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

    <v-text-field
      label="Password"
      placeholder=""
      v-validate="'required|min:6'"
      type="password"
      data-vv-name="password"
      :error-messages="errors.collect('password')"
      v-model="formModel.password"
      ref="passwordField"
    ></v-text-field>
    <v-text-field
      label="Repeat Password"
      placeholder=""
      v-validate="'required|confirmed:passwordField'"
      type="password"
      data-vv-name="repeat password"
      :error-messages="errors.first('repeat password')"
      v-model="formModel.repeatPassword"
    ></v-text-field>

    <!-- BUTTONS -->
    <div class="form-btn">
      <v-btn @click="submit" color="primary">Submit</v-btn>
      <v-btn @click="clear">Clear</v-btn>
    </div>
  </v-form>
</template>

<script>
import appEvents from '@/events/names'
import { getClassYears, stateNames } from '../definitions'

export default {
  $_veeValidate: {
    validator: 'new'
  },

  data () {
    return {
      formModel: {
        firstName: null,
        lastName: null,
        givenName: null,
        phone: null,
        state: null,
        fb: null,
        snapchat: null,
        year: null,
        interests: null,
        password: null,
        repeatPassword: null
      },
      states: stateNames,
      years: getClassYears(),
      valid: true
    }
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    submit: function () {
      this.$validator.validateAll().then(
        valid => {
          if (valid) {
            // TODO: Push user data to server
            this.$_glob.root.$emit(appEvents.loginSuccess)
          }
        }
      )
    },

    clear: function () {
      this.formModel = {}
      this.$validator.reset()
    }
  }
}

</script>
