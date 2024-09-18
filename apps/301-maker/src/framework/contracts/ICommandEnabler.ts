export default interface ICommandEnabler {
    isCommandEnabled(commandId: string): boolean;
};