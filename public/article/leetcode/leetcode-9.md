---
title: "[ Leetcode 9 ] Palindrome Number | 解題思路分享"
date: "2025-08-25"
author: James
tags: Math,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 2
---

給一個 integer，判斷這個數字是不是回文。

題目連結 🔗：[https://leetcode.com/problems/palindrome-number/](https://leetcode.com/problems/palindrome-number/)

### **問題分析**

這題最直覺的做法就是轉成字串後直接判斷是不是回文，但這樣需要多耗一個 string 的空間，而實際上這題可以利用 O(1) 的空間就解決。

### **解題思路**

我們只要將整串數字的後半段反轉並分離出來，就可以跟前半段來比較是不是回文了，舉例來說，題目給一個偶數位數的 integer = `1221`，我們可以逐步將後半段分離出來

> initial : x = `1221`, reversed = `0`<br>
> step 1 : x = `122`, reversed = `1`<br>
> step 2 : x = `12`, reversed = `12`

到這裡發現 `x == reversed` 就表示這個數字是回文。那除了偶數位數的狀況，可能還有奇數位數的狀況，像是

> initial : x = `12321`, reversed = `0`<br>
> step 1 : x = `1232`, reversed = `1`<br>
> step 2 : x = `123`, reversed = `12`<br>
> step 3 : x = `12`, reversed = `123`

到這裡如果發現 `x == reversed / 10` 就表示這個數字是回文，這個方法如果寫成程式碼會長這樣

```cpp
bool isPalindrome(int x) {
    int reversed = 0;
    while(x > reversed){
        reversed = reversed * 10 + x % 10;
        x /= 10;
    }

    return (x == reversed) || (x == reversed / 10);
}
```

到這邊已經完成 90% 了，但需要處理一些 edge case，如果數字裡面有負號那他一定不會是回文，而如果數字的結尾是 0，那也一定不會是回文，補上這行就可以了。

```cpp
if(x < 0 || (x % 10 == 0 && x != 0)) return false;
```

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool isPalindrome(int x) {
    if(x < 0 || (x % 10 == 0 && x != 0)) return false;

    int reversed = 0;
    while(x > reversed){
        reversed = reversed * 10 + x % 10;
        x /= 10;
    }

    return (x == reversed) || (x == reversed / 10);
}
```