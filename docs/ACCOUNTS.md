# 帳號整合

首版 `site/assets/js/account-config.js` 使用空設定，停用雲端帳號功能；閱讀與本機進度不依賴原作者的帳號服務。帳號服務本身不在此倉庫，沒有宣稱只填三個值就能完成跨站 SSO。

若自行提供相容服務，再設定自己的 Supabase URL、publishable/anon key 與 hubUrl，並完成資料表、RLS、redirect allowlist 及服務部署。publishable/anon key 是前端公開設定，不能以它代替權限控制；絕對不要填 service_role、資料庫密碼或私人 access token。

原開發目錄的正式站設定沒有被修改。不要把本版直接覆蓋既有正式部署，否則帳號功能與部分素材範圍會不同。

Supabase 瀏覽器 SDK 也不隨停用帳號的首版散布；若要啟用，須自行加入相容版本與完整相依授權，再完成整合測試。
