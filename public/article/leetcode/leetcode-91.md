---
title: "[ Leetcode 91 ] Decode Ways | 解題思路分享"
date: "2025-04-07"
author: James
tags: String,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
id: 5e5fee0a-4b2f-4ec0-916c-43d57c57d9d9
---

給一個只包含數字的 string `s`（例如 "12"），請問這個字串有多少種方式可以被 decode 成英文字母？

題目連結 🔗：[https://leetcode.com/problems/decode-ways/](https://leetcode.com/problems/decode-ways/)

### **問題分析**

第一感看到他寫找到所有組合，直覺就是 backtracking，因為一個 node 可能會有兩個 actions，選兩個或是選一個，往下走之後再 backtrack 就好，不過題目說的是找到「所有組合的數量」，所以 DP 應該就可以解決了。

### **解題思路 - DP**

dp[i] 代表「以 s[i-1] 為結尾的 substring 的所有 decode 數量」，而 dp[i] 總共會有兩種情況，第一種是 decode 的結果以 s[i-1] 為結尾（ A ~ I ），如果這種情況 valid，方法數量會跟 dp[i-1] 一樣，第二種是把 s[i-2] 跟 s[i-1] 一起看的情況 ( J ~ Z )，如果這種情況 valid，方法數量會跟 dp[i-2] 一樣，而 dp[i] 的 Transition Function 就是把兩種情況加起來。

```cpp
int firstNum = s[i-1] - '0';
int secondNum = s[i-2] - '0';
int twoDigit = secondNum * 10 + firstNum;

if(firstNum > 0) dp[i] += dp[i-1];
if(twoDigit <= 26 && twoDigit >= 10) dp[i] += dp[i-2];
```

再來處理 base，dp[0] 表示 s 是空字串，所以 dp[0] = 1，如果 s[0] 不是 '0' 的話，那表示 dp[1] = 1，而 dp 最後一位就是最終答案。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int numDecodings(string s) {

    vector<int>dp(s.size() + 1, 0);

    if(s[0] - '0' == 0) return 0; 
    dp[0] = 1;
    dp[1] = 1;
    
    for(int i=2; i<dp.size(); i++){
        int firstNum = s[i-1] - '0';
        int secondNum = s[i-2] - '0';
        int twoDigit = secondNum * 10 + firstNum;
        
        if(firstNum > 0) dp[i] += dp[i-1];
        if(twoDigit <= 26 && twoDigit >= 10) dp[i] += dp[i-2];
    }

    return dp[dp.size()-1];

}
```

### **空間優化**

再來我們就會發現對於 dp[i] 來說，我們一次只會看兩格而已，所以我們其實不需要宣告整條 dp array，我們只需要兩個 integer 即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int numDecodings(string s) {

    int prev2 = 1, prev1 = 1;
    if(s[0] - '0' == 0) return 0; 

    for(int i=2; i<s.size()+1; i++){
        int firstNum = s[i-1] - '0';
        int secondNum = s[i-2] - '0';
        int twoDigit = secondNum * 10 + firstNum;
        int cur = 0;
        
        if(firstNum > 0) cur += prev1;
        if(twoDigit <= 26 && twoDigit >= 10) cur += prev2;

        prev2 = prev1;
        prev1 = cur;
    }

    return prev1;

}
```
