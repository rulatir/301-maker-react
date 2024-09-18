import {Menubar, MenubarProps} from "primereact/menubar";
import React, {ReactNode, useContext} from "react";
import {MenuItem, MenuItemOptions} from "primereact/menuitem";
import AccelLabel from "../ui/AccelLabel.tsx";
import {Accel} from "../ui/Accel.ts";
import accels from "../resources/accels.ts";
import ICommandEnabler from "../framework/contracts/ICommandEnabler.ts";
import {observer} from "mobx-react-lite";
import {CommandBusContext} from "../framework/command/CommandBusContext.ts";
import {Main} from "../resources/menus.ts";
import fixKeys from "../framework/utility/fixKeys.ts";

interface NavigationProps extends MenubarProps {
    enabler: ICommandEnabler;
}

const Navigation: React.FC<NavigationProps> = observer((props : NavigationProps) => {
    const commandBus = useContext(CommandBusContext);
    if (!commandBus) throw new Error('CommandBusContext not provided in context');
    const mainMenu = Main(props.enabler, commandBus);
    return (
        <Menubar model={mainMenu.map(equipWithAccelTemplate)} {...props}/>
    )
});

function retrieveAccel(id: string|undefined): Accel|undefined {
    return id ? accels[id as keyof typeof accels] : undefined;
}
const accelTemplate = (options: MenuItemOptions, accel?: Accel) : ReactNode => {
    const {props, ...rest} = options.element as React.ReactElement;
    const {children, ...propsRest} = props;
    const newChildren = React.Children.toArray(children);
    newChildren[1] = (
        <span className={'accel-item-wrapper flex flex-grow-1 gap-4'}>
            <span className={'label-cell flex-grow-1'}>{newChildren[1]}</span>
            {accel && <AccelLabel accel={accel as Accel}/> || <span key={"zamknijpizdoryja"} className={'label-cell'}></span>}
        </span>
    );
    return {
        ...rest,
        props: {
            ...propsRest,
            children: fixKeys(newChildren)
        }
    };
};

function equipWithAccelTemplate(item: MenuItem): MenuItem {
    const {items, id, ...rest} = item;
    const accel = retrieveAccel(id);
    const result = { items: items?.map(equipWithAccelTemplate), id, ...rest };
    result.template = (_item, options) => accelTemplate(options, accel);
    return result;
}

export default Navigation;