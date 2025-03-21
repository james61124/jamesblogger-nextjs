Binary Search Tree 除了每個 node 最多只能有兩個 children 外，還必須符合下面這條規則

```
所有 left subtree 的 value < root node 的 value < 所有 right subtree 的 value
```

這會造成兩種結果：
1. 如果用 inorder traversal 的話可以生出一個 increasing array
2. 如果需要 search 一個 value，平均的 time complexity 是 O(logn)，因為 binary tree 的平均高度就是 logn

Binary Search Tree 可以進行以下三種操作

### **Search**

簡單來說就是如果 val 比較小，那就往左邊找，如果 val 比較大，就往右邊找。

#### **Template**

```cpp
TreeNode* searchBST(TreeNode* root, int val) {
    if(!root) return nullptr;

    if(val == root->val) return root;
    else if(val < root->val) return searchBST(root->left, val);
    else return searchBST(root->right, val);
}
```

#### **範例**

700

### **Insert**

Insert 就是如果 val 比較小，就把他往左邊丟，如果 val 比較大，就把他往右邊丟，直到 `root == nullptr` 就表示丟到終點了，就開一個 new TreeNode 然後把他放著。

#### **Template**

```cpp
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if(!root) return new TreeNode(val);

    if(val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);

    return root;
}
```

#### **範例**

701

