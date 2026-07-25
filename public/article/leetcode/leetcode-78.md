---
title: "[ Leetcode 78 ] Subsets | 解題思路分享"
date: "2025-03-22"
author: James
tags: Array,Backtracking,Bit Manipulation
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 8efe1fcf-a999-470c-9b59-81554c3c3314
---

題目要求我們找到一個 Array 的所有 Subset。

題目連結 🔗：[https://leetcode.com/problems/subsets/](https://leetcode.com/problems/subsets/)

### **解題思路 - Baktracking**

如果要找所有的 subset，每一個 node 就會面臨「選 / 不選」的決策，當看完一種決策要回到現在這個狀態繼續看下一種，那這種「現在的 decision 不合適或是不夠，就撤回這個 decision 繼續嘗試其他 action」，就是 Backtracking。

<figure>
  <img src="/images/leetcode/leetcode-78/decision-tree.png" alt="backtracking" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Array = [1, 2, 3], Decision Tree 的圖解
  </figcaption>
</figure>

Backtracking 需要考量以下三點，找出所有 action、找出 recursive 的 terminate 條件、backtracking 的方式，以下一一分析：

#### **找出所有 action**

對於每一個 node 來說，也就是每一層來說，我可以選或是不選，所以總共有兩個 action

#### **recursive 的 terminate 條件**

當我一個 trajectory 走到底了，也就是 `index == nums.size()` 時，就必須把現在這條路上決策的 node，也就是當前的 subset 放到 result 中。

#### **backtracking 的方式**

如果一個 node 所有 action 看完了，我必須將推進去 subset 裡的 node pop 出來，才能 backtrack 回去。

**Time Complexity** - `O(2^n)`，因為 array 中有 n 個 node，但是每一個 node 都有 2 種 actions<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
void dfs(vector<int>& nums, int index, vector<int>& subset, vector<vector<int>>& result){
    if(index==nums.size()) {
        result.push_back(subset);
        return;
    }
    dfs(nums, index+1, subset, result);
    subset.push_back(nums[index]);
    dfs(nums, index+1, subset, result);
    subset.pop_back();
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<int>subset;
    vector<vector<int>>result;
    dfs(nums, 0, subset, result);
    return result;
}
```
### **解題思路 2 - Bit Manipulation**

題目是找 subset，每一個 node 都可以「選 / 不選」，所以最後會有 2^n 個 subset 出現，「選 / 不選」這兩種 action 除了用 backtracking 的方式來表達，還可以用 Bit Mask 的方式來呈現。

找 subset 的過程就很像是二進位制的增加的過程，用 n = 3 舉例，如果讓 `mask` 從 0 數到 2^3，就是 `0b000` -> `0b001` -> `0b010` -> `0b011` ...，當該位數是 1 表示我們要將那個 index 放到我們的 result 中，這樣數完 2^n 個就剛好可以找到我們所有 subset。

#### **如何將 mask 轉換成 index?**

```
for (int j = 0; j < n; j++) {
    if (mask & (1 << j)) { 
        subset.push_back(nums[j]);
    }
}
```

這條代表的是 j 從第 0 個 index 開始看，看到第 n-1 個，如果 mask 的第 j 個 index 是 1，表示 nums[j] 這次是需要被放到 subset 的，現在來解析一下這個 condition

```
mask & (1 << j)
```

`(1 << j)` 表示左邊要加上 j 個 0，所以現在變成 `0b10`，搭配 & 就代表 mask 如果第 j 位數也是 1 的話，那結果才會是 1，舉個例子

```
j = 2
(1 << j) = 0b100
```

`mask = 0b001` 結果是 `false` 因為第 2 位不是 1，但如果 `mask = 0b100` 結果就是 `true`

#### **Implementation**

```cpp
vector<vector<int>> subsets(vector<int>& nums) {

    int n = nums.size();
    int total = pow(2, n);
    vector<vector<int>> result;
    
    for (int mask = 0; mask < total; mask++) { 
        vector<int> subset;
        for (int j = 0; j < n; j++) {
            if (mask & (1 << j)) { 
                subset.push_back(nums[j]);
            }
        }
        result.push_back(subset);
    }
    
    return result;
}
```