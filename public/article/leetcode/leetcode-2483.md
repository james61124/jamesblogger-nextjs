---
title: "[ Leetcode 2483 ] Minimum Penalty for a Shop | 解題思路分享"
date: "2025-11-16"
author: James
tags: String
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
id: 0ca07524-2692-47cc-9d37-c74316c254fa
---

給一個 string `customers`，每個 char 代表每一小時有沒有顧客會來，`Y` 代表有顧客，`N` 代表沒有顧客，你可以選擇在第 i 小時關門，如果關門前店開著但沒有客人，一小時 penalty 就加一，如果關門後但有客人來了，一小時 penalty 也加一，找到一個關門的時間 i 使得 penalty 最小。

題目連結 🔗：[https://leetcode.com/problems/minimum-penalty-for-a-shop/](https://leetcode.com/problems/minimum-penalty-for-a-shop/)

### **問題分析**

這題我們需要把 string 分成兩邊，左邊是關門前，右邊是關門後，我們得到的 penalty 就是左邊 `N` 的數量 + 右邊 `Y` 的數量，只要找到從哪裡切開這個數字最小即可。

所以我們可以先設定這間店從頭到尾都沒有開過，所以就先計算整個 `customers` Y 的數量

```cpp
int bestClosingTime(string customers) {
    int n = customers.size();
    int ySum = 0;
    int nSum = 0;
    
    for(char c : customers){
        if(c == 'Y') ySum++;
    }
}
```

再來關門時間慢慢往後走，當遇到 `Y` 表示關門後 `Y` 的數量減少一個，當遇到 `N` 表示關門前 `N` 的數量要增加，然後計算每一次關門時間的 penalty 取最小即可

```cpp
int bestClosingTime(string customers) {
    int n = customers.size();
    int ySum = 0;
    int nSum = 0;
    
    for(char c : customers){
        if(c == 'Y') ySum++;
    }

    int minSum = ySum;
    int idx = 0;
    for(int i = 0; i < n; i++){
        if(customers[i] == 'Y') ySum--;
        else nSum++;

        int currSum = ySum + nSum;
        if(currSum < minSum){
            minSum = currSum;
            idx = i + 1;
        }
    }

    return idx;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int bestClosingTime(string customers) {
    int n = customers.size();
    int ySum = 0;
    int nSum = 0;
    
    for(char c : customers){
        if(c == 'Y') ySum++;
    }

    int minSum = ySum;
    int idx = 0;
    for(int i = 0; i < n; i++){
        if(customers[i] == 'Y') ySum--;
        else nSum++;

        int currSum = ySum + nSum;
        if(currSum < minSum){
            minSum = currSum;
            idx = i + 1;
        }
    }

    return idx;
}
```
