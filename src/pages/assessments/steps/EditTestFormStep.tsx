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
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Resource, SubjectAttributes } from "@/types/apis";
import { CreateAssessmentFormValues } from "@/pages/assessments/CreateOrUpdateAssessment.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import BlankCard from "@components/Card/BlankCard.tsx";

export interface EditTestFormProps {
  editMode: boolean;
  values: CreateAssessmentFormValues;
  onSubmit: (values: any) => void;
  formikRef: React.RefObject<FormikProps<any>>;
  subjects: Resource<SubjectAttributes>[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  subject: Yup.number().required("Subject is required"),
  totalMarks: Yup.number()
    .min(0, "Total Marks must be a positive number")
    .max(1000, "Total Marks cannot be more than 1000")
    .required("Total Marks is required"),
  passMarks: Yup.number()
    .min(0, "Pass Marks must be 0 or a positive number")
    // less than or equal to total marks
    .max(Yup.ref("totalMarks"), "Pass Marks cannot be more than Total Marks")
    .nullable(),
  maxAttempts: Yup.number()
    .positive("Max Attempts must be a positive number")
    .max(1000, "Max Attempts cannot be more than 1000")
    .nullable(),
  duration: Yup.number()
    .min(0, "Duration must be 0 or a positive number")
    .max(999, "Duration cannot be more than 999 minutes")
    .nullable(),
  description: Yup.string().nullable(),
  thumbnail: Yup.mixed().nullable(),
});

const EditTestForm: React.FC<EditTestFormProps> = ({
  editMode,
  subjects,
  values,
  onSubmit,
  formikRef,
}) => {
  const initialValues: CreateAssessmentFormValues = values;

  const handleFormSubmit = (
    values: CreateAssessmentFormValues,
    actions: FormikHelpers<CreateAssessmentFormValues>,
  ) => {
    onSubmit(values);
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
        : Math.max(0, Math.min(1000, Number(e.target.value))); // Use empty string instead of null
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
              <Paper elevation={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Name"
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel id="subject-label">Select Subject</InputLabel>
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="totalMarks"
                      label="Total Marks"
                      type="number"
                      fullWidth
                      required
                      variant="outlined"
                      onChange={(e: { target: { value: string } }) =>
                        handleNumericFieldChange("totalMarks", e, setFieldValue)
                      }
                      error={Boolean(errors.totalMarks && touched.totalMarks)}
                      helperText={touched.totalMarks && errors.totalMarks}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="passMarks"
                      label="Pass Marks"
                      fullWidth
                      variant="outlined"
                      type="number"
                      onChange={(e: { target: any }) =>
                        handleNumericFieldChange("passMarks", e, setFieldValue)
                      }
                      error={Boolean(errors.passMarks && touched.passMarks)}
                      helperText={touched.passMarks && errors.passMarks}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item flexGrow={1}>
                        <Field
                          as={TextField}
                          name="duration"
                          label="Duration (In Min.)"
                          type="number"
                          fullWidth
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
                          error={Boolean(errors.duration && touched.duration)}
                          helperText={touched.duration && errors.duration}
                        />
                      </Grid>
                      <Grid item>
                        <label htmlFor="duration">
                          <Tooltip title="Setting duration to 0 will indicate that the test has no time limit.">
                            <IconButton size="small">
                              <InfoIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </label>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item flexGrow={1}>
                        <Field
                          as={TextField}
                          type="number"
                          name="maxAttempts"
                          label="Max Attempts"
                          fullWidth
                          variant="outlined"
                          onChange={async (e: { target: { value: any } }) => {
                            let value = e.target.value;
                            if (value === "") {
                              await setFieldValue("maxAttempts", null);
                            } else {
                              value = Math.max(0, Math.min(10, Number(value)));
                              await setFieldValue("maxAttempts", value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <label htmlFor="maxAttempts">
                          <Tooltip title="Setting max attempts to 0 will indicate that the test has no attempt limit.">
                            <IconButton size="small">
                              <InfoIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </label>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={values.description || ""}
                      name="description"
                      label="Description"
                      fullWidth
                      multiline
                      variant="outlined"
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
