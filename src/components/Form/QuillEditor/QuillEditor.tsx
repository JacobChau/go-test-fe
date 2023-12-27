import styled from 'styled-components';
import {FC, useRef, useCallback, useMemo, useState} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import { useTheme } from '@mui/material/styles';
import 'react-quill/dist/quill.snow.css';
import UploadService from "@/api/services/uploadService.ts";
import './Quill.css';
import {Box, CircularProgress, Paper} from '@mui/material';
import ImageDropAndPaste from 'quill-image-drop-and-paste';
import {resizeImage} from "@/helpers/fileHelper.ts";

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDropAndPaste', ImageDropAndPaste);

interface StyledReactQuillProps {
    minHeight: number;
}

const StyledReactQuill = styled(ReactQuill)<StyledReactQuillProps>`
    .ql-container {
        border: none;
        overflow: auto;
    }
    .ql-editor {
        min-height: ${(props) => props.minHeight}em;

        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto; /* Center align the image */
        }
    }
`;

export interface QuillEditorProps {
    value: string;
    onChange: any;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
}

const QuillEditor: FC<QuillEditorProps> = ({value, onChange, placeholder, minHeight, maxHeight = 500}) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const borderColor = theme.palette.divider;
    const reactQuillRef = useRef<ReactQuill>(null);

    const handleChange = (content: string) => {
        // Check if the content is Quill's default empty state and replace it with an empty string
        const isEmpty = content === '<p><br></p>';
        onChange(isEmpty ? '' : content);
    };

    const insertImage = (quill: any, url: string, name: string) => {
        const editor = quill.getEditor();
        const range = editor.getSelection(true);
        const position = range ? range.index : 0;
        editor.insertEmbed(position, 'image', url);
        const img = document.querySelector('img[src="' + url + '"]');
        if (img) {
            img.setAttribute('alt', name);
        }
    }


    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const files = input.files;
            if (files) {
                const file = files[0];

                const quill = reactQuillRef.current;

                if (quill) {
                    resizeImage(file, maxHeight, (resizedFile) => {
                        setLoading(true);
                        UploadService.uploadImage(resizedFile).then(data => {
                            insertImage(quill, data.url, resizedFile.name);
                        }).catch(err => {
                            console.log(err);
                        }).finally(() => {
                            setLoading(false);
                        })
                    });
                }
            }
        };
    }, [maxHeight]);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{header: [1, 2, false]}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{list: 'ordered'}, {list: 'bullet'}],
                ['link', 'image'],
                ['clean'],
                ['code-block'],
            ],
            handlers: {
                image: imageHandler,
            },
        },
        clipboard: {
            matchVisual: false,
        },
        imageResize: {
            parchment: Quill.import('parchment'),
        },
        imageDropAndPaste: {
            handler: async (_data: any, _type: any, imageData: { toFile: () => File; }) => {
                const quill = reactQuillRef.current;

                if (quill) {
                    resizeImage(imageData.toFile(), maxHeight, async (resizedFile) => {
                        setLoading(true);
                        UploadService.uploadImage(resizedFile).then(data => {
                            insertImage(quill, data.url, resizedFile.name);
                        }).catch(err => {
                            console.log(err);
                        }).finally(() => {
                            setLoading(false);
                        })
                    });
                }
            }
        }
    }), [imageHandler, maxHeight]);


    return (
        <Paper
          sx={{ border: `1px solid ${borderColor}`, position: 'relative' }}
          variant="outlined"
        >
            <StyledReactQuill
                ref={reactQuillRef}
                minHeight={minHeight}
                value={value}
                onChange={handleChange}
                modules={modules}
                placeholder={placeholder}
                theme={"snow"}
            />

            {loading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent overlay
                }}>
                    <CircularProgress />
                    <Box sx={{ ml: 1 }}>Uploading...</Box>
                </Box>
            )}

        </Paper>
  );
};

export default QuillEditor;
