import { loginApi, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    user: null,
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER: (state, payload) => {
    state.user = payload;
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo).then(res => {
        const { data } = res;
        //console.log(data, 'xxxx');
        if (data) {
          // 说明 data 里面有数据
          commit('SET_USER', data);
          resolve();
        } else {
          console.log('in', res)
          reject(res)
        }
      }).catch(error => {
        reject(error);
      })
    })

  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        // console.log(res,'res~~~~~~~~')
        // 失败之后大致格式{'code':401,'msg':"未登录，或登录过期"，'data':null}
        //验证成功返回的是对象，不成功返回的是string
        if (typeof (res) == 'string') {
          //token过期/未登录
          res = JSON.parse(res);
          if (res.code == 401) {
            reject(res.msg);
          }
        } else {
          commit('SET_USER', res.data)
          resolve();
        }
      })



      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     return reject('Verification failed, please Login again.')
      //   }

      //   const { name, avatar } = data

      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()

      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

