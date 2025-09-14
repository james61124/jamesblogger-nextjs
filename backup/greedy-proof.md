

你有台電腦每次只能處理一件事情，兩個 requests {si, fi} 如果是 compatible 表示他們沒有 overlap，題目說要找到 largest subset of mutually requests，也就是說

我們先找 counterexamples，再來再去 prove correctness

我們有四個可能的解法
1. sort by start time
2. sort by finish time
3. sort by shortest interval
4. sort by fewest conflicts

我們先來找 counterexamples
sort by start time
可能會有 start time 很早開始，但是非常晚才結束


假設房子是 1D array，array 紀錄跟原點的距離
第一個 generator 要設在第一間房子的右手邊 3 miles 處
再來檢查超過這個 generator 的 3 miles 外的第一間房，一樣在他的右手邊 3 miles 再建一個 generator 重複這個過程



