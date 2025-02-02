// API関連
export const API_BASE_URL = 'http://127.0.0.1:8000'
// レイアウト関連
export const DRAWER_WIDTH = 240;
export const HEADER_HEIGHT = '64px';
export const BORDER_SETTING = `1px solid rgb(226, 226, 226)`
// 日付フォーマット
export const DATE_FORMAT = 'YYYY-MM-DD'
// パス(基本情報関連)
export const BASIC_INFO_PATH = '/basicInfo';
export const MEDIUM_PATH = BASIC_INFO_PATH + '/medium'
export const MARKET_PATH = BASIC_INFO_PATH + '/market'
export const SELLER_PATH = BASIC_INFO_PATH + '/seller'
export const ITEM_PATH = BASIC_INFO_PATH + '/item'
export const BASIC_INFO_PATHS = [
    BASIC_INFO_PATH,
    MEDIUM_PATH,
    MARKET_PATH,
    SELLER_PATH,
    ITEM_PATH,
]
// パス(実績情報関連)
export const ACHIEVEMENT_INFO_PATH = '/achievementInfo'
export const MONTH_SALES_QUANTITY_PATH = ACHIEVEMENT_INFO_PATH + '/monthSalesQuantity'
export const MONTH_MARKET_COMMISSION_PATH = ACHIEVEMENT_INFO_PATH + '/monthMarketCommission'
export const ACHIEVEMENT_INFO_PATHS = [
    ACHIEVEMENT_INFO_PATH,
    MONTH_SALES_QUANTITY_PATH,
    MONTH_MARKET_COMMISSION_PATH,
]
// パス(売上・報酬関連)
export const SALESREWARD_INFO_PATH = '/salesRewardInfo'
export const MONTH_SUMMARY = SALESREWARD_INFO_PATH + '/monthSummary'
export const SALESREWARD_INFO_PATHS = [
    SALESREWARD_INFO_PATH,
    MONTH_SUMMARY
]
