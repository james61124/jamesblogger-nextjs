---
title: "[ Leetcode 151 ] Reverse Words in a String | 解題思路分享"
date: "2025-09-01"
author: James
tags: String,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
id: e4de1959-fabf-4f29-8ee9-3b44835ada01
---

給一個 string `s`，可能包含多個空格，要反轉字串中的單字順序，並且保證單字之間只有一個空格。

題目連結🔗：[https://leetcode.com/problems/reverse-words-in-a-string/](https://leetcode.com/problems/reverse-words-in-a-string/)

### **題目分析**

這題最簡單的做法就是直接利用 `getline` 把每個字都分離出來重新組裝就好，像是這樣

```cpp
string reverseWords(string s) {
    istringstream iss(s);
    string token;
    vector<string>tokens;
    string res = "";

    while(getline(iss, token, ' ')){
        tokens.push_back(token);
    }

    for(int i = tokens.size() - 1; i >= 0; i--){
        if(tokens[i].size()) res += tokens[i] + " "; 
    }
    res.pop_back();

    return res;
}
```

這實作起來非常快，但是我們需要多開一個 vector 的空間儲存這些 tokens，所以是不是有辦法可以 in-place 就完成這些轉換呢？

### **解題思路**

這題我們分成三個步驟來解：

> 1. 去除多餘的空格<br>
> 2. reverse 整個 string，想辦法先把單字放到對的位置上<br>
> 3. 每個單字再各別 reverse

這樣就可以在 O(n) 的時間內 in-place 完成這題所求，舉例來說，如果 s = ` The sky   is  blue`

> 1. 去除多餘空格後，s = `The sky is blue`<br>
> 2. reverse 整個 string，s = `eulb si yks ehT`<br>
> 3. 最後每個單字各別 reverse 即可，s = `blue is sky The`

想法有了，不過實作起來其實有點複雜，下面來慢慢討論

#### **去除多餘的空格**

最有效率的方法是利用 Two Pointers `i`, `j`，其中 `i` 代表新的字串的位置，`j` 則一直往前跑，簡單來說，如果 `j` 遇到的是字母，就直接把它往 `i` 的位置放同時兩個 pointers 都往前跑，而 `j` 遇到空格時，丟一個空格到 `i` 的位置，`j` 就一直往前跑直到沒有空格，這樣就可以把多餘個空格去除了，最後再 resize string 變成 `i` 的長度即可

```cpp
int i = 0, j = 0;
int n = s.size();
while(i < n && s[i] == ' ') i++;
while(i < n){
    while(i < n && s[i] != ' ') s[j++] = s[i++];
    s[j++] = ' ';
    while(i < n && s[i] == ' ') i++;
}
s.resize(j - 1);
n = s.size();
```

#### **reverse 整個 string**

這步可以用一個 function 就解決

```cpp
reverse(s.begin(), s.end());
```

#### **每個單字再各別 reverse**

這邊就不能像上面一樣用 `reverse` function 解決，因為我們還得分離出每一個單字的位置，這邊我們需要兩個 pointers `start`, `end`，分別代表每個字的最前面跟最後面，當確定 `start`, `end` 的位置後，可以直接進行一個簡單的 reverse，像這樣

```cpp
while(start < end) swap(s[start++], s[end--]);
```

也就是說我們只要分析出每個字的 `start`, `end` 就好，那因為多餘的空格都已經被消滅了，所以單字的排列就很規律，一開始先將 `start` 定位到最前面，接著往後 iterate 直到遇到空格，此時就可以確定 `end` 的位置，執行完 reverse 就再往後做一樣的事情就好，寫出來會像這樣

```cpp
i = 0;
int start = 0;
int end = 0;
while(i < n){
    while(i < n && s[i] != ' ') i++;
    end = i - 1;
    while(start < end) swap(s[start++], s[end--]);
    i++;
    start = i;
    end = i;
}
```

到這邊就完成這題了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
string reverseWords(string s) {
    int i = 0, j = 0;
    int n = s.size();
    while(i < n && s[i] == ' ') i++;
    while(i < n){
        while(i < n && s[i] != ' ') s[j++] = s[i++];
        s[j++] = ' ';
        while(i < n && s[i] == ' ') i++;
    }
    s.resize(j - 1);
    n = s.size();

    reverse(s.begin(), s.end());

    i = 0;
    int start = 0;
    int end = 0;
    while(i < n){
        while(i < n && s[i] != ' ') i++;
        end = i - 1;
        while(start < end) swap(s[start++], s[end--]);
        i++;
        start = i;
        end = i;
    }

    return s;
}
```