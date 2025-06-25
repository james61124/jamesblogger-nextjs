---
title: "[ Leetcode 202 ] Happy Number | 解題思路分享"
date: "2025-06-25"
author: James
tags: Hash Table,Two Pointers,Math
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

把 `n` 每個位數平方後加總，得到新的數字，重複此過程，若最終可以變成 1，則是 Happy Number，否則若進入循環永遠無法變成 1，就不是。

題目連結 🔗：[https://leetcode.com/problems/happy-number/](https://leetcode.com/problems/happy-number/)

### **問題分析**

這題的暴力解沒有什麼特別的地方，還真的就是每個位數分離出來，計算出最新的數字，然後檢查看看是不是 1，不過什麼時候可以確定回傳 `false` 呢？就是當計算出來的數字之前就已經出現過了，而且他不是 1，表示出現 cycle，那就永遠不會到達 1 了。

而要快速判斷現在的數字之前是不是出現過了，用 Hash Table 就可以了。

### **解題思路 - Hash Table**

所以首先我們要計算出最新的數字是什麼，分離出各個位數的過程有點像這樣

```python
n = 123

123 % 10 = 3
n = 123 / 10 = 12

12 % 10 = 2
n = 12 / 10 = 1

1 % 10 = 1
n = 1 / 10 = 0
```

這樣可以分離出 3, 2, 1，就可以計算平方和，這個過程寫成 function 就是這樣：

```cpp
int getNext(int n) {
    int result = 0;
    while(n > 0) {
        result += pow(n % 10, 2);
        n /= 10;
    }
    return result;
}
```

最後判斷有沒有進 cycle 就行了。

```cpp
bool isHappy(int n) {
    unordered_set<int>uset;

    while(uset.count(n) == 0 && n != 1) {
        uset.insert(n);
        n = getNext(n);
    }

    return (n == 1);
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int getNext(int n) {
    int result = 0;
    while(n > 0) {
        result += pow(n % 10, 2);
        n /= 10;
    }
    return result;
}

bool isHappy(int n) {
    unordered_set<int>uset;

    while(uset.count(n) == 0 && n != 1) {
        uset.insert(n);
        n = getNext(n);
    }

    return (n == 1);
}
```

### **空間優化 - Fast and Slow Pointers**

要判斷有沒有進 cycle，實際上不一定要開到 Hash Table，Linked List 的 Fast and Slow Pointers 就是專門檢查有沒有 cycle 的，同樣可以運用在這題，即便這根本就不是一個 Linked List 的題目。

[[ Algorithm ] Two Pointers - Linked List | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/linked-list-two-pointer)

當我們計算一次 `getNext`，就好像是 Linked List 往下跑到下一個 node，所以可以這樣計算，寫起來就是這樣

```cpp
bool isHappy(int n) {
    int fast = getNext(getNext(n));
    int slow = getNext(n);

    while(fast != slow && fast != 1) {
        fast = getNext(getNext(fast));
        slow = getNext(slow);
    }

    return (fast == 1);
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int getNext(int n) {
    int result = 0;
    while(n > 0) {
        result += pow(n % 10, 2);
        n /= 10;
    }
    return result;
}

bool isHappy(int n) {
    int fast = getNext(getNext(n));
    int slow = getNext(n);

    while(fast != slow && fast != 1) {
        fast = getNext(getNext(fast));
        slow = getNext(slow);
    }

    return (fast == 1);
}
```