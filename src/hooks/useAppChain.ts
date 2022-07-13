import {useEffect, useState, useCallback} from 'react';
import {appChain} from '../api';

const useAppChain = (nodeId:string) => {
    const [api, setApi] = useState() as any;
    const refreshAPI = useCallback(async (nodeId) => {
        if(api){
            await api.disconnect();
            setApi(null);
        }
        const instance = appChain(nodeId);
        await instance.isReady;
        setApi(instance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[nodeId])
    useEffect(() => {
        if(!nodeId){
            return ;
        }
        refreshAPI(nodeId)
    },[nodeId, refreshAPI])


    return api
}

export default useAppChain;