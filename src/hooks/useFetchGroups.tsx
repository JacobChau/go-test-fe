import { useState, useEffect } from 'react';
import {Resource} from "@/types/apis";
import groupService from "@/api/services/groupService.ts";
import {GroupAttributes} from "@/types/apis/groupTypes.ts";

const useFetchGroups = () => {
    const [groups, setGroups] = useState<Resource<GroupAttributes>[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const groupsData = await groupService.getGroups();
            setGroups(groupsData.data);
        };
        fetchData().catch((error) => {
            console.error('Error fetching Groups', error);
        });
    }, []);

    groups.forEach((Group) => {
        Group.id = Number(Group.id);
    });

    return { groups };
};

export default useFetchGroups;
