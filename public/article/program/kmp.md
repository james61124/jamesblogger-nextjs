---
title: "[ Algorithm ] KMP Algorithm | 核心概念與 Leetcode 題型解析"
date: "2025-09-05"
author: James
tags: Algorithm,KMP
image: /images/program/algorithm.png
description: "如果想要在一個 string `text` 底下判斷 string `pattern` 是不是他的 substring，暴力解非常直覺，舉個例："
readTime: 2
---

如果想要在一個 string `text` 底下判斷 string `pattern` 是不是他的 substring，暴力解非常直覺，舉個例：

```
text    = a a a a a a a a a a b
pattern = a a a b

text   = a a a a a a a a a a b
step 1 : a a a b
step 2 :   a a a b
step 3 :     a a a b
...
step n :               a a a b
```

暴力算法需要每次比較的時候都把 `pattern` 前面的 a 都比完才會比到後面的 b，然後發現是錯誤的，下一個 step 又要重新比，所以時間複雜度是 `O(n * m)`，其中 n 是 text 長度，m 是 pattern 長度，而 KMP Algorithm 就是為了解決這個重複計算的問題，讓「找 substring」的時間複雜度降到 O(n)。

事實上當我們比較完一次 `pattern`，由於前面的部分都讀過了，一些重複的部分是不用重新比較的，舉例來說：

<figure>
  <img src="/images/program/kmp/initial.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

因為黃色的 `ab` 跟綠色的 `ab` 是一樣的，我們不用再把 `pattern` 往後移一位重新比較，我們可以直接把 `pattern` 跳到綠色 `ab` 的位置開始比，這樣就可以發現 `text` 的 pointer 基本上是不用往前移動的，我們先不管怎麼判斷可以跳過多少字母，這邊可以得出一個結論

> `pattern` 重複的部分可以跳過不重新比較

我們要怎麼判斷 `pattern` 每次可以跳過多少字母 `text` 的 pointer 才不用走回去重新比較呢？我們會計算出一個 `lps` array，我們先不管他是怎麼來的，KMP Algorithm 在發現 `text` 跟 `pattern` 字母不一樣的時候，會去查找上一個相同的字母的 `lps` 的數字，這個數字代表的是「下一個 step 可以跳過多少字母」，看下面的例子

<figure>
  <img src="/images/program/kmp/lps.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

lps[i] = 2 的位置是 step 1 最後一個匹配正確的字母，所以下一個 step 可以跳過兩個字母，所以 `pattern` 往後移兩個繼續比較就可以了，我們先把上面的部分轉成程式碼，首先我們會有一個 `lps` array，先不管他怎麼來的

```cpp
int n = text.size();
int m = pattern.size();
vector<int> lps = buildLPS(pattern);
```

接著我們有兩個 pointers，`i` 代表 `text`，`j` 代表 `pattern`

```cpp
for (int i = 0, j = 0; i < n;) {}
```

當 `text[i] == pattern[j]`，代表可以繼續往下比較，所以 `i`, `j` 都往後走

```cpp
for (int i = 0, j = 0; i < n;) {
    if (text[i] == pattern[j]) {
        i++; j++;
    }
}
```

當兩個字母不一樣的時候，`pattern` 的 pointer 可以根據 lps 來決定下一個 step 要跳過多少字母

```cpp
for (int i = 0, j = 0; i < n;) {
    if (text[i] == pattern[j]) {
        i++; j++;
    } else if (j > 0) {
        j = lps[j - 1];
    } 
}
```

但這邊要注意，如果第一個字母就匹配失敗，那這個 step 就沒有所謂的「上一個匹配成功的字母的 lps」，也就是說，`text` 的 pointer 就要直接往下移動到下一個字母繼續比較，畫成圖就是這樣

<figure>
  <img src="/images/program/kmp/match-fail.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

```cpp
for (int i = 0, j = 0; i < n;) {
    if (text[i] == pattern[j]) {
        i++; j++;
    } else if (j > 0) {
        j = lps[j - 1];
    } else {
        i++;
    }
}
```

最後當 `pattern` 的 pointer 跑到底表示找到 substring 了

```cpp
for (int i = 0, j = 0; i < n;) {
    if (text[i] == pattern[j]) {
        i++; j++;
    } else if (j > 0) {
        j = lps[j - 1];
    } else {
        i++;
    }

    if (j == m) return i - j; // match found
}
```

