import {
  LocalPrintshopOutlined,
  MailOutline,
  QrCode2,
  WhatsApp,
} from "@mui/icons-material";
import { Box, Button, Grid2, Typography } from "@mui/material";
import React, { FC, useContext, useState } from "react";
import SendEmailModal from "./SendEmailModal";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import PrintModal from "./PrintModal";
import WhatsappModal from "./WhatsappModal";

type SendOptionMenuProps = {
  savePhotoResult: () => void;
};

const SendOptionMenu: FC<SendOptionMenuProps> = ({ savePhotoResult }) => {
  const {
    setScreen,
    setLayout,
    setPhotoResult,
    setPhotos,
    setSelectedCurrentFilter,
    setSelectedCurrentFrame,
    setSelectedFilter,
    setSelectedFrame,
    setSelectedMenu,
    setImageVariant,
  } = useContext(PhotoboothContext);

  const [openSendEmailModal, setOpenSendEmailModal] = useState<boolean>(false);
  const [openPrintModal, setOpenPrintModal] = useState<boolean>(false);
  const [openWhatsappModal, setOpenWhatsappModal] = useState<boolean>(false);

  const onActionButton = (callback: () => void) => {
    savePhotoResult();
    callback();
  };

  const onDone = () => {
    setScreen("welcome");
    setLayout(null);
    setPhotoResult(null);
    setPhotos([]);
    setSelectedCurrentFilter(null);
    setSelectedCurrentFrame(null);
    setSelectedFilter(null);
    setSelectedFrame(null);
    setSelectedMenu(null);
    setImageVariant({ feed: null, story: null, normal: null });
  };

  return (
    <Box width="662px">
      <Typography
        textAlign="center"
        mb="52px"
        fontSize="40px"
        fontWeight={600}
        color="white"
      >
        Send Photo
      </Typography>

      <Grid2 container spacing={1}>
        <Grid2 size={6}>
          <Button
            variant="contained"
            color="Green200"
            size="large"
            fullWidth
            onClick={() => onActionButton(() => setOpenSendEmailModal(true))}
            disabled
          >
            <MailOutline />
            Send Email
          </Button>
        </Grid2>

        <Grid2 size={6}>
          <Button
            variant="contained"
            color="Green200"
            size="large"
            fullWidth
            onClick={() => onActionButton(() => setScreen("qr"))}
          >
            <QrCode2 />
            QR Code
          </Button>
        </Grid2>

        <Grid2 size={6}>
          <Button
            variant="contained"
            color="Green200"
            size="large"
            fullWidth
            onClick={() => onActionButton(() => setOpenPrintModal(true))}
            disabled
          >
            <LocalPrintshopOutlined />
            Print
          </Button>
        </Grid2>

        <Grid2 size={6}>
          <Button
            variant="contained"
            color="Green200"
            size="large"
            fullWidth
            onClick={() => onActionButton(() => setOpenWhatsappModal(true))}
            disabled
          >
            <WhatsApp />
            Whatsapp
          </Button>
        </Grid2>

        <Grid2 size={12}>
          <Button
            variant="contained"
            color="Green200"
            size="large"
            fullWidth
            onClick={onDone}
          >
            Done
          </Button>
        </Grid2>
      </Grid2>

      <SendEmailModal
        open={openSendEmailModal}
        onClose={() => setOpenSendEmailModal(false)}
      />

      <PrintModal
        open={openPrintModal}
        onClose={() => setOpenPrintModal(false)}
      />

      <WhatsappModal
        open={openWhatsappModal}
        onClose={() => setOpenWhatsappModal(false)}
      />
    </Box>
  );
};

export default SendOptionMenu;
