---
title: "[ Leetcode 355 ] Design Twitter | 解題思路分享"
date: "2025-07-02"
author: James
tags: Hash Table,Linked List,Priority Queue
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

設計一個簡化版的 Twitter，有 4 個 function：

> `postTweet(userId, tweetId)` - 用戶 userId 發佈一則 tweet，編號 tweetId<br>
> `getNewsFeed(userId)` - 回傳該用戶的「最新的 10 篇推文」，包含自己發佈的推文以及所有他關注對象發佈的推文，要按照發佈時間從新到舊排序<br>
> `follow(followerId, followeeId)` - 用戶 followerId 關注 followeeId<br>
> `unfollow(followerId, followeeId)` - 用戶 followerId 取消關注 followeeId

題目連結 🔗：[https://leetcode.com/problems/design-twitter/](https://leetcode.com/problems/design-twitter/)

### **問題分析**

趙題目的說法這題應該有兩種儲存的方式，第一種直接照著 post 的順序存，然後存 tweetId 跟 userId

```python
[{tweetId1, userId1}, {tweetId2, userId2}, {tweetId3, userId3}, ...]
```

這樣實作起來應該不會很難，只是執行 `getNewsFeed` 的時候就要一個一個看最新貼文發佈人是不是在 follow 名單中，時間複雜度是 O(n)，n 是所有貼文數。

第二種是將每個人的貼文都分開存在 Hash Table 中，看起來像這樣

```python
{
    "userId1": {tweetId1, timestamp1}, {tweetId2, timestamp2}, ...,
    "userId2": {tweetId3, timestamp3}, {tweetId4, timestamp4}, ...
}
```

利用 timestamp 紀錄每一篇貼文的先後順序，隨之而來的問題是我們要找到所有 following 的人中順序最前面的 10 篇貼文，這其實就是 Merge k Sorted List 的問題，時間複雜度是 O(mlogk)，其中 m 是 10，k 是 following 的人數，比 O(n) 還要快非常多，如果不熟悉這個問題，可以先做下面這題。

[[ Leetcode 23 ] Merge k Sorted Lists | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-23)

### **解題思路 - Merge k Sorted Lists**

首先我們需要一個 Hash Table 來儲存所有人發的貼文，需要另一個 Hash Table 儲存每個 user follow 的人，再來需要一個 `count` 紀錄目前發了幾篇文了，這樣才可以紀錄每一篇文被發的時間。

```cpp
struct ListNode {
    int tweetId;
    int timeStamp;
    ListNode* next;
    ListNode(int tweetId, int timeStamp) : tweetId(tweetId), timeStamp(timeStamp), next(nullptr) {}
};

unordered_map<int, ListNode*>posts;
unordered_map<int, unordered_set<int>>following;
int count;
```

這邊貼文為什麼要寫成 Linked List 呢？在 Merge k Sorted List 中，當一個 node 從 priority queue 被拉出來後，會推 node->next 進到 priority queue 中，如果這些 posts 不是用 Linked List 儲存而是用 vector，要 access node->next 我們就必須儲存每一個 user 目前 posts 被推到哪一個 index 了，就會變得有點麻煩，所以 Linked List 應該是最好的選擇。

繼續往下看，`follow` 跟 `unfollow` 也是因為我們要很快速的把 id insert 跟 erase，所以 unordered_set 是最好的選擇。

```cpp
void follow(int followerId, int followeeId) {
    following[followerId].insert(followeeId);
}

void unfollow(int followerId, int followeeId) {
    following[followerId].erase(followeeId);
}
```

當一個 user 發布 post，我們要將這個 post 加入 `posts` 中，要注意每一個 linked list 的 head 應該都要是最新的 post，所以新的 node 要 insert 到 head 而不是 tail

```cpp
void postTweet(int userId, int tweetId) {
    ListNode* node = new ListNode(tweetId, count);

    if(!posts[userId]) posts[userId] = node;
    else {
        ListNode* oldNode = posts[userId];
        node->next = oldNode;
        posts[userId] = node;
    }

    count++;
}
```

最後就是重頭戲 `getNewsFeed`，首先我們需要一個 priority queue 針對 timestamp 做排序，所以需要寫一個 compare function

```cpp
struct Compare {
    bool operator()(ListNode* a, ListNode* b){
        return a->timeStamp < b->timeStamp;
    }
};

vector<int> getNewsFeed(int userId) {
    priority_queue<ListNode*, vector<ListNode*>, Compare>pq;
}
```

首先先把自己跟所有 following 的人的最新的 post 放進去 queue 中

```cpp
struct Compare {
    bool operator()(ListNode* a, ListNode* b){
        return a->timeStamp < b->timeStamp;
    }
};

vector<int> getNewsFeed(int userId) {
    priority_queue<ListNode*, vector<ListNode*>, Compare>pq;
    for(auto follower : following[userId]){
        if(posts[follower] != nullptr) pq.push(posts[follower]);
    }
    if(posts[userId] != nullptr) pq.push(posts[userId]);
}
```

再來根據 Merge k Sorted List 的方式，每 pop 出一個，就表示這是最新的 posts，加到 result 後就把 next 也推進去 priority queue 中，找到 10 篇任務就完成了。

```cpp
struct Compare {
    bool operator()(ListNode* a, ListNode* b){
        return a->timeStamp < b->timeStamp;
    }
};

vector<int> getNewsFeed(int userId) {
    vector<int>result;
    priority_queue<ListNode*, vector<ListNode*>, Compare>pq;
    for(auto follower : following[userId]){
        if(posts[follower] != nullptr) pq.push(posts[follower]);
    }
    if(posts[userId] != nullptr) pq.push(posts[userId]);

    while(!pq.empty() && result.size() < 10){
        ListNode* node = pq.top();
        pq.pop();
        if(node->next) pq.push(node->next);

        result.push_back(node->tweetId);
    }

    return result;
}
```

**Time Complexity** - `O(mlogk)`，m 是 10，k 是該 user following 的人數<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
class Twitter {
private:
    struct ListNode {
        int tweetId;
        int timeStamp;
        ListNode* next;
        ListNode(int tweetId, int timeStamp) : tweetId(tweetId), timeStamp(timeStamp), next(nullptr) {}
    };

    unordered_map<int, ListNode*>posts;
    unordered_map<int, unordered_set<int>>following;
    int count;
public:
    Twitter() {
        count = 0;
    }
    
    void postTweet(int userId, int tweetId) {
        ListNode* node = new ListNode(tweetId, count);

        if(!posts[userId]) posts[userId] = node;
        else {
            ListNode* oldNode = posts[userId];
            node->next = oldNode;
            posts[userId] = node;
        }

        count++;
    }

    struct Compare {
        bool operator()(ListNode* a, ListNode* b){
            return a->timeStamp < b->timeStamp;
        }
    };
    
    vector<int> getNewsFeed(int userId) {
        vector<int>result;
        priority_queue<ListNode*, vector<ListNode*>, Compare>pq;
        for(auto follower : following[userId]){
            if(posts[follower] != nullptr) pq.push(posts[follower]);
        }
        if(posts[userId] != nullptr) pq.push(posts[userId]);

        while(!pq.empty() && result.size() < 10){
            ListNode* node = pq.top();
            pq.pop();
            if(node->next) pq.push(node->next);

            result.push_back(node->tweetId);
        }

        return result;
    }
    
    void follow(int followerId, int followeeId) {
        following[followerId].insert(followeeId);
    }
    
    void unfollow(int followerId, int followeeId) {
        following[followerId].erase(followeeId);
    }
};
```