# ASCII 鲸鱼 · DeepSeek Harness

让鲸群游过留白，也游进对话里。

新对话展开时，蓝色鲸群从字符之间游来。细小的鱼群随水流散开，尾迹缓缓隐去；输入框像一片磨砂玻璃，轻轻托住尚未写下的话。打开「对话中显示」后，这片海会留在消息背后，以更省电的方式继续游动；切换会话时，鲸群接着原来的位置游，不会重新出发。

[English](README.en.md) · [Releases](https://github.com/sadjjk/dsh-ascii-whales/releases) · [上游项目](https://github.com/Chael-Chael/dsh-ascii-whales)

![浅色模式：鲸群游过聊天背景](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/light.gif)

> 本仓库基于 [Chael-Chael/dsh-ascii-whales](https://github.com/Chael-Chael/dsh-ascii-whales) 0.1.5 继续开发，新增对话中显示与跨会话连续海景。演示 GIF 录制于上游 0.1.5，展示空白页效果。

## 安装

在 DeepSeek Harness 的 **插件管理** 中导入：

```text
github:sadjjk/dsh-ascii-whales#release
```

完成后重启 DSH。插件默认启用，配置入口为 **设置 → ASCII 鲸鱼**。

更新时在插件管理中重新安装同一地址即可。需要回到上游原版时，改装 npm 包 `dsh-ascii-whales@0.1.5`。

## 对话中也有海

默认只在空白新对话里显示鲸群。打开 **设置 → ASCII 鲸鱼 → 对话中显示** 后，有消息的对话也会保留这片海：

- **更省电**：对话中最高 24 帧/秒、按 1× 像素密度绘制，每秒绘制的像素量约为空白页的 5%；空白页保持原有流畅度。
- **闲置静止**：30 秒没有鼠标、键盘或滚动操作，画面自动静止；任意操作即恢复游动。
- **跨会话连续**：整个页面只有一片海。切换会话、打开设置页再返回，鲸群都接着原来的位置游动。
- **透明度共用**：对话中与空白页使用同一个「透明度」设置，默认 0.6；觉得压字就调低。

刷新页面或重启 DSH 后，鲸群会重新随机生成。

## 一片海，两种光

动画铺在整个聊天主区域，位于标题、消息与输入框后方。它保留原项目的 ASCII 字符色块、身体弯曲、鱼群游动与扩散尾迹；鲸鱼以不同大小游过，默认主色为 DeepSeek 蓝 `#4d6bfe`。

浅色像日光下的水面，深色像夜里的海。毛玻璃使用中性白／深灰透明层，没有额外的蓝色 tint；经过后方的鲸鱼会自然透出模糊的颜色。

选中的颜色落在鲸鱼身体的中间调，暗面压深、亮面提亮，保留逐格光照层次与身体立体感。两种主题沿用同一套鱼身配色。

![深色模式](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/dark.gif)

## 调一调你的海

**字符风格** 有三种：

- **ASCII**：原版字符色块，默认内置 **Geist Mono 600**。
- **汉字**：吻部落「吻」，眼睛落「目」，背部落「背」，鳍落「鳍」，尾鳍落「尾」；其余鲸身由水、海、潮、鲸等字铺开，小鱼化作鱼字旁的游字，字随身体弯曲转向。默认内置 **思源宋体**。
- **Kanji**：改编自 MIT 许可的 [ascii-kanji-sharks](https://github.com/michikusa404/ascii-kanji-sharks)，保留按笔画密度生成的明暗与捕食文字效果，游动与鱼群模拟沿用 stackedlol/ascii-sharks。

三种样式按近似相同的字符格面积校准颗粒感，采用固定 CSS 像素尺寸，不随窗口宽度变化：1× 时 ASCII 为 8×12 px，汉字与 Kanji 为 10×10 px。

字体离线内置。切换 **字体 → 本机自定义** 可分别填写已安装的中英文字体名称，例如 `Consolas`、`方正屏显雅宋简体`；点击 **扫描本机字体** 并允许浏览器访问后，可从下拉菜单选择。Kanji 使用「中文字体名称」，英文字体仅作用于 ASCII。

![Kanji · 浅色](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/kanji-light.gif)
![Kanji · 深色](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/kanji-dark.gif)

![座头鲸与虎鲸切换](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/species.gif)

![汉字 · 浅色](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/hanzi-light.gif)
![汉字 · 深色](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/hanzi-dark.gif)

| 设置 | 默认 | 范围 / 作用 |
| --- | --- | --- |
| 显示海洋 | 开 | 控制整个背景与配套玻璃 |
| 对话中显示 | 关 | 有消息的对话中以低耗模式显示；「显示海洋」关闭时不可用 |
| 鲸鱼种类 | 座头鲸 | 座头鲸 / 虎鲸；三种字符风格均可切换并保存 |
| 字符风格 | ASCII | ASCII / 汉字 / Kanji；即时切换并保存 |
| 字体 | 内置默认 | 内置默认 / 本机自定义；中英文字体名称分别保存 |
| 眼睛底色 | 跟随主色 | 默认沿用身体底色，可选黑色／白色，字符自动使用对比色。Kanji 默认透明，选黑／白后增加眼睛底色块 |
| 彩色闪烁 | 关 | ASCII / 汉字：开启恢复原版七色字符点缀，不改变身体主色。Kanji 不适用 |
| 海洋颜色 | DeepSeek 蓝 | 可视化选色器；同步鱼群、尾迹配色 |
| 鲸鱼数量 | 3 | 1–20 |
| 鲸鱼大小 | 1.2 倍 | 0.1–10 倍，保留个体大小差异 |
| 游动速度 | 0.65 倍 | 0.1–10 倍 |
| 身体摆动幅度 | 0.8 倍 | 0–3 倍；0 关闭身体波动，仍会沿转弯路径弯身 |
| 转弯灵活度 | 0.7 倍 | 0.1–3 倍；越高越容易弯身掉头 |
| 摆尾频率 | 0.8 倍 | 0.1–5 倍；独立于游动速度 |
| 透明度 | 0.6 | 0–1；空白页与对话中共用，1 为完全不透明 |
| 字符栅格 | 1 倍 | 0.1–10 倍；越大越有颗粒感 |
| 底纹网格透明度 | 0.05 | 0–1；0 隐藏底纹 |
| 小鱼数量 | 170 | 0–1000；0 隐藏小鱼 |
| 尾迹强度 | 1 | 0–10；0 隐藏扩散尾迹 |
| 毛玻璃输入框 | 开 | 独立开关 |
| 玻璃模糊 | 14 px | 0–64 px |
| 玻璃不透明度 | 0.45 | 0–1；越高越不透 |

大小、栅格、速度、尾迹在 1 以下以 **0.05** 为步长，从 1 起以 **0.1** 为步长；也可直接输入数值。

座头鲸保留长胸鳍和宽尾叶；虎鲸采用更宽的圆钝头部、短圆胸鳍，以及独立于眼睛底色的白色眼斑与侧腹斑。默认三条鲸鱼的相对大小为 100%、70%、84%。

**恢复默认** 可一键回到初始设置；已保存的偏好在升级后保留，新默认值（如透明度 0.6）需点「恢复默认」才会生效。偏好保存在当前浏览器。动画遵循系统「减少动态效果」设置，并在后台标签页暂停。

![可视化颜色与官方设置控件](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/settings.gif)

![内置字体与本机字体下拉选择](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/fonts.gif)

## 从哪里游来

本仓库基于 [Chael-Chael/dsh-ascii-whales](https://github.com/Chael-Chael/dsh-ascii-whales) 0.1.5：上游完成了鲸鱼形态、DSH 集成、主题适配、三种字符风格与全部可调参数；本仓库在其基础上加入对话中低耗显示、闲置静止与跨会话连续海景。

动画源自 [stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks)：原作者完成了鱼群模拟、柔性身体、字符栅格与光影渲染。**Kanji** 样式改编自 [michikusa404](https://github.com/michikusa404) 创作的 **[ascii-kanji-sharks · 漢字の海](https://github.com/michikusa404/ascii-kanji-sharks)**（MIT License，Copyright © 2026 michikusa404），完整许可见 [vendor/ascii-kanji-sharks/LICENSE](vendor/ascii-kanji-sharks/LICENSE)。

感谢 **Chael-Chael**、**stackedlol** 与 **michikusa404** 公开源码，让这片海能够游进 DeepSeek Harness。

固定的上游版本、改动范围与署名见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。毛玻璃实现参考了 [dsh-glass-theme](https://github.com/cnayu/dsh-glass-theme) 与 [dsh-skin-glass](https://github.com/noexcs/dsh-skin-glass) 的相关思路。
