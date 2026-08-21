import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import { logjs } from "@lib/client";
const log = new logjs("unit_test/dialog/xyzDialog/XyzDialog");

function XyzDialog({ open, onClose, params }) {
  log.debug("XyzDialog", { open, onClose, params });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>カスタムダイアログ</DialogTitle>
      <DialogContent>
        <p>これはカスタムダイアログの内容です。</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose({ result: "close---" })}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
}
export default XyzDialog;
