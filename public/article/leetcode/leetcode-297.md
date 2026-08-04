---
title: "[ Leetcode 297 ] Serialize and Deserialize Binary Tree | 解題思路分享"
date: "2025-05-23"
author: James
tags: String,Tree,BFS,Binary Tree,Design
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: e15dbe74-e6ff-4113-b8ba-bb10ea725a89
---

這題要 implement 兩個 function，`serialize` 要把一個 binary tree 轉成 string 儲存，而 `deserialize` 要把 string 轉回 binary tree。

題目連結 🔗：[https://leetcode.com/problems/serialize-and-deserialize-binary-tree/](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

## 問題分析

常見的 Binary Tree Traversal 有三種：inorder, preorder, postorder，但這三種在轉成 array 之後是沒有辦法恢復成唯一的 Binary Tree 的，必須組合起來才可以，所以這題不能用這三種 traversal 來解，那我們怎麼做呢？

我們可以用類似 level order traversal 來解，一層一層把資訊推進去 array 中，這樣 reconstruct binary tree 的時候就可以一層一層解析了，比較不一樣的是除了一層一層放，我們還要把每一層的 `nullptr` 也放進去，這樣才能真的 reconstruct 出唯一的 binary tree。

## 解題思路 - BFS

先來看 serialize，我們要把 Tree 轉成 string，而既然是一層一層來解析，那我們可以用 BFS 來由左到右 traverse 過所有 node，可以寫出一個像這樣的框架：

```cpp
string serialize(TreeNode* root) {
    queue<TreeNode*>q;
    q.push(root);

    while(!q.empty()){
        TreeNode* cur = q.front();
        q.pop();
        q.push(cur->left);
        q.push(cur->right);
    }
}
```

我們來思考最後的 string 具體長什麼樣子，以這棵樹為例，string 會長這樣：

<figure>
  <img src="/images/leetcode/leetcode-297/binary-tree.png" alt="Street" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

<div className="overflow-x-auto">
  <table className="border border-black table-auto w-full border-collapse font-sans whitespace-nowrap">
    <thead>
      <tr>
        <th className="border border-black bg-gray-100 px-2 py-2 text-center">s</th>
        <th className="border border-black bg-white px-2 py-2 text-center">1</th>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">2</td>
        <td className="border border-black bg-blue-100 px-2 py-2 text-center">3</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">4</td>
        <td className="border border-black bg-green-100 px-2 py-2 text-center">5</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">#</td>
        <td className="border border-black bg-red-200 px-2 py-2 text-center">#</td>
      </tr>
    </thead>
  </table>
</div>

我把每一層標示不同顏色，然後我們就會發現，為什麼第四層只有四個 char，如果按照這個邏輯不是應該要有八個 "#" 嗎？但是在 Binary Tree 中，不可能會有 parent 是 nullptr 的情況下 children 還有東西，所以左半邊那四個 nullptr 完全可以省略掉，也因此每一層的資訊是

> 由左到右但跳過 parent 是 nullptr 的 node 

回到 serialize，我們每 visit 一個 node，就把這個 node 的 `left`, `right` 都送進去 queue 中，但是如果 visit 的 node 已經是 nullptr，那就不用再送 children 進去 queue 了。

而 visit 到的 node，如果有值就放 `val` 進去 string，如果是 nullptr 我們就放 `#` 進去 string 中。

```cpp
string serialize(TreeNode* root) {
    queue<TreeNode*>q;
    string s = "";
    q.push(root);

    while(!q.empty()){
        TreeNode* cur = q.front();
        q.pop();

        if(cur) {
            s += to_string(cur->val) + ",";
            q.push(cur->left);
            q.push(cur->right);
        } else {
            s += "#,";
        }
    }

    if (!s.empty()) s.pop_back(); // 把最後一個逗號拿走
    return s;
}
```

再來看 deserialize，要把 string 轉成 tree，首先要可以先解析有 `,` 的 string，這個可以利用 `stringstream` 解，先寫一個框架：

```cpp
TreeNode* deserialize(string data) {
    stringstream ss(data);
    string token;

    while (getline(ss, token, ',')) {
        // do something with token
    }
}
```

`token` 就是每一個解出來的數字，按照上面 serialize 的邏輯，解出來的數字順序是由左到右由上到下且跳過 parent 是 nullptr 的 node，因為我們要一層一層 reconstruct，所以必須儲存每一層的 node 接下來才能把相對應的 children 接下去，有點像是 BFS 的過程，所以我們也需要一個 queue 來儲存。

第一步先把 root 處理好：

```cpp
TreeNode* deserialize(string data) {
    stringstream ss(data);
    string token;
    queue<TreeNode*>q;
    TreeNode* root;

    if (getline(ss, token, ',')) {
        if(token == "#") return nullptr;
        root = new TreeNode(stoi(token));
        q.push(root);
    }
}
```

針對每一個 node 的處理，就是接到樹上，然後推進去 queue 中等到下一次被 visit，而因為我們需要用到 `stoi` 把 string 轉成 int，所以需要非常小心，當遇到 `#` 表示這個 node 是 nullptr，就不要再進 `stoi` 了。

再來就是 BFS 的流程，針對每一層，我們把 node 從 queue 中拿出來 visit，每從 queue 拿出一個 node 我們就要從 string 中 parse 出兩個數字，分別代表 left child, right child，然後再把這兩個 children 塞進去 queue，除非我們發現拿出來的 node 是 nullptr，就表示 string 中不會存屬於他的 children，因為他本來就沒有 children，就可以直接跳過，完整程式碼如下：

```cpp
TreeNode* deserialize(string data) {
    stringstream ss(data);
    string token;
    queue<TreeNode*>q;
    TreeNode* root;

    if (getline(ss, token, ',')) {
        if(token == "#") return nullptr;
        root = new TreeNode(stoi(token));
        q.push(root);
    }

    while(!q.empty()) {
        TreeNode* cur = q.front();
        q.pop();

        if (getline(ss, token, ',') && token != "#") {
            cur->left = new TreeNode(stoi(token));
            q.push(cur->left);
        }

        if(getline(ss, token, ',') && token != "#") {
            cur->right = new TreeNode(stoi(token));
            q.push(cur->right);
        }
    }

    return root;
}
```

至此就完成兩個 function 了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### Implementation

```cpp
string serialize(TreeNode* root) {
    queue<TreeNode*>q;
    string s = "";
    q.push(root);

    while(!q.empty()){
        TreeNode* cur = q.front();
        q.pop();

        if(cur) {
            s += to_string(cur->val) + ",";
            q.push(cur->left);
            q.push(cur->right);
        } else {
            s += "#,";
        }
    }

    if (!s.empty()) s.pop_back();
    return s;
}

TreeNode* deserialize(string data) {
    stringstream ss(data);
    string token;
    queue<TreeNode*>q;
    TreeNode* root;

    if (getline(ss, token, ',')) {
        if(token == "#") return nullptr;
        root = new TreeNode(stoi(token));
        q.push(root);
    }

    while(!q.empty()) {
        TreeNode* cur = q.front();
        q.pop();

        if (getline(ss, token, ',') && token != "#") {
            cur->left = new TreeNode(stoi(token));
            q.push(cur->left);
        }

        if(getline(ss, token, ',') && token != "#") {
            cur->right = new TreeNode(stoi(token));
            q.push(cur->right);
        }
    }

    return root;
}
```
