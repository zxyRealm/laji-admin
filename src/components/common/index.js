/**
 * Created by Administrator on 2017/11/14.
 */
import Vue from 'vue'
import SideNav from './side_nav.vue'

const components = [
  SideNav
]

const install = function(Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;
  components.map(component => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

export default {
  install
}
