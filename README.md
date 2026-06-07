# AI Skills 中文包 | Chinese AI Agent Skills

让 AI 编程工具真正懂中国开发场景。

![Stars](https://img.shields.io/github/stars/your-username/ai-skills-zh?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

`ai-skills-zh` 是面向 Claude Code、Codex、Cursor、Gemini CLI 等 AI 编程工具的中文 Skills 包。它把中国开发者常见的业务场景、技术栈、内容平台规范和本地化表达沉淀成可复用规则，让 AI 生成更像真实团队会交付的代码、文案和方案。

English documentation: [README_EN.md](./README_EN.md)

## 安装

安装全部 skills：

```bash
npx skills add your-username/ai-skills-zh
```

安装单个 skill：

```bash
npx skills add your-username/ai-skills-zh/bilibili-content
```

> 发布到 GitHub 后，请把 `your-username` 替换为你的 GitHub 用户名或组织名。

## Skill 列表

| 名称 | 描述 | 适用工具 |
| --- | --- | --- |
| `weixin-miniprogram` | 微信小程序组件、API、性能、包体积、审核红线规范 | Claude Code, Codex, Cursor, Gemini CLI |
| `bilibili-content` | B站标题、封面、脚本结构、互动设计、数据复盘规范 | Claude Code, Codex, Cursor, Gemini CLI |
| `wechat-article` | 公众号文章选题、排版、配图、引流话术、SEO 规范 | Claude Code, Codex, Cursor, Gemini CLI |
| `china-payment` | 微信支付、支付宝签名、回调、退款、对账与安全规范 | Claude Code, Codex, Cursor, Gemini CLI |
| `antd-chinese` | Ant Design 中文后台组件选择、表单、国际化、权限与空状态规范 | Claude Code, Codex, Cursor, Gemini CLI |
| `nextjs-china` | Next.js 中国部署、CDN、备案、云厂商、可观测性规范 | Claude Code, Codex, Cursor, Gemini CLI |
| `prompt-zh` | 中文提示词工程、口语化表达、结构化输出、反 AI 腔规范 | Claude Code, Codex, Cursor, Gemini CLI |
| `git-commit-zh` | 中文 Git commit 规范，适配约定式提交和团队协作 | Claude Code, Codex, Cursor, Gemini CLI |

## 支持的 AI 工具

- Claude Code
- Codex
- Cursor
- Gemini CLI
- Windsurf
- Continue
- 其他支持读取 `SKILL.md` 或类似技能目录的 Agent 工具

## 使用方法

在 AI 编程工具中引用对应 skill 后，直接描述任务即可：

```text
使用 weixin-miniprogram skill，帮我优化这个小程序商品列表页的首屏性能。
```

```text
使用 china-payment skill，为 NestJS 服务补齐微信支付 JSAPI 下单、验签回调和退款流程。
```

```text
使用 prompt-zh skill，把这段 AI 味很重的提示词改成中文团队真实会用的版本。
```

## 贡献指南

欢迎提交 PR 增加新的中文场景 skill、修正规则、补充真实示例。

建议贡献流程：

1. Fork 本仓库。
2. 新增或修改一个 skill 文件夹。
3. 确保 `SKILL.md` 包含用途、规则、反例、正例和配置建议。
4. 在 `skills.json` 注册新增 skill。
5. 发起 Pull Request。

## 作者与交流

- GitHub: [your-username](https://github.com/your-username)
- B站: [你的B站主页](https://space.bilibili.com/)

如果这个项目对你有帮助，欢迎 Star、Fork，也欢迎在 B站或 GitHub 反馈你希望 AI 更懂的中文开发场景。

## License

MIT
