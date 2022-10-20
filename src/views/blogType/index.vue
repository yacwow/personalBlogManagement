<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div style="margin-top: 15px">
      <el-input
        placeholder="Please Input the Category of the article"
        v-model="input"
        class="input-with-select blogAddInput"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-input>
      <el-button
        type="primary"
        style="marginleft: 20px"
        @click="addBlogTypeHandle"
        >Add</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="Index" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="BlogType" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column prop="title" label="ArticleNum" align="center">
        <template slot-scope="scope">{{ scope.row.articleCount }}</template>
      </el-table-column>

      <el-table-column label="Edit" align="center" width="150">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="Edit"
            placement="left"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 删除按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="Delete"
            placement="top-start"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑文章弹出框 -->
        <el-dialog title="Edit Article Category" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Category Name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditBlogTypeHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlogType,
  addBlogType,
  delBlogType,
  findOneBlogType,
  updateOneBlogType,
} from "@/api/blogType.js";
export default {
  data() {
    return {
      input: "",
      select: "1",
      listLoading: false,
      data: [],
      dialogFormVisible:false,
      form:{
          name:'',
          order:'',
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getBlogType().then((res) => {
        this.listLoading = false;
        this.data = res.data;
      });
    },
    editBlogTypeHandle(blogTypeInfo) {
        findOneBlogType(blogTypeInfo.id).then(res=>{
            this.form=res.data;
            //console.log(this.form)
            this.dialogFormVisible=true;
        })
    },
    deleteBlogTypeHandle(val) {
      this.$confirm(
        "Are you sure to delete it?",
        "Hint",
        {
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          delBlogType(val.id).then(() => {
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
    addBlogTypeHandle() {
      if (this.input) {
        addBlogType({ name: this.input, order: this.select }).then(() => {
          this.fetchData();
          this.$message.success("Success Add");
        });
      } else {
        this.$message.error("No Content");
      }
    },
    confirmEditBlogTypeHandle(){
        updateOneBlogType({
            id:this.form.id,
            data:this.form,
        }).then(()=>{
            this.fetchData();
            this.$message.success('Success Update');
            this.dialogFormVisible=false;
        })
    },
  },
};
</script>

<style lang="scss" scoped>
.blogAddInput {
  width: 400px;
  margin-bottom: 20px;
}
</style>