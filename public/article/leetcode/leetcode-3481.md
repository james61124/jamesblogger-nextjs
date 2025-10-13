---
title: "[ Leetcode 3481 ] Apply Substitutions | 解題思路分享"
date: "2025-09-28"
author: James
tags: Graph,DFS,String,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
---

題目給一個 `text` 還有一份 `replacements` 的對應表，`text` 會出現 `%<key>%` 的 placeholder，要去 `replacements` 裡面找到 key 對應的 value 把它替換掉，但是要注意的是在這個 value 裡面可能也會有 `%<key>%`，所以要持替換下去直到沒有出現 `%`。

題目連結 🔗：[https://leetcode.com/problems/apply-substitutions/](https://leetcode.com/problems/apply-substitutions/)

### **問題分析**

這題第一眼看到就覺得暴力解是 DFS，例如說 `A` 的 value 裡面可能會有 `B`，`B` 的 value 裡面可能會有 `C`，所以一定要從 leaf node 開始一路替換回來，那其實就是 DFS，但因為他用 string 包裝過看起來變得很複雜，結果他還真的就是 DFS 而已。

### **解題思路 - DFS**

我們先來想辦法處理 string，如果要在 string 中 replace `%<key>%` 變成另一個 string `pattern`，最快的方法不是用 insert，而是開一個新的 string，把前面的部分 append 進來，再來把 `pattern` append 進來，最後把剩餘部分 append 進來。

我們先不要管 dfs 的部分，也不要管 `pattern` 怎麼得到的，我們會 iterate 整個 string，當沒有遇到 `%` 表示都正常，就把所有東西都丟到 `out`

```cpp
string expandString(string &s) {
    string out = "";
    for(int i = 0; i < s.size(); i++){
        if (s[i] != '%') {
            out += s[i];
            continue;
        }
    }
    return out;
}
```

如果遇到 `%`，表示有東西需要被 replace，就把 `pattern` 加進來，然後因為這題 `%<key>%` 中 `<key>` 一定是大寫的字母，所以 i 往後走兩格就好，寫起來像這樣

```cpp
string expandString(string &s) {
    string out = "";
    for(int i = 0; i < s.size(); i++){
        if (s[i] != '%') {
            out += s[i];
            continue;
        }

        out += pattern; // 先不管 pattern 怎麼來的
        i += 2;
    }
    return out;
}
```

接下來我們要找到要替換的 `pattern` 是什麼，這就是一個 dfs 的過程，我們一路 traversal 下去直到碰到 leaf node，然後一路更新回來，所有結果都把它存到 Hash Table 裡面就好，至於已經更新過的 node 就代表他們可以直接用，所以可以用個 `visit` 來記錄哪些 node 已經更新過了。

簡單記錄程式碼，首先 `dfs` 要回傳的是這個 key 對應到真正的 pattern，所以直接 append 到 `out`

```cpp
string expandString(string &s) {
    string out = "";
    for(int i = 0; i < s.size(); i++){
        if (s[i] != '%') {
            out += s[i];
            continue;
        }

        string keyToReplace = s.substr(i + 1, 1);
        out += dfs(keyToReplace);
        i += 2;
    }
    return out;
}
```

再來 dfs 時，如果遇到已經 visit 過的 node 就直接 return Hash Table 裡面的值，如果還沒那就同樣再進行一次替換，直到替換完成再放進去 Hash Table

```cpp
string dfs(string key) {
    string s = umap[key];
    if(visit[key[0] - 'A']) return s;
    visit[key[0] - 'A'] = true;

    string out = expandString(s);
    umap[key] = out;
    return out;
}
```

大概就這樣而已，底下附上完整程式碼

#### **Implementation**

```cpp
class Solution {
public:

    unordered_map<string, string>umap;
    vector<bool>visit;

    string expandString(string &s) {
        string out = "";
        for(int i = 0; i < s.size(); i++){
            if (s[i] != '%') {
                out += s[i];
                continue;
            }

            string keyToReplace = s.substr(i + 1, 1);
            out += dfs(keyToReplace);
            i += 2;
        }
        return out;
    }

    string dfs(string key) {
        string s = umap[key];
        if(visit[key[0] - 'A']) return s;
        visit[key[0] - 'A'] = true;

        string out = expandString(s);
        umap[key] = out;
        return out;
    }

    string applySubstitutions(vector<vector<string>>& replacements, string text) {
        for(auto &table : replacements) umap[table[0]] = table[1];

        visit.resize(26, false);
        string out = expandString(text);
        return out;
    }
};
```
