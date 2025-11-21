---
title: "[ Leetcode 3354 ] Make Array Elements Equal to Zero | 解題思路分享"
date: "2025-11-20"
author: James
tags: Array,Simulation,Google
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給 nums[i]，我們只能選擇 nums[i] == 0 的點當 starting point，我們可以任選從左邊或右邊出發，當碰到非 0 的 grid，該格就要減一並往反方向走，如果走出 array 的邊界就結束，要問我們有多少種出發的方式可以讓我們把整個 array 都清成 0

題目連結 🔗：[https://leetcode.com/problems/make-array-elements-equal-to-zero/](https://leetcode.com/problems/make-array-elements-equal-to-zero/)

### **問題分析**

這題只能從 nums[i] = 0 的地方出發，可以選擇往右或往左，所以可以把整個 array 分成左半部跟右半部分。

由於碰到一個非 0 的數字，該數字就會減一，然後方向調轉，所以規律非常好找：

> 1. 當左邊所有數字總和 = 右邊所有數字總和，要往左邊先出發或右邊都可以<br>
> 2. 當左邊所有數字總和跟右邊只差一，就要先往多的那邊出發，這樣可以多消耗一個數字

利用這個規律就可以 O(n) 算出有多少 possible selection 了

### **解題思路**

由於只有左半邊跟右半邊，我們可以先計算整體的 totalSum，等下用 totalSum 減掉左邊總和就是右邊總和

```cpp
int left = 0;
int totalSum = 0;
int result = 0;

for(int i = 0; i < nums.size(); i++) totalSum += nums[i];
```

再來 iterate 整個 array，當 nums[i] != 0，表示這個不能當起點，所以這個數字就把它加到左邊的總和去然後直接看下一個數字

```cpp
for(int i = 0; i < nums.size(); i++){
    if(nums[i] != 0) left += nums[i];
}
```

如果 nums[i] == 0，表示這個可以當 starting point，就利用剛剛的規律更新 result 就好

```cpp
for(int i = 0; i < nums.size(); i++){
    if(nums[i] != 0) left += nums[i];
    else {
        int right = totalSum - left;
        if(left == right) result += 2;
        if(abs(left - right) == 1) result++;
    }
}
```

最後輸出 result

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int countValidSelections(vector<int>& nums) {
    int left = 0;
    int totalSum = 0;
    int result = 0;

    for(int i = 0; i < nums.size(); i++) totalSum += nums[i];

    for(int i = 0; i < nums.size(); i++){
        if(nums[i] != 0) left += nums[i];
        else {
            int right = totalSum - left;
            if(left == right) result += 2;
            if(abs(left - right) == 1) result++;
        }
    }

    return result;
}
```
