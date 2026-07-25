---
title: "[ Leetcode 846 ] Hand of Straights | 解題思路分享"
date: "2025-07-17"
author: James
tags: Hash Table,Greedy,Sorting
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: a7f9db9e-e965-499c-a2dc-44d1f8c43a90
---

你有一堆數字牌（可以重複），這些牌被表示為 hand[i]。現在你想把這些牌分成若干組，每一組剛好有 `groupSize` 張牌，並且每一組的牌是連續的整數（例如 [3, 4, 5]），請判斷是否可以把 `hand` 中的所有牌完全分組成這樣的連續群組。

題目連結 🔗：[https://leetcode.com/problems/hand-of-straights/](https://leetcode.com/problems/hand-of-straights/)

### **問題分析**

仔細想這題的結構，如果手上目前最小的牌是 `i`，groupSize 是 `3`，那表示我們一定要多找到 `i + 1`, `i + 2` 兩張牌，才有機會 return `true`，不然就可以直接 return `false` 了，因為沒有比 `i` 更小的牌可以跟他搭配。

當然我們可以直接計算目前最小的牌有幾張，假設 `i` 有 4 張，我們就必須找到 `i + 1`, `i + 2` 各 4 張，抽掉這些牌後，一樣繼續重複這個步驟，找當前最小的牌，往上數有沒有相對應的數目，直到把所有牌都抽完。

### **解題思路 - Greedy**

這就是 Greedy 關鍵在於我們要怎麼實作。

我們需要找到一個 data structure 可以協助我們紀錄每張牌的數量，可以快速更新，以及找到目前最小的牌是哪張，Hash Table 可以記錄牌的數量，也可以快速更新，但是 Hash Table 沒有辦法找到目前最小的牌是哪張，所以我們需要將 hand[i] sort 過。

首先我們先利用 Hash Table 儲存每張牌的數量，並 sort hand[i]。

```cpp
unordered_map<int, int>umap;
for(int &card : hand) umap[card]++;

sort(hand.begin(), hand.end());
```

再來從最小的卡牌開始 visit，要往上抽掉同等數量的卡牌

```cpp
for(int &card : hand){
    int count = umap[card];
    for(int i = 0; i < groupSize; i++){
        umap[card + i] -= count;
    }
}
```

如果某種卡牌的數量已經抽完了，那我們就不用再管他了，同時如果有卡牌不夠了，就表示這組卡牌沒有辦法正確分組，就要 return `false`。

```cpp
for(int &card : hand){
    if(umap[card] <= 0) continue; // 抽完了

    int count = umap[card];
    for(int i = 0; i < groupSize; i++){
        umap[card + i] -= count;
        if(umap[card + i] < 0) return false; // 不夠了
    }
}
```

這樣已經可以寫出正確答案，不過如果手牌數量根本就沒辦法被 `groupSize` 整除，那肯定沒辦法分組，可以直接回傳 `false`。

```cpp
if(hand.size() % groupSize != 0) return false;
```

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
