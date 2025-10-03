<template>
  <!-- 作业批改页面 -->
  <div class="assign-wrap assign-wrap-custom">
    <Header :title="disabled ? '作业查看' : '作业批改'" :pathData="pathData" />
    <div class="flex-between assign-title">
      <div class="flex-start">
        <span class="task-total-score">总分：</span>
        <el-input disabled v-model="total" style="width: 200px"></el-input>
      </div>
      <div v-if="!disabled">
        <el-button type="primary" @click="auto">自动批改</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="assign-content">
      <div class="task-item" v-for="(item, i) in taskList" :key="i">
        <span class="task-kwa" v-for="kwa in item.lib.kwas" :key="item.id">{{ kwa.kwaName }}</span>
        <span class="task-kwa">{{ TOPICTYPE[item.lib.questionTypeId] ?? "预留题" }}</span>
        <div class="task-title">{{ i + 1 }}、{{ item.lib.title }}</div>
        <div class="flex-center total-score">本题总分：{{ item.score }}</div>
        <div v-html="item.lib.content" class="task-content"></div>
        <div class="task-select flex-between" v-if="['单选题', '多选题', '判断题'].includes(TOPICTYPE[item.lib.questionTypeId])">
          <div>
            <div class="flex-start task-answer-item" v-for="(answer, answerIdx) in item.lib.answers" :key="answer.id">
              <span>{{ String.fromCharCode("A".charCodeAt() + answerIdx) }}&nbsp;:&nbsp;{{ answer.itemContent }}</span>
              <span class="task-answer" v-if="answer.isAnswer">正确答案</span>
              <span class="task-answer1" v-if="answer.answer">学生答案</span>
            </div>
          </div>
          <div class="task-score">
            <el-button type="text" style="margin-right: 8px;font-size: 14px;">本题得分:</el-button>
            <el-input-number :disabled="disabled" @change="handleScore($event, item)" v-model="item.lib.value" :min="0" :max="item.score" />
          </div>
        </div>

        <div class="task-select flex-between" v-else>
          <div>
            <el-input
              v-if="['简答题'].includes(TOPICTYPE[item.lib.questionTypeId])"
              style="width: 400px"
              :autosize="{ minRows: 4, maxRows: 6 }"
              type="textarea"
              v-model="item.lib.answer"
              disabled
              maxlength="3000"
            />
          </div>
          <div>
            <el-checkbox-group v-if="!disabled" :disabled="disabled" v-model="item.lib.check" @change="handleCheck($event, item)">
              <el-checkbox class="custom-checkbox" :label="1"> A </el-checkbox>
              <el-checkbox class="custom-checkbox" :label="0.8"> B </el-checkbox>
              <el-checkbox class="custom-checkbox" :label="0.6"> C </el-checkbox>
              <el-checkbox class="custom-checkbox" :label="0.4"> D </el-checkbox>
            </el-checkbox-group>
            <div class="flex-center" style="margin-bottom: 10px">
              <el-button type="text" style="margin-right: 8px;font-size: 14px;">本题得分:</el-button>
              <el-input-number :disabled="disabled" @change="handleScore($event, item)" v-model="item.lib.value" :min="0" :max="item.score" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { correctDetail, correctAuto, correctSubmit } from "@/api/taskMgmt.js";
import Header from "@/views/page/components/header/index.vue";
import { TOPICTYPE } from "@/utils/consts.js";
import { ElMessage, ElMessageBox } from "element-plus";
const routes = useRouter();
const { currentRoute } = routes;
const route = currentRoute.value;
const testId = route.query.testId;
const stuId = route.query.stuId;
const type = route.query.type;
const autoObj = ref({});
const total = ref(0);
const disabled = type === "view" ? true : false;

const pathData = [
  {
    name: "作业管理",
    path: "/homes/courseteacherhome/exam/test/testmangt",
  },
  {
    name: "作业学生列表",
    path: "/homes/courseteacherhome/exam/test/taskList",
    query: {
      id: route.query.id,
      privilege: route.query.privilege,
    },
  },
  {
    name: disabled ? "作业预览" : "作业批改",
    path: "",
  },
];

const taskList = ref([]);
onMounted(() => {
  getCorrectDetail();
});

const scoreToatl = (type) => {
  total.value = 0;
  taskList.value.forEach((item) => {
    // 根据返回值判断满分
    if (autoObj.value[item.lib?.id] && type === "auto") {
      item.lib.value = item.score;
    }
    // 自动批改错误 && 没有老师写入值
    if (autoObj.value[item.lib?.id] === false && !item.lib.value) {
      item.lib.value = 0;
    }

    if (item.lib.value) total.value += Number(item.lib.value);
  });
};
const auto = () => {
  correctAuto({ testId, stuId }).then((res) => {
    if (res.code === "200") {
      autoObj.value = res.data;
      scoreToatl("auto");
      ElMessage.success("批改完成");
    }
  });
};

