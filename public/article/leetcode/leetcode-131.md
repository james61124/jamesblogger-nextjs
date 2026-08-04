---
title: "[ Leetcode 131 ] Palindrome Partitioning | 解題思路分享"
date: "2025-06-17"
author: James
tags: String,DP,Backtracking,Manacher
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 690e674b-9ca6-4cdb-8352-7a3cf5311bfa
---

給一個 string `s`，找出 所有可能的劃分方式，使得每個被切割出來的 substring 都是 palindrome。

題目連結 🔗：[https://leetcode.com/problems/palindrome-partitioning/](https://leetcode.com/problems/palindrome-partitioning/)

## 問題分析

這題要列出所有回文組合，所以理論上是 backtracking，但是還真的沒有很好想。

## 解題思路 - Backtracking

題目說要把整個字串切成好幾段，而且每段都必須是回文，最後輸出所有合法的切法，如果是人腦來解這題會怎麼切字串呢？是不是從第一個字元切，慢慢往後切 1 個字、2 個字、3 個字，每切一段就檢查：是不是回文？如果是，就往下繼續切剩下的部分，如果不是，就跳過這個切法，所以

> 要試每種切法 + 遞迴去處理剩下的字串

寫成 decision tree 會長這樣：

```sql
start = 0
├─ "a" 是回文 → 再對 "ab" 做切割
│   ├─ "a" 是回文 → 再對 "b" 做切割
│   │   ├─ "b" 是回文 → 結束 ["a", "a", "b"]
│   │   └─
│   └─ "ab" 不是回文 → skip
├─ "aa" 是回文 → 再對 "b" 做切割
│   ├─ "b" 是回文 → 結束 ["aa", "b"]
└─ "aab" 不是回文 → skip
```

以上的 decision tree 可以簡單的寫成下面的 pesudo code:

```cpp
function backtracking(end){
    if end == n:
        ans add to result
        return;

    for end from start to n-1
        if s[start...end] is palindrome :
            s[start...end] add to ans
            backtracking(end + 1)
            remove last element from ans
}
```

再來我們就會發現，我們需要一個可以快速判斷 `s[start...end]` 是不是 palindrome 的方法，最快的解就是 O(1)，那要達成 O(1) 就是得建表，所以 dp 就出場了。

我們可以先預處理想辦法先找到所有 palindrome 的區段然後建表，到時候遇到就直接查表，因為一個區段需要 `start`, `end` 兩個變數，所以可以先定義 dp[i][j] 表示「s[i...j] 是否是 palindrome」。

而 s[i...j] 是否是 palindrome 是可以由前面的狀態來推估的，我們需要考慮以下三種狀況：

> 1. 如果 `i == j`，表示區段內只有一個 char，那一定會是 palindrome，也可能是其他單數回文的中心<br>
> 2. 如果 `j - i == 1`，表示區段內只有兩個 char，那如果 `s[j] == s[i]` 表示這組是回文，也就是雙數回文的中心<br>
> 3. 那剩下的部分，如果往內縮的區段 `dp[i+1][j-1]` 是 palindrome 而且 `s[i] == s[j]`，那就代表 `s[i...j]` 也是 palindrome

寫成 Transition Function 大概是這樣：

```cpp
if(j - i == 0) dp[i][j] = true;
else if(j - i == 1) dp[i][j] = (s[i] == s[j]);
else dp[i][j] = dp[i+1][j-1] && s[i] == s[j];
```

到這邊我們就想完大致的流程了，那我們先從 backtracking 開始實作，基本上都跟 pesudo code 一樣

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
```

再來 dp[i][j] 的部分要思考一下怎麼更新，因為 dp[i][j] 會用到 dp[i+1][j-1] 的資訊，如果全部正著更新，`i+1` 的資訊還沒計算到 i 就會用到它了，所以 i 層要反著更新，像這樣：

```cpp
for(int i = n - 1; i >= 0; i--){
    for(int j = i; j < n; j++){
        if(j - i == 0) dp[i][j] = true;
        else if(j - i == 1) dp[i][j] = (s[i] == s[j]);
        else dp[i][j] = dp[i+1][j-1] && s[i] == s[j];
    }
}
```

所以寫進 main function :

```cpp
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

**Time Complexity** - `O(2^n x n)`，每個切點都可以決定要不要切，所以會產生 2^(n-1) 種組合，每條路徑最長是 n，需要複製進去 result，所以是 O(n)<br>
**Space Complexity** - `O(n^2)`，因為 dp table

## Implementation

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

## 其他想法 - Manachers Algorithm

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

