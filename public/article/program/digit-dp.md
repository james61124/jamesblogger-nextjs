---
title: "[ Algorithm ] Dynamic Programming (六) - Digit DP | 核心概念與 Leetcode 題型解析"
date: "2025-06-02"
author: James
tags: Algorithm,DP,Digit DP
image: /images/program/algorithm.png
description: "Digit DP 指的是在數字上做 DP，這裡的數字指的是個位、十位、百位等等。"
readTime: 2
id: 477abb3a-ee8d-45fd-8715-7cfb6f3b4283
---

Digit DP 指的是在數字上做 DP，這裡的數字指的是個位、十位、百位等等。

Digit DP 通常可以用來解 [left, right] 區間內符合某條件的數值個數或是第 k 小數，例如說 [100, 300] 區間內有多少數字含有 1，這類型的答案可以簡化為 [0, right] - [0, left-1]，所以 Digit DP 可以簡化為

> [0, n] 區間內符合某條件的數值個數或是第 k 小數

要解這種題目，我們需要從 0 開始跑過每一個數字，但是如果每一個 integer 我們都要用除法把每一個位數都分離出來會超級花時間，因此我們需要用 Digit DP 來幫我們解決這個問題，而 Digit DP 的核心價值就是：

> 利用 dfs 處理數字，每一層就是一個位數

簡單來說，對於每一個區間而言，可以畫出類似這樣子的 Tree，那每一條 trajectory 就是一個數字，利用 dfs 走完每一個數字就可以計算出我們要的答案了。

<figure>
  <img src="/images/program/digit-dp/tree.png" alt="Digit-DP" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

## 建構思路

先介紹一下 dfs 需要的幾個參數 `i`, `isLimit`, `isNum`：

> `i`：表示現在在第 i 層

<figure>
  <img src="/images/program/digit-dp/i.png" alt="Digit-DP" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

> `isLimit`：如果 `isLimit` 是 `true`，代表下一層不是從 0 看到 9，而是有個上限，例如說這題的區間是 [0, 67]，那如果十位數那層已經到 6 了，表示個位數那層只能從 0 跑到 7，不能跑到 9<br>

<figure>
  <img src="/images/program/digit-dp/isLimit.png" alt="Digit-DP" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

> `isNum`：首先我們要知道 Digit DP 是不容許有前導 0 出現的，因此如果這個 node 還不是數字的話，`isNum` 就會是 `false`，那就會被跳過不會填成 0，就像圖上那些 null 一樣，而他們的下一層就要從 1 開始，而不能從 0 開始。

<figure>
  <img src="/images/program/digit-dp/isNum.png" alt="Digit-DP" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

概念講完了，再來就直接進實作，首先不管要求的是甚麼，例如說要求含有 1 的數字有多少，或是每個位數不重複的數字有多少個，作法是一樣的，對於每一條 trajectory 來說，如果符合了就回傳 1，不符合就回傳 0，然後直接把每一個回傳值都加到 `res` 就好了。

```cpp
int dfs(int i, bool isLimit, bool isNum, string& s) {

    if( condition ) return 1;
    else return 0;

    int res = 0;
    for( all the children ) {
        res += dfs(i + 1, ...); 
    }
    
    return res;
};
```

再來處理每個 children，剛剛知道如果 `isNum` 是 `true`，就可以從 0 開始數，如果是 `false`，就要從 1 開始數，那如果 `isLimit` 是 `true`，就要看該位數是多少決定他的上界，寫起來像這樣：

```cpp
int dfs(int i, bool isLimit, bool isNum, string& s) {

    if( condition ) return 1;
    else return 0;

    int res = 0;
    int low = isNum ? 0 : 1;
    int high = isLimit ? (s[i] - '0') : 9;

    for (int d = low; d <= high; ++d) {
        res += dfs(i + 1, isLimit && (d == high), true, s, memo);
    }
    
    return res;
};
```

一開始一定是 `isNum = false`，看上面的 decision tree 我們可以發現，對於 `isNum = false` 的 node，下一層的處理不是直接從 1 跑到 9，而是會先跑一個 null 的 node，因為畢竟只是規定不能有前導 0，但我們還是要處理一位數，所以應該要這樣寫：

```cpp
int dfs(int i, bool isLimit, bool isNum, string& s) {

    if( condition ) return 1;
    else return 0;

    int res = 0;
    if (!isNum) res += dfs(i + 1, false, false, s); // 先處理 isNum = false 的 node

    int low = isNum ? 0 : 1;
    int high = isLimit ? (s[i] - '0') : 9;

    for (int d = low; d <= high; ++d) {
        res += dfs(i + 1, isLimit && (d == high), true, s, memo);
    }
    
    return res;
};

int main(){
    return dfs(0, true, false, s);
}
```

