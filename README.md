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
### API
Next.jsで使用している、Node.jsにAPIを追加しています<br>
下記の階層にapi用の処理を作成しています。
```
/nextjs/api
```

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
Htmlの書き出しとサーバー機能が起動されます
```
docker-compose up -d
```


#### 開発時 起動コマンド

next.jsの開発モードで起動<br>
ソースコードを変更時にHtmlのリロードなどの開発機能が実行されます
```
docker-compose up -d -f docker-compose.development
```

起動コマンドを実行後にlocalhost port:3000へブラウザで確認してください<br>
[http://localhost:3000/](http://localhost:3000/)


#### MySQL初期化
データーベースを初期化します
```
```
#### MySQL　Seed
データーベースにエクスポートしているテストデータをインポートします
```
```