<template>
  <div class="app-container">
    <el-form
      :model="adminInfo"
      :rules="setRules"
      ref="ruleForm"
      label-width="100px"
      width="500px"
    >
      <el-form-item label="UserName">
        <el-input
          v-model="adminInfo.loginId"
          placeholder="Please Input UserName"
        ></el-input>
      </el-form-item>
      <el-form-item label="Old PWD" prop="oldLoginPwd">
        <el-input
          v-model="adminInfo.oldLoginPwd"
          placeholder="Please Input old Password"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label="New PWD" prop="loginPwd">
        <el-input
          v-model="adminInfo.loginPwd"
          placeholder="Please Input new Password"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label="Confirm" prop="loginPwdConfirm">
        <el-input
          v-model="adminInfo.loginPwdConfirm"
          placeholder="Please Confirm new PWD"
          type="password"
        ></el-input>
      </el-form-item>

      <el-button type="primary" style="margin-top: 15px" @click="handleClick"
        >Edit</el-button
      >
      <el-button type="danger" style="margin-top: 15px" @click="handleBack"
        >Back</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { getInfo, setUser } from "@/api/user.js";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("please enter new password"));
      } else if (value !== this.adminInfo.loginPwd) {
        callback(new Error("password should match!"));
      } else {
        callback();
      }
    };
    return {
      url: "",
      adminInfo: {
        id: "",
        loginId: "", // loginId
        Name: "", // 用户名
        oldLoginPwd: "", // 旧密码
        loginPwd: "", // 新密码
        loginPwdConfirm: "", // 密码确认
      },
      setRules: {
        oldLoginPwd: [
          { required: true, trigger: "blur", message: "Please Input old PWD" },
        ],
        loginPwd: [
          { required: true, trigger: "blur", message: "Please Input new PWD" },
        ],
        loginPwdConfirm: [
          { required: true, trigger: "blur", message: "Please Re-enter new PWD" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
   // console.log(this.adminInfo.name)
  },
  methods: {
    fetchData() {
      getInfo().then((res)=>{
        this.adminInfo = res.data;
      })
    },
    handleBack() {
      this.$router.push('/');
    },
    handleClick() {
      // 处理修改的逻辑
      if(this.adminInfo.name && this.adminInfo.loginPwd && this.adminInfo.oldLoginPwd){
        setUser(this.adminInfo).then(res=>{
          if(typeof res === 'string'){
            const resp = JSON.parse(res);
            console.log(resp);
             this.$message.error(resp.msg);
          } else {
            // 说明修改成功
            this.$message.success('Success Change');
            this.$store.dispatch('user/logout').then(()=>{
              this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            })
          }
        })
      } else {
        this.$message.error('Please Enter all the Blank');
      }
    },
  },
};
</script>

<style scoped>
.app-container {
  width: 500px;
}
</style>