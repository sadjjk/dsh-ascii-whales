# ASCII Whales · DeepSeek Harness

Let whales drift through the quiet, and into your conversations.

A blue ocean unfolds behind each new chat. Schools of tiny fish scatter between characters; wakes fade slowly, and a pane of frosted glass holds the words you have yet to write. Turn on **Show in conversations** and the ocean stays behind your messages in a power-saving mode; switch sessions and the whales keep swimming from where they were.

[中文](README.md) · [Releases](https://github.com/sadjjk/dsh-ascii-whales/releases) · [Upstream](https://github.com/Chael-Chael/dsh-ascii-whales)

![Light mode](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/light.gif)

> This repository continues from [Chael-Chael/dsh-ascii-whales](https://github.com/Chael-Chael/dsh-ascii-whales) 0.1.5, adding in-conversation display and a continuous ocean across sessions. Demo GIFs were recorded on upstream 0.1.5 and show the empty-chat view.

## Install

In DeepSeek Harness, open the **plugin manager** and import:

```text
github:sadjjk/dsh-ascii-whales#release
```

Restart DSH afterwards. The plugin is enabled by default; open **Settings → ASCII Whales** to configure it.

To update, reinstall the same address. To return to the upstream version, install the npm package `dsh-ascii-whales@0.1.5`.

## An ocean in your conversations

By default the whales appear only in empty new chats. Turn on **Settings → ASCII Whales → Show in conversations** to keep them behind messages:

- **Power-saving**: up to 24 fps at 1× pixel density in conversations, painting about 5% of the pixels per second that the empty chat paints; the empty chat keeps its full frame rate.
- **Idle pause**: after 30 seconds without pointer, keyboard or scroll input, the scene holds still; any input resumes it.
- **Continuous across sessions**: the page has a single ocean. Switch sessions or visit Settings and come back, and the whales continue from where they were.
- **Shared opacity**: conversations and the empty chat use the same **Opacity** setting, 0.6 by default; lower it if the whales compete with text.

Reloading the page or restarting DSH starts a new random ocean.

## Your ocean

The animation fills the chat area behind the title, messages and composer. It retains the original ASCII cell colors, flexible bodies, schooling fish and spreading wakes; whales of different sizes swim past in DeepSeek blue `#4d6bfe` by default.

Light mode feels like water in daylight, dark mode like the sea at night. Glass is neutral white or charcoal, with no blue tint; colors passing behind it are naturally blurred.

Your chosen color anchors the whale body's midtones, with deeper shadows and brighter highlights that preserve per-cell lighting and body volume. Both themes use the same body palette.

![Dark mode](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/dark.gif)

## Tune your sea

Three **character styles**:

- **ASCII**: the original character cells, with bundled **Geist Mono 600**.
- **Hanzi**: 吻 at the snout, 目 at the eyes, 背 along the back, 鳍 on fins and 尾 on tail flukes; water and ocean characters fill the body, fish become 鱼, 鲤, 鲭 and 鲱, and every character turns with the bending body. Bundled **Source Han Serif**.
- **Kanji**: adapted from the MIT-licensed [ascii-kanji-sharks](https://github.com/michikusa404/ascii-kanji-sharks), keeping its ink-measured shading and feeding text effects; movement and schooling use stackedlol/ascii-sharks.

Cells use comparable areas across styles and fixed CSS-pixel sizes, independent of window width: at 1×, ASCII uses 8×12 px and Hanzi/Kanji use 10×10 px.

Fonts load offline. Choose **Font → Local custom** to enter separate installed English and Chinese font names such as `Consolas` or `方正屏显雅宋简体`; click **Scan local fonts** and allow browser access to pick from dropdowns. Kanji uses the Chinese font field; the English font field applies only to ASCII.

![Kanji · light](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/kanji-light.gif)
![Kanji · dark](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/kanji-dark.gif)

![Switch between Humpback and Orca](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/species.gif)

![Hanzi · light](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/hanzi-light.gif)
![Hanzi · dark](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/hanzi-dark.gif)

| Setting | Default | Range |
| --- | --- | --- |
| Show ocean | On | Entire scene and its glass |
| Show in conversations | Off | Power-saving display in chats with messages; unavailable while Show ocean is off |
| Whale species | Humpback | Humpback / Orca; saved and available in all three character styles |
| Character style | ASCII | ASCII / Hanzi / Kanji; applied immediately and saved |
| Font | Bundled default | Bundled default / Local custom; separate saved English and Chinese names |
| Eye background | Follow main color | Defaults to body shading; choose black or white, with contrasting text. Kanji defaults to transparent and adds an eye tile only for black/white |
| Colorful shimmer | Off | ASCII / Hanzi: enable the original seven-color glyph accents; body color is unchanged. Not applicable to Kanji |
| Ocean color | DeepSeek blue | Visual swatches and system color picker; fish and wakes follow |
| Whales | 3 | 1–20 |
| Size | 1.2× | 0.1–10×; individual size differences are kept |
| Speed | 0.65× | 0.1–10× |
| Body swing amplitude | 0.8× | 0–3×; zero removes body waves, while the spine still follows turns |
| Turning agility | 0.7× | 0.1–3×; higher values allow tighter turns |
| Tail-beat frequency | 0.8× | 0.1–5×; independent of swimming speed |
| Opacity | 0.6 | 0–1; shared by the empty chat and conversations, 1 is fully opaque |
| Cell size | 1× | 0.1–10×; larger is grainier |
| Background grid opacity | 0.05 | 0–1; 0 hides the grid |
| Small fish | 170 | 0–1000; 0 hides fish |
| Wake intensity | 1 | 0–10; 0 hides wakes |
| Frosted glass | On | Independent toggle |
| Glass blur | 14 px | 0–64 px |
| Glass opacity | 0.45 | 0–1; higher is more opaque |

Size, cell size, speed and wake step by **0.05** below 1 and **0.1** from 1 upward; you can also type values directly.

Humpbacks retain long flippers and broad flukes. Orcas have a broader rounded head, short rounded flippers, and white eye and flank patches independent of the eye-background setting. The first three whales use relative sizes of 100%, 70% and 84%.

**Restore defaults** brings back the initial settings. Saved preferences survive upgrades; new defaults such as opacity 0.6 apply only after **Restore defaults**. Preferences are saved in this browser. The animation follows reduced-motion preferences and pauses in background tabs.

![Settings and colors](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/settings.gif)

![Bundled fonts and local font dropdowns](https://raw.githubusercontent.com/Chael-Chael/dsh-ascii-whales/main/docs/media/fonts.gif)

## Where it swims from

This repository builds on [Chael-Chael/dsh-ascii-whales](https://github.com/Chael-Chael/dsh-ascii-whales) 0.1.5, which created the whale shapes, DSH integration, theme support, three character styles and all adjustable settings. This repository adds power-saving in-conversation display, idle pause and a continuous ocean across sessions.

The animation adapts [stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks): its schooling simulation, flexible spines, character rasterizer and lighting. The **Kanji** style adapts **[ascii-kanji-sharks · 漢字の海](https://github.com/michikusa404/ascii-kanji-sharks)** by **[michikusa404](https://github.com/michikusa404)** (MIT License, Copyright © 2026 michikusa404); the full license is preserved in [vendor/ascii-kanji-sharks/LICENSE](vendor/ascii-kanji-sharks/LICENSE).

Thank you to **Chael-Chael**, **stackedlol** and **michikusa404** for sharing their source, which made it possible to bring this sea into DeepSeek Harness.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for pinned upstream commits, modification scope and credits. The glass implementation drew on ideas from [dsh-glass-theme](https://github.com/cnayu/dsh-glass-theme) and [dsh-skin-glass](https://github.com/noexcs/dsh-skin-glass).
