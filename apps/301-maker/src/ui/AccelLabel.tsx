import React from "react";
import {Accel, formatLabel} from "./Accel.ts";

type Props = React.HTMLAttributes<any> & {
    accel: Accel
}

const AccelLabel = (props: Props) => {
    const {accel, ...htmlProps} = props;
    return <span className={"accel-label"} {...htmlProps}>{formatLabel(accel)}</span>;
}

export default AccelLabel;