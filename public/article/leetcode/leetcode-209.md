---
title: "[ Leetcode 209 ] Minimum Size Subarray Sum | 解題思路分享"
date: "2025-03-08"
author: James
tags: Array,Sliding Window,Binary Search,Prefix Sum
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: 67fa559a-4884-4a01-8703-aae4ceb434c1
---

給定一個正整數陣列 nums 和一個目標數 target，找出最短的連續子陣列，使得其數字總和大於或等於 target。如果沒有符合條件的子陣列，則回傳 0。

題目連結 🔗：[https://leetcode.com/problems/minimum-size-subarray-sum/](https://leetcode.com/problems/minimum-size-subarray-sum/)

### **方法一 - Sliding Window**

這題可以用 Sliding Window 解，因為題目要求的是最短的 subarray，而且數字都是正整數，表示如果 subarray 總和已經大於 target，看再多數字只會讓 subarray 變長但沒有意義，所以就可以利用 two pointer 來調整 subarray 範圍。

**Time Complexity** - `O(n)`，每個元素最多被 right 指標掃過一次，left 也最多移動 n 次，所以是線性時間。<br>
**Space Complexity** - `O(1)`，只使用了變數來存儲結果。

#### **Step 1**

使用兩個指標 left 和 right 來表示當前的 subarray 範圍：

- right 向右擴展，累加總和 sum，直到 sum >= target。
- 當 sum >= target，我們開始收縮 left，看看能否找到更短的 subarray。

#### **Step 2**

當總和 sum >= target 時：

- 記錄當前子陣列的長度 right - left + 1。
- 嘗試將 left 向右移動（縮小窗口），看看是否仍然滿足 sum >= target。

#### **Step 3**

重複這個過程，直到 right 掃過整個陣列。

### **Implementation**

```cpp
int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0, sum = 0;

    // Initialize minLength with the maximum possible value
    int minLength = INT_MAX;

    for (int right = 0; right < nums.size(); right++) {
        sum += nums[right];
        
        while (sum >= target) {
            minLength = min(minLength, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }

    return (minLength == INT_MAX) ? 0 : minLength;
}
```

### **方法二 - Binary Search + Prefix Sum**

這題也可以利用累積前綴和來加速計算子陣列的總和，並用 Binary Search 快速找到符合條件的 subarray，雖然拿來解這題會比較慢，但 prefix sum 還是滿值得學習一下的。

**Time Complexity** - `O(nlogn)`，遍歷 nums 一次 `O(n)`，每次用 Binary Search 找 j `O(logn)`<br>
**Space Complexity** - `O(n)`，需要一個 prefix sum 陣列

#### **Step 1**

建立 Prefix Sum 陣列，透過一個 prefix[i] 來記錄 nums[0] 到 nums[i] 的總和，這樣就可以用 `prefix[j] - prefix[i] + nums[i]` 來快速計算 nums[i] ~ nums[j] 的區間總和。

#### **Step 2**

用 Binary Search 找符合條件的最小長度，對於每個 i，我們希望找到最小的 j ( i < j )，使得 `prefix[j] >= target + prefix[i] - nums[i]` ( 因為我們的目標是 nums[i] ~ nums[j] 的區間總和要 >= target )，所以透過 Binary Search 就可以快速找到 j 的位置，從而計算子陣列的長度 `j - i + 1`。

### **Implementation**

```cpp
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size()-1;
    while(left <= right) {
        int mid = left + (right - left)/2;
        if( target < arr[mid] ) right = mid -1;
        else if( target > arr[mid] ) left = mid + 1;
        else return mid;
    }
    return left;
}

int minSubArrayLen(int target, vector<int>& nums) {
    int minLength = INT_MAX;
    vector<int>prefix(nums.size(), 0);
    prefix[0] = nums[0];
    for(int i=1; i<nums.size(); i++) {
        prefix[i] = prefix[i-1] + nums[i];
    }

    for(int i=0; i<nums.size(); i++){
        int index = binarySearch(prefix, target + prefix[i] - nums[i]);
        if(index != prefix.size()) minLength = min(index - i + 1, minLength);
    }
    return (minLength == INT_MAX) ? 0 : minLength;
}
```