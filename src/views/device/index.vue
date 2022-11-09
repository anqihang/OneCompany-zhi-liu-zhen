<template>
  <div class="app-container">
    <el-dialog :visible.sync="dialogVisible" :before-close="closeDialog">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="value">
          <el-cascader
            v-model="form.value"
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
    <el-drawer :visible.sync="drawer" direction="ltr" :with-header="false">
      <ul
        style="
          margin: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 0 5px;
        "
      >
        <div
        class="deviceInfo"
          style="
            list-style: none;
            height: 50%;
            border-bottom: 4px dashed gray;
            overflow: auto;
          "
        >
          <el-table :data="deviceInfo" height="100%" :header-cell-style="{fontSize:'16px'}">
            <el-table-column label="姓名-房间号-科室-床号" align="center" property="name">
            </el-table-column>
            <el-table-column
              label="状态"
              align="center"
              width="80"
              property="band"
            >
            </el-table-column>
            <el-table-column
              label="时间"
              width="100px"
              align="center"
              property="create_time"
            >
            </el-table-column>
          </el-table>
        </div>
        <div style="list-style: none; height: 50%; overflow: auto">
          <el-table :data="templateList" height="100%" :header-cell-style="{fontSize:'16px'}">
            <el-table-column label="温度" align="center" property="temperature">
            </el-table-column>
            <el-table-column label="时间" align="center" property="create_time">
            </el-table-column>
          </el-table>
        </div>
      </ul>
    </el-drawer>
    <el-form>
      <el-form-item>
        <el-input
          @input="checkNull"
          v-model="search"
          placeholder="搜索"
          style="width: 500px; float: right"
          class="input-with-select a"
          @keydown.enter.native="searchInfo"
          :class="{ borderDanger: searchNum }"
        >
          <el-select
            class="border"
            :class="{ borderDanger: selectNum }"
            v-model="select"
            slot="prepend"
            placeholder="请选择"
            style="width: 110px"
          >
            <el-option value="1" label="设备号"></el-option>
            <el-option label="患者姓名" value="2"></el-option>
            <!-- <el-option label="激活时间" value="3"></el-option> -->
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
          <el-popover
            placement="top"
            trigger="click"
            v-if="scope.row.patient_name"
          >
            <el-button slot="reference" @click="showPatienInfo(scope.row.id)">{{
              scope.row.patient_name
            }}</el-button>
            <div>
              <ul style="padding: 0">
                <li style="list-style: none">
                  性别：<span>{{ patientInfo.sex }}</span>
                </li>
                <li style="list-style: none">
                  病房号：<span>{{ patientInfo.sickroom }}</span>
                </li>
                <li style="list-style: none">
                  床号：<span>{{ patientInfo.bed_name }}</span>
                </li>
                <li style="list-style: none">
                  科室：<span>{{ patientInfo.section_name }}</span>
                </li>
              </ul>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="设备历史信息" align="center" width="170">
        <template slot-scope="scope" trigger="click" placement="top">
          <el-button
            @click="showDeviceInfo(scope.row.id)"
            style="cursor: pointer"
            >显示设备历史信息</el-button
          >

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
          <template v-if="scope.row.device_disable == 0">
            <el-button
              size="small"
              type="primary"
              @click="changeBind(scope.row.id)"
              v-no-more-click
              >换绑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click.once="disabled(scope.row)"
              >禁用</el-button
            >
          </template>
          <span v-if="scope.row.device_disable == 1">已注销</span>
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
  getDeviceList,
  getDeviceInfo,
  getPatient,
  sendChangeBind,
  getDevice,
  searchInfo,
  sendDisable,
} from "@/api/table";

