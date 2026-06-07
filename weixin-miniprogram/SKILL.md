# weixin-miniprogram

用于微信小程序开发、重构、评审和性能优化。适用于 Claude Code、Codex、Cursor、Gemini CLI 等 Agent 在生成小程序页面、组件、API 调用、登录授权、支付、订阅消息、内容审核与发布检查时使用。

## 核心规则

- 使用小程序原生生命周期，不要照搬 Web React 生命周期；因为小程序页面栈、渲染线程和逻辑线程模型不同。
- 页面级状态放在 `data`，临时非渲染状态放在实例字段；因为无关字段进入 `setData` 会增加通信成本。
- `setData` 只传变化字段，不要整棵对象重传；因为逻辑层到视图层的数据包过大会造成卡顿。
- 长列表必须分页或虚拟化；因为一次渲染几百个节点会拖慢首屏和滚动。
- 图片必须设置 `mode`、尺寸和 `lazy-load`；因为无尺寸图片会抖动，未懒加载会拖慢首屏。
- 首屏接口只请求必要数据；因为小程序冷启动链路短，首屏请求越多白屏越明显。
- 使用分包承载低频页面；因为主包体积影响首次下载和审核体验。
- 静态大图优先 CDN 或云存储，不要放进主包；因为主包有体积限制且更新成本高。
- 登录必须区分 `wx.login`、手机号授权和业务登录态；因为 code 不是用户身份，不能直接当 token。
- 用户授权必须由明确交互触发；因为强制弹窗或诱导授权容易触发审核问题。
- 订阅消息必须说明订阅用途；因为模糊话术会降低转化并增加审核风险。
- 支付调用必须由服务端统一下单；因为商户密钥和签名逻辑不能暴露在小程序端。
- 回调状态以服务端支付通知为准；因为客户端 `requestPayment` 成功不等于最终入账。
- 表单提交要做前后端双重校验；因为前端校验可以被绕过。
- `wx.request` 要封装超时、错误码和登录过期处理；因为散落请求会导致体验不一致。
- 使用 `wx.getPrivacySetting` 和隐私弹窗适配；因为隐私协议是近年审核重点。
- 涉及内容发布要接入内容安全检测；因为用户生成内容未审核可能导致下架。
- 不要在页面 `onShow` 无条件重复拉取重接口；因为返回页面时会造成流量浪费和闪烁。
- 使用 `wx:if` 控制重型节点，使用 `hidden` 保留轻量状态；因为二者销毁和保留成本不同。
- `wx:key` 必须使用稳定业务 id；因为 index 作为 key 会导致列表局部更新错乱。
- 避免频繁调用同步存储 API；因为同步 IO 会阻塞逻辑线程。
- 敏感配置放服务端或云函数环境变量；因为小程序包可被反编译。
- 页面路径和参数要做白名单校验；因为二维码、分享链路可能携带异常参数。
- 审核前检查诱导分享、虚拟支付、彩票抽奖、医疗金融承诺等红线；因为这些是常见拒审原因。

## 反例

```js
// 错误：把完整列表和无关字段反复 setData，长列表会明显卡顿。
this.setData({
  goods: hugeList,
  userToken: wx.getStorageSync('token'),
  debugConfig: app.globalData
});
```

```js
// 错误：把支付状态完全交给客户端判断。
wx.requestPayment({
  ...payParams,
  success() {
    wx.navigateTo({ url: '/pages/pay/success' });
  }
});
```

## 正例

```js
// utils/request.js
export function request({ url, method = 'GET', data }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${getApp().globalData.apiBase}${url}`,
      method,
      data,
      timeout: 10000,
      header: {
        Authorization: `Bearer ${wx.getStorageSync('token') || ''}`
      },
      success(res) {
        if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.navigateTo({ url: '/pages/login/index' });
          return reject(new Error('登录已过期'));
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(res.data?.message || '请求失败'));
        }
        resolve(res.data);
      },
      fail: reject
    });
  });
}
```

```js
// 正确：支付后查询服务端订单状态。
async function pay(orderId) {
  const payParams = await request({ url: `/orders/${orderId}/pay`, method: 'POST' });
  await wx.requestPayment(payParams);
  const order = await request({ url: `/orders/${orderId}` });
  wx.redirectTo({
    url: order.status === 'PAID' ? '/pages/pay/success' : `/pages/orders/detail?id=${orderId}`
  });
}
```

## 配置建议

- `project.config.json` 开启代码压缩、ES6 转 ES5 按项目实际决定。
- 使用 `app.json` 的 `subpackages` 拆分低频页面。
- 为接口域名、上传域名、下载域名配置合法域名。
- 发布前跑一次真机预览，重点看低端安卓机首屏、滚动和支付链路。
