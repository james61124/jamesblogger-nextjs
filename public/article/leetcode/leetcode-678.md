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

給一個 string，裡面包含 `(`, `*`, `)`，其中 `*` 可以轉成 `(`, `)` 或空字串，判斷該 string 是不是合法的括號組合。

題目連結 🔗：[https://leetcode.com/problems/valid-parenthesis-string/](https://leetcode.com/problems/valid-parenthesis-string/)

### **問題分析**

這題如果用一般解括號的題目利用 Stack 解題，會發現時間複雜度會非常高，因為 `*` 有三種狀況，如果每一種狀況都 dfs 出去，時間複雜度會成指數成長。

這題的核心想法在於，我們不需要知道具體哪一條路是正確的，我們只要確定有路可以成功就可以了。`*` 如果當成 `)` 可以減少目前左括號的數量，反過來說如果當成 `(` 就會增加左括號數量，而正確的路會落在這個區間，也就是說，我們可以設兩個變數 `low`, `high`，`low` 代表目前左括號最少的數量，`high` 代表目前左括號最多的數量，如果最後結束的時候左括號最少的數量剛好是 0，表示所有左括號都有辦法被不管 `*` 或是 `)` 消除，那就可以回傳 `true`。

### **解題思路 - 區間上下界 Greedy**

講白話一點，如果 `*` 全部都當成 `)`，那就是 `low`，如果全部都當成 `(`，那就是 `high`。

我們可以來計算這兩個變數的數量，當遇到 `(`，表示需要處理的左括號變多了，所以 `low`, `high` 都需要加一，當遇到 `)`，表示我們有能力處理掉一個左括號，所以 `low`, `high` 都可以減一，而當遇到 `*`，因為有能力讓左括號增加也可以減少，所以 `low` 要減一，而 `high` 要加一。

```cpp
for(char c : s){
    if(c == '(') { 
        low++;
        high++;
    } else if(c == '*') {
        low--;
        high++;
    } else {
        low--;
        high--;
    }
}
```

再來我們會遇到幾種情況，如果 `high < 0`，表示左括號最多的數量已經是負數了，那就代表即使 `*` 全部變成左括號，右括號還是太多，那基本上就沒救了可以直接 return `false`。

```cpp
if(high < 0) return false;
```

那如果 `low < 0`，表示左括號最少的數量是負數，也就是說 `*` 如果全部變成右括號，左括號還是太多，但左括號太多不會出問題，因為 `*` 也可以變成 empty，所以這邊要注意的是，一旦發現 `low < 0`，要馬上校正回歸把 `low` 變成 0，意思就是讓其中一個 `*` 強制變成 empty，如果沒有這樣做就會出現一些問題，像是 `s` = `*(` 理論上是過不了的，但如果我們沒有在第一個 char 把 low 校正回歸，看到左括號的時候 low 就會變回 ０ 我們就會以為這個是 valid，但實際上這個 `*` 一定要強制轉成 empty。

```cpp
if(low < 0) low = 0;
```

最後如果左括號最少的數量剛好落在 0，表示所有左括號都能夠被消滅，那就可以 return `true`。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool checkValidString(string s) {
    int low = 0, high = 0;
    for(char c : s){
        if(c == '(') { 
            low++;
            high++;
        } else if(c == '*') {
            low--;
            high++;
        } else {
            low--;
            high--;
        }

        if(high < 0) return false;
        if(low < 0) low = 0;
    }

    return (low == 0);
}
```
