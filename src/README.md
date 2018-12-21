# `src` directory packages

### @/assets
Store static assets in here, i.e. images, videos, sounds, etc.

### @/auth
Authentication stuff goes here.

### @/components
All Vue components are stored here, with the exception of components used as `router-link` views (see `@/pages`). 

### @/definitions
Class and enum definitions to be used throughout project.

### @/events
Code for site-wide events goes here. 

If multiple components in different parts of the Vue component tree need to be
notified of an event, rather than use the Vue event propagation, use this code. Names of events go in `@/events/names.js`
and event handling goes in `@/events/index.js`

### @/mixins
Vue mixins go here.

Each mixin should have its own separate file and be exported from `@/mixins/index.js`.

### @/pages
Vue "pages", i.e. components used as `router-link` views, go here.

### @/plugins
All plugins that are NOT "Vue-y" (i.e. Firebase, RPCs, UI plugins, etc.) go here.
 
Each plugin should have their setup script in here. It should then be imported from `@/main.js`.

### @/router
Vue router stuff goes here. 

Define paths in `@/router/paths.js` and add handling (if needed) in `@/router/index.js`.

### @/store
Vue store stuff goes here. 

The actual store is in `@/store/store.js`
Mutation name-constants belong in `@/store/mutation-types.js`. \
Action name-constants belong in `@/store/action-types.js`. \

The store and constants are all packaged and exposed by `@/store/index.js`.
