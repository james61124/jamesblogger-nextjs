---
title: "[ Algorithm ] Backtracking | 核心概念與 Leetcode 題型解析"
date: "2025-03-30"
author: James
tags: Algorithm,Backtracking
image: /images/program/algorithm.png
description: "Backtracking 的想法很簡單，我通常會把他想成 DFS，每一個 level 可以有至多 n 種 actions，當看完一種要回到現在這個狀態繼續看下一種，那這種「現在的 decision 不合適或是不夠，就撤回這個 decision 繼續嘗試其他 action」，就是 Backtracking。"
readTime: 2
---

Backtracking 的想法很簡單，我通常會把他想成 DFS，每一個 level 可以有至多 n 種 actions，當看完一種要回到現在這個狀態繼續看下一種，那這種「現在的 decision 不合適或是不夠，就撤回這個 decision 繼續嘗試其他 action」，就是 Backtracking。

通常遇到「列出所有組合」類型的題目，就很有可能是 Backtracking，舉 [ Leetcode 78 ] Subsets 為例，題目要求我們找出一個 array 中的所有 subset，所以每一個 index 都會面臨「選 / 不選」的決策，當看完一種決策要回到現在這個狀態繼續看下一種，這就是一題很典型的 Backtracking。

<figure>
  <img src="/images/leetcode/leetcode-78/decision-tree.png" alt="backtracking" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Array = [1, 2, 3], Decision Tree 的圖解
  </figcaption>
</figure>

Backtracking 可以像這樣畫出一張 Decision Tree，最常見的情況就是每一條 trajectory 都是一個解，最後把所有的解都推進去 `result` 中

```cpp
backtracking(nums, index+1, subset, result); // action 1 (不選)
subset.push_back(nums[index]);
backtracking(nums, index+1, subset, result); // action 2 (選)
subset.pop_back();
```

當然我們可能會有很多 actions，這裡範例剛好只有選跟不選兩個 actions，所以可以看到選的話就將 `nums[index]` 推進去 `subset`，送進去下一層，最後要撤回這個 action 所以要再 pop_back()。

### **範例**

[[ Leetcode 78 ] Subsets | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-78/)<br>
[[ Leetcode 51 ] N-Queens | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-51/)<br>
[[ Leetcode 39 ] Combination Sum | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-39/)

### **Template**

```cpp
void backtracking(vector<int>& nums, int index, vector<int>& subset, vector<vector<int>>& result){
    if(index==nums.size()) {
        result.push_back(subset);
        return;
    }
    backtracking(nums, index+1, subset, result); // 不選
    subset.push_back(nums[index]);
    backtracking(nums, index+1, subset, result); // 選
    subset.pop_back();
}
```