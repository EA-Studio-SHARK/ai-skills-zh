# china-payment

用于微信支付、支付宝等国内支付场景的服务端接入、代码生成、评审和安全检查。覆盖统一下单、JSAPI、小程序支付、App 支付、H5 支付、回调验签、退款、关闭订单、对账、证书和日志规范。

## 核心规则

- 支付签名必须在服务端生成；因为商户私钥、APIv3 Key、应用私钥不能暴露给前端。
- 客户端只能拿预支付参数；因为客户端环境不可信，不能决定订单金额和状态。
- 订单金额以服务端数据库为准；因为前端传金额可被篡改。
- 回调必须验签后再处理；因为伪造通知会直接造成资损。
- 回调处理必须幂等；因为微信和支付宝都会重复通知。
- 更新订单状态要使用事务和行锁；因为支付回调、主动查询、退款可能并发到达。
- 支付成功以支付平台回调或主动查询为准；因为客户端成功回调不能代表最终入账。
- `out_trade_no` 必须全局唯一且可追踪业务；因为支付平台按商户订单号定位交易。
- 回调接口必须返回平台要求的成功格式；因为返回错误会触发重复通知。
- 退款必须关联原支付单和业务退款单；因为一笔订单可能有多次部分退款。
- 退款金额不能超过可退金额；因为并发退款可能造成超退。
- 关闭订单前要查询平台状态；因为本地未支付不代表平台未支付。
- 对账任务必须按日拉取并核对差异；因为回调丢失或本地异常需要兜底。
- 日志必须记录请求 id、订单号、平台交易号；因为支付问题排查依赖链路追踪。
- 日志必须脱敏密钥、证书、手机号、身份证；因为支付日志常被多人查看。
- 证书和密钥要支持轮换；因为微信平台证书会更新，私钥也可能泄露。
- 微信支付 V3 要处理平台证书序列号；因为验签依赖证书匹配。
- 支付宝要区分应用私钥和支付宝公钥；因为用错密钥会导致验签失败。
- 异步通知接口不要依赖用户登录态；因为平台服务器不会带用户 cookie。
- 回调中不要执行慢任务；因为超时会触发重复通知，应投递队列异步处理。
- 状态机只能向前流转；因为已支付订单不能被晚到的关闭通知覆盖。
- 支付接口要限制频率和重复下单；因为用户连点会生成多笔待支付单。
- 生产和沙箱配置必须隔离；因为错用环境会导致验签、金额和证书混乱。
- 金融相关页面不要承诺“秒到账”除非业务确实保证；因为到账时间受平台和银行影响。

## 反例

```ts
// 错误：使用客户端传入金额下单。
app.post('/pay', async (req, res) => {
  const { orderId, amount } = req.body;
  const payParams = await createWechatPayOrder({ orderId, amount });
  res.json(payParams);
});
```

```ts
// 错误：回调不验签，直接改订单状态。
app.post('/wechat/notify', async (req, res) => {
  await db.orders.updateByTradeNo(req.body.out_trade_no, { status: 'PAID' });
  res.send('success');
});
```

## 正例

```ts
app.post('/pay/wechat/jsapi', requireLogin, async (req, res) => {
  const { orderId } = req.body;
  const order = await db.orders.findById(orderId);
  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({ message: '订单不存在' });
  }
  if (order.status !== 'CREATED') {
    return res.status(409).json({ message: '订单状态不可支付' });
  }

  const payParams = await wechatPay.createJsapiOrder({
    outTradeNo: order.tradeNo,
    description: order.title,
    amountFen: order.amountFen,
    openid: req.user.wechatOpenid,
    notifyUrl: `${config.publicBaseUrl}/pay/wechat/notify`
  });

  res.json(payParams);
});
```

```ts
app.post('/pay/wechat/notify', rawBody(), async (req, res) => {
  const event = await wechatPay.verifyAndDecrypt(req.headers, req.rawBody);

  await db.transaction(async (tx) => {
    const order = await tx.orders.findByTradeNoForUpdate(event.out_trade_no);
    if (!order || order.status === 'PAID') return;
    if (event.trade_state === 'SUCCESS' && order.amountFen === event.amount.total) {
      await tx.orders.markPaid(order.id, event.transaction_id);
    }
  });

  res.json({ code: 'SUCCESS', message: '成功' });
});
```

## 配置建议

- 环境变量：`WECHAT_MCH_ID`、`WECHAT_APP_ID`、`WECHAT_API_V3_KEY`、`WECHAT_PRIVATE_KEY_PATH`、`ALIPAY_APP_ID`、`ALIPAY_PRIVATE_KEY`、`ALIPAY_PUBLIC_KEY`。
- 数据表至少包含：业务订单表、支付单表、退款单表、支付通知日志表、对账差异表。
- 回调路由使用原始 body 中间件，避免 JSON 解析破坏验签数据。
- 支付金额统一使用“分”或最小货币单位整数，避免浮点误差。