再來我們要來看 `lps` 是怎麼產生的，我們先來看一下 `lps` 的本質，他可以讓 `pattern` 跳過一部分的字母不用重新比較，一定是因為跳過的部分他上一個 step 已經比較過了，至於這是為什麼呢？是因為上一個 step 比較過表示他們擁有「相同的 prefix 跟 suffix」，prefix 就是前綴，表示加在 string 前面的字母，suffix 就是後綴，就是加在 string 後面的字母，來看看是什麼意思。

<figure>
  <img src="/images/program/kmp/lps-explanation.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

lps 的數值要找的是「最長的相同 prefix 跟 suffix」，所以紅色的 `a` 這裡應該要填 3 而不是填 1，那為什麼找到「最長的相同 prefix 跟 suffix」就代表下一個 step 可以跳過的字母數呢？是因為前面的 `aba` 會跟上一個 step 後面的 `aba` 位置重疊，那上一個 step 都比過了這個 step 就可以不用比了，所以可以直接跳過去。

至於要怎麼有效率的找到相同的 prefix, suffix，我們可以分兩種情況來看，像現在這樣我們已經計算到第六個字母，我們也知道目前相同的前後綴長度是 2，也就是 `len = 2`

<figure>
  <img src="/images/program/kmp/lps-1.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

當後面的字母跟 prefix 下一個字母一樣，很好理解，lps[i] 就是當前共同前後綴長度 + 1

<figure>
  <img src="/images/program/kmp/lps-2.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

但是當後面的字母跟 prefix 下一個字母不一樣，我們就要找當前的共同前後綴是不是可以組成更短的前後綴，那我們已經知道 `text` 前綴三個字母跟後綴三個字母完全一樣，所以我們可以直接從前面來找有沒有更短的「共同前後綴」，那因為前綴最後一個字的 lps 是 1，所以我們可以把目前共同前後綴的長度縮小成 1，也就是把 `len` 縮小成 1

<figure>
  <img src="/images/program/kmp/lps-3.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

再來就可以繼續回到原先的步驟，檢查下一個數字有沒有一樣，然後我們發現下一個數字一樣，所以 lps 長度就是當前共同前後綴長度 + 1，也就是 2

<figure>
  <img src="/images/program/kmp/lps-4.png" alt="kmp" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
  </figcaption>
</figure>

利用這個方法，我們來看程式碼要怎麼寫，首先 lps 第一個數值一定是 0，因為第一個數字不會有共同前後綴，再來共同前後綴長度 `len` 也設成 0

```cpp
vector<int> lps(m, 0);
for (int i = 1, len = 0; i < m;) {}
```

當下一個字母相同時，代表 lps[i] 是共同前後綴長度 + 1

```cpp
vector<int> lps(m, 0);
for (int i = 1, len = 0; i < m;) {
   if (pattern[i] == pattern[len]) {
        lps[i++] = ++len;
    } 
}
```

如果不同，就要把當前共同前後綴長度回溯到左邊 lps 的長度，去找有沒有更小的共同前後綴

```cpp
vector<int> lps(m, 0);
for (int i = 1, len = 0; i < m;) {
    if (pattern[i] == pattern[len]) {
        lps[i++] = ++len;
    } else if (len > 0) {
        len = lps[len - 1];
    } 
}
```

最後如果當前共同前後綴長度已經是 0 了，下一個字母卻還是不同，代表這邊根本就沒有共同前後綴，所以 lps 就直接填入 0

```cpp
vector<int> lps(m, 0);
for (int i = 1, len = 0; i < m;) {
    if (pattern[i] == pattern[len]) {
        lps[i++] = ++len;
    } else if (len > 0) {
        len = lps[len - 1];
    } else {
        lps[i++] = 0;
    }
}
```

到這邊 KMP Algorithm 就介紹完了，下面附上完整的程式碼

```cpp
int kmp(string text, string pattern) {
    if (pattern.empty()) return 0;
    int n = text.size(), m = pattern.size();

    vector<int> lps(m, 0);
    for (int i = 1, len = 0; i < m;) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else if (len > 0) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }

    for (int i = 0, j = 0; i < n;) {
        if (text[i] == pattern[j]) {
            i++; j++;
        } else if (j > 0) {
            j = lps[j - 1];
        } else {
            i++;
        }
        if (j == m) return i - j;
    }

    return -1;
}
```