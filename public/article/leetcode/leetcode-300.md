---
title: "[ Leetcode 300 ] Longest Increasing Subsequence | 解題思路分享"
date: "2025-01-29"
author: James
tags: DP,Array,Binary Search,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: 9a7a3732-093a-41a7-b7ca-81bf30dce537
---

在一個給定的 array 中，找出一個長度最長的遞增的 subarray，這個 subarray 中的 element 必須是按順序排列，但並不要求它們在原本的 array 中的位置是連續的。

題目連結 🔗：[https://leetcode.com/problems/longest-increasing-subsequence/](https://leetcode.com/problems/longest-increasing-subsequence/)

### **方法一 - Dynamic Programming**

**Time Complexity** - `O(n^2)`，兩層迴圈<br>
**Space Complexity** - `O(n)`，需要一個大小為 n 的 dp 陣列

#### **Step 1**

建立一個 dp 陣列，其中 dp[i] 代表 以 nums[i] 為結尾的 LIS 長度

#### **Step 2**

一開始，每個數字本身都是一個長度為 1 的 LIS，因此所有 dp[i] 初始值設為 1。

#### **Step 3**

對於每個數 nums[i]，檢查它前面的所有數 nums[j]（j < i）：
- 如果 nums[j] < nums[i]，表示 nums[i] 可以接在 nums[j] 後面，組成更長的 LIS。
- 此時更新 dp[i] = max(dp[i], dp[j] + 1)，意思是讓 dp[i] 變成 接在 nums[j] 之後的 LIS 長度，但如果 dp[i] 本來就比較大，就不用改變。

#### **Step 4**

最後，dp 陣列中的最大值就是 LIS 的長度。

### **Implementation**

```cpp
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int>dp(n, 1);
    for(int i=1; i<n; i++) {
        for(int j=0; j<i; j++) {
            if(nums[i]>nums[j]){
                dp[i] = max(dp[j]+1, dp[i]);
            }
        }
    }
    return *max_element(dp.begin(), dp.end());
}
```

### **方法二 - Binary Search + Greedy**

**Time Complexity** - `O(nlogn)`，迴圈跑 `O(n)`，binary search 跑 `O(logn)`<br>
**Space Complexity** - `O(n)`，需要一個大小為 n 的 tails 陣列

#### **Step 1**

建立一個 tails 陣列，其中 tails[i] 儲存的是長度為 i+1 的 LIS 最小的結尾元素

#### **Step 2**

對於 nums 中的每個元素，我們使用 Binary Search 在 tails 陣列中找到適當的位置插入：
- 如果這個數字比 tails 裡的所有數字都大，就直接加到 tails 的最後面，這樣 tails 的長度就會加一，表示目前的 LIS 長度會加一
- 否則，找到 tails 中第一個大於或等於它的數字，並用它來替換，這表示目前 LIS 的長度還沒有變長，但是讓 tails 保持最小化，為未來的 LIS 留空間擴展。

#### **Step 3**

最後，tails 的長度就是 LIS 的長度。但 tails 並不是 LIS 本身，而是用來記錄可能構成 LIS 的最小元素，這樣能夠確保後續的數字能接上來，從而得到更長的 LIS。

#### **舉例說明**

假設 nums = [1, 4, 8, 9, 5, 6, 7]，處理完 index = 3 時， tails = [1, 4, 8, 9]。

- 處理到 nums[4] 時，用 nums[4] ( value = 5 ) 替換 tails 裡的 8，讓 tails 變成 [1, 4, 5, 9]。
- 處理到 nums[5] 時，tails = [1, 4, 5, 6]。
- 處理到 nums[6] 時，tails = [1, 4, 5, 6, 7]。

所以，LIS = 5

### **Implementation**

```cpp
int binarySearch(vector<int>& arr, int key) {
    int left = 0, right = arr.size()-1;
    while(left <= right) {
        int mid = left + (right - left)/2;
        if(key < arr[mid]) right = mid - 1;
        else if(key > arr[mid]) left = mid + 1;
        else return mid;
    }

    // returns the index where 'key' should be inserted to maintain sorted order
    return left; 
}

int lengthOfLIS(vector<int>& nums) {
    vector<int>tails;
    for(int i=0; i<nums.size(); i++){
        int index = binarySearch(tails, nums[i]);
        if(index == tails.size()) {
            // 'key' is greater than all elements in tails.
            tails.push_back(nums[i]); 
        }
        else tails[index] = nums[i];
    }
    return tails.size();
}
```

### **Binary Search 過程解析**

為什麼 Binary Search 的最後是 return left？因為當 while(left <= right) 退出時：
- 如果 key 在 arr 裡面，則我們就 return mid
- 如果 key 不在 arr，那麼 left 會停在「第一個大於等於 key 的 index」，這正是我們要插入 key 的位置