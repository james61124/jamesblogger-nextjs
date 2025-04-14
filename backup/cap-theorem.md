

當我們在使用資料庫時，會發現單一機器是有極限的，當應用變多，使用者變多時，可能會遇到以下四種限制

1. 效能限制 ( Performance Bottleneck ) - 一台 server 的 CPU、記憶體、IO 都是有限的，單台機器可能會無法承受大量的資料
2. 容量限制 ( Storage Limit ) - 單台機器硬碟再大，一定會有上限，像是我們不可能把整個 Meta 的資料都存到「單台機器」裡
3. 可用性低 ( Single Point Failure ) - 假設這台機器出問題，那整個服務就都沒有辦法用了
4. 擴展性差 ( Scaling Limits ) - 如果要做垂直擴展，就是加大單台機器的容量，成本高而且也不彈性，所以最好的辦法就是要做水平擴展

這也是為什麼我們需要分散式系統 - Distributed System，而 CAP Theorem 就是用在這裡，用一句話概括 CAP Theorem:

> 設計 Distributed System 時不可能同時滿足 Consistency ( 一致性 ), Availability ( 可用性 ), Partition Tolerance ( 分區容錯性 ) 三角，我們一次只能保證 Consistency 或是 Availability 兩件事的其中一件，也就是我們需要 trade-off

### **CAP 三個核心概念定義**

首先先介紹一下 CAP 中三個最重要的名詞解釋：Consistency, Availability 以及 Partition Tolerance

#### **Consistency 一致性**

如果一個 Distributed System 符合 Consistency，表示

> 每一次讀取資料的時候都會讀到最新的資料

聽起來很像廢話，但其實沒有這麼簡單，想像一下我們在 node A 寫入一筆資料，他要更新到其他 node 一定要一段時間，這時候如果我在 node B 馬上讀取，那我有可能會讀不到這筆最新的資料，而所有符合 Consistency 的 system 都要避免這種事情發生，所以如果有其中一台機器還來不及同步，那系統就會拒絕回應來維持 Consistency。

不過需要注意的是 Consistency 不一定代表「資料正確」，只是代表所有機器上的資料版本都一樣而已。

#### **Availability 可用性**

如果一個 Distributed System 符合 Availability，表示

> 每個 requests 都會獲得 response，不會 timeout 或是掛掉

對 Availability 來說，「有回應」比「回應正確」還要來得重要，所以即使這個 node 的資料還沒有完全同步，只要收到 request 他還是會給 response，即使給的是舊資料，也就是說他的讀寫操作都會盡量不失敗或是等太久。

#### **Partition Tolerance**

如果一個 Distributed System 符合 Partition Tolerance，表示

> 系統中如果有某些 node 網路斷了無法彼此通訊，系統還是要能正常運作處理 requests

所以其實 Partition Tolerance 不是一個「選項」，而是一個 Distributed System 設計的前提，因為某些 node 通訊斷掉是所有 Distributed System 一定會遇到的情況，所以所有的 Distributed System