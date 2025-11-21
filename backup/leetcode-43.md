---
title: "[ Leetcode 43 ] Multiply Strings | 解題思路分享"
date: "2025-05-15"
author: James
tags: Math,String,Simulation
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---



題目連結 🔗：[https://leetcode.com/problems/multiply-strings/](https://leetcode.com/problems/multiply-strings/)

### **問題分析**

這題其實就是大數乘法，不能直接轉成兩個 integer 相乘，所以要利用「直式乘法」的原理來實作。

### **解題思路 - Simulation**

先來複習一下直式乘法，以`123 x 456`為例：

```
  123
x 456
------
  738
 615
492
------
56088
```

首先我們先把`num1`, `num2`每一個位數轉成數字儲存起來，這樣比較好思考

```cpp
vector<int>v1;
vector<int>v2;

for(char c : num1) v1.push_back(c - '0');
for(char c : num2) v2.push_back(c - '0');
```

最後的答案會存在一個 `vector<int>` 中，而 m 位數 x n 位數的最大值會是 m + n 位數，所以 `vector<int>product` 初始化的 size 就設定為 `m + n`。

```cpp
int m = num1.size(), n = num2.size();
vector<int>product(m + n, 0);
```

再來就要開始處理每一行的乘法，直式乘法的每一行我們不用特別取出來存著，我們可以直接利用 `product` 更新就好，所以針對每個位數只要乘完就直接處理加法跟進位的問題然後更新到 `product`，舉例來說：

```
  123
x 456
------
  738
```

假設現在做到這邊，所以我們需要進行 `3 * 5 = 15`，那我們會直接更新上去變成 `888`

```
  123
x 456
------
  738
  15
------
  888 
```

下一步 `2 * 5 = 10` 也是直接更新上去

```
  123
x 456
------
  888
 10
------
 1888
```

最後一個 `1 * 5 = 5` 也是直接更新上去

```
  123
x 456
------
 1888
 5
------
 6888
```

這樣 `5` 就做完了，最後把 `4` 也做一做就可以得到答案，我們會發現對於每個位數來說，乘出來的個位數字要放在 `product[i + j + 1]`，而十位數字要放在 `product[i + j]`，舉例來說，現在要處理 `3 * 5 = 15`，所以 `i = 2, j = 1`，而目前的 product 分布是這樣

```
index   : 0 1 2 3 4 5
product : 0 0 0 7 3 8 
```

所以 5 要放到 product[4]，而 1 要放到 product[3]，加起來就是

```
index   : 0 1 2 3 4 5
product : 0 0 0 8 8 8
```

至於進位問題要怎麼處理？如果我們今天需要進行 `99 * 99`

```
  99
x 99
-----
 891
 81
```

我們會發現如果 `9 + 1` 要記一個進位的 1，後面 `8 + 8 + 1` 又要再記一個進位的 1，這樣子邏輯很亂思路也會變很不清楚，這題有一個比較好的紀錄方式，我們可以讓 `9 + 1` 的個位數留在 product[i + j + 1]，進位往後挪，再來 `8 + 8 + 1` 全部都留在這格，也就是讓 product[i + j] 變成 17，後續的乘法就會把這格自動進位到後面去了，寫起來像這樣：

```cpp
for(int i = m - 1; i >= 0; i--){
    for(int j = n - 1; j >= 0; j--){
        int sum = product[i + j + 1] + v1[i] * v2[j];
        product[i + j + 1] = sum % 10;
        product[i + j] += sum / 10;
    }
}
```

以 `99 * 99` 為例，product 更新的 flow 長這樣

```python
[0,  0, 8, 1]
[0,  8, 9, 1]
[0, 17, 0, 1]
[9,  8, 0, 1]
```

這裡很多人會有一個疑問，不會有狀況是停留在 step 3 而沒有更新到進位的嗎？答案是不會，因為會出現「同一格大於 9」的情況表示後面還有乘法需要進行

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
string multiply(string num1, string num2) {
    if (num1 == "0" || num2 == "0") return "0";

    int m = num1.size(), n = num2.size();
    vector<int>v1;
    vector<int>v2;
    vector<int>product(m + n, 0);
    string result = "";

    for(char c : num1) v1.push_back(c - '0');
    for(char c : num2) v2.push_back(c - '0');

    for(int i = m - 1; i >= 0; i--){
        for(int j = n - 1; j >= 0; j--){
            int sum = product[i + j + 1] + v1[i] * v2[j];
            product[i + j + 1] = sum % 10;
            product[i + j] += sum / 10;
        }
    }

    bool start = false;
    for(int num : product){
        if(!start && num == 0) continue;
        start = true;
        result.push_back(num + '0');
    }

    return result;

}
```
