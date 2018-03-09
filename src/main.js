// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import filter from './filter'
import store from './store'
import Zepto from 'zepto'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import fileUpload from 'vue-upload-component'
import 'cropperjs/dist/cropper.min.css'
Vue.component('file-upload',fileUpload)
Vue.use(fileUpload)
Vue.prototype.$http = Zepto;
Vue.use(require("./assets/js/fun"));
Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  filter,
  store,
  template: '<App/>',
  components: { App }
});
