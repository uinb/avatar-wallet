import '@polkadot/wasm-crypto/initWasmAsm';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import React, {Fragment} from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup';
import {createTheme, ThemeProvider, alpha, ThemeOptions} from '@material-ui/core';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { persistStore } from "reduxjs-toolkit-persist";
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import CircularProgress from '@material-ui/core/CircularProgress';
import keyring from '@polkadot/ui-keyring';
import {SnackbarProvider} from 'notistack';
import Notifier from './popup/components/snackbar';


const theme:ThemeOptions  = createTheme({
  palette:{
    primary:{
      main: '#2F64F9'
    },
    secondary:{
      main: '#438AFD'
    },
    background: {
      default: '#FFFFFF',
      paper: "#F5F5F5"
    },
    text:{
      primary: '#282828',
      secondary: '#666666',
      hint:'#BEC1D6',
    },
    error:{
      main: '#F23E5F'
    },
    action:{
      disabled: '#fff',
      disabledBackground: alpha('#2F64F9', 0.2)
    }
  },
  overrides:{
    MuiTypography:{
      caption:{
        fontSize: '0.75rem',
        lineHeight: 1.75,
        fontWeight: 200
      }
    },
    MuiMenu:{
      paper:{
        borderRadius: 16,
      }
    },
    MuiMenuItem:{
      root: {
        minHeight: 'auto',
        padding: `8px 16px`
      }
    },
    MuiCard:{
      root:{
        background: '#F5F5F5',
        boxShadow: '0 0 0'
      },
    },
    MuiPaper:{
      root:{
        padding: '8px',
        boxShadow: '0 0 0 !important',
      },
      rounded:{
        borderRadius: 12,
      }
    },
    MuiInput:{
      root: {
        background: "#F5F5F5",
        padding: '8px',
        "&:after":{
          border: '1px solid transparent'
        },
        borderRadius: '4px !important',
        "&:hover": {
          border: '1px solid #438AFD',
        },
        "&.Mui-error": {
          border: '1px solid #F23E5F',
        }
      },
      underline:{
        "&::before":{
          border: '1px solid transparent !important',
        },
        "&::after":{
          border: '1px solid transparent !important',
        }
      }
    },
    MuiButton:{
      root:{
        textTransform: 'capitalize',
        fontSize: '0.75rem'
      },

      contained:{
        backgroundColor: '#fff',
        color: "#2F64F9",
        boxShadow: '0 0 0',
      },
      containedPrimary:{
        background: 'linear-gradient(90deg, #2F64F9 0%, #438AFD 100%)',
        '&.Mui-disabled':{
          background: alpha('#2F64F9', 0.2)
        }
      },
    },
    MuiDialog:{
      root:{
        padding: 0,
        
      },
      paper:{
        background: '#fff',
        width:'90%'
      }
    },
    MuiDialogContent:{
      root:{
        paddingLeft: 8, 
        paddingRight: 8, 
      }
    },
    MuiDialogTitle:{
      root:{
        paddingLeft: 8, 
        paddingRight: 8, 
      }
    },
    MuiInputLabel:{
      root: {
        fontSize: '0.875rem',
        fontWeight: 300
      }
    },
    MuiListItemAvatar:{
      root: {
        minWidth: 42
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

const SnackbarProviderComponent = (props:any) => {
  return (
    <SnackbarProvider 
      autoHideDuration={3000} 
      preventDuplicate={true} 
      hideIconVariant={true}
      dense={true}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      {props.children}
    </SnackbarProvider>
  )
}


(async () => {
  const result = await cryptoWaitReady();
  await keyring.loadAll({type: 'sr25519', ss58Format:  42})
  if(result){
    root.render(
      <Fragment>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={<Loading />} persistor={persistStore(store)}>
              <SnackbarProviderComponent >
                <Notifier/>
                <Popup />
              </SnackbarProviderComponent>
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </Fragment>
    );
  }
})()


