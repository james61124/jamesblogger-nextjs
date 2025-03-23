---
title: "[ Leetcode 718 ] Maximum Length of Repeated Subarray | 解題思路分享"
date: "2025-03-01"
author: James
tags: Array,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給定兩個整數陣列 nums1 和 nums2，找出它們中長度最長的「連續」相同子陣列（subarray）的長度。

⚠️ 注意：

子陣列（subarray） 必須是 連續的，不像子序列（subsequence）可以不連續。
如果沒有相同的子陣列，則回傳 0。

題目連結 🔗：[https://leetcode.com/problems/maximum-length-of-repeated-subarray/](https://leetcode.com/problems/maximum-length-of-repeated-subarray/)

### **解題思路 - DP (Double-Sequence Linear DP Problem)**

這題可以透過 Double-Sequence Linear DP 來解，因為他的輸入是兩條 array，所以我們就開一個 dp[i+1][j+1] 來代表以 nums1[i] 為結尾及以 nums2[j] 為結尾的最長 repeated subarray 長度。

![DP](/images/leetcode/leetcode-718/dp-table.jpg)

用這張圖來看就很清楚，雙層迴圈 iterate 兩個 array，如果兩個 char 不一樣 ( 最左邊那張圖 )，那就直接填 0，如果一樣 ( 中間跟右邊的圖 )，那目前 repeated subarray 的長度就是左上角那格 + 1，意思就是拿掉這兩個 char 的狀態下的 subarray 長度 + 1，最後整個 dp table 最大的數值就是 maximum length of repeated subarray。

```cpp
if(nums1[i]==nums2[j]){
    dp[i+1][j+1] = dp[i][j] + 1;
} else {
    dp[i+1][j+1] = 0;
}
```

**Time Complexity** - `O( m × n )`，因為 iterate 過兩個 array<br>
**Space Complexity** - `O( m × n )`，因為開了一個 m x n 的 2D array

#### **Implementation**

```cpp
int findLength(vector<int>& nums1, vector<int>& nums2) {
    vector<vector<int>>dp(nums1.size()+1, vector<int>(nums2.size()+1));
    int maxLength = 0;

    for(int i=0; i<nums1.size(); i++){
        for(int j=0; j<nums2.size(); j++){
            if(nums1[i]==nums2[j]){
                dp[i+1][j+1] = dp[i][j] + 1;
            } else {
                dp[i+1][j+1] = 0;
            }
            maxLength = max(dp[i+1][j+1], maxLength);
        }
    }
    return maxLength;
}
```

### **空間優化**

以上是正常的 dp 建表，但是我們其實只需要 dp 裡面的兩個 row 就可以了，不用把整個 dp 的 table 都建出來，新建兩個 1D Array `prev`, `cur`，當更新完一條 row 之後就 swap 兩個 array 讓 `cur` 跑到 `prev` 然後繼續往下更新，所以就可以將空間優化為 O(min(m,n))。

**Time Complexity** - `O( m × n )`，因為 iterate 過兩個 array<br>
**Space Complexity** - `O( min(m, n) )`

```cpp
int findLength(vector<int>& nums1, vector<int>& nums2) {

    vector<int>prev(nums2.size()+1, 0);
    vector<int>cur(nums2.size()+1, 0);
    int maxLength = 0;

    for(int i=0; i<nums1.size(); i++){
        for(int j=0; j<nums2.size(); j++){
            if(nums1[i]==nums2[j]){
                cur[j+1] = prev[j] + 1;
            } else {
                cur[j+1] = 0;
            }
            maxLength = max(cur[j+1], maxLength);
        }
        swap(cur, prev);
    }

    return maxLength;
}
```