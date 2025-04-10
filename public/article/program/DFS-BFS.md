---
title: "[ Algorithm ] DFS & BFS | 核心概念與 Leetcode 題型解析"
date: "2025-03-08"
author: James
tags: Algorithm,DFS,BFS
image: /images/program/algorithm.png
description: "要 traverse 一個 Graph 有兩種方式，一種是深度優先，也就是所謂的 DFS，我們找到 neighbor 之後不會急著把所有 neighbor 都找到，會再繼續往下找 neighbor 的 neighbor 直到找到底再回來，那另一種就是廣度優先，也就是所謂的 BFS，我們會先把所有 neighbors 找到之後再往下找他們各自的所有 neighbors，這裡根據這兩種方式來進行討論："
readTime: 2
---

要 traverse 一個 Graph 有兩種方式，一種是深度優先，也就是所謂的 DFS，我們找到 neighbor 之後不會急著把所有 neighbor 都找到，會再繼續往下找 neighbor 的 neighbor 直到找到底再回來，那另一種就是廣度優先，也就是所謂的 BFS，我們會先把所有 neighbors 找到之後再往下找他們各自的所有 neighbors，這裡根據這兩種方式來進行討論：

### DFS ( Depth-First Search )

顧名思義深度優先，找到下一個 neighbor 不會先把剩下的 neighbor 看完，會先繼續往更深的 neighbor 走，才會再回來看完目前的 neighbor。實作部分可以用 stack 或是 recursive 寫，我個人比較喜歡 recursive，因為用深度來想的話 recursive 就好像是一層一層往下 visit，會好想很多。

當碰到一個新的 node，會先標記成 visited 防止重複 visit，再來 iterate 所有 neighbor，如果這個 neighbor 還沒有被 visit，就一路 recursive 下去找到他的所有 node。

#### **Template**

```cpp
void DFS(vector<vector<int>>& arr, vector<bool>& visit, int v) {
    visit[v] = true;
    for( int neighbor : arr[v] ) {
        if(!visit[neighbor]) {
            DFS(arr, visit, neighbor);
        }
    }
}
```

#### **範例**

[[ Leetcode 841 ] Keys and Rooms | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-841/)<br>
[[ Leetcode 133 ] Clone Graph | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-133/)<br>
[[ Leetcode 200 ] Number of Islands | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-200/)

### BFS ( Breadth-First Search )

顧名思義廣度優先，所以會先看完所有的 neighbor，才會繼續往下看。用 queue 想就很簡單了，因為我先把所有的 neighbors 推進去 queue 裡面，再來看其中一個的時候，再把他的 neighbors 推進去 queue 裡排隊，這樣看的順序就會是廣度優先了，跟上面的 DFS 想法一樣，如果已經被 visited 的 node 就不要再推進去 queue 裡了。

#### **Template**

```cpp
void BFS(vector<vector<int>>& arr, vector<bool>& visit, int start) {
    queue<int> q;
    visit[start] = true;
    q.push(start);

    while (!q.empty()) {
        int v = q.front();
        q.pop();

        for (int neighbor : arr[v]) {
            if (!visit[neighbor]) {
                visit[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

