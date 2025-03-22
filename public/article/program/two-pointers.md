---
title: "[ Algorithm ] Two Pointers | 核心概念與 Leetcode 題型解析"
date: "2025-03-05"
author: James
tags: Algorithm,Two Pointers
image: /images/program/algorithm.jpg
description: "Two Pointers 就是 iterate 的時候不是用一個指標，用兩個指標 iterate，用不同速度、方向、位置等等來想辦法找到題目所求，Two Pointers 大致上分成三類："
readTime: 2
---

Two Pointers 就是 iterate 的時候不是用一個指標，用兩個指標 iterate，用不同速度、方向、位置等等來想辦法找到題目所求，Two Pointers 大致上分成三類：

`Opposite Directional Two Pointers` - 一頭一尾方向不同<br>
`Fast and Slow Pointers` - 同方向但速度不同<br>
`Seperate Two Pointers` - 在不同 array 上

下面我們就用這三種分類進行討論：

### **Opposite Directional Two Pointers**

<figure>
  <img src="/images/program/two-pointers/opposite-directional.png" alt="two-pointers" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Opposite Directional Two Pointers
  </figcaption>
</figure>

基本上就是一個左一個右，然後往內收縮，基本上用來處理一些像是 sorted array 中滿足某些限制條件的一組元素問題、binary search 或是 string 反轉的問題。

#### **Template**

```cpp
while( left < right ){

    if( hit the requirement ) return;

    if( condition ) left++;
    else right--;
}
```

#### **範例**

[[ Leetcode 125 ] Valid Palindrome | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-125/)<br>
[[ Leetcode 11 ] Container With Most Water | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-11/)<br>
[[ Leetcode 167 ] Two Sum II - Input Array Is Sorted | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-167/)

### **Fast and Slow Pointers**

<figure>
  <img src="/images/program/two-pointers/fast-slow.png" alt="two-pointers" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Fast and Slow Pointers
  </figcaption>
</figure>

兩個 pointers 可能 starting point 不一樣，前進的速度也不一樣，可以用來處理 array 中的移動、刪除等問題，或是判斷 linked list 中的長度，或是有沒有環

#### **Template**

```cpp
int slow = 0;
int fast = 1;
while( fast < nums.size() ){
    if( condition ){
        slow++;
    }
    fast++;
}
```

#### **範例**

[[ Leetcode 26 ] Remove Duplicates from Sorted Array | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-26/)

### **Seperate Two Pointers**

<figure>
  <img src="/images/program/two-pointers/seperate.png" alt="two-pointers" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Seperate Two Pointers
  </figcaption>
</figure>

如果 pointers 分在兩個不同的 array 就是屬於這種了，一般用來處理 sorted array 中合併、求交集、求連集的問題

#### **Template**

```cpp
int left_1 = 0;
int left_2 = 1;
while( left_1 < nums1.size() && left_2 < nums2.size() ){
    if( condition 1 ){
        left_1++;
        left_2++;
    } else if( condition 2 ){
        left_1++;
    } else {
        left_2++;
    }
}
```

