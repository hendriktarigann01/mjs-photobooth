import { EmailOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import { EmailerOptions } from "@src/app/api/send-email/route";
import { Input } from "@src/components/Input";
import Modal from "@src/components/Modal";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { FC, useContext, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { uploadImage } from "@src/helpers/upload-image";

type SendEmailModalProps = {
  open: boolean;
  onClose: () => void;
};

const SendEmailModal: FC<SendEmailModalProps> = ({ open, onClose }) => {
  const { photoResult } = useContext(PhotoboothContext);

  const [isSending, setIsSending] = useState<boolean>(false);

  const sendEmail = async (to: string) => {
    if (photoResult) {
      try {
        const { data, error } = await uploadImage(photoResult);

        if (error) {
          throw error;
        }

        const baseUrl =
          "https://ttiptxadahqgphyrabvh.supabase.co/storage/v1/object/public/photo%20booth/";

        if (data) {
          const body: EmailerOptions = {
            htmlFileName: "photo-result.html",
            mailerName: "MJ Solution Indonesia",
            to,
            subject:
              "Your Photo Is Here: MJ Solution Indonesia at Trade Expo Indonesia 2024",
            replacements: {
              photoLink: baseUrl.concat(data.path),
            },
            attachments: [
              {
                filename: `MJS-${Date.now()}.png`,
                content: photoResult.split("base64,")[1],
                encoding: "base64",
                cid: "unique@image",
              },
            ],
          };

          await axios.post("/api/send-email", body);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const { getFieldProps, errors, touched, handleSubmit } = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().required().label("Email"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSending(true);

        await sendEmail(values.email);

        onClose();
        resetForm();

        enqueueSnackbar({
          variant: "success",
          message: "Email sent successfully",
        });
      } catch (error) {
        console.log(error);

        enqueueSnackbar({
          variant: "error",
          message: "Error sending email",
        });
      } finally {
        setIsSending(false);
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: { xs: "800px", xl: "700px" },
          },
        },
      }}
    >
      <Stack
        color="white"
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        mb={6}
      >
        <EmailOutlined sx={{ fontSize: "60px" }} />
        <Typography fontSize="30px">Email</Typography>
      </Stack>

      <Stack spacing={4}>
        <Input
          {...getFieldProps("email")}
          placeholder="Enter your email.."
          size="medium"
          fullWidth
          helperText={touched.email && errors.email}
        />

        <LoadingButton
          variant="contained"
          color="Green100"
          size="large"
          loading={isSending}
          onClick={() => handleSubmit()}
        >
          Send
        </LoadingButton>
      </Stack>
    </Modal>
  );
};

export default SendEmailModal;
