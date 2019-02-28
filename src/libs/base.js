import Vue from 'vue'

Vue.prototype.$utils={
  showLoading(msg){
    return Vue.prototype.$loading({
      lock:true,
      text:msg||'请稍候',
      background:'rgba(0,0,0,0.7)'
    })
  },
  log(msg){
    console.log(msg);
  }
}
