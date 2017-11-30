# nextjs-todo

## 使用した技術要素
### 仮想環境
+ docker-composer
  + docker
    + MySQL
    + Node.js

dockerでWebとデータベースのサーバー環境構築を行なっています

### Webフレームワーク
+ Next.js
  + React.js
  + Material UI Next
  + Node.js

Next.jsにより、React.jsのサーバーサイドレンダリングを実現しています。

## 全体の設計・構成についての説明
### API
Next.jsで使用している、Node.jsにAPIを追加しています<br>
下記の階層にapi用の処理を作成しています。
```
/nextjs/api
```

### MySQL
#### データベース
+ todo_database
#### テーブル
+ todo_lists : ToDoリスト用
+ todo_data : ToDo情報用
#### SQLダンプデータ
+ mysql/init/
  + create.sql : データベース/テーブル作成
  + seed.sql   : テーブルインポート

### Next.js
#### 主要ファイル構成
+ nextjs/pages/     :各ページの構成
  + _document.js      :共通レイアウト
  + index.js          :トップページ
  + detail.js         :ToDoリスト詳細ページ
  + search.js         :検索ページ
+ nextjs/components/ :uiコンポーネント
+ nextjs/utils/      :ユティリティー
  + todoApi.js        :APIユティリティー

## 開発環境のセットアップ手順
### 動作環境
docker-compose がインストール済みの環境が必要になります<br>
確認済み環境
```
macOS High Sierra
バージョン 10.13.1
```

#### リリース 起動コマンド

next.jsのリリースモードで起動<br>
+ Htmlの書き出しとサーバー機能が起動されます
```
docker-compose up -d
```


#### (開発時 起動コマンド)

next.jsの開発モードで起動<br>
+ ソースコードを変更時にHtmlのリロードなどの開発機能が実行<br>
+ MySQLへのポートを解放
```
docker-compose up -d -f docker-compose.development
```

#### MySQL初期化
初回起動時やリセットしたい時にデーターベースを初期化します
```
docker-compose exec mysql bash -c "mysql -u root -ppassword --default-character-set=binary tmp_todo < /etc/initMysql/create.sql"
```

#### MySQL　Seed
データーベースにテストデータをインポートします
```
docker-compose exec mysql bash -c "mysql -u root -ppassword --default-character-set=binary todo_database < /etc/initMysql/seed.sql"
```

起動コマンドを実行(初回はMySQL初期化も実行)後にブラウザで、localhost:3000へ接続して確認してください<br>
[http://localhost:3000/](http://localhost:3000/)
