---
title: "[ Leetcode 767 ] Reorganize String | 解題思路分享"
date: "2025-03-12"
author: James
tags: String,Amazon
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 42c868bb-93b6-432a-a50f-2e7560a0fe43
---

給一個 string `s`，要 reorganize `s` 讓每個重複的字母都不相鄰，如果沒辦法就要回傳 ""

題目連結 🔗：[https://leetcode.com/problems/reorganize-string/](https://leetcode.com/problems/reorganize-string/)

## 問題分析

這題第一眼就知道要從數量最多的字開始放，但是關鍵在於要怎麼放，我們其實只要將數量最多的字母拆開來放，也就是先放偶數 index，剩下的字母再把空隙填滿就好了，這樣就確保重複的字母一定不會相鄰。

唯一會失敗的地方就是如果有字母的數量超過總數的一半，那表示不管怎麼放他一定會有相鄰的情況發生，那就直接回傳 "" 就好，我們來看實作

首先計算每種字母的數量並找到最多的

```cpp
int n = s.size();
int freq[26] = {0};
int maxValue = 0;
int maxIndex = -1;

for(char& c : s){
    int idx = c - 'a';
    freq[idx]++;
    if(freq[idx] > maxValue){
        maxValue = freq[idx];
        maxIndex = idx;
    }
}
```

再來如果有字母數量超過一半，就會失敗

```cpp
if(maxValue > (n + 1) / 2) return "";
```

我們先把數量最多的字母填完

```cpp
int i = 0;
string result(n,' ');
while(freq[maxIndex] > 0){
    result[i] = 'a' + maxIndex;
    i += 2;
    freq[maxIndex]--;
}
```

接下來把剩下的字母填完就好

```cpp
for(int c = 0; c < 26; c++){
    while(freq[c] > 0){
        if(i >= n) i = 1;
        result[i] = 'a' + c;
        i += 2;
        freq[c]--;
    }
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
string reorganizeString(string s) {
    int n = s.size();
    int freq[26] = {0};
    int maxValue = 0;
    int maxIndex = -1;

    for(char& c : s){
        int idx = c - 'a';
        freq[idx]++;
        if(freq[idx] > maxValue){
            maxValue = freq[idx];
            maxIndex = idx;
        }
    }

    if(maxValue > (n + 1) / 2) return "";

    int i = 0;
    string result(n,' ');
    while(freq[maxIndex] > 0){
        result[i] = 'a' + maxIndex;
        i += 2;
        freq[maxIndex]--;
    }

    for(int c = 0; c < 26; c++){
        while(freq[c] > 0){
            if(i >= n) i = 1;
            result[i] = 'a' + c;
            i += 2;
            freq[c]--;
        }
    }

    return result;

}
```
