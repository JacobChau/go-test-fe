import React, { useState, useEffect } from 'react';
import dayjs from "dayjs";
import {useTheme} from "@mui/material/styles";
import {Modal, Box, Typography, Button, useMediaQuery, Tooltip} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {AssessmentDetailPayload} from "@/types/apis/assessmentTypes.ts";
import AssessmentService from '@/api/services/assessmentService';
import {Resource} from "@/types/apis";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreIcon from '@mui/icons-material/Score';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: { xs: '90%', sm: '70%', md: '60%', lg: '50%' }, // Responsive width
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto' as const, // Scrollable if content is too long
};

interface AssessmentDetailModalProps {
    assessmentId: number;
    open: boolean;
    onClose: () => void;
    onSelect: (assessmentId: number) => void;
}

const AssessmentDetailModal: React.FC<AssessmentDetailModalProps> = ({ assessmentId, open, onClose, onSelect }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [assessmentDetails, setAssessmentDetails] = useState<Resource<AssessmentDetailPayload> | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(true);
            // Call the API to fetch the details for the assessment
            AssessmentService.getAssessmentById(assessmentId)
                .then(response => {
                    setAssessmentDetails(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the assessment details:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [assessmentId, open]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="assessment-detail-modal"
            aria-describedby="assessment-detail-modal-description"
            closeAfterTransition
        >
            <Box sx={{
                ...style,
                ...(fullScreen && { width: 'auto', maxWidth: '90%', height: 'auto', maxHeight: '90%' }), // Adjust for smaller screens
                animation: loading ? 'none' : 'grow 1s infinite',
            }}>
                {loading ? (
                    <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                ) : (
                    assessmentDetails && (
                        <>
                            <Box
                                sx={{
                                    height: 140,
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    background: `url(${assessmentDetails.attributes.thumbnail || 'default-thumbnail.jpg'}) center / cover no-repeat`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography id="assessment-detail-modal-title" variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
                                    {assessmentDetails.attributes.name}
                                </Typography>
                            </Box>
                            <Tooltip title={assessmentDetails.attributes.description || ''} placement="top-start">
                                <Typography id="assessment-detail-modal-description" sx={{ mt: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {assessmentDetails.attributes.description}
                                </Typography>
                            </Tooltip>
                            <Box display="flex" alignItems="center" mt={2}>
                                <QuestionMarkIcon color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Total Questions: {assessmentDetails.attributes.totalQuestions}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mt={2}>
                                <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Duration: {assessmentDetails.attributes.duration} minutes
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mt={2}>
                                <ScoreIcon color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Total Marks: {assessmentDetails.attributes.totalMarks}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mt={2}>
                                <EventAvailableIcon color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    {/*use dayjs to format*/}
                                    Valid From: {dayjs(assessmentDetails.attributes.validFrom).format('DD/MM/YYYY')}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mt={2}>
                                <EventAvailableIcon color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    Valid To: {dayjs(assessmentDetails.attributes.validTo).format('DD/MM/YYYY')}
                                </Typography>
                            </Box>
                            <Button
                                sx={{ mt: 2, width: '100%' }}
                                variant="contained"
                                color="primary"
                                onClick={() => onSelect(assessmentId)}
                            >
                                Take Assessment
                            </Button>
                        </>
                    )
                )}
            </Box>
        </Modal>
    );
};

export default AssessmentDetailModal;