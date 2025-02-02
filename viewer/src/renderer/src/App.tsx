import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import BasicInfo from './BasicInfo/BasicInfo';
import Medium from './BasicInfo/Medium';
import Market from './BasicInfo/Market';
import Seller from './BasicInfo/Seller';
import Item from './BasicInfo/Item';
import AchievementInfo from './AchievementInfo/AchievementInfo';
import MonthSalesQuantity from './AchievementInfo/MonthSalesQuantity';
import MonthMarketCommission from './AchievementInfo/MonthMarketCommission'
import SalesRewardInfo from './SalesRewardInfo/SalesRewardInfo';
import MonthSummary from './SalesRewardInfo/MonthSummary';
import StoreIcon from '@mui/icons-material/Store';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import {
  DRAWER_WIDTH,
  BASIC_INFO_PATH,
  MEDIUM_PATH,
  MARKET_PATH,
  SELLER_PATH,
  ITEM_PATH,
  ACHIEVEMENT_INFO_PATH,
  MONTH_SALES_QUANTITY_PATH,
  MONTH_MARKET_COMMISSION_PATH,
  SALESREWARD_INFO_PATH,
  MONTH_SUMMARY,
  HEADER_HEIGHT,
  BORDER_SETTING,
} from "./settings";
import Header from './Header';

// サイドメニューの項目
const sideMenuItems = [
  { text: '基本情報関連', icon: <StoreIcon />, path: BASIC_INFO_PATH, element: <BasicInfo /> },
  { text: '実績情報関連', icon: <EmojiEventsIcon />, path: ACHIEVEMENT_INFO_PATH, element: <AchievementInfo /> },
  { text: '売上・報酬関連', icon: <CurrencyYenIcon />, path: SALESREWARD_INFO_PATH, element: <SalesRewardInfo /> },
];

const routeItems = [
  { path: BASIC_INFO_PATH, element: <BasicInfo /> },
  { path: MEDIUM_PATH, element: <Medium /> },
  { path: MARKET_PATH, element: <Market /> },
  { path: SELLER_PATH, element: <Seller /> },
  { path: ITEM_PATH, element: <Item /> },
  { path: ACHIEVEMENT_INFO_PATH, element: <AchievementInfo /> },
  { path: MONTH_SALES_QUANTITY_PATH, element: <MonthSalesQuantity /> },
  { path: MONTH_MARKET_COMMISSION_PATH, element: <MonthMarketCommission /> },
  { path: SALESREWARD_INFO_PATH, element: <SalesRewardInfo /> },
  { path: MONTH_SUMMARY, element: <MonthSummary /> },
]

const App = () => {

  return (
    <Router>
      <Box sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw'
      }}>
        <CssBaseline />

        {/* ヘッダー */}
        <Header />

        {/* サイドメニュー */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: BORDER_SETTING,
            },
          }}
        >
          <Box sx={{ overflow: 'auto' }}>
            <Typography variant="h6" sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  同人売上管理アプリ
                </Link>
              </Box>
            </Typography>
            <List>
              {sideMenuItems.map((item, index) => (
                <ListItem button key={index} component={Link} to={item.path} sx={{ textDecoration: 'none' }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* メインコンテンツ */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: HEADER_HEIGHT, // ヘッダーの高さ分をずらす
          }}
        >
          <Routes>
            {routeItems.map((item, index) => (
              <>
                <Route path={item.path} element={item.element} key={index} />
              </>
            ))}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
