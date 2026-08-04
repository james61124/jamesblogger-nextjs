---
title: "[ Algorithm ] Manacher's Algorithm | 核心概念與 Leetcode 題型解析"
date: "2025-05-22"
author: James
tags: Algorithm,String Matching,EAC,Manacher
image: /images/program/algorithm.png
description: "Manacher Algorithm 底層其實還是 EAC，但是可以利用回文的特性省略掉一些重複的部分，進而讓時間複雜度降低。"
readTime: 2
id: 5de46de6-2cb9-4e13-919d-d90fd32ab07c
---

當我們今天要處理回文相關的問題的時候，例如說我們要找到一個 string 中所有回文，或是最長的回文長度，最簡單的做法就是 Expand Around Center (EAC)，因為回文會有兩種狀況，奇數中心跟偶數中心，所以我們只要針對這兩種中心，從中間往外擴展看看兩邊的字有沒有一樣就可以了。

```cpp
void expandFromCenter(const string& s, int left, int right) {
    while (left >= 0 && right < s.size() && s[left] == s[right]) {
        left--;
        right++;
    }
}

for (int i = 0; i < s.size(); i++) {
    expandFromCenter(s, i, i); // 奇數中心
    expandFromCenter(s, i, i + 1); // 偶數中心
}
```

而這種解法最差的情況就是 string 中所有 char 都一樣，這樣對於每個中心來說，都得擴展到底才會停止，也因此時間複雜度是 `O(n^2)`，因此這邊就要介紹 Manacher's Algorithm，可以把整個過程的時間複雜度降為 O(n)。

## Manacher's Algorithm

Manacher 底層其實還是 EAC，但是可以利用回文的特性省略掉一些重複的部分，進而讓時間複雜度降低。

EAC 需要處理奇數中心跟偶數中心的問題，Manacher 的第一步就是要解決這個，首先要先讓 string 的每個 char 中穿插分隔符號 `#`，舉個例子：

```
s = "aacaaca" -> t = "$#a#a#c#a#a#c#a#^"
```

而後面就會知道為什麼前後要再插入一個特殊字元。

```cpp
string preprocess(const string& s) {
    string t = "^";
    for (char c : s) {
        t += "#" + string(1, c);
    }
    t += "#$";
    return t;
}
```

再來我們需要維護一個 p[i]，對於每一個 i 而言，p[i]是「以 i 為中心的最長回文半徑」，以剛剛那個 case 來說，p[i] 最後會長這樣：

```
t    = $ # a # a # c # a # a # c # a # ^
p[i] = 0 0 1 2 1 0 5 0 1 2 6 0 3 0 1 0 0
```

我們先來看這個 p[i] 最重要的特性 - 鏡像

> mirror 是 i 相對於 center 的對稱點，如果 p[mirror] 的迴文長度 < center 的迴文區間，那 p[i] 一定等於 p[mirror]

什麼意思？看下面的例子，紅色為中心點，理論上左右兩邊會完全對稱，但是對稱的前提是 p[i] < 「center 回文半徑」的情況下( 藍色區塊 )，所以藍色部分是 p[i] 沒有超過 center 的回文半徑，呈現左右一樣的特性，但是綠色 `2` 的回文會覆蓋掉整個左半邊的藍色區塊，也就是說右邊的對稱點是有可能會有更長的回文出現的，所以這邊就會得到一個等等很重要的結論

> 如果左邊的 p[i] < 目前 center 的回文半徑，右邊的鏡像點可以直接填 p[i] 的值，但如果超過了，右邊的 p[i] 會 >= 左邊的 p[i]，而且必須繼續擴展找到真正的 p[i]

<div className="overflow-x-auto">
  <table className="border border-black table-auto w-full border-collapse font-sans whitespace-nowrap">
    <thead>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">t</th>
        <td className="border border-black bg-white px-2 py-2 text-center">$</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">c</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">c</td>
        <td className="border border-black bg-white px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">a</td>
        <td className="border border-black bg-white px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">^</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">p[i]</th>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">2</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold">5</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">6</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-white px-2 py-2 text-center">3</td>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
        <td className="border border-black bg-white px-2 py-2 text-center">1</td>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
      </tr>
    </tbody>
  </table>
</div>

利用這個鏡像的特性，我們可以用 O(n) 的時間複雜度就更新完 p[i]，首先 Manacher 的基底還是 EAC，所以我們還是先利用 EAC 進行更新。

```cpp
vector<int> p(n, 0);
for (int i = 1; i < n - 1; i++) {

    // ...

    while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;

    // ...
}
```

p[i] 一開始都初始化為 0，而擴展後發現左右相等，p[i] 就加一並持續到左右不相等。

但是在這之前，如果鏡像的條件出現了，就可以直接把鏡像的結果填上去，什麼意思？我們會維護幾個新的變數 `center` 跟 `right`，而 `center` 代表「目前展開最遠的迴文 substring 的中心位置」，而 `right` 代表這個迴文子串「右邊界（不含）」的位置，也就是 center + p[center]。

可以把 right 想成目前我們掃過的最遠右界限，而 center 是產生這個界限的來源，因此如果 i 比 right 來的小，p[i] 在鏡像點的回文不會超過目前回文半徑的情況下，就可以直接更新為鏡像的值，像這樣：

