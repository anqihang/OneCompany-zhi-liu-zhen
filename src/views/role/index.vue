<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 0 0 20px 0; float: right"
      @click="dialogVisible = true"
      v-if="per.includes('13')"
      >添加</el-button
    >
    <el-dialog
      :title="isEdit ? '编辑' : '添加'"
      :visible.sync="dialogVisible"
      :before-close="showClose"
    >
      <el-form
        label-width="100px"
        :model="roleInfo"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="roleInfo.name" placeholder="2-5个字符"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <ul style="padding: 0 0 0 10px">
            <li v-for="(item, index) in permissionsOptions" :key="index">
              <div class="collect">
                <div class="father">
                  <span> {{ item.name }} </span>
                  <div class="permissionsCheck">
                    <el-checkbox
                      :label="item.id"
                      v-model="sendPer"
                      @change="checkFF(item)"
                      >浏览</el-checkbox
                    >
                  </div>
                </div>
                <div
                  class="son"
                  v-for="(item0, index0) in item.son"
                  :key="index0"
                >
                  <span>{{ item0.name }}</span>
                  <div class="permissionsCheck">
                    <el-checkbox
                      :label="item0.id"
                      v-model="sendPer"
                      @change="checkF(item0, item), checkFC(item0)"
                      >浏览</el-checkbox
                    >
                    <el-checkbox
                      :label="item0.aid"
                      v-model="sendPer"
                      v-if="item0.aid && item0.aid != 28"
                      @change="childCheck(item0, item)"
                      >添加</el-checkbox
                    >
                    <el-checkbox
                      :label="item0.eid"
                      v-model="sendPer"
                      v-if="item0.eid"
                      @change="childCheck(item0, item)"
                      >编辑</el-checkbox
                    >
                    <el-checkbox
                      :label="item0.did"
                      v-model="sendPer"
                      v-if="item0.did"
                      @change="childCheck(item0, item)"
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
        <el-button @click="showClose">取 消</el-button>
        <el-button type="primary" @click="collectPer" v-no-more-click
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-table
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

      <el-table-column align="center" prop="created_at" label="创建时间">
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
            @click="edit(scope.row.id)"
            v-if="per.includes('14')"
            >编辑</el-button
          >
          <el-popconfirm style="margin-left:10px;" title="确定删除" @onConfirm="deleteRoleInfo(scope.row.id)">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              v-if="per.includes('15')"
              
              slot="reference"
              >删除</el-button>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pTotal"
      :current-page="page"
      :page-size="limit"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  getRolesList,
  addRoleInfo,
  deleteRoleInfo,
  getRoleEditInfo,
  getRolesPer,
  sendRolesEditInfo,
} from "@/api/table";

