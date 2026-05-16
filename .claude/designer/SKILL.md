---
name: designer
description: Eazo Creator 项目的字体、字号、行高、标题、间距等排版规范
---

# Typography & Spacing System

## Fonts

### Primary Font
| 属性 | 值 |
|------|-----|
| 名称 | **Geist** |
| 来源 | 本地文件 `/public/Geist/Geist-VariableFont_wght.ttf` |
| 字重范围 | 100 - 900（Variable Font） |
| 用途 | UI 文本、正文内容 |

```css
font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

### Monospace Font
| 属性 | 值 |
|------|-----|
| 名称 | **Fira Code Variable** |
| 来源 | npm 包 `@fontsource-variable/fira-code` |
| 用途 | 代码块、行内代码 |

```css
font-family: 'Fira Code Variable', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

---

## Font Sizes

### Base Sizes
| 场景 | 字号 | CSS 变量/类 |
|------|------|-------------|
| 聊天 Markdown 正文 | **14px** | `.chat-markdown { font-size: 14px }` |
| 代码块（聊天） | **12px** | `.chat-markdown pre code { font-size: 12px }` |
| 表格（聊天） | **13px** | `.chat-markdown table { font-size: 13px }` |
| Thinking 区块代码 | **10px** | `.thinking-markdown pre code { font-size: 10px }` |
| Thinking 区块表格 | **10px** | `.thinking-markdown table { font-size: 10px }` |
| 流式图标 | **11px** | `.streaming-icon { font-size: 11px }` |
| 行内代码 | **0.85em** | 相对父元素字号 |

### Heading Sizes (相对基准 14px)
| 标题 | 相对字号 | 实际字号 |
|------|---------|---------|
| h1 | `1.25em` | **17.5px** |
| h2 | `1.1em` | **15.4px** |
| h3 | `1em` | **14px** |

### Tailwind 默认字号 Scale
| 类名 | 字号 |
|------|------|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |

---

## Line Heights

| 场景 | 行高 | 值 |
|------|------|-----|
| 聊天 Markdown 正文 | `1.75` | 较宽松，适合阅读 |
| Markdown 标题 (h1-h6) | `1.35` | 较紧凑 |
| Body 默认 | 系统默认 | Geist 字体默认行高 |

---

## Headings

### Chat Markdown Headings
```css
.chat-markdown h1, .chat-markdown h2, .chat-markdown h3,
.chat-markdown h4, .chat-markdown h5, .chat-markdown h6 {
  font-weight: 600;
  color: #1c1917;
  margin: 1.1em 0 0.4em;
  line-height: 1.35;
}

.chat-markdown h1 { font-size: 1.25em; }
.chat-markdown h2 { font-size: 1.1em; }
.chat-markdown h3 { font-size: 1em; }
```

| 标题 | 字号 | 字重 | 颜色 (Light) | 颜色 (Dark) |
|------|------|------|--------------|-------------|
| h1 | 1.25em | 600 | #1c1917 | #f5f5f4 |
| h2 | 1.1em | 600 | #1c1917 | #f5f5f4 |
| h3 | 1em | 600 | #1c1917 | #f5f5f4 |

### Margin
- 顶部间距：`1.1em`
- 底部间距：`0.4em`

---

## Spacing & Margins

### Paragraph
```css
.chat-markdown p { margin: 0 0 0.75em; }
.chat-markdown p:last-child { margin-bottom: 0; }
```

### Lists
```css
.chat-markdown ul, .chat-markdown ol {
  padding-left: 1.4em;
  margin: 0.4em 0 0.75em;
}
.chat-markdown li { margin: 0.2em 0; }
```

### Blockquote
```css
.chat-markdown blockquote {
  border-left: 3px solid #d6d3d1;
  padding-left: 0.9em;
  color: #78716c;
  margin: 0.5em 0;
  font-style: italic;
}
```

