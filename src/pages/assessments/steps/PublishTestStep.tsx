import React from "react";
import { FormControlLabel, Grid, Switch } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import BlankCard from "@components/Card/BlankCard.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import { PublishAssessmentFormValues } from "@/pages/assessments/CreateOrUpdateAssessment.tsx";

const PublishTestSchema = Yup.object().shape({
  validFrom: Yup.date().required("Start date and time is required"),
  validTo: Yup.date()
    .min(
      Yup.ref("validFrom"),
      "End date and time must be after start date and time",
    )
    .required("End date and time is required"),
});

export interface PublishTestProps {
  onSubmit: (values: PublishAssessmentFormValues) => void;
  values: PublishAssessmentFormValues;
  formikRef: React.RefObject<FormikProps<any>>;
}

const PublishTest: React.FC<PublishTestProps> = ({
  onSubmit,
  formikRef,
  values,
}) => {
  return (
    <ParentCard title="Publish Test">
      <BlankCard>
        <Formik
          innerRef={formikRef}
          initialValues={values}
          validationSchema={PublishTestSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field name="isPublished">
                    {/* @ts-ignore */}
                    {({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Publish Test"
                      />
                    )}
                  </Field>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={12}>
                    <DateTimePicker
                      minDateTime={dayjs()}
                      format="DD/MM/YYYY hh:mm A"
                      label="Start Date Time"
                      value={values.validFrom}
                      onChange={(value: Dayjs | null) =>
                        setFieldValue("validFrom", value)
                      }
                      slotProps={{
                        textField: {
                          error: Boolean(touched.validFrom && errors.validFrom),
                          helperText: touched.validFrom && errors.validFrom,
                          sx: { width: "40%" },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DateTimePicker
                      minDateTime={dayjs()}
                      format="DD/MM/YYYY hh:mm A"
                      label="End Date Time"
                      value={values.validTo}
                      onChange={(value: Dayjs | null) =>
                        setFieldValue("validTo", value)
                      }
                      slotProps={{
                        textField: {
                          error: Boolean(touched.validTo && errors.validTo),
                          helperText: touched.validTo && errors.validTo,
                          sx: { width: "40%" },
                        },
                      }}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Form>
          )}
        </Formik>
      </BlankCard>
    </ParentCard>
  );
};

export default PublishTest;
