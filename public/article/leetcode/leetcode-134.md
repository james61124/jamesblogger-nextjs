---
title: "[ Leetcode 134 ] Gas Station | 解題思路分享"
date: "2025-06-17"
author: James
tags: Array,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

你在一條圓形路線上有 n 個加油站，每個加油站 `i` 有 gas[i] 單位的汽油可以加，開車到下一個加油站需要花費 cost[i] 單位的汽油，你有一台油箱無限大的車，一開始油箱是空的。你可以從任意一個加油站出發，順時針開車，目標是回到起點，要回傳從哪個加油站出發可以回原點，不行的話就回傳 `-1`。

題目連結 🔗：[https://leetcode.com/problems/gas-station/](https://leetcode.com/problems/gas-station/)

### **問題分析**

最直覺的想法，就是從每一個加油站 `i` 出發，模擬開車繞一圈的過程，先把油加入油箱 ( `tank += gas[j % n]` )，再扣掉開到下一站的油 ( `tank -= cost[j % n]` )，如果 在任一個加油站 `tank < 0` 表示從這個 starting point 沒辦法繞一圈，就再往下看下一個加油站，而這樣的時間複雜度是 O(n^2)。

不過這個思路會重複算到一些不需要重複被計算的部分，如果從加油站 `i` 走到加油站 `j` 發現油箱油不夠了，實際上不用往下看下一個加油站 `i+1`，因為 `i` ~ `j` 基本上都沒有辦法當 starting point，因此直接看加油站 `j+1` 即可，為什麼呢？

從數學上來看，加油站 `i` 走到加油站 `j` 發現油箱油不夠表示

```python
sum(gas[i..j]) < sum(cost[i..j])
```

但同時 

```python
sum(gas[i...j-1] > sum(cost[i...j-1]))
```

這表示 `gas[j] < cost[j]`，而這也是造成油箱不夠的主要元兇，如果從 i 開始油箱都會不夠了，從 i+1, i+2 開始更不可能，因為少了 gas[i] 的貢獻，所以實際上這題 `O(n)` 就可以解了。

### **解題思路 - Greedy**

知道方法後實際上就很簡單了，我們一樣從 i 開始模擬開車一圈的過程，先加油再扣油，如果在 `j` 發現油不夠，油箱清空再往 `j+1` 看，可以簡單寫成這樣。

```cpp
for(int i = 0; i < n; i++){
    currentTank += (gas[i] - cost[i]);

    if(currentTank < 0){
        currentTank = 0;
        index = i + 1;
    }
}
```

但除了這樣，我們需要檢查一件事情，如果總油量 `sum(gas)` 大於等於總花費 `sum(cost)`，不管順序怎麼換一定會有解答，這是可以證明的，假設從 `0` 走到 `k` 油箱是負的，表示 `sum(gas[0..j]) < sum(cost[0..j])`，但因為總體的油是夠的，所以表示 `sum(gas[j+1...n-1]) > sum(cost[j+1...n-1])`，也就是說雖然前面油不夠，但後面一定加得回來，所以從 j+1 開始一定會有一個解能夠開一圈回來。

那相反，如果 `sum(gas) < sum(cost)`，不管怎麼開都一定不可能可以開一圈，而我們必須處理這種狀況，我們可以設個變數紀錄 total 油箱的變化，如果最後發現總油量根本就不夠，就直接回傳 `-1`。

```cpp
int n = gas.size();
int total = 0;
int index = 0;
int currentTank = 0;

for(int i = 0; i < n; i++){
    int diff = gas[i] - cost[i];
    currentTank += diff;
    total += diff;

    if(currentTank < 0){
        currentTank = 0;
        index = i + 1;
    }
}

return (index >= n) || (total < 0) ? -1 : index;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int n = gas.size();
    int total = 0;
    int index = 0;
    int currentTank = 0;

    for(int i = 0; i < n; i++){
        int diff = gas[i] - cost[i];
        currentTank += diff;
        total += diff;

        if(currentTank < 0){
            currentTank = 0;
            index = i + 1;
        }
    }

    return (index >= n) || (total < 0) ? -1 : index;
}
```
