---
title: "[ Algorithm ] KMP Algorithm | 核心概念與 Leetcode 題型解析"
date: "2025-03-08"
author: James
tags: Algorithm,KMP
image: /images/program/algorithm.png
description: ""
readTime: 2
---

如果想要在一個 string `text` 底下判斷 string `pattern` 是不是他的 substring，暴力解非常直覺，舉個例：

```
```

```cpp
vector<int> buildLPS(const string& pattern) {
    int m = pattern.size();
    vector<int> lps(m, 0);
    int len = 0;  // length of the previous longest prefix suffix

    for (int i = 1; i < m; ) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];  // 回溯
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

// 回傳 pattern 在 text 中出現的起始 index（可多個）
vector<int> KMP(const string& text, const string& pattern) {
    int n = text.size();
    int m = pattern.size();
    vector<int> lps = buildLPS(pattern);
    vector<int> result;
    
    int i = 0, j = 0;  // i for text, j for pattern

    while (i < n) {
        if (text[i] == pattern[j]) {
            i++; j++;
        }

        if (j == m) {
            result.push_back(i - j);  // match found
            j = lps[j - 1];           // 繼續找下一個 match
        } else if (i < n && text[i] != pattern[j]) {
            if (j != 0)
                j = lps[j - 1];  // 使用 lps 快速移動 pattern
            else
                i++;
        }
    }

    return result;
}
```

572