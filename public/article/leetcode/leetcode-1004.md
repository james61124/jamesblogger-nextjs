---
title: "[ Leetcode 1004 ] Max Consecutive Ones III | 解題思路分享"
date: "2025-03-11"
author: James
tags: Array,Sliding Window,Amazon
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 282a59a2-e7b7-489b-a36c-13ca6e7bb399
---

給 nums[i] 跟 k，其中 nums[i] 裡面只有 0 or 1，回傳如果最多只能將 0 -> 1 k 次，回傳最長的 subarray with 1's 的長度

題目連結 🔗：[https://leetcode.com/problems/max-consecutive-ones-iii/](https://leetcode.com/problems/max-consecutive-ones-iii/)

## 問題分析

我們可以利用 two pointers 維護一個 sliding window，其中 window 內代表「有可能全部都是 1」的 subarray，也就是說如果 right pointers 再繼續走會發現沒辦法再繼續將 0 -> 1 了因為次數不夠，那 left pointer 就縮進來直到次數夠用，這樣就只需要 O(n) 就可以解完整題

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
int longestOnes(vector<int>& nums, int k) {
    int n = nums.size();
    int left = 0;
    int right = 0;
    int result = 0;
    while(right < n){
        if(nums[right] == 0){
            k--;
        }

        while(k < 0){
            if(nums[left] == 0){
                k++;
            }
            left++;
        }
        result = max(result, right - left + 1);
        right++;
    }

    return result;
}
```
