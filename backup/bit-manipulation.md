

mask - 保留特定位數的值，其他全部變成 0
a ^ a = 0，而 a ^ 0 = a

190

首先，初始化 state 為 0，因為一開始還沒有任何 index 被 visit。

```cpp
int state = 0
```

如果 index i 被 visit，我們要把 `state` 的第 i 位標成 1，只需要 OR 即可實現：

```cpp
state |= (1 << i);
```

backtracking 在回溯時，會需要把 state 恢復，也就是把 state 第 i 位標成 0，mask 可以設置成類似 `0b1011111`，讓 state 跟 mask 做 AND 就可以保留其他位數並把該位數標成 0 了。

```cpp
state &= ~(1 << i)
```

要判斷 state 的第 i 位數是不是 1，mask 可以設置成類似這樣 `0b10000`，state 跟 mask 做 AND，如果該位數原本就是 1 那整個判斷式就會回傳 1，反之會回傳 0。

```cpp
if(state & (1 << i))
```

最後如果 state 全部都是 1，就表示全部都 visit 過了，就可以把答案推進去 `result`

```cpp
if(state == (1 << n) - 1)
```