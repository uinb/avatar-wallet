import '@polkadot/wasm-crypto/initWasmAsm';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import React, {Fragment} from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './popup';
import {createTheme, ThemeProvider, alpha, ThemeOptions, lighten} from '@material-ui/core';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { persistStore } from "reduxjs-toolkit-persist";
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import keyring from '@polkadot/ui-keyring';
import {SnackbarProvider} from 'notistack';
import Notifier from './popup/components/snackbar';
import Loading from './popup/components/loading';


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
      secondary: '#8A8C9B',
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
  typography:{
    fontFamily: 'Poppins !important'
  },
  overrides:{
    MuiTypography:{
      caption:{
        fontSize: '0.75rem',
        lineHeight: 1.75,
      }
    },
    MuiMenu:{
      paper:{
        borderRadius: 16,
        background: lighten('#f5f5f5', 0.4)
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
        background: lighten('#f5f5f5', 0.1),
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
        background: '#F5F5F5',
        padding: '8px',
        fontFamily: 'Poppins !important',
        "&:after":{
          border: '1px solid transparent'
        },
        borderRadius: '6px !important',
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
      }
    },
    MuiListItemAvatar:{
      root: {
        minWidth: 42
      }
    },
    MuiListItemText:{
      root:{
        fontSize:'1rem',
        lineHeight:'1.333rem'
      },
      secondary:{
        fontSize:'0.75rem',
        lineHeight:'1.125rem'
      }
    },
  }
})

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
        vertical: 'bottom',
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
            <PersistGate loading={<Loading size={45} height="100vh"/>} persistor={persistStore(store)}>
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


