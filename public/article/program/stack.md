---
title: "[ Data Structure ] Stack & Monotonic Stack | 核心概念與 Leetcode 題型解析"
date: "2025-03-07"
author: James
tags: Data Structure,Stack,Monotonic Stack
image: /images/program/data-structure.jpeg
description: ""
readTime: 2
---

Stack 是一種 Last In, First Out (LIFO) 的 data structure，有點像是疊積木，所以最大的特色就是，你永遠只能看到最上面這個 element，要 remove element 也只能 remove 最上面的這個，所以沒有辦法看到其他的 element。

可以用的 function :

- `stack<int>st;` - 宣告
- `st.push(value);` - 在 stack 頂部插入元素
- `st.pop();`	- remove stack 頂部元素 ( ⚠️ 不返回 value )
- `st.top();`	- return stack 頂部元素 ( 不刪除 )
- `st.empty();` - 檢查 stack 是否為 empty (回傳 true/false)
- `st.size();`

#### **範例**

[[ Leetcode 20 ] Valid Parentheses | 解題思路分享](https://jamesblogger.com/leetcode/leetcode-20/)<br>
[[ Leetcode 227 ] Basic Calculator II | 解題思路分享](https://jamesblogger.com/leetcode/leetcode-227/)

### **Monotonic Stack**

再來說一種特殊的 Stack - Monotonic Stack，他是一個概念，不算是可以直接調用的 STL，核心思想就是要確保 Stack 中的數字都是 increasing 或是 decreasing 的。

舉個例子，假設今天要做一個 decreasing 的 Monotonic Stack

```
stack = [8, 5, 3]
```

現在要將一個 6 push 進去，所以在 push 進去前我就要先將 5, 3 pop 出來 ( 計算或是丟掉，看題目需求 )

```
stack = [8]
```

然後再把 6 push 進去

```
stack = [8, 6]
```

#### **用途**

- 找下一個比自己大或小的數字
- 找前一個比自己大或小的數字

#### **範例**

[[ Leetcode 496 ] Next Greater Element I | 解題思路分享](https://jamesblogger.com/leetcode/leetcode-496/)<br>
[[ Leetcode 739 ] Daily Temperatures | 解題思路分享](https://jamesblogger.com/leetcode/leetcode-739/)