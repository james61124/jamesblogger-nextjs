---
title: "[ Leetcode 97 ] Interleaving String | 解題思路分享"
date: "2025-06-16"
author: James
tags: String,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給三個 string `s1`、`s2` 和 `s3`，請判斷 `s3` 是否可以由 `s1` 和 `s2` 交錯（interleave）而成。

題目連結 🔗：[https://leetcode.com/problems/interleaving-string/](https://leetcode.com/problems/interleaving-string/)

### **問題分析**

先來確實了解題目，題目問的是是否能夠用 `s1`, `s2` 組合，而且是要完整的組合，也就是說，如果用「部分的 `s1`」跟「部分的 `s2`」組合也是不行的。

這題不太好想，要判斷 `s3` 是不是由 `s1`, `s2` 組合而來，可以一個一個字比，例如說先比 `s3[0]` 有沒有跟 `s1[0]` 或是 `s2[0]` 一樣，其中一個一樣那就往下走，兩個都一樣就先選一邊，假設選 `s1[0]`，那就繼續往下比 `s3[1]` 有沒有跟 `s1[1]` 或是 `s2[0]` 一樣，當完全沒有一樣的時候就退回剛剛兩邊都一樣的地方選另外一邊，這個是最暴力的 dfs 解法，但很明顯可以感覺到這樣會重複走很多冤枉路。

由剛剛的思路我們可以發現 `s3[i]` 要嘛是從 s1 來的要嘛是從 s2 來的，可以利用 Linear DP 思考看看。

### **解題思路 - DP**

我們可以定義一個 dp[i][j] 代表「`s3[0...i+j-1]` 是否能利用 `s1[0...i-1]` 跟 `s2[0...j-1]` 組合而成」，也就是 2D DP 中典型的「以 nums1 中前 i 個元素」與「以 nums2 中前 j 個元素」組成的解。

那 dp[i][j] 會從兩個地方來，如果 `s1[0...i-2]` 跟 `s2[0...j-1]` 可以組成 `s3[0...i+j-2]` ( 也就是 dp[i-1][j] = true )，同時 `s1[i-1]` 又等於 `s3[i+j-1]`，那就代表 `s3[0...i+j-1]` 可以用 `s1[0...i-1]` 跟 `s2[0...j-1]` 組合而成，而且最後一位是從 `s1` 來的，另一邊狀況也是一樣，如果 `s1[0...i-1]` 跟 `s2[0...j-2]` 可以組成 `s3[0...i+j-2]` ( 也就是 dp[i][j-1] = true )，同時 `s2[j-1]` 又等於 `s3[i+j-1]`，那就代表 `s3[0...i+j-1]` 可以用 `s1[0...i-1]` 跟 `s2[0...j-1]` 組合而成，而且最後一位是從 s2 來的，寫成 Transition Function 就是這樣：

```cpp
dp[i][j] = dp[i-1][j] && (s3[i+j-1] == s1[i-1]) || dp[i][j-1] && (s3[i+j-1] == s2[j-1])
```

dp 通常寫出 transition function 實作都很簡單，首先 dp[0][0] = true，因為 `s1`, `s2`, `s3` 全部都是 "" 時要回傳 `true`。

再來就用雙迴圈更新整個 dp table 就可以了，只需要注意 dp[i][j-1] 跟 dp[i-1][j] 不要 segmentation fault 即可。

```cpp
dp[0][0] = true;
for(int i = 0; i <= m; i++){
    for(int j = 0; j <= n; j++){
        if(i > 0) dp[i][j] = dp[i][j] || (dp[i-1][j] && s1[i-1] == s3[i+j-1]);
        if(j > 0) dp[i][j] = dp[i][j] || (dp[i][j-1] && s2[j-1] == s3[i+j-1]);
    }
}
```

最後因為 s3 一定要由完整的 s1, s2 組成，所以 s3 的 size 一定是 s1 + s2，而我們最後的答案就是 dp[m][n]。

```cpp
int m = s1.size(), n = s2.size();
vector<vector<bool>>dp(m + 1, vector<bool>(n + 1, false));
dp[0][0] = true;

if(m + n != s3.size()) return false; // size 要對
for(int i = 0; i <= m; i++){
    for(int j = 0; j <= n; j++){
        if(i > 0) dp[i][j] = dp[i][j] || (dp[i-1][j] && s1[i-1] == s3[i+j-1]);
        if(j > 0) dp[i][j] = dp[i][j] || (dp[i][j-1] && s2[j-1] == s3[i+j-1]);
    }
}

return dp[m][n]; // 答案在此
```

但我們會發現這個 dp table 實際上一次只關心兩格，我們可以把空間優化成 1d dp，一樣利用雙迴圈更新即可。

```cpp
bool isInterleave(string s1, string s2, string s3) {
    int m = s1.size(), n = s2.size();
    vector<bool>dp(n + 1, false);
    dp[0] = true;

    if(m + n != s3.size()) return false;
    for(int i = 0; i <= m; i++){
        for(int j = 0; j <= n; j++){
            if(i > 0) dp[j] = (dp[j] && s1[i-1] == s3[i+j-1]);
            if(j > 0) dp[j] = dp[j] || (dp[j-1] && s2[j-1] == s3[i+j-1]);
        }
    }

    return dp[n];
}
```

**Time Complexity** - `O(m*n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
bool isInterleave(string s1, string s2, string s3) {
    int m = s1.size(), n = s2.size();
    vector<bool>dp(n + 1, false);
    dp[0] = true;

    if(m + n != s3.size()) return false;
    for(int i = 0; i <= m; i++){
        for(int j = 0; j <= n; j++){
            if(i > 0) dp[j] = (dp[j] && s1[i-1] == s3[i+j-1]);
            if(j > 0) dp[j] = dp[j] || (dp[j-1] && s2[j-1] == s3[i+j-1]);
        }
    }

    return dp[n];
}
```