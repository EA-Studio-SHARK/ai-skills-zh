# 中文 commit 示例

```text
feat(payment): 支持微信支付回调验签

- 新增平台证书序列号校验
- 回调处理改为事务内幂等更新订单状态
- 补充支付通知日志，便于排查重复通知
```

```text
fix(miniprogram): 修复商品列表重复触底加载

onReachBottom 连续触发时会重复请求同一页数据。
本次新增 loading 和 finished 状态，避免重复追加商品。
```

```text
docs(prompt): 补充中文提示词验收标准示例
```
