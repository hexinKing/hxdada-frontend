<template>
  <div id="appStatisticPage">
    <h2>热门应用统计</h2>
    <div style="position: relative">
      <v-chart
        :option="appAnswerCountOptions"
        style="height: 300px"
        @click="handleChartClick"
      />
      <div
        v-if="showCustomTooltip"
        class="custom-tooltip"
        :style="{
          left: tooltipPosition.x + 'px',
          top: tooltipPosition.y + 'px',
        }"
      >
        <h4>应用ID: {{ currentTooltipData?.appId }}</h4>
        <p>答案数: {{ currentTooltipData?.answerCount }}</p>
        <div
          class="copy-btn"
          @click.stop="copyAppId(currentTooltipData?.appId || '')"
        >
          点击复制AppID
        </div>
      </div>
    </div>
    <h2>应用结果统计</h2>
    <div class="search-bar">
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="输入 appId"
        button-text="搜索"
        size="large"
        search-button
        @search="(value) => loadAppAnswerResultCountData(value)"
      />
    </div>
    <div style="margin-bottom: 16px" />
    <v-chart :option="appAnswerResultCountOptions" style="height: 300px" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, onMounted, onUnmounted } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import {
  getAppAnswerCountUsingGet,
  getAppAnswerResultCountUsingGet,
} from "@/api/appStatisticController";
import VChart from "vue-echarts";
import "echarts";

const appAnswerCountList = ref<API.AppAnswerCountDTO[]>([]);
const appAnswerResultCountList = ref<API.AppAnswerResultCountDTO[]>([]);
const currentTooltipData = ref<{ appId: string; answerCount: number } | null>(
  null
);
const tooltipPosition = ref({ x: 0, y: 0 });

// 复制AppID函数
const copyAppId = (appId: string) => {
  if (!appId) return;
  navigator.clipboard
    .writeText(appId)
    .then(() => {
      message.success(`已复制AppID: ${appId}`);
      currentTooltipData.value = null;
    })
    .catch((err) => {
      console.error("复制失败:", err);
      message.error("复制失败");
    });
};

// 图表点击处理
const handleChartClick = (params: any) => {
  if (params.componentType === "series" && params.seriesType === "bar") {
    const appId = params.name;
    const answerCount = params.value;
    currentTooltipData.value = { appId, answerCount };
    tooltipPosition.value = {
      x: params.event.offsetX + 10,
      y: params.event.offsetY - 50,
    };
  }
};

// 点击空白处关闭tooltip
const handleClickOutside = (event: MouseEvent) => {
  const chartContainer = document.querySelector("#appStatisticPage");
  if (chartContainer && !chartContainer.contains(event.target as Node)) {
    currentTooltipData.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

/**
 * 加载数据
 */
const loadAppAnswerCountData = async () => {
  const res = await getAppAnswerCountUsingGet();
  if (res.data.code === 0) {
    appAnswerCountList.value = res.data.data || [];
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

// 统计选项
const appAnswerCountOptions = computed(() => {
  return {
    xAxis: {
      type: "category",
      data: appAnswerCountList.value.map((item) => item.appId),
      name: "应用 id",
      axisLabel: {
        interval: 0,
        formatter: function (value: string) {
          if (value.length > 10) {
            return value.match(/.{1,10}/g)?.join("\n") || value;
          }
          return value;
        },
        rich: {
          copy: {
            color: "#1890ff",
            fontSize: 12,
            padding: [0, 0, 0, 5],
            cursor: "pointer",
          },
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
      name: "用户答案数",
    },
    series: [
      {
        data: appAnswerCountList.value.map((item) => item.answerCount),
        type: "bar",
        itemStyle: {
          color: function (params: any) {
            const colorList = [
              "#5470c6",
              "#91cc75",
              "#fac858",
              "#ee6666",
              "#73c0de",
              "#3ba272",
              "#fc8452",
              "#9a60b4",
              "#ea7ccc",
            ];
            return colorList[params.dataIndex % colorList.length];
          },
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      show: false,
      formatter: () => "",
    },
  };
});

// 是否显示自定义tooltip
const showCustomTooltip = computed(() => {
  return currentTooltipData.value !== null;
});

/**
 * 加载数据
 */
const loadAppAnswerResultCountData = async (appId: string) => {
  if (!appId) {
    return;
  }
  const res = await getAppAnswerResultCountUsingGet({
    appId: appId as any,
  });
  if (res.data.code === 0) {
    appAnswerResultCountList.value = res.data.data || [];
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

// 统计选项
const appAnswerResultCountOptions = computed(() => {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      formatter: function (name: string) {
        const item = appAnswerResultCountList.value.find(
          (item) => item.resultName === name
        );
        return `${name} (${item?.resultCount || 0})`;
      },
    },
    series: [
      {
        name: "应用答案结果分布",
        type: "pie",
        radius: ["40%", "70%"],
        data: appAnswerResultCountList.value.map((item) => {
          return { value: item.resultCount, name: item.resultName };
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          formatter: "{b}: {c} ({d}%)",
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: "#fff",
          borderWidth: 2,
        },
      },
    ],
  };
});

/**
 * 参数改变时触发数据的重新加载
 */
watchEffect(() => {
  loadAppAnswerCountData();
});

/**
 * 参数改变时触发数据的重新加载
 */
watchEffect(() => {
  loadAppAnswerResultCountData("");
});
</script>

<style scoped>
#appStatisticPage {
  padding: 20px;
}

h2 {
  margin: 20px 0 15px 0;
  color: #1f2d3d;
  font-weight: 600;
  font-size: 18px;
}

.search-bar {
  margin: 20px 0;
}

.custom-tooltip {
  position: absolute;
  z-index: 1000;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

.custom-tooltip h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.custom-tooltip p {
  margin: 0 0 8px 0;
  font-size: 12px;
}

.copy-btn {
  color: #1890ff;
  font-size: 12px;
  cursor: pointer;
}

.copy-btn:hover {
  text-decoration: underline;
}
</style>
