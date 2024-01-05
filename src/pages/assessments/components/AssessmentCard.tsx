import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Chip
} from '@mui/material';
import {AssessmentAttributes} from "@/types/apis/assessmentTypes.ts";
import {Identity} from "@/types/apis";

interface AssessmentCardProps {
    assessment: AssessmentAttributes & Identity;
    onSelect: (assessmentId: number) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onSelect }) => {
    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardActionArea onClick={() => onSelect(assessment.id)}>
                <CardMedia
                    component="img"
                    height="140"
                    image={assessment.thumbnail || 'default-thumbnail.jpg'} // Replace with a placeholder if thumbnail is null
                    alt={assessment.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {assessment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {assessment.description}
                    </Typography>
                    <Typography variant="body2">
                        Total Questions: {assessment.totalQuestions}
                    </Typography>
                    {assessment.isPublished ? (
                        <Chip label="Published" color="success" size="small" />
                    ) : (
                        <Chip label="Unpublished" color="warning" size="small" />
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default AssessmentCard;
