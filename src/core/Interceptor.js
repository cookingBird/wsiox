import RequestInterceptor from "./RequestInterceptor";
import ResponseInterceptor from "./ResponseInterceptor";
export default class Interceptor {
  constructor() {
    this.request = new RequestInterceptor();
    this.response = new ResponseInterceptor();
  }
}
