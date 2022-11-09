<template>
  <div
    class="app-container"
    style="position: relative; min-height: calc(100vh - 50px); display: flex"
  >
    <div class="left" >
      <div class="patient">
        <div class="checkPatient">已检测患者信息</div>
        <div>
          <el-select v-model="roomNum" style="width: 110px">
            <el-option
              v-for="item in roomList"
              :key="item.value"
              :label="item.sickroom"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="roomNum" style="width: 110px">
            <el-option
              v-for="item in roomList"
              :key="item.value"
              :label="item.sickroom"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-date-picker
            style="width: 160px"
            v-model="date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
        <div class="table" style="margin-top:5px;">
          <el-table :data="list" 
          :header-cell-style="{ backgroundColor: 'rgba(0,0,0,0.1)' }"
          >
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                {{ scope.row.patient_name }}
              </template>
            </el-table-column>
            <el-table-column label="房号-床号" align="center">
              <template slot-scope="scope">
                {{ scope.row.sickroom + "-" + scope.row.bed_name }}
              </template>
            </el-table-column>
            <el-table-column label="温度" align="center">
              <template slot-scope="scope">
                {{ scope.row.temperature }} ℃
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <!-- <div class="todayHistory" ref="today"></div> -->
        <div class="noTest">
          <div class="noTest__list">
            <span
              style="
                font-size: 14px;
                margin-left: 10px;
                margin-bottom: 3px;
                padding-bottom: 3px;
              "
            >
              未检测患者信息
            </span>
            <div>
              <el-table
                :data="noList"
                :header-cell-style="{ backgroundColor: 'rgba(0,0,0,0.1)' }"
              >
                <el-table-column label="姓名" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.patient_name }}
                  </template>
                </el-table-column>
                <el-table-column label="房号-床号" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.sickroom + "-" + scope.row.bed_name }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="pie" ref="pie"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="history">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getList, showTestedInfo, showNoTestedInfo } from "@/api/table";
import * as echarts from "echarts";
// var myChart = echarts.init(document.getElementsByClassName('pie')[0]);
// //绘制图表
// myChart.setOptionl({

// })
export default {
  data() {
    return {
      roomList: [
        { id: 0, sickroom: "全部病房" },
        { id: 1, sickroom: 701 },
        { id: 2, sickroom: 702 },
      ],
      roomNum: 0,
      date: "",
      dialogVisible: true,
      list: null,
      checkNum: 0,
      noList: null,
      noCheckNum: 0,
      listLoading: false,
      todayData: [36.4, 36.6, 36.3, 36.8],
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    // this.showPie();
  },

  methods: {
    fetchData() {
      this.listLoading = true;
      Promise.all([
        showTestedInfo().then((res) => {
          this.list = res.data.CheckToday;
          this.checkNum = res.data.count;
        }),
        showNoTestedInfo().then((res) => {
          this.noList = res.data.NotCheckToday;
          this.noCheckNum = res.data.count;
        }),
      ]).then((res) => {
        this.listLoading = false;
        this.showPie();
        // this.showTem();
        this.showTemHis();
      });
    },
    showPie() {
      var pie = echarts.init(this.$refs.pie);
      pie.setOption({
        title: {
          text: "已检测未检测占比",
          left: "center",
          top: 5,
        },
        labelLine: {
          length: 5,
          length2: 5,
        },
        series: {
          type: "pie",
          radius: ["0%", "60%"],
          label: {
            fontSize: 10,
            color: "#000",
          },
          labelLine: {
            length: 6,
            length2: 6,
          },
          data: [
            { value: this.checkNum, name: "已检测" },
            { value: this.noCheckNum, name: "未检测" },
          ],
          tooltip: {},
        },
        tooltip: {
          trigger: "item",
        },
      });
    },
    showTem() {
      var myChart = echarts.init(this.$refs.today);
      // myChart.setOption({
      //   title:{
      //     text:'a'
      //   },
      //   xAxis:{
      //     name:'日期',
      //     type:'category',
      //     data:['11.5','11.6','11.7','11.8','11.9','11.10','11.11']
      //   },
      //   yAxis:{
      //     name:'温度',
      //     type:'category',

      //   },
      //  series:{
      //   type:'line',
      //   data:[100,120,130,112,140]
      //  }
      // })
      var option;
      option = {
        xAxis: [
          {
            name: "时间",
            type: "category",
            data: ["11.5", "11.6", "11.7", "11.8"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            name: "温度",
            min: "dataMin",
          },
        ],
        series: {
          type: "line",
          data: this.todayData,
        },
        tooltip: {
          trigger: "item",
        },
      };
      myChart.setOption(option);
    },
    showTemHis() {},
  },
};
</script>

<style lang="scss">
.patient {
  width: 400px;
  height: 100%;
  margin-right: 40px;
  // position: absolute;
  bottom: 30px;
  border-radius: 5px 0 5px 5px;
  padding: 5px 5px 0;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
        rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  .checkPatient {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .table {
    overflow: auto;
    height: 100%;
    tr {
      cursor: pointer;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.right{
  width: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  margin-bottom: 30px;
  display: flex;
  .todayHistory {
    width: 100%;
    height: 250px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    // background-color: pink;
  }
  .noTest {
    margin-left:-40px;
    width: 100%;
    height: 250px;
    // margin-left: 40px;
    display: flex;
    &__list {
      width: 300px;
      height: 100%;
      margin-right: 40px;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
        rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      border-radius:0 5px 5px 0;
      padding: 5px 5px 0;
      display: flex;
      flex-direction: column;
    }
    .pie {
      // border:1px solid #304156;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      border-radius: 5px;
      width: 300px;
      height: 100%;
    }
  }
}
.bottom {
  background-color: pink;
  display: flex;

  .history {
    width: 100%;
    height:300px;
    background-color: purple;
  }
}
</style>
