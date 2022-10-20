<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="Index" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="Title" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="description" label="Description">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="MidImgPreview" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.midImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="BigImgPreview" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.bigImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="Edit" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="Edit"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBanner(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑首页标语 -->
    <el-dialog
      top="5vh"
      title="Please Edit the info"
      :visible.sync="outerVisible"
    >
      <el-form :model="form">
        <el-form-item label="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="MidImg">
              <!-- 中图 -->
              <Upload v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="BigImg">
              <!-- 大图 -->
              <Upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="editBannerConfirm">Submit</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner } from "@/api/banner.js";
//import { server_URL } from "@/urlConfig.js";
import Upload from "@/components/Upload.vue";
import { setBanner } from "@/api/banner.js";
export default {
  data() {
    return {
      data: [],
      outerVisible: false,
      form: {
        id: "",
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
      },
    };
  },
  components: {
    Upload,
    Upload,
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getBanner().then((res) => {
        this.data = res.data;
        // for (let item of this.data) {
        //   item.midImg2 = server_URL + item.midImg;
        //   item.bigImg2 = server_URL + item.bigImg;
        // }
      });
    },
    editBanner(val) {
      this.outerVisible = true;

      this.form = { ...val };
      //console.log(val, this.form);
    },
    editBannerConfirm() {
      // 从表单里面拿到用户修改的数据并发送给服务器
      // 后台设定我们需要把所有的数据都发回去才行
      let arr = [...this.data];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == this.form.id) {
          arr[i] = this.form;
        }
      }
      setBanner(arr).then((res) => {
        this.outerVisible = false;
        this.$message({
          message: 'Edit Complete',
          type: 'success'
        });
        this.fetchData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>