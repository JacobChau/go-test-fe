import React, { useCallback, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  AlertColor,
} from "@mui/material";
import {
  AssessmentQuestionAttributes,
  Identity,
  Resource,
  SubjectAttributes,
} from "@/types/apis";
import {
  AddQuestion,
  AssignTest,
  EditTestForm,
  PublishTest,
  QuestionSetting,
} from "@/pages/assessments/steps";
import { FormikProps } from "formik";
import dayjs, { Dayjs } from "dayjs";
import ConfirmationDialog from "@components/Dialog/ConfirmationDialog.tsx";
import {
  AssessmentDetailPayload,
  CreateAssessmentParams,
} from "@/types/apis/assessmentTypes.ts";
import AssessmentService from "@/api/services/assessmentService.ts";
import { useNavigate, useParams } from "react-router-dom";
import SubjectService from "@/api/services/subjectService.ts";
import { getKeyByValue } from "@/helpers";
import { ResultDisplayMode } from "@/constants/resultDisplayMode.ts";

const steps = [
  "Create Test",
  "Add Question",
  "Question Setting",
  "Publish Test",
  "Assign Test",
];

export interface CreateAssessmentFormValues {
  name: string;
  subject?: string;
  description?: string;
  duration?: number;
  totalMarks?: number;
  passMarks?: number;
  maxAttempts?: number;
  thumbnail?: string | null;
  requiredMark: boolean;
  resultDisplayMode?: string;
}

export interface PublishAssessmentFormValues {
  validFrom: Dayjs | null;
  validTo: Dayjs | null;
  isPublished: boolean;
}

