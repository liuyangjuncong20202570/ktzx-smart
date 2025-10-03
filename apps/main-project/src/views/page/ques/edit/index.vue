<template>
  <div class="ques-lib">
    <Header :title="id ? '编辑问卷' : '新建问卷'" :pathData="pathData" />
    <div class="ques-publish flex-between">
      <div class="flex-start">问卷名称: <el-input style="width: 150px; margin-left: 10px" v-model="name" @input="handleInput"></el-input></div>
    </div>
    <div class="ques-lib-btn flex-between">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <el-dropdown placement="bottom" style="margin-right: 10px;">
            <el-button type="primary" :icon="Plus">新增题目</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item,i) in libTypeList" :key="i"  @click="handleLibTypeConfirm(item)">{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        <!-- <el-button type="primary" :icon="Plus" @click="add">新增题目</el-button> -->
        <el-button type="danger" :icon="Delete" @click="batchDel" :disabled="!(courseList && courseList.length)">批量删除</el-button>
        <el-button type="primary" @click="save" :disabled="!(courseList && courseList.length)">保存</el-button>
        <el-button type="primary" :icon="Upload" @click="publish" :disabled="!(courseList && courseList.length)" v-if="status === 0">发布</el-button>
      </div>
    </div>

    <Topic
      v-if="topicFlag"
      :courseList="courseList"
      ref="topic"
      :item="item"
      :name="name"
      :id="id"
      @save="
        (data) => {
          if (data) id = data;
          getCourseLibList();
          topicFlag = false;
        }
      "
      @close="
        () => {
          topicFlag = false;
        }
      "
    />
    <vuedraggable v-model="courseList" @start="drag = true" @end="drag = false" item-key="index">
      <template #item="{ element, index }">
        <Topic
          v-if="element.topicFlag"
          :item="element"
          :name="name"
          :courseList="courseList"
          @save="
            () => {
              getCourseLibList();
              element.topicFlag = false;
            }
          "
          @close="
            () => {
              element.topicFlag = false;
            }
          "
        />
        <div class="topic-item" v-else>
          <div>
            <span class="flex-start">
              <el-checkbox label="" v-model="element.isChecked"></el-checkbox>
              <span class="topic-title">{{ index + 1 }}、{{ element.title }}</span>
              <span class="topic-kwa-item">{{ TOPICTYPE[element.typeId] }}</span>
            </span>
            <div class="topic-contents">
              <span v-show="element.content !== '<p><br></p>'" v-html="element.content"></span>
              <div v-if="['单选题', '多选题', '判断题'].includes(TOPICTYPE[element.typeId])" class="topic-answer-item" v-for="(answer, answerIdx) in element.items" :key="answerIdx">
                {{ String.fromCharCode("A".charCodeAt() + answerIdx) }}: {{ answer.itemContent }}
                <img v-if="answer.itemPicture" :src="answer.itemPicture" />
              </div>
            </div>
          </div>
          <div class="topic-item-icon cursor-pointer">
            <span class="topic-item-icon-item" :style="index === 0 ? 'background: #c8c9cb;' : ''">
              <el-icon
                title="上移"
                @click="
                  () => {
                    if (index !== 0) {
                      swapArrayElements(courseList, index, index - 1);
                    }
                  }
                "
              >
                <Top />
              </el-icon>
            </span>
            <span class="topic-item-icon-item" :style="index === courseList.length - 1 ? 'background: #c8c9cb;' : ''">
              <el-icon
                title="下移"
                @click="
                  () => {
                    if (index !== courseList.length - 1) {
                      swapArrayElements(courseList, index, index + 1);
                    }
                  }
                "
              >
                <Bottom />
              </el-icon>
            </span>
            <span class="topic-item-icon-item">
              <el-icon
                title="编辑"
                @click="
                  () => {
                    element.topicFlag = true;
                  }
                "
              >
                <Edit />
              </el-icon>
            </span>
            <span class="topic-item-icon-item">
              <el-icon title="复制" @click="copy(element, index)">
                <DocumentCopy />
              </el-icon>
            </span>
            <span class="topic-item-icon-item topic-item-icon-item-delete">
              <el-icon title="删除" @click="del(element)">
                <Delete />
              </el-icon>
            </span>
          </div>
        </div>
      </template>
    </vuedraggable>

    <div v-if="!courseList || !courseList.length">暂无数据</div>

    <!-- 选择题类型弹窗 -->
    <optionTopic ref="optionTopicRef" @childData="handleChildData" />
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import { defineComponent, ref, onMounted, nextTick } from "vue";
import { Edit, DocumentCopy, Delete, Top, Bottom, Upload, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Header from "@/views/page/components/header/index.vue";
import Topic from "../components/topic/index.vue";
import optionTopic from "../components/optionTopic/index.vue";
import { useRouter } from "vue-router";
import { queFormDetail, deleteTopic, queFormUpdate, quePublish } from "@/api/ques.js";
import { TOPICTYPE } from "@/utils/consts";
import { swapArrayElements } from "@/utils/index.js";
import { queFormTypeList } from '@/api/ques.js' 

export default defineComponent({
  components: {
    Topic,
    Header,
    optionTopic,
    Edit,
    DocumentCopy,
    Delete,
    vuedraggable,
    Top,
    Bottom,
  },
  setup() {
    const routes = useRouter();
    const route = routes.currentRoute.value;

    onMounted(() => {
      getCourseLibList();
      getCourseLibTypeList();
    });
    const item = ref({});
    const topicFlag = ref(false);
    const optionTopicRef = ref(null);
    const courseList = ref([]);
    const name = ref("");
    const status = ref(0);
    const total = ref(0);
    const topic = ref(null);
    const id = ref(route.query?.id ?? "");

    const pathData = [
      {
        name: "问卷列表",
        path: "/homes/courseteacherhome/exam/questionnaire",
      },
      {
        name: id ? "编辑问卷" : "新建问卷",
        path: "",
      },
    ];

    const handleInput = (val) => {
      name.value = val;
    };

    const save = () => {
      ElMessageBox.confirm("确定保存吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const newTopics = [...courseList.value];
          newTopics.forEach((topics) => {
            if (topics.hasOwnProperty("isChecked")) {
              delete topics.isChecked;
            }
          });
          console.log("newTopics", newTopics);
          queFormUpdate({
            id: id.value,
            topics: newTopics,
            name: name.value,
          }).then((res) => {
            if (res.code === "200") {
              ElMessage.success("保存成功");
            }
          });
        })
        .catch(() => {});
    };

    const publish = () => {
      ElMessageBox.confirm("确定发布此问卷?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          quePublish(id.value).then((res) => {
            if (res.code === "200") {
              ElMessage({
                type: "success",
                message: "发布成功",
              });
              routes.push("/homes/courseteacherhome/exam/questionnaire");
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleSelectAll = (val) => {
      courseList.value?.forEach((course) => {
        course.isChecked = val;
      });
    };

    const edit = (answer) => {
      console.log("编辑", answer);
      item.value = answer;
      // topic.value.init({ ...answer })
      topicFlag.value = true;
    };
    const del = (answer, allIds) => {
      ElMessageBox.confirm(`${allIds && allIds.length ? "确定删选中的题目?" : "确定删除此题目?"}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("deleteTopic", answer);
          deleteTopic(allIds ?? [answer.id]).then((res) => {
            if (res.code === "200") {
              ElMessage({
                type: "success",
                message: "删除成功",
              });
              getCourseLibList();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const copy = (answer, index) => {
      ElMessageBox.confirm("确定复制此题目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 复制一份避免影响原数据
          const _answer = { ...answer };
          if (_answer.id) delete _answer.id;
          if (_answer.qfId) delete _answer.qfId;
          if (_answer.hasOwnProperty("isChecked")) delete _answer.isChecked;
          if (_answer.items && _answer.items.length) {
            // 数组数据也需要复制，避免污染原数据
            _answer.items = answer.items.map((m) => {
              return { ...m };
            });
            _answer.items.forEach((a) => {
              if (a.id) delete a.id;
            });
          }
          courseList.value.unshift(_answer);
          const newTopics = [...courseList.value];
          newTopics.forEach((topics) => {
            if (topics.hasOwnProperty("isChecked")) {
              delete topics.isChecked;
            }
          });
          queFormUpdate({
            id: id.value,
            topics: newTopics,
            name: name.value,
          }).then((res) => {
            if (res.code === "200") {
              ElMessage.success("复制成功");
              getCourseLibList();
            }
          });
        })
        .catch(() => {});
    };
    const add = () => {
      // topicFlag.value = false
      item.value = {};
      if (optionTopicRef.value) {
        optionTopicRef.value.init();
      }
    };

    const batchDel = () => {
      const ids = courseList.value.filter((course) => course.isChecked)?.map((course) => course.id);
      if (ids && ids.length) {
        del(null, ids);
      } else {
        ElMessage.error("请选择要删除的题目");
      }
    };

    const handleChildData = (id) => {
      item.value = {
        typeId: id,
      };
      topicFlag.value = true;
      console.log("topicFlag", topicFlag);
    };

    const getCourseLibList = () => {
      if (id.value) {
        queFormDetail(id.value).then((res) => {
          if (res.code === "200") {
            name.value = res.data?.name ? res.data.name : "问卷1";
            status.value = res.data?.status;
            courseList.value = res?.data?.topics ?? [];
            id.value = res.data?.id;
            nextTick(() => {
              courseList.value?.forEach((item) => {
                item.isChecked = false;
              });
            });
          }
        });
      } else {
        name.value = "问卷1";
      }
    };

    // 获取新增类型
    const libTypeList = ref([])
    const getCourseLibTypeList = () => {
      queFormTypeList().then(res => {
        if (res.code === '200') {
          libTypeList.value = res?.data.filter((item) => item.status)
        }
      })
    }

    const handleLibTypeConfirm = (libType) => {
      console.log(libType,'libTypelibTypelibTypelibType')
      item.value = {
        questionTypeId: libType.queTypeId,
        typeId: libType.id,
      };
      console.log(item.value,'item.valueitem.valueitem.valueitem.value')
      topicFlag.value = true;
    }

    return {
      name,
      item,
      total,
      topicFlag,
      courseList,
      optionTopicRef,
      handleSelectAll,
      add,
      del,
      edit,
      copy,
      batchDel,
      handleChildData,
      getCourseLibList,
      TOPICTYPE,
      topic,
      id,
      save,
      publish,
      handleInput,
      status,
      swapArrayElements,
      Upload,
      Plus,
      Delete,
      pathData,
      libTypeList,
      handleLibTypeConfirm
    };
  },
});
</script>

<style lang="scss" scoped>
.ques-lib {
  padding: 0 20px 20px 20px;
  background: #fff;
  font-size: 13px;
  color: #000000;
}

.ques-publish {
  margin-top: 10px;
}

.ques-lib-btn {
  padding: 10px 0;
}

.topic-item {
  text-align: left;
  margin: 10px 0;
  /* box-shadow: 0px 1px 13px #a9a9a9; */
  // border-radius: 5px;
  position: relative;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;

  .topic-title {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #1B1B1B;
  }

  .topic-item-icon {
    position: absolute;
    right: 0;
    bottom: 10px;
    /* width: 100px; */
    font-size: 18px;
    color: #103ccc;
  }

  .topic-answer-item {
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;

    span {
      font-size: 12px;
      margin-left: 8px;
      color: #409eff;
    }
  }
}
.topic-contents {
  margin-left: 22px;
  span {
    display: block;
    margin-left: 20px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #1B1B1B;
    margin-bottom: 10px;
  }
}
.topic-answer-item{
  font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #949494;
    // line-height: 30px;
    margin-left: 20px;
    img{
      margin-left: 10px;
    }

    span {
      font-size: 12px;
      margin-left: 8px;
      color: #019a48;
      background: rgba(50, 177, 108, 0.15);
      border-radius: 5px;
      padding: 3px 10px;
    }
}
.topic-item-icon-item {
  font-size: 16px;
  color: #fff;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background: #27a5ff;
  border-radius: 5px;
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
}
.topic-item-icon-item-delete {
  background: #ff4c48;
}
.topic-kwa-item {
  background: #dff2ff;
  border-radius: 5px;
  padding: 3px 10px;
  margin-right: 10px;
  color: #0078cd;
  font-size: 14px;
  margin-left: 10px;
}
</style>
