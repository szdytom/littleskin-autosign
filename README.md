# littleskin-autosign

使用 Github Actions 的 [LittleSkin](https://littleskin.cn/) 自动每日签到。

请在 Github Secrets 中配置登录信息，具体而言，创建名为 `CREDENTIALS` 的变量，包含如下 JSON 数据：

```json
{"handle":"你的邮箱","password":"你的密码"}
```

请注意，本项目不代表 LittleSkin 或 Github 的官方意见，本项目按照“按其原样”的原则提供，不提供任何附带保证，使用者需承担可能的风险。

