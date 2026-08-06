import type { ImgHTMLAttributes } from 'react';

export function Image(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} />;
}
