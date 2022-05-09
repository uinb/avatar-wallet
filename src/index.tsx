import React, {Fragment} from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup';
import {createTheme, ThemeProvider, alpha} from '@material-ui/core';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { persistStore } from "reduxjs-toolkit-persist";
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import CircularProgress from '@material-ui/core/CircularProgress';

const theme  = createTheme({
  palette:{
    primary:{
      main: '#2F64F9'
    },
    secondary:{
      main: '#438AFD'
    },
    background: {
      default: '#FFFFFF',
      paper: "#F9F9F9"
    },
    action:{
      disabled: '#fff',
      disabledBackground: alpha('#2F64F9', 0.2)
    }
  },
  overrides:{
    MuiInput:{
      root: {
        background: "#F5F5F5",
        "&:after":{
          border: 0
        },
        borderRadius: '4px !important',
        "&:hover": {
          border: '1px solid #438AFD',
        
        }
      },
      underline:{
        "&::before":{
          border: '0px !important',
        },
        "&::after":{
          border: '0px !important',
        }
      }
    },
    MuiButton:{
      root:{
        textTransform: 'capitalize',
      },
      containedPrimary:{
        background:  'linear-gradient(90deg, #2F64F9 0%, #438AFD 100%)',
      }
    }
  }
})

const Loading = () => {
  return (
    <div style={{width: 360, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2F64F9'}}>
      <CircularProgress size={40} color="inherit"/>
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Fragment>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistStore(store)}>
          <Popup />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </Fragment>
);