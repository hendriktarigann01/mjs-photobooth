import { WhatsApp } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import { Input } from "@src/components/Input";
import { PatternFormat } from "react-number-format";
import Modal from "@src/components/Modal";
import React, { FC, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import { uploadImage } from "@src/helpers/upload-image";
import { useCreateWhatsappRequest } from "@src/api/whatsapp";
import { enqueueSnackbar } from "notistack";

type WhatsappModalProps = {
  open: boolean;
  onClose: () => void;
};

const WhatsappModal: FC<WhatsappModalProps> = ({ open, onClose }) => {
  const { photoResult } = useContext(PhotoboothContext);
  const { mutateAsync: createWhatsappRequest, isPending } =
    useCreateWhatsappRequest();

  const { getFieldProps, handleSubmit, errors, touched, resetForm } =
    useFormik<{
      phone: string;
    }>({
      initialValues: { phone: "" },
      validationSchema: Yup.object().shape({
        phone: Yup.string()
          .transform((value: string) => value.trim())
          .matches(
            /^\+?[1-9]\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
            "Whatsapp number is not valid",
          )
          .required("Whatsapp number is required"),
      }),
      onSubmit: async (values, { resetForm }) => {
        if (photoResult) {
          try {
            const { data, error: errorUpload } = await uploadImage(photoResult);

            if (errorUpload) {
              console.error(errorUpload.message);

              enqueueSnackbar({
                variant: "error",
                message: errorUpload.message,
              });

              return;
            }

            if (data) {
              const baseUrl =
                "https://ttiptxadahqgphyrabvh.supabase.co/storage/v1/object/public/photo%20booth/";

              const body = {
                phone: values.phone.trim(),
                photo_link: baseUrl.concat(data.path),
              };

              await createWhatsappRequest(body);

              onClose();
              resetForm();

              enqueueSnackbar({
                variant: "success",
                message: "Send to Whatsapp request sent successfully",
              });
            }
          } catch (error) {
            console.error(error);

            enqueueSnackbar({
              variant: "error",
              message: "Error requesting to send to Whatsapp",
            });
          }
        }
      },
    });

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        resetForm();
      }}
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
        <WhatsApp sx={{ fontSize: "60px" }} />
        <Typography fontSize="30px">Print</Typography>
      </Stack>

      <Stack spacing={4}>
        <PatternFormat
          {...getFieldProps("phone")}
          format="+#################"
          customInput={Input}
          placeholder="Enter your Whatsapp number"
          size="medium"
          fullWidth
          helperText={touched.phone && errors.phone}
        />

        <LoadingButton
          variant="contained"
          color="Green100"
          size="large"
          loading={isPending}
          onClick={() => handleSubmit()}
        >
          Submit
        </LoadingButton>
      </Stack>
    </Modal>
  );
};

export default WhatsappModal;
