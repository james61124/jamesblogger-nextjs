---
title: "[ Leetcode 516 ] Longest Palindromic Subsequence | 解題思路分享"
date: "2025-03-26"
author: James
tags: String,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
id: 64441b19-7b1c-48cc-ac4c-5dbf241e8888
---

給一個 string `s`，找出最長的 palindromic subsequence 長度。

題目連結 🔗：[https://leetcode.com/problems/longest-palindromic-subsequence/](https://leetcode.com/problems/longest-palindromic-subsequence/)

### **問題分析**

這題如果用暴力解的話，可以從 recursive 下手，定義 f(i, j) 為 index i ~ j 的 longest palindromic subsequence，如果 `s[i] == s[j]`，表示 `f(i, j) = f(i+1, j-1) + 2`，如果 `s[i] != s[j]`，那表示 `f(i, j) = max(f(i+1, j), f(i, j-1))`，一步一步收縮，直到 `i==j`的時候 f(i, j) 就是 1，但這樣子我們可能會需要計算很多一樣的 f(i, j)，所以我們可以用 dp 來解決。

### **解題思路 - DP**

定義 dp[i][j] 為 index i ~ j 的 longest palindromic subsequence，所以 base case 是當 `i==j`，也就是區間內只有一個 char 的時候，dp[i][j] = 1，而 Transition Function 會長這樣：

```cpp
if(s[i] == s[j]) dp[i][j] = 2 + dp[i+1][j-1];
else dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
```

那我們會發現我們需要 i+1 的資料，但也需要 j-1 的資料，所以必須由下到上，但由左到右 update 這個 dp table。

#### **Implementation**

```cpp
int longestPalindromeSubseq(string s) {
    vector<vector<int>>dp(s.size(), vector<int>(s.size(), 0));
    int result = 1;

    for(int i=0; i<dp.size(); i++){
        dp[i][i] = 1;
    }

    for(int i=dp.size()-1; i>=0; i--){
        for(int j=i+1; j<dp.size(); j++){
            if(s[i] == s[j]) dp[i][j] = 2 + dp[i+1][j-1];
            else dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
            result = max(result, dp[i][j]);
        }
    }

    return result;
}
```