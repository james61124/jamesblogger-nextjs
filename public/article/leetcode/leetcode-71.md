---
title: "[ Leetcode 71 ] Simplify Path | 解題思路分享"
date: "2025-10-09"
author: James
tags: String,Stack,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 87c24057-d959-49fb-ab24-0b1910bf82ca
---

給一個 Unix 風格的檔案路徑，要把它 simplify 成標準格式。

題目連結🔗：[https://leetcode.com/problems/simplify-path/](https://leetcode.com/problems/simplify-path/)

### **問題分析**

這題可以利用 istringstream 來將 string 用 `/` 切開成一個一個 token，再來只要處理掉幾種特殊的 rules 即可，像是遇到 `..` 需要倒退一個 folder，所以我們可以將所有 token 都先存到 stack 中，如果遇到 `..` 就 pop 掉一個。

這樣做沒什麼問題，只是最後真的要輸出 result 時，利用 stack 一個一個 pop 出來結果會反過來，所以我們可以選擇不要將結果存到 stack 中，只要存到一個可以 `pop_back()` 的 data structure，但最後 iterate 時可以從頭走的，那用 vector 就可以了。

### **解題思路**

再來就照順序實作，先將 `path` 利用 `/` 切成很多 token

```cpp
istringstream iss(path);
string token;
while(getline(iss, token, '/')){
    // ...
}
```

再來處理特殊 rules，如果遇到 `..` 代表要退回上一個 folder，所以一個 token 從 vector 裡面 pop 出來。如果遇到 `.` 或是空的 token，表示都可以直接忽略，因為這些都是要被省略的部分，寫起來會像這樣

```cpp
vector<string>vec;

istringstream iss(path);
string token;
while(getline(iss, token, '/')){
    if(token == ".."){
        if(vec.size() > 0) vec.pop_back();
        continue;
    }
    if(token == "." || token == "") continue;
    vec.push_back(token);
}
```

最後把 vector 裡的東西拿出來組合成 result 即可

```cpp
if(vec.size() == 0) return "/";

string result = "";
for(int i = 0; i < vec.size(); i++) result += "/" + vec[i];
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
string simplifyPath(string path) {
    vector<string>vec;

    istringstream iss(path);
    string token;
    while(getline(iss, token, '/')){
        if(token == ".."){
            if(vec.size() > 0) vec.pop_back();
            continue;
        }
        if(token == "." || token == "") continue;
        vec.push_back(token);
    }

    
    if(vec.size() == 0) return "/";

    string result = "";
    for(int i = 0; i < vec.size(); i++) result += "/" + vec[i];
    return result;
}
```

