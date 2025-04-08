<template>
  <div class="custom-pagination">
    <div class="item left">
      <el-button class="btn btn-prev" @click="prevPage" :icon="Plus" type="primary" :disabled="currentPage === 1">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span v-for="page in totalPages" :key="page" @click="changePage(page)" :disabled="currentPage === page" :class="currentPage === page ? 'active page-text' : 'page-text'">
        {{ page }}
      </span>
      <el-button class="btn btn-next" @click="nextPage" :icon="Plus" type="primary" :disabled="currentPage === totalPages">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>
    <div class="item right">
      <span>第 <el-input style="width: 33px" v-model="goToPage" :min="1" :max="totalPages"></el-input> 页 </span>
      <el-button class="btn btn-go" type="primary" @click="goTo">GO</el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { Plus, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

export default {
  name: "Pagination",
  props: {
    pageIndex: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const currentPage = ref(props.pageIndex);
    const goToPage = ref(1);

    const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

    watch(
      () => props.pageIndex,
      (newValue) => {
        currentPage.value = newValue;
        goToPage.value = newValue; // 更新跳转页
      }
    );

    const changePage = (page) => {
      currentPage.value = page;
      goToPage.value = page; // 更新跳转页
      emit("update:pageIndex", page);
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        changePage(currentPage.value + 1);
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        changePage(currentPage.value - 1);
      }
    };

    const goTo = () => {
      if (goToPage.value >= 1 && goToPage.value <= totalPages.value) {
        changePage(goToPage.value);
      }
    };

    return {
      currentPage,
      goToPage,
      changePage,
      nextPage,
      prevPage,
      goTo,
      totalPages,
    };
  },
};
</script>

<style scoped lang="scss">
.custom-pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 40px auto;
  .item {
    height: 40px;
    background: #f0faff;
    border-radius: 5px;
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    .btn {
      width: 26px !important;
      height: 26px !important;
      background: #27a5ff;
      border-radius: 5px;
      padding: 0;
    }
    .btn-go {
      margin-left: 20px;
    }
    .page-text {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #0078cd;
      line-height: 21px;
      cursor: pointer;
      margin: 0 8px;
    }
    .active {
      color: #707070; /* 选中页码的颜色 */
    }
  }
  .right {
    color: #0078cd;
  }
}
</style>
<style>
.custom-pagination .el-input__inner {
  color: #0078cd;
}
</style>
