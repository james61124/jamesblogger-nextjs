---
title: "[ Leetcode 287 ] Find the Duplicate Number | 解題思路分享"
date: "2025-06-26"
author: James
tags: Array,Two Pointers,Floyd's Cycle Detection
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: a5fe6f35-870a-4064-a7b8-5467b6e2a5c9
---

給一個包含 n + 1 個整數的陣列 `nums`，其中每個整數都在範圍 [1, n] 之間，回傳唯一重複的那個值。

題目連結 🔗：[https://leetcode.com/problems/find-the-duplicate-number/](https://leetcode.com/problems/find-the-duplicate-number/)

### **問題分析**

最簡單的方式肯定是 Hash Table，但這題的空間複雜度實際上可以用 O(1) 就解決。

這題的核心條件是 nums[i] 的範圍落在 [1, n-1]，也就是這些 value 的範圍不會超過 index 的範圍，因此如果我們將 nums[i] 指向下一個 index，也就是一直執行 `i = nums[i]`，我們就可以得到一個類似 linked list 的圖

```
nums[i] -> nums[nums[i]] -> nums[nums[nums[i]]]
```

如果這個過程中 nums[i] 有重複的數字，表示這條 linked list 上面會有 cycle，linked list 上面 detect cycle，就是直接往 Fast and Slow Pointers 想了。

簡單講一下 Fast and Slow Pointers，就是用兩個 pointers `fast`, `slow`，然後讓 `fast` 用 `slow` 的兩倍速跑，如果這個 linked list 有 cycle，那這兩個 pointers 最後就在 cycle 上相遇。

不過這題會遇到另一個問題，他想要找的是重複的數字，也就是 cycle 開始的那個 node，而不是單純只是要判斷有沒有 cycle 而已，這樣要怎麼做呢？所以我們需要 Floyd's Cycle Detection 的幫忙。

### **解題思路 - Floyd's Cycle Detection**

我們來畫一張圖

<figure>
  <img src="/images/leetcode/leetcode-287/cycle.png" alt="Cycle" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

`s` 是 cycle 開始的點，`m` 是第一次 Fast and Slow Pointers 兩個 pointers 相遇的點，假設起始位置到 `s` 這段距離是 `L`，cycle 長度是 `c`，`s` 到 `m` 的距離是 x。

第一次做 Fast and Slow Pointers 兩個 pointers 會相遇，因此可以寫出這個關係式：

```
2(L + x) = L + nC + x
```

左邊是 `slow`，右邊是 `fast`，他可能繞了 cycle n 圈了，再來我們目標是要找到 `m`，我們只要把 `slow` 再移回起始點，然後兩個 pointers 用一樣的速度再跑一次就可以了，這次相遇的點就會在 `m`，為什麼呢？

上面的式子如果整理一下，會變這樣：

```
2L + 2x = L + nC + x
L = nC - x
```

左邊是 `slow` 從起始點到 `s`，右邊是 `fast` 從 `m` 到 `s`，簡單來說，如果要找到 cycle 起始點，就要這樣做：

> 先做一次 Fast and Slow Pointers，把 `slow` 移回開頭用相同速度再 iterate 一次

```cpp
int slow = nums[0];
int fast = nums[0];

do {
    fast = nums[nums[fast]];
    slow = nums[slow];
}
while(slow != fast);

slow = nums[0];
while(slow != fast) {
    fast = nums[fast];
    slow = nums[slow];
}

return slow;
```

注意一下 do-while 那邊就行了，這是標準做法，如果初始化的時候就先讓 `fast = nums[nums[0]]` 然後 `slow = nums[0]`，這樣可能會讓他們錯過相遇的點導致出錯，因此要從一樣的地方開始走。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**
```cpp
int findDuplicate(vector<int>& nums) {
    int slow = nums[0];
    int fast = nums[0];

    do {
        fast = nums[nums[fast]];
        slow = nums[slow];
    }
    while(slow != fast);

    slow = nums[0];
    while(slow != fast) {
        fast = nums[fast];
        slow = nums[slow];
    }

    return slow;
}
```