const getCorrectDetail = () => {
  correctDetail({ testId, stuId }).then((res) => {
    if (res.code === "200") {
      taskList.value = res?.data?.items || [];

      const answerMap = res.data.answerMap;
      const correctMap = res.data.correctMap;
      // 回显各项分数总分
      if (correctMap) {
        taskList.value.forEach((item) => {
          const score = correctMap[item.lib.id] ?? 0;
          if (score) {
            total.value += score;
          }
          item.lib.value = score ? score : 0;
        });
      }
      taskList.value.forEach((item) => {
        let value = null;
        if (answerMap) value = answerMap[item.lib.id];
        // 填空题逻辑额外处理
        if (TOPICTYPE[item.lib.questionTypeId] === "填空题") {
          const contentItems = item.lib.content.split(/___/);
          let newContent = "";
          item.lib.selectId = [];
          contentItems.forEach((content, idx) => {
            newContent += content;
            if (idx < contentItems.length - 1) {
              item.lib.selectId.push(item.id + idx);
              newContent += `<input id="${item.id + idx}" disabled value="${value ?? value[idx]}" />`;
            }
          });
          item.lib.content = newContent;
          console.log("item.lib", item.lib);
        }

        if (answerMap) {
          if (["单选题", "多选题", "判断题"].includes(TOPICTYPE[item.lib.questionTypeId])) {
            const da = answerMap[item.lib.id] || [];
            item.lib.answers?.forEach((a) => {
              if (da.indexOf(a.itemOption) !== -1) {
                a.answer = true;
              }
            });
          }

          if (["简答题"].includes(TOPICTYPE[item.lib.questionTypeId])) {
            item.lib.answer = answerMap[item.lib.id];
          }
        }
      });
      console.log("taskList.value", taskList.value);
    }
  });
};

const handleScore = (val, item) => {
  console.log("handleScore", val, item);
  item.lib.value = val;
  console.log("item.lib.value", item.lib.value);
  scoreToatl();
};
const handleCheck = (val, item) => {
  const values = val.length > 1 ? [val[val.length - 1]] : val;
  item.lib.check = values;
  item.lib.value = parseFloat((item.score * values[0]).toFixed(2));
  scoreToatl();
};
// 提交
const save = () => {
  ElMessageBox.confirm("确定保存吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const scoreMap = {};
      taskList.value.map((item) => {
        scoreMap[item.lib.id] = Number(item.lib.value) ?? 0;
      });

      correctSubmit({ scoreMap, testId, stuId }).then((res) => {
        if (res.code === "200") {
          ElMessage.success("保存成功");
          routes.push("/homes/courseteacherhome/exam/test/testmangt");
        }
      });
    })
    .catch(() => {});
};
</script>

<style scoped>
.assign-wrap {
  background: #fff;
  padding: 0 10px 10px 10px;
  text-align: left;
  font-size: 13px;
}
.assign-title {
  padding: 10px 0;
}

.task-kwa {
  background: #dff2ff;
  border-radius: 5px;
  padding: 3px 10px;
  margin-right: 10px;
  color: #0078cd;
  font-size: 14px;
}

.task-title {
  margin-bottom: 5px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #1b1b1b;
  line-height: 21px;
  margin-top: 10px;
}

.task-item {
  padding-bottom: 10px;
  padding-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  position: relative;
}

.total-score {
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #1b1b1b;
}

.task-score {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-answer {
  font-size: 12px;
  margin-left: 8px;
  color: #019a48;
  background: rgba(50, 177, 108, 0.15);
  border-radius: 5px;
  padding: 3px 10px;
}
.task-answer1 {
  font-size: 12px;
  margin-left: 8px;
  color: #ff9748;
  background: rgba(255, 151, 72, 0.15);
  border-radius: 5px;
  padding: 3px 10px;
}
.task-total-score {
  font-size: 14px;
}
.task-select {
  padding-left: 20px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #1b1b1b;
}
.task-answer-item {
  margin-bottom: 10px;
}
.task-content {
  padding-left: 20px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #1b1b1b;
  margin-bottom: 10px;
}
</style>
<style>
.assign-wrap-custom .el-input-number .el-input-number__decrease {
  width: 30px;
  height: 30px;
  background: #27a5ff;
  border-radius: 2px;
}
.assign-wrap-custom .el-input-number .el-input-number__decrease .el-icon{
  color: #fff;
}
.assign-wrap-custom .el-input-number__increase{
  width: 30px;
  height: 30px;
  background: #27a5ff;
  border-radius: 2px;
}
.assign-wrap-custom .el-input-number__increase .el-icon{
  color: #fff;
}
.assign-wrap-custom .is-disabled .el-input-number__decrease{
  background: #f5f7fa !important;
}
.assign-wrap-custom .is-disabled .el-input-number__increase{
  background: #f5f7fa !important;
}
.assign-wrap-custom .is-disabled .el-input-number__increase .el-icon{
  color: #ddd !important;
}
.assign-wrap-custom .is-disabled .el-input-number__decrease .el-icon{
  color: #ddd !important;
}
.custom-checkbox{
  display: block;
}



</style>