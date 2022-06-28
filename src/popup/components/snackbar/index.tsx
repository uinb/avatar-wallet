import {useState, useEffect, useCallback} from 'react';
import { useSnackbar } from 'notistack';
import { removeSnackbar, selectNotifications } from '../../../reducer/snackbar';
import { useAppDispatch,  useAppSelector } from '../../../app/hooks';

const Notifier = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectNotifications);
    const [displayed, setDispalyed] = useState([]) as any[];
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = useCallback((id:string) => {
      setDispalyed([...displayed, id]);
    },[setDispalyed, displayed]);

    const removeDisplayed = useCallback((id:string) => {
      setDispalyed([...displayed.filter((key:any) => id !== key)]);
    },[setDispalyed, displayed]);

    useEffect(() => {
        notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
            if (dismissed) {
                closeSnackbar(key);
                return;
            }

            if (displayed.includes(key)) return;

            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey: string) => {
                    dispatch(removeSnackbar(myKey));
                    removeDisplayed(myKey);
                },
            });

            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch, displayed, storeDisplayed, removeDisplayed]);

    return null;
};

export default Notifier;
