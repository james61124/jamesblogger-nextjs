---
title: "[ Leetcode 16 ] 3Sum Closest | 解題思路分享"
date: "2026-03-13"
author: James
tags: Two Pointers,Amazon
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
id: 83d897bc-5f26-4b71-827f-d6432e26f9e0
---

給 nums[i]，選三個數字總和最接近 target 的，並回傳總和

題目連結 🔗：[https://leetcode.com/problems/3sum-closest/](https://leetcode.com/problems/3sum-closest/)

### **問題分析**

這題解法基本上跟 3Sum 一模一樣，差別只是每一次 two pointers 移動的時候都要檢查一次現在的總和是不是更接近 target

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int threeSumClosest(vector<int>& nums, int target) {
    int n = nums.size();
    int distance = INT_MAX;
    int result = 0;

    sort(nums.begin(), nums.end());
    for(int i = 0; i < nums.size(); i++){
        if(i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1;
        int right = n - 1;

        while(right > left){
            int sum = nums[i] + nums[left] + nums[right];
            int dist = abs(sum - target);
            if(dist < distance){
                result = sum;
                distance = dist;
            }

            if(sum > target){
                right--;
                while(right > left && nums[right] == nums[right + 1]) right--;
            } else {
                left++;
                while(right > left && nums[left] == nums[left - 1]) left++;
            }
        }
    }

    return result;
}
```