export default {
  data() {
    return {
      isSearch: false,
      bo: false,
      id: "",
      page: 1,
      limit: 8,
      pTotal: 0,
      list: null,
      listLoading: false,
      dialogVisible: false,
      search: "", //所搜结果
      select: "",
      // sear:{
      //   select:"",
      // },
      selectNum: false,
      searchNum: false,
      options: [],
      form: {
        value: [],
      },
      newvalue: [],
      // value: [],
      patientInfo: {},
      deviceInfo: [],
      templateList: [],
      rules: {
        value: [
          {
            type: "array",
            required: true,
            message: "请选择换绑患者",
            trigger: "change",
          },
        ],
      },
      drawer: false,
    };
  },
  created() {
    this.fetchData();
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
  methods: {
    currentChange(nweP) {
      this.page = newP;
      if (!isSearch) {
        this.fetchData();
      } else {
        searchInfo({
          id: this.select,
          content: this.search,
          page: this.page,
          limit: this.limit,
        })
          .then((res) => {
            this.list = res.data.list;
            this.pTotal = total;
            this.isSearch = true;
          })
          .finally(() => {
            this.listLoading = false;
          });
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      // this.form.value=[]
      // this.options=[]
      this.fetchData();
      this.newvalue = this.form.value;
      this.$refs["form"].resetFields();
      this.form.value = this.newvalue;
    },
    fetchData() {
      this.listLoading = true;
      getDeviceList({ page: this.page, limit: this.limit })
        .then((response) => {
          this.pTotal = response.data.total;
          this.list = response.data.list;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    changeBind(id) {
      this.dialogVisible = true;
      this.id = id;
    },
    searchInfo() {
      if (this.select == "") {
        this.selectNum = true;
        setTimeout(() => {
          this.selectNum = false;
        }, 2000);
      }
      if (this.search == "") {
        this.searchNum = true;
        setTimeout(() => {
          this.searchNum = false;
        }, 2000);
      }
      //
      if (this.search && this.select && !this.bo) {
        this.bo = true;
        this.listLoading = true;
        searchInfo({ id: this.select, content: this.search })
          .then((res) => {
            this.pTotal = res.data.total;
            this.list = res.data.list;
            this.isSearch = true;
            this.bo = false;
          })
          .finally(() => {
            this.listLoading = false;
          });
      }
    },
    checkNull() {
      if (this.search == "") {
        this.fetchData();
      }
    },
    //发送换绑信息
    sendNewPatient() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          sendChangeBind({ patient: this.form.value[2], device: this.id })
            .then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
              });
            })
            .finally(() => {
              this.closeDialog();
            });
        } else {
          return false;
        }
      });
    },
    disabled(row) {
      this.listLoading = true;
      sendDisable(row.id)
        .then((res) => {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.fetchData();
          this.listLoading = false;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    showPatienInfo(id) {
      this.listLoading = true;
      getPatient(id).then((res) => {
        this.patientInfo = res.data[0];
        this.listLoading = false;
      });
      this.listLoading = false;
    },
    showDeviceInfo(id) {
      this.listLoading = true;
      getDevice(id).then((res) => {
        console.log(1, res);
        this.deviceInfo = [];
        this.templateList = [];
        for (const iterator of res.data.device_list) {
          let obj = {};
          obj.name =
            iterator.patient_name +
            "-" +
            iterator.sickroom +
            "-" +
            iterator.section_name +
            "-" +
            iterator.bed_name;
          obj.create_time = iterator.create_time;
          obj.band = iterator.sign;
          this.deviceInfo.push(obj);
        }
        this.templateList = res.data.temperature_list;
        this.drawer = true;

        this.listLoading = false;
      });
      this.listLoading = false;
    },
  },
};
</script>
<style lang="scss">
.deviceInfo{
  div::-webkit-scrollbar{
    // display: none;
    width:10px;
  }
}
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.border {
  border: 1px solid #dcdfe6;
  height: 40px;
  border-right-width: -1px;
  border-radius: 5px 0 0 5px;
  box-sizing: border-box;
}
.borderDanger {
  border-color: red;
  .el-input__inner {
    border-color: red;
  }
}
.el-input-group__prepend {
  border: 0;
}
</style>
