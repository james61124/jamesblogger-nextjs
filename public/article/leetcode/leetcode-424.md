---
title: "[ Leetcode 424 ] Longest Repeating Character Replacement | 解題思路分享"
date: "2025-05-19"
author: James
tags: Hash Table,String,Sliding Window
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 2
id: 3c3d8ae1-8cdd-4bfd-896d-8a7911b55e0b
---

給一個只包含大寫英文字母的字串 `s`，你最多可以將其中 k 個字母替換成其他字母。請你找出一個最長的 substring，使得這個 substring 中所有字母都相同（在最多 k 次替換後）。

題目連結 🔗：[https://leetcode.com/problems/longest-repeating-character-replacement/](https://leetcode.com/problems/longest-repeating-character-replacement/)

### **問題分析**

看到要找 longest substring，就直接往 sliding window 的方向試試看，而一個「合法」的 substring 表示「substring 內數量最多的字母數 + k」會大於等於 substring size，這樣才可以在 replace k 次內把 substring 所有字母都變一樣。

而 sliding window 解這題的思路也不難想，`right` 持續擴展直到整個 substring 變成 invalid，這時候表示 substring 太長了，所以 `left` 就縮進來，持續這個步驟就可以了，因此關鍵在於我們要怎麼有效率的檢查「substring 是否 valid」。

```
while right < n:
    if (sliding window is valid):
        right++
    else:
        left++
```

### **解題思路 - Sliding Window**

最直覺的做法，我們需要一個方法讓我們可以快速找到當下 sliding window 內數量最多的字母數，基本上用一個 map 就可以解了，因為 map 會自動排序，而且還可以快速更新數量。

```
map<int, int>mp;

while right < n:
    while (map's last element) + k < (sliding window size):
        mp[s[left]]--;
        left++;

    mp[s[right]]++;
    right++;
```

但我們其實有更好的做法，我們其實不需要計算每一次 sliding window 內的最多相同字母數量，看個範例：

```python
index = 0 1 2 3 4 5 6
s     = A A A B B C A
```

left = 0, right = 4 時，substring 是 valid，最多相同字母數量是 3，所以 longest valid substring 是 5，但今天移動 pointer，移動到 left = 1, right = 5 的時候，完全不用停下來檢查，因為現在 sliding window 內相同字母最多的數量是 2，就算這個 substring 是 valid，長度也不會超過 5，所以我們完全不需要停留，換句話說

> 我們只需要關注「sliding window 內相同字母數量更多」的情況

我們不需要 map 來幫我們排序找到當下 sliding window 內「最多的字母數」，我們只需要維護一個 `int dict[26]` 就可以紀錄 sliding window 內所有字母數，然後利用一個 `maxCount` 來紀錄歷史上 sliding window 內相同字母數量最多的數量。

然後我們會控制 sliding window 的大小不會超過 maxCount + k，如果超過了就讓 `left` 縮進來，沒有超過或是 maxCount 變大了，就繼續擴展 `right` 加大 sliding window 的大小，那我們要怎麼計算 longest valid substring 呢？

> 如果 sliding window 維持不超過 `maxCount + k`，sliding window 的大小就會一直是 valid 的 longest substring

```cpp
int n = s.size();
int left = 0, right = 0;
int dict[26] = {0};
int maxCount = 1;
int result = 0;

while(right < n){

    dict[s[right] - 'A']++;
    maxCount = max(maxCount, dict[s[right] - 'A']);

    if((right - left + 1) - k > maxCount) {
        dict[s[left] - 'A']--;
        left++;
    }

    result = max(result, right - left + 1);
    right++;
}

```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int characterReplacement(string s, int k) {
    int n = s.size();
    int left = 0, right = 0;
    int maxCount = 1;
    int result = 0;

    while(right < n){

        dict[s[right] - 'A']++;
        maxCount = max(maxCount, dict[s[right] - 'A']);
        if((right - left + 1) - k > maxCount) {
            dict[s[left] - 'A']--;
            left++;
        }

        result = max(result, right - left + 1);
        right++;
    }

    return result;
}
```
