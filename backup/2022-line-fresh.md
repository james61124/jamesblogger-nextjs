---
title: "2022 LINE FRESH 參賽過程與參賽心得"
date: 2024-02-20
draft: false
author: "James"
tags:
  - LINE FRESH
image: /images/LINE-FRESH.jpg
description: ""
toc: 
categories:
  - 生活
---

LINE FRESH 是一個結合

## **作品介紹**

我們設計了一個 Dida Dream - 及時予系統，期望透過即期品整合平台搭配線上剩食捐贈管道來達成剩食再分配的目標。我們主要功能有四個，即期品資料蒐集、客製化推播、捐贈計畫以及會員制度。

### **專案介紹**

#### **即期品資料蒐集**

![image](/images/posts/2022-line-fresh/data-collection-1.png)

![image](/images/posts/2022-line-fresh/data-collection-2.png)


我們引入連鎖商家及在地商家，搭配後端資料庫整合並蒐集所有即期品資訊，利用連鎖商家作為初期的資料來源，結合商家本身的 API 來及時更新即期品資訊，在地小商家會由專人進行建檔服務，並透過網站更新即期品資訊。

#### **客製化推播**

![image](/images/posts/2022-line-fresh/customized-push-message-1.png)

![image](/images/posts/2022-line-fresh/customized-push-message-2.png)

![image](/images/posts/2022-line-fresh/customized-push-message-3.png)

我們利用 LINE Bot 定期推播優惠資訊，並利用使用者註冊時填的資料來客製化優惠內容，同時推出 You Are What You Eat 的心理小測驗來客製化預覽訊息的樣式，增加使用者黏著度。

#### **捐贈計畫**

![image](/images/posts/2022-line-fresh/donate.png)

為了達到剩食再分配的目的，我們利用 LINE 禮物跟即時卷，搭建 Giver 跟 Requester 的橋樑，想辦法將剩食送到需要的人手中，Giver 可以透過系統發送即時卷，Request 在發送請求後，經過我們的即時配對系統，就可以收到 Giver 發送的即時卷，可以去特定商店兌換即期品。而 Requester 的名單則是選擇跟政府合作，發送邀請碼，這樣可以保障低收入戶的個資，也可以快速推廣我們的計畫。而 Giver 在發送即時卷後可以利用 Dida Collection 集點卡集點，增加 Giver 的捐贈動機。

#### **商家會員制度**

根據不同商家贊助金額商家會拿到 Bronze, Silver, Gold 等不同級別徽章，同時帶有不同程度的福利例如搜尋引擎推播、特別企劃等等。

### **行銷管道**

#### **數位媒體推廣**

Dida Collection 集點卡以及 You Are What You Eat 心理測驗都設有一鍵分享功能，增加我們在社群軟體的曝光度，同時跟公益團體、KOL 等重要人物合作，擴大影響範圍

#### **LINE Beacon**

利用 LINE Beacon 推播我們的官方帳號，讓使用者在合作商家、連鎖商店等區域可以接收到附近的即期品資訊

### **商業模式**

支出方面主要是前後端的資料維護費用以及 LINE Bot 大量推播費用，而收入方面則是透過商家會費、大額捐贈抽成、Beacon 加購方案、政府津貼以及使用者支持等方法來達成金流循環。

## **技術架構**

![image](/images/posts/2022-line-fresh/techniques.jpg)

我們利用 Django 來實作官方帳號，並串接各種 LINE API，利用 LINE LIFF 連接至我們的官方網站，並將整個前後端利用 Apache Server 部屬在 VPS 上，至於前期資料的部分則是利用全家 API 來獲得當前資料

## **參賽心得**

這是一次長期的比賽，因為從開始發想到產出專案大約有 3 個月的時間。個人是認為 LINE 滿認真在籌備這次的校園競賽的，中間舉辦了很多次的工作坊，讓參賽者可以學習到一些商業模式跟專案發想的一些思路，配有導師可以跟他們討論專案的可行性跟完整性，更重要的是讓我們更清楚 LINE 在這個比賽比較重視哪一塊。

LINE 舉辦這次的比賽主旨應該是跨界合作，希望可以結合技術人才跟商業人才來發想專案，進而產生新的火花，自己覺得滿幸運的因為組員剛好各司其職，大家都有自己擅長的地方，而且同為資工系時間分配跟合作模式大家也都很熟悉了。

而這次比賽算是自己第一次協作大型專案，以前都是完成課堂作業而已，滿高興大家可以花時間去認真籌備一場比賽，拿不拿獎自己反而覺得其次，重要的是這次比賽在技術進步上有很大的突破，而且讓自己更不會害怕大型專案，雖然現在回頭看運用到的技術都很簡單，不過這些都是進步的過程，讓我們技能樹又多點了一塊。