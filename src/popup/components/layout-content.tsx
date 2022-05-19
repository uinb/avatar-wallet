import { Grid } from '@material-ui/core';


const Content = (props:any) => {
    const {children, ...restProps} = props;
    return (
        <Grid className="container" {...restProps}>
            {children}
        </Grid>
    )
}


export default Content 