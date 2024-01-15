import parse from "html-react-parser";
import { TableColumn } from "@components/PaginationTable/GenericTable.tsx";
import { QuestionType } from "@/constants/question.ts";
import { QuestionAttributes } from "@/types/apis";
import { Box } from "@mui/material";

const QuestionColumns: TableColumn[] = [
  {
    label: "ID",
    key: "id",
    type: "text",
    canEdit: false,
    canSearch: false,
    sx: { width: "5%", padding: "0px 10px" },
  },
  {
    label: "Question Details",
    key: "content",
    type: "text",
    canEdit: true,
    canSearch: true,
    sx: { width: "70%", padding: "0px 10px" },
    render: (value: QuestionAttributes) => {
      const replaceImageTag = (content: string) => {
        const imgRegex = /<img\s+([^>]*)src="([^"]+)"([^>]*)>/g;
        return content.replace(imgRegex, (_match, prefix, src, suffix) => {
          return `<img ${prefix}src="${src}" style="max-width:100%;height:auto;" ${suffix} alt="Question Image"/>`;
        });
      };

      if (value.content.includes("<img")) {
        const contentWithResizedImages = replaceImageTag(value.content);

        return <Box>{parse(contentWithResizedImages)}</Box>;
      }

      return <Box>{parse(value.content)}</Box>;
    },
  },
  {
    label: "Type",
    key: "type",
    type: "text",
    canEdit: true,
    sx: { width: "15%", padding: "0px 10px" },
    canSearch: true,
    render: (value: QuestionAttributes) => {
      return <span>{QuestionType[value.type]}</span>;
    },
  },
  {
    label: "Category",
    key: "category",
    type: "text",
    canEdit: true,
    sx: { width: "20%", padding: "0px 10px" },
    canSearch: true,
  },
];

export default QuestionColumns;
