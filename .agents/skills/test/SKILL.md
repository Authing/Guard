---
name: test
description: 项目测试规范和最佳实践指南
---

# Testing Guidelines

## Testing Stack

### Core Tools
| 工具 | 版本 | 用途 |
|------|------|------|
| **Vitest** | ^3.1.1 | 单元测试、组件测试 |
| **@testing-library/react** | ^16.2.0 | React 组件测试 |
| **@testing-library/jest-dom** | ^6.6.3 | DOM 断言扩展 |
| **@vitest/coverage-v8** | ^3.1.1 | 测试覆盖率 |
| **jsdom** | ^26.1.0 | DOM 环境模拟 |

---

## Test File Structure

### 命名规范
- 测试文件以 `.test.ts` 或 `.test.tsx` 结尾
- 测试文件与源文件同目录或放在 `__tests__` 文件夹

### 目录结构
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      # 同目录
├── hooks/
│   ├── useAuth.ts
│   └── __tests__/
│       └── useAuth.test.ts   # __tests__ 文件夹
└── __tests__/
    └── setup.ts              # 全局 setup
```

---

## Vitest Configuration

### 基础配置 (`vitest.config.ts`)
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

### Setup 文件 (`src/__tests__/setup.ts`)
```ts
import '@testing-library/jest-dom/vitest'
```

---

## Writing Tests

### 基本结构
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## Testing Patterns

### 1. 组件渲染测试
```tsx
it('renders correctly', () => {
  const { container } = render(<Component />)
  expect(container.firstChild).toMatchSnapshot()
})
```

### 2. 用户交互测试
```tsx
it('handles user input', async () => {
  const user = userEvent.setup()
  render(<Form />)
  
  const input = screen.getByLabelText(/email/i)
  await user.type(input, 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

### 3. 异步操作测试
```tsx
it('loads data async', async () => {
  render(<DataComponent />)
  
  // 等待加载完成
  await screen.findByText(/loaded data/i)
  
  // 或使用 waitFor
  await waitFor(() => {
    expect(screen.getByText(/data/i)).toBeInTheDocument()
  })
})
```

### 4. Mock 测试
```tsx
// Mock 模块
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}))

// Mock 函数
const mockCallback = vi.fn()
mockCallback.mockReturnValue('value')
mockCallback.mockImplementation((arg) => arg * 2)
```

### 5. Hook 测试
```tsx
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

it('increments counter', () => {
  const { result } = renderHook(() => useCounter())
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

---

## Query Priority

按优先级使用查询方法：

| 优先级 | 方法 | 用途 |
|--------|------|------|
| 1 | `getByRole` | 按可访问性角色查询（推荐） |
| 2 | `getByLabelText` | 按标签文本查询 |
| 3 | `getByPlaceholderText` | 按占位符查询 |
| 4 | `getByText` | 按文本内容查询 |
| 5 | `getByTestId` | 按 data-testid 查询（最后手段） |

### Get vs Query vs Find
| 方法 | 未找到时行为 | 用途 |
|------|-------------|------|
| `getBy*` | 抛出错误 | 元素应该存在 |
| `queryBy*` | 返回 null | 断言元素不存在 |
| `findBy*` | 返回 Promise | 等待异步元素 |

---

## Common Assertions

```tsx
// 存在性
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// 可见性
expect(element).toBeVisible()
expect(element).toBeDisabled()

// 文本内容
expect(element).toHaveTextContent('text')
expect(element).toHaveTextContent(/regex/)

// 属性
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('active')

// 表单值
expect(input).toHaveValue('value')
expect(checkbox).toBeChecked()

// 函数调用
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(arg1, arg2)
expect(mockFn).toHaveBeenCalledTimes(2)
```

---

## Best Practices

### DO ✅
- 测试用户行为，而非实现细节
- 使用语义化查询（`getByRole`, `getByLabelText`）
- 测试可访问性
- 给异步操作足够的等待时间
- 保持测试独立，不依赖执行顺序

### DON'T ❌
- 不要测试组件内部状态（除非必要）
- 不要直接测试 React 内部方法
- 不要过度使用 `data-testid`
- 不要在测试中使用真实的 API 调用
- 不要忽略警告和错误

---

## Running Tests

### 命令
```bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch

# 运行特定文件
npm test -- Button.test.tsx

# 生成覆盖率报告
npm test -- --coverage

# UI 模式
npm test -- --ui
```

---

## Mock Best Practices

### API Mock
```tsx
// 使用 MSW (Mock Service Worker)
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'Test User' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Timer Mock
```tsx
it('handles timers', () => {
  vi.useFakeTimers()
  
  render(<Timer />)
  act(() => {
    vi.advanceTimersByTime(1000)
  })
  
  expect(screen.getByText('1s')).toBeInTheDocument()
  
  vi.useRealTimers()
})
```
