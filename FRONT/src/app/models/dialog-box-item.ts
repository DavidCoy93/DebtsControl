export interface DialogBoxItem {
    Title: string,
    Message: string,
    Type: TypeDialogBox
}

export type TypeDialogBox = 'message' | 'confirm' | 'error';