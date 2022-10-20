<template>
  <div class="app-container">
    <!-- 项目名称 -->
    <div class="block">Project Name</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.name" placeholder="Please Input Project Name"></el-input>
    </div>

    <!-- 项目描述（每一项描述以英文逗号分割） -->
    <div class="block">Project Description(Separate by Comma)</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.description"
        placeholder="Please Input Project Description(Every Description Separate by Comma)"
      ></el-input>
    </div>

    <!-- 项目链接 -->
    <div class="block">Project Link</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.url" placeholder="Please Input Project Link"></el-input>
    </div>

    <!-- github 地址 -->
    <div class="block">github Address</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.github"
        placeholder="Please Input the Address of github"
      ></el-input>
    </div>

    <!-- 预览图 -->
    <div style="margin-bottom: 15px">
      <Upload uploadTitle="Project Preview" v-model="form.thumb" />
    </div>

    <!-- 项目等级 -->
    <div class="block">Project Level</div>
    <div style="margin-bottom: 15px">
      <el-select v-model="form.order" placeholder="Classify Level">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
        <el-option label="4" value="4"></el-option>
        <el-option label="5" value="5"></el-option>
      </el-select>
    </div>

    <el-button type="primary" plain @click="addProjectHandle"
      >Post the Project</el-button
    >
  </div>
</template>

<script>
import Upload from "@/components/Upload.vue";
import {addProject} from '@/api/project.js'
export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        thumb: "",
        order: 1,
      },
    };
  },
  components: {
    Upload,
  },
  methods: {
    addProjectHandle(){
        let obj = {...this.form};
        obj.description = obj.description.split(',');
        obj.order = parseInt(obj.order);
        addProject(obj).then(()=>{
            this.$router.push('/projectsList');
            this.$message.success('Success Add');
        })

    }
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>