<div className="overflow-x-auto">
  <table className="border border-black table-auto w-full border-collapse font-sans whitespace-nowrap">
    <thead>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">index</th>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">2</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">3</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">4</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">5</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">6</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">7</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">8</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">9</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">10</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">11</td>
        <td className="border border-black bg-white px-2 py-2 text-center">12</td>
        <td className="border border-black bg-white px-2 py-2 text-center">13</td>
        <td className="border border-black bg-white px-2 py-2 text-center">14</td>
        <td className="border border-black bg-white px-2 py-2 text-center">15</td>
        <td className="border border-black bg-white px-2 py-2 text-center">16</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">t</th>
        <td className="border border-black bg-white px-2 py-2 text-center">$</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">c</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">c</td>
        <td className="border border-black bg-white px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">a</td>
        <td className="border border-black bg-white px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">^</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">p[i]</th>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">2</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold">5</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">i</th>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">i</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">center</th>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold">c</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">right</th>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">r</td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
  </table>
</div>

那目前的 p[i]，也就是 p[8] 就可以直接填 1，因為鏡像點 p[4] 是 1，而且這個 1 不會碰到藍色區塊的邊界。

但如果遇到「鏡像點的回文 >= 當前回文半徑」我們就必須繼續擴展直到找到他真正的 p[i]，也就是下圖的 p[9]，因為鏡像點 p[3] 的回文半徑會碰到目前藍色區塊的邊境，所以 p[9] 一定會 >= 2，那直接從邊界開始更新就可以了，而最後繼續擴展的結果 p[9] 會是 6。

<div className="overflow-x-auto">
  <table className="border border-black table-auto w-full border-collapse font-sans whitespace-nowrap">
    <thead>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">index</th>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">2</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">3</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">4</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">5</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">6</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">7</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">8</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">9</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">10</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">11</td>
        <td className="border border-black bg-white px-2 py-2 text-center">12</td>
        <td className="border border-black bg-white px-2 py-2 text-center">13</td>
        <td className="border border-black bg-white px-2 py-2 text-center">14</td>
        <td className="border border-black bg-white px-2 py-2 text-center">15</td>
        <td className="border border-black bg-white px-2 py-2 text-center">16</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">t</th>
        <td className="border border-black bg-white px-2 py-2 text-center">$</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">c</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">a</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">c</td>
        <td className="border border-black bg-white px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">a</td>
        <td className="border border-black bg-white px-2 py-2 text-center">#</td>
        <td className="border border-black bg-white px-2 py-2 text-center">^</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">p[i]</th>
        <td className="border border-black bg-white px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">2</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold">5</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">0</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">1</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">i</th>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">i</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">center</th>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold">c</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th className="border border-black bg-gray-100 font-bold px-2 py-2 text-center whitespace-nowrap">right</th>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center font-bold"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center"></td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">r</td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
        <td className="border border-black bg-white px-2 py-2 text-center"></td>
      </tr>
    </tbody>
  </table>
</div>

整合上面的觀念，假設 `mirror` 為目前 i 的鏡像點，我們的程式碼可以理解為 p[i] 會更新成 min(right - i, p[mirror])，如果 p[i] 是 `p[mirror]` 表示 mirror 的回文半徑並沒有超過當前最大的回文半徑，後續的 EAC 會直接跳出，如果 p[i] 是 `right - i`，表示 p[i] 有可能更大，後續的 EAC 就會接著繼續更新下去。

```cpp
vector<int> p(n, 0);
for (int i = 1; i < n - 1; i++) {

    // 處理鏡像問題
    int mirror = 2 * center - i;
    if (i < right) p[i] = min(right - i, p[mirror]);

    while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;

    // ...
}
```

最難的部分結束了，最後我們只要找到時機更新 right 和 center 即可，因為 right 是目前我們掃過的最遠右界限，而 center 是產生這個界限的來源，所以當 `i + p[i] > right` 表示我們掃到更遠的地方了，就要更新 center 跟 right，像下面這樣：

```cpp
vector<int> p(n, 0);
for (int i = 1; i < n - 1; i++) {

    int mirror = 2 * center - i;
    if (i < right) p[i] = min(right - i, p[mirror]);

    while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;

    // 更新 right, center
    if (i + p[i] > right) {
        center = i;
        right = i + p[i];
    }
}
```

最後來看為什麼 t 頭尾要再加個不同的特殊字元

```
s = "aacaaca" -> t = "$#a#a#c#a#a#c#a#^"
```

因為這樣中心擴展的時候就不會因為超出邊界而報錯了，碰到頭尾的特殊字元一定會停下來。

至此，Manacher Algorithm 就結束了，再來就可以根據 p[i] 去找到所有題目問關於回文的事情，完整程式碼補在下方

```cpp
string preprocess(const string& s) {
    string t = "^";
    for (char c : s) {
        t += "#" + string(1, c);
    }
    t += "#$";
    return t;
}

void manacher(string s) {
    if (s.empty()) return "";

    string t = preprocess(s);
    int n = t.size();
    vector<int> p(n, 0); 

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
}
```