---
title: "[ Leetcode 210 ] Course Schedule II | 解題思路分享"
date: "2025-03-08"
author: James
tags: BFS,DFS,Graph,Topological Sort
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

你需要修 numCourses 門課，這些課程從 0 到 numCourses - 1 編號。某些課程有先修課，用一個 prerequisites array 來表示，prerequisites[i] = [a, b]，意思是：

- 想修課 a，必須先修課 b（b → a）。

題目要求 return 一個可行的修課順序，讓你可以完成所有課程。如果無法完成所有課程（ Graph 中存在 Cycle ），則返回 empty array []。

題目連結 🔗：[https://leetcode.com/problems/course-schedule-ii/](https://leetcode.com/problems/course-schedule-ii/)

### **問題分析**

題目說要返回合理的修課順序，如果把這些課程先修後修的關係畫成一張 Directed Graph，我們要確保每門課程只有在所有先修課完成後才會出現在順序中，所以我們需要的就是 Topological Sort 後的 Order。

### **解題思路 - Topological Sort**

如果知道什麼是 Topological Sort 跟怎麼實作的話就很單純了，詳情請洽 Topological Sort 頁面，唯一需要注意的應該只有一點：

#### **轉成 Adjacency List 比較好實作**

題目給的是 Directed Graph 的 edge 而已，跑個迴圈轉成 Adjacency List 就可以直接實作 Topological Sort 了。

**Time Complexity** - `O( V + E )`，因為用 BFS traverse 過整個 Graph<br>
**Space Complexity** - `O( V + E )`，建了一個 Adjacency List

### **Implementation**

```cpp
vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses); // Adjacency list
    vector<int> in_degree(numCourses, 0); // Store in-degrees
    vector<int> order; // Store the result
    queue<int> q; // Queue for BFS

    // Build the graph and track in-degrees
    for (vector<int>& pre : prerequisites) {
        adj[pre[1]].push_back(pre[0]);
        in_degree[pre[0]]++;
    }

    // Add courses with 0 in-degree (no prerequisites) to the queue
    for (int i = 0; i < in_degree.size(); i++) {
        if (in_degree[i] == 0) {
            q.push(i);
        }
    }

    // Perform BFS
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        order.push_back(curr);

        for (int next : adj[curr]) {
            in_degree[next]--;
            if (in_degree[next] == 0) {
                q.push(next);
            }
        }
    }

    // If all courses are included in the order, return it; otherwise, return an empty array
    return (order.size() == numCourses) ? order : vector<int>();
}
