---
title: "[ Leetcode 190 ] Reverse Bits | 解題思路分享"
date: "2025-04-14"
author: James
tags: Bit Manipulation,Divide and Conquer
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: 8ed9121f-8c1c-4369-af0e-f8d14ce12600
---

給一個 32 bits unsigned integer，return reversed 過的數。

題目連結 🔗：[https://leetcode.com/problems/reverse-bits/](https://leetcode.com/problems/reverse-bits/)

### **問題分析**

先記錄一下，這是我的第一題 Bit Manipulation，以前看到 Bit Manipulation 都不太想學直接先跳過，現在要回來還債了。

如果是按照一般 vector 的邏輯，要 reverse 一個 vector，可能就是利用一個 `right` pointer 一直紀錄最後一個數字，然後把他塞到另一個 vector 裡面，`right` 一直縮進來直到結束就可以了，所以初步判斷 Reverse Bits 應該也是差不多思路，一直紀錄最後一個 bit，然後塞到另一個 uint32_t 裡，所以關鍵就是怎麼達成「紀錄最後一個 bit」這件事。

### **解題思路 - Bit Manipulation**

「保留某某位數」這件事情，一律使用 bitmask 來解決，要保留哪一位數 mask 就設為 1，然後跟原本的 unsigned int 做 `and` operation，舉個例子，有個數 `n = 1010` 想要保留最後兩位數：

```
n    = 1010
mask = 0011
newNum = n & mask = 0010
```

所以回到這題也是同理，n 要保留最後一位，所以就用 (n & 1) 就可以保留最後一位了。

```cpp
uint32_t tmp = (n & 1);
```

再來就要把這個 bit「接到」result 後面，所以 result 先左 shift，再來跟 tmp 做 `or` operation 就可以接上去了，最後 n 往右 shift 露出下一個 bit，重複這個過程直到 32 個 bit 都做完就結束了。

**Time Complexity** - `O(32) = O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;
    for(int i = 0; i < 32; ++i) {
        result = (result << 1) | (n & 1);
        n >>= 1;                    
    }
    return result;
}
```

### **時間優化 - Divide and Conquer**

結果沒想到這題還可以再優化，直接舉例來看，如果今天有一個 8 bits 的數想要 reverse

```
n = abcdefgh
```

對於 2^n bits 的數來說，reverse 的過程就是對稱交換，左邊的 bit 會跑到右邊對應的位子，所以我們可以直接先切對半把左右交換，然後再切對半一次把左右交換，一直切切到底就達成 reverse 的效果了，用上面的例子來說

```cpp
n = abcdefgh
n = efgh abcd // 切對半交換
n = gh ef cd ab // 再切一次
n = h g f e d c b a // 再切一次
```

所以對於 2^n 個 bits 來說，只需要 swap n 次就可以解了，再來討論如何進行 swap 的動作，一樣舉 8 bits 的數字為例，第一步先切對半交換，所以我們需要 bitmask 保留左半部然後 shift 到右邊，也需要 bitmask 保留右半部然後 shift 到左邊，先來看第一步

保留左半部的 mask 是 0b11110000，寫成十六進位是 0xf0 ( 每四個 bits 一組來看 )，然後 right shift 四次可以到右邊，保留右半部的 mask 是 0b00001111，寫成十六進位是 0x0f，然後 left shift 四次可以到左邊，所以寫成 code 就是這樣：

```cpp
n = (n & 0xf0) >> 4 | (n & 0x0f) << 4;
```

再來第二步開始應該就可以舉一反三了，對於每四個 bits 我們要再切對半，所以左邊的 mask 是 0b11001100，也就是 0xcc，要 right shift 兩次，右邊的 mask 是 0b00110011，也就是 0x33，要 left shift 兩次，寫成 code 就是：

```cpp
n = (n & 0xcc) >> 2 | (n & 0x33) << 2;
```

以上都是 8 個 bits 的狀態，而題目給的事 uint32_t，那一樣舉一反三，我們只要 swap 5 次就可以了，直接附上程式碼

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
uint32_t reverseBits(uint32_t n) {

    n = (n & 0xffff0000) >> 16 | (n & 0x0000ffff) << 16;
    n = (n & 0xff00ff00) >> 8 | (n & 0x00ff00ff) << 8;
    n = (n & 0xf0f0f0f0) >> 4 | (n & 0x0f0f0f0f) << 4;
    n = (n & 0xcccccccc) >> 2 | (n & 0x33333333) << 2;
    n = (n & 0xaaaaaaaa) >> 1 | (n & 0x55555555) << 1;
    
    return n;
}
```

### **Follow up**

這題題目給了另一個延伸思考，如果 Bit Reverse 需要 reverse 無限多次的話，一定會有重複的狀況，所以我們可以用 Hash Table 直接 cache，這樣就可以直接查表，但是 2^32 太大了沒有辦法全部都存到 Hash Table，所以我們可以退而求其次，cache 住 8 bits 的情況就好，所以我們把 32 bits 分割成 4 個 8 bits 的 block，查四次表，最後再拼回他們正確的地方。

#### **Implementation**

```cpp
uint32_t reverseBits(uint32_t n) {
    uint8_t reverse_table[256];

    for(int i=0; i<256; i++){
        uint8_t x = i;
        x = (x & 0xf0) >> 4 | (x & 0x0f) << 4;
        x = (x & 0xcc) >> 2 | (x & 0x33) << 2;
        x = (x & 0xaa) >> 1 | (x & 0x55) << 1;
        reverse_table[i] = x;
    }

    return (reverse_table[n & 0xff] << 24) |
        (reverse_table[(n >> 8) & 0xff] << 16) |
        (reverse_table[(n >> 16) & 0xff] << 8) |
        (reverse_table[(n >> 24) & 0xff]);

}
```