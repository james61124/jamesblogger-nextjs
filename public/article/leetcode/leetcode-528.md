---
title: "[ Leetcode 528 ] Random Pick with Weight | 解題思路分享"
date: "2025-11-20"
author: James
tags: Prefix Sum,Binary Search,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 8b05a15f-5b0a-4a78-af9e-438befec3f7b
---

給一個 nums[i]，random 取出其中一個數字，其中每個數字被取到的機率為 nums[i] / sum(nums)

題目連結 🔗：[https://leetcode.com/problems/random-pick-with-weight/](https://leetcode.com/problems/random-pick-with-weight/)

## 問題分析

如果要找 random 數字，在 c++ 中可以用 `rand() % n` 來找，但這題要的是有權重的 random，這就需要思考了，一般使用 `rand()` 可以 random 一個範圍內的數字，如果要有權重就要讓權重大的有相對應比例的數量才行

假設 nums = [3, 2, 1]，照剛剛的邏輯我們可以把 array 擴增成 [3, 3, 3, 2, 2, 1] 這樣去取 random，當我們拿到 0, 1, 2，這代表 index，對應到的 value 就是 3，拿到 3, 4 對應到的 value 是 2，拿到 5 對應到的 value 就是 1，但我們真的需要擴建出一個實際的 array 來做到這件事嗎？

這裡我們可以利用 Prefix Sum 來處理

## 解題思路 - Prefix Sum

剛剛的例子 nums = [3, 2, 1]，如果取 prefix sum 後是 [3, 5, 6]，我們可以從 1 ~ 6 中任取一個數字，當取到 1 ~ 3 表示我們拿到的是第一個數字，也就是 3，當我們取到 4 ~ 5，表示我們拿到的是第二個數字，也就是 5，後面以此類推，所以我們拿到 random 的數字 `numPick` 後，要找到「prefix sum 中大於等於 `numPick` 的最小值的 index」，就是我們最終答案

而要找到「prefix sum 中大於等於 `numPick` 的最小值的 index」，可以簡單利用 Binary Search 即可，下面來看程式碼

我們先建立 prefix Sum 的 array

```cpp
class Solution {
private:
    int n;
    vector<int>prefixSum;
public:
    Solution(vector<int>& w) {
        n = w.size();
        prefixSum.push_back(w[0]);
        for(int i = 1; i < w.size(); i++){
            prefixSum.push_back(prefixSum[i - 1] + w[i]);
        }
    }
    
    int pickIndex() {
        // ...
    }
};
```

再來 `pickIndex()` 中我們從 1 ~ prefixSum 最大的數字中間 random 取一個數

```cpp
int numPick = rand() % prefixSum[n - 1] + 1;
```

最後用 Binary Search 找到「prefix sum 中大於等於 `numPick` 的最小值的 index」即可

```cpp
int left = 0;
int right = n - 1;
while(right >= left){
    int mid = left + (right - left) / 2;
    if(prefixSum[mid] >= numPick) right = mid - 1;
    else left = mid + 1;
}

return left;
```

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(n)`

### Implementation

```cpp
class Solution {
private:
    int n;
    vector<int>prefixSum;
public:
    Solution(vector<int>& w) {
        n = w.size();
        prefixSum.push_back(w[0]);
        for(int i = 1; i < w.size(); i++){
            prefixSum.push_back(prefixSum[i - 1] + w[i]);
        }
    }
    
    int pickIndex() {
        int numPick = rand() % prefixSum[n - 1] + 1;

        int left = 0;
        int right = n - 1;
        while(right >= left){
            int mid = left + (right - left) / 2;
            if(prefixSum[mid] >= numPick) right = mid - 1;
            else left = mid + 1;
        }

        return left;
    }
};
```
