<template>
  <div class="app-container">
    <input type="text" v-model="paperId">
    <el-button @click="getPaperInfo(paperId)">获取</el-button>

    <div>
      <h4>题    目：{{ baseInfo.title }}</h4>
      <h4>姓    名：{{ baseInfo.name }}</h4>
      <h4>学    号：{{ baseInfo.no }}</h4>
      <h4>系    别：{{ baseInfo.department }}</h4>
      <h4>专    业：{{ baseInfo.major }}</h4>
      <h4>年    级：{{ baseInfo.grade }}</h4>
      <h4>指导教师：{{ baseInfo.teacher }}</h4>
    </div>
    <br><br>


    <h2>{{ baseInfo.title }}</h2>
    <h4>摘要</h4>
    <div v-for="ch in chn_abstracts">
      &nbsp;&nbsp;&nbsp;&nbsp;{{ ch.content }}<br>
    </div>
    <h4>关键词：{{ baseInfo.chnKeywords }}</h4>
    <br><br>


    <h2>{{ baseInfo.engTitle }}</h2>
    <h4>Abstract</h4>
    <div v-for="en in eng_abstracts">
      &nbsp;&nbsp;&nbsp;&nbsp;{{ en.content }}<br>
    </div>
    <h4>Key Words:{{ baseInfo.engKeywords }}</h4>
    <br><br>


    <!--六个章节-->
    <div v-for="ch in chapters">
      <br><br><h1>{{ch.section.title}}</h1>
      <!---->
      <div v-for="child in ch.children">

        <!--小章节标题含超链接-->
        <div v-if="child.section.content==='' && child.section.style!=='论文正文'" style="color: #990055">
          <span v-for="son in child.children">

            <span v-if="son.section.style === 'superscript' || son.section.style === 'subscript'">
              <h5 style="display: inline-block;">
                {{son.section.content}}
<!--                <span style="color: red">-->
<!--                  超链接{{son.section.type}}-->
<!--                </span>-->
              </h5>

            </span>
            <span v-else>
              <h2 style="display: inline-block;">
                {{son.section.content}}
<!--                <span style="color: blue">-->
<!--                  普通{{son.section.type}}-->
<!--                </span>-->
              </h2>
            </span>
          </span>
        </div>

        <div v-else>
          <div v-if="child.section.style==='二级标题'">
            <h2>
              {{child.section.seq}}{{child.section.content}}
              <span style="color: forestgreen;font-size: 20px">
                二级标题-{{child.section.type}}
              </span>
            </h2>

          </div>

          <div v-else-if="child.section.style==='三级标题'">
            <h3>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{child.section.seq}}{{child.section.content}}
              <span style="color: forestgreen;font-size: 15px">
                三级标题-{{child.section.type}}
              </span>
            </h3>

          </div>

          <div v-else>
            <div v-if="child.section.content===''">
              <!-- 类似于<paragraphs style="论文正文">的标签，略过 -->
            </div>
            <div v-else>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{child.section.content}}
              <div v-if="child.section.type==='表图文字'" style="display: inline-block">
                <span style="color: orangered;font-size: 10px">
                  图表-{{child.section.type}}
                </span>
              </div>
              <div v-else style="display: inline-block">
                <span style="color: orange;font-size: 10px">
                  段落-{{child.section.type}}
                </span>
              </div>
            </div>
          </div>


          <div v-for="son in child.children">
            <div v-if="son.section.style === 'superscript'">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{son.section.content}}
              <span style="color: red">
              超链接-{{son.section.type}}
            </span>
            </div>
            <div v-else>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{son.section.content}}
              <span style="color: blue">
              段落-{{son.section.type}}
            </span>
            </div>
          </div>

        </div>



      </div>
    </div>

  </div>
</template>

<script>
import paper from '@/api/paper/paper'
export default { // 声明组件
  name: 'Info',

  data() {
    return {
      paperId:'',
      paper: [],
      baseInfo: [],
      chn_abstracts: [],
      eng_abstracts: [],
      chapters: []
    }
  },

  created() {
    this.getPaperInfo('1421727364794068994')
  },

  methods: {
    // 查询一篇论文
    getPaperInfo(id) {
      paper.getPaperById(id)
        .then(response => {
          this.paper = response.data.paper
          this.baseInfo = response.data.paper.baseInfo
          this.chn_abstracts = response.data.paper.chn_abstract
          this.eng_abstracts = response.data.paper.eng_abstract
          this.chapters = response.data.paper.chap.children
        })
      console.log(this.paper)
    }

  }
}
</script>

<style scoped>
</style>
