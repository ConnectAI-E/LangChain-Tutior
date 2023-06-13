## 使用说明

将`.env.example`复制为`.env`并填入OpenAI密钥

```bash
$ cp .env.example .env
```

安装依赖项

```bash
$ pnpm install
```

选择一个测试主题运行

```bash
$ pnpm run test guidelines -t 'base OpenAI api'
```