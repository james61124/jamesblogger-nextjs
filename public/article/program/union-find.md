---
title: "[ Algorithm ] Union Find | 核心概念與 Leetcode 題型解析"
date: "2025-05-12"
author: James
tags: Algorithm,Union Find
image: /images/program/algorithm.png
description: "Union Find 是一種 Tree Structure，專門用來判斷兩個 element 是不是隸屬同一個 Disjoint Set，而他的想法非常好理解，只要兩個 element 的 root 是同一個人，就表示他們在同一顆 Tree 中，也就是他們在同一個 Disjoint Set 裡面。"
readTime: 2
---

Union Find 是一種 Tree Structure，專門用來判斷兩個 element 是不是隸屬同一個 Disjoint Set，而他的想法非常好理解，只要兩個 element 的 root 是同一個人，就表示他們在同一顆 Tree 中，也就是他們在同一個 Disjoint Set 裡面。

有了這個概念後，先來介紹如何初始化這個 class，因為我們還沒有開始對每一個 element 進行合併，所以每個人的 parent 都是自己，也就是說每個人的 root 都是自己，換句話說，等等不管怎麼接，如果我們要找到一個 element 的 root，只要看到有一個 element 的 parent 是自己，就表示找到 root 了。

```cpp
class UnionFind {
public:
    vector<int>parent;

    UnionFind(int n){
        parent.resize(n);
        for(int i=0; i<n; i++){
            parent[i] = i;
        }
    }
};
```

再來我們要介紹 Union Find 中最重要的兩個操作：Union 跟 Find

> Find - 確定某個 element 屬於哪一個 Set

所以白話文其實就是找到這個 element 的 root，找 root 的過程就是一直往上看 parent，直到找到 root，而 root 的判定就是當一個 element 的 parent 是自己的時候就表示他是 root，寫起來會長這樣

```cpp
int find(int x){
    if(parent[x] != x){
        return find(parent[x]);
    }
    return parent[x];
}
```

但是這裡我們需要做一件很重要的事情，就是「壓縮」，我們的目標如果只是要 return 一個 element 的 root，那 element 的 parent 如果直接就是 root 速度一定最快，就不用一層一層往上找，所以在 find 的過程我們同時會做壓縮，把路上每一個人的 parent 都設定成 root，這樣下一次在查的時候就不用再走一次這段很長的路了，而「壓縮」才是 Union Find 的精華所在

```cpp
int find(int x){
    if(parent[x] != x){
        parent[x] = find(parent[x]);
    }
    return parent[x];
}
```

> Union - 將兩個 set 合併成一個 set

Union 的概念就是把其中一個 set 的 root 接到另一個 root 底下，所以我們需要思考的是把誰的 root 接到誰的 root 底下會讓這個 set 的深度最小，如果接完之後整個 set 的深度很大的話，就會增加 find 所需要的時間，因此這裡我們需要多一個變數 - rank，而 rank 是用來記錄這個 set 的深度，舉例來說：

如果 `rank(rootX) = 4`, `rank(rootY) = 2`，把 rootY 接到 rootX 底下，整個 set 的 rank 就還是一樣是 4，但如果反過來，那整個 set 的 rank 就會變成 5 了，因此我們要讓小 rank 接到大 rank 底下，同時更新 rank，寫起來會長這樣

```cpp
class UnionFind {
public:
    vector<int>parent;
    vector<int>rank; // 紀錄 set 的深度

    UnionFind(int n){
        parent.resize(n);
        rank.resize(n, 0); // 初始化為 0
        for(int i=0; i<n; i++){
            parent[i] = i;
        }
    }

    int find(int x){
        if(parent[x] != x){
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    void unite(int x, int y){
        int rootX = find(x);
        int rootY = find(y);
        if( rootX != rootY ){
            if( rank[rootX] > rank[rootY] ){
                parent[rootY] = rootX;
            } else if( rank[rootY] > rank[rootX] ){
                parent[rootX] = rootY;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
        }
    }
};
```

那到這邊基本上也就完成所有中要的功能了，再來就是有兩個 function 有可能會遇到但是不一定要實作出來，如果需要計算目前還剩下幾個 Disjoint Set 的話就要維護一個變數 `count`，要判斷兩個 element 是不是在同一個 set 也可以直接寫 function 在這個 class 裡就可以了，所以 template 就是這樣：

```cpp
class UnionFind {
public:
    vector<int>parent;
    vector<int>rank;
    int count;

    UnionFind(int n){
        parent.resize(n);
        rank.resize(n, 0);
        for(int i=0; i<n; i++){
            parent[i] = i;
        }
        count = n;
    }

    int find(int x){
        if(parent[x] != x){
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    void unite(int x, int y){
        int rootX = find(x);
        int rootY = find(y);
        if( rootX != rootY ){
            if( rank[rootX] > rank[rootY] ){
                parent[rootY] = rootX;
            } else if( rank[rootY] > rank[rootX] ){
                parent[rootX] = rootY;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            count--;
        }
    }

    bool connected(int x, int y) {
        return find(x) == find(y);
    }

    int getCount() const {
        return count;
    }
};
```

最後我想談談 `rank` 的問題，剛剛我說 rank 是拿來紀錄 set 的深度，但我們會發現，我們只有在 unite 的時候才有更新 rank，但是 find 的時候明明也有壓縮整個 Tree 為什麼我們卻沒有更新 rank 呢？這是因為

> rank 不是代表實際深度，只是一個合併順序的近似代表

不更新 rank 確實可能造成個別操作不是最好的合併方式，例如說 `rank(A) = 5`，`rank(B) = 2`，但實際上 rank(A) 因為壓縮過了現在實際深度是 1，所以理論上我們要讓 A 接到 B，但是由於 rank 的關係我們還是要讓 B 接到 A 底下，這是因為一直照著 rank 的規則走可以保證整體的摺疊效果，就好像一棵樹經過了很多合併所以 rank 很高，那我們就要傾向把別人都接過來。

至於為什麼壓縮的時候不要更新 rank？是因為維護實際深度的代價太高，這樣就本末倒置反而會增加時間複雜度了，所以

> 雖然個別合併可能不是最短路徑，但只要結合「rank + 路徑壓縮」，最壞情況的整體摺疊效果仍然是非常快的

### **範例**

[[ Leetcode 200 ] Number of Islands | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-200)