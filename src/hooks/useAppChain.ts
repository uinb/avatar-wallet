import {useEffect, useState} from 'react';
import {appChain} from '../api';

const useAppChain = (nodeId:string) => {
    const [api, setApi] = useState() as any;
    useEffect(() => {
        if(!nodeId){
            return;
        }
        (async() => {
            const instance = appChain(nodeId);
            await instance.isReady;
            setApi(instance);
        })()
    },[nodeId])

    return api
}

export default useAppChain;