### Code Blocks
```css
.chat-markdown pre {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
  padding: 12px 14px;
  margin: 0.6em 0;
  border: 1px solid rgba(0,0,0,0.06);
}
```

### Tables
```css
.chat-markdown table { margin: 0.6em 0; }
.chat-markdown th { padding: 6px 10px; }
.chat-markdown td { padding: 5px 10px; }
```

---

## Border Radius

### Design Token
```css
--radius: 0.625rem; /* 10px */
```

### Radius Scale
| 变量 | 计算 | 值 |
|------|------|-----|
| `--radius-sm` | `calc(var(--radius) - 4px)` | **6px** |
| `--radius-md` | `calc(var(--radius) - 2px)` | **8px** |
| `--radius-lg` | `var(--radius)` | **10px** |
| `--radius-xl` | `calc(var(--radius) + 4px)` | **14px** |
| `--radius-2xl` | `calc(var(--radius) + 8px)` | **18px** |
| `--radius-3xl` | `calc(var(--radius) + 12px)` | **22px** |
| `--radius-4xl` | `calc(var(--radius) + 16px)` | **26px** |

---

## Text Colors

### Light Mode
| 变量 | 颜色 | 用途 |
|------|------|------|
| `--text-primary` | #171717 | 主要文本 |
| `--text-secondary` | #737373 |次要文本 |
| `--text-inverse` | #fafafa | 反色文本 |
| `--text-overlay` | #a1a1a1 | 覆盖层文本 |
| `--foreground` | oklch(0.145 0 0) | 前景色 |
| `--muted-foreground` | oklch(0.556 0 0) | 柔和前景色 |

### Dark Mode
| 变量 | 颜色 | 用途 |
|------|------|------|
| `--text-primary` | #fafafa | 主要文本 |
| `--text-secondary` | #a1a1a1 |次要文本 |
| `--text-inverse` | #171717 | 反色文本 |
| `--text-overlay` | #737373 | 覆盖层文本 |
| `--foreground` | oklch(0.985 0 0) | 前景色 |
| `--muted-foreground` | oklch(0.708 0 0) | 柔和前景色 |

### Markdown Colors
| 元素 | Light Mode | Dark Mode |
|------|------------|-----------|
| 正文 | #44403c | #d6d3d1 |
| 标题/strong | #1c1917 | #f5f5f4 |
| 链接 | #0891b2 | #67e8f9 |
| 行内代码 | #c2410c | #fdba74 |
| blockquote | #78716c | #a8a29e |

---

## Font Weights

### CSS 定义
| 字重 | 值 | 定义位置 |
|------|-----|---------|
| Geist 字体范围 | 100-900 | `@font-face { font-weight: 100 900 }` |
| 标题、strong、表格头 | 600 | `.chat-markdown h1-h6`, `.chat-markdown strong`, `.chat-markdown th` |
| 上下文压缩标签 | 700 | `.context-compaction-label` |

### Tailwind 类名使用统计
| 类名 | 数量 | 字重值 |
|------|------|--------|
| `font-medium` | **428** | 500 |
| `font-semibold` | **170** | 600 |
| `font-bold` | **31** | 700 |
| `font-normal` | **18** | 400 |

### 使用场景对照
| 字重 | 值 | Tailwind 类 | 典型场景 |
|------|-----|-------------|----------|
| normal | 400 | `font-normal` | 正文默认、普通文本 |
| medium | 500 | `font-medium` | 标签、小标题、按钮、表单标签（最常用） |
| semibold | 600 | `font-semibold` | 标题、强调文本、卡片标题、选中状态 |
| bold | 700 | `font-bold` | 强调、数据库表名 |

### 核心规律
- **正文**: 400 (默认)
- **UI 元素**: 500 (标签、按钮、小标题)
- **标题/强调**: 600 (卡片标题、选中项、strong)
- **少量强调**: 700 (极少数场景)

---

## Other Typography Settings

### Scrollbar
```css
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { border-radius: 2px; }
```

