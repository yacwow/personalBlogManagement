<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="Index" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index +(currentPage-1)*eachPage+1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="Title" width="150" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="Blog-Preview"
            width="200"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="fit"
              :preview-src-list="srcList"
            ></el-image>
            <a
              href=""
              target="_blank"
              @click.prevent="goToTitleHandle(scope.row)"
              slot="reference"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>

      <el-table-column prop="scanNumber" label="ScanNumber">
        <template slot-scope="scope">{{ scope.row.scanNumber }}</template>
      </el-table-column>
      <el-table-column prop="commentNumber" label="CommentNumber">
        <template slot-scope="scope">{{ scope.row.commentNumber }}</template>
      </el-table-column>
      <el-table-column prop="category" label="Category">
        <template slot-scope="scope">{{ scope.row.category===null?'No Category':scope.row.category.name }}</template>
      </el-table-column>
      <el-table-column prop="createDate" width="220" label="CreateDate">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>

      <el-table-column label="Edit" align="center">
        <template slot-scope="scope">
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
              @click="editBanner(scope.row)"
            ></el-button>
          </el-tooltip>
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
              @click="deleteBlog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="eachPage"
      style="margin-top: 30px"
      background
      layout="prev, pager, next, total, ->, sizes, jumper"
      :page-sizes="[5, 10, 20]"
      :total="count"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { findBlog, deleteOneBlog } from "@/api/blog";
import { formatDate } from "@/utils/tools.js";
import {  frontEnd_URL } from "@/urlConfig";
export default {
  data() {
    return {
      data: [],
      srcList: [], //预览图链接数组
      eachPage: 5, //每一页条数
      currentPage: 1,
      totalPage: 15, //总页数
      count: 0, //数据总条数
    //   pagerCurrentPage: 1, //分页栏的当前页码
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      findBlog(this.currentPage, this.eachPage).then((res) => {
        //console.log(res.data.rows);
        this.data = res.data.rows;
        for (var i of this.data) {
          i.createDate = formatDate(i.createDate);
          // i.thumb =
          //   server_URL + "/static/upload/2021-7-28-15-15-33-316-3fc18.jpeg";
          this.srcList.push(i.thumb);
        }
        this.count = res.data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    //跳转到文章
    goToTitleHandle(blogInfo) {
      window.open(`${frontEnd_URL}/article/${blogInfo.id}`);
    },
    deleteBlog(blogInfo) {
      this.$confirm(
        "Comment below the article will be deleted with the article, are you sure to delete it",
        "Hint",
        {
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          deleteOneBlog(blogInfo.id).then(() => {
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
    currentChangeHandle(pageNum) {
        //pageNum:点击的某个页码的string
      this.currentPage = parseInt(pageNum);
    //   this.pagerCurrentPage = 1;
      this.fetchData();
    },
    sizeChangeHandle(pageNum) {
        // pageNum：每一页有几条东西
      this.eachPage = parseInt(pageNum);
      this.currentPage = 1;
      this.fetchData();
    },
    prevClickHandle() {
      this.currentPage -= 1;
    },
    nextClickHandle() {
      this.currentPage += 1;
    },
    editBanner(blogInfo){
      console.log(blogInfo)
      this.$router.push(`/editBlog/${blogInfo.id}`)
    }
  },
};
</script>

<style lang="scss" scoped>
</style>