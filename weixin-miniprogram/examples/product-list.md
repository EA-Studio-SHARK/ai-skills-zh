# 商品列表页示例

```js
// pages/goods/list.js
Page({
  data: {
    goods: [],
    page: 1,
    pageSize: 20,
    loading: false,
    finished: false
  },

  onLoad() {
    this.loadGoods();
  },

  async loadGoods() {
    if (this.data.loading || this.data.finished) return;
    this.setData({ loading: true });

    try {
      const res = await wx.request({
        url: 'https://api.example.com/goods',
        method: 'GET',
        data: {
          page: this.data.page,
          pageSize: this.data.pageSize
        }
      });

      const list = res.data?.data?.list || [];
      this.setData({
        goods: this.data.goods.concat(list),
        page: this.data.page + 1,
        finished: list.length < this.data.pageSize
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  onReachBottom() {
    this.loadGoods();
  }
});
```

```wxml
<view class="goods-list">
  <block wx:for="{{goods}}" wx:key="id">
    <view class="goods-card">
      <image class="cover" src="{{item.cover}}" mode="aspectFill" lazy-load />
      <view class="title">{{item.title}}</view>
      <view class="price">¥{{item.price}}</view>
    </view>
  </block>
  <view wx:if="{{loading}}" class="state">加载中...</view>
  <view wx:if="{{finished}}" class="state">没有更多了</view>
</view>
```
