---
title: "[ Algorithm ] Sliding Window | 核心概念與 Leetcode 題型解析"
date: "2025-03-05"
author: James
tags: Algorithm,Sliding Window
image: /images/program/algorithm.jpg
description: "Sliding Window 就是利用 left 和 right 兩個指標來維持一個動態區間 ( window )，透過移動這個 window 來減少重複運算，主要用在處理 subarray 或是 substring 之類的問題。"
readTime: 2
---

Sliding Window 就是利用 left 和 right 兩個指標來維持一個動態區間 ( window )，透過移動這個 window 來減少重複運算，主要用在處理 subarray 或是 substring 之類的問題。

Sliding Window 分成兩種 :
1. Fixed-Size Sliding Window
2. Variable-Size Sliding Window。

### **Fixed-Size Sliding Window**

- 適用於題目要求固定長度的 subarray 或是 substring
- 每次 window 向右滑動一格，去掉 left 舊 item，加入 right 的新 item

#### **範例**

[[ Leetcode 1343 ] Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-1343/)

#### **Template**

```cpp
int slidingWindow(vector<int>& arr, ...) {

    int left = 0;
    int right = 0;

    while( right < arr.size() ){
        
        // arr[right] push into the window

        if( right - left + 1 >= window_size ){

            // arr[left] pop out of the window

            left++;
        }
        right++;
    }
    return ...;
}
```

### **Variable-Size Sliding Window**

- 適用於題目說滿足某條件的最小 / 最大 subarray 或是 substring
- left 跟 right 會動態調整

#### **範例**

[[ Leetcode 3 ] Longest Substring Without Repeating Characters | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-3/)<br>
[[ Leetcode 209 ] Minimum Size Subarray Sum | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-209/)<br>
[[ Leetcode 713 ] Subarray Product Less Than K | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-713/)

#### **Template**

```cpp
int slidingWindow(vector<int>& arr, ...) {

    int left = 0;
    int right = 0;

    while( right < arr.size() ){
        
        // arr[right] push into the window

        while( sliding window needs to shrink ){

            // arr[left] pop out of the window

            left++;
        }
        right++;
    }
    return ...;
}
```