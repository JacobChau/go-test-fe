import PageContainer from "@components/Container/PageContainer.tsx";
import ParentCard from "@components/Card/ParentCard.tsx";
import { CreateOrUpdateQuestion } from "@/pages/question/components";
import { useParams } from "react-router-dom";

const CreateOrUpdateQuestionPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  return (
    <PageContainer
      title={isEditMode ? "Edit Question" : "Create Question"}
      description={
        "This is the page to" +
        (isEditMode ? " edit" : " create") +
        " a question"
      }
    >
      <ParentCard title={isEditMode ? "Edit Question" : "Create Question"}>
        <CreateOrUpdateQuestion id={id} />
      </ParentCard>
    </PageContainer>
  );
};

export default CreateOrUpdateQuestionPage;
