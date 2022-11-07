<template>
  <div class="app-container">
    角色管理
    <!-- <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 0 0 20px 0; float: right"
      @click="dialogVisible = true"
      v-if="per.includes('15')"
      v-no-more-click
      >添加</el-button
    > -->
    <!-- <el-dialog title="添加" :visible.sync="dialogVisible">
      <el-form label-width="100px" :model="roleInfo">
        <el-form-item label="名字">
          <el-input v-model="roleInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <ul style="padding: 0 0 0 10px">
            <li v-for="(item, index) in permissionsOptions" :key="index">
              <div class="collect">
                <div class="father">
                  <span> {{ item.name }} </span>
                  <div class="permissionsCheck">
                    <el-checkbox
                      v-model="roleInfo.pers[index].see"
                      @change="checkSon(index)"
                      >浏览</el-checkbox
                    >
                  </div>
                </div>
                <div
                  class="son"
                  v-for="(item0, index0) in item.son"
                  :key="index0"
                >
                  <span>{{ item0 }}</span>
                  <div class="permissionsCheck">
                    <el-checkbox
                      v-model="roleInfo.pers[index].son[index0].see"
                      @change="changeTitle(index, index0)"
                      >浏览</el-checkbox
                    >
                    <el-checkbox
                      v-model="roleInfo.pers[index].son[index0].add"
                      @change="
                        changeTitle(index, index0),
                          changeOwnTitle(index, index0)
                      "
                      >添加</el-checkbox
                    >
                    <el-checkbox
                      v-model="roleInfo.pers[index].son[index0].edit"
                      @change="
                        changeTitle(index, index0),
                          changeOwnTitle(index, index0)
                      "
                      >编辑</el-checkbox
                    >
                    <el-checkbox
                      v-model="roleInfo.pers[index].son[index0].delete"
                      @change="
                        changeTitle(index, index0),
                          changeOwnTitle(index, index0)
                      "
                      >删除</el-checkbox
                    >
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="collectPer">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- <el-table
      v-loading="listLoading"
      :data="rolesList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        label="创建时间"
        width="300"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="per.includes('16')"
            @click="edit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="per.includes('17')"
            @click="deleteRoleInfo(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
// import {
//   getRolesList,
//   addRoleInfo,
//   deleteRoleInfo,
//   getRoleEditInfo,
// } from "@/api/table";

