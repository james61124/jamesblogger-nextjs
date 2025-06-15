---
title: "[ Leetcode 90 ] Subsets II | 解題思路分享"
date: "2025-06-15"
author: James
tags: Array,Backtracking
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個可能含有重複元素的 nums[i]，回傳其所有「不重複的 subsets」。

題目連結 🔗：[https://leetcode.com/problems/subsets-ii/](https://leetcode.com/problems/subsets-ii/)

### **問題分析**

列出所有 subsets，那很明顯就是朝 backtracking 的方向去想。

[[ Algorithm ] Backtracking | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/backtracking)

### **解題思路 - Backtracking**

看完上面的文章，我們會發現 backtracking 就是先列出一個 decision tree，再來將每一個 trajectory 推進去 result 中，不過這題最關鍵的地方是我們需要解決 duplicate。

但這題不像傳統的 decision tree 可以直接列出每一層的 actions，例如說「選 / 不選」，如果是這樣會選出非常多的 duplicate，我們可以先試著走過他的每一種組合，所以每一層會列出所有往後的 index，這樣就可以走完所有組合。

<figure>
  <img src="/images/leetcode/leetcode-90/duplicate.png" alt="Decision Tree" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

但如果單純只是這樣，因為同一層有重複數字的關係，會重複處理到一樣的數字，所以會出現非常多 duplicate，我們試著讓同一層中不要出現重複的數字：

<figure>
  <img src="/images/leetcode/leetcode-90/correct.png" alt="Decision Tree" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

這樣子每一條 trajectory 就都會是不一樣的了，但很快我們就會發現光是這樣根本就沒有找到每一個 subsets，因為每一個 trajectory 都會一路走到底，所以這裡要引入一個很特別的技巧

> 每一個 action 都是一次答案

大部分的 backtracking 題目都是走到底之後把整個 trajectory 的答案推入 `result` 中，但這題因為要找的是 subset，我們只要確保 trajectory 上不會出現重複的數字，每一個走過的過程實際上都是一次 subset。

```cpp
void backtracking(vector<int>& nums, vector<vector<int>>& result, vector<int>& ans, int index) {
    result.push_back(ans); // 每一層都要推入 result
    for(int i = index; i < nums.size(); i++) {
        if(i > index && nums[i] == nums[i - 1]) continue; // 每一層中不能出現重複的數字
        ans.push_back(nums[i]);
        backtracking(nums, result, ans, i + 1);
        ans.pop_back();
    }
}
```

不過要用這個解法，nums 一定要按照順序排列，所以我們先把 `nums` 排列過即可。

```cpp
sort(nums.begin(), nums.end());
```

**Time Complexity** - `O(2^n * n)`，最多有 2^n 個 subsets，每一個最長是 n<br>
**Space Complexity** - `O(n)`，每一個 `ans` 最長就是 n

### **Implementation**

```cpp
void backtracking(vector<int>& nums, vector<vector<int>>& result, vector<int>& ans, int index) {
    result.push_back(ans);
    for(int i = index; i < nums.size(); i++) {
        if(i > index && nums[i] == nums[i - 1]) continue;
        ans.push_back(nums[i]);
        backtracking(nums, result, ans, i + 1);
        ans.pop_back();
    }
}

vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    vector<vector<int>>result;
    vector<int>ans;
    sort(nums.begin(), nums.end());
    backtracking(nums, result, ans, 0);
    return result;
}
```