---
title: "[ Leetcode 2654 ] Minimum Number of Operations to Make All Array Elements Equal to 1 | 解題思路分享"
date: "2025-11-21"
author: James
tags: Array,Math,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
---

給一個 nums[i]，一個 operation 可以將 nums[i], nums[i + 1] 其中一個數字轉成 gcd(nums[i], nums[i + 1])，要回傳最小可以讓所有數字都變成 1 的 operations 數量

題目連結 🔗：[https://leetcode.com/problems/minimum-number-of-operations-to-make-all-array-elements-equal-to-1/](https://leetcode.com/problems/minimum-number-of-operations-to-make-all-array-elements-equal-to-1/)

### **問題分析**

這題很數學，首先最小的 operations 會出現在當 array 中有第一個 1 出現的時候，他就會像感染一樣將身邊所有數字都「感染」成 1，簡單來說，如果我用了 k 個 operations 讓 array 中出現第一個 1，那最小的 operations 數量就是 k + n - 1，利用這個概念就可以解完整題了

### **解題思路 - Math**

首先 array 中有可能已經先有 1，那最小 operations 數量就是這些 1 去「感染」出來的

```cpp
int n = nums.size();

int ones = 0;
for (int x : nums) {
    if (x == 1) ones++;
}

if (ones > 0) {
    return n - ones;
}
```

如果一開始沒有 1，那我們就要先變出第一個 1，因為每次更新都只能更新相鄰的數字，所以我們就模仿這個過程，用 n^2 的時間更新，要想辦法找到「最短的可以變出 1 的 subarray」

```cpp
int minSpan = INT_MAX;

for (int i = 0; i < n; ++i) {
    int g = nums[i];
    for (int j = i + 1; j < n; ++j) {
        g = std::gcd(g, nums[j]);
        if (g == 1) {
            minSpan = min(minSpan, j - i);
            break;
        }
    }
}
```

最後將最終答案回傳即可

```cpp
if (minSpan == INT_MAX) return -1;
return minSpan + n - 1;
```

**Time Complexity** - `O(n^2 * logA)`，A 是 max(nums)<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int minOperations(vector<int>& nums) {
    int n = nums.size();

    int ones = 0;
    for (int x : nums) {
        if (x == 1) ones++;
    }

    if (ones > 0) {
        return n - ones;
    }

    int minSpan = INT_MAX;

    for (int i = 0; i < n; ++i) {
        int g = nums[i];
        for (int j = i + 1; j < n; ++j) {
            g = std::gcd(g, nums[j]);
            if (g == 1) {
                minSpan = min(minSpan, j - i);
                break;
            }
        }
    }

    if (minSpan == INT_MAX) return -1;
    return minSpan + n - 1;
}
```
