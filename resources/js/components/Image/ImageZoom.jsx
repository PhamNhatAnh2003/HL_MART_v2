import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './Image.module.scss';
import images from '~/assets/images';

const cx = classNames.bind(styles);

const ImageZoom = forwardRef(
    ({ src, alt, width = '100%', height = ' 100%', className, fallback = images.noImage, ...props }, ref) => {
        const [currentFallback, setCurrentFallback] = useState('');
        const [transformOrigin, setTransformOrigin] = useState('center center');

        const handleError = () => {
            setCurrentFallback(fallback);
        };

        const handleZoom = (e) => {
            const { left, top, width, height } = e.target.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setTransformOrigin(`${x}% ${y}%`);
        };

        return (
            <div className={cx('image-zoom')}>
                <img
                    className={cx('image', { [className]: className })}
                    ref={ref}
                    src={currentFallback || src}
                    alt={alt}
                    width={width}
                    height={height}
                    {...props}
                    onError={handleError}
                    onMouseMove={handleZoom}
                    style={{ transformOrigin: transformOrigin }}
                />
            </div>
        );
    },
);

ImageZoom.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    classname: PropTypes.string,
    fallback: PropTypes.string,
};

export default ImageZoom;
