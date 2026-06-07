# AI Skills 中文包 | Chinese AI Agent Skills

Make AI coding agents understand real Chinese developer workflows.

![Stars](https://img.shields.io/github/stars/your-username/ai-skills-zh?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

`ai-skills-zh` is a Chinese AI Agent Skills package for Claude Code, Codex, Cursor, Gemini CLI, and similar coding agents. It captures China-specific engineering practices, local platform constraints, content workflows, payment integrations, deployment concerns, and Chinese writing conventions.

## Install

Install all skills:

```bash
npx skills add your-username/ai-skills-zh
```

Install one skill:

```bash
npx skills add your-username/ai-skills-zh/bilibili-content
```

Replace `your-username` with your GitHub username or organization after publishing the repository.

## Skills

| Name | Description | Tools |
| --- | --- | --- |
| `weixin-miniprogram` | WeChat Mini Program components, APIs, performance, package size, and review rules | Claude Code, Codex, Cursor, Gemini CLI |
| `bilibili-content` | Bilibili titles, covers, scripts, engagement design, and analytics review | Claude Code, Codex, Cursor, Gemini CLI |
| `wechat-article` | WeChat Official Account article layout, images, conversion copy, and SEO | Claude Code, Codex, Cursor, Gemini CLI |
| `china-payment` | WeChat Pay and Alipay signing, callbacks, refunds, reconciliation, and security | Claude Code, Codex, Cursor, Gemini CLI |
| `antd-chinese` | Ant Design best practices for Chinese enterprise dashboards | Claude Code, Codex, Cursor, Gemini CLI |
| `nextjs-china` | Next.js deployment in China, CDN, ICP filing, cloud vendors, and observability | Claude Code, Codex, Cursor, Gemini CLI |
| `prompt-zh` | Chinese prompt engineering, natural tone, structured output, and anti-AI-fluff rules | Claude Code, Codex, Cursor, Gemini CLI |
| `git-commit-zh` | Chinese Git commit conventions based on Conventional Commits | Claude Code, Codex, Cursor, Gemini CLI |

## Supported AI Tools

- Claude Code
- Codex
- Cursor
- Gemini CLI
- Windsurf
- Continue
- Any agent that can load `SKILL.md`-style skill directories

## Usage

Reference a skill in your agent prompt:

```text
Use the weixin-miniprogram skill to optimize this Mini Program product list page.
```

```text
Use the china-payment skill to implement WeChat Pay JSAPI order creation, verified callbacks, and refunds.
```

## Contributing

PRs are welcome. Each skill should include a practical `SKILL.md`, examples, and a human-readable `README.md`. New skills must be registered in `skills.json`.

## Author

- GitHub: [your-username](https://github.com/your-username)
- Bilibili: [Your Bilibili Space](https://space.bilibili.com/)

## License

MIT
