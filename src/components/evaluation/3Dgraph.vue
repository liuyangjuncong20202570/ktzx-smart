<template>
    <div id="container" style="width: 100%; height: 92vh; margin-left: -50%;"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { Graph, Extensions, extend } from '@antv/g6';

let data = {
    nodes: [
        {
            id: '1',
            name: '串口并口\n通讯-实践\n检验能力',
            level: 1,
        },
        {
            id: '2',
            name: 'node2',
            level: 1,
        },
        {
            id: '3',
            name: 'node3',
            level: 1,
        },
        {
            id: '4',
            name: 'node4',
            level: 1,
        },
        {
            id: '5',
            name: 'node5',
            level: 1,
        },
        {
            id: '6',
            name: 'node6',
            level: 1,
        },
        {
            id: '7',
            name: 'node7',
            level: 2,
        },
        {
            id: '8',
            name: 'node8',
            level: 2,
        },
        {
            id: '9',
            name: 'node9',
            level: 2,
        },
        {
            id: '10',
            name: 'node10',
            level: 2,
        },
        {
            id: '11',
            name: 'node11',
            level: 2,
        },
        {
            id: '12',
            name: 'node12',
            level: 3,
        },
        {
            id: '13',
            name: 'node13',
            level: 3,
        },
        {
            id: '14',
            name: 'node14',
            level: 2,
        },
        {
            id: '15',
            name: 'node15',
            level: 2,
        },
        {
            id: '16',
            name: 'node16',
            level: 2,
        },
        {
            id: '17',
            name: 'node17',
            level: 2,
        },
        {
            id: '18',
            name: 'node18',
            level: 2,
        },
        {
            id: '19',
            name: 'node19',
            level: 2,
        },
        {
            id: '20',
            name: 'node20',
            level: 2,
        },
        {
            id: '21',
            name: 'node21',
            level: 2,
        },
        {
            id: '22',
            name: 'node22',
            level: 2,
        },
        {
            id: '23',
            name: 'node23',
            level: 2,
        }, ,
        {
            id: '24',
            name: 'node24',
            level: 2,
        },
        {
            id: '25',
            name: 'node25',
            level: 2,
        },
        {
            id: '26',
            name: 'node26',
            level: 2,
        },
        {
            id: '27',
            name: 'node27',
            level: 2,
        },
        {
            id: '28',
            name: 'node28',
            level: 2,
        },
        {
            id: '29',
            name: 'node29',
            level: 2,
        },
        {
            id: '30',
            name: 'node30',
            level: 2,
        },
        {
            id: '31',
            name: 'node31',
            level: 2,
        },
        {
            id: '32',
            name: 'node32',
            level: 2,
        }, ,
        {
            id: '33',
            name: 'node33',
            level: 2,
        },
        {
            id: '34',
            name: 'node34',
            level: 2,
        },
        {
            id: '35',
            name: 'node35',
            level: 2,
        },
        {
            id: '36',
            name: 'node36',
            level: 2,
        },
        {
            id: '37',
            name: 'node37',
            level: 2,
        },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
        // {
        //     id: '21',
        //     name: 'node21',
        //     level: 2,
        // },
        // {
        //     id: '22',
        //     name: 'node22',
        //     level: 2,
        // },
        // {
        //     id: '23',
        //     name: 'node23',
        //     level: 2,
        // }, ,
        // {
        //     id: '24',
        //     name: 'node24',
        //     level: 2,
        // },
        // {
        //     id: '25',
        //     name: 'node25',
        //     level: 2,
        // },
        // {
        //     id: '26',
        //     name: 'node26',
        //     level: 2,
        // },
        // {
        //     id: '27',
        //     name: 'node27',
        //     level: 2,
        // },
        // {
        //     id: '28',
        //     name: 'node28',
        //     level: 2,
        // },
        // {
        //     id: '29',
        //     name: 'node29',
        //     level: 2,
        // },
        // {
        //     id: '30',
        //     name: 'node30',
        //     level: 2,
        // },
        // {
        //     id: '31',
        //     name: 'node31',
        //     level: 2,
        // },
        // {
        //     id: '32',
        //     name: 'node32',
        //     level: 2,
        // }, ,
        // {
        //     id: '33',
        //     name: 'node33',
        //     level: 2,
        // },
        // {
        //     id: '34',
        //     name: 'node34',
        //     level: 2,
        // },
        // {
        //     id: '35',
        //     name: 'node35',
        //     level: 2,
        // },
        // {
        //     id: '36',
        //     name: 'node36',
        //     level: 2,
        // },
        // {
        //     id: '37',
        //     name: 'node37',
        //     level: 2,
        // },
    ],
}
onMounted(() => {
    // 获取页面中ID为'container'的DOM元素
    const container = document.getElementById('container');

    // 创建一个新的Three.js场景
    const scene = new THREE.Scene();

    // 创建WebGL渲染器
    const renderer = new THREE.WebGLRenderer({
        antialias: true,    // 开启抗锯齿
    });
    // 设置渲染器的大小为container的滚动宽度和滚动高度
    renderer.setSize(container.scrollWidth, container.scrollHeight);
    // 使用设备的分辨率渲染几何体
    renderer.setPixelRatio(window.devicePixelRatio);
    // 将渲染器的DOM元素附加到container中
    container.appendChild(renderer.domElement);

    // 创建一个透视摄像机
    const camera = new THREE.PerspectiveCamera(
        75, // 视野角度
        container.scrollWidth / container.scrollHeight, // 宽高比
        0.1, // 近裁剪面
        1000 // 远裁剪面
    );

    // 设置摄像机的位置
    camera.position.x = 0;
    camera.position.y = 1.5;
    camera.position.z = 4.5;
    camera.lookAt(0, 0, 0);

    let planeSize = 4;
    let gridCount = 4;    // 平面中一行或一列上可以有多少个节点，用于创建网格的大小gridCount * gridCount
    const edgeWidth = 0.5;  // 节点距离方形区域边缘的距离
    let planeDist = 1.2   // 平面之间的距离

    // 计算每个平面上的节点数量，以其中的最大值确定平面的大小
    let levelNodeAmount = [0, 0, 0];
    data.nodes.forEach((node) => {
        levelNodeAmount[node.level - 1] ++;
    })
    // console.log(levelNodeAmount);

    let maxNodeAmount = Math.max(...levelNodeAmount);
    while(planeSize * planeSize <= maxNodeAmount) {
        // 设置俯视的最高视角，显示更美观
        if(camera.position.y > 0.6) camera.position.y += 0.4;
        camera.position.z += 1.2;
        planeSize = gridCount += 1;
        planeDist += 0.3;
    }
    // console.log(maxNodeAmount, camera.position.y);

    // 创建三个平面的几何体
    const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

    const opacity = 0.8;

    // 创建三个不同颜色的材质
    const material1 = new THREE.MeshBasicMaterial({
        color: 'rgb(252, 151, 13)',
        side: THREE.DoubleSide,
        transparent: true,
        opacity
    });
    const material2 = new THREE.MeshBasicMaterial({
        color: 'rgb(74, 49, 153)',
        side: THREE.DoubleSide,
        transparent: true,
        opacity
    });
    const material3 = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 0, 0)',
        side: THREE.DoubleSide,
        transparent: true,
        opacity
    });

    // 存储平面对象
    let planes = [];

    // 创建平面并添加到场景
    for (let i = -1; i < 2; i++) {
        let material;
        switch (i) {
            case -1:
                material = material1;
                break;
            case 0:
                material = material2;
                break;
            case 1:
                material = material3;
                break;
        }
        const plane = new THREE.Mesh(planeGeometry, material);
        plane.rotation.x = Math.PI / 2;
        plane.position.y = i * planeDist; // 设置每个平面沿Z轴的距离
        scene.add(plane);
        planes.push(plane);
    }

    // scene.add(light);
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000520, 4);
    hemisphereLight.castShadow = true;
    scene.add(hemisphereLight);

    // 创建字体加载器
    const fontLoader = new FontLoader();

    // 每个平面上的节点颜色
    const nodeColors = ['rgb(236, 237, 231)', 'rgb(0, 255, 0)', 'rgb(246, 228, 0)'];

    // 加载字体
    fontLoader.load('/src/utils/DengXian_Light_Regular.json', function (font) {
        // 创建网格点
        const gridPoints = createGridPoints(planeSize, gridCount, edgeWidth);
        // 记录每一层的节点数量
        let eachLevelNodesCount = [0, 0, 0];

        // 生成节点并添加到场景中
        data.nodes.forEach((node) => {
            // 创建球形节点的材质
            const sphereMaterial = new THREE.MeshStandardMaterial({ color: nodeColors[node.level - 1] });

            // 创建球形节点的几何体
            const sphereGeometry = new THREE.SphereGeometry(0.1, 64, 64); // 半径为0.1，水平和垂直分段数均为32

            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(gridPoints[eachLevelNodesCount[node.level - 1]].x,
                                gridPoints[eachLevelNodesCount[node.level - 1]].y,
                                gridPoints[eachLevelNodesCount[node.level - 1]++].z);

            // 设置接收阴影
            sphere.receiveShadow = true;
            planes[node.level - 1].add(sphere);
            // 创建文本几何体
            const textGeometry = new TextGeometry(node.name, {
                font,
                size: 0.08,
                depth: 0.005,
            });

            textGeometry.computeBoundingBox();

            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

            // 创建文本材质
            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

            // 创建文本网格对象
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // 文本位置
            textMesh.position.set(-1 * (textWidth / 2), 0, -0.13);
            // textMesh1.rotation.y = Math.PI;
            textMesh.rotation.x = Math.PI * 1.5;

            sphere.add(textMesh);
        });

        // 创建连线
        // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf6e432 });
        // const lineGeometry = new THREE.BufferGeometry();
        // // 使用球形节点的位置创建连线的顶点
        // const pointsVertices = [sphere1.position, sphere2.position];
        // lineGeometry.setFromPoints(pointsVertices);
        // const line = new THREE.Line(lineGeometry, lineMaterial);
        // plane.add(line); // 将连线添加为平面的子对象
    });

    // 添加世界坐标辅助器
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    // 创建一个动画函数，用于不断渲染场景
    function animate() {
        requestAnimationFrame(animate); // 请求动画帧
        planes.forEach((plane) => {
            // plane.rotation.x += 0.01;
            plane.rotation.z -= 0.0005;
        })
        renderer.render(scene, camera); // 渲染场景
    };

    // 调用动画函数
    animate();

    // 监听窗口的resize事件
    window.addEventListener('resize', function () {
        // 调整渲染器的大小
        renderer.setSize(container.offsetWidth, container.offsetHeight - 0.5);

        // 调整摄像机的宽高比
        camera.aspect = container.offsetWidth / container.offsetHeight;

        // 更新摄像机的投影矩阵
        camera.updateProjectionMatrix();
        // console.log('resize')
    });
})

