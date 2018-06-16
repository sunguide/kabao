<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="description" content="2018最新银联MCC码快速查询工具, 怎么查询MCC码">
    <meta name="keywords" content="MCC, MCC码, POS, 银联, 商户">
    <meta name="author" content="卡包">
    <!-- import CSS -->
    <link rel="stylesheet" href="//cdn.staticfile.org/element-ui/2.4.1/theme-chalk/index.css">
    <title>2018最新银联MCC码快速查询工具-卡包工具</title>
</head>
<body>
<div id="app">
    <div class="container">
        <div class="header">
            <img class="logo" src="/public/images/logo_complex.webp">
            <h2>MCC码快速查询工具</h2>
        </div>
        <el-row type="flex" justify="center">
            <el-col :span="6">
                <div class="search-input-box">
                    <el-input placeholder="请输入4位MCC码，或者商户码" v-model="mcc" class="input-search">
                        <el-button slot="append" icon="el-icon-search" @click="query()"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <div class="search-container">
            <el-row type="flex" justify="center">
                <el-col :span="12">
                    <template>
                        <template>
                            <el-table
                                    :data="tableData"
                                    :show-header=false
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="name"
                                        label="商户编号"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="value"
                                        label="值">
                                </el-table-column>
                            </el-table>
                        </template>
                    </template>

                </el-col>
            </el-row>
        </div>
    </div>
    <div class="footer">
        <el-row type="flex" justify="center">
            <div class="copyright" v-model="currentYear">
                    <p>Copyright ©  <span v-html="currentYear"></span> 卡包</p>
            </div>
        </el-row>
    </div>
</div>
</body>
<!-- import Vue before Element -->
<script src="//cdn.staticfile.org/vue/2.5.17-beta.0/vue.min.js"></script>
<!-- import JavaScript -->
<script src="//cdn.staticfile.org/element-ui/2.4.1/index.js"></script>
<script src="//cdn.staticfile.org/axios/0.18.0/axios.min.js"></script>
<script>
  new Vue({
    el: '#app',
    data: function() {
      return {
        visible: false,
        mcc:'',
        tableData: [],
        currentYear: new Date().getFullYear(),
      }
    },
    methods: {
      query(){
        var mcc = this.mcc.trim();
        if((mcc + '').length > 10){
          mcc = mcc.substr(3,4);
        }else if((mcc + '').length < 4){
          mcc = false;
        }
        if(mcc){
          axios.get('/api/mcc/' + mcc)
            .then(res => {
              if (res.status === 200) {
                this.tableData = [];
                this.tableData.push({
                  name: "MCC码",
                  value: res.data.data.mcc,
                });
                this.tableData.push({
                  name: "大类",
                  value: res.data.data.category1,
                });
                this.tableData.push({
                  name: "细类",
                  value: res.data.data.category2,
                });
                this.tableData.push({
                  name: "商户类型",
                  value: res.data.data.name,
                });
                this.tableData.push({
                  name: "刷卡费率",
                  value: res.data.data.rate,
                });
                console.log(this.tableData)
              }
            })
          .catch(e => {
            this.$message.error('查询失败');
          })
        }else{
          this.$message.error('请输入正确的mcc码或者商户码');
        }
      }
    }
  })
</script>

<style>
    body {
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
    }
    .header {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 30px;
    }
    .header img.logo {
        height: 80px;
        margin: auto;
    }
    .search-container {
        margin-top: 20px;
    }
    .footer {
        margin-top: 80px;
        margin-bottom: 20px;
    }
</style>

</html>