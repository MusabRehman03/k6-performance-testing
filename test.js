import http from "k6/http"
import {sleep} from "k6"
import { SharedArray } from 'k6/data';

const queries = new SharedArray('queries', function () {
    return JSON.parse(open('./queries.json'));
  });

export const options = {
    stages: [
        {duration: '5s', target: 1},
        {duration: '20s', target: 20},
        {duration: '10s', target: 50},
        {duration: '20s', target: 20},
        {duration: '5s', target: 0},       
    ],
    thresholds: {
        http_req_duration: ['p(95)<600']
    }
}
export default function(){
    let query = queries[Math.floor(Math.random() * queries.length)];
    http.get(query.url)
    console.log(query.url)
    sleep(1)
}