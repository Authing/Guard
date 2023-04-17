# 控制台配置项与 Guard 本地配置的关系

如果你不进行额外配置，Authing Guard 默认会使用云端的 Authing 控制台配置项，否则会对控制台中的配置进行覆盖。下面以 Guard 展示默认语言为例。

默认情况下，Guard 会读取品牌化配置中的『默认语言』作为默认展示语言：

![guard-console-relationship](./images/guard-console-relationship.png)

你也可以通过 `changeLang` 方法修改需要展示的语言，参考 [切换语言](./change-language.md)。