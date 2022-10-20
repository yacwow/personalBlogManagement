<template>
  <div class="app-container">
    <!-- 文章标题 -->
    <div class="block">Article Title</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.title"
        placeholder="Please Input Article Title"
      ></el-input>
    </div>
    <!-- 文章编辑 -->
    <div class="block">Edit Article</div>
    <editor
      :initialValue="form.editorText"
      ref="toastuiEditor"
      height="500px"
    ></editor>
    <!-- 文章描述 -->
    <div class="block">Description</div>
    <el-input :rows="6" type="textarea" v-model="form.description"></el-input>
    <!-- 上传图片 -->
    <Upload uploadTitle="Head Picture" v-model="form.thumb"></Upload>
    <!-- 选择分类 -->
    <div class="block">选择分类</div>
    <el-select @change="changeHandle" v-model="form.select" slot="prepend" placeholder="Article Type">
      <el-option
        v-for="item in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 发布按钮 -->
    <div>
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="editArticleHandle"
        >Confirm</el-button
      >
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/Upload.vue";
import { getBlogType } from "@/api/blogType.js";
import { editBlog,findOneBlog } from "@/api/blog.js";
export default {
  components: {
    editor: Editor,
    Upload,
  },
  created() {
    // 一进来的时候，就需要拿取分类的数据
    getBlogType().then(({ data }) => {
      this.blogType = data;
    });
    // 还要拿到传递过来的id，并根据id获取到整篇文章的内容并回填表单
    this.id=this.$route.params.id;
    findOneBlog(this.id).then(res=>{
        //回填
        this.form=res.data;
        this.form.select=res.data.category==null?'':res.data.category.id;
        this.$refs.toastuiEditor.invoke('setHTML',res.data.htmlContent);
    })  
  },
  data() {
    return {
      id: null,//存储传递过来的id
      form: {
        title: "", // 文章标题
        editorText: "", // 用户编辑的内容
        description: "", // 文章的描述
        thumb: "", // 文章的图片
        select: "", // 选择分类
      },
      blogType: [], // 存放博客分类
      imageUrl: "", // 图片在服务器上面的地址
    };
  },
  methods: {
    editArticleHandle() {
      //获取表单内容    发送请求
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");

      // 接下来，我们来组装要传递给服务器的对象

      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
        toc: [],
        htmlContent: html,
        thumb: this.form.thumb,
        markdownContent: markdown,
      };
      // 对象组装好以后，就提交给服务器
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        editBlog({id:this.form.id,data:obj}).then(() => {
          this.$router.push("/blogList"); // 跳转到文章列表
          this.$message.error("Edit Success");
        });
      } else {
        this.$message.error("Please Check the Content");
      }
    },
    changeHandle(){
        this.$forceUpdate();
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