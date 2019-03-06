import Vue from 'vue'
import App from './App.vue'
import {Row,Col,Dialog,Progress,Input,Button} from 'element-ui';
import Scrollbar from 'element-ui/lib/scrollbar'
import 'element-ui/lib/theme-chalk/index.css';
import './libs/base.scss'
import './libs/base'

Vue.use(Row);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Progress);
Vue.use(Input);
Vue.use(Button);
Vue.use(Scrollbar);

new Vue({
  el: '#app',
  render: h => h(App)
})
