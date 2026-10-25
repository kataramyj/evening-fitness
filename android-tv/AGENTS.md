# Android TV 外壳规则

- `app/src/main/java/` 只放原生加载、遥控器返回和错误处理；不得复制训练计划或教学文案。
- `app/build/generated/site-assets/site/` 是 Gradle 从仓库 `tv/` 生成的临时目录，不手工编辑、不提交。`tv/` 是唯一网页来源。
- `app/src/main/res/` 放电视启动图；应用不请求网络、存储权限，也不写训练记录。
- 更新 APK 须重新安装；云端 debug 签名可能变化，若覆盖安装失败，先卸载旧版再安装。电视版没有本地训练记录需要迁移。
- 修改 Android 项目后至少运行网页静态检查；完整 APK 构建需 GitHub Actions 或独立 Android SDK，电视实机另验。
