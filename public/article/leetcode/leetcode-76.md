---
title: "[ Leetcode 76 ] Minimum Window Substring | 解題思路分享"
date: "2025-04-02"
author: James
tags: Hash Table,String,Sliding Window
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給兩個 string `s` 和 `t`，請在 `s` 中找到最短的 substring，使得這個 substring 包含 `t` 中的所有字母（包括重複的字母）。

題目連結 🔗：[https://leetcode.com/problems/minimum-window-substring/](https://leetcode.com/problems/minimum-window-substring/)

### **問題分析**

題目問說符合 「window 內包含所有 string `t` 的元素」的最小 window size 是什麼，sliding window 的思路應該滿直覺的，如果我們的 `right` pointer 一直往右移，移到包含了所有 t 的元素後，慢慢收縮 `left` pointer 直到 sliding window 內不再有全部 t 的元素，然後就再繼續把 `right` pointer 往右移，重複這個過程紀錄最小的 window size 就可以了。 

### **解題思路 - Sliding Window**

思路沒有很難，所以一步步來想實作細節。

首先 right 在移動的過程中我們要快速判斷 `s[right]` 是不是在 string `t` 內，所以可以用一個 Hash Table 來紀錄 `t` 內的 element 各有多少個。

```cpp
unordered_map<char, int>umap;
for(char c : t){
    umap[c]++;
}
```

再來 `right` 在移動的時候我們要紀錄 sliding window 內是不是有放進去 string `t` 的 element 了，最簡單的方式就是如果發現 s[right] 在 Hash Table 的 key 裡，就把相對應的 value `umap[s[right]]` 減一，表示我已經把 `s[right]` 放進去 sliding window 裡了。

這邊注意一下 Hash Table 的意義，`umap[c]` 的意義是「c 還應該要放多少個進去 sliding window 裏面」，所以如果 `umap[c] == 0`，表示 sliding window 裡的 c 已經足夠，那當然如果 `umap[c] < 0`，表示 sliding window 裡的 c 太多了，但是也沒有關係。

```cpp
for(int right = 0, left = 0; right<s.size(); right++){
    if(umap.count(s[right])){
        umap[s[right]]--;  
    }
}
```

再來我們需要判斷 sliding window 內已經有了所有我們需要的 element 了，也就是 umap 的所有 key 的 value 都是 0，但如果每一次都要重新檢查就需要一直跑 loop 來檢查這個 Hash Table，所以我們可以維護一個 int `umapCount` 來紀錄 umap 裡 value 總和離 0 還有多遠，當 umapCount 變成 0 就表示所有 value 都是 0 了。

```cpp
for(char c : t){
    umap[c]++;
    umapCount++;
}

for(int right = 0, left = 0; right<s.size(); right++){

    if(umap.count(s[right])){
        if(umap[s[right]] > 0) umapCount--;
        umap[s[right]]--;  
    }
}
```

最後，當 `umapCount = 0` 的時候我們要收縮 left，而收縮的過程如果遇到 string `t` 裡的 element，就要去更新 Hash Table，順便更新 umapCount，而當 `umapCount > 0` 表示 sliding window 內的 element 又不夠了，就要繼續移動 right，所以直接進 implementation。

**Time Complexity** - `O(m+n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
string minWindow(string s, string t) {
    int umapCount = 0;
    int minLength = INT_MAX;
    int start = 0, length = 0;
    unordered_map<char, int>umap;

    for(char c : t){
        umap[c]++;
        umapCount++;
    }

    for(int right = 0, left = 0; right<s.size(); right++){

        if(umap.count(s[right])){
            if(umap[s[right]] > 0) umapCount--;
            umap[s[right]]--;  
        }

        while(!umapCount){
            int slidingWindowLen = right - left + 1;
            
            if(slidingWindowLen < minLength){
                minLength = slidingWindowLen;
                start = left;
                length = slidingWindowLen;
            }

            if(umap.count(s[left])){
                umap[s[left]]++;
                if(umap[s[left]] > 0) umapCount++;
            }

            left++;
        }
    }

    return s.substr(start, length);
}
```
