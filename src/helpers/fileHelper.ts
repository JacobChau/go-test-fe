import pica from 'pica';

type ResizeCallback = (file: File) => void;

export function resizeImage(file: File, maxHeight: number, callback: ResizeCallback) {
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = async () => {
            if (img.height <= maxHeight) {
                callback(file);
                return;
            }

            const canvas = document.createElement('canvas');
            const picaResizer = pica();

            const ratio = maxHeight / img.height;
            canvas.width = img.width * ratio;
            canvas.height = maxHeight;

            await picaResizer.resize(img, canvas);

            canvas.toBlob(blob => {
                if (blob) {
                    callback(new File([blob], file.name, {type: 'image/jpeg', lastModified: Date.now()}));
                }
            }, file.type, 1);
        };
        img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
}

export const extractImagesUrl = (content: string) => {
    let images = [];
    let imgRegex = /<img.*?src="(.*?)"/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        images.push(match[1]);
    }
    return images;
};