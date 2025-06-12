---
title: "[ Leetcode 45 ] Jump Game II | 解題思路分享"
date: "2025-06-12"
author: James
tags: Array,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 nums[i]，其中每個元素代表你在該位置最多可以跳躍的步數。從 index 0 開始，目標是跳到最後一個位置，請回傳最少需要幾次跳躍，才能從起點跳到終點。

題目連結 🔗：[https://leetcode.com/problems/jump-game-ii/](https://leetcode.com/problems/jump-game-ii/)

### **問題分析**

這題需要釐清的是，nums[i] 給的是「最遠可以 reach 的位置」，而不是指 i 只能跳到 i + nums[i]，也就是說從 i ~ i + nums[i] 中間每一個點 i 都可以 jump 到。

意思是說我們不用把每一格 i 跳得到的位置都抓出來跳跳看，一路 dfs 看哪一種路徑 jump 數量最小，我們可以利用 Greedy 計算每一次 jump 最遠可以跳到哪即可，下面來詳細解釋。

### **解題思路 - Greedy**

舉例來說，nums = [3, 2, 4, 1, 5, 3, 2, 1, 2]

假設 nums[0] = 3，表示跳第一次最遠可以跳到 index 3，所以我只要從這區間找找看下一次跳最遠可以跳到哪就好，以這題來看， nums[1:3] = [2, 4, 1]，所以跳第二次最遠可以跳到 index 6，因為在跳第一次的區間內任何一格出發都可以，只要找最遠可以跳到哪就好，而持續最後一個步驟直到最遠可以跳超過終點就找到我們的答案了。

最後寫成程式碼即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int jump(vector<int>& nums) {
    int jump = 0, curEnd = 0, maxEnd = 0;
    for(int i = 0; i < nums.size() - 1; i++){
        int end = i + nums[i];
        curEnd = max(curEnd, end);
        if(i == maxEnd) {
            jump++;
            maxEnd = curEnd;
        }
    }

    return jump;
}
```