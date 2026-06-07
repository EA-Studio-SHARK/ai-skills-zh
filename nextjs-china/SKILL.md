# nextjs-china

用于 Next.js 项目在中国大陆访问、部署、备案、CDN、对象存储、云厂商和性能优化场景。适合为 Vercel 原型迁移到阿里云、腾讯云、华为云、火山引擎、自建 Node 服务或静态站点提供方案和代码。

## 核心规则

- 先确认目标用户是否主要在中国大陆；因为部署区域决定备案、CDN 和网络策略。
- 面向大陆公开访问的域名要考虑 ICP 备案；因为未备案域名无法接入大陆 CDN 或可能访问受限。
- Vercel 适合海外原型，不默认适合作为大陆生产入口；因为跨境链路延迟和稳定性不可控。
- 静态内容优先接入国内 CDN；因为 `_next/static`、图片和字体是首屏关键资源。
- 图片域名必须配置 `images.remotePatterns`；因为 Next.js 图片优化会拒绝未声明远程源。
- 国内部署要避免依赖 Google Fonts；因为字体请求可能慢或不可用。
- 第三方脚本要评估国内可访问性；因为 analytics、captcha、map 等脚本常拖慢首屏。
- API 路由和 SSR 要部署在靠近用户的 Node 环境；因为服务端渲染每次请求都会受网络影响。
- ISR 和缓存策略要结合业务更新频率；因为过短 revalidate 会增加源站压力。
- 对象存储适合图片、下载文件和静态资源；因为云服务器磁盘不适合承载大流量静态文件。
- 环境变量要按开发、测试、生产隔离；因为国内云控制台容易多人维护，误配风险高。
- 服务端日志要接入云日志或 APM；因为生产问题不能靠 SSH 看临时日志。
- 错误上报要选择国内可用服务或自建；因为境外 SaaS 上报可能丢失。
- 不要把密钥写进 `NEXT_PUBLIC_`；因为该前缀变量会暴露到浏览器。
- 后台管理端可使用 CSR，营销站和内容站优先 SSG/SSR；因为不同页面对 SEO 和交互需求不同。
- 微信内访问要测试分享卡片、支付跳转和 OAuth；因为微信 WebView 行为和普通浏览器不同。
- 备案主体、域名、云资源要提前规划；因为备案周期会影响上线排期。
- 跨域接口要配置明确白名单；因为泛 `*` 会带来安全和 cookie 问题。
- 使用国内镜像或锁定包管理器；因为 CI 在国内拉取依赖可能不稳定。
- Docker 镜像要多阶段构建；因为 Next.js 产物和依赖体积会影响发布速度。
- CDN 缓存要区分 HTML 和静态资源；因为 HTML 长缓存会导致版本更新不及时。
- 健康检查和回滚机制必须有；因为云厂商部署失败需要快速恢复。
- 小程序或公众号内嵌 H5 要使用已备案 HTTPS 域名；因为平台配置要求合法域名。
- 地图、短信、支付等能力优先选国内服务商；因为合规和可用性更稳定。

## 反例

```ts
// 错误：把服务端密钥暴露给前端。
NEXT_PUBLIC_ALIPAY_PRIVATE_KEY=...
```

```tsx
// 错误：直接依赖 Google Fonts，国内访问可能阻塞。
import { Inter } from 'next/font/google';
```

## 正例

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.cn' }
    ]
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' }
        ]
      }
    ];
  }
};

export default nextConfig;
```

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
```

## 配置建议

- 大陆生产推荐：域名备案 + 国内 CDN + 阿里云/腾讯云 Node 服务 + OSS/COS。
- 内容站可考虑静态导出到 OSS/COS，再由 CDN 分发。
- CI/CD 中固定 Node、pnpm/npm 版本，并缓存依赖。
- 上线前用移动 4G、联通、电信和微信内置浏览器分别测试。
