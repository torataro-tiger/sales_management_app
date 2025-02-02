import { useState } from 'react';
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
} from '@mui/material';
import axios from "axios";
import { API_BASE_URL } from '../settings';

type ResponseData = {
  id: string;
  market_name: string;
};

type ResponseDataProps = {
  responseData: ResponseData[];
};

type RegisterDialogProps = {
  registerDialogOpen: boolean;
  handleRegisterDialogClose: () => void;
};

const RegisterDialog: React.FC<RegisterDialogProps> = ({
  registerDialogOpen,
  handleRegisterDialogClose
}) => {
  const [registerTerm, setRegisterTerm] = useState<string>('');

  const registerMarket = (params: string) => {
    axios.post(API_BASE_URL + '/market_registration', {
      market_name: params
    })
      .then(response => {
        console.log(response.data);
        handleRegisterDialogClose();
      })
      .catch(error => {
        console.error(error);
        handleRegisterDialogClose();
      });
  };

  const handleRegisterDialogCloseAndClearTerm = () => {
    handleRegisterDialogClose();
    setRegisterTerm('');
  }

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
            マーケット登録
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
        <TextField
          label="マーケット名"
          variant="outlined"
          fullWidth
          value={registerTerm}
          onChange={(e) => setRegisterTerm(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => registerMarket(registerTerm)} color="primary">
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
  const [updateMarketTerm, setUpdateMarketTerm] = useState<string>('');

  const handleDialogOpen = (content: ResponseData) => {
    setUpdateIdTerm(content.id);
    setUpdateMarketTerm(content.market_name)
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setUpdateIdTerm('');
    setUpdateMarketTerm('')
  };

  const updateMarket = (params: ResponseData) => {
    axios.put(API_BASE_URL + '/market_update',
      {
        id: params.id,
        update_market_name: params.market_name
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
                  <Grid size={6}>
                    <Typography>販売者名</Typography>
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
                      size={6}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDialogOpen(item)}
                    >
                      {item.market_name}
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
              マーケット更新
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
            label="マーケット名"
            variant="outlined"
            fullWidth
            value={updateMarketTerm}
            onChange={(e) => setUpdateMarketTerm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { updateMarket({ id: updateIdTerm, market_name: updateMarketTerm }); handleDialogClose(); }} color="primary">
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


const Market = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [responseData, setResponseData] = useState<ResponseData[]>([])
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);

  
  const handleRegisterDialogClickOpen = () => {
    setRegisterDialogOpen(true);
  };

  
  const handleRegisterDialogClose = () => {
    setRegisterDialogOpen(false);
  };

  const searchMarket = (params: string) => {
    axios.get(API_BASE_URL + '/market_search', {
      params: {
        market_name: params
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
        onClick={() => searchMarket(searchTerm)}
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
          <Typography variant="h4">マーケット</Typography>
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
            label="マーケット名"
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

export default Market;
