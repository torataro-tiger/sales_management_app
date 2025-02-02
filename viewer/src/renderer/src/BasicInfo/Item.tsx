import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
} from '@mui/material';
import { Dayjs } from 'dayjs';
import dayTz from '@renderer/Common/DayjsWithTimezone';
import axios from "axios";
import { API_BASE_URL } from '../settings';
import YearMonthPicker from '../Common/YearMonthPicker'
import { DATE_FORMAT } from '../settings'


type ResponseData = {
  id: string;
  item_name: string;
  price: number;
  medium_name: string;
  market_name: string;
  seller_name: string;
  sales_start_month: Dayjs;
};

type UpdateData = {
  id: string;
  item_name: string;
  price: number;
  medium_id: string;
  market_id: string;
  seller_id: string;
  sales_start_month: Dayjs;
}

type ResponseDataProps = {
  responseData: ResponseData[];
};

type RegisterDialogProps = {
  registerDialogOpen: boolean;
  handleRegisterDialogClose: () => void;
};

type ResponseSearchMediumData = {
  medium_name: string;
  id: string;
}

type ResponseSearchMarketData = {
  market_name: string;
  id: string;
}

type ResponseSearchSellerData = {
  seller_name: string;
  id: string;
}

type RequestCreateSeller = {
  registerItemNameTerm: string;
  registerMediumIdTerm: string;
  registerMarketIdTerm: string;
  registerSellerIdTerm: string;
  registerPriceTerm: number;
  registerSalesStartMonthTerm: Dayjs;
}

const searchMarket = (setMarketList: (responseData: ResponseSearchMarketData[]) => void) => {
  axios.get<ResponseSearchMarketData[]>(API_BASE_URL + '/market_search')
    .then(response => {
      console.log(response.data);
      setMarketList(response.data)
    })
    .catch(error => {
      console.error(error);
    });
};

const searchSeller = (setSellerList: (responseData: ResponseSearchSellerData[]) => void) => {
  axios.get<ResponseSearchSellerData[]>(API_BASE_URL + '/seller_search')
    .then(response => {
      console.log(response.data);
      setSellerList(response.data)
    })
    .catch(error => {
      console.error(error);
    });
};

const searchMedium = (setMediumList: (responseData: ResponseSearchMediumData[]) => void) => {
  axios.get<ResponseSearchMediumData[]>(API_BASE_URL + '/medium_search')
    .then(response => {
      console.log(response.data);
      setMediumList(response.data)
    })
    .catch(error => {
      console.error(error);
    });
};

