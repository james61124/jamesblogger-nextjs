---
title: Amazon Summer Intern 心得
date: "2026-07-20"
author: James
tags: Life,Amazon,SWE,Intern
image: /images/life/amazon/co-worker.JPG
description: "首先很幸運可以在找 summer intern 的幾乎最後關頭收到 Amazon offer，前前後後改了不知道幾版履歷，找了多少內推，還去行天宮拜拜，把去日本買的御守拿出來供俸，我是一個不太相信玄學的人，可見我是真的已經沒招了，所以是真的滿感謝的。"
readTime: 3
id: 0726deac-3f9c-4b9c-966d-540707e234eb
---

首先很幸運可以在找 summer intern 的幾乎最後關頭收到 Amazon offer，前前後後改了不知道幾版履歷，找了多少內推，還去行天宮拜拜，把去日本買的御守拿出來供俸，我是一個不太相信玄學的人，可見我是真的已經沒招了，所以是真的滿感謝的。

## 實習開始前

分享一下收到 offer 前大概經歷過哪些，首先 OA 是兩題 coding 題，這應該大部分人都解得出來我記得沒有很難，真正麻煩的是後面的 Behavior Question。他們的 OA 是真的會用 BQ 刷人的，首先 Amazon 有 16 個 leadership principles，基本上就是給一個標準說你招進來的人要符合這些特質才可以，或是你在這邊工作就是要符合這些精神。BQ 總共有三個部分，我是強烈建議在寫之前先看過他們的 16 個 leadership principles，然後選項盡量不要選那種模稜兩可的答案，例如說 SWE 的 position，他就是要測試你的 personality 有沒有適合當一個工程師，如果都給那種很中性的答案他沒辦法分辨你是哪種人就比較不會過。

如果有過 OA 就會拿 interview，一共兩輪，每一輪都有 coding + BQ，為了他們的 BQ 我把我所有故事全都用那 16 個 leadership principles 重新寫了一次，確保我的故事有符合 STAR 框架之外還有符合他們的 leadership principles，而這些潤飾出來的故事其實也可以用在其他公司，我覺得算是 cp 值挺高的一件事。

