---
title: "[ Leetcode 139 ] Word Break | 解題思路分享"
date: "2025-04-10"
author: James
tags: Array,Hash Table,String,DP,Recursion,Memorization
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
---

給你一個 string `s` 和一個字典 `wordDict`，請判斷 `s` 是否能夠被切割成一連串存在於字典中的單字。

題目連結 🔗：[https://leetcode.com/problems/word-break/](https://leetcode.com/problems/word-break/)

### **問題分析**

我這題第一感其實是 recursion + memorization，解起來也沒有不好，但是總覺得缺乏了一點紀律。

### **解題思路 - Recursion + Memorization**

我們需要 iterate s[i] 來取得一個 substring，並判斷該 substring 是不是已經在 wordDict 裡了，如果是的話，就清空 substring 然後往下一層送，最後如果發現結果是 false，就要回到這層繼續接 substring，舉例來說：

```
s = "catsandog"
wordDict = ["cats","dog","sand","and","cat"]
```

所以第一個 substring 看到 "cat" 會發現在 wordDict 裡了，所以就清空往下送到下一層，再來發現 "sand" 也在 wordDict 裡面，就再清空往下送，結果發現只剩下 og 所以要 return false，這時候就回到上一層的 "sand" 繼續往下接，結果發現 "sandog" 也都不在 wordDict 裡，所以就要再回到上一層 “cat” 繼續往下接，這應該是最直覺的 Recursion 的解法。(題外話 wordDict 要先轉成 Hash Table 這樣才能很快的查看 substring 是不是在 wordDict 裡面)

```cpp
bool dfs(int i, string& s, string substring, unordered_set<string>& uset){
    if(i == s.size()) return substring == "" ? true : false;

    while(i < s.size()){
        substring += s[i];
        if(uset.count(substring)) {
            if(dfs(i+1, s, "", uset)) return true;
        }
        i++;
    }

    return false;
}
```

再來我們會發現在重複計算的過程，有一些 index 如果早就已經被看過要 return false 了，就不用再往下看了，所以我們可以開一個 memorization 來紀錄這些重複的 state，寫起來就會長這樣：

```cpp
bool dfs(int i, string& s, string substring, 
        unordered_set<string>& uset, vector<bool>& dp){
    if(i == s.size()) return substring == "" ? true : false;
    if(!dp[i]) return false;

    while(i < s.size()){
        substring += s[i];
        if(uset.count(substring)) {
            if(!dfs(i+1, s, "", uset, dp)) dp[i+1] = false;
            else return true;
        }
        i++;
    }

    return false;
}
```

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
bool dfs(int i, string& s, string substring, 
                unordered_set<string>& uset, vector<bool>& dp){
    if(i == s.size()) return substring == "" ? true : false;
    if(!dp[i]) return false;

    while(i < s.size()){
        substring += s[i];
        if(uset.count(substring)) {
            if(!dfs(i+1, s, "", uset, dp)) dp[i+1] = false;
            else return true;
        }
        i++;
    }

    return false;
}

bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string>uset(wordDict.begin(), wordDict.end());
    vector<bool>dp(s.size()+1, true);
    return dfs(0, s, "", uset, dp);
}
```

### **思路優化 - DP**

上面的解法總覺得思路有一點亂，所以嘗試從 DP 下手試試看，不過這題第一次寫的時候我也沒有想到 DP 的解，因為他不太像是什麼可以把問題拆成「子問題」的題目，我就一直以為不是 DP。

如果用 DP 來看的話，直接先從題目需求來看，我們需要一個 dp[i] 代表「s[0...i-1] 可不可以成功被切割」，儲存的是 bool。所以如果 `dp[i] == true`，代表 s[0...i-1] 可以被成功切割，所以對於每一個 dp[i] 來說，如果找到一個 dp[j] (j < i) 為 true 而 s[j...i-1] 有在 wordDict 裡面，就代表 s[0...i-1] 可以被切割，所以 dp[i] 就是 true。

```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string>uset(wordDict.begin(), wordDict.end());
    vector<bool>dp(s.size()+1, true);
    return dfs(0, s, "", uset, dp);

    unordered_set<string>uset(wordDict.begin(), wordDict.end());
    vector<bool>dp(s.size()+1, false);
    dp[0] = true;
    for(int i=1; i<dp.size(); i++){
        for(int j=0; j<i; j++){
            if(dp[j] && uset.count(s.substr(j, i-j))){
                dp[i] = true;
                break;
            }
        }
    }

    return dp[s.size()];
}
```

到這裡目前的 time complexity 是 `O(n^2)`，但我們其實可以把 time complexity 再優化成 `O(n*L)`，其中 L 是 wordDict 中長度最長的 string，我們需要查 s[j...i-1] 在不在 wordDict 裡，但如果 i-j 本身就已經比 L 大，那根本就不需要查了，所以 j 的起始位置不應該全部都從 0 開始，我們可以選擇在 `i >= L` 的情況下從 `i - L` 開始，就可以節省更多時間。

**Time Complexity** - `O(n*L)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string>uset(wordDict.begin(), wordDict.end());
    vector<bool>dp(s.size()+1, false);
    int maxLen = 0;

    for(const string& word : wordDict){
        maxLen = max(maxLen, (int)word.size());
    }

    dp[0] = true;
    for(int i=1; i<dp.size(); i++){
        int j = i < maxLen ? 0 : i - maxLen;
        while(j < i){
            if(dp[j] && uset.count(s.substr(j, i-j))){
                dp[i] = true;
                break;
            }
            j++;
        }
    }

    return dp[s.size()];
}
```