const RegisterDialog: React.FC<RegisterDialogProps> = ({
  registerDialogOpen,
  handleRegisterDialogClose
}) => {
  const [registerItemNameTerm, setRegisterItemNameTerm] = useState<string>('');
  const [registerPriceTerm, setRegisterPriceTerm] = useState<number>(0);
  const [registerSalesStartMonthTerm, setSalesStartMonthTerm] = useState<Dayjs>(dayTz());
  const [registerMediumIdTerm, setRegisterMediumIdTerm] = useState<string>('');
  const [registerMarketIdTerm, setRegisterMarketIdTerm] = useState<string>('');
  const [registerSellerIdTerm, setRegisterSellerIdTerm] = useState<string>('');
  const [mediumList, setMediumList] = useState<ResponseSearchMediumData[]>([])
  const [marketList, setMarketList] = useState<ResponseSearchMarketData[]>([])
  const [sellerList, setSellerList] = useState<ResponseSearchSellerData[]>([])

  const registerItem = (
    {
      registerItemNameTerm,
      registerMediumIdTerm,
      registerMarketIdTerm,
      registerSellerIdTerm,
      registerPriceTerm,
      registerSalesStartMonthTerm,
    }: RequestCreateSeller
  ) => {

    axios.post(API_BASE_URL + '/item_registration', {
      item_name: registerItemNameTerm,
      medium_id: registerMediumIdTerm,
      market_id: registerMarketIdTerm,
      seller_id: registerSellerIdTerm,
      price: registerPriceTerm,
      sales_start_month: registerSalesStartMonthTerm.format(DATE_FORMAT),
    })
      .then(response => {
        console.log(response.data);
        handleRegisterDialogCloseAndClearTerm();
      })
      .catch(error => {
        console.error(error);
        handleRegisterDialogCloseAndClearTerm();
      });
  };

  const handleRegisterDialogCloseAndClearTerm = () => {
    handleRegisterDialogClose();
    setRegisterPriceTerm(0);
    setSalesStartMonthTerm(dayTz());
    setRegisterItemNameTerm('');
    setRegisterMediumIdTerm('');
    setRegisterMarketIdTerm('');
    setRegisterSellerIdTerm('');
  }

  useEffect(() => {
    if (registerDialogOpen) {
      searchSeller(setSellerList);
      searchMarket(setMarketList);
      searchMedium(setMediumList);
    }
  }, [registerDialogOpen]);

  return (
    <Dialog
      open={registerDialogOpen}
      onClose={handleRegisterDialogCloseAndClearTerm}
      sx={{
        '& .MuiDialog-paper': {
          width: '80%',
          maxWidth: '600px',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ paddingBottom: 1 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={10}>
            商品登録
          </Grid>
          <Grid size={1}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleRegisterDialogCloseAndClearTerm}
              aria-label="close"
              sx={{
                position: 'absolute',
                right: 24,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ paddingTop: 2 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              select
              label="販売媒体"
              fullWidth
              defaultValue=""
              onChange={(e) => setRegisterMediumIdTerm(e.target.value)}
            >
              {mediumList.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.medium_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField
              select
              label="マーケット"
              fullWidth
              defaultValue=""
              onChange={(e) => setRegisterMarketIdTerm(e.target.value)}
            >
              {marketList.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.market_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField
              select
              label="販売者"
              fullWidth
              defaultValue=""
              onChange={(e) => setRegisterSellerIdTerm(e.target.value)}
            >
              {sellerList.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.seller_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField
              label="商品名"
              variant="outlined"
              fullWidth
              value={registerItemNameTerm}
              onChange={(e) => setRegisterItemNameTerm(e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="価格"
              type="number"
              variant="outlined"
              fullWidth
              value={registerPriceTerm}
              onChange={(e) => setRegisterPriceTerm(e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <YearMonthPicker
              value={registerSalesStartMonthTerm}
              label={'販売開始月'}
              onChange={setSalesStartMonthTerm}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => registerItem({
          registerItemNameTerm,
          registerMediumIdTerm,
          registerMarketIdTerm,
          registerSellerIdTerm,
          registerPriceTerm,
          registerSalesStartMonthTerm,
        })} color="primary">
          登録
        </Button>
        <Button onClick={handleRegisterDialogCloseAndClearTerm} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SearchResultTable: React.FC<ResponseDataProps> = ({ responseData }) => {

  const [open, setOpen] = useState<boolean>(false);
  const [updateIdTerm, setUpdateIdTerm] = useState<string>('');
  const [updateItemNameTerm, setUpdateItemNameTerm] = useState<string>('');
  const [updatePriceTerm, setUpdatePriceTerm] = useState<number>(0);
  const [updateSalesStartMonthTerm, setUpdateSalesStartMonthTerm] = useState<Dayjs>(dayTz());
  const [updateMediumIdTerm, setUpdateMediumIdTerm] = useState<string>('');
  const [updateMarketIdTerm, setUpdateMarketIdTerm] = useState<string>('');
  const [updateSellerIdTerm, setUpdateSellerIdTerm] = useState<string>('');
  const [mediumList, setMediumList] = useState<ResponseSearchMediumData[]>([])
  const [marketList, setMarketList] = useState<ResponseSearchMarketData[]>([])
  const [sellerList, setSellerList] = useState<ResponseSearchSellerData[]>([])

  const handleDialogOpen = (content: UpdateData) => {

    console.log('----------------')
    console.log(content.sales_start_month)
    console.log('----------------/')

    setUpdateIdTerm(content.id);
    setUpdateItemNameTerm(content.item_name)
    setUpdatePriceTerm(content.price)
    setUpdateSalesStartMonthTerm(content.sales_start_month)
    setUpdateMediumIdTerm(content.medium_id)
    setUpdateMarketIdTerm(content.market_id)
    setUpdateSellerIdTerm(content.seller_id)
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setUpdateIdTerm('');
    setUpdateItemNameTerm('');
    setUpdatePriceTerm(0);
    setUpdateSalesStartMonthTerm(dayTz());
    setUpdateMediumIdTerm('');
    setUpdateMarketIdTerm('');
    setUpdateSellerIdTerm('');
  };

  useEffect(() => {
    if (open) {
      searchSeller(setSellerList);
      searchMarket(setMarketList);
      searchMedium(setMediumList);
    }
  }, [open])

  const updateItem = (params: UpdateData) => {

    console.log('-----------------')
    console.log(params.sales_start_month.format(DATE_FORMAT))
    console.log('-----------------/')

    axios.put(API_BASE_URL + '/item_update',
      {
        id: params.id,
        update_item_name: params.item_name,
        update_price: params.price,
        update_medium_id: params.medium_id,
        update_market_id: params.market_id,
        update_seller_id: params.seller_id,
        update_sales_start_month: params.sales_start_month.format(DATE_FORMAT)
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Grid container>
                  <Grid size={3}> {/* 全体の幅に対する比率で指定 */}
                    <Typography>ID</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography>商品名</Typography>
                  </Grid>
                  <Grid size={1}>
                    <Typography>価格(円)</Typography>
                  </Grid>
                  <Grid size={1}>
                    <Typography>販売媒体</Typography>
                  </Grid>
                  <Grid size={1}>
                    <Typography>マーケット</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography>販売者</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography>販売開始月</Typography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responseData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Grid container>
                    <Grid
                      size={3}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.id}
                    </Grid>
                    <Grid
                      size={2}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.item_name}
                    </Grid>
                    <Grid
                      size={1}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.price}
                    </Grid>
                    <Grid
                      size={1}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.medium_name}
                    </Grid>
                    <Grid
                      size={1}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.market_name}
                    </Grid>
                    <Grid
                      size={2}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.seller_name}
                    </Grid>
                    <Grid
                      size={2}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.sales_start_month}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleDialogClose}
        sx={{
          '& .MuiDialog-paper': {
            width: '80%',
            maxWidth: '600px',
            overflow: 'hidden',
          },
        }}>
        <DialogTitle>
          <Grid container alignItems="center" spacing={2}>
            <Grid size={10}>
              商品更新
            </Grid>
            <Grid size={1}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleDialogClose}
                aria-label="close"
                sx={{
                  position: 'absolute',
                  right: 24,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                select
                label="販売媒体"
                fullWidth
                value={updateMediumIdTerm}
                onChange={(e) => setUpdateMediumIdTerm(e.target.value)}
              >
                {mediumList.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.medium_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                select
                label="マーケット"
                fullWidth
                value={updateMarketIdTerm}
                onChange={(e) => setUpdateMarketIdTerm(e.target.value)}
              >
                {marketList.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.market_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                select
                label="販売者"
                fullWidth
                defaultValue={updateSellerIdTerm}
                onChange={(e) => setUpdateSellerIdTerm(e.target.value)}
              >
                {sellerList.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.seller_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField
                label="商品名"
                variant="outlined"
                fullWidth
                value={updateItemNameTerm}
                onChange={(e) => setUpdateItemNameTerm(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="価格"
                type="number"
                variant="outlined"
                fullWidth
                value={updatePriceTerm}
                onChange={(e) => setUpdatePriceTerm(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <YearMonthPicker
                value={dayTz(updateSalesStartMonthTerm)}
                label={'販売開始月'}
                onChange={setUpdateSalesStartMonthTerm}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            updateItem({
              id: updateIdTerm,
              item_name: updateItemNameTerm,
              price: updatePriceTerm,
              medium_id: updateMediumIdTerm,
              market_id: updateMarketIdTerm,
              seller_id: updateSellerIdTerm,
              sales_start_month: updateSalesStartMonthTerm,
            });
            handleDialogClose();
          }} color="primary">
            更新
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


const Item = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [responseData, setResponseData] = useState<ResponseData[]>([])
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);

  const handleRegisterDialogClickOpen = () => {
    setRegisterDialogOpen(true);
  };

  const handleRegisterDialogClose = () => {
    setRegisterDialogOpen(false);
  };

  const searchItem = (params: string) => {
    axios.get(API_BASE_URL + '/item_search', {
      params: {
        item_name: params
      }
    })
      .then(response => {
        console.log(response.data);
        setResponseData(response.data) // ここで日付型がstringでDayjs型に変換されてない
      })
      .catch(error => {
        console.error(error);
      });
  };

  const AddButton = () => {
    return (
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={() => handleRegisterDialogClickOpen()}
        sx={{
          borderWidth: 1,
          borderColor: 'primary.main',
          ':hover': {
            borderWidth: 2,
          },
        }}
      >
        追加
      </Button>
    )
  }

  const SearchButton = () => {
    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => searchItem(searchTerm)}
      >
        検索
      </Button>
    )
  }

  const CancelButton = () => {
    return (
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={() => { setSearchTerm(''); setResponseData([]); }}
        sx={{
          borderWidth: 1,
          borderColor: 'primary.main',
          ':hover': {
            borderWidth: 2,
          },
        }}
      >
        キャンセル
      </Button>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid size={10}>
          <Typography variant="h4">商品</Typography>
        </Grid>
        <Grid size={2}>
          <AddButton />
          <RegisterDialog
            registerDialogOpen={registerDialogOpen}
            handleRegisterDialogClose={handleRegisterDialogClose}
          />
        </Grid>
        <Grid size={11} />
        <Grid size={3} />
        <Grid size={6}>
          <TextField
            label="商品名"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid size={3} />
        <Grid size={4} />
        <Grid size={2}>
          <SearchButton />
        </Grid>
        <Grid size={2}>
          <CancelButton />
        </Grid>
        <Grid size={4} />
        <Grid size={12}>
          <SearchResultTable responseData={responseData} />
        </Grid>
      </Grid >
    </Box >
  );
};

export default Item;
