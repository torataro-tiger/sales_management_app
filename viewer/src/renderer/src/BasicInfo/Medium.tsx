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
  medium_name: string;
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

  const registerMedium = (params: string) => {
    axios.post(API_BASE_URL + '/medium_registration', {
      medium_name: params
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
            販売媒体登録
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
          label="販売媒体名"
          variant="outlined"
          fullWidth
          value={registerTerm}
          onChange={(e) => setRegisterTerm(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => registerMedium(registerTerm)} color="primary">
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
  const [updateMediumTerm, setUpdateMediumTerm] = useState<string>('');

  const handleDialogOpen = (content: ResponseData) => {
    setUpdateIdTerm(content.id);
    setUpdateMediumTerm(content.medium_name)
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setUpdateIdTerm('');
    setUpdateMediumTerm('')
  };

  const updateMedium = (params: ResponseData) => {
    axios.put(API_BASE_URL + '/medium_update',
      {
        id: params.id,
        update_medium_name: params.medium_name
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
                    <Typography>販売媒体名</Typography>
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
                      {item.medium_name}
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
              販売媒体更新
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
            label="販売媒体名"
            variant="outlined"
            fullWidth
            value={updateMediumTerm}
            onChange={(e) => setUpdateMediumTerm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { updateMedium({ id: updateIdTerm, medium_name: updateMediumTerm }); handleDialogClose(); }} color="primary">
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


const Medium = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [responseData, setResponseData] = useState<ResponseData[]>([])
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);

  
  const handleRegisterDialogClickOpen = () => {
    setRegisterDialogOpen(true);
  };

  
  const handleRegisterDialogClose = () => {
    setRegisterDialogOpen(false);
  };

  const searchMedium = (params: string) => {
    axios.get(API_BASE_URL + '/medium_search', {
      params: {
        medium_name: params
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
        onClick={() => searchMedium(searchTerm)}
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
          <Typography variant="h4">販売媒体</Typography>
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
            label="販売媒体名"
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

export default Medium;
