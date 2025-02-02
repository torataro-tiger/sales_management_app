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
import axios from "axios";
import { API_BASE_URL } from '../settings';
import { Dayjs } from 'dayjs';
import dayTz from '@renderer/Common/DayjsWithTimezone';
import YearMonthPicker from '@renderer/Common/YearMonthPicker';
import { DATE_FORMAT } from '../settings'

type ResponseData = {
  id: string;
  month: Dayjs;
  item_name: string;
  sales_quantity: number;
};

type UpdateData = {
  id: string;
  update_sales_quantity: number;
}

type ResponseDataProps = {
  responseData: ResponseData[];
};

type RegisterDialogProps = {
  registerDialogOpen: boolean;
  handleRegisterDialogClose: () => void;
};

type SearchMonthSalesQuantity = {
  startMonth: Dayjs;
  endMonth: Dayjs
}

type ResponseSearchItemData = {
  id: string
  item_name: string
  price: number
  sales_start_month: Dayjs
  medium_id: string
  medium_name: string
  market_id: string
  market_name: string
  seller_id: string
  seller_name: string
}


const searchItem = (setMarketList: (responseData: ResponseSearchItemData[]) => void) => {
  axios.get<ResponseSearchItemData[]>(API_BASE_URL + '/item_search')
    .then(response => {
      console.log(response.data);
      setMarketList(response.data)
    })
    .catch(error => {
      console.error(error);
    });
};

const RegisterDialog: React.FC<RegisterDialogProps> = ({
  registerDialogOpen,
  handleRegisterDialogClose
}) => {
  const [registerMonthSalesQuantityTerm, setRegisterMonthSalesQuantityTerm] = useState<number>(0);
  const [registerItemIdTerm, setRegisterItemIdTerm] = useState<string>('');
  const [registerMonthTerm, setRegisterMonthTerm] = useState<Dayjs>(dayTz());
  const [itemList, setItemList] = useState<ResponseSearchItemData[]>([])

  const registerMonthSalesQuantity = (
    registerMonthTerm: Dayjs,
    registerItemIdTerm: string,
    registerMonthSalesQuantityTerm: number,
  ) => {
    axios.post(API_BASE_URL + '/month_sales_quantity_registration', {
      month: registerMonthTerm.format(DATE_FORMAT),
      item_id: registerItemIdTerm,
      sales_quantity: registerMonthSalesQuantityTerm,
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
    setRegisterMonthSalesQuantityTerm(0);
    setItemList([]);
  }

  useEffect(() => {
    if (registerDialogOpen) {
      searchItem(setItemList);
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
            月次売上登録
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
              label="商品名"
              fullWidth
              defaultValue=""
              onChange={(e) => setRegisterItemIdTerm(e.target.value)}
            >
              {itemList.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.item_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <YearMonthPicker
              value={registerMonthTerm}
              label={'売上月'}
              onChange={setRegisterMonthTerm}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="月次売上個数"
              variant="outlined"
              type="number"
              fullWidth
              value={registerMonthSalesQuantityTerm}
              onChange={(e) => setRegisterMonthSalesQuantityTerm(Number(e.target.value))}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => registerMonthSalesQuantity(
          registerMonthTerm,
          registerItemIdTerm,
          registerMonthSalesQuantityTerm,
        )} color="primary">
          登録
        </Button>
        <Button onClick={handleRegisterDialogCloseAndClearTerm} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog >
  );
};

const SearchResultTable: React.FC<ResponseDataProps> = ({ responseData }) => {

  const [open, setOpen] = useState<boolean>(false);
  const [updateIdTerm, setUpdateIdTerm] = useState<string>('');
  const [updateMonthSalesQuantityTerm, setUpdateMonthSalesQuantityTerm] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = (content: UpdateData) => {
    setUpdateIdTerm(content.id);
    setUpdateMonthSalesQuantityTerm(content.update_sales_quantity)
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setUpdateIdTerm('');
    setUpdateMonthSalesQuantityTerm(0);
  };

  const updateMonthSalesQuantity = (params: UpdateData) => {

    axios.put(API_BASE_URL + '/month_sales_quantity_update',
      {
        id: params.id,
        update_sales_quantity: params.update_sales_quantity
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const deleteMonthSalesQuantity = (id: string) => {

    axios.delete(API_BASE_URL + '/month_sales_quantity_delete', {
      data: { id: id },
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleDeleteData = (id: string) => {
    deleteMonthSalesQuantity(id);
    setDeleteDialogOpen(false);
    handleDialogClose();
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
                  <Grid size={3}>
                    <Typography>商品名</Typography>
                  </Grid>
                  <Grid size={3}>
                    <Typography>売上月</Typography>
                  </Grid>
                  <Grid size={3}>
                    <Typography>売上個数</Typography>
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
                      size={3}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.item_name}
                    </Grid>
                    <Grid
                      size={3}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.month}
                    </Grid>
                    <Grid
                      size={3}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.sales_quantity}
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
              月次売上個数更新
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
          <TextField
            label="月次売上個数"
            variant="outlined"
            fullWidth
            value={updateMonthSalesQuantityTerm}
            onChange={(e) => setUpdateMonthSalesQuantityTerm(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            updateMonthSalesQuantity({
              id: updateIdTerm,
              update_sales_quantity: updateMonthSalesQuantityTerm
            });
            handleDialogClose();
          }} color="primary">
            更新
          </Button>
          <Button onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'red' }}>
            削除
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        sx={{
          '& .MuiDialog-paper': {
            width: '80%',
            maxWidth: '600px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle>
          <Grid container alignItems="center" spacing={2}>
            <Grid size={10}>
              削除
            </Grid>
            <Grid size={1}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setDeleteDialogOpen(false)}
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
          本当に削除しますか？
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteData(updateIdTerm)} sx={{ color: 'red' }}>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


const MonthSalesQuantity = () => {
  const [searchStartMonth, setSearchStartMonth] = useState<Dayjs>(dayTz())
  const [searchEndMonth, setSearchEndMonth] = useState<Dayjs>(dayTz())
  const [responseData, setResponseData] = useState<ResponseData[]>([])
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);


  const handleRegisterDialogClickOpen = () => {
    setRegisterDialogOpen(true);
  };

  const handleRegisterDialogClose = () => {
    setRegisterDialogOpen(false);
  };

  const searchMonthSalesQuantity = ({
    startMonth: searchStartMonth,
    endMonth: searchEndMonth
  }: SearchMonthSalesQuantity) => {

    axios.get(API_BASE_URL + '/month_sales_quantity_search', {
      params: {
        start_month: searchStartMonth.format(DATE_FORMAT),
        end_month: searchEndMonth.format(DATE_FORMAT)
      }
    })
      .then(response => {
        console.log(response.data);
        setResponseData(response.data)
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
        onClick={() => searchMonthSalesQuantity({ startMonth: searchStartMonth, endMonth: searchEndMonth })}
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
        onClick={() => { setSearchStartMonth(dayTz()); setSearchEndMonth(dayTz()); setResponseData([]); }}
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
          <Typography variant="h4">月次売上個数</Typography>
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
        <Grid size={2.8}>
          <YearMonthPicker
            value={searchStartMonth}
            label={'開始月'}
            onChange={setSearchStartMonth}
          />
        </Grid>
        <Grid size={0.4} style={{ textAlign: 'center' }}>
          <span>～</span>
        </Grid>
        <Grid size={2.8}>
          <YearMonthPicker
            value={searchEndMonth}
            label={'終了月'}
            onChange={setSearchEndMonth}
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

export default MonthSalesQuantity;
