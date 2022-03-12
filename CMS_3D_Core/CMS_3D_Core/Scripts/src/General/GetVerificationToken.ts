
export function GetVerificationToken() {
    return (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;
}