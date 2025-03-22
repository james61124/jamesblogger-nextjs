

int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size()-1;
    while(left <= right) {
        int mid = left + (right - left)/2;
        if( target < arr[mid] ) right = mid -1;
        else if( target > arr[mid] ) left = mid + 1;
        else return mid;
    }
    return left;
}