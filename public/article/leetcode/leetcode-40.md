---
title: "[ Leetcode 40 ] Combination Sum II | 解題思路分享"
date: "2025-06-10"
author: James
tags: Array,Backtracking
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 array `candidates` 和一個 `target`，請找出所有不重複的組合，這些組合中的數字加總起來等於 target。

題目連結 🔗：[https://leetcode.com/problems/combination-sum-ii/](https://leetcode.com/problems/combination-sum-ii/)

### **問題分析**

遇到要列出所有組合的，滿明顯就是 backtracking，可以先看過下面這篇 backtracking 的整理。

[[ Algorithm ] Backtracking | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/backtracking)

### **解題思路 - Backtracking**

由於 candidates[i] 中會有重複的元素，而輸出的答案中不能包含重複的組合，因此我們可以先將 candidates[i] 排序，比較好避免掉重複的組合。

如果有看完上面那篇文章，Backtracking 的過程可以畫出一個 decision tree，每一層都有很多 actions 可以選擇，以這題來說，第 i 層就是每一個答案中第 i 個數字，舉例來說，candidates = [1, 1, 3, 4, 6, 7, 10]，第一層能夠放所有的數字，第二層開始就只能放 parent 的 index 後面的數字，畫出來會像這樣

<figure>
  <img src="/images/leetcode/leetcode-40/decision-tree.png" alt="Decision Tree" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Decision Tree
  </figcaption>
</figure>

寫成程式碼會像這樣

```cpp
void backTracking(vector<int>& candidates, vector<vector<int>>& result, vector<int>& ans, 
                    int index, int target){
    for(int i = index; i < candidates.size(); i++){
        ans.push_back(candidates[i]);
        backTracking(candidates, result, ans, i + 1, target - candidates[i]);
        ans.pop_back();
    }
}
```

再來要設立終止條件，不會每一條 trajectory 都是答案，當 `target == 0` 表示確定這個 trajectory 是答案，所以要加進去 `result`，而發現 `target < candidates[i]` 表示這條 trajectory 不可能是答案了，就不用繼續往下看了。

```cpp
void backTracking(vector<int>& candidates, vector<vector<int>>& result, vector<int>& ans, 
                    int index, int target){
    
    // 表示這個 trajectory 是答案
    if(target == 0) {
        result.push_back(ans);
        return;
    }

    for(int i = index; i < candidates.size(); i++){
        if(target < candidates[i]) break; // 表示這個 trajectory 不可能是答案了，就不要繼續看了
        ans.push_back(candidates[i]);
        backTracking(candidates, result, ans, i + 1, target - candidates[i]);
        ans.pop_back();
    }
}
```

最後要把 duplicate 的答案篩掉，那方法很簡單，迴圈內如果 candidates[i-1] == candidates[i]，表示這個數字已經被看過了就不要再看一次了，所以直接跳過即可，像這樣：

```cpp
void backTracking(vector<int>& candidates, vector<vector<int>>& result, vector<int>& ans, 
                    int index, int target){

    if(target == 0) {
        result.push_back(ans);
        return;
    }

    for(int i = index; i < candidates.size(); i++){
        if(i > index && candidates[i] == candidates[i-1]) continue; // 跳過即可
        if(target < candidates[i]) break;
        ans.push_back(candidates[i]);
        backTracking(candidates, result, ans, i + 1, target - candidates[i]);
        ans.pop_back();
    }
}
```

**Time Complexity** - `O(2^n * n)`，因為最多會有 `2^n` 個解，每個數字都可以選跟不選的關係，而每個答案需要 O(n) 的時間去儲存，不過實際上因為排序跟剪枝的關係，時間會遠遠小於這個<br>
**Space Complexity** - `O(2^n * n)`

### **Implementation**

```cpp
void backTracking(vector<int>& candidates, vector<vector<int>>& result, vector<int>& ans, 
                    int index, int target){

    if(target == 0) {
        result.push_back(ans);
        return;
    }

    for(int i = index; i < candidates.size(); i++){
        if(i > index && candidates[i] == candidates[i-1]) continue;
        if(target < candidates[i]) break;
        ans.push_back(candidates[i]);
        backTracking(candidates, result, ans, i + 1, target - candidates[i]);
        ans.pop_back();
    }
}

vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
    vector<vector<int>>result;
    vector<int>ans;
    sort(candidates.begin(), candidates.end());
    backTracking(candidates, result, ans, 0, target);
    return result;
}
```