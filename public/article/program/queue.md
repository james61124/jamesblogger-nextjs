---
title: "[ Data Structure ] Queue & Priority Queue | 核心概念與 Leetcode 題型解析"
date: "2025-03-07"
author: James
tags: Data Structure,Stack,Monotonic Stack
image: /images/program/data-structure.jpeg
description: "Stack 是一種 Last In, First Out (LIFO) 的 data structure，有點像是疊積木，所以最大的特色就是，你永遠只能看到最上面這個 element，要 remove element 也只能 remove 最上面的這個，所以沒有辦法看到其他的 element。"
readTime: 2
---

### **Queue**

Queue 是一種 FIFO(First in, First out) 的 data structure，就很像排隊一樣，所以最先被 push 進去的，在 pop 的時候就會最先出來，而在 queue 中沒有辦法看到中間正在排隊的 element，只能看到頭尾。

#### **宣告**

```cpp
queue<int>q;
```

#### **可用的 Function**

比較需要注意的應該是因為是 queue 的關係，所以用的是 front 不是 top，再來就是他除了可以拿 front 還可以拿 back。

| Function     | Description                                | Time Complexity   |
|---------------|---------------------------------------|-------------------|
| push(value) | 將 element 加入 queue 尾巴       | O(1)      |
| pop()       | 移除 queue 前面的 element   | O(1)        |
| front()       | 取得 queue 前面的 element （不移除）           | O(1)             |
| back()      |  取得 queue 後面的 element （不移除） | O(1)             |
| empty()     | 檢查 queue 是否為 empty        | O(1)             |
| size()      | 返回佇列中的元素數量           | O(1)             |

### **Priority Queue**

priority queue 在 C++ 中是一個 STL，可以直接調用，他跟 queue 不一樣的地方在於他在 push value 的時候會把整個 queue 排列過一次，而 pop 的時候會按照 value 大小來決定誰先出來，所以需要耗費 O(log n) 來 push，剩下的部分就跟 queue 差不多了。

#### **宣告**

C++ 的 priority queue 預設是 maxHeap，所以在 pop() 的時候是大的會先出，寫起來是這樣：

```cpp
priority_queue<int> pq;
```

如果想要小的先出的話，要把它轉成 minHeap，可以這樣寫：

```cpp
priority_queue<int, vector<int>, greater<int>> pq;
```

除了這些，c++ 的 priority queue 還可以自訂 compare 的 function：

```cpp
struct Compare {
    bool operator()(int a, int b) {
        return a > b; // 讓 priority_queue 變成 minHeap
    }
};

priority_queue<int, vector<int>, Compare> pq;
```

這裡 compare 的意思是 如果 return `true`，那 ａ 的 priority 會變最低，所以實際上是 b 會先出，也就是 minHeap 的概念。

#### **可用的 Function**

| Function      | Description                                | Time Complexity    |
|---------------|---------------------------------------|-------------------|
| push(value) | 將 element 插入 priority queue 中       | O(log n)         |
| pop()       | remove 第一個 element（最大/最小值）   | O(log n)         |
| top()       | 取得第一個 element（不移除）           | O(1)             |
| empty()     | 檢查 priority queue 是否為 empty        | O(1)             |
| size()      | return priority queue 中 element 的數量   | O(1)             |

pop 也是 O(log n) 是因為 queue 是用 binary heap 實作的，pop 的過程涉及到 heapify，而這個過程需要 O(log n)。

#### **範例**

[[ Leetcode 239 ] Sliding Window Maximum | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-239/)<br>
[[ Leetcode 347 ] Top K Frequent Elements | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-347/)