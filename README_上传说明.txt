TravelerOS22｜继续开发版

这版基于 TravelerOS22_完整资源文件夹版继续开发。
保持完整 PNG 资源，不压缩图片，不改成 base64 单文件。

结构：
- index.html
- css/style.css
- js/data.js
- js/storage.js
- js/state.js
- js/render.js
- js/actions.js
- js/app.js
- hero.png
- hero_starter.png
- layer_research.png
- layer_night.png
- layer_discipline.png
- layer_abyss.png
- boss_desire.png
- boss_market.png
- boss_phantom.png
- npc_scholar.png
- npc_forge.png

新增重点：
1. 主城现实线 / 坠落线
2. 懒惰急救按钮
3. 角色页完整立绘 + 装备槽 + 套装效果
4. 装备仓库与换装
5. 日报结算
6. Boss 血量联动
7. 地图推进
8. NPC 与神秘商人
9. 档案馆
10. 本地存档导入导出
11. 装备成长制：开局只有旅者基础套，高级装备通过日报、Boss和地图推进解锁
12. 角色页装扮同步：当前武器、胸甲、饰品、主套装会叠加显示在主角立绘上
13. 开局透明立绘：默认使用 hero_starter.png，深渊/高阶装束再切回 hero.png
14. 透明装备图层：研究院、夜潮、纪律、深渊套装会叠加不同 PNG 视觉层
15. Boss / NPC 交流：点击 Boss 或 NPC 卡片可进入对话，记录建议到系统日志

GitHub Pages 上传方式：
1. 进入本文件所在的 TravelerOS22_继续开发版 文件夹。
2. 在 GitHub 仓库根目录删除旧的 index.html、assets、css、js。
3. 把 index.html、assets、css、js、README_上传说明.txt 一起上传到仓库根目录。
4. Commit changes。
5. 等 Actions/Pages 变绿后打开 Pages 地址。

注意：
- 不要只上传 zip，GitHub Pages 不会自动解压 zip。
- 根目录必须直接有 index.html。
- assets、css、js 必须和 index.html 同级。

