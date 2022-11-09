import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { getInfo } from "@/api/user";
import { constantRoutes } from "@/router/index";
import Layout from "@/layout";
import {resetRouter} from '@/router/index'

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  // NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/login" });
      // next();
      NProgress.done();
    } else {
      //#region
      // const hasGetUserInfo = store.getters.name
      // const routers = localStorage.getItem('routers');
      // if (routers) {
      //   next()
      // } else {
      // try {
      //   // get user info路由数组
      //    await store.dispatch('user/getInfo')
      //    next()

      //   // next()
      // } catch (error) {
      //   // remove token and go to login page to re-login
      //   await store.dispatch('user/resetToken')
      //   Message.error(error || 'Has Error')
      //   next(`/login?redirect=${to.path}`)
      //   NProgress.done()
      // }
      // }
      //#endregion

      ///
      
      if (store.getters.routers&&store.getters.routers.length>0 ) {
        next();
      } else {
        // resetRouter()
        // try {
          getInfo(hasToken).then((res) => {
            //动态生成的后端路由
            let editRouters = generateRouter(res.data.permission_p_list);
            localStorage.setItem('per',res.data.button_id_list);
            //拼合静态路由
            constantRoutes.splice(constantRoutes.length - 2, 0, ...editRouters);
            // localStorage.setItem("routers", constantRoutes);
            // console.log(constantRouters);
            //将拼合后的路由存入vuex
            store.dispatch("user/addRouters", constantRoutes).then((res) => {
              //动态添加路由
              router.addRoutes(store.getters.routers);
              next({ path:'/' })
            });
          });
        

        
        // } catch (error) {
        //   console.log('error');
          // // remove token and go to login page to re-login
          // await store.dispatch("user/resetToken");
          // Message.error(error || "Has Error");
          // next(`/login?redirect=${to.path}`);
          // NProgress.done();
        // }

        //   //动态生成的后端路由
        //   let editRouters = generateRouter(data.permission);
        // //拼合静态路由
        // // constantRoutes[constantRoutes.length-2].push(...editRouters);
        // // constantRoutes.push(...editRouters);
        // console.log(4,constantRoutes);

        // //将拼合后的路由存入vuex
        // store.dispatch('user/addRouters',constantRoutes).then(res=>{
        //   //动态添加路由
        //   router.addRoutes(store.getters.routers);
        // console.log(2,constantRoutes);

        // })
      }
    }
  } else {
    /* has no token*/
    // await store.dispatch('user/getInfo')

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

let generateRouter = function (data) {
  let routes = [];
  for (const iterator of data) {
    let route = {};
    route.path = iterator.path;
    route.component = Layout;

    route.redirect = iterator.path + "/" + iterator.children[0].path;
    route.name = iterator.name;
    route.alwaysShow = true;
    route.sort = iterator.sort;
    route.meta = { title: iterator.title, icon: iterator.icon };

    if (iterator.children&&iterator.children.length>0) {
      route.children = [];
      for (const iterator0 of iterator.children) {
        let child = {};
        child.path = iterator0.path;
        child.name = iterator0.name;
        // child.component = () =>import(`@/views/${iterator0.path}/index`);
        child.component = (resolve) =>
          require([`@/views/${iterator0.path}/index`], resolve);
        child.sort = iterator0.sort;
        child.meta = {
          title: iterator0.title,
          icon: iterator0.icon,
        };
        route.children.push(child);
      }
      route.children.sort((a, b) => a.sort - b.sort);
    }
    routes.push(route);
  }
  routes.sort((a, b) => a.sort - b.sort);
  return routes;
};
