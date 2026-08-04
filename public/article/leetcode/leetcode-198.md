---
title: "[ Leetcode 198 ] House Robber | 解題思路分享"
date: "2025-06-25"
author: James
tags: Array,DP,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 9b878a22-4f64-4219-9cc7-59dd368000c8
---

你是一名小偷，計畫沿著一條街道偷竊，每間房子都有一定金額的財物，存放於一個 nums[i] 中，但他不能偷相鄰的兩間房子，否則會觸發警報，請計算在這條街道上最多能偷多少錢。

題目連結 🔗：[https://leetcode.com/problems/house-robber/](https://leetcode.com/problems/house-robber/)

## 問題分析

這題翻成白話文是不能同時拿相鄰的兩個值，我們可以發現他有最優子問題，也就是「偷到第 i 間，怎麼偷金額最大」，各個子問題間也有重疊，因此不太會是 Greedy，應該比較頃向 DP。

## 解題思路 - DP

對於每個房子，我們都可以「選 / 不選」，我們需要一個 dp[i] 表示「偷到第 i 間最大的金額」。

如果選第 i 間，表示第 i-1 間不能選，所以這時候的金額就是 nums[i] + dp[i-2]，如果不選第 i 間，表示此時的金額就是偷到第 i-1 間最大的金額，也就是 dp[i-1]，所以 Transition Function 就是

```cpp
dp[i] = max(nums[i] + dp[i-2], dp[i-1])
```

那整體實作寫法滿多的，直接寫出來就是下面這樣，也沒有什麼問題，不過因為這個 Transition Function 牽扯到前兩格的數字，所以需要初始化兩個數字，就要先加一些判斷。

```cpp
 int n = nums.size();
vector<int>dp(n, 0);
dp[0] = nums[0];
if(n > 1) dp[1] = max(nums[0], nums[1]);
for(int i = 2; i < n; i++){
    dp[i] = max(nums[i] + dp[i-2], dp[i-1]);
}
return dp[n-1];
```

如果覺得這樣判斷有點醜，可以直接把 n == 1 的狀況拉出來寫，後面就不用多判斷。

```cpp
int n = nums.size();
if(n == 1) return nums[0];

vector<int>dp(n + 1, 0);
dp[0] = 0;
dp[1] = nums[0];
for(int i = 2; i <= n; i++){
    dp[i] = max(nums[i-1] + dp[i-2], dp[i-1]);
}
return dp[n];
```

但我們很快就會發現，事實上如果一次 dp 只關注兩格，根本就不需要開一整條 dp[i]，只需要兩個變數就夠了，所以可以優化成這樣：

```cpp
int n = nums.size();
if(n == 1) return nums[0];

int num1 = 0;
int num2 = nums[0];
for(int i = 1; i < n; i++){
    int curr = max(nums[i] + num1, num2);
    num1 = num2;
    num2 = curr;
}
return num2;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation
```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if(n == 1) return nums[0];

    int num1 = 0;
    int num2 = nums[0];
    for(int i = 1; i < n; i++){
        int curr = max(nums[i] + num1, num2);
        num1 = num2;
        num2 = curr;
    }
    return num2;
}
```