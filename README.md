# sales_management_app
サークルで販売した本の売上管理のための開発中のデスクトップアプリ

## 開発動機
もともとExcelで管理していたが、Excelだと商品やマーケットの追加時にカラムを追加する必要があり、過去の売上計算に影響が出るため、専用のアプリを作ることにした。

## 技術スタック
### バックエンド
- 言語: Python
- Webフレームワーク: FastAPI
- ORM: SQLAlchemy
### フロントエンド
- 言語: TypeScript
- UIライブラリ: React
- デスクトップアプリ: Electron
- CSSフレームワーク: MUI
### データベース
- SQLite

## ER図
![](/db_design/er.png)

## 画面イメージ
![](/images/viewer_image.png)