// export default {
//   //
//   filters: {
//     statusFilter(status) {
//       const statusMap = {
//         published: "success",
//         draft: "gray",
//         deleted: "danger",
//       };
//       return statusMap[status];
//     },
//   },
//   data() {
//     return {
//       isEdit: false,
//       per: [],
//       list: null,
//       //加载等待
//       listLoading: true,
//       per: {
//         add: "",
//         edit: "",
//         delete: "",
//       },
//       dialogVisible: false,
//       permissionsOptions: [
//         {
//           name: "系统管理",
//           son: ["角色管理", "用户管理"],
//         },
//         {
//           name: "科室管理",
//           son: ["病房管理", "人员管理", "科室管理"],
//         },
//         {
//           name: "设备管理",
//           son: ["设备管理"],
//         },
//         {
//           name: "患者看板",
//         },
//       ],
//       //获取到的角色信息
//       rolesList: [],
//       //收集到的权限信息
//       roleInfo: {
//         name: "admin",
//         // pers: [
//         //   //系统
//         //   {
//         //     name: "System",
//         //     see: true, //浏览
//         //     son: [
//         //       //角色
//         //       {
//         //         name: "Role",
//         //         see: true,
//         //         add: true, //添加
//         //         edit: true, //编辑
//         //         delete: false, //删除
//         //       },
//         //       //用户
//         //       {
//         //         name: "User",
//         //         see: true,
//         //         add: true, //添加
//         //         edit: true, //编辑
//         //         delete: false, //删除
//         //       },
//         //     ],
//         //   },
//         //   //科室
//         //   {
//         //     name: "WardF",
//         //     see: true, //浏览
//         //     son: [
//         //       //病房
//         //       {
//         //         name: "Ward",
//         //         see: true,
//         //         add: false, //添加
//         //         edit: true, //编辑
//         //         delete: false, //删除
//         //       },
//         //       //人员
//         //       {
//         //         name: "Person",
//         //         see: true,
//         //         add: false, //添加
//         //         edit: true, //编辑
//         //         delete: false, //删除
//         //       },
//         //       //科室
//         //       {
//         //         name: "Section",
//         //         see: true,
//         //         add: false, //添加
//         //         edit: true, //编辑
//         //         delete: false, //删除
//         //       },
//         //     ],
//         //   },
//         //   //设备
//         //   {
//         //     name: "DeviceF",
//         //     see: true, //浏览
//         //     son: [
//         //       {
//         //         name: "Device",
//         //         see: true,
//         //         add: true, //添加
//         //         edit: true, //编辑
//         //         delete: true, //删除
//         //       },
//         //     ],
//         //   },
//         //   //患者
//         //   {
//         //     name: "Watch",
//         //     see: true, //浏览
//         //     son: [
//         //       {
//         //         name: "Patient",
//         //         see: false,
//         //       },
//         //     ],
//         //   },
//         // ],
//       },
//     };
//   },
//   // created() {
//   //   // this.$router.go(0)
//   //   this.fetchData();
//   // },
//   // methods: {
//   //   //跳转到本页面触发
//   //   fetchData() {
//   //     this.per = localStorage.getItem("Systemper").split(",");
//   //     this.listLoading = true;
//   //     getRolesList().then((response) => {
//   //       this.rolesList = response.data;
//   //       this.listLoading = false;
//   //     });
//   //     this.listLoading = false;
//   //   },
//   //   //添加角色
//   //   collectPer() {
//   //     this.dialogVisible = false;
//   //     let idArr = [];
//   //     for (let index = 0; index < this.roleInfo.pers.length; index++) {
//   //       if (this.roleInfo.pers[index].see == true) {
//   //         idArr.push(this.roleInfo.pers[index].name);
//   //       }
//   //       for (
//   //         let index0 = 0;
//   //         index0 < this.roleInfo.pers[index].son.length;
//   //         index0++
//   //       ) {
//   //         if (this.roleInfo.pers[index].son[index0].see == true) {
//   //           idArr.push(this.roleInfo.pers[index].son[index0].name);
//   //         }
//   //         if (this.roleInfo.pers[index].son[index0].add == true) {
//   //           idArr.push(this.roleInfo.pers[index].son[index0].name + "_Add");
//   //         }
//   //         if (this.roleInfo.pers[index].son[index0].edit == true) {
//   //           idArr.push(this.roleInfo.pers[index].son[index0].name + "_Edit");
//   //         }
//   //         if (this.roleInfo.pers[index].son[index0].delete == true) {
//   //           idArr.push(this.roleInfo.pers[index].son[index0].name + "_Delete");
//   //         }
//   //       }
//   //     }
//   //     //根据Watch判断是否有patient
//   //     if (idArr.includes("Watch")) {
//   //       idArr.push("Patient");
//   //     }
//   //     let sendObj = { name: this.roleInfo.name, perNameList: idArr };
//   //     //添加时发的请求
//   //     this.listLoading = true;
//   //     if (!this.isEdit) {
//   //       addRoleInfo(sendObj).then((response) => {
//   //         // console.log(response);
//   //         this.fetchData();
//   //       });
//   //     }
//   //     this.listLoading = false;
//   //   },
//   //   //改变父级的浏览，并限制自身的change
//   //   changeTitle(index, index0) {
//   //     this.roleInfo.pers[index].see = true;
//   //     if (this.roleInfo.pers[index].son[index0].see == false) {
//   //       for (const key in this.roleInfo.pers[index].son[index0]) {
//   //         if (key != "name") {
//   //           this.roleInfo.pers[index].son[index0][key] = false;
//   //         }
//   //       }
//   //     }
//   //     // if (
//   //     //   Object.values(this.roleInfo.pers[index].son[index0]).some(
//   //     //     (item, index) => {
//   //     //       return item == true;
//   //     //     }
//   //     //   )
//   //     // ) {
//   //     //   this.roleInfo.pers[index].son[index0].see = true;
//   //     // }
//   //   },
//   //   //改变自生的浏览
//   //   changeOwnTitle(index, index0) {
//   //     this.roleInfo.pers[index].son[index0].see = true;
//   //   },
//   //   //限制父级的change
//   //   checkSon(index) {
//   //     if (this.roleInfo.pers[index].see == false) {
//   //       for (const iterator of this.roleInfo.pers[index].son) {
//   //         for (const key in iterator) {
//   //           if (key != "name") {
//   //             iterator[key] = false;
//   //           }
//   //         }
//   //       }
//   //     }
//   //   },
//   //   //删除按钮
//   //   deleteRoleInfo(id) {
//   //     this.listLoading = true;
//   //     deleteRoleInfo(id).then((res) => {
//   //       // console.log(res);
//   //     });
//   //     this.listLoading = false;
//   //   },
//   //   //编辑按钮
//   //   edit(id) {
//   //     this.dialogVisible = true;
//   //     this.isEdit = true;
//   //     this.listLoading = true;
//   //     getRoleEditInfo(id).then((res) => {
//   //       console.log(1, res);
//   //     });
//   //     this.listLoading = false;
//   //   },
//   // },
//   mounted() {},
// };
</script>

<!-- <style lang="scss">
li {
  list-style: none;
}
.collect {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .father {
    display: flex;
    justify-content: space-between;
  }
  .son {
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
    height: 30px;
    align-items: center;
  }
}
.el-checkbox {
  margin-right: 8px !important;
  .el-checkbox__label {
    padding-left: 2px !important;
  }
}
</style> -->
