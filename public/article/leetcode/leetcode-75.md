---
title: "[ Leetcode 75 ] Sort Colors | 解題思路分享"
date: "2025-09-10"
author: James
tags: Array,Two Pointers,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: c9953a2f-65d5-4b0a-a656-a61eb51d6a55
---

給一個 nums[i]，裡面只會出現 0, 1, 2 三種數字，輸出 sort 後的結果

題目連結 🔗：[https://leetcode.com/problems/sort-colors/](https://leetcode.com/problems/sort-colors/)

## 問題分析

這題的目標是要想一個 O(n) 而且不用到任何 extra space 的方法，如果簡單使用 quick sort，那就會是 O(nlogn)，因此關鍵在於如何利用「nums[i] 裡面只包含三種數字」這個訊息來解決問題。

## 解題思路 - Dutch National Flag Algorithm

因為只有三種數字，所以可以把最小的丟到最前面，最大的丟到最後面，那這其實就是 two pointers，指針慢慢往內收攏即可。

```cpp
void sortColors(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;

    for(int i = 0; i <= right; i++) {
        if(nums[i] == 0){
            swap(nums[i], nums[left]);
            left++;
        } else if(nums[i] == 2){
            swap(nums[i], nums[right]);
            right--;
        }
    }
}
```

不過這樣做會遇到一個小問題，當 right pointer 的東西被換來 `i` 的位置後，如果沒有進行處理就直接往下看，他就會永遠被留在那，所以要先把它看完之後才能往下走，因此需要小修改一下

```cpp
void sortColors(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;

    for(int i = 0; i <= right; i++) {
        if(nums[i] == 0){
            swap(nums[i], nums[left]);
            left++;
        } else if(nums[i] == 2){
            swap(nums[i], nums[right]);
            right--;
            i--; // 把這個數字看完再往下
        }
    }
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
void sortColors(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;

    for(int i = 0; i <= right; i++) {
        if(nums[i] == 0){
            swap(nums[i], nums[left]);
            left++;
        } else if(nums[i] == 2){
            swap(nums[i], nums[right]);
            right--;
            i--;
        }
    }
}
```