Amazon Leadership Principles: [https://www.amazon.jobs/content/en/our-workplace/leadership-principles](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)

## 實習開始

我到現在還是不太曉得為什麼我被分配到 Arlington, VA，這真的很酷，當你看到你申請幾乎所有朋友都跑到加州去，就我一個人跑到東岸的一個我也沒聽過的地方，我還是覺得很神奇。但生活就是這樣，每到一個新地方，就會有新發現，也會遇到新的人發展出新的故事。

Amazon Arlington 辦公室就在五角大廈附近，真的是附近，大概一站地鐵站，所以治安好的不得了，我半夜在路上走也不太會覺得危險。然後過個河就是 DC，再往前一點就到 Maryland，所以我常常看到有人說 DMV 地區，就是指 DC/Maryland/Virginia 這塊交界處，在這邊生活基本上一次就解鎖三個州了。因為只有三個月，我就沒有去租房網站找新房子了，我直接發 thread 看看有沒有 sub-lease 可以租我人就直接過來了。

我從來沒有來過東岸，但是跟其他地方的感覺截然不同。這邊沒有車其實也能活下來，地鐵雖然不能到所有地方，但基本上大部分常去的地方都還是有 cover 到，商店也算滿密集的，有點像生活在 downtown 的感覺，自己住的話我覺得是挺方便，不過就是台灣人偏少，所以比較沒有像在其他地方一樣有很大的台灣人 community。

![](/images/life/amazon/building.JPG)

Amazon 辦公室是滿舒服的，但福利就是沒有很好，每天只有一杯免費咖啡跟免費香蕉，其他東西都要錢，零食要付錢，水果要付錢，早餐午餐也要付錢。然後 policy 是說不能 remote，所以我們 team 有一個固定的區域可以辦公，而我基本上都坐在同一個位子工作。

![Amazon 香蕉車，我每天都會拿三條，剛好早餐午餐晚餐](/images/life/amazon/banana.JPG)

## Code Contribution

我其實很猶豫要不要寫這些東西，寫程式不知道幾年了還覺得這些事情很新鮮就很像是什麼鄉下人進城的感覺。

在大公司裡面寫 code 跟平常在寫 code 真的不太一樣，首先我覺得整個開發流程很嚴謹，雖然會有點麻煩但是 contribute 起來會讓人很放心。每一個 repo 都有很完整的 pipeline，所以每個 pr merge 進去之後會經過 beta / gamma 最後沒問題才會走到 prod，每個 pr 都需要經過一兩個人 review 才能 merge 進去，所以基本上不太會有把 prod 搞砸的機會。但這其實有點麻煩的地方，因為你的進度就是會被 review 的速度擋住。所以 pr 的管理也是門學問，我是盡可能把我的 project 扁平化，確保 pr 待審的時候我還有事情做，因為如果同時送兩三個有 dependency 的 pr，前面的 pr 改了後面可能就需要重改，我覺得這樣反而沒有比較快。

![](/images/life/amazon/ai.png)

再來也是我覺得很不可思議的部分，Amazon 的 AI 化程度比我想像中高，我不曉得是不是所有公司都變成這樣，撇除掉 SWE 會不會因此 position 變少的問題，現在開發起來是真的挺方便的。他們用的 AI Agent - Kiro 我後來查好像不是 internal 的，我之前是沒聽過，但他接了很多內部工具，簡單來說我今天要從頭理解我們 team 的整個系統在幹嘛，他有海量的 microservices 海量的 APIs，在研究 project 要怎麼做的時候沒有人跟我說有哪些工具可以用，在沒有 AI 的情況我可能得想辦法從一大堆 repo 裡面翻有沒有能用的東西，然後一直來回問同事，但是有 AI Agent 基本上他能查 internal website 能查所有 repo 還能快速讀 code，做這種事情真的超級快。

然後可能是因為無限 tokens 所以很好用，他其實是一套完整的 workflow，他有一個 main agent 負責接收 prompt 然後理解，再來會整理一個 workflow 來決定要 call 什麼不同的 agent，每一個 agent 都有自己擅長的事情像是寫 code、查網站、或是一些 internal MCP server，所以體感上每個步驟都做得很好。

---

再來也是我覺得很酷但也很麻煩的地方，pr 送出去之後會經過一系列檢查，其中有個小工具是 AutoSDE，簡單講就是 AI Agent 來幫忙做 code review，其實他給的建議都挺不錯的，有些地方有問題真的都找得出來，但他的問題就是因為他是 generative AI，這次改完他的所有 comments 下次又會出現新的，但每次推上去等檢查又要等 10 幾分鐘，來來回回就要很久，所以有時候還得判斷到底他給的 comment 是不是真的需要解決，

所以我覺得現在的 SWE 我覺得最麻煩的地方已經不是寫 code 了，好吧可能還是看寫什麼，但至少我在這邊做的東西 coding 部分其實是很快的，麻煩的地方在一些設計、權限跟溝通問題。前面寫 design doc 花了不少時間，因為要先從了解整個 services，了解我們要做什麼，然後東西放哪比較合理，怎麼優化等等先處理好，因為牽涉到很多組所以要跟他們溝通到底會不會影響到他們，或是有沒有解決到他們的痛點，真正確定每個細節寫成 spec 之後，後面 implementation 就比較 strightforward。

然後像是 service 跟 service 之間的溝通很麻煩，如果不是有 public API 可以直接用，有些要用 STS Assume Role，或是有一些其他組的 API 我們想用，得先開 tickets 請他們幫我們開權限，然後這個 tickets 轉來轉去可能就又過一兩個禮拜了。我還有遇過有個 service 因為設定 private only，所以只有通過 corp network 才能戳到他，但問題是 service 跟 service 間走的不是 corp network，然後研究了一兩個禮拜都繞不過去，處理這些東西比起寫 code 本身要麻煩多了。

## 組內氣氛

![小組的人，裡面有我的舊 mentor 跟新 mentor](/images/life/amazon/co-worker.JPG)

這個組氣氛我覺得很不錯，我滿喜歡組內的人的，但我剛好在這個組正在 migrate 的時候出現。

事情是這樣，原本我這個組有 10 來個人，去年 10 月有一波大 lay off，組內很多人被轉到其他組去我們瞬間就剩下 3 個人，然後因為人不夠，在我出現的前一兩個月他們在印度招了一批人，要把我們這邊的業務轉過去，然後組內剩下的人會慢慢被挪到 manager 底下的另一個組，而我就是在這個過程中出現的。

其實做做 intern project 倒不太會被影響，因為跟 full-time 的工作算是比較獨立的區塊，但就是因為處在這個非常時期所以我的 team member 都非常非常忙，我其實都不太敢打擾他們，然後中間我原本的 mentor 還離職了所以我還換了一個 mentor，可以說雖然大家人都很好但我好像剛好在一個非常時期出現這個組裡，也算是滿酷的。

## 平常生活

除了上班，也算是在這裡交了不少朋友，三個月的時間我感覺我做了不少事情，平常沒事打打球打打牌打打桌遊，偶爾跟朋友出去晃晃，其實也算是過得挺滋潤。我本來以為來到了一個相對沒有認識的人的地方會比較無聊，但後來發現來了之後總會遇到一些新的人，做一些酷酷的事。

![仙境幽谷，來這邊玩了好多次](/images/life/amazon/board-game.png)

![一個 pool bar，如果不是朋友約自己是沒什麼機會來這種地方玩的](/images/life/amazon/bar.JPG)

![Guunston Community Center，在這邊也認識很多新朋友](/images/life/amazon/badminton.JPG)

這中間 Baltimore 去了兩次，全世界數一數二危險的地方，一次就是單純去晃晃，一次是去看 airshow。看 airshow 的時候很荒謬啊很好笑，我們一群人開了大老遠的車跑到 Baltimore，然後以為飛機秀還沒開始，就先悠閒的跑去吃飯，然後出來之後跑到一個小山坡上想說等等看看什麼時候開始，結果發現他早就開始了，但是不知道為什麼只能看到遠遠的小小的飛機，都沒有從頭頂飛過去的，所以我們還是決定跑到小紅書上說的比較好看的地方，結果搭了計程車又走過去好不容易到了結果他就結束了，真的有夠荒謬。

![大概就看到這麼大的飛機而已，但還是滿酷的](/images/life/amazon/air-show.JPG)

有一次 Peggy 來也去 DC 晃了一圈，這個就寫在另一篇文好了，不然這篇文會變太長。

至於 return offer 那就是另一個問題了，首先組內我體感是沒有 Head Count 所以就算有過 return 的 bar 應該也會被丟回 pool 裡面等其他組來撈，那 Amazon 這幾年因為一直裁員，綠卡申請其實相對不友善，再來就是不知道什麼時候會被 lay off 的問題，所以如果有選擇的情況下是可以考慮一下要不要留 Amazon，但還是可以觀察一下未來會怎麼發展再來看怎麼操作。

但不管怎麼說，這三個月算是第一次自己住，第一次到一個真的沒什麼認識的人的地方，很多人很多事情需要重新適應，算是一個全新的體驗。有時候都會思考，人生每個階段變來變去，很多認識的人最後都會覺得好像白認識了，但要不是這樣變來變去也不會遇到這些新的人，算是一個新的體悟吧。而實習結束就要回去把僅剩不多的 master 唸完，希望這邊的朋友以後都還會記得我是誰。