export default {
  data() {
    return {
      page: 1,
      limit: 8,
      pTotal: 0,
      id: "",
      //是否处于编辑
      isEdit: false,
      //按钮权限数字列表
      per: [],
      list: null,
      //加载等待
      listLoading: false,

      dialogVisible: false,
      //弹框的信息
      permissionsOptions: [],
      //拿到的角色信息
      rolesList: [],
      //收集到的权限信息
      roleInfo: {
        name: "",
      },
      //添加的权限id数组
      sendPer: [],
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 至 8 个文字", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // this.$router.go(0)
    this.fetchData();
    this.shwoPer();
  },
  methods: {
    currentChange(newP) {
      this.page = newP;
      this.fetchData();
    },
    showClose() {
      this.isEdit = false;
      this.dialogVisible = false;
      this.roleInfo.name = "";
      this.sendPer = [];
      this.id = "";
      this.$refs["dialogForm"].resetFields();
    },
    //跳转到本页面触发
    fetchData() {
      this.per = localStorage.getItem("per").split(",");
      this.listLoading = true;
      getRolesList({ page: this.page, limit: this.limit }).then((response) => {
        this.rolesList = response.data.list;
        this.pTotal = response.data.total;
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    //加工显示权限弹窗
    shwoPer() {
      getRolesPer().then((res) => {
        let list = res.data.permission_p_list;
        console.log(1, list);
        let pers = [];
        for (const iterator of list) {
          let obj = {};
          obj.name = iterator.title;
          obj.id = iterator.id;
          if (iterator.children) {
            let childArr = [];
            for (const iterator0 of iterator.children) {
              let objSon = {};
              objSon.name = iterator0.title;
              objSon.id = iterator0.id;
              if (iterator0.children.length > 0) {
                if (iterator0.title != "设备管理") {
                  objSon.aid = iterator0.children[0].id;
                  objSon.eid = iterator0.children[1].id;
                  objSon.did = iterator0.children[2].id;
                } else {
                  objSon.eid = iterator0.children[0].id;
                  objSon.did = iterator0.children[1].id;
                }
              }
              childArr.push(objSon);
            }
            obj.son = childArr;
          }
          pers.push(obj);
        }
        this.permissionsOptions = pers;
      });
    },
    //发送添加信息
    collectPer() {
      let sendD = {
        name: this.roleInfo.name,
        list: this.sendPer,
        id: this.id,
      };
      this.$refs["dialogForm"].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.listLoading = true;
          if (!this.isEdit) {
            addRoleInfo(sendD).then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.isEdit = false;
              this.listLoading = false;
            });
          } else {
            sendRolesEditInfo(sendD).then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.listLoading = false;
              this.isEdit = false;
            });
          }
          this.listLoading = false;
          this.showClose();
          this.fetchData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除按钮
    deleteRoleInfo(id) {
      this.listLoading = true;
      deleteRoleInfo(id).then((res) => {
        // console.log(res);
        this.listLoading = false;
        this.$message({
          message: "删除成功",
          type: "success",
        });
      this.fetchData();
      });
      this.listLoading = false;
    },
    //编辑按钮
    edit(id) {
      this.id = id;
      console.log(2, this.id);
      this.dialogVisible = true;
      this.isEdit = true;
      this.listLoading = true;
      getRoleEditInfo(id).then((res) => {
        this.sendPer = res.data.menu_id;
        for (const index in res.data.menu_id) {
          this.sendPer[index] = res.data.menu_id[index] - 0;
        }
        this.roleInfo.name = res.data.role_name;
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    //权限复选框规则
    childCheck(item0, item) {
      if (
        this.sendPer.includes(item0.aid || item0.eid || item0.did) ||
        this.sendPer.includes(item0.eid) ||
        this.sendPer.includes(item0.did)
      ) {
        this.sendPer.push(item0.id);
        this.sendPer.push(item.id);
        this.sendPer = Array.from(new Set(this.sendPer));
      }
    },
    checkF(item0, item) {
      if (this.sendPer.includes(item0.id)) {
        this.sendPer.push(item.id);
        this.sendPer = Array.from(new Set(this.sendPer));
      }
    },
    checkFC(item0) {
      let childArr = [];
      childArr.push(item0.aid);
      childArr.push(item0.eid);
      childArr.push(item0.did);
      if (!this.sendPer.includes(item0.id)) {
        for (const iterator of childArr) {
          for (const index in this.sendPer) {
            if (iterator == this.sendPer[index]) {
              this.sendPer.splice(index, 1);
            }
          }
        }
      }
    },
    checkFF(item) {
      let childArr = [];
      for (const iterator of item.son) {
        childArr.push(iterator.id);
        if (iterator.aid) childArr.push(iterator.aid);
        if (iterator.eid) childArr.push(iterator.eid);
        if (iterator.did) childArr.push(iterator.did);
      }

      if (!this.sendPer.includes(item.id)) {
        for (const iterator of childArr) {
          for (const index in this.sendPer) {
            if (iterator == this.sendPer[index]) {
              this.sendPer.splice(index, 1);
            }
          }
        }
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
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
</style>
