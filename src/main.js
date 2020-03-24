import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.ignoredElements = [
  'smart-grid'
]

//window.Smart.License = '';
console.log(`Smart.License [${window.Smart.License}]`);

new Vue({
  render: h => h(App),
}).$mount('#app')
