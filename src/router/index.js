import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export let constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },

  //#region
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: '系统管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '角色管理', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: '用户管理', icon: 'user' }
  //     }
  //   ]
  // },
  //#endregion
  ////
  {
    path: "/",
    component: Layout,
    // redirect: "/system/role",
    redirect: "/watch/patient",
    children: [{
      path: 'watch',
      // name: 'patient',
      component: () => import('@/views/patient/index'),
      // meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  //#region
  // {
  //   path: "/system",
  //   component: Layout,
  //   redirect: "/system/role",
  //   name: "System",
  //   alwaysShow: true,
  //   meta: { title: "系统管理", icon: "el-icon-s-tools" },
  //   children: [
  //     {
  //       path: "role",
  //       name: "Role",
  //       component: () => import("@/views/role/index"),
  //       meta: { title: "角色管理", icon: "table" },
  //     },
  //     {
  //       path: "users",
  //       name: "Users",
  //       component: () => import("@/views/users/index"),
  //       meta: { title: "用户管理", icon: "user" },
  //     },
  //   ],
  // },
  // {
  //   path: "/wardF",
  //   component: Layout,
  //   redirect: "/wardF/ward",
  //   name: "WardF",
  //   alwaysShow: true,
  //   meta: { title: "科室管理", icon: "el-icon-s-help" },
  //   children: [
  //     {
  //       path: "ward",
  //       name: "Ward",
  //       component: () => import("@/views/ward/index"),
  //       meta: { title: "病房管理", icon: "el-icon-house" },
  //     },
  //     {
  //       path: "person",
  //       name: "Person",
  //       component: () => import("@/views/person/index"),
  //       meta: { title: "人员管理", icon: "el-icon-user" },
  //     },
  //     {
  //       path: "section",
  //       name: "Section",
  //       component: () => import("@/views/section/index"),
  //       meta: { title: "科室管理", icon: "el-icon-menu" },
  //     },
  //   ],
  // },
  // {
  //   path: "/deviceF",
  //   component: Layout,
  //   redirect: "/deviceF/device",
  //   name: "DeviceF",
  //   alwaysShow: true,
  //   meta: { title: "设备管理", icon: "el-icon-s-help" },
  //   children: [
  //     {
  //       path: "device",
  //       name: "Device",
  //       component: () => import("@/views/device/index"),
  //       meta: { title: "设备管理", icon: "nested" },
  //     },
  //   ],
  // },
  // {
  //   path: "/watch",
  //   component: Layout,
  //   redirect: "/watch/patient",
  //   name: "Watch",
  //   meta: { title: "患者看板", icon: "el-icon-s-help" },
  //   children: [
  //     {
  //       path: "patient",
  //       name: "Patient",
  //       component: () => import("@/views/patient/index"),
  //       meta: { title: "患者看板", icon: "form" },
  //     },
  //   ],
  // },

  //#region
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  //#endregion
  //#region
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //#endregion
  //#region
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },
  //#endregion
  //#endregion
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

//#region
// let oldRouter = [
//   "System",
//   "Role",
//   "User",
//   "WardF",
//   "Ward",
//   "Person",
//   "Section",
//   "DeviceF",
//   "Device",
//   "Watch",
//   "Patient",
// ];
// // ||'System'
// let filterRouter = (localStorage.getItem("routers")||'login,Watch').split(","); //localStorage.getItem('routers');//['System','Role']
// filterRouter.forEach((element) => {
//   oldRouter.forEach((element0, index) => {
//     if (element == element0) {
//       oldRouter.splice(index, 1);
//     }
//   });
// });
// // noRouter = new Set(oldRouter);

// let arr = oldRouter;

// arr.forEach((item, index) => {
//   constantRoutes.forEach((item1, index1, arr1) => {
//     if (item == item1.name) {
//       arr1.splice(index1, 1);
//     }
//     if (item1.children) {
//       item1.children.forEach((item2, index2, arr2) => {
//         if (item == item2.name) {
//           item1.children.splice(index2, 1);
//         }
//       });
//     }
//   });
// });
// localStorage.setItem('allow',1);
//#endregion
// console.log(constantRoutes);
//
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

//#region
// ///
// let generateRouter = function (data) {
//   let routes = [];
//   for (const iterator of data) {
//     let route = {};
//     route.path = iterator.path;
//     route.component = "Layout";
//     route.redirect = iterator.path + "/" + iterator.children[0].path;
//     route.name = iterator.name;
//     route.alwaysShow = true;
//     route.sort = iterator.sort;
//     route.meta = { title: iterator.title, icon: iterator.icon };
//     if (iterator.children) {
//       route.children = [];
//       for (const iterator0 of iterator.children) {
//         let child = {};
//         child.path = iterator0.path;
//         child.name = iterator0.name;
//         // child.component = () =>import(`@/views/${iterator0.path}/index`);
//         child.component = (resolve) =>
//           require([`@/views/${iterator0.path}/index`], resolve);
//         child.sort = iterator0.sort;
//         child.meta = {
//           title: iterator0.title,
//           icon: iterator0.icon,
//         };
//         route.children.push(child);
//       }
//       route.children.sort((a, b) => a.sort - b.sort);
//     }
//     routes.push(route);
//   }
//   routes.sort((a, b) => a.sort - b.sort);
//   return routes;
// };
//#endregion
//#region
// const data = {
//   permission: [
//     {
//       id: 1,
//       pid: "0",
//       name: "System",
//       title: "科室管理",
//       path: "/system",
//       redirect: "/system/role",
//       icon: "el-icon-s-tools",
//       sort: 2,
//       permission_type: "1",
//       role_id: "1,2,3",
//       children: [
//         {
//           path: "role",
//           name: "Role",
//           title: "角色管理",
//           icon: "table",
//           sort: 2,
//         },
//         {
//           path: "users",
//           name: "Users",
//           title: "管理员管理",
//           icon: "user",
//           sort: 1,
//         },
//       ],
//     },
//     {
//       id: 1,
//       pid: "0",
//       name: "System",
//       title: "系统管理",
//       path: "/system",
//       redirect: "/system/role",
//       icon: "el-icon-s-tools",
//       sort: 1,
//       permission_type: "1",
//       role_id: "1,2,3",
//       children: [
//         {
//           path: "role",
//           name: "Role",
//           title: "人员管理",
//           icon: "table",
//           sort: 1,
//         },
//         {
//           path: "users",
//           name: "Users",
//           title: "管理员管理",
//           icon: "user",
//           sort: 2,
//         },
//       ],
//     },
//   ],
// };

// let a = generateRouter(data.permission);
// console.log(a);
//#endregion
