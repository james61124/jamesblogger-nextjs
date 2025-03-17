---
title: "[ Leetcode 3 ] Longest Substring Without Repeating Characters | 解題思路分享"
date: "2025-03-03"
author: James
tags: String,Sliding Window,Hash Table
difficulty: Medium
image: /images/program/leetcode.jpeg
description: ""
readTime: 1
---

Given a string `s`, find the length of the **longest substring** without duplicate characters.

**Example 1**:

> Input: s = "abcabcbb"<br>
> Output: 3<br>
> Explanation: The answer is "abc", with the length of 3.

**Example 2**:

> Input: s = "bbbbb"<br>
> Output: 1<br>
> Explanation: The answer is "b", with the length of 1.

**Example 3**:

> Input: s = "pwwkew"<br>
> Output: 3<br>
> Explanation: The answer is "wke", with the length of 3.<br>
> Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
 

**Constraints**:

- `0 <= s.length <= 5 * 104`
- `s` consists of English letters, digits, symbols and spaces.

<p></p>

題目連結🔗：[https://leetcode.com/problems/longest-substring-without-repeating-characters/](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

### **問題分析**

目標是要找到所有沒有重複 character 的 substring，所以表示我們必須檢查每一個 substring。

### **暴力解法 (Brute Force)**

最直覺的暴力解法是列舉所有可能的 substring，檢查是否有 repeated character，但這樣的時間複雜度是 O(n²)，一定會超時，所以我們需要更優的解法。

### **解題思路 - Variable Length Sliding Window**

我們如果使用 Sliding Window 就可以避免去看到一些不必要的 substring，所以我們可以從 left = 0, right = 0 開始，right 先逐步往右看，當遇到 repeated characters 的時候 left 再縮進來，不過這裡會遇到兩個問題：

1. 如何判斷遇到 repeated characters
2. left 要怎麼往前移動

### **如何判斷遇到 repeated characters?**

right 在移動時，可以把遇到的 character 丟進去一個 search 是 O(1) 的 data structure 裏面，也就是 hash table，所以我們可能有 unordered_map 或是 unordered_set 可以選擇，可以根據後面的需求來決定要選哪一個。

### **left 要怎麼往前移動？**

一個最穩的方法就是我們把 right 遇到的 character 存入 unordered_set，再來一直擴展 right 直到遇到 repeated character 時，left 逐步向右移動收縮 sliding window，每動一次就把這個 character 從 unordered_set 裡 erase 出來，表示這個 character 已經不在 sliding window 裡了，直到 left 遇到 right 遇到的那個 repeated character，然後 right 再繼續往前探索，這樣就可以確保 sliding window 裡面沒有 repeated character，但這樣 left 還是會需要一個 while loop iterate 幾乎整個 string。

最快的方式是把 right 遇到的 character 存入 unordered_map，並且同時記錄他的 index，所以當 right 遇到 repeated character 時，可以馬上知道上一次遇到的 index 是甚麼，這個時候 left 有兩個選擇，如果發現這個 index 比 left 本身小，表示這個 repeated character 已經不在 sliding window 內了，所以 left 就不動，如果這個 index 還在 sliding window 內，那 left 就修正成 index + 1 縮小 sliding window，這樣我們就可以不用 erase 這個 character 也不用慢慢收縮 sliding window。

**Time Complexity** - `O(n)`，每個元素最多被 right 掃過。<br>
**Space Complexity** - `O(min(n,m))`，n 是 string 長度，m 是 26 ( 因為只有英文字母 )

### **Implementation**

```cpp
int lengthOfLongestSubstring(string s) {
    int left = 0;
    int right = 0;
    int result = 0;
    unordered_map<char, int>umap;

    while(right<s.size()){
        if(umap.count(s[right])>0){
            left = max(left, umap[s[right]]+1);
        }
        umap[s[right]] = right;
        result = max(result, right-left+1);
        right++;
    }
    return result;
}
```