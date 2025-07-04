---
title: "[ Leetcode 567 ] Permutation in String | 解題思路分享"
date: "2025-07-04"
author: James
tags: Hash Table,Sliding Window
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給兩個 string `s1`, `s2`，問 `s2` 中是否有 `s1` 的 permutation 的 substring

題目連結 🔗：[https://leetcode.com/problems/permutation-in-string/](https://leetcode.com/problems/permutation-in-string/)

### **問題分析**

這題是可以找到 O(n) 的解法的，看到要比較 substring，可以往 sliding window 想想看。

白話來說，如果 `s2` 中能找到一個 sliding window，裡面的所有字母數量都跟 `s1` 一樣，那就表示可以回傳 `true`，因此我們可以直接把 sliding window 拉到跟 `s1` 一樣大，比較內容物即可，我們可以利用 Hash Table 紀錄 sliding window 跟 `s1` 每一種字母的數量，這樣可以快速比較，而在移動 sliding window 時也可以快速更新。

### **解題思路 - Hash Table**

思路很簡單，移動 `right` 就加進 Hash Table 內，移動 `left` 就把字母從 Hash Table 移出，所以關鍵在於如何快速比較兩個 Hash Table 有沒有一樣。

由於內容侷限在 26 個字母，所以這題其實不用開到 `unordered_map`，開個 size 為 26 的 vector 就可以記錄了，這樣也不需要多 hash 的操作時間，我們需要兩個 Hash Table，用來儲存 `s1` 以及 sliding window。

```cpp
vector<int>umap(26, 0);
vector<int>window(26, 0);
```

如果移動 sliding window 的同時就 iterate 一次比較兩者有沒有一樣也可以，因為這樣是常數時間，但其實有更快的方式，我們可以設一個 `match` 計數器，紀錄目前兩個 Hash Table 內有多少欄位一樣，也就是說如果 match 為 26，就可以直接 return true。

一開始掃過 `s1` 更新完 `umap` 先初始化 match 的值

```cpp
int left = 0, right = 0;
int match = 0;

for(char c : s1) umap[c - 'a']++;
for(int i = 0; i < 26; i++){
    if(umap[i] == window[i]) match++;
}
```

再來移動 sliding window 時，如果移動 `right`，就要更新 sliding window，由於同時只會更新一個 Hash Table 的欄位，所以欄位中變得不一樣的瞬間，更新 match 就好，這樣是最效率的方式。

```cpp
int n = s1.size(), m = s2.size();
while(right < m){
    int inIndex = s2[right] - 'a';
    window[inIndex]++;
    if(window[inIndex] == umap[inIndex] + 1) match--;
    else if(window[inIndex] == umap[inIndex]) match++;

    right++;
    if(match == 26) return true;
}
```

再來當 sliding window 已經到達 `s1` 的 size 了，就要開始收縮 `left`，一樣在變換的瞬間更新計數器就好

```cpp
int n = s1.size(), m = s2.size();
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
```

到這邊就寫完了。

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
