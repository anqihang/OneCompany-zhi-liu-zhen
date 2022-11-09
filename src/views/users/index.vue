<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 0 0 20px 0; float: right"
      @click="dialogVisible = true"
      v-if="per.includes('16')"
      >添加</el-button
    >
    <!-- 弹出框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      :before-close="closeDialog"
    >
      <el-form :model="userInfo" :rules="rules" ref="form">
        <el-form-item label="用户名" label-width="100px" prop="account">
          <el-input v-model="userInfo.account" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input
            show-password
            v-model="userInfo.password"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-form-item label="角色" label-width="100px" prop="role_id">
          <el-select placeholder="请选择角色" v-model="userInfo.role_id">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.role_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addUsersInfo" v-no-more-click
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role_name }}</span>
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
            @click="edit(scope.row.id)"
            v-if="per.includes('17')"
            >编辑</el-button
          >
        <el-popconfirm title="确认删除" style="margin-left:10px;" @onConfirm.once="deleteUser(scope.row.id)" >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="per.includes('18')"
            slot="reference"
            >删除</el-button
          >
        </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pTotal"
      :page-size="limit"
      :current-page="page"
      @current-change="changPage"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  getUsersList,
  getUsersInfo,
  addUsersInfo,
  getEditUsersInfo,
  editUsersInfo,
  deleteUsersInfo,
} from "@/api/table";

export default {
  data() {
    var checkAcount = (rule, value, callback) => {
      if (/^[0-9a-zA-Z_]{3,10}$/.test(value) == false) {
        callback(new Error("由数字字母下划线组成"));
      } else {
        callback();
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (/^[0-9a-zA-Z_]{5,12}$/.test(value) == false) {
        callback(new Error("由数字字母下划线组成"));
      } else {
        callback();
      }
    };
    var checkRole = (rule, value, callback) => {
      if (!value) {
        console.log(value);
        return callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 8,
      pTotal: 0,
      per: [],
      user_id: "",
      isEdit: false,
      //拿到的用户信息
      list: null, //   account:'',create_time:'',role_name:'',id:''
      newList: "",
      listLoading: false,
      dialogVisible: false,
      //收集到的用户信息
      userInfo: {
        account: "",
        password: "",
        role_id: "",
      },
      //动态渲染的角色列表
      roleList: [],

      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
          { validator: checkAcount, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
          { validator: checkPassword, trigger: "blur" },
        ],
        role_id: [
          { required: true, message: "请选择角色", trigger: "change" },
          // { validator: checkRole, trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
    // this.closeDialog();
    this.per = localStorage.getItem("per").split(",");
  },
  methods: {
    changPage(newPage) {
      this.page = newPage;
      this.fetchData();
    },
    closeDialog() {
      this.isEdit = false;
      this.dialogVisible = false;
      this.userInfo = {
        account: "",
        password: "",
        role_id: "",
      };
      this.user_id = "";
      this.$refs["form"].resetFields();
    },
    //页面初始请求数据
    fetchData() {
      this.listLoading = true;
      //获取用户信息
      getUsersList({ page: this.page, limit: this.limit }).then((response) => {
        // console.log(1,response);
        this.list = response.data.list;
        this.pTotal = response.data.total;
        // console.log(typeof response.total);
        this.listLoading = false;
      });
      //动态获取role和section
      getUsersInfo().then((response) => {
        this.roleList = response.data.role_info;
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    //发送添加编辑请求
    addUsersInfo() {
      let sendD = {
        account: this.userInfo.account,
        password: this.userInfo.password,
        role_id: this.userInfo.role_id,
        // user_id:''
      };

      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.listLoading = true;
          if (!this.isEdit) {
            // sendD.account = this.userInfo.account
            //添加接口
            addUsersInfo(sendD).then((response) => {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.listLoading = false;
              this.dialogVisible = false;
            });
          } else {
            // sendD = this.userInfo;
            console.log(1, sendD);
            sendD.role_id = this.statusFilter(sendD.role_id);
            sendD.user_id = this.user_id;
            console.log(2, sendD);
            // return
            editUsersInfo(sendD)
              .then((res) => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                });
              })
              .finally(() => {
                this.listLoading = false;
                this.dialogVisible = false;
                this.fetchData();
                this.closeDialog();
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑提交时的role_id是角色字符串名字或者id数字时转换为数字
    statusFilter(status) {
      // console.log(String(Number(status)) == "NaN");
      if (String(Number(status)) == "NaN") {
        for (const iterator of this.roleList) {
          if (iterator.role_name == status) {
            // console.log(iterator.id);
            return iterator.id;
          }
        }
      } else {
        return status;
      }
    },
    //点击编辑按钮获取信息
    edit(id) {
      this.isEdit = true;
      this.listLoading = true;
      this.user_id = id;
      getEditUsersInfo(id).then((res) => {
        this.userInfo.account = res.data.account;
        this.userInfo.password = res.data.user_password;
        this.dialogVisible = true;
        for (const iterator of this.roleList) {
          if (iterator.id == res.data.role_id) {
            this.userInfo.role_id = iterator.role_name;
          }
        }
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    //删除按钮
    deleteUser(id) {
      this.listLoading = true;
      deleteUsersInfo(id)
        .then((res) => {
          this.listLoading = false;
          this.$message({
            message: "删除成功",
            type: "success",
          });
        })
        .finally(() => {
          this.listLoading = false;
          this.fetchData();
        });
    },
  },
};
</script>

<style>
.el-pagination {
  display: flex;
  justify-content: center;
  /* margin-top: 10px; */
}
</style>
