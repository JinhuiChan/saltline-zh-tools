# Saltline 简体中文与本地性能优化工具

非官方工具，维护者为 [JinhuiChan](https://github.com/JinhuiChan)，使用 OpenAI Codex 协助完成。

本 Git 仓库不直接托管游戏 HTML、游戏源码整包、预生成贴图、截图素材或在线试玩，工具也不会自动下载游戏。下方网盘为维护者提供的外部分享；工具本身只处理使用者自行提供、有权使用的本地原文件。工具和 MIT 许可证不构成原游戏的修改、再分发或商业使用授权。

## 原作与出处

Saltline 原作实验由 **Felix Rieseberg** 发起，使用 Claude Fable 5.2 生成。作者与模型信息据来源镜像 README 记载：

- [原作者展示](https://x.com/felixrieseberg/status/2119925633564463609)
- [原始 Claude Artifact](https://claude.ai/artifact/BGY1SztrAYcJQHSsnHHGmp)
- [参考镜像与来源说明](https://github.com/realcodebear/saltline-fable-5.2)

本工具不声称原作是本仓库作者自主开发的作品，也不代表 Felix Rieseberg 或 Anthropic。核验记录见 [CREDITS.md](CREDITS.md)，许可范围见 [LICENSING.md](LICENSING.md)。截至 2026-11-13，未在核查的本地原文件和来源镜像中找到游戏本体的明确再分发许可，本 Git 仓库不直接托管游戏及其衍生资源。

## 功能

- 翻译菜单、设置、按键说明、触屏按钮、HUD、任务对白和结算；保留输入键值、状态标识和玩法。
- 为中文增加系统字体回退，并调整标题排版。
- 远程字体非阻塞加载，避免字体服务无响应时阻塞初始化。
- 最终画布与场景共用渲染缩放，避免高 DPI 输出绕过像素预算。
- 可选：在本机生成 512 基准纹理缓存，将复杂程序化材质计算移到一次性的本地准备阶段。Ultra 与显式 `tex` 参数仍走原程序化路径。
- 输出携带原作出处与内嵌 Three.js r180 的 MIT 声明；拒绝覆盖输入原文件。

## 网盘分享

通过网盘分享的文件：**Saltline**

- 链接：[百度网盘 · Saltline](https://pan.baidu.com/s/1zX7mMOk2HgqDDb8kVGv5uw?pwd=5c42)
- 提取码：`5c42`

分享中包含以下三个文件（文件名和大小以网盘页面为准）：

| 文件名 | 版本说明 | 页面显示大小 |
| --- | --- | --- |
| `使用Fable5.2自主研发的国产几把猫FPS.html` | **简体中文汉化＋性能优化版**：已汉化菜单、设置、操作提示、任务对白和结算，并加入启动与渲染优化。想直接玩中文版可选择此文件。 | 约 8.52 MB |
| `optimized-en.html` | **英文性能优化版**：保留英文界面，加入材质缓存、字体非阻塞加载和高分屏渲染优化。 | 约 8.52 MB |
| `original.html` | **英文原版**：保留原始游戏构建，可供对照，也可作为下方工具的输入文件。 | 约 1.36 MB |

下载想使用的 HTML 后，可用 Microsoft Edge 或 Google Chrome 打开。下载前两种成品版本后，无需再运行下方的 Python / Node.js 构建命令；下方步骤用于自行从原版生成汉化或优化版本。

文件名沿用分享中的名称，原作出处仍为上文所列的 Saltline。外部分享链接不改变原作及第三方依赖的许可范围，详见 [许可说明](LICENSING.md)。

## 使用

需要 Python 3.10+。仅做汉化与基础优化时，无需安装 Node 依赖。

将自行取得的兼容原文件放到 `local/original.html`，然后运行：

```sh
python tools/build.py local/original.html local/saltline-zh.html
```

可以双击输出 HTML，或在 `local/` 内启动本地静态服务器。`local/` 和所有 HTML 均在 `.gitignore` 中。

如需纹理缓存，需要 Node.js 20+ 和已安装的 Microsoft Edge：

```sh
npm ci
node tools/bake-textures.cjs --input local/original.html --output local/textures.json
python tools/build.py local/original.html local/saltline-zh-cached.html --textures local/textures.json
```

其他浏览器可以传 `--channel chrome`，或使用 `--executable` 指定本机 Chromium 系浏览器的可执行文件。工具不会安装浏览器。缓存提取需要 WebGL 2 和可用的 GPU，首次运行仍需等待原游戏生成场景。

原文件始终保留。已存在的输出默认不会覆盖，可换路径，或使用构建工具的 `--force` 覆盖已有输出；此参数仍不允许覆盖输入原文件。烘焙工具始终拒绝覆盖已有缓存。

## 限制与验证

兼容已核验的原始单文件构建，相关脚本哈希见 CREDITS。不同上游版本或不同压缩变量名可能无法匹配，工具会在关键优化锚点缺失时拒绝写出。不要在已经汉化、优化或来自不明版本的文件上重复应用。

不含纹理缓存时，启动仍需生成原有材质。加入缓存后，文件会变大，GPU 材质生成工作减少。效果随设备、浏览器和后台负载变化，不承诺固定帧率或启动时间。

```sh
python -m unittest discover -s tests -v
```

公开 CI 仅使用合成文本测试，不下载或上传原游戏。维护者另外使用本地原文件验证了生成、菜单、设置、任务、敌人、暂停及结算流程。

## 贡献与许可

仅提交工具、测试和翻译增量。请勿通过提交、Issue、附件、Pages 或 Release 上传原游戏、游戏截图、烘焙纹理或生成的 HTML。

新增工具代码采用 [MIT](LICENSE)。原始游戏、原始文案及其权利、第三方依赖和本地产物不因此获得 MIT 授权；原始文案匹配项仅用于定位本地文件中的翻译位置。请先确认相应用途的权利范围。
