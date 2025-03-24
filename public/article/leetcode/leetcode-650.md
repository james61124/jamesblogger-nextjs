---
title: "[ Leetcode 650 ] 2 Keys Keyboard | 解題思路分享"
date: "2025-03-24"
author: James
tags: Math,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

透過最少的操作次數，將字母 'A' 複製並貼上，最終讓螢幕上有 n 個 'A'。

題目連結 🔗：[https://leetcode.com/problems/2-keys-keyboard/](https://leetcode.com/problems/2-keys-keyboard/)

### **問題分析**

這題一開始沒有什麼想法，所以先把數字都列出來看一下有沒有什麼規律

```
1 -> 0
2 -> c p
3 -> c p p
4 -> c p c p
5 -> c p p p p
6 -> c p p c p
9 -> c p p c p p
```

所以我們會發現一件事情，一個數字如果有因數 j，就表示我們可以把 n/j 貼上 j 次來得到 operation 的數量，例如說 n=6，那他有因數 2，所以我們只要把 `(6/2)` copy 然後 paste 2 次就行了，那我們只要看過他的所有因數就會知道用哪一個因數來計算這件事情是最快的，不過我們還是得先知道 `(6/2)` 的 minimum operation 數量才行，所以計算生成 n 的 minimum operation 數量，等於找到一個最優的因數 j，並將這個因數拆解為更小的子問題，這個符合「從已知狀態構造未知狀態」的特性，也就是 DP。

### **解題思路 - DP (Non-sequential Linear DP Problems)**

利用上面這個思路我們可以維護一個 dp[i]，紀錄 i 需要的 minimum operation 數量，然後 iterate i 從 2 開始找到每一個數字的 minimum operation 數量，寫成 dp 轉換式就是 :

```cpp
dp[i] = min(dp[i], dp[j] + i/j);
```

其中 j 要 iterate 過 i 的每一個因數，寫起來就會是這樣：

```cpp
for(int i=2; i<=n; i++){
    dp[i] = i;
    for(int j=1; j<=i; j++){
        if(i%j == 0) dp[i] = min(dp[i], dp[j] + i/j);
    }
}
```

但其實計算因數在過了 `i/2` 之後是沒有意義的，就像 6 可以分成 1, 2, 3, 6，但是 `2*3` 跟 `3*2` 意思是一樣的，所以找因數 j 只要找到 `i/2` 就行了。

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int minSteps(int n) {
    if(n==1) return 0;
    vector<int>dp(n+1, 1);
    for(int i=2; i<=n; i++){
        dp[i] = i;
        for(int j=1; j<=i/2; j++){
            if(i%j == 0) dp[i] = min(dp[i], dp[j] + i/j);
        }
    }
    return dp[n];

}
```

### **時間優化 - Math**

但我們很快就會發現這是可以用數學解的，因為我們要找因數的關係，意味著所有質數 i 的 minimum operation 都會是 i，因為他們沒有別的因數了，所以如果將一個數字 n 做質因數分解，那他的 minimum operation 就會是所有質因數的總和，例如 `12 = 2*2*3`，所以 minimum operation 就是 2+2+3。而把一個數字拆成合數的因數不會比較好，因為合數也可以再被拆成質數，所以可以直接進實作。

**Time Complexity** - `O(sqrt(n))`，因為一個數的質因數最大到 sqrt(n)<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int minSteps(int n) {

    int res = 0;
    for(int i=2; i<=n; i++){
        while( n%i == 0 ) {
            n /= i;
            res += i;
        }
    }
    return res;

}
```

這邊只需要注意一件事情，質因數分解的實作不用先把 prime 列出來再去寫沒關係，假設我有一個數 `n = p1 * p1 * p2 * p2`，p1 找完了之後這個數就剩下 (n/pi/pi) 了，所以後面遇到 p1 的指數也不可能再整除 (n/pi/pi)，所以迴圈一路網上找就行了。