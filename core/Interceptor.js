import RequestInterceptor from "./requestInterceptor";
import ResponseInterceptor from "./responseInterceptor";
export default class Interceptor {
  constructor() {
    this.request = new RequestInterceptor();
    this.response = new ResponseInterceptor();
  }
}