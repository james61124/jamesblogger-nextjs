---
title: "[ Leetcode 1343 ] Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold | 解題思路分享"
date: "2025-03-03"
author: James
tags: Array,Sliding Window
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個整數 array `nums`，還有兩個數 k 和 threshold，找出長度為 k 且平均值大於或等於 threshold 的 subarray 數量。

題目連結🔗：[https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/](https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/)

### **問題分析**

目標是要找到所有符合條件的 subarray，所以表示我們必須檢查每一個長度為 k 的 subarray。

### **暴力解法 (Brute Force)**

最直覺就是列舉出所有長度為 k 的 subarray，但這樣每計算一個 subarray，就要再跑一個迴圈計算這個 subarray 的 sum，假設 `nums` 長度是 N，這樣整個過程的時間複雜度就是 `O(Nxk)`，所以我們必須解決重複計算的問題。

### **解題思路 - Fix Length Sliding Window**

我們如果使用 Fix Length Sliding Window 就可以完美解決重複計算的問題，宣告兩個指標 left 和 right，中間的部分就是我們要計算的 subarray，每一次在計算新的 subarray 就只需要減掉 left 再加上新的 right 即可，這樣我們 `O(1)` 就能更新 windowSum，不用重新計算整個區間。

**Time Complexity** - `O(n)`，每個元素最多被 right 掃過。<br>
**Space Complexity** - `O(1)`，只使用了兩個指針。

### **Implementation**

```cpp
int numOfSubarrays(vector<int>& arr, int k, int threshold) {
    int left = 0;
    int right = 0;
    int numOfSubarrays = 0;
    int sum = 0;
    int target = threshold*k;

    while(right<arr.size()){
        sum += arr[right];
        if(right-left+1 == k){
            if(sum >= target) numOfSubarrays++;
            sum -= arr[left];
            left++;
        }
        right++;
    }
    return numOfSubarrays;
}
```