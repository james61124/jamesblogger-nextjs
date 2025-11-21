---
title: "[ Leetcode 416 ] Partition Equal Subset Sum | 解題思路分享"
date: "2025-03-24"
author: James
tags: Array,DP,0/1 Knapsack Problem
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
---

給一個只包含正整數的 array `nums`，請判斷是否能將這個陣列分成兩個 subset，使得它們的總和相等。

題目連結 🔗：[https://leetcode.com/problems/partition-equal-subset-sum/](https://leetcode.com/problems/partition-equal-subset-sum/)

### **問題分析**

這題如果暴力解的話，每一個數字都會有兩個 actions - 「選 / 不選」，如果利用 dfs 將每一個數字的兩個 actions 都走過，看看能不能剛好組成 `sum/2`，那 time complexity 就是 O(2^n)，所以我們肯定要想辦法優化。

在這個暴力解的過程中，很多 state 都是會重複計算的，例如說 `sum/2 = 11`，這是我們的 target，那這條 trajectory 上如果已經放了 [1, 4]，那我們就是剩下 6 的空間可以放，後面的 dfs 會繼續一直更新這個「剩下的空間」，但這樣可能會重複計算到很多一樣的狀況，所以我們要建一個表出來，也就是「當空間剩 w 時，數字 num 應不應該放入」，這就是最經典的 0/1 Knapsack Problem。

### **解題思路 - 0/1 Knapsack Problem**

整題可以被理解為，我的總限重是 (sum/2)，nums[i] 是所有我可以放入的物品重量，請問能不能剛剛好放到滿？也就是說我只要看我怎麼放可以讓背包裡的重量最重但又不超過 (sum/2)，如果剛好可以放 (sum/2) 那就 return `true`。

那再來就很簡單了，dp[i][j] 代表「在限重為 i 的空間中，前 j 個物品可以放的最大重量」，以 `nums = [1,5,11,5]` 舉例，我們的 (sum/2) 是 11，所以 DP Table 長這樣：

![DP](/images/leetcode/leetcode-416/initial.jpg)

第 1 個 row 是 1，在限重 >= 1 的空間中他都可以放，所以這樣填：

![DP](/images/leetcode/leetcode-416/first-row.jpg)

第二排開始， dp 轉換式為 

```cpp
dp[i][j] = max(dp[i-1][j], dp[i-1][j-nums[i]]+nums[i]);
```

`dp[i-1][j]` 代表這個 item 沒有放的話這個空間最大的重量，`dp[i-1][j-weight]+nums[i]` 代表如果放了的話這個空間最大的重量，兩個取比較大的填入，所以會像這樣：

![DP](/images/leetcode/leetcode-416/update.jpg)

最後判斷右下角那格是不是 11 就行了，是 11 的話表示他可以達成我們的 target `(sum/2)`，那就 return `true`。

**Time Complexity** - `O( n x target )`，n 是 nums.size()，target 是 sum/2<br>
**Space Complexity** - `O( n x target )`

#### **Implementation**

```cpp
bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2 == 1) return false;
    int target = total / 2;
    
    vector<vector<int>>dp(nums.size(), vector<int>(target+1, 0));
    for(int j=nums[0]; j<dp[0].size(); j++){
        dp[0][j] = nums[0];
    }
    for(int i=1; i<dp.size(); i++){
        for(int j=0; j<dp[0].size(); j++){
            int weight = nums[i];
            if(j-weight<0) dp[i][j] = dp[i-1][j];
            else dp[i][j] = max(dp[i-1][j], dp[i-1][j-weight]+weight);
        }
    }

    return true ? (dp[nums.size()-1][target] == target) : false;
}
```

### **空間優化**

0/1 Knapsack Problem 中，2D Array 都只會用到兩個 rows，所以我們只需要宣告 1D Array 的 `dp` 就足夠了，直接附上解法。

**Time Complexity** - `O( n x target )`，n 是 nums.size()，target 是 sum/2<br>
**Space Complexity** - `O( n )`

#### **Implementation**

```cpp
bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2 == 1) return false;
    int target = total / 2;

    vector<int>dp(target+1, 0);
    for(int i=0; i<nums.size(); i++){
        for(int j=target; j>=nums[i]; j--){
            dp[j] = max(dp[j], dp[j-nums[i]]+nums[i]);
        }
    }
    return true ? (dp[target] == target) : false;
}
```

### **不一樣的思路 - 極致優化**

但這題是問 true/false，他其實沒有要我們算最大重量，我們可以將 dp[i][j] 的意義轉成「前 i 個數字總和，是不是可以組成數字 j」的 bool，如果 `dp[i-1][j]` 或是 `dp[i-1][j-nums[i]]` 其中一個是 true，表示 dp[i][j] 一定是 true，這個數字 i 一定會有 action ( 要嘛放要嘛不放 ) 是可以讓總重剛好變成 j，所以 dp 轉換式就是

```cpp
dp[j] = dp[j] || dp[j - num];
```

**Time Complexity** - `O( n x target )`，n 是 nums.size()，target 是 sum/2<br>
**Space Complexity** - `O( n )`

#### **Implementation**

```cpp
bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2 == 1) return false;
    int target = total / 2;

    vector<bool> dp(target + 1, false);
    dp[0] = true;

    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }

    return dp[target];
}
```