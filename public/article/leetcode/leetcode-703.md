---
title: "[ Leetcode 703 ] Kth Largest Element in a Stream | 解題思路分享"
date: "2025-07-08"
author: James
tags: Priority Queue
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 096efd40-bfb8-4e0e-820f-3504a60c3f50
---

給一個 `nums` 並設計一個 class，要隨時可以加入新的數字，並回傳目前第 k 大的數字。

題目連結 🔗：[https://leetcode.com/problems/kth-largest-element-in-a-stream/](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

### **問題分析**

這題主要可以往幾個方向思考，如果利用 Binary Search 找到指定位置 insert 進去，然後直接輸出第 k 個，找到正確位置的部分是 O(logn) 沒錯，但 vector 的 insert 是 O(n) 所以這樣不太好，而 insert 是 O(1) 的 data structure 都沒有辦法直接 search 到第 k 的 index。

所以再往下想，我們真的需要 search 到第 k 大的數字嗎？舉例來說 `nums` = [4, 5, 8]，k = 3，如果遇到比 4 還要小的數字，完全不會影響 k largest element，除非遇到比 4 還要大的數字，也就是說

> 遇到比當下 k largest element 還要小的數字可以直接 drop 掉不理

我們要利用 O(logn) 幫新進的 element 找到正確的 index，並維護這個 data structure 的 size 為 k，而每次都取出最尾巴最小的值即可，符合這些條件的 data structure 就是 Priority Queue - Min Heap。

### **解題思路 - Priority Queue**

想到這邊這題就解完了，對於每一個新進的數字來說，如果比 minHeap 的 top 還要小就不管，不然就 push 進去後直接 pop 掉最小的

```cpp
int add(int val) {
    if(val >= minHeap.top()) {
        minHeap.push(val);
        minHeap.pop();
    }
    return minHeap.top();
}
```

而如果 minHeap 的數量還沒有到達 k，就不要 pop，果斷 push 進去

```cpp
int add(int val) {
    if(minHeap.size() < k) minHeap.push(val);
    else if(val >= minHeap.top()) {
        minHeap.push(val);
        minHeap.pop();
    }
    return minHeap.top();
}
```

而初始化的時候把每一個 element 都 `add` 進去就對了

```cpp
KthLargest(int k, vector<int>& nums) {
    this->k = k;
    for(int num : nums) {
        add(num);
    }
}
```

**Time Complexity** - `O(log k)`，這是單次 `add`，所以初始化的時候是 `O(nlogk)`<br>
**Space Complexity** - `O(k)`

#### **Implementation**

```cpp
class KthLargest {
private:
    int k;
    priority_queue<int, vector<int>, greater<int>>minHeap;
public:
    KthLargest(int k, vector<int>& nums) {
        this->k = k;
        for(int num : nums) {
            add(num);
        }
    }
    
    int add(int val) {
        if(minHeap.size() < k) minHeap.push(val);
        else if(val >= minHeap.top()) {
            minHeap.push(val);
            minHeap.pop();
        }
        return minHeap.top();
    }
};
```