export interface SnackBarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const CreateOrUpdateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [selectedQuestions, setSelectedQuestions] = useState(
    new Map<number, AssessmentQuestionAttributes & Identity>(),
  );
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(
    new Set<number>(),
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [subjects, setSubjects] = useState<Resource<SubjectAttributes>[]>([]);
  const [snackbar, setSnackbar] = useState<SnackBarState>({
    open: false,
    message: "",
    severity: "warning",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<CreateAssessmentFormValues>({
    name: "",
    subject: "",
    description: "",
    duration: 0,
    requiredMark: true,
  });

  const [publishData, setPublishData] = useState<PublishAssessmentFormValues>({
    validFrom: dayjs(),
    validTo: dayjs().add(1, "day"),
    isPublished: false,
  });

  const [activeStep, setActiveStep] = useState(0);
  const formikRef = React.useRef<FormikProps<any>>(null);
  const [requiredMark, setRequiredMark] = useState<boolean>(true);
  const [durationEnabled, setDurationEnabled] = useState<boolean>(true);
  const [maxAttemptsEnabled, setMaxAttemptsEnabled] = useState<boolean>(true);

  const resetState = useCallback(() => {
    setSelectedQuestions(
      new Map<number, AssessmentQuestionAttributes & Identity>(),
    );
    setSelectedGroups(new Set<number>());
    setFormData({
      name: "",
      subject: "",
      description: "",
      duration: 0,
      requiredMark,
    });
    setPublishData({
      validFrom: dayjs(),
      validTo: dayjs().add(1, "day"),
      isPublished: false,
    });
    setActiveStep(0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (isEditMode) {
          const promises: Promise<any>[] = [
            SubjectService.getSubjects(),
            AssessmentService.getAssessmentById(id, {
              include: "questions",
            }),
          ];

          const [subjects, assessment] = await Promise.all(promises);
          const subjectData: Resource<SubjectAttributes>[] = subjects.data;
          setSubjects(subjectData);

          const assessmentData: Resource<AssessmentDetailPayload> =
            assessment.data;

          const selectedQuestionsMap = new Map<
            number,
            AssessmentQuestionAttributes & Identity
          >();
          assessmentData.attributes.questions.forEach(
            (q: AssessmentQuestionAttributes & Identity) => {
              if (typeof q.id === "number") {
                selectedQuestionsMap.set(q.id, q);
              }
            },
          );
          setSelectedQuestions(selectedQuestionsMap);
          setSelectedGroups(
            new Set<number>(
              assessmentData.attributes.groupIds?.map((g) => Number(g)) || [],
            ),
          );
          setFormData({
            name: assessmentData.attributes.name,
            subject: assessmentData.attributes.subject.id.toString(),
            description: assessmentData.attributes.description,
            duration: assessmentData.attributes.duration,
            totalMarks: assessmentData.attributes.totalMarks,
            passMarks: assessmentData.attributes.passMarks,
            maxAttempts: assessmentData.attributes.maxAttempts,
            requiredMark: assessmentData.attributes.requiredMark,
            resultDisplayMode:
              ResultDisplayMode[assessmentData.attributes.resultDisplayMode],
          });
          setPublishData({
            validFrom: dayjs(assessmentData.attributes.validFrom),
            validTo: dayjs(assessmentData.attributes.validTo),
            isPublished: assessmentData.attributes.isPublished,
          });

          setDurationEnabled(
            assessmentData.attributes.duration !== null &&
              assessmentData.attributes.duration !== undefined,
          );
          setMaxAttemptsEnabled(
            assessmentData.attributes.maxAttempts !== null &&
              assessmentData.attributes.maxAttempts !== undefined,
          );

          setRequiredMark(Boolean(assessmentData.attributes.requiredMark));
        } else {
          resetState();
          const subjects = await SubjectService.getSubjects();
          const subjectData: Resource<SubjectAttributes>[] = subjects.data;
          setSubjects(subjectData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch((error) => {
      console.error("Error fetching subjects", error);
    });
  }, [id, isEditMode]);

  if (isLoading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const handleNext = () => {
    const tolerance = 0.01;
    const floatEqual = (a: number, b: number, tolerance: number) => {
      return Math.abs(a - b) < tolerance;
    };

    switch (activeStep) {
      case 0:
        formikRef.current && formikRef.current.submitForm();
        break;
      case 1:
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        break;
      case 2:
        if (requiredMark && formData.totalMarks) {
          // Logic when requiredMark is true
          const sumOfMarks = Array.from(selectedQuestions.values()).reduce(
            (acc, q) => acc + parseFloat((q.marks || 0).toFixed(2)),
            0,
          );
          if (!floatEqual(formData.totalMarks, sumOfMarks, tolerance)) {
            setSnackbar({
              open: true,
              message: `Total marks do not match. Expected: ${formData.totalMarks}, but found: ${sumOfMarks}. Please modify accordingly.`,
              severity: "error",
            });
            return;
          }
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        break;
      case 3:
        formikRef.current && formikRef.current.submitForm();
        break;
      case 4:
        if (selectedGroups && selectedGroups.size > 0) {
          setSelectedGroups(selectedGroups);
        }
        setOpenDialog(true);
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormSubmit = (values: CreateAssessmentFormValues) => {
    setFormData(values);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinish = async () => {
    setOpenDialog(false);

    const assessmentPayload: CreateAssessmentParams = {
      name: formData.name,
      subjectId: Number(formData.subject),
      description: formData.description,
      duration: formData.duration,
      passMarks: formData.passMarks,
      totalMarks: formData.totalMarks,
      maxAttempts: formData.maxAttempts,
      validFrom: publishData.validFrom?.toDate(),
      validTo: publishData.validTo?.toDate(),
      isPublished: publishData.isPublished,
      questions: Array.from(selectedQuestions.values()).map((q, index) => ({
        id: Number(q.id),
        marks: q.marks,
        order: q.order || index,
      })),
      groupIds: Array.from(selectedGroups).map((g) => Number(g)),
      requiredMark: formData.requiredMark,
      resultDisplayMode: formData.resultDisplayMode
        ? getKeyByValue(ResultDisplayMode, formData.resultDisplayMode)
        : undefined,
    };

    console.log(assessmentPayload);

    if (isEditMode) {
      await AssessmentService.updateAssessment(id, assessmentPayload);
      setSnackbar({
        open: true,
        message: "Test updated successfully.",
        severity: "success",
      });
    } else {
      await AssessmentService.createAssessment(assessmentPayload);
      setSnackbar({
        open: true,
        message: "Test created successfully.",
        severity: "success",
      });
    }

    setTimeout(() => {
      navigate("/tests/management");
    }, 1500);
  };

  console.log("formData", formData);
  const handlePublishFormSubmit = (values: PublishAssessmentFormValues) => {
    if (formData.duration && values.validFrom && values.validTo) {
      const diff = values.validTo.diff(values.validFrom, "minute");
      if (diff < formData.duration) {
        setSnackbar({
          open: true,
          message: `Test has duration of ${formData.duration} minutes, but the difference between start and end date is ${diff} minutes. Please modify accordingly.`,
          severity: "error",
        });
        return;
      }
    }
    setPublishData(values);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <EditTestForm
            editMode={isEditMode}
            requiredMark={requiredMark}
            setRequiredMark={setRequiredMark}
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            values={formData}
            subjects={subjects}
            durationEnabled={durationEnabled}
            setDurationEnabled={setDurationEnabled}
            maxAttemptsEnabled={maxAttemptsEnabled}
            setMaxAttemptsEnabled={setMaxAttemptsEnabled}
          />
        );
      case 1:
        return (
          <AddQuestion
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
          />
        );
      case 2:
        return (
          <QuestionSetting
            questions={selectedQuestions}
            setQuestions={setSelectedQuestions}
            requiredMark={requiredMark}
            totalMarks={formData.totalMarks}
          />
        );
      case 3:
        return (
          <PublishTest
            onSubmit={handlePublishFormSubmit}
            formikRef={formikRef}
            values={publishData}
          />
        );
      case 4:
        return (
          <AssignTest
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
          />
        );
      default:
        return "Unknown step";
    }
  };

  // @ts-ignore
  return (
    <Container maxWidth="xl">
      <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 4, pb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mb: 2 }}>
        {getStepContent(activeStep)}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            variant="contained"
            onClick={() => handleNext()}
            sx={{ mr: 1 }}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>

      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleFinish}
        message={`Are you sure you want to ${
          isEditMode ? "update" : "create"
        } this test?`}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateOrUpdateAssessment;
