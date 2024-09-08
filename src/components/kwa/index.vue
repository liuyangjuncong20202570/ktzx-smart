<template>
  <div class="bgd-kwa">
    <el-form
      label-position="left"
      :model="form"
      label-width="60px"
      v-if="['courseLibSearch', 'classroomLibSearch'].includes(type)"
    >
      <el-form-item label="关键字 ">
        <el-checkbox-group @change="handleChange" v-model="form.keyIds">
          <el-checkbox
            v-for="(value, key, i) in kwaMap?.keyMap"
            :label="key"
            :key="i"
            >{{ value }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="能力">
        <el-checkbox-group v-model="form.abilityIds" @change="handleChange">
          <el-checkbox
            v-for="(value, key, i) in kwaMap?.abilityMap"
            :label="key"
            :key="i"
            >{{ value }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="题型">
        <el-checkbox label="0" style="margin-right: 30px" @change="queTypeIdAll">全部</el-checkbox>
        <el-checkbox-group v-model="form.queTypeIds" @change="handleChange">
          <el-checkbox
            v-for="(item, i) in courseType"
            :label="item.queTypeId"
            :key="i"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <el-form
      v-if="['courseLibaAdd', 'classroomLibAdd'].includes(type)"
      label-position="left"
      :model="form"
      label-width="60px"
    >
      <el-form-item label="关键字 ">
        <el-checkbox-group :max="1" @change="handleChange" v-model="form.treeIds">
          <el-checkbox
            v-for="(item, i) in kwaTree"
            :key="i"
            :label="item.keyId"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="能力" v-if="abilityList && abilityList.length">
        <el-checkbox-group
          @change="addHandleChange"
          v-model="form.abilityItems"
          :max="1"
        >
          <el-checkbox
            v-for="(item, i) in abilityList"
            :key="i"
            :label="item"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <el-form
      v-if="['taskKwa'].includes(type)"
      label-position="left"
      :model="form"
      label-width="60px"
    >
      <el-form-item label="关键字 ">
        <el-checkbox-group @change="handleChange" v-model="form.keyIds">
          <el-checkbox
            v-for="(value, key, i) in kwaMap?.keyMap"
            :label="key"
            :key="i"
            >{{ value }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="能力">
        <el-checkbox-group :max="1" v-model="form.abilityIds" @change="handleChange">
          <el-checkbox
            v-for="(value, key, i) in kwaMap?.abilityMap"
            :label="key"
            :key="i"
            >{{ value }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import {
  courseLibKwaMap,
  courseLibKwaTree,
  courseLibType,
  taskKwa,
} from "@/api/courseLib";
import { classroomLibKwaTree, classroomLibKwaMap, classroomLibType } from '@/api/classroomLib.js'
const emit = defineEmits(["child-event"]);
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  defaultValue: {
    type: Array,
    defautl: null,
  },
});
console.log("kea-props", props);
const { type, defaultValue } = props;
const form = ref({});
const kwaMap = ref(null);
const kwaTree = ref(null);
const courseType = ref(null);
const abilityList = ref([]);

const init = () => {
  form.value = {};
};

const getCourseLibKwa = () => {
  // 课程列表搜索kwa
  if (type === "courseLibSearch") {
    courseLibKwaMap().then((res) => {
      if (res.code === "200") {
        kwaMap.value = res.data;
      }
    });
  }

  // 课程、课堂列表搜索kwa
  if (type === "classroomLibSearch") {
    classroomLibKwaMap().then((res) => {
      if (res.code === "200") {
        kwaMap.value = res.data;
      }
    });
  }
  // 添加题kwa
  if (['classroomLibAdd', 'courseLibaAdd'].includes(type)) {
    const api = type === 'courseLibaAdd' ? courseLibKwaTree : classroomLibKwaTree
    api().then((res) => {
      if (res.code === "200") {
        kwaTree.value = res.data;
        if (defaultValue && defaultValue.length) {
          // kwaTree.
          const kwaIds = defaultValue?.map((obj) => obj.kwaId);
          let kwaTreeArr = kwaTree.value.map((obj) => {
            const arr = obj.abilityList.filter((f) => kwaIds.includes(f.kwaId));
            if (arr && arr.length) {
              return {
                keyId: obj.keyId,
                kwas: arr,
                abilityList: obj.abilityList,
              };
            }
          });
          // 过滤掉垃圾数据
          kwaTreeArr = kwaTreeArr.filter((item) => item);
          // 能力数据
          abilityList.value =
            kwaTreeArr
              ?.map((obj) => {
                if (obj?.abilityList) return obj.abilityList;
              })
              ?.flat() || [];
          // 关键字回显数据
          form.value.treeIds = kwaTreeArr?.map((kwa) => kwa?.keyId) || [];
          // 能力回显数据
          form.value.abilityItems =
            kwaTreeArr
              ?.map((obj) => {
                if (obj?.kwas) return obj.kwas;
              })
              ?.flat() || [];
          console.log("form.value.abilityItems", form.value.abilityItems);
          addHandleChange(form.value.abilityItems);
        }
      }
    });
  }
  //
  if (type === "taskKwa") {
    taskKwa().then((res) => {
      if (res.code === "200") {
        kwaMap.value = res.data;
      }
    });
  }
};
// 题型
const getCourseLibType = () => {
  if (['classroomLibSearch', 'courseLibSearch'].includes(type)) {
    // classroomLibSearch: 课程题库，courseLibSearch: 课堂题库
    const libTypeApi = type === 'classroomLibSearch' ? classroomLibType : courseLibType
    libTypeApi().then((res) => {
      if (res.code === "200") {
        courseType.value = res.data?.filter((f) => f.status);
      }
    })
  }
}

const queTypeIdAll = (value) => {
  if (value) {
    const queTypeIds = courseType.value.map((course) => course.queTypeId)
    form.value.queTypeIds = [ ...queTypeIds ]
  } else {
    form.value.queTypeIds = []
  }
  emit("kwa-event", form.value);
}

const handleChange = (changeValue) => {
  // 获取添加kwa能力
  if (['classroomLibAdd', 'courseLibaAdd'].includes(type) && form.value.treeIds) {
    abilityList.value = [];
    form.value.abilityItem = [];
    form.value.abilityItems = [];
    emit("kwa-event", []);
    form.value.treeIds?.forEach((item) => {
      let list =
        kwaTree.value.find((kwa) => kwa.keyId === item)?.abilityList || [];
      abilityList.value = [...abilityList.value, ...list];
    });
  }

  if (["taskKwa", "courseLibSearch", 'classroomLibSearch'].includes(type)) {
    emit("kwa-event", form.value);
  }
};
const addHandleChange = (arr) => {
  const newArr = arr?.map((arrItem) => {
    if (arrItem) {
      const { fullName, kwaId } = arrItem;
      return {
        kwaName: fullName,
        kwaId,
      };
    }
  });
  console.log("newArr", newArr);
  emit("kwa-event", newArr);
};

onMounted(() => {
  getCourseLibKwa();
  getCourseLibType();
});
// 导出函数
defineExpose({
  init,
});
</script>

<style>
.bgd-kwa .el-form-item {
  margin-bottom: 1px !important;
}
</style>