### Selection
```css
::selection { background: color-mix(in oklch, var(--primary), transparent 70%); }

/* 输入框选中 */
input::selection, textarea::selection {
  background: #f97316;
  color: white;
}
```

### Caret Color
```css
[data-chat-composer='true'] textarea,
[data-chat-composer='true'] input {caret-color: #f97316; }
```

### Antialiasing
```css
body { -webkit-font-smoothing: antialiased; }
```

---

## Menu Spacing

### Dropdown Menu Item
| 属性 | 值 | Tailwind |
|------|-----|----------|
| 水平内边距 | 8px | `px-2` |
| 垂直内边距 | 6px | `py-1.5` |
| 图标与文字间距 | 8px | `gap-2` |
| 圆角 | 4px | `rounded-sm` |

### Dropdown Menu Content
| 属性 | 值 | Tailwind |
|------|-----|----------|
| 内边距 | 4px | `p-1` |
| 圆角 | 6px | `rounded-md` |

---

## Cursor Styles

| 元素 | 样式 | Tailwind |
|------|------|----------|
| 菜单项 | `pointer` | `cursor-pointer` |
| 按钮 | `pointer` | `cursor-pointer` |
| 卡片 | `pointer` | `cursor-pointer` |
| 禁用状态 | `not-allowed` | `cursor-not-allowed` |

---

## Button Hover & Active Effects

### Hover 效果
| Variant | Hover 样式 |
|---------|-----------|
| `default` | `hover:bg-primary/90` 背景变淡 10% |
| `destructive` | `hover:bg-destructive/90` 背景变淡 10% |
| `outline` | `hover:bg-accent` `hover:text-accent-foreground` |
| `secondary` | `hover:bg-secondary/80` 背景变淡 20% |
| `ghost` | `hover:bg-accent` `hover:text-accent-foreground` |
| `link` | `hover:underline` 显示下划线 |

### Focus 效果
| 状态 | 样式 |
|------|------|
| Focus Visible | `focus-visible:border-[#EE5C2A]/40` |
| Focus Ring | `focus-visible:ring-[#EE5C2A]/20` `focus-visible:ring-[3px]` |

### 过渡动画
```css
transition-all
```

### 禁用状态
| 状态 | 样式 |
|------|------|
| 禁用 | `disabled:pointer-events-none` `disabled:opacity-50` |

---

## Icons

### Icon Library
| 属性 | 值 |
|------|-----|
| 名称 | **Lucide React** |
| 来源 | npm 包 `lucide-react@^0.577.0` |
| 用途 | 主要图标库 |

```tsx
import { IconName } from 'lucide-react'
```

### 高频使用图标 (Top 20)
| 图标名 | 使用次数 | 用途 |
|--------|---------|------|
| `Loader2` | 35 | 加载状态、旋转动画 |
| `Check` | 33 | 确认、完成状态 |
| `ChevronDown` | 21 | 展开/收起、下拉菜单 |
| `X` | 20 | 关闭、删除 |
| `ExternalLink` | 17 | 外部链接 |
| `Copy` | 15 | 复制操作 |
| `Eye` | 13 | 显示/查看 |
| `RefreshCw` | 10 | 刷新、重试 |
| `XCircle` | 8 | 错误、取消 |
| `EyeOff` | 8 | 隐藏 |
| `Trash2` | 7 | 删除 |
| `Plus` | 7 | 添加、新建 |
| `CheckCircle2` | 7 | 成功确认 |
| `Heart` | 6 | 收藏、喜欢 |
| `AlertTriangle` | 6 | 警告 |
| `Zap` | 5 | 快速操作、闪电 |
| `Database` | 5 | 数据库 |
| `Sparkles` | 4 | AI 功能、推荐 |
| `Play` | 3 | 执行、播放 |
| `Sun/Moon` | 3 | 主题切换 |

