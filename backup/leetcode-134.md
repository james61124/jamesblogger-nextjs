---
title: "[ Leetcode 134 ] Gas Station | 解題思路分享"
date: "2025-06-17"
author: James
tags: Array,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---



題目連結 🔗：[https://leetcode.com/problems/gas-station/](https://leetcode.com/problems/gas-station/)

### **問題分析**

最直覺的想法，就是 O(n^2) 的解法，

### **解題思路 - Greedy**



**Time Complexity** - `O(2^n x n)`，每個切點都可以決定要不要切，所以會產生 2^(n-1) 種組合，每條路徑最長是 n，需要複製進去 result，所以是 O(n)<br>
**Space Complexity** - `O(n^2)`，因為 dp table

### **Implementation**

```cpp
void backtracking(vector<vector<bool>>&dp, vector<vector<string>>&result, vector<string>&ans, string s, int start){
    if(start == s.size()) {
        result.push_back(ans);
        return;
    }

    for(int end = start; end < s.size(); end++){
        if(dp[start][end]){
            ans.push_back(s.substr(start, end - start + 1));
            backtracking(dp, result, ans, s, end + 1);
            ans.pop_back();
        }
    }
}

vector<vector<string>> partition(string s) {
    int n = s.size();
    vector<vector<bool>>dp(n, vector<bool>(n, false));
    vector<vector<string>>result;
    vector<string>ans;

    for(int i = n - 1; i >= 0; i--){
        for(int j = i; j < n; j++){
            if(j - i == 0) dp[i][j] = true;
            else if(j - i == 1) dp[i][j] = (s[i] == s[j]);
            else dp[i][j] = dp[i+1][j-1] && s[i] == s[j];
        }
    }

    backtracking(dp, result, ans, s, 0);

    return result;
}
```

### **其他想法 - Manachers Algorithm**

但我就在思考，dp[i][j] 如果用 Transition Function 更新的話，dp table 需要更新 O(n^2)，但是可能有好大一部分都是 false，如果用 Manachers Algorithm 算出每個 char 的最大回文半徑 p[i]，這樣只需要 O(n)，再來利用 p[i] 就可以只更新 true 的部分了，是不是會比較快？

[[ Algorithm ] Manachers Algorithm | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/manacher)

所以嘗試實作了一下，Manachers Algorithm 的部分都在上面那篇文章了就不特別講

```cpp
string preprocess(const string& s) {
    string t = "^";
    for (char c : s) {
        t += "#" + string(1, c);
    }
    t += "#$";
    return t;
}

int manacher(string s, vector<int>&p) {
    if (s.empty()) return 0;
    string t = preprocess(s);

    int n = t.size();
    p.resize(n, 0);

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

    return n;
}

vector<vector<string>> partition(string s) {
    int n = s.size();
    vector<vector<bool>>dp(n, vector<bool>(n, false));
    vector<vector<string>>result;
    vector<string>ans;
    vector<int>p;

    int m = manacher(s, p);
    for (int i = 2; i < m - 2; ++i) {
        int len = p[i];
        int centerIndex = (i - 1) / 2; 

        if (i % 2 == 1) {
            int l = centerIndex - len / 2;
            int r = centerIndex + len / 2 - 1;
            while(l <= r) {
                dp[l][r] = true;
                l++;
                r--;
            }
        }
        else {
            int l = centerIndex - (len / 2);
            int r = centerIndex + (len / 2);
            while(l <= r) {
                dp[l][r] = true;
                l++;
                r--;
            }
        }
    }

    backtracking(dp, result, ans, s, 0);
    return result;
}
```

不過後來的結論是沒有比較快，因為雖然可以用 O(n) 計算出 p[i]，但是更新 dp[i][j] 這件事情原則上還是 `O(n^2)`，假設 p[i] = 10，不是計算出最左跟最右就結束，中間也全部都是回文都得更新，所以其實還是 `O(n^2)`，但沒關係就記錄一下。

