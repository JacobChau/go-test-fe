import styled from 'styled-components';
import {FC, useRef, useCallback, useMemo} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import { useTheme } from '@mui/material/styles';
import 'react-quill/dist/quill.snow.css';
import UploadService from "@/api/services/uploadService.ts";
import './Quill.css';
import { Paper } from '@mui/material';
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
    const borderColor = theme.palette.divider;
    const reactQuillRef = useRef<ReactQuill>(null);


    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const files = input.files;
            if (files) {
                const file = files[0];
                resizeImage(file, maxHeight, (resizedFile) => {
                    const quill = reactQuillRef.current;
                    if (quill) {
                        UploadService.uploadImage(resizedFile).then(data => {
                            const editor = quill.getEditor();
                            const range = editor.getSelection(true);
                            const position = range ? range.index : 0;
                            editor.insertEmbed(position, 'image', data.url);

                        }).catch(err => {
                            console.log(err);
                        });
                    }
                });
            }
        };
    }, []);

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
                        const data = await UploadService.uploadImage(resizedFile);
                        const editor = quill.getEditor();
                        const range = editor.getSelection(true);
                        const position = range ? range.index : 0;
                        editor.insertEmbed(position, 'image', data.url);
                    });
                }

            }
        }
    }), [imageHandler]);


    return (
        <Paper
          sx={{ border: `1px solid ${borderColor}` }}
          variant="outlined"
        >
          <StyledReactQuill
                ref={reactQuillRef}
                minHeight={minHeight}
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder}
                theme={"snow"}
          />
        </Paper>
  );
};

export default QuillEditor;
