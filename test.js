import http from "k6/http"
import {sleep} from "k6"
import { SharedArray } from 'k6/data';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

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
export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `summary_${timestamp}.html`;
    return {
      [filename]: htmlReport(data),
      stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
  }