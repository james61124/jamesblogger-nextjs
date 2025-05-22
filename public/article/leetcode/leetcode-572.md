---
title: "[ Leetcode 572 ] Subtree of Another Tree | 解題思路分享"
date: "2025-05-20"
author: James
tags: Tree,DFS,Binary Tree,KMP
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給兩個 Binary Tree `root` 和 `subRoot`，判斷 `subRoot` 是不是 `root` 的 sub tree。

題目連結 🔗：[https://leetcode.com/problems/subtree-of-another-tree/](https://leetcode.com/problems/subtree-of-another-tree/)

### **問題分析**

這題可以先照最直覺的思路慢慢思考，在還沒看到 subRoot 以前就一直看，直到看到 subRoot 就開始檢查下面的 sub tree 有沒有一樣。

### **解題思路 - DFS**

首先在還沒有找到 subRoot 以前，只要任何一個 child 回傳他們找到 sub tree 了就可以了，所以 dfs function 的想法是這樣：

```cpp
bool dfs(TreeNode* root, TreeNode* subRoot){
    return dfs(root->left, subRoot) || dfs(root->right, subRoot);
}
```

如果發現 root 跟 subRoot 一樣，表示要開始遞迴檢查兩邊的 sub tree 有沒有一樣了，那應該怎麼做呢？我們需要 dfs 比過每一個 node 確認他們都一樣，也因此兩個 children 都要回傳 true 才表示整棵樹是真的一樣。

```cpp
bool isSame(TreeNode* root, TreeNode* target){
    return isSame(root->left, target->left) && isSame(root->right, target->right);
}
```

當我們檢查兩個 node 發現一樣的時候，就要繼續往下看他們的 children 有沒有一樣，這個過程會一直到 root 跟 target 都碰到 nullptr 為止，因此如果發現 root 跟 target 都是 nullptr，表示至少這條路徑上兩邊都是一樣的，要 return true，那當然如果兩個 node 不一樣就直接回傳 false 不用繼續看了。

```cpp
bool isSame(TreeNode* root, TreeNode* target){
    if(!root && !target) return true;
    if(root->val != target->val) return false;
    return isSame(root->left, target->left) && isSame(root->right, target->right);
}
```

最後有可能會有 root 或是 target 某一邊先一步碰到 nullptr，這種情況也要考慮進去

```cpp
bool isSame(TreeNode* root, TreeNode* target){
    if(!root && !target) return true;
    if(!root || !target) return false;
    if(root->val != target->val) return false;
    return isSame(root->left, target->left) && isSame(root->right, target->right);
}
```

那回到最一開始，如果發現 root 跟 subRoot 一樣的話，就要開啟 `isSame` 來判斷兩個 subtree 有沒有一樣，但因為這顆 Binary Tree 的每個 node 不是 unique，如果這個 node `isSame` 沒有通過，是必須要繼續 dfs 找找看還有沒有別的 sub tree 符合，不能直接判斷 subRoot 不是 root 的 sub tree，因此完整的程式碼長這樣：

```cpp
bool isSame(TreeNode* root, TreeNode* target){
    if(!root && !target) return true;
    if(!root || !target) return false;
    if(root->val != target->val) return false;
    return isSame(root->left, target->left) && isSame(root->right, target->right);
}

bool dfs(TreeNode* root, TreeNode* target){
    if(!root) return false;
    if(isSame(root, target)) return true;
    return dfs(root->left, target) || dfs(root->right, target);
}
```

**Time Complexity** - `O(n*m)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool isSame(TreeNode* root, TreeNode* target){
    if(!root && !target) return true;
    if(!root || !target) return false;
    if(root->val != target->val) return false;
    return isSame(root->left, target->left) && isSame(root->right, target->right);
}

bool dfs(TreeNode* root, TreeNode* target){
    if(!root) return false;
    if(isSame(root, target)) return true;
    return dfs(root->left, target) || dfs(root->right, target);
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    return dfs(root, subRoot);
}
```

### **另解 - KMP**

用 DFS 我們就會發現，如果在 `root` 中有很多重複的 `subRoot`，例如 root = "A, A, A, A, B", subRoot = "A, A, A, B"，這樣就要重複好幾個 node 都做一次 DFS，其實是滿暴力的做法，事實上 KMP 就是負責解決這種重複的事情。

KMP 是一個 O(m + n) 的 Algorithm，可以在一個 string `text` 底下判斷 string `pattern` 是不是他的 substring，也就是說，我們只要將題目的 Binary Tree 都轉成字串，直接用 KMP 進行字串比對就可以知道 `subRoot` 是不是 `root` 的 sub tree 了。

不過這題 Leetcode 的測資太少，所以 run time 並沒有很明顯的效果提升，但從時間複雜度來分析理論上是會比較快的，啊 KMP 太複雜了，先上程式碼，之後再寫解析。

**Time Complexity** - `O(m+n)`<br>
**Space Complexity** - `O(m+n)`

#### **Implementation**

```cpp
void serialize(TreeNode* root, string& s) {
    if (!root) {
        s += ",#,";
        return;
    }
    s += "," + to_string(root->val) + ",";
    serialize(root->left, s);
    serialize(root->right, s);
}

vector<int> buildLPS(const string& pattern) {
    int n = pattern.size();
    vector<int> lps(n, 0);
    int len = 0;

    for(int i = 1; i < n; ++i) {
        while(len > 0 && pattern[i] != pattern[len])
            len = lps[len - 1];
        if(pattern[i] == pattern[len])
            len++;
        lps[i] = len;
    }

    return lps;
}

bool kmp(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    vector<int> lps = buildLPS(pattern);
    int i = 0, j = 0;

    while(i < n) {
        if(text[i] == pattern[j]) {
            i++; j++;
            if(j == m) return true;
        } else if(j > 0) {
            j = lps[j - 1];
        } else {
            i++;
        }
    }

    return false;
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    string s1 = "", s2 = "";
    serialize(root, s1);
    serialize(subRoot, s2);
    return kmp(s1, s2);
}
```