跑到最後一層的時候要判斷要返回甚麼值，這裡有個簡單的做法，如果這個數字是 valid，那就直接回傳 1，如果不是 valid，我們就直接不要讓他進入到最後一層就好，這樣也就不會加到 `res` 裡，像這樣：

```cpp
int dfs(int i, bool isLimit, bool isNum, string& s) {

    int len = s.size();
    if (i == len) return isNum ? 1 : 0; // 真正的最後一層

    int res = 0;
    if (!isNum) res += dfs(i + 1, false, false, s);

    int low = isNum ? 0 : 1;
    int high = isLimit ? (s[i] - '0') : 9;

    for (int d = low; d <= high; ++d) {
        if( number is invalid ) continue; // 如果該數字不符合題目，不要進入下一層就不會加到 res 裡面
        res += dfs(i + 1, isLimit && (d == high), true, s, memo);
    }
    
    return res;
};

int main(){
    return dfs(0, true, false, s);
}
```

這樣也就完成了。

舉一個具體的例子吧，看看題目 [ Leetcode 1012 ] Numbers With Repeated Digits，題目如下：

> 給一個數字 `n`，求 [1, n] 間有多少數字的每一個位數有重複的數字，例如 112, 335 這種，就是有重複的數字

這題我們就可以用 Digit DP，利用 dfs 跑過每一個位數，計算「沒有重複的位數」的數字有多少個，最後 n - 沒有重複位數的數字個數就是答案。因此如果 trajectory 上遇到重複的數字，就可以跳出不要加進去 res 裡。

要判斷有沒有重複的數，我們可以利用 `mask` 來紀錄出現過的數，這是一個 binary 的數字，例如說如果數字 2 出現了，就把第二位數標成 1，所以 mask = `0b100`，所以我們只要判斷這個 binary 哪一個位數是 1 就知道之前已經用過那些數字了，寫成程式碼就是這樣：

```cpp
mask = mask | (1 << d)
```

所以利用上面講的 template，把這個 mask 的機制加進去後，程式碼會變這樣：

```cpp
int dfs(int i, int mask, bool isLimit, bool isNum, string& s) {

    int len = s.size();
    if (i == len) return isNum ? 1 : 0;

    int res = 0;
    if (!isNum) res += dfs(i + 1, false, false, s);

    int low = isNum ? 0 : 1;
    int high = isLimit ? (s[i] - '0') : 9;

    for (int d = low; d <= high; ++d) {
        if ((mask >> d) & 1) continue; // 如果數字重複了就不要加到 res
        res += dfs(i + 1, mask | (1 << d), isLimit && (d == high), true, s); // 更新 mask
    }
    
    return res;
};

int main(){
    return dfs(0, true, false, s);
}
```

這樣其實已經可以算出答案，但是 dfs 的過程中會遇到很多重複的情況，例如說 `12xx` 跟 `21xx`，同樣都要看第三層，同樣都已經用過 1, 2 兩個數字，那 `12xx` 如果已經看過了，`21xx` 就可以直接填上 `12xx` 算出來的 `res` 的數量，也就是 dfs 建表處理重複 state 的策略，寫起來會變這樣，那也就是最後的答案：

```cpp
int dfs(int i, int mask, bool isLimit, bool isNum, string& s, unordered_map<string, int>& memo) {
    int len = s.size();
    if (i == len) return isNum ? 1 : 0;
    
    // 建表所以一樣的 state 就不用再算一次
    string key = to_string(i) + "," + to_string(mask) + "," + to_string(isLimit) + "," + to_string(isNum); 
    if (memo.count(key)) return memo[key];

    int res = 0;
    if (!isNum)
        res += dfs(i + 1, mask, false, false, s, memo);

    int low = isNum ? 0 : 1;
    int high = isLimit ? (s[i] - '0') : 9;

    for (int d = low; d <= high; ++d) {
        if ((mask >> d) & 1) continue;
        res += dfs(i + 1, mask | (1 << d), isLimit && (d == high), true, s, memo);
    }

    memo[key] = res;
    return res;
};

int numDupDigitsAtMostN(int n) {
    string s = to_string(n);
    unordered_map<string, int> memo;

    return n - dfs(0, 0, true, false, s, memo);
}
```

[[ Leetcode 1012 ] Numbers With Repeated Digits | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-1012/)

## DP 其他系列文章

[[ Algorithm ] Dynamic Programming (一) - Introduction | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/dp/)<br>
[[ Algorithm ] Dynamic Programming (二) - Memorization | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/memorization/)<br>
[[ Algorithm ] Dynamic Programming (三) - Linear DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/linear-dp/)<br>
[[ Algorithm ] Dynamic Programming (四) - Knapsack Problem | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/knapsack-problem/)<br>
[[ Algorithm ] Dynamic Programming (五) - Interval DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/interval-dp/)<br>
[[ Algorithm ] Dynamic Programming (七) - Counting DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/counting-dp/)

