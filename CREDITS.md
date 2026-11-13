# 原作、来源与修改说明

核验日期：2026-11-13。

## 原作

来源镜像将 Saltline 记载为 Felix Rieseberg 发起、Claude Fable 5.2 生成的游戏实验。本仓库不是官方项目，不主张对原作、原作资源或其中第三方库的权利。

- 作者展示：https://x.com/felixrieseberg/status/2119925633564463609
- 原始 Artifact：https://claude.ai/artifact/BGY1SztrAYcJQHSsnHHGmp
- 来源镜像：https://github.com/realcodebear/saltline-fable-5.2
- 来源说明：https://github.com/realcodebear/saltline-fable-5.2/blob/main/README.md

本次无法直接读取 X 和 Artifact 正文；作者信息依据上述镜像的明确来源说明，不将镜像视为原作者授权。镜像根目录经检查仅有 README.md 与 index.html，没有 LICENSE。

## 技术核验

对本地提供的原文件与来源镜像的所有 script 内容提取、合并并将 CRLF 统一为 LF 后，SHA-256 均为：

```text
8d0057dc4d6dac77e20be2ef1f2b623e19346b5803fde1b3dbabbab508d75d9d
```

该哈希说明脚本内容一致，不构成授权或对原作者身份的独立验证。没有将原 HTML 加入本仓库。

本地原文件包含 Three.js r180。相应 MIT 许可来自 [Three.js r180 官方 LICENSE](https://github.com/mrdoob/three.js/blob/r180/LICENSE)，仅适用于该库。工具保留其完整声明于 licenses/three-r180-MIT.txt，并在本地产物中附加该声明。

## 本仓库增量

JinhuiChan 在 OpenAI Codex 协助下整理本地汉化和性能优化工具。新增内容为翻译匹配与中文词条、中文排版覆盖、字体加载优化、最终画布缩放修正、本地缓存提取和加载工具、测试和说明。

未重新分发原游戏 HTML、原作完整源码、原始程序化材质着色器、预生成纹理、截图或其他游戏资源。用户运行工具后生成的游戏文件和纹理仍与原作权利有关，不因本工具许可证而可以公开发布。