### 完整图标列表
```
AlertCircle, AlertTriangle, Archive, ArrowLeft, ArrowRight, ArrowUp, 
ArrowUpCircle, AtSign, Ban, Blend, Bold, BookOpen, Bug, Check, 
CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, 
Circle, CircleDashed, CircleDot, Clipboard, Clock, CloudUpload, 
Code2, Columns3, Compass, Copy, CornerDownRight, Database, Diff, 
Download, ExternalLink, Eye, EyeOff, File, FileCode, FileCode2, 
FileJson, FilePlus, FileSpreadsheet, FileText, FileUp, Film, Folder, 
FolderGit2, FolderOpen, Gauge, Github, Globe, Heart, Home, Inbox, 
Info, Key, KeyRound, Languages, Layers, LayoutDashboard, LayoutGrid, 
LayoutList, Lightbulb, Link, List, Loader2, LogIn, LogOut, Mail, 
Maximize2, MessageCircle, MessageSquare, MessagesSquare, Minus, 
Monitor, MonitorPlay, Moon, MoreHorizontal, MoreVertical, Move, 
Package, PackageMinus, Palette, PanelLeft, PanelLeftClose, 
PanelLeftOpen, PenLine, Pencil, PencilLine, Play, Plug, Plus, 
RefreshCw, Rocket, Rows3, Scale, ScrollText, Search, SearchIcon, 
Send, Server, Settings, Settings2, Share2, ShieldCheck, ShieldX, 
SignalHigh, Smartphone, Snowflake, Sparkles, Square, SquarePen, 
Star, Sun, Table2, Terminal, ThumbsDown, ThumbsUp, Trash2, 
TrendingUp, Trophy, Upload, UserPlus, UserRound, Users, 
UsersRound, Wifi, Wrench, X, XCircle, XIcon, Zap
```

### 自定义 SVG 图标
位置：`/src/assets/icons/index.tsx`

| 图标名 | 尺寸 | 用途 |
|--------|------|------|
| `IconMoreDots` | 26×26 | 更多操作（红点背景） |
| `IconPlusCircle` | 26×26 | 添加圆形按钮 |
| `IconOpenNewTab` | 16×16 | 新标签页打开 |
| `IconRename` | 16×16 | 重命名 |
| `IconPinDefault` | 16×16 | 置顶（默认状态） |
| `IconPinActive` | 16×16 | 置顶（激活状态，橙色填充） |
| `IconAttach` | 34×34 | 附件上传 |
| `IconSend` | 34×34 | 发送按钮（橙色圆形背景） |
| `IconStop` | 34×34 | 停止按钮（橙色圆形背景） |
| `IconPublish` | 16×16 | 发布 |
| `IconEdit` | 16×16 | 编辑 |
| `IconCardDelete` | 16×16 | 卡片删除 |
| `IconDivider` | 4×12 | 分隔线 |
| `IconThinkingDone` | 16×16 | 思考完成 |
| `IconDelete` | 16×16 | 删除（红色） |

### 使用示例
```tsx
// Lucide 图标
import { Loader2, Check, X } from 'lucide-react'

<Loader2 className="size-4 animate-spin" />
<Check className="size-4" />

// 自定义图标
import { IconSend, IconStop, IconPinActive } from '@/assets/icons'

<IconSend />
<IconStop />
<IconPinActive className="text-orange-500" />
```

### 图标尺寸规范
| 尺寸 | 用途 |
|------|------|
| 16px | 行内图标、小按钮 |
| 20px | 常规按钮、菜单项 |
| 24px | 工具栏、卡片 |
| 34px | 主要操作按钮（发送、停止） |

### 图标颜色规范
| 场景 | 颜色 |
|------|------|
| 默认状态 | `currentColor` (继承文本色) |
| 激活/选中 | `#EE5C2A` (品牌橙) |
| 危险操作 | `#EA4335` (红色) |
| 成功状态 | `#00C951` (绿色) |
| 禁用状态 | `opacity: 0.4` |