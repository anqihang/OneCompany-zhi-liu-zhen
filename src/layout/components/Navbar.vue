<template>
  <div class="navbar">
    <el-dialog :visible.sync="dialogVisible">
      <el-form :model="user" ref="form" :rules="rules">
        <!-- <el-form-item label="用户名" label-width="100px" prop="account">
          <el-input v-model="user.account"></el-input>
        </el-form-item> -->
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="user.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="sendUser">确定</el-button>
      </div>
    </el-dialog>
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <img
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            class="user-avatar"
          />

          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/"> -->
          <el-dropdown-item @click.native="dialogVisible = true" v-loading.fullscreen.lock="listLoading">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <!-- </router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { resetRouter } from "@/router";
import { sendEditUser } from "@/api/table";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  data() {
    var checkAcount = (rule, value, callback) => {
      if (/^[0-9a-zA-Z_]{5,12}$/.test(value) == false) {
        callback(new Error("由数字字母下划线组成"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      listLoading: false,
      user: {
        // account: "",
        passward: "",
      },
      rules: {
        // account: [
        //   { required: true, message: "请输入用户名", trigger: "blur" },
        //   {
        //     min: 3,
        //     max: 10,
        //     message: "长度在 3 到 10 个字符",
        //     trigger: "blur",
        //   },
        // ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
          { validator: checkAcount, trigger: "blur" },

        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    },
    sendUser() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.listLoading = true;
          sendEditUser(this.user)
            .then((res) => {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            })
            .finally(() => {
              this.dialogVisible = false;
              this.listLoading = false;
            });
        }
      });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      // const result = await this.$store.dispatch('user/logout')
      localStorage.removeItem("Token");
      localStorage.removeItem("per");
      // must remove  token  first
      resetRouter();
      this.$router.push("/login");
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
