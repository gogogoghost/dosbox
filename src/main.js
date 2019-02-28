import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './libs/base.scss'
import './libs/base'

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
})
