import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    router: [],
    // name: '',
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    router: {},
  };
};

const state = getDefaultState();
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROUTER: (state, rouer) => {
    state.router = rouer;
  },
  SET_ROUTERS: (state, routers) => {
    state.router = routers;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password })
        .then((response) => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          //
          commit("SET_NAME", data.name);
          setToken(data.token);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;
          // commit('SET_ROUTER',data.menu_name_list)
          localStorage.setItem("routers", data.menu_name_list);
          // commit('SET_NAME', name)
          // commit('SET_AVATAR', avatar)
          localStorage.setItem("Systemper", data.button_id_list);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token)
      //   .then(() => {
          localStorage.removeItem("Token"); // must remove  token  first
          resetRouter();
          localStorage.removeItem('per');
          resolve();
          // commit("RESET_STATE");
          // resolve();
        // })
        // .catch((error) => {
        //   reject(error);
        // });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken("Token"); // must remove  token  first
      // removeToken('routers')
      commit("RESET_STATE");
      resolve();
    });
  },
  //将拼合的新路由存入vuex
  addRouters({ commit }, data) {
    return new Promise((resolve) => {
      commit("SET_ROUTERS", data);
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
