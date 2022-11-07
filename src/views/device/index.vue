<template>
  <div class="app-container">
    device
    <el-dialog :visible.sync="dialogVisible" :before-close="closeDialog">
      <el-form>
        <el-form-item>
          <el-cascader
            v-model="value"
            :options="options"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" v-no-more-click @click="sendNewPatient"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-form>
      <el-form-item>
        <el-input
          v-model="search"
          placeholder="搜索"
          style="width: 500px; float: right"
          class="input-with-select"
          @keydown.enter.native="searchInfo"
        >
          <el-select
            v-model="select"
            slot="prepend"
            placeholder="请选择"
            style="width: 110px"
          >
            <el-option value="1" label="设备号"></el-option>
            <el-option label="患者姓名" value="2"></el-option>
            <el-option label="激活时间" value="3"></el-option>
          </el-select>

          <el-button slot="append" @click="searchInfo">搜索</el-button>
        </el-input>
        <!-- <el-button style="float: right; border-radius: 0" type="primary"
          >搜索</el-button -->
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95" class="r">
        <template slot-scope="scope" style="background-color: red">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="设备" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.device_mac }}
        </template>
      </el-table-column>
      <el-table-column label="患者信息" align="center">
        <template slot-scope="scope">
          <el-popover width="400" placement="top" trigger="click">
            <el-button slot="reference" @click="showPatienInfo(scope.row.id)">{{
              scope.row.patient_name
            }}</el-button>
            <div>
              <ul>
                <li>
                  性别：<span>{{ patientInfo.sex }}</span>
                </li>
                <li>
                  病房号：<span>{{ patientInfo.sickroom }}</span>
                </li>
                <li>
                  科室：<span>{{ patientInfo.section_name }}</span>
                </li>
              </ul>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="设备历史信息" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row. }} -->
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="操作/状态"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.device_active == 1">
            <el-button size="small" type="primary" @click="changeBind"
              >换绑</el-button
            >
            <el-button type="danger" size="small" @click="disabled(scope.row)"
              >禁用</el-button
            >
          </template>
          <span v-if="scope.row.device_active == 2">已注销</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getDeviceList,
  getWardList,
  getDeviceInfo,
  getPatient,
} from "@/api/table";

export default {
  data() {
    return {
      list: null,
      listLoading: false,
      dialogVisible: false,
      search: "", //所搜结果
      select: "",
      options: [],
      value: [],
      patientInfo: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      getDeviceList()
        .then((response) => {
          this.list = response.data.list;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    changeBind() {
      this.dialogVisible = true;
      getDeviceInfo().then((res) => {
        let c = [];
        for (const iterator of res.data.list) {
          let obj = {};
          obj.value = iterator.id;
          obj.label = iterator.section_name;
          obj.children = [];
          if (iterator.children.length > 0) {
            for (const iterator0 of iterator.children) {
              let obj0 = {};
              obj0.value = iterator0.id;
              obj0.label = iterator0.sickroom;
              obj0.children = [];
              if (iterator0.children.length > 0) {
                for (const iterator1 of iterator0.children) {
                  let obj1 = {};
                  obj1.value = iterator1.id;
                  obj1.label = iterator1.patient_name;
                  obj0.children.push(obj1);
                }
              }
              obj.children.push(obj0);
            }
          }
          c.push(obj);
        }
        this.options = c;
      });
    },
    searchInfo() {
      console.log(this.search, this.select);
      this.fetchData();
    },
    //发送换绑信息
    sendNewPatient() {
      this.closeDialog();
      console.log(1, this.value);
    },
    disabled(row) {
      this.listLoading = true;
      sendDisable(row.id).then((res) => {
        this.$message({
          message: res.msg,
          type: "success",
        });
        this.fetchData();
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    showPatienInfo(id) {
      this.listLoading = true;
      getPatient(id).then((res) => {
        console.log(2,res);
        this.patientInfo = res.data[0];
        console.log(1,this.patientInfo);
        this.listLoading = false;
      });
      this.listLoading = false;
    },
  },
};
</script>
<style></style>
