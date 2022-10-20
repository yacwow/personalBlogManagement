<template>
  <div class="app-container">
    <div class="block">Website Info</div>
    <div class="block2">Website Title</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.siteTitle" disabled></el-input>
    </div>
    <div class="block2">email</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.mail" disabled></el-input>
    </div>
    <div class="block2">ICP</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.icp" disabled></el-input>
    </div>
    <el-divider></el-divider>
    <div class="block">Avatar</div>
    <div style="margin-bottom: 15px">
      <el-image
        style="width: 100px; height: 100px"
        :src="form.avatar"
      ></el-image>
    </div>
    <el-divider></el-divider>
    <div class="block">Favicon Info</div>
    <div class="block2">Favicon Address</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input
        v-model="form.favicon"
        placeholder="Please Input the Favicon Address"
        disabled
      ></el-input>
    </div>
    <div class="block2">Favicon Preview</div>
    <div style="margin-bottom: 15px">
      <el-image
        style="width: 50px; height: 50px"
        :src="form.favicon"
      ></el-image>
    </div>
    <el-divider></el-divider>
    <div class="block">github Info</div>
    <div class="block2">github Name</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.githubName" disabled></el-input>
    </div>
    <div class="block2">github Address</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.github" disabled></el-input>
    </div>
    <el-divider></el-divider>
    <div class="block">QQ Info</div>
    <div class="block2">QQ Num</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.qq" disabled></el-input>
    </div>
    <div class="block2">QQ QrCode</div>
    <div style="margin-bottom: 15px">
      <el-image
        style="width: 100px; height: 100px"
        :src="form.qqQrCode"
      ></el-image>
    </div>
    <el-divider></el-divider>
    <div class="block">Wechat Info</div>
    <div class="block2">Wechat Num</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.weixin" disabled></el-input>
    </div>
    <div class="block2">Wechat QrCode</div>
    <div style="margin-bottom: 15px">
      <el-image
        style="width: 100px; height: 100px"
        :src="form.weixinQrCode"
      ></el-image>
    </div>
    <el-divider></el-divider>
    <el-button type="primary" @click="openEditPanel">Edit Model</el-button>

    <!-- 弹出层 -->
    <el-dialog
      title="Please Edit"
      :visible.sync="dialogFormVisible"
      width="50%"
      top="5vh"
      fullscreen
    >
      <el-form :model="form">
        <el-form-item label="Website Name">
          <el-input v-model="form2.siteTitle"></el-input>
        </el-form-item>
         <el-form-item label="Email">
          <el-input v-model="form2.mail"></el-input>
        </el-form-item>
         <el-form-item label="ICP">
          <el-input v-model="form2.icp"></el-input>
        </el-form-item>
         <el-form-item label="Avatar">
          <!-- <el-input v-model="form2.avatar"></el-input> -->
          <Upload v-model="form2.avatar"/>
        </el-form-item>
         <el-form-item label="Web Favicon">
          <el-input v-model="form2.favicon"></el-input>
        </el-form-item>
         <el-form-item label="github Name">
          <el-input v-model="form2.githubName"></el-input>
        </el-form-item>
         <el-form-item label="github Address">
          <el-input v-model="form2.github"></el-input>
        </el-form-item>
         <el-form-item label="QQ Num">
          <el-input v-model="form2.qq"></el-input>
        </el-form-item>
         <el-form-item label="QQ QrCode">
          <!-- <el-input v-model="form2.qqQrCode"></el-input> -->
          <Upload v-model="form2.qqQrCode"/>
        </el-form-item>
         <el-form-item label="Wechat">
          <el-input v-model="form2.weixin"></el-input>
        </el-form-item>
         <el-form-item label="Wechat QrCode">
          <!-- <el-input v-model="form2.weixinQrCode"></el-input> -->
          <Upload v-model="form2.weixinQrCode"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmEditSetting">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSetting, setSetting } from "@/api/setting.js";
import Upload from '@/components/Upload.vue'
//import { server_URL } from '@/urlConfig.js'
export default {
  data() {
    return {
      form: {
        avatar: "",
        favicon: "",
        github: "",
        githubName: "",
        icp: "",
        id: "",
        mail: "",
        qq: "",
        qqQrCode: "",
        siteTitle: "",
        weixin: "",
        weixinQrCode: "",
      },
      form2 : {
        avatar: "",
        favicon: "",
        github: "",
        githubName: "",
        icp: "",
        id: "",
        mail: "",
        qq: "",
        qqQrCode: "",
        siteTitle: "",
        weixin: "",
        weixinQrCode: "",
      },
      dialogFormVisible : false
    };
  },
  components : {
    Upload
  },
  created() {
    this.fetchData(); // 获取数据
  },
  methods: {
    fetchData() {
      getSetting().then(res=>{
        this.form = res.data;
        // 处理图片的链接
        // this.form.avatar2 = server_URL  + this.form.avatar;
        // this.form.qqQrCode2 = server_URL  + this.form.qqQrCode;
        // this.form.weixinQrCode2 = server_URL  + this.form.weixinQrCode;
        this.form2 = {...this.form};
      })
    },
    openEditPanel(){
      this.dialogFormVisible = true;
    },
    confirmEditSetting(){
      setSetting(this.form2).then(()=>{
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success('Success Edit');
      })
    }
  },
};
</script>

<style scoped>
.block {
  margin: 15px 0;
  font-size: 20px;
  font-weight: 100;
}
.block2 {
  margin: 15px 0;
  font-size: 14px;
  font-weight: 100;
}
</style>