export const formatLongAddress = (value: string) => {
    return value.length > 15 ? `${value.substr(0,5)}...${value.substr(-5)}`: value
}