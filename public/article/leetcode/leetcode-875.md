---
title: "[ Leetcode 875 ] Koko Eating Bananas | 解題思路分享"
date: "2025-07-17"
author: James
tags: Array,Binary Search
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: c0045307-21df-4e2f-860e-cc70101c0856
---

Koko 有一堆香蕉，每一堆有 piles[i] 根香蕉。她會以固定的速度 k 吃香蕉（每小時吃 k 根）。若某一堆香蕉小於 k，她就花 1 小時吃完那一堆，若超過 k 根，她就只吃 k 根，剩下的留到下一小時繼續吃（等於向上取整），總共有 h 小時，要求 Koko 最小要有多少的吃香蕉速度 k，才能在 h 小時內吃完所有香蕉？

題目連結 🔗：[https://leetcode.com/problems/koko-eating-bananas/](https://leetcode.com/problems/koko-eating-bananas/)

### **問題分析**

分析一下這題，如果有一個 `k` 代表一次吃幾個 banana，我們可以計算出需要吃多少小時

```cpp
for(int &pile : piles){
    if(pile % k != 0) hourNeed = hourNeed + (pile / k) + 1;
    else hourNeed += (pile / k);
}
```

而這其實就是 ceiling division，如果不整除的情況我們取上面的那個整數，也就是 `⌈a / b⌉`，所以我們可以簡單寫成這樣：

```cpp
for(int &pile : piles){
    hourNeed += (pile + k - 1) / k;
}
```

簡單證明一下為什麼 `⌈a / b⌉ = (a + b - 1) / b`，因為要往上取整數，也就是說我們只要把 `a` 加大一點讓 `a / b` 可以跳到下一個整數就好，直接 `a + b` 在 `a` 沒辦法被 `b` 整除時可行，但如果 `a` 可以被 `b` 整除，那他也不需要跳到下一個整數，所以幫 `a + b` 減一即可。 

我們有辦法利用 k 計算出 hourNeed 後，這題的核心問題就是

> 找到最小的 k 使得 hourNeed <= h

而 k 的範圍是 `1` <= `k` <= `max(piles)`，也就是說我們要在這個範圍內找到最適合的 k，仔細觀察會發現 k 越大 hourNeed 越小，小到一定程度 hourNeed 就會符合 `hourNeed <= h` 的條件，而這種前半段不符合條件，後半段符合條件，並且要找到交界處的 target，就是 Binary Search 可以利用的場景，下面這篇文章詳細介紹了 Binary Search 的原理還有變化的 Template。

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

### **解題思路 - Binary Search**

如果看完上面的文章，就會知道只要找出 `is_valid` function，binary search 就算是寫完了，舉個例子

```python
piles = [3, 6, 7, 11]
h = 8

k        = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
is_valid = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,  1 ]
```

以上面這題來說，最後的答案為 4，所以所有 k >= 4 的情況 `is_valid` 都要回傳 `true`，而 k >= 4 就代表 hourNeed <= h，換句話說，is_valid 只要在 hourNeed <= h 的情況下回傳 `true`，binary search 就寫完了

先寫出 Binary Search 的 Template，其中 `1` <= `k` <= `max(piles)`，所以 left = 1，right = max(piles)

```cpp
int minEatingSpeed(vector<int>& piles, int h) {
    int maxPile = 0;
    for(int &pile : piles) maxPile = max(maxPile, pile);

    int left = 1;
    int right = maxPile;
    while(left <= right){
        int mid = left + (right - left) / 2;
        if(is_valid()) right = mid - 1;
        else left = mid + 1;
    }

    return left;
}
```

再來寫出 is_valid 即可，只要符合 hourNeed <= h 就回傳 `true`

```cpp
bool is_valid(vector<int>& piles, int h, int mid){
    long long hourNeed = 0;
    for(int &pile : piles){
        hourNeed += (pile + mid - 1) / mid;
    }
    return hourNeed <= h;
}
```

這樣就完成了

**Time Complexity** - `O(n x log maxPile)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool is_valid(vector<int>& piles, int h, int mid){
    long long hourNeed = 0;
    for(int &pile : piles){
        hourNeed += (pile + mid - 1) / mid;
    }
    return hourNeed <= h;
}

int minEatingSpeed(vector<int>& piles, int h) {
    int maxPile = 0;
    for(int &pile : piles) maxPile = max(maxPile, pile);

    int left = 1;
    int right = maxPile;
    while(left <= right){
        int mid = left + (right - left) / 2;
        if(is_valid(piles, h, mid)) right = mid - 1;
        else left = mid + 1;
    }

    return left;
}
```
