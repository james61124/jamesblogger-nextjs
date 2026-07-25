---
title: "[ Leetcode 88 ] Merge Sorted Array | 解題思路分享"
date: "2025-08-29"
author: James
tags: Array,Two Pointers,Top Interview,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 6675ffb2-ba6f-4313-87c8-fe0c0dce76ed
---

給兩個已經排好序的整數陣列：

> `nums1`，長度為 m + n，其中前 m 個元素有效，後 n 個元素為 0，預留空間用來合併。<br>
> `nums2`，長度為 n，全部 n 個元素有效。

任務是把 `nums2` 合併進 `nums1`，使 `nums1` 成為一個 非遞減排序（sorted, ascending）的完整陣列，必須 in-place 完成，也就是說不能額外建立另一個大陣列。

題目連結 🔗：[https://leetcode.com/problems/merge-sorted-array/](https://leetcode.com/problems/merge-sorted-array/)

### **問題分析**

這題看似在考 merge sort，但是卻不能用到額外的空間，也就是說 merge 出來的結果要全部存在 `nums1` 裡面。但如果很直覺的從頭開始直接 merge 會把 `nums1` 的內容覆蓋掉，因此我們需要利用唯一空出來的空間，也就是 `nums1` 的後半段來實作。

### **解題思路 - Two Pointers**

想要從 `nums1` 的後半段開始填，我們可以換個思路，只要先填大的就可以了，一路從尾巴填到 `nums1` 的頭，這樣就不會有把前面的數字蓋掉的問題，同時填入的數字又都是在正確的位置上。

我們需要三個 pointers，`left_1`, `right_2` 代表 `nums1`, `nums2` 有數字的部分的最尾端，將這兩個數字拿出來比較，大的填入 `right_1`，也就是整個 `nums1` 最尾端就可以了，實做出來會像這樣

```cpp
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int left_1 = m - 1;
    int right_1 = nums1.size() - 1;
    int right_2 = nums2.size() - 1;

    while(left_1 >= 0 && right_2 >= 0){
        if(nums1[left_1] > nums2[right_2]){
            nums1[right_1] = nums1[left_1];
            left_1--;
        } else {
            nums1[right_1] = nums2[right_2];
            right_2--;
        }
        right_1--;
    }
}
```

最後處理一下 edge case，如果 `nums2` 最後還有剩餘的沒有填進去，表示剩下的位置都必須給他們填，就直接全部填到 `nums1` 就行了

```cpp
while(right_2 >= 0){
    nums1[right_1] = nums2[right_2];
    right_2--;
    right_1--;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int left_1 = m - 1;
    int right_1 = nums1.size() - 1;
    int right_2 = nums2.size() - 1;

    while(left_1 >= 0 && right_2 >= 0){
        if(nums1[left_1] > nums2[right_2]){
            nums1[right_1] = nums1[left_1];
            left_1--;
        } else {
            nums1[right_1] = nums2[right_2];
            right_2--;
        }
        right_1--;
    }

    while(right_2 >= 0){
        nums1[right_1] = nums2[right_2];
        right_2--;
        right_1--;
    }
}
```