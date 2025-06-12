---
title: "[ Leetcode 46 ] Permutations | 解題思路分享"
date: "2025-06-12"
author: James
tags: Array,Backtracking
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給定一個不含重複數字的 nums[i]，請回傳所有可能的排列（ permutations ）。

題目連結 🔗：[https://leetcode.com/problems/permutations/](https://leetcode.com/problems/permutations/)

### **問題分析**

遇到要列出所有組合的，可以先往 backtracking 想。

[[ Algorithm ] Backtracking | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/backtracking)

### **解題思路 - Backtracking**

看完上面的文章會發現，backtracking 可以寫出一個 decision tree，而我們需要去思考每一個節點會有哪些 actions 可以走，假設 nums = [1, 2, 3, 4]，每一層理論上 1, 2, 3, 4 都可以選，但是同一條路徑上數字不能重複選，也就是說一個 nodes 的 actions 是全部的數字扣除上面已經用過的部分，所以時間複雜度是 `O(n!)`。

<figure>
  <img src="/images/leetcode/leetcode-46/decision-tree.png" alt="decision-tree" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

所以在 backtracking 的過程，我們需要一個方式來記錄哪些 index 我們已經看過了，當然我們可以用傳統的 `vector<bool>visit` 來紀錄，但因為 nums.size() 不會太大，因此最省空間的方法絕對是 bit mask。

用 bit 來紀錄 state 概念就是如果 index i 被 visit 過了，那 int `state` 的第 i 位就要標成 0，我們需要以下幾種方法來更新 state：

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

最後把這些操作都寫進去 backtracking 就可以了

```cpp
void backTracking(vector<vector<int>>&result, vector<int>&ans, vector<int>& nums, int& state){
    int n = nums.size();
    if(state == (1 << n) - 1) {
        result.push_back(ans);
        return;
    }

    for(int i = 0; i < nums.size(); i++){
        if(state & (1 << i)) continue;
        ans.push_back(nums[i]);
        state = state | (1 << i);
        backTracking(result, ans, nums, state);
        ans.pop_back();
        state &= ~(1 << i);
    }
}
```

**Time Complexity** - `O(n!)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void backTracking(vector<vector<int>>&result, vector<int>&ans, vector<int>& nums, int& state){
    int n = nums.size();
    if(state == (1 << n) - 1) {
        result.push_back(ans);
        return;
    }

    for(int i = 0; i < nums.size(); i++){
        if(state & (1 << i)) continue;
        ans.push_back(nums[i]);
        state = state | (1 << i);
        backTracking(result, ans, nums, state);
        ans.pop_back();
        state &= ~(1 << i);
    }
}

vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>>result;
    vector<int>ans;
    int state = 0;

    backTracking(result, ans, nums, state);
    return result;
}
```