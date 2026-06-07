# 支付流程示例

```ts
type OrderStatus = 'CREATED' | 'PAYING' | 'PAID' | 'CLOSED' | 'REFUNDING' | 'REFUNDED';

async function handleWechatPayNotify(headers: Record<string, string>, body: string) {
  const event = await verifyWechatPayNotify(headers, body);
  const tradeNo = event.resource.ciphertext.out_trade_no;

  await db.transaction(async (tx) => {
    const order = await tx.orders.findByTradeNoForUpdate(tradeNo);
    if (!order) throw new Error('ORDER_NOT_FOUND');
    if (order.status === 'PAID') return;

    if (event.resource.ciphertext.trade_state === 'SUCCESS') {
      await tx.orders.update(order.id, {
        status: 'PAID',
        paidAt: new Date(),
        transactionId: event.resource.ciphertext.transaction_id
      });
    }
  });

  return { code: 'SUCCESS', message: '成功' };
}
```
