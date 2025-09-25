---
title: "[ Leetcode 42 ] Trapping Rain Water | 解題思路分享"
date: "2025-06-10"
author: James
tags: Array,Two Pointers,Stack,Monotonic Stack,Google,Meta
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
---

給一個 height[i]，每個元素代表直條圖中對應位置的柱子高度。假設每根柱子的寬度都是 1，當下雨時，問這些柱子之間最多可以「接住」多少單位的雨水？

題目連結 🔗：[https://leetcode.com/problems/trapping-rain-water/](https://leetcode.com/problems/trapping-rain-water/)

### **問題分析**

我一開始的想法非常直覺，這題看起來就很像 Monotonic Stack，維持一個 decreasing 的 Monotonic Stack，代表還等待填入水的 height，當遇到比 stack 的頭還要大的 height，表示遇到牆了可以儲水了，就把元素從 Stack 中移出來計算儲水量，這個版本乍看沒甚麼問題也是 O(n)，但想起來就是有一點繞，沒想到這題竟然可以用 Two Pointers 解。

### **解題思路 - Opposite Directional Two Pointers**

這題是 Opposite Directional Two Pointers，我們需要兩個 pointers `left`, `right` 分別在最左跟最右，再來慢慢縮進來。

[[ Algorithm ] Two Pointers | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/two-pointers)

在左側縮進來的過程需要紀錄左側的最大高度 `leftMax`，同樣右側縮進來的過程要紀錄右側的最大高度 `rightMax`，所以最重要的是我們要如何決定誰要縮進來以及要如何計算能儲存的水量。

這裡我們來觀察一件事情，對於每一個 `left` 來說，`leftMax` 一定會比自己高，只要確認右邊有比 `leftMax` 高的 height，那剩下的 height 不論怎麼排列，每一個 `left` 的儲水量就是 leftMax - height[left]，圖示如下，藍色部分就是確定可以儲存的水量。

<figure>
  <img src="/images/leetcode/leetcode-42/introduction.png" alt="leetcode-42" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    
  </figcaption>
</figure>

右邊也是一樣概念，對於每一個 `right` 來說，`rightMax` 一定會比自己高，只要確認左邊有比 `rightMax` 高的 height，剩下的 height 不論怎麼排列，每一個 `left` 的儲水量就是 rightMax - height[right]。

因此，當 height[left] < height[right] 時，left 要縮進來，反之就是 right，這樣就可以確保要收縮指標時，另一側一定會有一個比這側最高的牆還要高的牆擋著，就可以放心的計算儲水量。

```cpp
while (left < right) {
    if (height[left] < height[right]) {
        // ...
        left++;
    } else {
        // ...
        right--;
    }
}
```

我們如果不是從 height 比較小的那邊縮，我們就沒有辦法確定另一邊一定會有一到更高的牆，這樣計算儲水量可能就會出錯。

<figure>
  <img src="/images/leetcode/leetcode-42/error.png" alt="leetcode-42" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    
  </figcaption>
</figure>

再來把計算儲水量的部分補上即可。

```cpp
while (left < right) {
    if (height[left] < height[right]) {
        leftMax = max(leftMax, height[left]);
        water += leftMax - height[left];
        left++;
    } else {
        rightMax = max(rightMax, height[right]);
        water += rightMax - height[right];
        right--;
    }
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0;
    int water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = max(leftMax, height[left]);
            water += leftMax - height[left];
            left++;
        } else {
            rightMax = max(rightMax, height[right]);
            water += rightMax - height[right];
            right--;
        }
    }

    return water;
}
```