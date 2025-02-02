import { useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Box, List, ListItem, ListItemText } from '@mui/material'
import {
    DRAWER_WIDTH,
    BASIC_INFO_PATHS,
    MEDIUM_PATH,
    MARKET_PATH,
    SELLER_PATH,
    ITEM_PATH,
    ACHIEVEMENT_INFO_PATHS,
    MONTH_SALES_QUANTITY_PATH,
    MONTH_MARKET_COMMISSION_PATH,
    SALESREWARD_INFO_PATHS,
    MONTH_SUMMARY,
    BORDER_SETTING
} from "./settings"

import { Link } from 'react-router-dom'

type HeaderItem = {
    name: string
    path: string
}

type HeaderContentProps = {
    headerContent: HeaderItem[]
}

const basicInfoHeaderContent: HeaderItem[] = [
    { name: "販売媒体", path: MEDIUM_PATH, },
    { name: "マーケット", path: MARKET_PATH },
    { name: "販売者", path: SELLER_PATH },
    { name: "商品", path: ITEM_PATH },
]

const achievementInfoHeaderContent: HeaderItem[] = [
    { name: "月次売上個数", path: MONTH_SALES_QUANTITY_PATH },
    { name: "月次マーケット手数料", path: MONTH_MARKET_COMMISSION_PATH },
]

const salesRewardInfoHeaderContent: HeaderItem[] = [
    { name: "月次売上・報酬", path: MONTH_SUMMARY },
]

const HeaderContent = ({ headerContent }: HeaderContentProps): JSX.Element => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <List sx={{ display: 'flex', gap: 2 }}>
                {headerContent.map((item, index) => (
                    <ListItem
                        button
                        key={index}
                        component={Link}
                        to={item.path}
                        sx={{
                            width: '200px',
                            fontSize: '16px',
                            textTransform: 'none',
                            borderRadius: '8px',
                            color: 'inherit',
                            padding: '8px 16px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <ListItemText
                            primary={item.name}
                            sx={{
                                textAlign: 'center',
                                width: '100%',
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

const Header = () => {
    const location = useLocation()

    const getHeaderContent = (path: string): JSX.Element => {
        if (BASIC_INFO_PATHS.includes(path)) {
            return <HeaderContent headerContent={basicInfoHeaderContent} />
        }
        if (ACHIEVEMENT_INFO_PATHS.includes(path)) {
            return <HeaderContent headerContent={achievementInfoHeaderContent} />
        }
        if (SALESREWARD_INFO_PATHS.includes(path)) {
            return <HeaderContent headerContent={salesRewardInfoHeaderContent} />
        }
        return <></>
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                width: `calc(100% - ${DRAWER_WIDTH}px)`,
                ml: `${DRAWER_WIDTH}px`,
                bgcolor: `white`,
                color: `black`,
                boxShadow: 'none', // 影をなくす
                borderBottom: BORDER_SETTING,
            }}>
            <Toolbar>
                {getHeaderContent(location.pathname)}
            </Toolbar>
        </AppBar>
    )
}

export default Header