---
title: "[ Leetcode 215 ] Kth Largest Element in an Array | 解題思路分享"
date: "2025-05-06"
author: James
tags: Quick Select,Priority Queue
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 unsorted array，找出第 k 大的數。

題目連結 🔗：[https://leetcode.com/problems/kth-largest-element-in-an-array/](https://leetcode.com/problems/kth-largest-element-in-an-array/)

### **解題思路一 - Priority Queue**

這題最直覺的解應該就是 sorting 完直接找到第 k 大的數，所以只要找到一種會排序的 STL 就可以了，那這邊直接用 priority queue 實作一個。

**Time Complexity** - `O(nlogn)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int> pq;

    for(int num : nums) pq.push(num);
    for(int i=0; i<k-1; i++) pq.pop();

    return pq.top();
}
```

### **解題思路二 - Quick Select**

但其實遇到這種「找到第 k 大 / 第 k 小」的題目，可以直接使用 Quick Select 來解，這邊直接附上 Quick Select 的詳細介紹：

[[ Algorithm ] Quick Select | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/quick-select)

看完了這題其實也就解完了，因此直接看實作吧！

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int medianOfThree(vector<int>& nums, int left, int right) {
    int mid = left + (right - left) / 2;
    if (nums[right] < nums[left]) swap(nums[right], nums[left]);
    if (nums[mid] < nums[left]) swap(nums[mid], nums[left]);
    if (nums[right] < nums[mid]) swap(nums[right], nums[mid]);
    return mid;
}

int partition(vector<int>& nums, int left, int right) {
    int pivotIndex = medianOfThree(nums, left, right);
    int pivot = nums[pivotIndex], l = left + 1, r = right;
    swap(nums[pivotIndex], nums[left]);
    
    while (l <= r) {
        if (nums[l] < pivot && nums[r] > pivot) {
            swap(nums[l++], nums[r--]);
        }
        if (nums[l] >= pivot) {
            l++;
        }
        if (nums[r] <= pivot) {
            r--;
        }
    }
    swap(nums[left], nums[r]);
    return r;
}

int quickSelect(vector<int>& nums, int left, int right, int k) {
    if (left == right) return nums[left];

    int pivotIndex = partition(nums, left, right);

    if (k == pivotIndex) return nums[k];
    else if (k < pivotIndex) return quickSelect(nums, left, pivotIndex - 1, k);
    else return quickSelect(nums, pivotIndex + 1, right, k);
}

int findKthLargest(vector<int>& nums, int k) {
    return quickSelect(nums, 0, nums.size() - 1, k - 1);
}
```