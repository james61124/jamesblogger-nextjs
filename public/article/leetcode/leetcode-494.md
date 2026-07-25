---
title: "[ Leetcode 494 ] Target Sum | 解題思路分享"
date: "2025-07-02"
author: James
tags: Array,DP,0/1 Knapsack Problem
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 8cfd2ba5-e195-4f1b-b97d-276b73a1e2ee
---

給一個 nums[i]，裡面都是非負整數，可以對每個元素選擇加號 + 或減號 -，把所有元素相加後的結果，必須剛好等於 target，回傳有幾種不同的加減組合可以達到 target。

題目連結 🔗：[https://leetcode.com/problems/target-sum/](https://leetcode.com/problems/target-sum/)

### **問題分析**

這題最暴力的解法應該是 dfs + backtracking，但即便把重複的數字 prune 掉，時間複雜度還是 O(2^n) 這樣太高了，所以這題有更快的方式。

題目是問正負，因為每個數字都會選到，所以事實上不是挑不挑的問題，而是拆兩邊的問題，如果想得到拆兩邊，一邊為 positive，另一邊為 negative，我們自然就可以寫出這個方程式：

```python
sum(positive) - sum(negative) = target
```

也就是說，這題其實是在問

> 有幾種方法能把 `nums` 拆成兩邊，而兩邊差為 target

我們可以列出兩條方程式

```python
sum(positive) - sum(negative) = target
sum(positive) + sum(negative) = totalSum
```

兩條相加，最後會得到：

```python
2 * sum(positive) = target + totalSum
sum(positive) = (target + totalSum) / 2
```

也就是說這題題目變成

> 有多少 subset 可以可以組合出 `sum(positive)`

這幾乎就變成 [ Leetcode 416 ] Partition Equal Subset Sum 了，我們可以直接利用 0/1 Knapsack Problem 來解，如果沒有解過這題的可以先看下面的文章：

[[ Leetcode 416 ] Partition Equal Subset Sum | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-416)

### **解題思路 - 0/1 Knapsack Problem**

我們需要一個 dp[i][j] 代表「前 i 個數字中有多少 subset 可以組合出 j」，而 nums[i] 只有「選 / 不選」兩種 actions，所以是 0/1 Knapsack Problem。

如果不選 nums[i]，方法數就是「前 i-1 個數字中組成 j 的方法數」，也就是 dp[i-1][j]，如果選 nums[i]，方法數就是「前 i-1 個數字中組成 j - nums[i] 的方法數」，兩者相加即可，所以 Transition Function 是

```cpp
dp[i][j] = dp[i-1][j] + dp[i-1][j - nums[i]]
```

首先我們要先計算出 `sum(positive)`，因為這決定了 dp table 的 size

```cpp
int totalSum = 0;
int positive = 0;

for(int num : nums) totalSum += num;
positive = (totalSum + target) / 2;
```

再來我們要思考初始化的情況，dp[0][0] 肯定要放 1，因為不管 nums[0] 是多少，空的 subset 方法數就是 1，再來 dp[0][nums[0]] 的方法數也是 1，因為選了 nums[0] 就可以組成 nums[0]，唯一有一種情況例外，當 `nums[0] == 0` 的時候實際上方法數是兩種，因為 +0 跟 -0 都可以組成 0，因此我們的初始化會像這樣：

```cpp
vector<vector<int>>dp(nums.size(), vector<int>(positive + 1, 0));
int n = dp.size(), m = dp[0].size();
dp[0][0] = 1;
if(nums[0] < m) dp[0][nums[0]] += 1;
```

再來根據上面的 Transition Function 逐排更新即可

```cpp
for(int i = 1; i < n; i++){
    for(int j = 0; j < m; j++){
        dp[i][j] = dp[i-1][j];
        if (j >= nums[i]) dp[i][j] += dp[i-1][j - nums[i]];
    }
}
```

最後我們要處理 edge case，前面在計算 positive 是用 `(totalSum + target) / 2`，因此有兩種狀況會出錯，如果 totalSum + target 是奇數的話就不能整除，所以永遠都算不出答案，因此方法數是 0，再來如果 totalSum 比 target 還要小，表示就算全部都放到正的那組，也不可能可以組合出 target，方法數也是 0，負的狀況也是一樣，所以 edge case 要這樣處理

```cpp
if(totalSum < abs(target) || (totalSum + target) % 2 != 0) return 0;
```

最後組合起來就可以了

**Time Complexity** - `O(n * m)`<br>
**Space Complexity** - `O(n * m)`

#### **Implementation**

```cpp
int findTargetSumWays(vector<int>& nums, int target) {
    int totalSum = 0;
    int positive = 0;

    for(int num : nums) totalSum += num;
    if(totalSum < abs(target) || (totalSum + target) % 2 != 0) return 0;
    positive = (totalSum + target) / 2;

    vector<vector<int>>dp(nums.size(), vector<int>(positive + 1, 0));
    int n = dp.size(), m = dp[0].size();
    dp[0][0] = 1;
    if(nums[0] < m) dp[0][nums[0]] += 1;

    for(int i = 1; i < n; i++){
        for(int j = 0; j < m; j++){
            dp[i][j] = dp[i-1][j];
            if (j >= nums[i]) dp[i][j] += dp[i-1][j - nums[i]];
        }
    }

    return dp[n-1][m-1];
}
```

### **空間優化**

0/1 Knapsack Problem 因為 Transition Function 一次只會關注兩格，所以我們不需要宣告完整的 2d dp table，可以簡單優化成 1D

**Time Complexity** - `O(n * m)`<br>
**Space Complexity** - `O(m)`

#### **Implementation**

```cpp
int findTargetSumWays(vector<int>& nums, int target) {
    int totalSum = 0;
    int positive = 0;
    
    for(int num : nums) totalSum += num;
    if(totalSum < abs(target) || (totalSum + target) % 2 != 0) return 0;
    positive = (totalSum + target) / 2;

    vector<int>dp(positive + 1, 0);
    int n = dp.size();
    dp[0] = 1;
    if(nums[0] < n) dp[nums[0]] += 1;

    for(int i = 1; i < nums.size(); i++){
        for(int j = n - 1; j >= 0; j--){
            if(j >= nums[i]) dp[j] += dp[j - nums[i]];
        }
    }

    return dp[n-1];
}
```