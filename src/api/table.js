import request from "@/utils/request";

//navbar
export function sendEditUser(data) {
  return request({
    url: "/user/admin_password",
    method: "post",
    data: {
      password: data.password,
    },
  });
}

export function getList(params) {
  return request({
    url: "/user/admin_role_list",
    method: "get",
    params,
  });
}
//users
export function getUsersList(data) {
  return request({
    url: "/user/admin_role_list",
    method: "get",
    params: {
      page: data.page,
      limit: data.limit,
    },
  });
}
//获取动态的角色列表信息
export function getUsersInfo(params) {
  return request({
    url: "/user/user_add_info",
    method: "get",
    params,
  });
}
//分页
// export function getPageList(){

// }
//添加用户
export function addUsersInfo(data) {
  return request({
    url: "/user/user_add",
    method: "post",
    data,
  });
}
//编辑拿信息展示
export function getEditUsersInfo(id) {
  return request({
    url: "/user/user_edit_info",
    method: "post",
    data: {
      user_id: id,
    },
  });
}
//编辑用户
export function editUsersInfo(data) {
  // console.log('a',data);
  return request({
    url: "/user/user_edit",
    method: "post",
    data,
  });
}
//删除用户
export function deleteUsersInfo(id) {
  return request({
    url: "/user/user_delete",
    method: "post",
    data: {
      u_id: id,
    },
  });
}

//role
export function getRolesList(data) {
  return request({
    url: "/user/role_list",
    method: "get",
    params: {
      page: data.page,
      limit: data.limit,
    },
  });
}
//rolePer
export function getRolesPer() {
  return request({
    url: "/permission/permission_add_info",
    method: "get",
  });
}
//roleAdd
export function addRoleInfo(data) {
  return request({
    url: "/user/role_add",
    method: "post",
    data,
  });
}
//roleDelete
export function deleteRoleInfo(id) {
  return request({
    url: "/user/role_delete",
    method: "post",
    data: {
      role_id: id,
    },
  });
}
//getRoleEditInfo
export function getRoleEditInfo(id) {
  return request({
    url: "/user/role_info",
    method: "post",
    data: {
      role_id: id,
    },
  });
}
//sendRolesEditInfo
export function sendRolesEditInfo(data) {
  return request({
    url: "/permission/permission_edit",
    method: "post",
    data,
  });
}
//permission
export function getPerInfo() {
  return request({
    url: "/permission/permission_add_info",
    method: "get",
  });
}
//persmissionSend
export function sendPerInfo(data) {
  return request({
    url: "/permission/permission_name_sort",
    method: "post",
    data: {
      id: data.id,
      title: data.name,
      sort: data.sort,
    },
  });
}
//-----------------------------------------------------------
//section
export function getSectionList(data) {
  return request({
    url: "/section/section_list",
    method: "get",
    params: {
      page: data.page,
      limit: data.limit,
    },
  });
}
//add
export function addSection(data) {
  return request({
    url: "/section/section_add",
    method: "post",
    data: {
      section_name: data,
    },
  });
}
//delete
export function deleteSection(data) {
  return request({
    url: "/section/section_delete",
    method: "post",
    data,
  });
}
//edit
export function editSection(data) {
  return request({
    url: "/section/section_edit",
    method: "post",
    data: {
      section_id: data.id,
      section_name: data.name,
    },
  });
}
//-----------------------------------------------------
//person//人员管理
export function getPersonList({ page, limit }) {
  return request({
    url: "/nurse/nurse_list",
    method: "get",
    params: {
      page,
      limit,
    },
  });
}
//pSectionList
export function personSectionList() {
  return request({
    url: "/nurse/nurse_edit_info",
    method: "get",
  });
}
//personAdd
export function addPerson(data) {
  return request({
    url: "/nurse/nurse_add",
    method: "post",
    data,
  });
}
//delete
export function deletePerson(data) {
  return request({
    url: "/nurse/nurse_delete",
    method: "post",
    data:{
      id:data
    }
  });
}
//edit
export function editPerson(data) {
  return request({
    url: "/nurse/nurse_edit",
    method: "post",
    data,
  });
}
//reset
export function resetPerson(data) {
  return request({
    url: "/nurse/reset_password",
    method: "post",
    data,
  });
}
//---------------------------------------------------------
///ward病房
//getList
export function getWardList(data) {
  return request({
    url: "/sickroom/sickroom_list",
    mrthod: "get",
    params: {
      page:data.page,
      limit:data.limit
    },
  });
}
//addWard
export function addWard(data) {
  return request({
    url: "/sickroom/sickroom_add",
    method: "post",
    data,
  });
}
//deleteWard
export function deleteWard(id) {
  console.log(1);
  return request({
    url: "/sickroom/sickroom_delete",
    method: "post",
    data:{
      id:id
    }
  });
}
//editWard
export function editWard(data) {
  return request({
    url: "/sickroom/sickroom_edit",
    method: "post",
    data,
  });
}
//----------------------------------------------
// 设备信息列表
export function getDeviceList(data){
  return request({
    url:'/device/device_list',
    method:'get',
    data
  })
}
//换绑
export function sendChangeBind(data){
  return request({
    url:"",
    method:'post',
    data
  })
}
// 禁用
export function sendDisable(id){
  return request({
    url:'/device/device_disable',
    method:'post',
    data:{
      id:id
    }
  })
}