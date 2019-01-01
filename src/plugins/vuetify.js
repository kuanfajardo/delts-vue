import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

export const theme = {
  primary: {
    base: '#0D47A1', // blue darken-4
    light: '#5472d3',
    dark: '#002171'
  },

  secondary: {
    base: '#009688', // teal
    light: '#52c7b8',
    dark: '#00675b'
  },

  error: {
    base: '#E57373', // red lighten-2
    light: '#ffa4a2',
    dark: '#af4448'
  },

  accent: {
    base: '#FF5252', // red accent-2
    light: '#ff867f',
    dark: '#c50e29'
  },

  warning: {
    base: '#8A95FF', // ? : #8C9EFF == indigo accent-1,
    light: '#bec5ff',
    dark: '#5567cb'
  },

  success: {
    base: '#27AF6A', // ? : #00C853 == green accent-4
    light: '#64e299',
    dark: '#007e3e'
  },

  surface: {
    base: '#ffffff',
    darken1: '#eeeeee',
    darken2: '#e0e0e0',
    darken3: '#707070',
    darken4: '#606060'
  },

  background: {
    base: '#fafafa'
  },

  // On Colors
  onPrimary: {
    base: '#FFFFFF',
    light: '#000000',
    dark: '#FFFFFF'
  },

  onSecondary: {
    base: '#FFFFFF',
    light: '#000000',
    dark: '#FFFFFF'
  },

  onError: {
    base: '#FFFFFF',
    light: '#000000',
    dark: '#FFFFFF'
  },

  onAccent: {
    base: '#FFFFFF',
    light: '#000000',
    dark: '#FFFFFF'
  },

  onWarning: {
    base: '#FFFFFF',
    light: '#000000',
    dark: '#FFFFFF'
  },

  onSuccess: {
    base: '#FFFFFF',
    light: '#000000',
    dark: '#FFFFFF'
  },

  onSurface: {
    base: '#000000',
    darken1: '#797A7A',
    darken2: '#000000',
    darken3: '#FFFFFF',
    darken4: '#FFFFFF'
  },

  onBackground: {
    base: '#000000'
  }

  // info: null
}

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: theme
})
