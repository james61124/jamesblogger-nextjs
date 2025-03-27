---
title: "[ Leetcode 5 ] Longest Palindromic Substring | 解題思路分享"
date: "2025-03-27"
author: James
tags: String,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/longest-palindromic-substring/](https://leetcode.com/problems/longest-palindromic-substring/)

### **問題分析**

先劇透一下，這題的最佳解要用到 Manacher Algorithm，一個除了這題我目前還沒看到有任何題目可以用到這個的演算法，但一起來看一下。

這題最直接反應到的應該就是 Expand Around Center (EAC) 了，Palindromic Substring 有兩種形式，第一種 length 是奇數，第二種 length 是偶數，所以可以跑兩次 loop，第一次看中心點只有一個的情況，然後往外擴展看看是不是 Palindromic，同時更新最大長度，第二種就是看兩個 char 一樣的情況，把他們當中心點往外擴展。

### Expand Around Center (EAC)

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

#### **Implementation**

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

### **時間優化 - Manacher Algorithm**

Manacher Algorithm 是一個 based on EAC 的演算法，他可以把時間複雜度從 O(n^2) 降到 O(n)，他的核心思想就在於，我們先在 string `s` 的每一個 char 中間穿插 "#"，這樣就可以確保每一個 Palindrome 都是奇數，再來維護一個 p[i] array 來紀錄這個回文的半徑，利用回文左右對稱的特性可以加速更新 p[i] 的過程，就不用每一個 center 都手動擴展一次，舉例來說：

```
newS : # b # a # b # a # d #
p[i] : 0 1 0 3 0 3 0 1 0 1 0
```

再來講一下 p[i] 更新的

#### **Implementation**

```cpp
string longestPalindrome(string s) {
    if (s.empty()) return "";

    string newS = "#";
    for(int i=0; i<s.size(); i++){
        newS += s[i];
        newS += "#";
    }

    vector<int>p(newS.size(), 0);
    int center = 0, right = 0, maxLen = 0, start = 0;
    for(int i=0; i<newS.size(); i++){
        
        if(i < right){
            p[i] = min(right - i, p[2 * center - i]);
        }

        while(i-p[i]-1>=0 && i+p[i]+1<newS.size() 
                    && newS[i-p[i]-1]==newS[i+p[i]+1]){
            p[i]++;
        }

        if(i + p[i] > right){
            center = i;
            right = center + p[i];
        }

        if(p[i] > maxLen){
            maxLen = p[i];
            start = (i - maxLen) / 2;
        }

    }

    return s.substr(start, maxLen);
}
```


### **DP**



#### **Implementation**
```cpp
string longestPalindrome(string s) {
    vector<vector<bool>>dp(s.size(), vector<bool>(s.size(), false));
    int left = 0, right = 0, maxLength = 1;

    for(int i=0; i<dp.size(); i++){
        for(int j=0; j<dp[0].size(); j++){
            if(i>=j) dp[i][j] = true;
        }
    }

    for(int i=dp.size()-1; i>=0; i--){
        for(int j=i+1; j<dp[0].size(); j++){
            int length = j-i+1;
            if(s[i] == s[j]) dp[i][j] = dp[i+1][j-1];
            if(length > maxLength && dp[i][j]){
                left = i;
                right = j;
                maxLength = length;
            }
        }
    }

    return s.substr(left, right-left+1);
}
```






### **解題思路 - Stack**

這題需要一個 stack，在 iterate string 的時候，如果碰到左括號，就把 char 塞進去 stack 裡，那如果碰到右括號 :
- 如果 stack 最上面的那個 element 不是相對應的左括號 -> invalid
- 如果是，就直接把這個 element pop 出來然後繼續 iterate

#### **如何判斷是不是相對應的 Parenthese?**

判斷是否是相對應的 parentheses，if-else 也可以，但是會比較慢也比較醜，這邊直接開 hash map 應該是最優雅的解。

#### **避免 Stack Empty Access**

如果碰到右括號時 stack 是空的，直接 call stack.top() 會報錯，所以就直接 return false 就可以了。

#### **收尾**

因為 iterate 結束的時候就會跳出回圈，如果最後一個 char 是左括號，那他在 push 進去 stack 之後就會跳出 loop 了，所以判斷是不是 valid 的 parentheses 直接看 stack 是不是空的就可以了。

**Time Complexity** - `O(n)`，因為 iterate 一個 string <br>
**Space Complexity** - `O(n)`，因為開了一個 stack

#### **Implementation**

```cpp
bool isValid(string s) {
    stack<char>st;
    unordered_map<char, char>mp = {{')', '('}, {'}', '{'}, {']', '['}};

    for(char c : s){
        if(mp.count(c)){
            if(st.empty() || mp[c] != st.top()) return false;
            else st.pop();
        } else st.push(c);
    }

    return st.empty();
}
```