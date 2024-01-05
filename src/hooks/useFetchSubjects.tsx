import {useEffect, useState} from "react"
import {CategoryAttributes, Resource} from "@/types/apis";
import SubjectService from "@/api/services/subjectService.ts";

const useFetchSubjects = () => {
    const [subjects, setSubjects] = useState<Resource<CategoryAttributes>[]>([]);


    const fetchSubjects = async () => {
        const response = await SubjectService.getSubjects();
        return response.data;
    }

    useEffect(() => {
        fetchSubjects().then((data) => setSubjects(data)).catch((err) => console.log(err));
    }, []);
    
    return {subjects};
}

export default useFetchSubjects;