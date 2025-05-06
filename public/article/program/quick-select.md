---
title: "[ Algorithm ] Quick Select | 核心概念與 Leetcode 題型解析"
date: "2025-05-05"
author: James
tags: Algorithm,Quick Select
image: /images/program/algorithm.png
description: "Quick Select 是一種「在 unsorted array 中找出第 k 大或第 k 小」的 Algorithm，跟 Quick Sort 的想法很像，都是用 Divide and Conquer 來做思考的。"
readTime: 2
---

Quick Select 是一種「在 unsorted array 中找出第 k 大或第 k 小」的 Algorithm，跟 Quick Sort 的想法很像，都是用 Divide and Conquer 來做思考的。

我們先看一下 Quick Select 的 main function：

```cpp
int quickSelect(vector<int>& nums, int left, int right, int k) {
    if (left == right) return nums[left];
    int pivotIndex = partition(nums, left, right);

    if (k == pivotIndex) return nums[k];
    else if (k < pivotIndex) return quickSelect(nums, left, pivotIndex - 1, k);
    else return quickSelect(nums, pivotIndex + 1, right, k);
}
```

假設我們要找的是第 k 大的數字，`partition` 這個 function 會隨機挑選 `nums` 中一個 pivot 出來，在經過一系列的操作後，讓 pivot 左邊的數字都大於 pivot，右邊的數字都小於 pivot，最後回傳這個 pivot 的 index，也就是說對於這個 pivot 而言，經過 `partition` 後他就會落在理論上 sorting 後的正確的位置上，舉個例子：

```python
nums = [5, 3, 4, 6, 7, 8, 2]
pivot = 6
```

經過 `partition` 後可能會變這樣

```python
nums = [7, 8, 6, 5, 3, 4, 2]
```

pivot 會選哪個數字是由 partition 這個 function 決定的，以這個 case 來說，pivotIndex 就是 2，而在 index = 2 的左邊都比 6 大，右邊都比 6 小，但是只有 6 是在正確的位置上，其他人的位置不一定是正確的。

再來如果 k 比 pivotIndex 小，表示第 k 大的數字在 pivotIndex 的左邊，所以就把左邊的 subarray 再送進去 partition 一次，如果 k 就是 pivotIndex，表示我們已經找到第 k 大的數了，那如果 k 比 pivotIndex 大，就表示第 k 大的數字在 pivotIndex 的右邊，所以就把右邊的 subarray 再送進去 partition。

再來就要講決定 Quick Sort 效率的關鍵 - Partition，Partition 的方法決定了 Quick Sort 的速度，這邊介紹兩種方法：Lomuto Partition 與 Hoare Partition

### **Lomuto Partition**

首先，pivot 不管選哪一個數字，先把他放到最右邊，而我們需要兩個指標 `storeIndex` 跟 `i`，`i` 會 iterate 過整個 array，當發現 nums[i] 比 pivot 大，就要無腦的把他往左邊丟，`storeIndex` 就好像是一個分界，負責記錄「比 pivot 大」還有「比 pivot 小」的分界，所以在把 nums[i] 丟到左邊的過程就要持續更新 `storeIndex`，最後再把 pivot 放到 `storeIndex`，我們就完成「pivot 的左邊比 pivot 大，右邊比 pivot 小」的目標了。

```cpp
int partition(vector<int>& nums, int left, int right) {
    int pivot = nums[right];           // pivot 放在最右邊
    int storeIndex = left;             // 所有 > pivot 的放在這之前

    for (int i = left; i < right; ++i) {
        if (nums[i] > pivot) {
            swap(nums[i], nums[storeIndex]);
            ++storeIndex;
        }
    }

    swap(nums[storeIndex], nums[right]); // 把 pivot 放到正確位置
    return storeIndex;
}
```

雖然這種方法很好理解，但這種方法有一個小問題，就是他 swap 的次數 = 「比 pivot 大的元素個數」，意思就是比 pivot 大的數有幾個就要 swap 幾次，但是問題是有一些比 pivot 大的數字，他可能原本就在左半邊了，所以理論上他不用 swap 也可以完成「pivot 的左邊比 pivot 大，右邊比 pivot 小」的目標，為了減少 swap 的次數，就又有另一種 partition 的方法。

### **Hoare Partition**

首先不管 pivot 選什麼數字，我們都先把他放到最左邊，再來我們把整個 array 分成三個區塊「左半邊」、「pivot」、「右半邊」，我們只要檢查每一個數字是不是都在正確的區塊就可以了，如果不是的話就把他換到另一個區塊，所以我們需要兩個 pointer `l` 和 `r`，分別放在左右兩邊，不過因為最左邊已經有 pivot 了，所以實際上是這樣：

