<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 0 0 20px 0; float: right"
      @click="dialogVisible = true"
      v-if="per.includes('19')"
    >
      添加
    </el-button>
    <!--  -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑' : '添加'"
      :before-close="closeDialog"
    >
      <el-form :model="sendWardInfo" :rules="rules" ref="form">
        <el-form-item
          label="房号"
          label-width="100px"
          style="width: 400px"
          prop="title"
        >
          <el-input
            placeholder="请输入房间号"
            v-model="sendWardInfo.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属科室" label-width="100px" prop="section">
          <el-select
            v-model="sendWardInfo.section"
            placeholder="请选择所属科室"
          >
            <el-option
              v-for="item in sectionList"
              :key="item.id"
              :value="item.id"
              :label="item.section_name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" v-no-more-click @click="addWardInfo"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!--  -->
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
      <el-table-column label="房号" align="center" width="300">
        <template slot-scope="scope">
          {{ scope.row.sickroom }}
        </template>
      </el-table-column>
      <el-table-column label="所属科室" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.section_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            v-if="per.includes('20')"
            @click="edit(scope.row)"
            size="small"
          >
            编辑
          </el-button>
          <el-popconfirm title="确认删除" style="margin-left:10px;" @onConfirm.once="deleteP(scope.row)">

          <el-button
            icon="el-icon-delete"
            type="danger"
            v-if="per.includes('21')"
            slot="reference"
            size="small"
          >
            删除
          </el-button>
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
  getWardList,
  personSectionList,
  addWard,
  deleteWard,
  editWard,
} from "@/api/table";

export default {
  data() {
    var checkTitle = (rule, value, callback) => {
      if (/^[0-9]{2,4}$/.test(value) == false) {
        callback(new Error("请输入正确的房间号(2-4位数字)"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 8,
      pTotal: 0,
      per: [],
      list: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      sendWardInfo: {
        id: "",
        title: "",
        section: "",
      },
      sectionList: [],
      rules: {
        title: [
          { required: true, message: "请输入房间号", trigger: "blur" },
          { validator: checkTitle, trigger: "blur" },
        ],
        section: [{ required: true, message: "请选择科室", trigger: "change" }],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    changPage(newP) {
      this.page = newP;
      this.fetchData()
    },
    closeDialog() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.sendWardInfo = {
        title: "",
        section: "",
        id: "",
      };
      this.fetchData();
      this.$refs["form"].resetFields();
    },
    fetchData() {
      this.per = localStorage.getItem("per");
      this.listLoading = true;
      getWardList({ page: this.page, limit: this.limit }).then((response) => {
        console.log(1, response);
        this.list = response.data.list;
        this.pTotal = response.data.count;
        this.listLoading = false;
      });
      personSectionList().then((res) => {
        this.sectionList = res.data;
      });
    },
    addWardInfo() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let sendD = {
            sickroom: this.sendWardInfo.title,
            section_id: this.sendWardInfo.section,
            id: this.sendWardInfo.id,
          };
          this.listLoading = true;
          if (!this.isEdit) {
            addWard(sendD)
              .then((res) => {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
              })
              .finally(() => {
                this.listLoading = false;
                this.closeDialog();
              });
            this.closeDialog();
          } else {
            for (const iterator of this.sectionList) {
              if (sendD.section_id == iterator.section_name) {
                sendD.section_id = iterator.id;
              }
            }
            editWard({
              sick_name: sendD.sickroom,
              section_id: sendD.section_id,
              id: sendD.id,
            })
              .then((res) => {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
              })
              .finally(() => {
                this.listLoading = false;
                this.closeDialog();
              });
          }
        } else {
          return false;
        }
      });
    },
    edit(row) {
      this.sendWardInfo.title = row.sickroom;
      this.sendWardInfo.section = row.section_name;
      this.sendWardInfo.id = row.id;
      this.dialogVisible = true;
      this.isEdit = true;
    },
    deleteP(row) {
      this.listLoading = true;
      deleteWard(row.id)
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
  /* margin-top: 10px; */
}
</style>
