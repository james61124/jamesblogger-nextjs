---
title: "[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析"
date: "2025-04-11"
author: James
tags: Algorithm,Binary Search
image: /images/program/algorithm.png
description: "最基本款的 Binary Search，就是在 sorted array `nums` 中找到特定的 target，並回傳 index，但是用時只需要 `O(logn)`，他的原理就是先用兩個 pointers `left`, `right` 分別在 array 的最左跟最右，並計算兩個 pointers 的中點 `mid`，如果 `nums[mid] > target`，表示 target 在左半邊，就把 right 縮到左半邊，反之就是表示 target 在右半邊，就把 left 縮到右半邊，持續這個過程直到 `nums[mid] == target` 就代表找到了，聽起來很簡單，實作起來長這樣："
readTime: 5
---

最基本款的 Binary Search，就是在 sorted array `nums` 中找到特定的 target，並回傳 index，但是用時只需要 `O(logn)`。

他的原理就是先用兩個 pointers `left`, `right` 分別在 array 的最左跟最右，並計算兩個 pointers 的中點 `mid`，如果 `nums[mid] > target`，表示 target 在左半邊，就把 right 縮到左半邊，反之就是表示 target 在右半邊，就把 left 縮到右半邊，持續這個過程直到 `nums[mid] == target` 就代表找到了，聽起來很簡單，實作起來長這樣：

```cpp
int binarySearch(vector<int>& nums, int target) {
    int left = 0, right = nums.size()-1;
    while(left <= right) {
        int mid = left + (right - left)/2;
        if( target < nums[mid] ) right = mid -1;
        else if( target > nums[mid] ) left = mid + 1;
        else return mid;
    }
    return -1;
}
```

Binary Tree 最麻煩的不是想法，而是這些奇怪的 edge case 的處理，下面來一一討論。

```cpp
while(left <= right)
```

首先 while loop 裡為什麼是 `<=`，而不是 `<`，因為 left 跟 right 是閉區間，意思就是 left 跟 right 這兩個端點都包含在區間內，表示他們都有可能是答案，所以 `left == right` 表示我們還有一個 index 還在區間內需要檢查，不可以跳出 loop。

```cpp
int mid = left + (right - left)/2;
```

mid 這裡也可以很簡單的直接用 `mid = (left + right)/2`，但這樣 left + right 可能會 overflow，所以保險起見 mid 用這個算法就不會有 overflow 的問題。

而 mid 在除不盡的情況下會站在中間偏左的那個位置，例如 left = 1, right = 4，理論上 mid 會是 2.5，但根本就沒有這個 index，因為我們都用 integer 的關係所以他會落在 2。

### **Binary Tree 變體**

解 Binary Tree 的題目不會這麼單純，一定會有很多奇怪的情況，例如說：

1. 如果 target 不在 nums 裡面，就要 return 大於 target 的最小值
2. nums 內如果有重複的 value，要回傳 index 最小的
3. nums 內如果有重複的 value，但是找不到 target，就要 return 大於 target 的最小值最左邊的 index
4. 如果有一個先遞增再遞減的 array，要 return 他的 peak

零零總總防不勝防，我在網路上看到一個超級好用的模板推薦給大家，可以一招打天下。

```cpp
bool is_valid(vector<int>& nums, int mid){
    return ...;
}

int binarySearch(vector<int>& nums, int target) {
    int left = 0, right = nums.size()-1;
    while(left <= right) {
        int mid = left + (right - left)/2;
        if( is_valid(nums, mid) ) right = mid -1;
        else left = mid + 1;
    }
    return left;
}
```

建立一個 `is_valid` function，判斷什麼時候 right 要縮進來，這是什麼意思呢？想像我們有一個 is_valid 的 array，長這樣：

```
nums     = [4, 5, 6, 7, 8, 9, 10], target = 6
is_valid = [0, 0, 1, 1, 1, 1, 1]
```

我們讓 `is_valid == true` 的地方全部都設為 1，會發現最後不管怎麼樣，left 都會停在第一個 1 的位置。我們來 trace 一次就知道了，不管今天題目怎麼變，`left == right` 的位置一定會停留在 0 跟 1 的交界處，假設他停在 0，也就是現在 index = 1 的位置，那我們就會讓 left + 1，left 就會到第一個 1 的位置了，如果現在停在 1，那我們會讓 right - 1，那 left 還是一樣停在第一個 1 的位置，所以照這個邏輯我們只要設計好 `is_valid` 就可以解開所有題目，可以舉一些例子一個一個來看。

### **Lower Bound**

> return 大於等於 target 的最小值( lower_bound )

如果照前面的邏輯，我們只要思考要讓 `is_valid` 設成 1 的條件是什麼就可以了，所以 `nums[mid] >= target` 的值都應該在內。

```cpp
bool is_valid(vector<int>& nums, int mid, int target){
    return nums[mid] >= target;
}
```

### **Upper Bound**

> return 大於 target 的最小值( upper_bound )

毫無壓力，直接改。

```cpp
bool is_valid(vector<int>& nums, int mid, int target){
    return nums[mid] > target;
}
```

### **Duplicates + Return First Index**

> 如果 nums 有重複的值，要回傳大於等於 target 最小值的最左邊的 index

```cpp
bool is_valid(vector<int>& nums, int mid, int target){
    return nums[mid] >= target;
}
```

### **Peak Element in Bitonic Array**

> 有一個先遞增再遞減的 array，要 return 他的 peak

稍微舉個例子看一下：

```
nums     = [3, 4, 5, 6, 7, 8, 7, 6, 3]
is_valid = [0, 0, 0, 0, 0, 1, 1, 1, 1]
```

所以這題會發現如果右邊的數字比較大 is_valid 就設 0，如果比較小 is_valid 就設 1。

```cpp
bool is_valid(vector<int>& nums, int mid){
    return nums[mid+1] < nums[mid];
}
```

不過這裡就要注意邊界的問題，我們會弄出 mid + 1，所以如果 mid 在最右邊的話，表示這是一個遞增的 array，直接 return 1 就可以了。

```cpp
bool is_valid(vector<int>& nums, int mid){
    return (mid == nums.size() - 1) || (nums[mid+1] < nums[mid]);
}
```

### **Find Unique in Duplicates**

> 一個 sorted array 中所有 value 都會重複兩次，只有一個會重複一次，找出那一個

一樣先舉個例子。

```
nums     = [2, 2, 3, 3, 4, 5, 5]
is_valid = [0, 0, 0, 0, 1, 1, 1]
```

再來就是找什麼時候會是 1，可以發現當 single value 出現前，奇數 index 會跟右邊不一樣， single value 出現後，奇數 index 會跟右邊一樣，所以就可以直接寫 is_valid

```cpp
bool is_valid(vector<int>& nums, int mid){
    if(mid == nums.size() - 1) return true;

    bool is_odd = (mid % 2 == 1);
    if(is_odd) return nums[mid] == nums[mid+1];
    else return nums[mid] != nums[mid+1];
}
```

### **結語**

所以 Binary Search 其實不該只是用來「找 sorted array 中的 target」，而是如果這個 array 可以找到一個 function 讓他左邊都是 false，右邊都是 true，就可以用 Binary Search 來解。