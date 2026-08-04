---
title: "[ Leetcode 3542 ] Minimum Operations to Convert All Elements to Zero | 解題思路分享"
date: "2025-11-20"
author: James
tags: Stack,Monotonic Stack,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: dd51607b-f889-4df6-a602-7437496ed158
---

給一個 nums[i]，可以挑任意的 subarray 將裡面最小的數字全部變成 0，問最少需要幾次可以將所有數字變成 0

題目連結 🔗：[https://leetcode.com/problems/minimum-operations-to-convert-all-elements-to-zero/](https://leetcode.com/problems/minimum-operations-to-convert-all-elements-to-zero/)

## 問題分析

這題如果照題目的邏輯直覺去想怎麼 simulate 這個過程的話，就會發現很麻煩，舉個例子來說，nums = [1, 2, 1, 2, 1, 2]，我們可以先找整個 array 的最小值 1 把他們全部變成 0，這樣 nums = [0, 2, 0, 2, 0, 2]，然後我們就會發現所有 2 都被切開了，他們沒有辦法在一次 operation 中全部歸零，因為 0 比 2 還要小，如果我們要照這個邏輯一層一層 simulate 時間複雜度太高了，要想別的方法。

我們先來看什麼情況下會需要多一次 operation，我們 iterate 整個 array，如果遇到更大的數字，就表示我們需要多一次 operation，這個沒有爭議，但如果我們遇到更小的數字就不一定了，我們必須往前看，當兩個一樣的數字中間沒有更小的數字，就表示這兩個數字不會因為中間有數字被清零了而被分開，所以就不需要新的 operation

簡單舉個例子，nums = [2, 1, 3, 2]，nums[3] = 2，他比 nums[2] 來的小所以要往前看，在往前看的過程中發現他跟上一個 2 中間有比自己還要小的數字，表示這兩個 2 是會被隔開的，所以這個 2 需要多一次 operation

整個過程其實就是一個 Monotonic Stack，我們維護一個 increasing 的 monotonic stack，當有新的數字進去就表示遇到了更大的數，operations 就要加一，當遇到更小的數，就要先把前面的數 pop 出來，如果剩下的數字跟現在的數字一樣，就表示這個字跟上個一樣的數字中間沒有更小的數，operation 不用加一，但如果 pop 出來發現剩下的數字已經比現在的數字小了，就把現在的數字推進去，同時 operations 加一，用數字來舉例

```python
nums = [1, 2, 1, 3, 2]

stack = [1]
op = 1

stack = [1, 2] # push 2
op = 2

stack = [1] # pop 2, 1 remain the same, op not change
op = 2

stack = [1, 3] # push 3
op = 3

stack = [1, 2] # pop 3, push 2
op = 4
```

知道原理後寫成程式碼就不會很難了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
int minOperations(vector<int>& nums) {
    stack<int>st;
    int op = 0;

    st.push(0);
    for(int& num : nums){
        while(!st.empty() && st.top() > num) st.pop();

        if(!st.empty() && st.top() == num) continue;
        op++;
        st.push(num);
    }

    return op;
}
```
