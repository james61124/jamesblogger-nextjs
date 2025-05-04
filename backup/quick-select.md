---
title: "[ Algorithm ] Quick Select | 核心概念與 Leetcode 題型解析"
date: "2025-04-20"
author: James
tags: Algorithm,Quick Select
image: /images/program/algorithm.png
description: ""
readTime: 2
---

Quick Select 是一種在 unsorted array 中找出第 k 大或第 k 小的 Algorithm，跟 Quick Sort 的想法很像，都是用 Divide and Conquer 來做思考的。

我們先看一下 Quick Select 的 main function：

```cpp
int quickSelect(vector<int>& nums, int left, int right, int k) {
    if (left == right) return nums[left];
    int pivotIndex = partition(nums, left, right);

    if (k == pivotIndex) return nums[k];
    else if (k < pivotIndex) return quickSelect(nums, left, pivotIndex - 1, k);
    else return quickSelect(nums, pivotIndex + 1, right, k);
}
```

假設我們要找的是第 k 大的數字，`partition` 這個 function 會隨機挑選 `nums` 中一個 pivot 出來，在經過一系列的操作後，讓 pivot 左邊的數字都大於 pivot，右邊的數字都小於 pivot，最後回傳這個 pivot 的 index，也就是說對於這個 pivot 而言，經過 `partition` 後他就會落在理論上 sorting 後的正確的位置上，舉個例子：

```python
nums = [5, 3, 4, 6, 7, 8, 2]
pivot = 6
```

經過 `partition` 後可能會變這樣

```python
nums = [7, 8, 6, 5, 3, 4, 2]
```

所以 pivotIndex 就是 2，而在 index = 2 的左邊都比 6 大，右邊都比 6 小，但是只有 6 是在正確的位置上，其他人的位置不一定是正確的。

再來如果 k 比 pivotIndex 小，表示第 k 大的數字在 pivotIndex 的左邊，所以就把左邊的 subarray 再送進去 partition 一次，如果 k 就是 pivotIndex，表示我們已經找到第 k 大的數了，那如果 k 比 pivotIndex 大，就表示第 k 大的數字在 pivotIndex 的右邊，所以就把右邊的 subarray 再送進去 partition。

再來就要講決定 Quick Sort 效率的關鍵，partition 的方法決定了 Quick Sort 的速度，這邊介紹兩種方法：Hoare Partition 與 Lomuto Partition

### **Hoare Partition**



