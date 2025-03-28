---
title: "[ Leetcode 39 ] Combination Sum | 解題思路分享"
date: "2025-03-28"
author: James
tags: Array,Backtracking
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一組不重複的正整數 `candidates` 和一個 `target`，找出所有可以使總和等於 target 的組合。其中每個數字可以被選擇無限次，但組合中的數字順序不影響結果。

題目連結 🔗：[https://leetcode.com/problems/combination-sum/](https://leetcode.com/problems/combination-sum/)

### **問題分析**

這題問的是總和 = target 的所有組合，這乍聽之下很像 Unbounded Knapsack Problem，就好像是有限重 = target 的背包，candidates[i] 是 items 的重量，求所有可以把背包填滿的組合，但是 DP 比較能用來解決「最優解」或是「可能狀況的數量」，這裡要求的是「所有可能的組合」，DP 就沒有辦法做了，所以遇到需要列舉所有組合的朝 Backtracking 想比較好。

### **解題思路 - Backtracking**

對於每一個 candidates[i] 而言，都會有 `candidates.size()` 個 actions 可以接（ 因為可以 duplicate ），如果正常做 backtracking 的 DFS 會有組合重複的問題，例如今天搜到 [2, 3]，但是等等在看 3 的時候，又會回頭再接到 2，所以我們應該先把 candidates[i] 排序過，等等 DFS 的時候每一個 candidates[i] 只能接比他們大的 value。

```cpp
sort(candidates.begin(), candidates.end());
```

再來做 backtracking，把 `vector<int>ans` 一直往下接，如果總合剛好等於 target 就把 ans 推進去 result，然後 backtrack 回來再繼續看下一個 action。

```cpp
void backTracking(vector<vector<int>>& result, 
        vector<int>& ans, vector<int>& candidates, int target, int left){
    if(target == 0){
        result.push_back(ans);
        return;
    }

    for(int i=left; i<candidates.size(); i++){
        ans.push_back(candidates[i]);
        backTracking(result, ans, candidates, target-candidates[i], i);
        ans.pop_back();
    }
    return;
}
```

這裡傳到下一層時 target 會減掉剛剛的 candidates[i]，所以接下來的 trajectory 上只要總和符合這個 target 就好了，也就是說如果 `target < candidates[i]`，表示接下來我不可能找到總和等於 target 的組合了，因為我們用的是 sorting array，所以就可以直接 return。

```cpp
if(target<candidates[i]) return;
```

**Time Complexity** - `O(k^(target/min(candidates)))`，這題 time complexity 滿有意思的，`target/min(candidates)` 代表 backtracking 的樹最深的層數，因為最壞的情況就是 candidates 最小的數字一直選直到總和為 target，而對於每一個 node 來說，都可以有 k 個分支，其中 k 是 `candidates.size()`，所以整體的 time complexity 是指數成長，也就是 `O(k^(target/min(candidates)))`<br>
**Space Complexity** - `O(N)`


### **Implementation**

```cpp
void backTracking(vector<vector<int>>& result, 
        vector<int>& ans, vector<int>& candidates, int target, int left){
    if(target == 0){
        result.push_back(ans);
        return;
    }

    for(int i=left; i<candidates.size(); i++){
        if(target<candidates[i]) return;
        ans.push_back(candidates[i]);
        backTracking(result, ans, candidates, target-candidates[i], i);
        ans.pop_back();
    }
    return;
}

vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> result; 
    vector<int> ans;
    sort(candidates.begin(), candidates.end());
    backTracking(result, ans, candidates, target, 0);
    return result;
}
```