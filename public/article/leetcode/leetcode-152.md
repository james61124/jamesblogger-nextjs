---
title: "[ Leetcode 152 ] Maximum Product Subarray| 解題思路分享"
date: "2025-04-10"
author: James
tags: Array,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個整數 array，return 乘積最大的 subarray 的乘積。

題目連結🔗：[https://leetcode.com/problems/maximum-product-subarray/](https://leetcode.com/problems/maximum-product-subarray/)

### **問題分析**

這題看到滿足某某條件的 subarray，先往 two pointers 想，但是因為不是 sorted array，所以沒有辦法控制 left, right 來取得限制條件，所以判斷有可能是 DP，從 DP 想想看。

### **解題思路 - DP**

如果是 DP 的話，我們會需要一個 dp[i] 代表「以 nums[i] 為結尾的 maximum product subarray 的 product」，所以 iterate 完所有 i，我們就已經把所有 subarray 的組合看過，最後答案就是取 dp[i] 裡最大的，也就是 max(dp)。

Transition Function 其實很直覺，`dp[i] = max(nums[i], dp[i-1] * nums[i])`，因為 dp[i] 代表一定要包含 nums[i] 的 subarray，所以要嘛就是只有自己，要嘛就是「以 nums[i-1] 為結尾的 subarray」* nums[i]，但這裡遇到了這題最關鍵的地方，就是 nums[i] 本身會會有負數的狀況，所以 `dp[i-1] * nums[i]` 不一定會是最大的，舉例來說：

```
nums=[-3, 4, -5]

dp[0] = -3
dp[1] = max(4, (-3)*4) = 4
```

dp[2] 如果用 max(-5, 4*(-5)) 這樣就錯了，因為 dp[2] 實際上是 `(-3)*4*(-5)`，會負負得正，因此我們需要改一下 Transition Function，我們需要維護一個新的陣列 minNum[i] 儲存「以 nums[i] 為結尾的 minimum product subarray 的 product」，當 nums[i] 為負數的時候，我們要比較的不是 dp[i-1]，而是 minNum[i-1]，因為負數乘越小的值才會越乘越大。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
int maxProduct(vector<int>& nums) {
    vector<int>dp(nums.size(), 0);
    vector<int>minNum(nums.size(), 0);
    int result = nums[0];

    dp[0] = nums[0];
    minNum[0] = nums[0];
    for(int i=1; i<nums.size(); i++){
        if(nums[i]<0){
            dp[i] = max(nums[i], minNum[i-1]*nums[i]);
            minNum[i] = min(nums[i], dp[i-1]*nums[i]);
        } else {
            dp[i] = max(nums[i], dp[i-1]*nums[i]);
            minNum[i] = min(nums[i], minNum[i-1]*nums[i]);
        }
        result = max(result, dp[i]);
    }

    return result;
}
```

### **空間優化**

我們會發現在這些 dp 的 array 中，我們同時都只需要關注 i 及 i-1 的格子，甚至因為 i 的 value 是從 i-1 來的，所以我們其實算是只在關注 i-1 的 value，我們只需要一個 integer 的空間就好了，不需要整個 dp array。

dp[i-1] 直接用 curMax 表示，我們需要更新 dp[i] 就直接更新 curMax。

```cpp
curMax = max(nums[i], curMax * nums[i]);
```

minNum[i] 用 curMin 表示，也是一樣意思，再來當 nums[i] 為負數時，因為我們要乘的是最小值，所以把 curMax 跟 curMin swap 就可以了，這樣寫會非常簡潔。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int maxProduct(vector<int>& nums) {
    int curMax = nums[0];
    int curMin = nums[0];
    int result = nums[0];

    for(int i=1; i<nums.size(); i++){
        if(nums[i]<0) swap(curMax, curMin);

        curMax = max(nums[i], curMax * nums[i]);
        curMin = min(nums[i], curMin * nums[i]);
        result = max(result, curMax);
    }

    return result;
}
```