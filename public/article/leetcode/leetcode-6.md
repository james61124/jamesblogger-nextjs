---
title: "[ Leetcode 6 ] Zigzag Conversion | 解題思路分享"
date: "2025-09-02"
author: James
tags: String,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
---

給一個字串 s 和一個整數 numRows，將字串按照 Zigzag（Z 字形）排列，然後依照「逐行讀取」的方式輸出。

題目連結🔗：[https://leetcode.com/problems/zigzag-conversion/](https://leetcode.com/problems/zigzag-conversion/)

### **題目分析**

這題如果開一個 `vector<string>` 從上到下再從下到上把每一個字都填進去，最後再一排一排輸出應該大家都會，所以我就在想，這種有規律的題目肯定可以用數學公式解決，只要找到規律性應該就可以省掉這個 `O(n)` 的空間。

### **解題思路**

我們先試著簡化問題，把不同 `numRows` 字母的順序寫出來

```
numRows = 2
0 2 4
1 3 5

numRows = 3
0   4   8     12
1 3 5 7 9  11 13
2   6   10    14

numRows = 4
0     6      12 
1   5 7   11 13 
2 4   8 10   14 
3     9      15
```

我們會發現在不同的 rows 中，數字的出現是一個循環，而每一組的循環數量是 `2 * numRows - 2`，我們先把它記錄起來

```cpp
int cycle = 2 * numRows - 2;
```

再來我們要判斷每一個 row 的數字「隔了幾個才會出現」，先看最上面跟最下面的 row，不難發現每一個數字都間隔一個 cycle

```
numRows = 4
0     6      12 -> 彼此間隔一個 cycle
1   5 7   11 13 
2 4   8 10   14 
3     9      15 -> 彼此間隔一個 cycle
```

而中間的 row 每兩個數字也是間隔一個 cycle，而中間的數字則是 row 0 下一個 cycle 的數字減掉當前的 row index，舉例來說，row = 1 時 1, 7 間隔一個 cycle，對 1 號來說，下一個數字是 row 0 下一個 cycle 的數字，也就是 6，減掉 1 得到的，row = 2 時 2, 8 間隔一個 cycle，對 2 號來說，下一個數字是 row 0 下一個 cycle 的數字，也就是 6，減掉 2 得到的，以此類推。

有點複雜，我們想辦法轉成程式碼，對於每一個 row 先建一個 for loop

```cpp
for(int row = 0; row < numRows; row++) {

}
```

每一個 row 的每個數字也建一個 for loop，`i` 代表現在要放的數字的 index，所以每一次增加都增加一個 cycle

```cpp
for(int row = 0; row < numRows; row++){
    for(int i = 0; i + row < n; i += cycle){

    }
}
```

先處理最上面跟最下面的 row，每一次都是間隔一個 cycle

```cpp
for(int row = 0; row < numRows; row++){
    for(int i = 0; i + row < n; i += cycle){
        res += s[i + row];
    }
}
```

再來如果 row 在中間，cycle 之間還需要放一個數字，而計算方法就是 row 0 下一個 cycle 的數字減掉當前 row index，就會寫成下面這樣

```cpp
for(int row = 0; row < numRows; row++){
    for(int i = 0; i + row < n; i += cycle){
        res += s[i + row];
        if(row != 0 && row != numRows - 1 && i + cycle - row < n){
            res += s[i + cycle - row];
        }
    }
}
```

到這邊就整個寫完了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
string convert(string s, int numRows) {
    if(numRows == 1) return s;

    int n = s.size();
    string res = "";
    int cycle = 2 * numRows - 2;

    for(int row = 0; row < numRows; row++){
        for(int i = 0; i + row < n; i += cycle){
            res += s[i + row];
            if(row != 0 && row != numRows - 1 && i + cycle - row < n){
                res += s[i + cycle - row];
            }
        }
    }

    return res;

}
```