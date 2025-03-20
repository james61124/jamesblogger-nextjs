TreeNode* buildTreeHelper(vector<int>& preorder, unordered_map<int, int>& umap, int preLeft, int preRight, int inLeft, int inRight){

        if(preLeft > preRight) return nullptr;
        TreeNode* root = new TreeNode(preorder[preLeft]);
        
        int rootInorderIndex = umap[preorder[preLeft]];
        int leftSize = rootInorderIndex - inLeft;

        root->left = buildTreeHelper(preorder, umap, preLeft+1, preLeft + leftSize, inLeft, rootInorderIndex - 1);
        root->right = buildTreeHelper(preorder, umap, preLeft + leftSize + 1, preRight, rootInorderIndex + 1, inRight);

        return root;
    }

    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {

        unordered_map<int, int>umap; 
        for(int i=0; i<inorder.size(); i++){
            umap[inorder[i]] = i;
        }

        return buildTreeHelper(preorder, umap, 0, preorder.size()-1, 0, inorder.size()-1);

    }