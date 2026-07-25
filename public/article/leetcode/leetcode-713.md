---
title: "[ Leetcode 713 ] Subarray Product Less Than K | 解題思路分享"
date: "2025-03-05"
author: James
tags: Array,Sliding Window
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
id: 21e9200e-253b-45fa-bd5a-dfcaae745dae
---

給一個正整數 array `nums` 和一個正整數 `k`，找出乘積小於 `k` 的 subarray 數量。

題目連結 🔗：[https://leetcode.com/problems/subarray-product-less-than-k/](https://leetcode.com/problems/subarray-product-less-than-k/)

### **問題分析**

這題我看到有限制條件但大小不固定的 subarray 就先往 variable-size sliding window 想，所以要思考的是 left 跟 right 要怎麼移動才不會有遺漏的 subarray 沒有被看到。

### **解題思路 - Variable-Size Sliding Window**

用 Sliding Window 的話就要思考 right 在 iterate 的時候，left 要在什麼情況下移動。我們需要：

1. `left`, `right` 來標記 sliding window 的範圍
2. `currentProduct` 儲存 subarray 的 product
3. `result` 儲存符合條件的 subarray 數量。

#### **Left Pointer 的移動**

`right` 每 iterate 一個 element，就把 product 乘進去 `currentProduct` 這個沒有問題，所以當 `currentProduct >= k` 時，`left` 就要用 while loop 收縮進來，然後把 `nums[left]` 從 `currentProduct` 裡除掉，直到 `currentProduct < k` 才繼續 iterate `right`。

#### **避免 left 超過 right**

但是如果 Sliding Window 內只有一個 element，也就是 `left == right`，這個時候 currentProduct 還是 >= k 時，沒有處理的話 left 就會一直往右走最後超過 right，所以 left 在 while loop 收縮時要多設一個 condition - `left < right` 讓 left 不能超過 right。

#### **如何正確計算符合條件的 subarray 數量 ?**

最關鍵的思路在這裡，result 不能每一次都只加一，如果現在的 Sliding Window 是 [4, 5, 8]，k = 200，代表 Sliding Window 內以 nums[right] 為結尾的的 subarray 的 product 都會 <= k，所以這些都應該被計算進去，也就是我們必須把 result 加上 Sliding Window 的 Size（[8], [5, 8], [4, 5, 8]），因為這些組合在 right 右移的時候有一些就會看不到了。

所以如果 Sliding Window 內只有一個 element，currentProduct 還是 >= k，那 result 就不能增加，要繼續 iterate。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int numSubarrayProductLessThanK(vector<int>& nums, int k) {
    int left = 0;
    int right = 0;
    int currentProduct = 1;
    int res = 0;

    while(right < nums.size()){
        currentProduct *= nums[right];
        while(currentProduct >= k && left<right){
            currentProduct /= nums[left];
            left++;
        }
        if(currentProduct < k) res += (right-left+1);
        right++;
    }
    return res;
}
```