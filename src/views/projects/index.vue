<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- 序号 -->
      <el-table-column align="center" label="Index" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 项目名称 -->
      <el-table-column align="center" label="Project Name" width="150">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" class="proName">{{
            scope.row.name
          }}</a>
        </template>
      </el-table-column>

      <!-- 项目描述 -->
      <el-table-column align="center" label="Project Description">
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template>
      </el-table-column>

      <!-- 预览图 -->
      <el-table-column align="center" label="Preview" width="150">
        <template slot-scope="scope">
          <el-image
            style="width: 120px"
            :src="scope.row.thumb"
            :preview-src-list="srcList"
          >
          </el-image>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="Edit" align="center" width="150">
        <template slot-scope="scope">
          <!-- github -->
          <el-tooltip
            class="item"
            effect="dark"
            content="Github"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="iconfont icon-github"
              class="github"
              circle
              size="mini"
              @click="openGitHubHandle(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 编辑 -->
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
              @click="editProjectHandle(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 删除 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="Delete"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteProjectHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      title="Please Edit the Project"
      :visible.sync="dialogFormVisible"
      fullscreen
    >
      <el-form :model="form">
        <!-- 项目名称 -->
        <el-form-item label="Project Name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <!-- 项目描述 -->
        <el-form-item label="Project Description(Separate by Comma)">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <!-- 项目链接 -->
        <el-form-item label="Project Link">
          <el-input v-model="form.url"></el-input>
        </el-form-item>

        <!-- github 地址 -->
        <el-form-item label="Github Address">
          <el-input v-model="form.github"></el-input>
        </el-form-item>

        <!-- 预览图 -->
        <el-form-item label="Preview">
          <Upload v-model="form.thumb" />
        </el-form-item>

        <!-- 项目等级 -->
        <el-form-item label="Index Level">
          <el-select v-model="form.order" placeholder="Index Level">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 确认和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, setProject, delProject } from "@/api/project.js";
//import { server_URL } from "@/urlConfig.js";
import Upload from "@/components/Upload.vue";

export default {
  data() {
    return {
      data: [], // 存储数据
      listLoading: false,
      srcList: [],
      dialogFormVisible: false, // 一开始编辑对话框不可见
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
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getProject().then(({ data }) => {
        this.listLoading = false;
        this.data = data;
        for (let i of this.data) {
          //i.thumb2 = server_URL + i.thumb;
         // console.log(i.thumb2)
          this.srcList.push(i.thumb);
        }
      });
    },
    openGitHubHandle(projectInfo) {
      window.open(projectInfo.github);
    },
    editProjectHandle(projectInfo) {
      this.dialogFormVisible = true;
      this.form = {
        ...projectInfo,
        description: projectInfo.description.toString(),
      };
    },
    deleteProjectHandle(projectInfo) {
      this.$confirm("Are you confirm to delete it?", "Hint", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          delProject(projectInfo.id).then(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "Success Delete!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancelled",
          });
        });
    },
    // 确认修改
    confirmEditProjectHandle() {
      let obj = { ...this.form };
      obj.description = this.form.description.split(",");
      obj.order = parseInt(this.form.order);

      setProject(obj.id, obj).then(() => {
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success("Success Edit");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.proName:hover {
  color: rgb(163, 163, 163);
}
.github {
  background-color: rgb(163, 163, 163);
  border: 1px solid rgb(163, 163, 163);
}
</style>