// 生成一个gridCount * gridCount的网格，存储每个网格节点
function createGridPoints(size, gridCount, edgeWidth) {
    // 存储每个网格节点的位置信息
    const points = [];

    /* spacing 是网格中每两个点之间的距离。它是通过 (size - 2 * edgeWidth) / (gridCount - 1) 这个公式计算出来的。
    size - 2 * edgeWidth 是网格的实际大小，因为我们从跳过边缘边距的位置开始创建网格，所以需要从总大小中减去两个边缘边
    距。然后，我们将这个实际大小除以 gridCount - 1，因为在一个网格中，点与点之间的间隔数量是 gridCount - 1。 */
    const spacing = (size - 2 * edgeWidth) / (gridCount - 1);

    /* centerX，centerY两个值表示网格的中心点的坐标。-size / 2 + edgeWidth + (gridCount - 1) / 2 * spacing 这个公式的含义是，
    首先我们找到网格的左边界（即 -size / 2 + edgeWidth），然后加上半个网格的大小（即 (gridCount - 1) / 2 * spacing）。
    这样我们就得到了网格中心的坐标。 */
    const centerX = -size / 2 + edgeWidth + (gridCount - 1) / 2 * spacing;
    const centerY = -size / 2 + edgeWidth + (gridCount - 1) / 2 * spacing;

    // 确定网格布局每个网格节点的位置
    for (let i = 0; i < gridCount; i++) {   // i和j表示了网格中所有网格节点的位置
        for (let j = 0; j < gridCount; j++) {
            // -size / 2 + edgeWidth 是左边界，i * spacing 是当前节点x轴上的距离
            const x = -size / 2 + edgeWidth + i * spacing;
            
            // -size / 2 + edgeWidth 是下边界，j * spacing 是当前节点y轴上的距离
            const y = -size / 2 + edgeWidth + j * spacing;

            // 当前节点距离中心节点的距离
            const dx = x - centerX;
            const dy = y - centerY;

            // 计算当前节点相对于中心节点的角度
            const angle = Math.atan2(dy, dx);
            const distance = Math.sqrt(dx * dx + dy * dy);
            points.push({ point: new THREE.Vector3(x, y, -0.1), angle, distance });
        }
    }

    // 按照距离和角度进行螺旋排序，按照两个节点距离中心的距离升序排序，如果距离相同则按照角度逆时针排序
    points.sort((a, b) => a.distance - b.distance || a.angle - b.angle);

    return points.map(p => p.point);
}

</script>

<style scoped>
#container {
    width: 100%;
    height: 100%;
}
</style>
