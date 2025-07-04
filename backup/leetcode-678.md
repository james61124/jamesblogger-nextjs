---
title: "[ Leetcode 678 ] Valid Parenthesis String | 解題思路分享"
date: "2025-07-04"
author: James
tags: Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/valid-parenthesis-string/](https://leetcode.com/problems/valid-parenthesis-string/)

### **問題分析**



### **解題思路 - Hash Table**



**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool checkInclusion(string s1, string s2) {
    int n = s1.size(), m = s2.size();
    vector<int>umap(26, 0);
    vector<int>window(26, 0);
    int left = 0, right = 0;
    int match = 0;

    for(char c : s1) umap[c - 'a']++;
    for(int i = 0; i < 26; i++){
        if(umap[i] == window[i]) match++;
    }

    while(right < m){
        int inIndex = s2[right] - 'a';
        window[inIndex]++;
        if(window[inIndex] == umap[inIndex] + 1) match--;
        else if(window[inIndex] == umap[inIndex]) match++;

        if(right - left >= n){
            int outIndex = s2[left] - 'a';
            window[outIndex]--;
            if(window[outIndex] == umap[outIndex] - 1) match--;
            else if(window[outIndex] == umap[outIndex]) match++;
            left++;
        }

        right++;
        if(match == 26) return true;
    }

    return false;
}
```
