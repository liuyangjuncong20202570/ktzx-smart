<template>
    <div id="container" style="width: 100%; height: 92vh; margin-left: -50%;"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { Graph, Extensions, extend } from '@antv/g6';

let data = {
    nodes: [
        {
            name: 1,
            pos: {
                x: 61.21392822265625,
                y: 350,
                z: -64.4036865234375
            },
            layer: 3,
        },
        {
            name: 2,
            pos: {
                x: -255.1844024658203,
                y: 350,
                z: -216.97540283203125
            },
            layer: 3,
        },
        {
            name: 3,
            pos: {
                x: -91.655029296875,
                y: 350,
                z: -125.21270751953125
            },
            layer: 3,
        },
        {
            name: 4,
            pos: {
                x: -39.05999755859375,
                y: 350,
                z: 88.867919921875
            },
            layer: 3,
        },
        {
            name: 5,
            pos: {
                x: -50.56976318359375,
                y: 350,
                z: -209.14599609375
            },
            layer: 3,
        },
        {
            name: 6,
            pos: {
                x: 282.10833740234375,
                y: 350,
                z: 24.2239990234375
            },
            layer: 3,
        },
        {
            name: 7,
            pos: {
                x: 97.94744873046875,
                y: 350,
                z: -63.923828125
            },
            layer: 3,
        },
        {
            name: 8,
            pos: {
                x: -212.96136474609375,
                y: 350,
                z: 193.93087768554688
            },
            layer: 3,
        },
        {
            name: 9,
            pos: {
                x: 46.8973388671875,
                y: 350,
                z: 271.3457794189453
            },
            layer: 3,
        },
        {
            name: 10,
            pos: {
                x: 280.34747314453125,
                y: 350,
                z: 226.57763671875
            },
            layer: 3,
        },
        {
            name: 11,
            pos: {
                x: -15.212249755859375,
                y: 0,
                z: 120.65432739257812
            },
            layer: 2,
        },
        {
            name: 12,
            pos: {
                x: 183.6497802734375,
                y: 0,
                z: 73.28384399414062
            },
            layer: 2,
        },
        {
            name: 13,
            pos: {
                x: -297.0749969482422,
                y: 0,
                z: 308.8816833496094
            },
            layer: 2,
        },
        {
            name: 14,
            pos: {
                x: -217.73849487304688,
                y: 0,
                z: 117.55078125
            },
            layer: 2,
        },
        {
            name: 19,
            pos: {
                x: 202.20880126953125,
                y: 0,
                z: -40.325439453125
            },
            layer: 2,
        },
        {
            name: 20,
            pos: {
                x: -34.244873046875,
                y: 0,
                z: -127.05670166015625
            },
            layer: 2,
        },
        {
            name: 15,
            pos: {
                x: 59.89288330078125,
                y: 0,
                z: -303.281494140625
            },
            layer: 2,
        },
        {
            name: 16,
            pos: {
                x: -160.287841796875,
                y: 0,
                z: -23.3919677734375
            },
            layer: 2,
        },
        {
            name: 17,
            pos: {
                x: -94.52520751953125,
                y: 0,
                z: 307.85633850097656
            },
            layer: 2,
        },
        {
            name: 18,
            pos: {
                x: 221.6644287109375,
                y: 0,
                z: 164.96102905273438
            },
            layer: 2,
        },
        {
            name: 21,
            pos: {
                x: 49.6173095703125,
                y: -350,
                z: 22.866851806640625
            },
            layer: 1,
        },
        {
            name: 22,
            pos: {
                x: 19.21929931640625,
                y: -350,
                z: -178.12158203125
            },
            layer: 1,
        },
        {
            name: 23,
            pos: {
                x: -100.36669921875,
                y: -350,
                z: 160.96636962890625
            },
            layer: 1,
        },
        {
            name: 26,
            pos: {
                x: 189.1593017578125,
                y: -350,
                z: -298.3272705078125
            },
            layer: 1,
        },
        {
            name: 27,
            pos: {
                x: -68.7808837890625,
                y: -350,
                z: 36.220458984375
            },
            layer: 1,
        },
        {
            name: 28,
            pos: {
                x: 279.00189208984375,
                y: -350,
                z: 93.63009643554688
            },
            layer: 1,
        },
        {
            name: 30,
            pos: {
                x: -269.5784606933594,
                y: -350,
                z: 244.6395263671875
            },
            layer: 1,
        },
        {
            name: 34,
            pos: {
                x: 205.86956787109375,
                y: -350,
                z: -96.7197265625
            },
            layer: 1,
        },
        {
            name: 35,
            pos: {
                x: -267.73089599609375,
                y: -350,
                z: 43.14031982421875
            },
            layer: 1,
        },
    ],
    edges: [
        {
            source: 1,
            target: 12,
            layer: 4
        },
        {
            source: 5,
            target: 18,
            layer: 4
        },
        {
            source: 6,
            target: 13,
            layer: 4
        },
        {
            source: 7,
            target: 14,
            layer: 4
        },
        {
            source: 5,
            target: 19,
            layer: 4
        },
        {
            source: 15,
            target: 22,
            layer: 4
        },
        {
            source: 16,
            target: 23,
            layer: 4
        },
        {
            source: 17,
            target: 27,
            layer: 4
        },
        {
            source: 18,
            target: 21,
            layer: 4
        },
        {
            source: 19,
            target: 26,
            layer: 4
        },
        {
            source: 3,
            target: 1,
            layer: 1
        },
        {
            source: 5,
            target: 2,
            layer: 1
        },
        {
            source: 7,
            target: 3,
            layer: 1
        },
        {
            source: 7,
            target: 5,
            layer: 1
        },
        {
            source: 7,
            target: 4,
            layer: 1
        },
        {
            source: 7,
            target: 6,
            layer: 1
        },
        {
            source: 4,
            target: 8,
            layer: 1
        },
        {
            source: 4,
            target: 9,
            layer: 1
        },
        {
            source: 6,
            target: 10,
            layer: 1
        },
        {
            source: 11,
            target: 12,
            layer: 2
        },
        {
            source: 11,
            target: 17,
            layer: 2
        },
        {
            source: 11,
            target: 16,
            layer: 2
        },
        {
            source: 13,
            target: 17,
            layer: 2
        },
        {
            source: 18,
            target: 19,
            layer: 2
        },
        {
            source: 15,
            target: 20,
            layer: 2
        },
        {
            source: 11,
            target: 14,
            layer: 2
        },
        {
            source: 21,
            target: 22,
            layer: 3
        },
        {
            source: 21,
            target: 23,
            layer: 3
        },
        {
            source: 22,
            target: 34,
            layer: 3
        },
        {
            source: 23,
            target: 35,
            layer: 3
        },
        {
            source: 35,
            target: 30,
            layer: 3
        },
        {
            source: 35,
            target: 27,
            layer: 3
        },
        {
            source: 34,
            target: 26,
            layer: 3
        },
        {
            source: 34,
            target: 28,
            layer: 3
        }
    ]
}
onMounted(() => {
    const ExtGraph = extend(Graph, {
        nodes: {
            'sphere-node': Extensions.SphereNode,
            'plane-node': Extensions.PlaneNode,
        },
        behaviors: {
            'orbit-canvas-3d': Extensions.OrbitCanvas3D,
            'zoom-canvas-3d': Extensions.ZoomCanvas3D,
        },
    });

    const colors = ['rgba(252, 151, 13, 0.6)', 'rgba(74, 49, 153, 0.6)', 'rgba(255, 0, 0, 0.6)'];
    const nodecolors = ['rgb(236, 237, 231)', 'rgb(0, 255, 0)', 'rgb(246, 228, 0)']
    const sphereR = 15;

    const planeGroup = Array.from({ length: 3 }).map((_, i) => ({
        id: `plane-${i}`,
        data: {
            type: 'plane-node',
            x: 0,
            y: -350 + 350 * i + sphereR,
            z: 0,
            layer: i + 1,
        },
    }));

    const container = document.getElementById('container');
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;

    const nodes = data.nodes.map(({ name, pos, layer, label }) => ({
        id: name,
        data: {
            type: 'sphere-node',
            ...pos,
            layer,
            label,
        },
    })).concat(planeGroup);

    const edges = data.edges.map((edge, index) => ({ id: `edge-${index}`, ...edge }));

    // console.log(nodes);
    // console.log(edges);
    const graph = new ExtGraph({
        container,
        width,
        height,
        renderer: 'webgl-3d',
        modes: {
            default: [
                {
                    type: 'orbit-canvas-3d',
                    trigger: 'drag',
                },
                'zoom-canvas-3d'
            ],
        },
        theme: {
            type: 'spec',
            base: 'dark',
        },
        data: { nodes, edges },
        node: {
            keyShape: {
                fill: {
                    fields: ['layer'],
                    formatter: (model) => {
                        // colors[model.data.layer - 1];
                        if (model.data.type === 'plane-node') {
                            return colors[model.data.layer - 1]; // 'sphere-node' 类型的节点使用 nodecolors 数组中的第一种颜色
                        } else if (model.data.type === 'sphere-node') {
                            return nodecolors[model.data.layer - 1]; // 'plane-node' 类型的节点使用 nodecolors 数组中的第二种颜色
                        }
                    }
                },
                r: sphereR,
                width: {
                    fields: ['type'],
                    formatter: (model) => (model.data.type === 'plane-node' ? 13000 : 0),
                },
                depth: {
                    fields: ['type'],
                    formatter: (model) => (model.data.type === 'plane-node' ? 13000 : 0),
                },
                materialProps: {
                    fields: ['type'],
                    formatter: (model) =>
                        model.data.type === 'plane-node'
                            ? {
                                wireframe: true,
                                cullMode: 0,
                                wireframeColor: '#797979',
                            }
                            : undefined,
                },
            },
        },
        edge: {
            keyShape: {
                lineWidth: 2,
                stroke: '#f6e432', // 边主图形描边颜色
            },
        },
    });

    graph.on('afterrender', () => {
        const canvas = graph.canvas;
        const camera = canvas.getCamera();
        camera.createLandmark('reset', {
            position: [0, -400, 2000],
            focalPoint: [0, 0, 0],
            zoom: 1,
        });
        camera.gotoLandmark('reset', {
            duration: 1000,
            easing: 'ease-in',
            onfinish: () => {
                canvas.addEventListener('afterrender', () => {
                    graph.canvas.getRoot().rotate(0, 0.05, 0);
                });
            },
        });
    });

    window.graph = graph;
})
</script>