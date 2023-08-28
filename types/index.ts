export = Wsiox;
export as namespace Wsiox;

export default Wsiox;

export interface WsioxOptions {
  contentType?: string;
  protocols?: string | string[];
  uniqueKey?: string;
}

export type cancel = () => void;

export type ReceiveOptions<R> = {
  condition?: JudgeCb<R> | RegExp;
  uniqueKey?: string;
};

export type JudgeCb<R> = (data: R) => boolean;
export type RequestOptions = unknown;
export type GenericFunc<P, R> = (data: P) => R;

class Wsiox {
  constructor(url: string | URL, options: WsioxOptions);
  request<R, E>(requestOps: RequestOptions): Promise<R, E>;
  on<R, E>(
    receiveOps?: ReceiveOptions<R> | JudgeCb<R>,
    successCb: GenericFunc<R, void>,
    errorCb: GenericFunc<E, void>
  ): cancel;
  close(): void;
}
