<template>
  <div class="app-container">
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑"
      :before-close="closeDialog"
    >
      <el-form :model="sendInfo" :rules="rule" ref="form">
        <el-form-item label="模块名称" label-width="100px" prop="name">
          <el-input v-model="sendInfo.name" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="排序权重" label-width="100px" prop="sort">
          <el-input v-model="sendInfo.sort" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" v-no-more-click @click="sendPer"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--  -->
    <div
      style="
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 7px 0 35px;
        color: gray;
        margin-bottom: 10px;
        border-bottom: 1px solid gray;
        padding-bottom: 5px;
      "
    >
      <div>名称</div>
      <div>排序权重</div>
      <div>操作</div>
    </div>
    <el-tree
      v-loading="listLoading"
      :data="data2"
      default-expand-all
      node-key="id"
      :expand-on-click-node="false"
      :indent="0"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <div>{{ node.label }}</div>
        <div>{{ data.sort }}</div>
        <span>
          <el-button type="text" size="mini" @click="() => edit(node, data)">
            编辑
          </el-button>
          <!-- <el-button type="text" size="mini" @click="() => remove(node, data)">
            删除
          </el-button> -->
        </span>
      </div>
    </el-tree>

    <!--  -->
  </div>
</template>

<script>
import { getPerInfo, sendPerInfo } from "@/api/table";

export default {
  data() {
    var checkChina = (rule, value, callback) => {
      if (/^[\u4e00-\u9fa5]{2,5}$/.test(value) == false) {
        callback(new Error("请输入中文(2-5个)"));
      } else {
        callback();
      }
    };
    var checkSort = (rule, value, callback) => {
      if (/^[1-99]$/.test(value) == false) {
        callback(new Error("请输入权重(1-99)"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      listLoading: false,
      filterText: "",
      listData: [],
      data2: [],
      //
      sendInfo: {
        name: "",
        id: "",
        sort: "",
      },
      rule: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { validator: checkChina, trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入权重(数字1-100)", trigger: "blur" },
          { validator: checkSort, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.sendInfo.name = "";
      this.sendInfo.id = "";
      this.sendInfo.sort = "";
      this.$refs["form"].resetFields();
    },
    edit(node, data) {
      this.sendInfo.id = data.id;
      this.sendInfo.name = data.label;
      this.sendInfo.sort = data.sort;
      this.dialogVisible = true;
    },
    sendPer() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.listLoading = true;
          sendPerInfo(this.sendInfo)
            .then(() => {})
            .finally(() => {
              this.dialogVisible = false;
              this.listLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // remove(node, data) {
    //   this.listLoading = true;
    //   deletePer(data.id)
    //     .then(() => {})
    //     .finally(() => {
    //       this.listLoading = false;
    //     });
    //   this.fetchData();
    // },

    fetchData() {
      this.listLoading = true;
      getPerInfo()
        .then((res) => {
          for (const iterator of res.data.permission_p_list) {
            let obj = {};
            obj.name = iterator.title;
            obj.id = iterator.id;
            obj.sort = iterator.sort;
            if (iterator.children && iterator.children.length > 0) {
              let child = [];
              for (const iterator0 of iterator.children) {
                let obj0 = {};
                obj0.name = iterator0.title;
                obj0.id = iterator0.id;
                obj0.sort = iterator0.sort;
                child.push(obj0);
              }
              child.sort((a, b) => a.sort - b.sort);
              obj.children = child;
            }
            this.listData.push(obj);
            this.listData.sort((a, b) => a.sort - b.sort);
          }
          //将排序后的写入data2
          for (const iterator of this.listData) {
            let obj = {};
            obj.id = iterator.id;
            obj.label = iterator.name;
            obj.sort = iterator.sort;
            if (iterator.children && iterator.children.length > 0) {
              let child = [];
              for (const iterator0 of iterator.children) {
                let obj0 = {};
                obj0.id = iterator0.id;
                obj0.label = iterator0.name;
                obj0.sort = iterator0.sort;
                child.push(obj0);
              }
              obj.children = child;
            }
            this.data2.push(obj);
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.app-container {
  padding: 40px 80px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree {
  & > .el-tree-node {
    &::deep {
      transition-duration: 2s;
    }
    // background-color: red;
    // height:160px;
    & > .el-tree-node__content {
      height: 40px;
      & > .custom-tree-node {
        height: 100%;
        font-size: 16px;
        cursor: auto;
        span {
          font-size: 15px;
        }
      }
    }
    & > .el-tree-node__children {
      // height:120px;
      // overflow: visible;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      & > .el-tree-node {
        overflow: visible;
        // height: 40px;
        & > .el-tree-node__content {
          height: 40px;
          overflow: visible;
          & > .custom-tree-node {
            padding-left: 25px;
            overflow: visible;
            height: 100%;
            font-size: 16px;
            cursor: auto;

            span {
              display: inline-block;
              // margin-right: -20px;
              font-size: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
