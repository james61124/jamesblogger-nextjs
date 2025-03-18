---
title: "[ Leetcode 11 ] Container With Most Water | 解題思路分享"
date: "2025-02-27"
author: James
tags: Array,Two Pointers,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

**Notice** that you may not slant the container.

**Example 1**:

> Input: height = [1,8,6,2,5,4,8,3,7]<br>
> Output: 49<br>
> Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

**Example 2**:

> Input: height = [1,1]<br>
> Output: 1
 
**Constraints**:

- `n == height.length`
- `2 <= n <= 105`
- `0 <= height[i] <= 104`

<p></p>

題目連結🔗：[https://leetcode.com/problems/container-with-most-water/](https://leetcode.com/problems/container-with-most-water/)

### **解題思路 - Opposite Direction Two Pointers**

這題的關鍵在於 `容器的面積 = 短邊的高度 × 底邊的長度`，我們希望找到兩條線，使這個面積最大。

#### **為什麼使用 Two Pointers？**

我們可以使用 Two Pointers，分別從數組的開頭 ( left = 0 ) 和結尾 ( right = arr.size()-1 ) 開始，逐步縮小範圍來尋找最大容積。

#### **如何選擇移動哪個指針？**

由於水的高度取決於較短的那一邊，我們計算當前區間的水量後，應該移動較矮的指針，因為移動較高的指針不會讓水位變高，但移動較矮的指針可能找到更高的線，進而增加水量。講具體一點，假設 left 比較低，這個時候如果拿 right 往內縮，如果下一個 height 比 left 高，計算 area 的時候還是會用 `left*(變短的距離)`，area 不會比較大，如果下一個 height 比 left 矮，那我們就是拿 `(更小的 height)*(變短的距離)`，area 也不會比較大，所以我們要移動較矮的 pointer。

**Time Complexity** - `O(n)`，每個元素最多被 right 或 left 掃過<br>
**Space Complexity** - `O(1)`，只使用了兩個指針

### **Implementation**

```cpp
int maxArea(vector<int>& height) {
    int left = 0;
    int right = height.size()-1;
    int maxArea = 0;

    while(left < right){
        int smallerHeight = min(height[left], height[right]);
        maxArea = max(maxArea, smallerHeight*(right-left));
        if(height[left]<height[right]) left++;
        else right--;
    }
    return maxArea;
}
```