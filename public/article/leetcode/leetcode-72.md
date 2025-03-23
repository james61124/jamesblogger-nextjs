---
title: "[ Leetcode 72 ] Edit Distance | 解題思路分享"
date: "2025-03-23"
author: James
tags: String,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

計算從 string `word1` 轉換為 `word2` 所需的最小 operation 數量，可以 insert, delete 或是 replace。

題目連結 🔗：[https://leetcode.com/problems/edit-distance/](https://leetcode.com/problems/edit-distance/)

### **解題思路 - DP (Double-Sequence Linear DP Problem)**

這題可以透過 Double-Sequence Linear DP 來解，因為他的輸入是兩個 string，所以我們就開一個 dp[i+1][j+1] 來代表 「word1 前 i 個字元」轉換成「word2 前 j 個字元」最少需要的 operation 數量。

首先如果 word1 或是 word2 是 empty string，轉換需要的 operation 就全部都是 insert，所以初始化 dp 會長下面這樣：

![DP](/images/leetcode/leetcode-72/initial.jpg)

再來我們分兩種情況討論，如果 `word1[i-1] == word2[j-1]`，那 `dp[i][j] = dp[i-1][j-1]`，因為 dp[i-1][j-1] 表示「word1 前 i-2 個字元」轉換成「word2 前 j-2 個字元」最少需要的 operation 數量，那此時 word1 加上第 i-1 個字元還有 word2 加上第 j-1 個字元不需要耗費多餘的 operation，因為兩個字元是一樣的，畫成表格就是下面這樣：

![DP](/images/leetcode/leetcode-72/same.jpg)

那 `word1[i-1] != word2[j-1]` 會有三種情況，這個 char 有可能是 insert, delete 或是 replace 來的，底下把這三種分開討論

1. 如果 `dp[i][j] = dp[i-1][j-1] + 1`，表示用 replace 把 word1 轉成 word2 需要的 operation，用下面的例子說明：

```
word1 前 i-2 個 = "ro"
word2 前 j-2 個 = "ho"
dp[i-1][j-1] = 1

word1 前 i-1 個 = "ros"
word2 前 j-1 個 = "hor"
dp[i][j] = dp[i-1][j-1] + 1 = 2
```

![DP](/images/leetcode/leetcode-72/replace.jpg)

2. 如果 `dp[i][j] = dp[i][j-1] + 1`，表示用 insert 把 word1 轉成 word2 需要的 operation，用下面的例子說明：

```
word1 前 i-1 個 = "r"
word2 前 j-2 個 = "h"
dp[i][j-1] = 1

word1 前 i-1 個 = "r"
word2 前 j-1 個 = "ho"
dp[i][j] = dp[i][j-1] + 1 = 2
```

![DP](/images/leetcode/leetcode-72/insert.jpg)

3. 如果 `dp[i][j] = dp[i-1][j] + 1`，表示用 delete 把 word1 轉成 word2 需要的 operation，用下面的例子說明：

```
word1 前 i-1 個 = "r"
word2 前 j-2 個 = "h"
dp[i][j-1] = 1

word1 前 i-1 個 = "ro"
word2 前 j-1 個 = "h"
dp[i][j] = dp[i-1][j] + 1 = 2
```

![DP](/images/leetcode/leetcode-72/delete.jpg)

所以 dp[i][j] 的值可能會從三個 operation 更新過來，我們只要找這三種 operation 哪一個最小更新上去就行了

```cpp
dp[i][j] = min(dp[i-1][j-1], min(dp[i-1][j], dp[i][j-1])) + 1;
```

![DP](/images/leetcode/leetcode-72/min.jpg)

最後 iterate 結束，`dp[word1.size()][word2.size()]` 就是答案

**Time Complexity** - `O( m × n )`，因為 iterate 過兩個 array<br>
**Space Complexity** - `O( m × n )`，因為開了一個 m x n 的 2D array

#### **Implementation**

```cpp
int minDistance(string word1, string word2) {
    vector<vector<int>>dp(word1.size()+1, vector<int>(word2.size()+1, 0));
    for(int i=0; i<=word1.size(); i++){
        dp[i][0] = i;
    }
    for(int j=0; j<=word2.size(); j++){
        dp[0][j] = j;
    }

    for(int i=1; i<=word1.size(); i++){
        for(int j=1; j<=word2.size(); j++){
            if(word1[i-1] == word2[j-1]) 
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = min(dp[i-1][j-1], min(dp[i-1][j], dp[i][j-1])) + 1;
        }
    }

    return dp[word1.size()][word2.size()];
}
```


