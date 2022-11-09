<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 0 0 20px 0; float: right"
      @click="dialogVisible = true"
      v-if="per.includes('22')"
      >添加</el-button
    >

    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      :title="isEdit ? '编辑' : '添加'"
    >
      <el-form :model="sendPersonInfo" :rules="rules" ref="form">
        <el-form-item
          label="账号/用户名"
          label-width="100px"
          style="width: 500px"
          prop="account"
        >
          <el-input
            v-model="sendPersonInfo.account"
            placeholder="请输入账号/用户名(数字字母下划线组成)"
          ></el-input>
        </el-form-item>
        <div v-if="!isEdit" style="margin: 0 0 20px 100px">初始密码:123456</div>
        <el-form-item
          label="名字"
          label-width="100px"
          style="width: 500px"
          prop="name"
        >
          <el-input
            v-model="sendPersonInfo.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          label-width="100px"
          style="width: 500px"
          prop="phone"
        >
          <el-input
            v-model="sendPersonInfo.phone"
            maxlength="11"
            placeholder="请输入电话号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="科室" label-width="100px" prop="section_id">
          <el-select
            placeholder="请选择科室"
            v-model="sendPersonInfo.section_id"
          >
            <el-option
              v-for="(item, index) in sectionList"
              :key="index"
              :label="item.section_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          size="small"
          v-if="isEdit"
          @click="reset(sendPersonInfo.id)"
          >重置密码</el-button
        >
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="sendPerson" v-no-more-click
          >确定</el-button
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
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="账号/用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nurse_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属科室" align="center">
        <template slot-scope="scope">
          {{ scope.row.section_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
            v-if="per.includes('23')"
            >编辑</el-button
          >
          <el-popconfirm
            title="确认删除"
            style="margin-left: 10px"
            @onConfirm.once="deleteP(scope.row)"
          >
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              v-if="per.includes('24')"
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
      :current-page="page"
      :page-size="limit"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  getPersonList,
  addPerson,
  resetPerson,
  personSectionList,
  editPerson,
  deletePerson,
} from "@/api/table";

export default {
  data() {
    var checkAcount = (rule, value, callback) => {
      if (/^[0-9a-zA-Z_]{1,}$/.test(value) == false) {
        callback(new Error("由数字字母下划线组成"));
      } else {
        callback();
      }
    };
    var checkName = (rule, value, callback) => {
      if (/^[\u4e00-\u9fa5]{2,4}$/.test(value) == false) {
        callback(new Error("请输入正确格式的名字"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (
        /(^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$)|(^\s*$)/.test(
          value
        ) == false
      ) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 8,
      pTotal: 0,
      per: [],
      isEdit: false,
      list: null,
      listLoading: false,
      dialogVisible: false,
      sectionList: [],
      //收集的用户信息
      sendPersonInfo: {
        id: "",
        account: "",
        name: "",
        phone: "",
        section_id: "",
      },
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 12, message: "长度为6-12", trigger: "blur" },
          { validator: checkAcount, trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { validator: checkName, trigger: "blur" },
        ],
        phone: [
          // {required:true,message:'请输入手机号',trigger:'blur'},
          { validator: checkPhone, trigger: "blur" },
        ],
        section_id: [
          { required: true, message: "请选择关联的科室", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    currentChange(newP) {
      this.page = newP;
      this.fetchData();
    },
    closeDialog() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.sendPersonInfo = {
        id: "",
        account: "",
        name: "",
        phone: "",
        section_id: "",
      };
      console.log();
      this.$refs["form"].resetFields();
    },
    fetchData() {
      this.per = localStorage.getItem("per").split(",");
      this.listLoading = true;
      getPersonList({ page: this.page, limit: this.limit }).then((response) => {
        this.list = response.data.list;
        this.pTotal = response.data.total;
        // this.list = response.data;
        personSectionList().then((res) => {
          this.sectionList = res.data;
          this.listLoading = false;
        });
      });
    },
    sendPerson() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let sendD = this.sendPersonInfo;
          // this.listLoading = true;
          if (!this.isEdit) {
            addPerson(sendD)
              .then((res) => {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
              })
              .finally(() => {
                this.listLoading = false;
                this.dialogVisible = false;
                this.fetchData();
              });
          } else {
            for (const iterator of this.sectionList) {
              if (sendD.section_id == iterator.section_name) {
                sendD.section_id = iterator.id;
              }
            }
            editPerson(sendD)
              .then((res) => {
                this.$message({
                  message: res.msg,
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
          return false;
        }
      });
    },
    edit(row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.sendPersonInfo.account = row.account;
      this.sendPersonInfo.name = row.nurse_name;
      this.sendPersonInfo.phone = row.phone;
      this.sendPersonInfo.id = row.id;
      this.sendPersonInfo.section_id = row.section_name;
    },
    //重置密码
    reset(id) {
      console.log(id);
      this.listLoading = true;
      resetPerson(id).then((res) => {
        console.log(res);
        this.listLoading = false;
        this.$message({
          message: res.msg,
        });
      });
    },
    deleteP(row) {
      this.listLoading = true;
      // console.log(1,row.id);
      // return
      deletePerson(row.id)
        .then((res) => {
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
  margin-top: 10px;
}
</style>
