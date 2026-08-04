---
title: "[ Leetcode 295 ] Find Median from Data Stream | 解題思路分享"
date: "2025-05-12"
author: James
tags: Two Heaps,Data Stream
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: b46b01aa-bc1f-4654-a52f-978c98691352
---

設計一個 class `MedianFinder`，支援以下兩個操作：

1. `void addNum(int num)`：將一個整數 `num` 加入 Data Stream 中。
2. `double findMedian()`：回傳目前所有元素的中位數。

題目連結 🔗：[https://leetcode.com/problems/find-median-from-data-stream/](https://leetcode.com/problems/find-median-from-data-stream/)

## 問題分析

我原本想得很簡單，只要找到一個可以排序的 data structure 例如 map 或是 priority queue，這樣 addNum 的 time complexity 就是 O(logn)，但在尋找中位數這件事情上就會變得有點麻煩，因為這些 data structure 不像 array 這樣可以直接 access 到中間的 index，所以這題非常 fancy 的會用到一個技巧 - Two Heaps。

## 解題思路 - Two Heaps

Two Heaps 簡單來說就是維護兩個 Priority Queue - Max Heap 和 Min Heap，利用 Max Heap 儲存數據的左半部，Min Heap 儲存數據的右半部，同時維持 Max Heap 裡的最大值 >= Min Heap 裡的最小值，這樣我們就可以輕鬆 access 到整個數據中間的位置，舉例來說：

```python
maxHeap = [ 2,  4,  6, 7]
minHeap = [13, 12, 10, 9]
```

在算中位數的時候需要考慮到兩種情況 - 奇數跟偶數，我們的目標就是讓中位數的計算可以利用 Max Heap 的 `top()` 還有 Min Heap 的 `top()` 就完成，假設整個數據目前有偶數個，就要將兩數相加除 2

```python
maxHeap = [ 2,  4,  6, 7]
minHeap = [13, 12, 10, 9]
Median  = (7 + 9) / 2
```

如果有奇數個，那就要取 Max Heap 的 top()，也就是整個數據的最中間

```python
maxHeap = [ 2,  4,  6, 7]
minHeap = [13, 12, 10]
Median  = 7
```

而 Two Heaps 的更新流程如下：

> 1. 先將 `num` 推進 Max Heap
> 2. 再來將 Max Heap 中最大的推入 Min Heap
> 3. 如果兩個 Heap size 一樣，那就不用動
> 4. 如果兩個 Heap size 不一樣，表示 Min Heap 比較大，就要把 Min Heap 中最小的再送回去 Max Heap

經過這些步驟，我們就可以維護 size 幾乎一樣的 Two Heaps，這題也就可以解了。

**Time Complexity - addNum** - `O(logn)`<br>
**Time Complexity - findMedian** - `O(1)`<br>
**Space Complexity** - `O(n)`

### Implementation

```cpp
class MedianFinder {
public:
    priority_queue<int>maxHeap;
    priority_queue<int, vector<int>, greater<int>>minHeap;

    MedianFinder() {}
    
    void addNum(int num) {
        maxHeap.push(num);
        minHeap.push(maxHeap.top());
        maxHeap.pop();

        if(minHeap.size() > maxHeap.size()){
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    
    double findMedian() {
        if(minHeap.size() == maxHeap.size()) return (minHeap.top() + maxHeap.top())/2.0;
        else return maxHeap.top();
    }
};
```
