---
title: "[ Leetcode 84 ] Largest Rectangle in Histogram | 解題思路分享"
date: "2025-06-13"
author: James
tags: Array,Stack,Monotonic Stack
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 19d43068-cb57-41c4-b4e6-30e32331319a
---

給一個 heights[i]，每個元素代表一個寬度為 1 的直條高度，請找出能構成的最大矩形面積。

題目連結 🔗：[https://leetcode.com/problems/largest-rectangle-in-histogram/](https://leetcode.com/problems/largest-rectangle-in-histogram/)

### **問題分析**

區間內的 area 計算公式如下：

> area = (區間寬度) * (區間內最小高度)

當然最暴力的解法就是雙迴圈跑過所有「區間」，但是肯定有可以更快的方法。理論上我們應該要可以在 O(n) 內解決問題，因為我們其實只需要比較每一個「利用 heights[i] 當最小值的區間計算出來的 area」就好了，這樣就只需要計算 n 個區間，找出最小值即可。

那要如何利用 heights[i] 計算出屬於他的 area 呢？只需要找到他「上一個比他小的 heights[i]」以及「下一個比他小的 heights[i]」即可，中間夾起來的區間就符合「heights[i] 為最小值」的性質，而 area 就是（ 區間寬度 ）* heights[i]。

<figure>
  <img src="/images/leetcode/leetcode-84/intro.png" alt="Intro" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  
  </figcaption>
</figure>


### **解題思路 - Monotonic Stack**

那這件事情可以利用 increasing 的 Monotonic Stack 解決

[[ Data Structure ] Stack & Monotonic Stack | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/stack)

如果我們維護一個 increasing 的 Monotonic Stack，所以遇到比 top 小的 heights[i] 就要先 pop 出來直到 top 比 heights[i] 小，再把 heights[i] push 進去 stack 中，這樣就可以維持一個 increasing 的 Monotonic Stack。

而 stack 中 top 的下一個元素實際上就是 top 上一個比他小的 heights[i]，那如果再來遇到比 top 小的 heights[i]，就代表他遇到下一個比他小的 heights[i] 了，此時就可以計算 area。

因此我們先建立一個 Monotonic Stack :

```cpp
stack<int>st;
for(int i = 0; i < heights.size(); i++){
    while(!st.empty() && heights[i] < heights[st.top()]){
        st.pop();
    }
    st.push(i);
}
```

再來如果 `heights[i] < heights[st.top()]`，表示我們可以計算 st.top() 的 area 了，根據剛剛的觀念，這個區間的邊界就是「top 的下一個元素」跟 i，而高度就是 `heights[st.top()]` 本人，所以 area 的計算會像這樣：

```cpp
stack<int>st;
int maxArea = 0;
for(int i = 0; i < heights.size(); i++){
    while(!st.empty() && heights[i] < heights[st.top()]){
        int h = heights[st.top()]; // area 的高
        st.pop();

        int width = i - st.top() - 1; // 計算區間寬度，這個是 pop 完的 top，也就是原本的 top 的下一個
        int area = h * width; // 計算 area
        maxArea = max(maxArea, area);
    }
    st.push(i);
}
```

最後來處理一些邊界狀況，假設 st = [1, 4, 5]，然後 heights[i] 已經全部看完了，那這些元素永遠遇不到下一個比他們小的元素就永遠沒辦法被計算，所以我們可以在一開始就先把 0 推進去 heights[i]，給他們一個虛擬的元素，這樣這些「沒有下一個比他們還要小的」元素們就可以被處理

```cpp
stack<int>st;
int maxArea = 0;

heights.push_back(0); // 推一個虛擬的 height
for(int i = 0; i < heights.size(); i++){
    while(!st.empty() && heights[i] < heights[st.top()]){
        int h = heights[st.top()];
        st.pop();

        int width = i - st.top() - 1;
        int area = h * width;
        maxArea = max(maxArea, area);
    }
    st.push(i);
}
```

最後當 stack 只剩下一個元素時，表示這個元素不會遇到「上一個比他還要小的元素」，這只會發生在整個 heights[i] 最矮的元素身上，也就是說他的區間會相當於整個 heights.size()，那我們的 width 就要特別處理一下不然會出錯。

```cpp
stack<int>st;
int maxArea = 0;

heights.push_back(0);
for(int i = 0; i < heights.size(); i++){
    while(!st.empty() && heights[i] < heights[st.top()]){
        int h = heights[st.top()];
        st.pop();

        int width = !st.empty() ? i - st.top() - 1 : i; // 處理一下 width 的 edge case
        int area = h * width;
        maxArea = max(maxArea, area);
    }
    st.push(i);
}
```

最後 maxArea 就是答案。

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int>st;
    int maxArea = 0;

    heights.push_back(0);
    for(int i = 0; i < heights.size(); i++){
        while(!st.empty() && heights[i] < heights[st.top()]){
            int h = heights[st.top()];
            st.pop();
            int width = !st.empty() ? i - st.top() - 1 : i;
            int area = h * width;
            maxArea = max(maxArea, area);
        }
        st.push(i);
    }

    return maxArea;
}
```