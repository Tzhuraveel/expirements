import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 50 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 200 },
    { duration: '10s', target: 500 },
  ],
};


export default function () {
  const res = http.get('http://localhost:3000/test');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
