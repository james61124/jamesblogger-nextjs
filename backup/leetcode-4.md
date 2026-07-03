



nums1 是短的
nums2 是長的

控制 mid_1 就好，mid_2 可以直接用算的，至於 mid_1, mid_2 的位置都會是 right part 的第一個 element

利用 Binary Search template 可以定位出 left_1, right_1, left_2, right_2 分別是 left / right part 的邊界

再來把中位數算出來就好

```cpp
double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if(nums1.size() > nums2.size()) swap(nums1, nums2);
    int m = nums1.size(), n = nums2.size();
    int t = m + n;

    int left_1 = 0, right_1 = m - 1;

    while(right_1 >= left_1) {
        int mid_1 = left_1 + (right_1 - left_1) / 2; // 2
        int mid_2 = t / 2 - mid_1;

        if(nums1[mid_1] >= nums2[mid_2 - 1]) right_1 = mid_1 - 1;
        else left_1 = mid_1 + 1;
    }

    int left_2 = t / 2 - left_1;
    int right_2 = left_2 - 1;
    int left_1_val = (left_1 < m) ? nums1[left_1] : INT_MAX; // right part
    int right_1_val = (right_1 >= 0) ? nums1[right_1] : INT_MIN;
    int left_2_val = (left_2 < n) ? nums2[left_2] : INT_MAX; // right part
    int right_2_val = (right_2 >= 0) ? nums2[right_2] : INT_MIN;

    if(left_1_val > left_2_val) swap(left_1_val, left_2_val);
    if(right_1_val < right_2_val) swap(right_1_val, right_2_val);

    return (t % 2 == 0) ? ((double)left_1_val + (double)right_1_val) / 2 
                        : (double)left_1_val;

}
```