```
[pivot] [l, , , , ...] [ ..., , , , , r]
```

再來檢查每一個 `l` 跟 `r`，如果 `nums[l] >= pivot` 或是 `nums[r] <= pivot`，表示這個數字是在正確的區塊，就不用動他繼續讓 pointer 往中間走，但如果 `nums[l] < pivot && nums[r] > pivot`，表示這兩個數字是在錯誤的區塊，需要進行交換，最後 `l` 跟 `r` 的位置會變這樣

```
[pivot] [..., , , , , r] [l, , , , , ...]
```

也就是說他們會位置交換並落在兩個 section 的交界處，最後一步就是讓 pivot 跟 nums[r] 交換，並回傳 `r` 的位置就是 pivotIndex 了。

```cpp
int partition(vector<int>& nums, int left, int right) {
    int pivot = nums[left];
    int l = left + 1;
    int r = right;

    while (l <= r) {
        if (nums[l] < pivot && nums[r] > pivot) swap(nums[l++], nums[r--]);
        if (nums[l] >= pivot) l++;
        if (nums[r] <= pivot) r--;
    }
    swap(nums[left], nums[r]);
    return r;
}
```

以上就是兩種 partition 的方法，但我們會發現，partition 的時候我一直說把 pivot 放到最左邊或是放到最右邊，但我一直都沒有說一定要選最左邊或是最右邊的數字當 pivot，因為 pivot 不管選哪一個數字，我們讓他跟最左邊或是最右邊 swap 一下他就會到最邊邊了，所以 pivot 的決定要從效能去分析。

pivot 的選擇會怎麼影響 partition 的效能呢？我們可以用下面這個例子簡單判斷：

```
nums = [1, 2, 3, 4, 5, 6, 1000]
```

如果 pivot = 1000，也就是選在最極化的位置，那下一次 partition 就要看 [1, 2, 3, 4, 5, 6] 幾乎一模一樣的範圍，time complexity 有可能會退化為 worst case O(n^2)，但如果 pivot = 4，那下一次 partition 就只需要看 [1, 2, 3] 或是 [5, 6, 1000]，大幅減少需要判斷的範圍，所以總結來說

> 好 pivot 要選得越靠近中位數越好

但在一個 unsorted array 中，我們沒有辦法判斷到底哪一數才是真正的中位數，因爲如果真的要算出來，要 O(n) 看完整個 array 才會知道，這樣就本末倒置了，所以我們要做的是「選出手邊有的數字中最靠近中位數的數」就好，對於一個 array，我們最簡單可以 access 的就是 `left`, `right`, `mid`，挑出這三個之中最接近中位數的數當成 pivot

```cpp
int medianOfThree(vector<int>& nums, int left, int right) {
    int mid = left + (right - left) / 2;
    if (nums[right] < nums[left]) swap(nums[right], nums[left]);
    if (nums[mid] < nums[left]) swap(nums[mid], nums[left]);
    if (nums[right] < nums[mid]) swap(nums[right], nums[mid]);
    return mid;
}
```

講完所有細節了，底下直接附上 Quick Select 的完整 Template，用的是 medianOfTree + Hoare Partition

```cpp
int medianOfThree(vector<int>& nums, int left, int right) {
    int mid = left + (right - left) / 2;
    if (nums[right] < nums[left]) swap(nums[right], nums[left]);
    if (nums[mid] < nums[left]) swap(nums[mid], nums[left]);
    if (nums[right] < nums[mid]) swap(nums[right], nums[mid]);
    return mid;
}

int partition(vector<int>& nums, int left, int right) {
    int pivotIndex = medianOfThree(nums, left, right);
    int pivot = nums[pivotIndex], l = left + 1, r = right;
    swap(nums[pivotIndex], nums[left]);
    
    while (l <= r) {
        if (nums[l] < pivot && nums[r] > pivot) swap(nums[l++], nums[r--]);
        if (nums[l] >= pivot) l++;
        if (nums[r] <= pivot) r--;
    }
    swap(nums[left], nums[r]);
    return r;
}

int quickSelect(vector<int>& nums, int left, int right, int k) {
    if (left == right) return nums[left];

    int pivotIndex = partition(nums, left, right);

    if (k == pivotIndex) return nums[k];
    else if (k < pivotIndex) return quickSelect(nums, left, pivotIndex - 1, k);
    else return quickSelect(nums, pivotIndex + 1, right, k);
}
```
