### 什麼是 Load Balance ( 負載平衡 )

Load Balance 是一種技術，將來自用戶的多個請求分散到不同的 server 或是資源上，以確保系統的穩定性，簡單來說有點像一個流量指揮官，決定誰的流量要由誰來處理，所以 Load Balance 在 System Design 中是非常重要的。

### 為麼我們需要 Load Balance

在高流量的網站中，我們會需要解決幾個問題：

1. 我們需要解決效能瓶頸 (Performance Bottleneck)