<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 0 0 20px 0; float: right"
      @click="dialogVisible = true"
      v-if="per.includes('25')"
    >
      添加
    </el-button>

    <el-dialog
      title="添加"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
    >
      <el-form :model="sendInfo" label-width="100px" :rules="rules" ref="form">
        <el-form-item label="名称" prop="name">
          <el-input
            placeholder="请输入科室名称"
            v-model="sendInfo.name"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" v-no-more-click @click="addSectionB"
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="科室名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.section_name }}
        </template>
      </el-table-column>

      <el-table-column label="人数" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.nurse_count }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="per.includes('26')"
            @click="edit(scope.row)"
            >编辑</el-button
          >
        <el-popconfirm title="确认删除" style="margin-left:10px;" @onConfirm.once="deleteS(scope.row)">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="per.includes('27')"
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
  getSectionList,
  addSection,
  deleteSection,
  editSection,
} from "@/api/table";

export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  data() {
    var checkName = (rule, value, callback) => {
      if (/^[\u4e00-\u9fa5]{2,7}$/.test(value) == false) {
        callback(new Error("请输入中文"));
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
      sendInfo: {
        id: "",
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入科室名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个文字",
            trigger: "blur",
          },
          {
            validator: checkName,
            trigger: "blur",
          },
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
      (this.sendInfo = {
        id: "",
        name: "",
      }),
        (this.dialogVisible = false);
      this.isEdit = false;
      this.$refs["form"].resetFields();
    },
    fetchData() {
      this.listLoading = true;
      getSectionList({ page: this.page, limit: this.limit })
        .then((response) => {
          this.list = response.data.section_list;
          this.pTotal = response.data.total;
        })
        .finally(() => {
          this.listLoading = false;
        });
      this.per = localStorage.getItem("per").split(",");
    },
    //添加
    addSectionB() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.listLoading = true;
          this.dialogVisible = false;
          if (!this.isEdit) {
            addSection(this.sendInfo.name)
              .then((res) => {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
              })
              .finally(() => {
                this.listLoading = false;
                this.fetchData();
              });
          } else {
            editSection(this.sendInfo).finally(() => {
              this.listLoading = false;
              this.fetchData();
              this.closeDialog();
            });
          }
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    edit(row) {
      this.isEdit = true;
      this.dialogVisible = true;
      this.sendInfo.id = row.id;
      this.sendInfo.name = row.section_name;
      console.log(row);
    },
    deleteS(row) {
      this.listLoading = true;
      deleteSection({ section_id: row.id })
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
