---
title: "[ Leetcode 15 ] 3Sum | 解題思路分享"
date: "2025-03-27"
author: James
tags: Array,Two Pointers, Sorting
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個整數 array `nums`，找出所有不重複的 a, b, c，使得 `a + b + c = 0`

題目連結 🔗：[https://leetcode.com/problems/3sum/](https://leetcode.com/problems/3sum/)

### **問題分析**

這題最直覺的解是沿用 2Sum 的解法用 Hash Map，for loop iterate nums[i]，對於每一個 nums[i] 而言找到一個 nums[j] 然後看看 `target-nums[i]-nums[j]` 有沒有在 Hash Map 裡，不過這樣就需要多開一個 Hash Map 的 O(n) 的空間，這題其實有更省的解法。

我們先一樣定住一個 element，然後想辦法用有效率的方法來找總和為 `target - element` 的兩個 value，如果我們先將 array sort 好了，用 two pointers 來找符合條件的 elements，這樣就會很快了。

### **解題思路 - Two Pointers**

所以想法很簡單，for loop 走過每一個 nums[i]，因為 target = 0，所以我們要找到 nums[i] 右邊的兩個 elements 總和等於 -nums[i]，我們需要 `left = i + 1`, `right = nums.size() - 1`，如果先把 array 排序好，`left + right` 太大就縮 `right`，`left + right` 太小就縮 `left`，非常直覺，不過我們必須解決一些 edge case。

題目說不可以有 duplicate，所以我們要想一些機制來防止這件事情，首先 nums[i] 如果看過了，後面的 nums[i] 如果 value 是一樣的就不用再看了，這樣找到了也只會 duplicate 而已，所以設個條件把他跳過：

```cpp
if(i > 0 && nums[i] == nums[i-1]) continue;
```

再來如果 `nums[left] + nums[right] == -nums[i]`，我們要將結果推進去 `vector<int>result`，但這裡不能 break 然後直接去找下一個 `i`，因為 `left`, `right` 往內縮可能還會有其他組合總和會是 `-nums[i]`，所以除了繼續往內縮之外，我們要解決 duplicate 的問題，如果內縮完的 nums[left] or nums[right] 跟剛剛一樣，那就要繼續縮，不然就算找到答案也只會是 duplicate。

```cpp
while(left < right && nums[left] == nums[left-1]) left++; 
while(left < right && nums[right] == nums[right+1]) right--; 
```

然後 left 一直加其實有可能會超過 array 的邊界，這裡要放 `left < nums.size()` 也可以啦，不過其實放 `left < right` 就好了，畢竟 right 的初始值就已經是 `nums.size()-1` 了，而另外一邊 right 一直減也是一樣意思。

**Time Complexity** - `O(n^2)`，sort 是 `O(nlogn)`，不過 two pointers 還是 `O(n^2)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>>result;

    sort(nums.begin(), nums.end());
    for(int i = 0; i < nums.size() - 2; i++){
        if(i > 0 && nums[i] == nums[i-1]) continue;
        int left = i + 1, right = nums.size() - 1;
        while(left < right){
            if(nums[left] + nums[right] == -nums[i]){
                result.push_back({nums[i], nums[left], nums[right]});
                left++;
                right--;
                while(left < right && nums[left] == nums[left-1]) left++; 
                while(left < right && nums[right] == nums[right+1]) right--; 
            }
            else if(nums[left] + nums[right] > -nums[i]) right--;
            else left++;
        }
    }

    return result;
}
```