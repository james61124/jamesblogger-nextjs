---
title: "[ Leetcode 31 ] Next Permutation | 解題思路分享"
date: "2025-12-01"
author: James
tags: Array,Two Pointers,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: 5cc734d4-4c35-49f4-b114-aa9cf0d8df05
---

給 nums[i]，回傳 next permutation，只能 in-place 做

題目連結🔗：[https://leetcode.com/problems/next-permutation/](https://leetcode.com/problems/next-permutation/)

## 題目分析

這題需要來分析一下規律，簡單分成幾種狀況

第一種，nums = [1, 2, 3, 4, 5]，next permutation = [1, 2, 3, 5, 4]，簡單來說，只要最尾端兩個數字是 increasing，那就要 swap 最尾端兩個數字，像是 nums = [3, 2, 1, 4, 5]，next permutation 就是 [3, 2, 1, 5, 4]

第二種，nums = [5, 4, 3, 2, 1]，這種整條都是 decreasing 的表示這個 cycle 結束了，所以需要回到第一種狀態，所以 next permutation = [1, 2, 3, 4, 5]，也就是整條都 reverse

第三種，也是最 general 的狀況，假設 nums = [1, 3, 5, 4, 2]，我們把整條數列分成兩部分 (...) + (pivot) + (decreasing part)，這個範例的 next permutation = [1, 4, 2, 3, 5]，我直接講結論，pivot 會變成「decreasing part 中比 pivot 大的最小的數字」，(...) 這個區域不會動，而 decreasing part 把 pivot 換進來之後整條會 reverse 成 increasing，大概就是這三種狀況

## 解題思路

所以這題的關鍵是我們要找到「pivot 的下一個 index」，也就是 decreasing part 開始的 index，這邊先用 `i` 來表示

```cpp
void nextPermutation(vector<int>& nums) {
    int n = nums.size();
    int i = n - 1;
    int j = 0;

    while(i > 0){
        if(nums[i - 1] < nums[i]) break;
        i--;
    }

    // ...
}
```

再來我們要找到「decreasing part 中比 pivot 大的最小的數字」，這題可以線性搜索找，也可以用 binary search，對整體的 time complexity 沒有什麼影響，我這邊選擇用 binary search

```cpp
int binarySearch(vector<int>& nums, int target, int left, int right){
    while(right >= left){
        int mid = left + (right - left) / 2;
        if(nums[mid] <= target) right = mid - 1;
        else left = mid + 1;
    }
    return right;
}

void nextPermutation(vector<int>& nums) {
    int n = nums.size();
    int i = n - 1;
    int j = 0;

    while(i > 0){
        if(nums[i - 1] < nums[i]) break;
        i--;
    }

    if(i > 0){
        j = binarySearch(nums, nums[i - 1], i, n - 1);
        swap(nums[i - 1], nums[j]);
    }

    // ...
}
```

最後要 reverse decreasing part

```cpp
int binarySearch(vector<int>& nums, int target, int left, int right){
    while(right >= left){
        int mid = left + (right - left) / 2;
        if(nums[mid] <= target) right = mid - 1;
        else left = mid + 1;
    }
    return right;
}

void nextPermutation(vector<int>& nums) {
    int n = nums.size();
    int i = n - 1;
    int j = 0;

    while(i > 0){
        if(nums[i - 1] < nums[i]) break;
        i--;
    }

    if(i > 0){
        j = binarySearch(nums, nums[i - 1], i, n - 1);
        swap(nums[i - 1], nums[j]);
    }

    reverse(nums.begin() + i, nums.end());
}
```

寫到這裡會發現，當 i == n - 1 的時候表示最後面是 increasing 的，所以算出來的 j 會是 n - 1，那剛好就可以把最後面兩位數交換，而當 i == 0，表示整條都是 decreasing，那就不會進中間 swap 的 function 了，這樣寫就非常清楚明瞭

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
int binarySearch(vector<int>& nums, int target, int left, int right){
    while(right >= left){
        int mid = left + (right - left) / 2;
        if(nums[mid] <= target) right = mid - 1;
        else left = mid + 1;
    }
    return right;
}

void nextPermutation(vector<int>& nums) {
    int n = nums.size();
    int i = n - 1;
    int j = 0;

    while(i > 0){
        if(nums[i - 1] < nums[i]) break;
        i--;
    }

    if(i > 0){
        j = binarySearch(nums, nums[i - 1], i, n - 1);
        swap(nums[i - 1], nums[j]);
    }

    reverse(nums.begin() + i, nums.end());
}
```