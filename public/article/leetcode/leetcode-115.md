---
title: "[ Leetcode 115 ] Distinct Subsequences | 解題思路分享"
date: "2025-06-16"
author: James
tags: String,DP
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 9b3886c4-1e4f-4c29-b49e-2def3505ed25
---

給兩個 string `s` 和 `t`，求在 `s` 中有多少個 subsequences 等於 `t`。

題目連結 🔗：[https://leetcode.com/problems/distinct-subsequences/](https://leetcode.com/problems/distinct-subsequences/)

### **問題分析**

這題真的有點難想到，所以直接介紹吧，他要用 DP 解。

### **解題思路 - DP**

首先我們定義 `dp[i][j]` 為「`t[0...j-1]` 在 `s[0...i-1]` 有多少 subsequences」，我們來慢慢思考 `t[0...j-1]` 跟 `s[0...i-1]` 的關係。

當 `t[j-1]` 跟 `s[i-1]` 一樣的時候，我們有兩種選擇，「選 `s[i-1]` 當成計算 `t[0...j-1]` subsequences 的材料」或是「不選 `s[i-1]` 當成計算 `t[0...j-1]` subsequences 的材料」。

如果是第一種，選 `s[i-1]` 當成計算 `t[0...j-1]` subsequences 的材料，代表把 `s[i-1]` 跟 `t[j-1]` 配對後，還剩下 `s[0...i-2]` 跟 `t[0...j-2]` 需要配對，因此對應到 `dp[i-1][j-1]`，如果是第二種，不選 `s[i-1]` 當成計算 `t[0...j-1]` subsequences 的材料，代表我們放棄 `s[i-1]`，要在 `s[0...i-2]` 中找 `t[0...j-1]`，也就對應到 `dp[i-1][j]`，所以 Transition Function 的第一步是

```cpp
if(s[i-1] == t[j-1]) dp[i][j] = dp[i-1][j-1] + dp[i-1][j];
```

當 `t[j-1]` 跟 `s[i-1]` 不一樣的時候，就不能選 `s[i-1]` 當成計算 `t[0...j-1]` subsequences 的材料了，所以我們必須放棄 `s[i-1]`，要在 `s[0...i-2]` 中找 `t[0...j-1]`，也就對應到 `dp[i-1][j]`，所以 Transition Function 的第二步是

```cpp
if(s[i-1] != t[j-1]) dp[i][j] = dp[i-1][j];
```

到這邊我們就完成 Transition Function 了，再來我們來思考初始化的狀況，一共有三種情況：

> 1. `dp[0][0]` = 1，因為空字串等於空字串，只有一種方法<br>
> 2. `dp[i][0]` = 1，因為要從任何字串中找到空字串，也只有一種方法，就是全不選<br>
> 3. `dp[0][j]` = 0，因為要從空字串中找到任意字串，這是不可能的事情

```cpp
for (int i = 0; i <= m; i++) dp[i][0] = 1;
```

那 DP 寫到這邊基本上就結束了，最後的答案就是 dp[m][n]，也就是整個 dp table 最右下角那格。

```cpp
int m = s.size(), n = t.size();
vector<vector<unsigned long long>>dp(m + 1, vector<unsigned long long>(n + 1, 0));

for (int i = 0; i <= m; i++) dp[i][0] = 1;
for(int i = 1; i <= m; i++){
    for(int j = 1; j <= n; j++){
        if(s[i-1] == t[j-1]) dp[i][j] = dp[i-1][j-1] + dp[i-1][j];
        else dp[i][j] = dp[i-1][j];
    }
}

return dp[m][n];
```

再來我們會發現，這個 dp table 一次只專注兩格的資訊，那我們根本就不用定義出整個 2D DP Table，可以優化成 1D 的，像是下面這樣：

```cpp
int m = s.size(), n = t.size();
vector<unsigned long long>dp(n + 1, 0);
dp[0] = 1;
for(int i = 1; i <= m; i++){
    for(int j = n; j >= 1; j--){
        if(s[i-1] == t[j-1]) dp[j] += dp[j-1];
    }
}
return dp[n];
```

不過這邊要注意，j 這層要反向更新，因為我們會拿到 j-1 那格的資訊，如果正向更新，就拿不到舊的 j-1 的資訊了。

**Time Complexity** - `O(m*n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**
```cpp
int numDistinct(string s, string t) {
    int m = s.size(), n = t.size();
    vector<unsigned long long>dp(n + 1, 0);
    dp[0] = 1;
    for(int i = 1; i <= m; i++){
        for(int j = n; j >= 1; j--){
            if(s[i-1] == t[j-1]) dp[j] += dp[j-1];
        }
    }
    return dp[n];
}
```