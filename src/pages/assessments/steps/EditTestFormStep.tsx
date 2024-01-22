import React from "react";
import {
  Formik,
  Form,
  Field,
  FormikHelpers,
  FormikErrors,
  FormikProps,
} from "formik";
import * as Yup from "yup";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@mui/material";
import { Resource, SubjectAttributes } from "@/types/apis";
import { CreateAssessmentFormValues } from "@/pages/assessments/CreateOrUpdateAssessment.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import BlankCard from "@components/Card/BlankCard.tsx";
import { ResultDisplayMode } from "@/constants/resultDisplayMode.ts";

export interface EditTestFormProps {
  editMode: boolean;
  values: CreateAssessmentFormValues;
  onSubmit: (values: any) => void;
  formikRef: React.RefObject<FormikProps<any>>;
  subjects: Resource<SubjectAttributes>[];
  requiredMark: boolean;
  setRequiredMark: (value: boolean) => void;
  durationEnabled: boolean;
  setDurationEnabled: (value: boolean) => void;
  maxAttemptsEnabled: boolean;
  setMaxAttemptsEnabled: (value: boolean) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  subject: Yup.number().required("Subject is required"),
  durationEnabled: Yup.boolean(),
  maxAttemptsEnabled: Yup.boolean(),
  duration: Yup.number().when("durationEnabled", {
    is: true,
    then: (schema) =>
      schema
        .required("Duration is required")
        .min(0, "Duration must be 0 or a positive number")
        .max(120, "Duration cannot be more than 120 minutes"),
    otherwise: (schema) => schema.nullable(),
  }),
  maxAttempts: Yup.number().when("maxAttemptsEnabled", {
    is: true,
    then: (schema) =>
      schema
        .required("Max Attempts is required")
        .min(1, "Max Attempts must be a positive number"),
    otherwise: (schema) => schema.nullable(),
  }),
  description: Yup.string().nullable(),
  thumbnail: Yup.mixed().nullable(),
  requiredMark: Yup.boolean(),
  totalMarks: Yup.number().when("requiredMark", {
    is: true,
    then: (schema) =>
      schema
        .required("Total Marks is required")
        .min(1, "Total Marks must be a positive number")
        .max(1000, "Total Marks cannot be more than 1000"),
    otherwise: (schema) => schema.nullable(),
  }),
  passMarks: Yup.number().when("requiredMark", {
    is: true,
    then: (schema) =>
      schema
        .min(0, "Pass Marks must be a positive number")
        .max(
          Yup.ref("totalMarks"),
          "Pass Marks cannot be more than Total Marks",
        )
        .nullable(),
    otherwise: (schema) => schema.nullable(),
  }),
  resultDisplayMode: Yup.string().when("requiredMark", {
    is: true,
    then: (schema) => schema.required("Result Display Mode is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

const blurredLabelStyle = {
  color: "#BDBDBD",
  transition: "0.3s",
  opacity: 0.7,
};

const EditTestForm: React.FC<EditTestFormProps> = ({
  editMode,
  subjects,
  values,
  onSubmit,
  formikRef,
  requiredMark,
  setRequiredMark,
  durationEnabled,
  setDurationEnabled,
  maxAttemptsEnabled,
  setMaxAttemptsEnabled,
}) => {
  const initialValues: CreateAssessmentFormValues = values;

  const handleFormSubmit = (
    values: CreateAssessmentFormValues,
    actions: FormikHelpers<CreateAssessmentFormValues>,
  ) => {
    const submissionValues = { ...values };
    if (!requiredMark) {
      delete submissionValues.totalMarks;
      delete submissionValues.passMarks;
      delete submissionValues.resultDisplayMode;
    }

    if (!durationEnabled) {
      delete submissionValues.duration;
    }

    if (!maxAttemptsEnabled) {
      delete submissionValues.maxAttempts;
    }

    onSubmit(submissionValues);
    actions.setSubmitting(false);
  };

  const handleNumericFieldChange = async (
    fieldName: string,
    e: { target: any },
    setFieldValue: {
      (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined,
      ): Promise<void | FormikErrors<CreateAssessmentFormValues>>;
      (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined,
      ): Promise<void | FormikErrors<CreateAssessmentFormValues>>;
      (arg0: any, arg1: string | number): void;
    },
  ) => {
    let value =
      e.target.value === ""
        ? ""
        : Math.max(0, Math.min(100, Number(e.target.value)));
    await setFieldValue(fieldName, value);
  };

  return (
    <ParentCard title={editMode ? "Edit Test" : "Create Test"}>
      <BlankCard>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            errors,
            touched,
          }) => (
            <Form>
              <Paper elevation={0} sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="name"
                      label="Name"
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      value={values.name || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.name && touched.name)}
                      helperText={touched.name && errors.name}
                      InputLabelProps={{
                        sx: !values.name ? blurredLabelStyle : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel
                        id="subject-label"
                        sx={!values.subject ? blurredLabelStyle : {}}
                      >
                        Subject
                      </InputLabel>
                      <Field
                        as={Select}
                        name="subject"
                        labelId="subject-label"
                        id="subject-select"
                        label="Select Subject"
                        value={values.subject || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.subject && touched.subject)}
                      >
                        {subjects.map(
                          (subject: Resource<SubjectAttributes>) => (
                            <MenuItem key={subject.id} value={subject.id}>
                              {subject.attributes.name}
                            </MenuItem>
                          ),
                        )}
                      </Field>
                      <FormHelperText sx={{ color: "#ff413a" }}>
                        {touched.subject && errors.subject}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={durationEnabled}
                          onChange={async (e) => {
                            setDurationEnabled(e.target.checked);
                            await setFieldValue(
                              "durationEnabled",
                              e.target.checked,
                            );

                            if (!e.target.checked) {
                              await setFieldValue("duration", null);
                            }
                          }}
                        />
                      }
                      label="Enable Duration"
                    />
                    {durationEnabled && (
                      <TextField
                        name="duration"
                        label="Duration (In Min.)"
                        type="number"
                        value={values.duration || ""}
                        fullWidth
                        InputLabelProps={{
                          sx: !values.duration ? blurredLabelStyle : {},
                        }}
                        variant="outlined"
                        onChange={async (e: { target: { value: any } }) => {
                          let value = e.target.value;
                          if (value === "") {
                            await setFieldValue("duration", null);
                          } else {
                            value = Math.max(0, Math.min(999, Number(value)));
                            await setFieldValue("duration", value);
                          }
                        }}
                        error={
                          durationEnabled &&
                          Boolean(errors.duration && touched.duration)
                        }
                        helperText={
                          durationEnabled && touched.duration && errors.duration
                        }
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={maxAttemptsEnabled}
                          onChange={async (e) => {
                            setMaxAttemptsEnabled(e.target.checked);
                            await setFieldValue(
                              "maxAttemptsEnabled",
                              e.target.checked,
                            );

                            if (!e.target.checked) {
                              await setFieldValue("maxAttempts", null);
                            }
                          }}
                        />
                      }
                      label="Enable Max Attempts"
                    />
                    {maxAttemptsEnabled && (
                      <TextField
                        value={values.maxAttempts || ""}
                        type="number"
                        name="maxAttempts"
                        label="Max Attempts"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          sx: !values.maxAttempts ? blurredLabelStyle : {},
                        }}
                        onChange={async (e: { target: { value: any } }) => {
                          let value = e.target.value;
                          if (value === "") {
                            await setFieldValue("maxAttempts", null);
                          } else {
                            value = Math.max(0, Math.min(10, Number(value)));
                            await setFieldValue("maxAttempts", value);
                          }
                        }}
                        error={
                          maxAttemptsEnabled &&
                          Boolean(errors.maxAttempts && touched.maxAttempts)
                        }
                        helperText={
                          maxAttemptsEnabled &&
                          touched.maxAttempts &&
                          errors.maxAttempts
                        }
                      />
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={requiredMark}
                          onChange={async (e) => {
                            setRequiredMark(e.target.checked);
                            await setFieldValue(
                              "requiredMark",
                              e.target.checked,
                            );
                            if (!e.target.checked) {
                              await setFieldValue("totalMarks", null);
                              await setFieldValue("passMarks", null);
                              await setFieldValue("resultDisplayMode", null);
                            }
                          }}
                        />
                      }
                      label="Required Mark"
                    />
                  </Grid>

                  {requiredMark && (
                    <>
                      <Grid item xs={12} md={4}>
                        <TextField
                          value={values.totalMarks || ""}
                          name="totalMarks"
                          label="Total Marks"
                          type="number"
                          fullWidth
                          required
                          InputLabelProps={{
                            sx: !values.totalMarks ? blurredLabelStyle : {},
                          }}
                          variant="outlined"
                          onChange={(e: { target: { value: string } }) =>
                            handleNumericFieldChange(
                              "totalMarks",
                              e,
                              setFieldValue,
                            )
                          }
                          error={requiredMark && Boolean(errors.totalMarks)}
                          helperText={requiredMark && errors.totalMarks}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          value={values.passMarks || ""}
                          name="passMarks"
                          label="Pass Marks"
                          fullWidth
                          variant="outlined"
                          type="number"
                          onChange={(e: { target: any }) =>
                            handleNumericFieldChange(
                              "passMarks",
                              e,
                              setFieldValue,
                            )
                          }
                          InputLabelProps={{
                            sx: !values.passMarks ? blurredLabelStyle : {},
                          }}
                          error={Boolean(errors.passMarks)}
                          helperText={touched.passMarks && errors.passMarks}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel
                            id="result-display-mode-label"
                            sx={
                              !values.resultDisplayMode ? blurredLabelStyle : {}
                            }
                          >
                            Result Display Mode
                          </InputLabel>
                          <Field
                            value={values.resultDisplayMode || ""}
                            as={Select}
                            name="resultDisplayMode"
                            labelId="result-display-mode-label"
                            label="Result Display Mode"
                            error={Boolean(errors.resultDisplayMode)}
                          >
                            {Object.values(ResultDisplayMode).map((mode) => (
                              <MenuItem key={mode} value={mode}>
                                {mode}
                              </MenuItem>
                            ))}
                          </Field>
                          <FormHelperText sx={{ color: "#ff413a" }}>
                            {errors.resultDisplayMode}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      InputLabelProps={{
                        sx: !values.description ? blurredLabelStyle : {},
                      }}
                      name="description"
                      label="Description"
                      fullWidth
                      multiline
                      variant="outlined"
                      value={values.description || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.description && touched.description)}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Form>
          )}
        </Formik>
      </BlankCard>
    </ParentCard>
  );
};

export default EditTestForm;
