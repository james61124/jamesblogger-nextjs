---
title: "[ Leetcode 718 ] Maximum Length of Repeated Subarray | 解題思路分享"
date: "2025-03-01"
author: James
tags: Array,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給定兩個整數陣列 nums1 和 nums2，找出它們中長度最長的「連續」相同子陣列（subarray）的長度。

⚠️ 注意：

子陣列（subarray） 必須是 連續的，不像子序列（subsequence）可以不連續。
如果沒有相同的子陣列，則回傳 0。

題目連結 🔗：[https://leetcode.com/problems/maximum-length-of-repeated-subarray/](https://leetcode.com/problems/maximum-length-of-repeated-subarray/)

### **解題思路 - DP (Double-Sequence Linear DP Problem)**

這題可以透過 Double-Sequence Linear DP 來解，因為他的輸入是兩條 array，所以我們就開一個 dp[i+1][j+1] 來代表以 nums1[i] 為結尾及以 nums2[j] 為結尾的最長 repeated subarray 長度。

首先 dp 先初始化為 0，因為如果是空字串的話 LCS 長度就是 0。下圖以 text1 = "ace"，text2 = "abcde" 來示範。

![DP](/images/program/leetcode-1143/DP-Table.JPEG)

雙迴圈 iterate 過兩個 string，左邊這張圖表示當兩個 char 一樣的時候，LCS 的長度就是拿掉這兩個 char 的 LCS 的長度再加一，也就是 dp[i+1][j+1] = dp[i][j] + 1。

中間這張圖表示當兩個 char 不一樣的時候，也就是 LCS 的長度不會變，所以 dp[i+1][j+1] 就是 dp[i][j+1] 跟 dp[i+1][j] 的大的那個，表示新增了一個 char，但是 LCS 的長度不會變。

最後右下角那格就是 iterate 過兩個 string 的結果，也就是最終答案。

**Time Complexity** - O( m × n )，因為 iterate 過兩個 string

**Space Complexity** - O( m × n )，因為開了一個 m x n 的 2D array

#### **Implementation**

```cpp
int longestCommonSubsequence(string text1, string text2) {
    vector<vector<int>>dp(text1.size()+1, vector<int>(text2.size()+1, 0));
    for(int i=0; i<text1.size(); i++){
        for(int j=0; j<text2.size(); j++){
            if(text1[i]==text2[j]){
                dp[i+1][j+1] = max(dp[i+1][j+1], dp[i][j]+1);
            } else {
                dp[i+1][j+1] = max(dp[i][j+1], dp[i+1][j]);
            }
        }
    }

    return dp[text1.size()][text2.size()];
}
```

### **空間優化**

以上是正常的 dp 建表，但是我們其實只需要 dp 裡面的兩個 row 就可以了，不用把整個 dp 的錶都建出來，所以就可以將空間優化為 O(min(m,n))。

```cpp
int longestCommonSubsequence(string text1, string text2) {

    if (text1.size() < text2.size()) swap(text1, text2); 
    vector<int>prev(text2.size()+1, 0);
    vector<int>cur(text2.size()+1, 0);

    for(int i=0; i<text1.size(); i++){
        for(int j=0; j<text2.size(); j++){
            if(text1[i]==text2[j]){
                cur[j+1] = prev[j]+1;
            } else {
                cur[j+1] = max(prev[j+1], cur[j]);
            }
        }
        swap(prev, cur);
    }

    return prev[text2.size()];
}
```