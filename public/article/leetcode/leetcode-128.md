---
title: "[ Leetcode 128 ] Longest Consecutive Sequence | 解題思路分享"
date: "2025-04-08"
author: James
tags: Array,Hash Table,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency : 1
readTime: 3
id: c4c2a774-9b78-45da-932b-55f26ef3303a
---

給一個 unsorted array `nums`，return longest consecutive sequence 的長度。

題目連結 🔗：[https://leetcode.com/problems/longest-consecutive-sequence/](https://leetcode.com/problems/longest-consecutive-sequence/)

### **問題分析**

題目要求要控制在 O(n) 以內，所以我們不能將 array sort 過，我們可以先從頭想，當我看到 nums[i]，我如果要看 consecutive sequence 的話，我就會想要知道 nums[i]+1 是不是在裡面，那 nums[i]+2 是不是也在裡面，這種需要 search 極快的問題就可以用 Hash Table 解。

### **解題思路 - Hash Table**

延續剛剛的思路，我們可以先將 nums 轉成一張 Hash Table。

```cpp
unordered_set<int>uset(nums.begin(), nums.end());
```

再來 loop 過每一個 nums[i]，我們都要看一下 nums[i]+1 在不在 Hash Table 裡面，如果在的話就繼續看 +2, +3，最後可以算出 consecutive sequence 的長度，不過這裡有個問題，除了往後看以外，理論上我們還需要往前看，但這樣可能就會有重複計算的問題會耗比較多時間，所以我們可以設個條件，當 nums[i]-1 不在 Hash Table 裡時，表示 nums[i] 是這個 consecutive sequence 的開頭，我們再往下看，寫起來長這樣：

```cpp
for(int num : nums){
    if(!uset.count(num-1)){
        int currentNum = num;
        while(uset.count(currentNum)){
            currentNum++;
        }
        maxLen = max(maxLen, currentNum - num);
    }
}
```

但是這樣寫會有一個問題，假設 `nums=[0,0,0,0,0,0,0,0,0,1,2,3,4]`，類似這種 consecutive sequence 的開頭太多個數字的話，我們的寫法就要重複算好幾次，所以我們可以選擇 iterate unordered_set，不要 iterate array `nums`。

```cpp
for(int num : uset){
    if(!uset.count(num-1)){
        int currentNum = num;
        while(uset.count(currentNum)){
            currentNum++;
        }
        maxLen = max(maxLen, currentNum - num);
    }
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int longestConsecutive(vector<int>& nums) {
    unordered_set<int>uset(nums.begin(), nums.end());
    int maxLen = 0;

    for(int num : uset){
        if(!uset.count(num-1)){
            int currentNum = num;
            while(uset.count(currentNum)){
                currentNum++;
            }
            maxLen = max(maxLen, currentNum - num);
        }
    }

    return maxLen;
}
```
