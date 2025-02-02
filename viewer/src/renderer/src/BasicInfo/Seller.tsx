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

type ResponseData = {
  id: string;
  seller_name: string;
  position_name: string;
};

type UpdateData = {
  id: string;
  seller_name: string;
}

type ResponseDataProps = {
  responseData: ResponseData[];
};

type RegisterDialogProps = {
  registerDialogOpen: boolean;
  handleRegisterDialogClose: () => void;
};

type ResponseSearchData = {
  position_name: string;
  id: string;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({
  registerDialogOpen,
  handleRegisterDialogClose
}) => {
  const [registerSellerTerm, setRegisterSellerTerm] = useState<string>('');
  const [registerPositionIdTerm, setRegisterPositionIdTerm] = useState<string>('');
  const [positionList, setPositionList] = useState<ResponseSearchData[]>([])

  const searchPosition = () => {
    axios.get(API_BASE_URL + '/position_search')
      .then(response => {
        console.log(response.data);
        setPositionList(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const registerSeller = (registerSellerTerm: string, registerPositionIdTerm: string) => {
    axios.post(API_BASE_URL + '/seller_registration', {
      seller_name: registerSellerTerm,
      position_id: registerPositionIdTerm,
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
    setRegisterSellerTerm('');
    setRegisterPositionIdTerm('');
  }


  useEffect(() => {
    if (registerDialogOpen) {
      searchPosition();
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
            販売者登録
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
              label="役職"
              fullWidth
              defaultValue=""
              onChange={(e) => setRegisterPositionIdTerm(e.target.value)}
            >
              {positionList.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.position_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField
              label="販売者名"
              variant="outlined"
              fullWidth
              value={registerSellerTerm}
              onChange={(e) => setRegisterSellerTerm(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => registerSeller(registerSellerTerm, registerPositionIdTerm)} color="primary">
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
  const [updateSellerTerm, setUpdateSellerTerm] = useState<string>('');

  const handleDialogOpen = (content: UpdateData) => {
    setUpdateIdTerm(content.id);
    setUpdateSellerTerm(content.seller_name)
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setUpdateIdTerm('');
    setUpdateSellerTerm('')
  };

  const updateSeller = (params: UpdateData) => {
    axios.put(API_BASE_URL + '/seller_update',
      {
        id: params.id,
        update_seller_name: params.seller_name
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
                  <Grid size={3}>
                    <Typography>販売者名</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography>役職</Typography>
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
                      {item.seller_name}
                    </Grid>
                    <Grid
                      size={6}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.position_name}
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
              販売者更新
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
            label="販売者名"
            variant="outlined"
            fullWidth
            value={updateSellerTerm}
            onChange={(e) => setUpdateSellerTerm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { updateSeller({ id: updateIdTerm, seller_name: updateSellerTerm }); handleDialogClose(); }} color="primary">
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


const Seller = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [responseData, setResponseData] = useState<ResponseData[]>([])
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);

  
  const handleRegisterDialogClickOpen = () => {
    setRegisterDialogOpen(true);
  };

  
  const handleRegisterDialogClose = () => {
    setRegisterDialogOpen(false);
  };

  const searchSeller = (params: string) => {
    axios.get(API_BASE_URL + '/seller_search', {
      params: {
        seller_name: params
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
        onClick={() => searchSeller(searchTerm)}
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
          <Typography variant="h4">販売者</Typography>
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
            label="販売者名"
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

export default Seller;
