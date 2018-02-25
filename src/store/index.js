/**
 * Created by Administrator on 2017/11/27.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
  userInfo:{},
  message:{},
  count:0
};

const mutations = {

};

const actions = {
  updateUserInfo:({commit}) => commit("updateUserInfo")
};

const  getters = {
  userInfo: state => {
    return state.userInfo
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
