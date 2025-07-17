---
title: "[ Leetcode 875 ] Koko Eating Bananas | 解題思路分享"
date: "2025-07-17"
author: James
tags: Array,Binary Search
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



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

而 k 的範圍是 `1` <= `k` <= `max(piles)`，也就是說我們要在這個範圍內找到最適合的 k，仔細觀察會發現 k 越大 hourNeed 越小，小到一定程度 hourNeed 就會符合 `hourNeed <= h` 的條件，而這種一部分不符合條件，另一部分符合條件，就是 Binary Search 可以利用的場景。



### **解題思路 - Greedy**



**Time Complexity** - `O(n log n + n x g)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
bool isNStraightHand(vector<int>& hand, int groupSize) {
    if(hand.size() % groupSize != 0) return false;

    unordered_map<int, int>umap;
    for(int &card : hand) umap[card]++;
    sort(hand.begin(), hand.end());

    for(int &card : hand){
        if(umap[card] <= 0) continue;

        int count = umap[card];
        for(int i = 0; i < groupSize; i++){
            umap[card + i] -= count;
            if(umap[card + i] < 0) return false;
        }
    }

    return true;
}
```
