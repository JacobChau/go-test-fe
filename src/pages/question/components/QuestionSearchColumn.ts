import {SearchColumn} from "@components/Search/SearchComponent.tsx";

const QuestionSearchColumn: SearchColumn[] = [
    { key: 'content', label: 'Question Details' },
    { key: 'category.name', label: 'Category' },
];

export default QuestionSearchColumn;
