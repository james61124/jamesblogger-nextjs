---
title: "[ Leetcode 1547 ] Minimum Cost to Cut a Stick | 解題思路分享"
date: "2025-04-22"
author: James
tags: Array,DP,Sorting
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 823d018b-e182-43df-b804-00db81953059
---

有一根長度為 n 的木棍，並且你有一個整數陣列 cuts，其中 cuts[i] 表示你需要在位置 cuts[i] 上切這根木棍。每次切割會將木棍切成兩段，切割的成本等於這次被切的那段木棍的長度。目標是決定一個切割順序，讓總成本最小，並回傳成本。

題目連結 🔗：[https://leetcode.com/problems/minimum-cost-to-cut-a-stick/](https://leetcode.com/problems/minimum-cost-to-cut-a-stick/)

## 問題分析

這題最直覺的解法應該是 `cuts` 的每一種排列都切切看，但這樣的時間複雜度是 `O(n!)`，一定會太高，所以我們嘗試從 DP 想想看，因為是切線段的關係，所以可以傾向從 Interval DP 的方向想。

## 解題思路 - DP

對於 Interval DP 來說，我們會需要一個 dp[i][j]，這題一開始都沒什麼想法，所以 dp[i][j] 就先照著題目走，暫時定義成「i 到 j 這段的 minimum cost」，以範例的這題來說，

```cpp
n = 7, cuts = [1,3,4,5]
```

我們最後要的答案就是 dp[0][7]。

再來就是要想辦法找到 Transition Function，想到這裡我們就會發現，dp[i][j] 其實沒有辦法每一格都更新，舉例來說根本就不會出現 dp[1][2] 這種線段，因為 cuts 沒有辦法切在 2 的位置，所以我們要找到所有可行的線段中，該怎麼更新 dp[i][j]。

先簡化問題，如果看到 dp[0][1], dp[1][3], dp[3][4] 等等，這種都是沒有辦法切的，所以 dp[i][j] 就應該是 0。

再來如果看到 dp[0][3], dp[1][4] 這種中間可以切一刀的，因為只有一種可能性，所以 dp[i][j] 就是 (j-i)。

再往外看一點，如果看到 dp[0][4], dp[1][5] 這種中間可以切兩刀的，因為有兩種可能性，所以開始來思考 Transition Function 應該怎麼下手，以 dp[0][4] 來說，第一刀如果切在 1，那 cost 就會是 (4-0) 加上 dp[1][3] 的 cost，那如果第一刀切在 3，那 cost 就會是 (4-0) 加上 dp[0][3]，然後取這兩種 cost 的最小值，所以 Transition Function 我們就可以寫出一個最陽春的版本，對於每一個在 i, j 中間的 k，

```cpp
dp[i][j] = min(dp[i][k] + dp[k][j] + (j - i))
```

用剛剛的例子來想就合理了，因為 dp[0][1] 跟 dp[1][3] 這種不能切的都是 0

```cpp
dp[0][4] = dp[0][1] + dp[1][3] + (4 - 0) = 0 + 2 + 4 = 6 // k = 1
         = dp[0][3] + dp[3][4] + (4 - 0) = 3 + 0 + 4 = 7 // k = 3
dp[0][4] = min(6, 7) = 6
```

有了 Transition Function，我們要的答案是 dp[0][n]，再來要想的是我們如何更新這個 table，所以要找到 Transition Function 的 dependency，對於所有「可以切一刀」的情況，他的值會從「不能切」的來的，對於所有「可以切兩刀」的情況，他的值會從「可以切一刀」的情況來的，所以我們更新的順序應該是：

```
[ 不能切 ] -> [ 可以切一刀 ] -> [ 可以切兩刀 ] -> ...
```

舉上面的例子來說，用 `cuts = [1,3,4,5]` 來看，不能切的會先更新 dp[0][1], dp[1][3], dp[3][4]...，再來更新可以切一刀的 dp[0][3], dp[1][4]... 以此類推。

但因為在更新 dp[i][j] 實際上是 based on `cuts` 狀況，不會每一個格子都更新到，所以 dp[i][j] 只需要宣告 `cuts` 的大小就好，利用 `cuts` 的 index 當作是 dp[i][j] 的 index，然後把 cuts 的頭尾也加進去，就像這樣：

```python
cuts = [0, 1, 3, 4, 5, 7]
dp   = [ ,  ,  ,  ,  ,  ] # size 6
```

這樣我們的 Transition Function 就可以簡化成這樣：

```cpp
for(int k = i + 1; k < j; k++){
    dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + (cuts[j] - cuts[i]));
}
```

觀念都通的差不多之後，就可以直接看實作了。

**Time Complexity** - `O(c^3)`，其中 c 是 cuts 的 size<br>
**Space Complexity** - `O(c^2)`

### Implementation

```cpp
int minCost(int n, vector<int>& cuts) {
    cuts.push_back(0);
    cuts.push_back(n);
    sort(cuts.begin(), cuts.end());

    vector<vector<int>>dp(cuts.size(), vector<int>(cuts.size(), 0));
    for(int count = 2; count < cuts.size(); count++){
        for(int i = 0; i + count < cuts.size(); i++){
            int j = i + count;
            dp[i][j] = INT_MAX;
            for(int k = i + 1; k < j; k++){
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + (cuts[j] - cuts[i]));
            }
        }
    }
    return dp[0][cuts.size()-1];
}
```
