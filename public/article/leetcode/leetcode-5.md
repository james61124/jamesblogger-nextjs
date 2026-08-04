---
title: "[ Leetcode 5 ] Longest Palindromic Substring | 解題思路分享"
date: "2025-05-22"
author: James
tags: String,DP,Manacher,EAC,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: 114d4423-05ae-4982-ba7a-c5a79d611fea
---

給你一個字串 `s`，找出最長的回文 substring 並回傳它。

題目連結 🔗：[https://leetcode.com/problems/longest-palindromic-substring/](https://leetcode.com/problems/longest-palindromic-substring/)

## 問題分析

先劇透一下，這題的最佳解要用到 Manacher Algorithm，一個除了這題我目前還沒看到有任何題目可以用到這個的演算法，但一起來看一下。

這題最直接反應到的應該就是 Expand Around Center (EAC) 了，Palindromic Substring 有兩種形式，第一種 length 是奇數，第二種 length 是偶數，所以可以跑兩次 loop，第一次看中心點只有一個的情況，然後往外擴展看看是不是 Palindromic，同時更新最大長度，第二種就是看兩個 char 一樣的情況，把他們當中心點往外擴展。

## Expand Around Center (EAC)

這題方法比較直覺，我們直接來討論怎麼寫比較優雅。

對於基數跟偶數的狀況也可以寫兩次迴圈分別判斷，但這樣 code 會變得很冗長，所以應該有辦法把兩種判斷方法寫在一起，類似這樣：

```cpp
for(int i=0; i<s.size(); i++){
    int len1 = longestPalindromeHelper(...); // 奇數的情況
    int len2 = longestPalindromeHelper(...); // 偶數的情況
}
```

如果我們要把兩種情況寫在一起的話，可以直接建立 two pointers `left` 跟 `right`，如果是奇數的話就讓 `left = right` 就可以了，然後 while loop 往外擴展直到 Palindromic Substring 結束，寫成 function 就是這樣，return 的是 Palindromic Substring 的長度。

```cpp
int longestPalindromeHelper(string& s, int left, int right){
    while(left>=0 && right<s.size() && s[left]==s[right]){
        left--;
        right++;
    }

    return right - left - 1;
}
```

再來就很單純了，把最長的 length 更新上去，同時紀錄 left pointer 的位置，因為到時候 return 是傳回 substring，所以我們必須用到 `s.substr(index, length)` 這個 function，那就可以直接進實作。

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
int longestPalindromeHelper(string& s, int left, int right){
    while(left>=0 && right<s.size() && s[left]==s[right]){
        left--;
        right++;
    }

    return right - left - 1;
}

string longestPalindrome(string s) {
    int maxLen = 0, start = 0;
    for(int i=0; i<s.size(); i++){

        int len1 = longestPalindromeHelper(s, i, i);
        int len2 = longestPalindromeHelper(s, i, i+1);
        int len = max(len1, len2);

        if(len > maxLen){
            maxLen = len;
            start = i - (len - 1)/2;
        }
    }

    return s.substr(start, maxLen);
}
```

## 時間優化 - Manacher Algorithm

Manacher Algorithm 是一個 based on EAC 的演算法，他可以把時間複雜度從 O(n^2) 降到 O(n)，我另外寫了一篇文章專門講 Manacher's Algorithm，看完了這題基本上也就解了。

文章連結🔗：[[ Algorithm ] Manacher's Algorithm | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/manacher)

基本上步驟完全一樣，最後利用 p[i] 計算出 Longest Palindromic Substring 即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### Implementation

```cpp
string preprocess(const string& s) {
    string t = "^";
    for (char c : s) {
        t += "#" + string(1, c);
    }
    t += "#$";
    return t;
}

string longestPalindrome(string s) {
    if (s.empty()) return "";

    string t = preprocess(s);
    int n = t.size();
    vector<int> p(n, 0);

    int center = 0, right = 0;
    for (int i = 1; i < n - 1; i++) {
        int mirror = 2 * center - i;
        if (i < right) p[i] = min(right - i, p[mirror]);

        while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;

        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
    }

    // Find the longest palindrome
    int maxLen = 0, centerIndex = 0;
    for (int i = 1; i < n - 1; i++) {
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIndex = i;
        }
    }

    int start = (centerIndex - maxLen) / 2;
    return s.substr(start, maxLen);
}
```
