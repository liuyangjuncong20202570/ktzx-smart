<template>
  <div
    class="container"
    id="container"
    style="height: 100vh; width: 100vw; background-color: ghostwhite;"
  ></div>
</template>

<script lang="ts" setup>
import G6 from "@antv/g6";
import { onMounted } from "vue";

onMounted(() => {
  let data = {
    nodes: [
      { id: "node1", x: 140, y: 168, comboId: "combo1" },
      { id: "node2", x: 250, y: 100, comboId: "combo2" },
      { id: "node3", x: 300, y: 200 },
    ],
    edges: [
      {
        source: "node1",
        target: "node2",
      },
    ],
    combos: [
      { id: "combo1", label: "Combo1" },
      { id: "combo2", label: "Combo2" },
    ],
  };

  let graphDiv: any;

  let graph: any;

  let width: any;

  let height: any;

  let addedCount = 0;

  G6.registerBehavior("dblclick-add-node", {
    getEvents() {
      return {
        "canvas:dblclick": "onDblClick",
      };
    },
    onDblClick(ev) {
      // alert(1);
      const graph = this.graph;
      graph.addItem("node", {
        x: ev.canvasX,
        y: ev.canvasY,
        id: `node-${addedCount}`, // Generate the unique id
      });
      addedCount++;
      graph.layout();
    },
  });


  graphDiv = document.getElementById("container");
  width = graphDiv.scrollWidth;
  height = graphDiv.scrollHeight - 6;
  graph = new G6.Graph({
    container: "container",
    width,
    height,
    linkCenter: true,
    modes: {
      default: [
        "click-select",
        "drag-node",
        "create-edge",
        "drag-combo",
        "collapse-expand-combo",
        "dblclick-add-node",
      ],
    },
    defaultEdge: {
      type: "line",
      style: {
        stroke: "#F6BD16",
        lineWidth: 2,
      },
    },
    edgeStateStyles: { // 高亮状态下的边的样式
      active: {
        stroke: "dodgerblue", 
        lineWidth: 3,
      },
    },
    // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
    // groupByTypes: false,
    defaultCombo: {   // 默认分组框的样式
      type: "rect",
      size: [40, 10], // The minimum size of the Combo
      padding: [30, 20, 10, 20],
      style: {
        lineWidth: 1,
      },
      labelCfg: {
        refY: 10,
        refX: 20,
        position: "top",
      },
    },
    comboStateStyles: {   // 分组框选中时的样式
      dragenter: {
        lineWidth: 4,
        stroke: "#FE9797",
      },
    },
  });

  window.graph = graph; // Attach graph to window for global access
  graph.data(data);
  graph.render();

  /*************节点的事件***********/
  graph.on("node:mouseenter", (e) => {
    graph.setItemState(e.item, "active", true);
  });

  graph.on("node:mouseleave", (e) => {
    graph.setItemState(e.item, "active", false);
  });
  /*********************************/

  // 创建边后执行
  graph.on("aftercreateedge", (e) => {
    data.edges.push(e.edge._cfg.model);
    const edges = graph.save().edges;

    G6.Util.processParallelEdges(edges);
    graph.getEdges().forEach((edge, i) => {
      graph.updateItem(edge, {
        curveOffset: edges[i].curveOffset,
        curvePosition: edges[i].curvePosition,
      });
    });
    // console.log(data.value.edges);
  });

  /***************分组框的事件*************/
  graph.on("combo:dragend", (e) => {
    graph.getCombos().forEach((combo) => {
      graph.setItemState(combo, "dragenter", false);
    });
  });

  graph.on("combo:dragenter", (e) => {
    graph.setItemState(e.item, "dragenter", true);
  });
  graph.on("combo:dragleave", (e) => {
    graph.setItemState(e.item, "dragenter", false);
  });

  graph.on("combo:mouseenter", (evt) => {
    const { item } = evt;
    graph.setItemState(item, "active", true);
  });

  graph.on("combo:mouseleave", (evt) => {
    const { item } = evt;
    graph.setItemState(item, "active", false);
  });
  /******************************************/
  
  /*******************边的事件*****************/
  graph.on("edge:mouseenter", (e) => {
    graph.setItemState(e.item, "active", true);
  });

  graph.on("edge:mouseleave", (e) => {
    graph.setItemState(e.item, "active", false);
  });

  graph.on("edge:click", (evt) => {
    // 获取被点击的边
    const edge = evt.item;
    // graph.setItemState(edge, 'active', true);
    graph.removeItem(edge);
  });
  /********************************************/
});
</script>

<style scoped></style>