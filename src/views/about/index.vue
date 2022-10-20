<template>
  <div class="app-container">
    <div class="block">About Me</div>
    <el-input
      v-model="url"
      placeholder="Please Input the Url"
      :disabled="isDisabled"
    ></el-input>
    <el-button type="primary" style="margin-top: 15px" @click="clickHandle">{{btnContent}}</el-button>
  </div>
</template>

<script>
import { getAbout, editAbout } from "@/api/about.js";
export default {
  data() {
    return {
      url: "",
      isDisabled: true,
      btnContent : 'Edit'
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAbout().then(({ data }) => {
        this.url = data;
      });
    },
    clickHandle(){
        if(this.btnContent == 'Edit'){
            // 用户要编辑内容
            this.btnContent = 'Finished';
            this.isDisabled = !this.isDisabled;
        } else {
            // 用户编辑完成了，要更新内容
            if(this.url){
                this.btnContent = 'Edit';
                this.isDisabled = !this.isDisabled;
                editAbout({url : this.url}).then(res=>{
                    console.log(res,'cvdf');
                })
                this.$message({
                    message: 'Success',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: 'Can not be blank',
                    type: 'warning'
                });
            }
        }
    }
  },
};
</script>

<style scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>