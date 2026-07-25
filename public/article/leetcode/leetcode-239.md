---
title: "[ Leetcode 239 ] Sliding Window Maximum | 解題思路分享"
date: "2025-03-24"
author: James
tags: Array,Queue,Priority Queue,Sliding Window,Deque,Monotonic Deque
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: 77db540d-c0b3-458c-91c2-5965136e1182
---

給定一個長度為 `n` 的整數 array `nums` 和一個大小為 k 的 slidinw window，請找出每個 sliding window 中的最大值。

題目連結 🔗：[https://leetcode.com/problems/sliding-window-maximum/](https://leetcode.com/problems/sliding-window-maximum/)

### **問題分析**

這題要維護一個 sliding window 很簡單，關鍵在於要怎麼找到 sliding window 裏面的最大值，最暴力的方法就是再跑一次迴圈看 sliding window 裏面最大的是多少，但這樣一定超時，所以如果我們可以把 sliding window 裡的資訊放到一個可以排序的 STL 的話，就可以拿到 maximum。

能排序的 STL 其實很多，這題也可以用 map 做，insert 進去時 map 就會自動排序，sliding window 移動的時候再把用不到的 element 從 map 中 erase 就行了，不過我們來看一下 priority queue 的解法。

### **解題思路 - Priority Queue**

其實在這個 STL 裏面，不一定要剛好存放 sliding window 的內容物，如果我們在 priority queue 裏面存 `pair<int, int> p(nums[index], index)`，這樣 pq.top() 就會是最大值，但 sliding window 移動時我們不用特別找到被移出去的 element 把他 erase，我們只要判斷一下 pq.top() 的 index 如果在 sliding window 外，那把他 pop 掉看下一個就好，不用一直維護 priority queue 讓他符合 sliding window 的數量。

`i-k+1` 是因為現在的 sliding window 範圍最右邊是 i，size 是 k。

```cpp
while(pq.top().second<i-k+1){ 
    pq.pop();
}
```

不過同樣的方法用 map 做意思其實差不多，Big O 算起來是一樣的，所以選一個做就行。

**Time Complexity** - `O(n * log k)`，因為 insert 是 `O(logk)`<br>
**Space Complexity** - `O( k )`

#### **Implementation**

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    priority_queue<pair<int, int>>pq;
    vector<int>res;

    for(int i=0; i<k; i++){
        pq.push(make_pair(nums[i], i));
    }
    res.push_back(pq.top().first);

    for(int i=k; i<nums.size(); i++){
        pq.push(make_pair(nums[i], i));
        while(pq.top().second<i-k+1){
            pq.pop();
        }
        res.push_back(pq.top().first);
    }

    return res;
}
```

### **時間優化 - Monotonic Deque**

但這題其實有更快的解法，我們甚至不用將資訊儲存進去可以自動排序的 STL，我們可以手動維護一個遞減的 Monotonic Deque，這樣 insert 的時候就不用耗費 O(logn)，用 O(1) 就可以解決了，而且還可以保證 dq.front() 是最大值。

要維護一個 Monotonic Deque，當移動 sliding window 時，要將新的 element push_back 進去，但是我們要先讓後面所有比這個 element 小的都要先 pop_back 出來再讓這個 element push_back 進去，所以這個 deque 就會是遞減的 deque。

```cpp
while (!dq.empty() && nums[dq.back()] <= nums[i]) {
    dq.pop_back();
}
```

當我們要找最大值時，我們只要拿 dq.front() 就行了，但是一樣要先判斷這個 element 是不是在 sliding window 裡，所以存入 deque 的不能是 value `nums[i]`，要是 index `i`，那會不會出現在維護 monotonic deque 的時候 pop_back 掉的那些 element 其實是在 sliding window 裡但是後面還會被用到呢？事實上是不會的，因為 push_back 進去的 element 是 sliding window 的最後一位，前面被 pop_back 掉的就算還在 sliding window 裡，也會因為他比這個 element 小而用不到，所以直接 pop 出去就行了。

**Time Complexity** - `O( n )`<br>
**Space Complexity** - `O( n )`

#### **Implementation**

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    deque<int> dq;

    for (int i = 0; i < nums.size(); ++i) {
        if (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }

        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        dq.push_back(i);

        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }

    return result;
}
```